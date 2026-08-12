@REM Maven Wrapper Script for Windows
@REM This script downloads and runs Maven using the Maven Wrapper.

@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"

set "MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

for /f "tokens=2 delims==" %%a in ('findstr "distributionUrl" "%MAVEN_WRAPPER_PROPERTIES%"') do set "distributionUrl=%%a"

if not defined distributionUrl (
    set "distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip"
)

set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists"

where mvn >nul 2>nul
if %ERRORLEVEL% == 0 (
    mvn %*
) else (
    echo Maven not found. Please install Maven or use a CI/CD environment with Maven pre-installed.
    echo Download Maven from: https://maven.apache.org/download.cgi
    exit /b 1
)
