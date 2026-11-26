@echo off
set WRAPPER_DIR=%~dp0.mvn\wrapper
set WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar
set MAVEN_PROJECTBASEDIR=%~dp0.
if not exist "%WRAPPER_JAR%" (
  echo Maven Wrapper jar is missing at %WRAPPER_JAR% 1>&2
  exit /b 1
)
java "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
