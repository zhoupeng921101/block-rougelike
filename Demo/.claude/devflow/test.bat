@echo off
chcp 65001 >nul
REM ASCII ONLY - cmd.exe reads .bat with the system ANSI codepage; UTF-8 text shifts its
REM read pointer and makes later lines execute from the middle (chcp does NOT prevent this).
REM test.bat - devflow test launcher. Suite names are Chinese and live in run_tests.ps1;
REM this shell only forwards. Double-click = full run.
REM   double-click / no arg : full regression matrix (every suite under tests\)
REM   test SUITE            : single suite; run_tests.ps1 maps the Chinese-stem SUITE to its
REM                           tests\ script (see README, test launcher section)
REM Engine fixed to powershell.exe (Windows PowerShell 5.1; see .claude/rules/shell-conventions.md, engine section).
setlocal
set "DBLCLK="
echo %cmdcmdline% | find /i "%~nx0" >nul && set "DBLCLK=1"
if "%~1"=="" (
  powershell.exe -NoProfile -File "%~dp0run_tests.ps1"
) else (
  powershell.exe -NoProfile -File "%~dp0run_tests.ps1" -Suite %1
)
echo.
if defined DBLCLK pause
endlocal
