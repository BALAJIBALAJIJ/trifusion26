package com.trifusion.service;

import com.opencsv.CSVWriter;
import com.trifusion.model.Payment;
import com.trifusion.model.Registration;
import com.trifusion.model.TeamMember;
import com.trifusion.repository.PaymentRepository;
import com.trifusion.repository.RegistrationRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    private final RegistrationRepository registrationRepository;
    private final PaymentRepository paymentRepository;
    
    private static final String[] HEADERS = {
        "Team Name", "Track", "College", 
        "Leader Name", "Leader Email", "Leader Phone", "Leader Dept", "Leader Year", "Leader Roll", "Leader Gender",
        "Member 2 Name", "Member 2 Email", "Member 2 Phone", "Member 2 Dept", "Member 2 Year", "Member 2 Roll", "Member 2 Gender",
        "Member 3 Name", "Member 3 Email", "Member 3 Phone", "Member 3 Dept", "Member 3 Year", "Member 3 Roll", "Member 3 Gender",
        "Member 4 Name", "Member 4 Email", "Member 4 Phone", "Member 4 Dept", "Member 4 Year", "Member 4 Roll", "Member 4 Gender",
        "Member 5 Name", "Member 5 Email", "Member 5 Phone", "Member 5 Dept", "Member 5 Year", "Member 5 Roll", "Member 5 Gender",
        "Payment Amount", "UTR", "Payment Status", "Registration Status", "Registration Date", "Payment Date"
    };

    public ExportService(RegistrationRepository registrationRepository, PaymentRepository paymentRepository) {
        this.registrationRepository = registrationRepository;
        this.paymentRepository = paymentRepository;
    }

    public byte[] exportToExcel() throws IOException {
        List<Registration> registrations = registrationRepository.findAll();
        
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Registrations");
            
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                headerRow.createCell(i).setCellValue(HEADERS[i]);
            }
            
            int rowIdx = 1;
            for (Registration reg : registrations) {
                Row row = sheet.createRow(rowIdx++);
                fillRowData(row, reg);
            }
            
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportToCsv() throws IOException {
        List<Registration> registrations = registrationRepository.findAll();
        
        try (StringWriter sw = new StringWriter(); CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(HEADERS);
            
            for (Registration reg : registrations) {
                writer.writeNext(getRowDataArray(reg));
            }
            
            return sw.toString().getBytes();
        }
    }
    
    private void fillRowData(Row row, Registration reg) {
        String[] data = getRowDataArray(reg);
        for (int i = 0; i < data.length; i++) {
            row.createCell(i).setCellValue(data[i]);
        }
    }
    
    private String[] getRowDataArray(Registration reg) {
        String[] data = new String[HEADERS.length];
        
        Payment payment = paymentRepository.findByRegistrationId(reg.getId()).orElse(null);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        data[0] = reg.getTeamName();
        data[1] = reg.getTrack();
        data[2] = reg.getCollegeName();
        
        TeamMember leader = reg.getLeader();
        if (leader != null) {
            data[3] = leader.getFullName();
            data[4] = leader.getEmail();
            data[5] = leader.getPhone();
            data[6] = leader.getDepartment();
            data[7] = leader.getYearOfStudy();
            data[8] = leader.getRollNumber();
            data[9] = leader.getGender();
        }
        
        List<TeamMember> members = reg.getMembers();
        int baseIdx = 10;
        if (members != null) {
            for (int i = 0; i < 4; i++) {
                if (i < members.size()) {
                    TeamMember m = members.get(i);
                    data[baseIdx + (i*7)] = m.getFullName();
                    data[baseIdx + (i*7) + 1] = m.getEmail();
                    data[baseIdx + (i*7) + 2] = m.getPhone();
                    data[baseIdx + (i*7) + 3] = m.getDepartment();
                    data[baseIdx + (i*7) + 4] = m.getYearOfStudy();
                    data[baseIdx + (i*7) + 5] = m.getRollNumber();
                    data[baseIdx + (i*7) + 6] = m.getGender();
                } else {
                    for (int j = 0; j < 7; j++) {
                        data[baseIdx + (i*7) + j] = "";
                    }
                }
            }
        }
        
        if (payment != null) {
            data[38] = payment.getAmount() != null ? String.valueOf(payment.getAmount()) : "";
            data[39] = payment.getUtrNumber() != null ? payment.getUtrNumber() : "";
            data[40] = payment.getStatus() != null ? payment.getStatus().name() : "";
            data[43] = payment.getSubmittedAt() != null ? payment.getSubmittedAt().format(formatter) : "";
        } else {
            data[38] = ""; data[39] = ""; data[40] = "NO_PAYMENT"; data[43] = "";
        }
        
        data[41] = reg.getStatus() != null ? reg.getStatus().name() : "";
        data[42] = reg.getCreatedAt() != null ? reg.getCreatedAt().format(formatter) : "";
        
        return data;
    }
}
