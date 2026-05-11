@echo off
title Claude API Setup
echo Setting Claude API environment variables...

setx ANTHROPIC_BASE_URL "https://api.oneprovider.dev"
setx ANTHROPIC_API_KEY "sk-66d8953dc6bb1ca845ec167ff3f1e70df65faa3421dcad0e6a20013f8e810048"

echo.
echo Variables saved. Opening new terminal in 5 seconds...
timeout /t 5 /nobreak >nul

start cmd /k claude
exit