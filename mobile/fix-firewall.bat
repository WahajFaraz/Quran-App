@echo off
:: Run this file as Administrator (right-click -> Run as administrator)
echo Adding Windows Firewall rules for Expo and Quran API...

netsh advfirewall firewall add rule name="Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Quran API 5000" dir=in action=allow protocol=TCP localport=5000

echo.
echo Done! Firewall rules added.
echo Now run: cd mobile && npm start
pause
