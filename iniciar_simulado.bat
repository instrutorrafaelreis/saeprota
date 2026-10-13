@echo off
chcp 65001 > nul
title SIMULADO SAEP ROTA - SERVIDOR ONLINE
color 0b

echo ======================================================================
echo    SENAI - SISTEMA DE AVALIAÇÃO DA EDUCAÇÃO PROFISSIONAL (SAEP)
echo             SIMULADO FORMATIVO ONLINE: DESENVOLVIMENTO WEB & CSS
echo ======================================================================
echo.
echo [*] Verificando ambiente Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js não foi encontrado no PATH.
    echo [*] Abrindo index.html diretamente no navegador em modo local...
    start index.html
    pause
    exit /b
)

echo [✓] Node.js detectado!
echo [*] Iniciando servidor da turma e da avaliação...
echo.

start "" "http://localhost:3000"

node server.js
pause
