@echo off
echo ========================================
echo  启动 Cloudflare Tunnel（自动更新配置）
echo  不需要手动修改 .env.local
echo ========================================
echo.

cd /d "%~dp0"
node scripts/start-with-tunnel.js

pause
