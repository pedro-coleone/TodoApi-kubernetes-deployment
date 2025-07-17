# ===============================
# Script de Deploy via PowerShell
# ===============================

Write-Host "`n[1/7] Configurando ambiente Docker com Minikube..."
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Build backend
Write-Host "`n[2/7] Buildando imagem do backend..."
Push-Location ".\backend\TodoApi"
docker build -t backend:latest -f Dockerfile .
Pop-Location

# Build frontend
Write-Host "`n[3/7] Buildando imagem do frontend..."
Push-Location ".\frontend"
docker build -t frontend:latest -f Dockerfile .
Pop-Location

# Helm install/upgrade
Write-Host "`n[4/7] Aplicando Helm Chart (upgrade/install)..."
helm upgrade --install todoapi ./todoapi-chart

# Wait for pods
Write-Host "`n[5/7] Aguardando inicialização dos pods..."
kubectl wait --for=condition=Ready pod -l app=backend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=frontend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=postgres --timeout=90s

# Tunnel info
Write-Host "`n[6/7] Inicialize o tunnel do Minikube em outra aba (se ainda não estiver rodando):"
Write-Host "         minikube tunnel"

# Final message
Write-Host "`n[7/7] Deploy finalizado com sucesso!"
Write-Host "         Frontend: http://k8s.local/"
Write-Host "         Backend:  (acessível via Ingress interno se configurado)"
