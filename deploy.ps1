# ===============================
# Script de Deploy via PowerShell
# ===============================

# Atribui o ambiente Docker do Minikube
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

Write-Host "`n>> Buildando imagem do backend..."
Set-Location -Path ".\backend\TodoApi"
docker build -t backend:latest -f Dockerfile .
Set-Location -Path "../.."

Write-Host "`n>> Buildando imagem do frontend..."
Set-Location -Path ".\frontend"
docker build -t frontend:latest -f Dockerfile .
Set-Location -Path ".."

Write-Host "`n>> Instalando/reinstalando o Helm Chart..."
helm uninstall todoapi -n default -q
helm install todoapi ./todoapi-chart

Write-Host "`n>> Aguardando pods serem inicializados..."
kubectl wait --for=condition=Ready pod -l app=backend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=frontend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=postgres --timeout=90s

Write-Host "`n>> Inicializando tunnel do Minikube (execute manualmente em outra aba):"
Write-Host "minikube tunnel"

Write-Host "`n>> Finalizado. Acesse:"
Write-Host "http://frontend.todoapi.local"
Write-Host "http://backend.todoapi.local"
