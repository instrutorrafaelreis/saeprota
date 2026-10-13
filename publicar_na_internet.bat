@echo off
chcp 65001 > nul
title COLOCAR SIMULADO SAEP ONLINE NA INTERNET
color 0b

echo ======================================================================
echo    SENAI - SISTEMA DE AVALIAÇÃO DA EDUCAÇÃO PROFISSIONAL (SAEP)
echo          COMO DISPONIBILIZAR O SIMULADO ONLINE NA INTERNET
echo ======================================================================
echo.
echo Escolha uma das opções abaixo:
echo.
echo  [1] Publicar Gratuitamente na Vercel (Gera link https:// permanente)
echo  [2] Gerar Link de Túnel Imediato com Localtunnel
echo  [3] Abrir Instruções para GitHub Pages e Render.com
echo  [4] Sair
echo.
set /p op="Digite a opção desejada (1, 2, 3 ou 4): "

if "%op%"=="1" (
    echo.
    echo [*] Iniciando deploy na Vercel...
    echo [*] Na primeira vez, você precisará fazer login rápido com GitHub/Email.
    echo.
    npx vercel
    pause
    exit /b
)

if "%op%"=="2" (
    echo.
    echo [*] Certifique-se de que o servidor está rodando (iniciar_simulado.bat)...
    echo [*] Iniciando túnel público...
    npx localtunnel --port 3000
    pause
    exit /b
)

if "%op%"=="3" (
    start README.md
    exit /b
)

exit /b
