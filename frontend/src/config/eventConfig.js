export const eventConfig = {
  name: "TRIFUSION'26",
  tagline: "Where Three Domains Fuse Into One Innovation.",
  description: "A 24-hour offline inter-collegiate hackathon jointly organized by the Departments of ECE, EEE and BME. Transform real-world problem statements into innovative, practical and technology-driven solutions.",
  dates: {
    start: "2026-09-08T09:00:00",
    end: "2026-09-09T10:30:00",
    registrationDeadline: "2026-09-05T23:59:59",
  },
  contact: {
    email: "svhectrifusion2026@gmail.com",
    location: "Shree Venkateshwara Hi-Tech Engineering College (Autonomous), Othakuthirai, Gobichettipalayam, Erode District, Tamil Nadu, India",
  },
  facultyCoordinators: [
    { name: "Mrs. G. Revathi", dept: "AP/ECE", phone: "7812826937" },
    { name: "K. C. Anandhan", dept: "AP/EEE (Sr.G)", phone: "9787468182" },
    { name: "K. Boopathi", dept: "AP/BME", phone: "9597616173" },
  ],
  studentCoordinators: [
    { name: "Ashik T S", dept: "III/ECE", phone: "9489553313" },
    { name: "Balaji J", dept: "III/ECE", phone: "9629001885" },
    { name: "Naveen P", dept: "III/ECE", phone: "9361052674" },
    { name: "Balamuthaiyan M", dept: "III/ECE", phone: "7094681907" },
  ],
  themes: [
    { id: 1, dept: 'ECE', title: 'Intelligent Communication & Embedded Systems', description: 'Intelligent communication systems, embedded technologies, real-time systems and smart connected devices.' },
    { id: 2, dept: 'ECE', title: 'IoT, Automation & Edge Intelligence', description: 'IoT systems, industrial automation, edge computing, intelligent monitoring and autonomous systems.' },
    { id: 3, dept: 'EEE', title: 'Smart Energy & Power Systems', description: 'Energy monitoring, optimization, smart grids, renewable energy integration and intelligent power systems.' },
    { id: 4, dept: 'EEE', title: 'Electric Mobility & Intelligent Power Management', description: 'Electric vehicles, battery management, charging systems, intelligent mobility and power optimization.' },
    { id: 5, dept: 'BME', title: 'Digital Healthcare & Biomedical Innovation', description: 'Digital healthcare, biomedical systems, patient monitoring, healthcare automation and medical technology.' },
    { id: 6, dept: 'BME', title: 'Assistive Technology & Patient Safety', description: 'Assistive devices, accessibility, patient safety, elderly care, emergency monitoring and human-centric innovation.' },
  ],
  registration: {
    fee: "1,600",
    feeNum: 1600,
    teamSize: "2–4",
    minTeam: 2,
    maxTeam: 4,
  },
  accommodation: {
    fee: "220",
    feeNum: 220,
    includes: ["Overnight accommodation", "Dinner", "Next morning breakfast"],
  },
  prizes: {
    first: { amount: "10,000", label: "First Prize" },
    second: { amount: "8,000", label: "Second Prize" },
    third: { amount: "6,000", label: "Third Prize" },
  },
  payment: {
    upiId: "jbalajinadar8@okaxis",
    accountName: "BALAJI NADAR",
    amount: "1600",
    qrUrl: "/assets/payment-qr.png"
  }
};
