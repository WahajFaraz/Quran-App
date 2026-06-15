@echo off
echo ============================================
echo   Quran App - Mobile Dev Server Setup
echo ============================================
echo.

REM Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set IP=%%a
  goto :found
)
:found
set IP=%IP: =%
echo Your PC IP: %IP%
echo Update DEV_HOST in src\config\constants.js if different!
echo.

REM Setup USB port forwarding (works even when WiFi blocked)
where adb >nul 2>&1
if %errorlevel%==0 (
  echo Setting up USB port forwarding...
  adb reverse tcp:8081 tcp:8081
  adb reverse tcp:5000 tcp:5000
  echo USB forwarding ready!
  echo   - Metro: localhost:8081
  echo   - API:   localhost:5000
) else (
  echo ADB not found - using WiFi mode only.
  echo Install Android SDK Platform Tools for USB mode.
)

echo.
echo Starting Expo on LAN...
set REACT_NATIVE_PACKAGER_HOSTNAME=%IP%
set EXPO_PACKAGER_PROXY_URL=
npx expo start --lan --clear
