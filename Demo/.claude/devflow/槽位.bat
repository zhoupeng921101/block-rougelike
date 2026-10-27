@echo off
chcp 65001 >nul
REM ASCII ONLY - cmd.exe reads .bat with the system ANSI codepage; UTF-8 text shifts its
REM read pointer and makes later lines execute from the middle (chcp does NOT prevent this).
REM devflow slot status launcher. Thin shell over slots-panel.ps1, which forwards to the
REM Chinese-named panel script in this directory.
REM   double-click / no arg : text panel, then pause (keeps the window open)
REM   <this bat> text       : text panel, no pause (for command-line use)
REM   <this bat> files      : text panel + per-slot changed paths
REM Visual panel = Unity menu Tools/devflow slot panel (optional 10s auto-refresh, off by default).
REM Engine fixed to powershell.exe (Windows PowerShell 5.1; see .claude/rules/shell-conventions.md, engine section).
setlocal
set "DIR=%~dp0"
if /I "%~1"=="text" goto text
if /I "%~1"=="files" goto files
powershell.exe -NoProfile -File "%DIR%slots-panel.ps1"
pause
goto :eof
:text
powershell.exe -NoProfile -File "%DIR%slots-panel.ps1"
goto :eof
:files
powershell.exe -NoProfile -File "%DIR%slots-panel.ps1" -Files
goto :eof
