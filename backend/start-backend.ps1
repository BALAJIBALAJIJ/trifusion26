if (-not (Test-Path ".\apache-maven-3.9.6")) {
    Write-Host "Downloading Maven (this might take 1-2 minutes)..."
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile "maven.zip"
    Write-Host "Extracting Maven..."
    Expand-Archive -Path "maven.zip" -DestinationPath "." -Force
    Remove-Item "maven.zip"
}
Write-Host "Starting Java Spring Boot Backend..."
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
