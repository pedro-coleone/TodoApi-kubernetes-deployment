#!/bin/bash

# ============================
# Script de Deploy via Bash
# ============================

echo -e "\n>> Exportando variáveis do Docker Minikube..."
eval $(minikube -p minikube docker-env)

echo -e "\n>> Buildando imagem do backend..."
cd backend/TodoApi
docker build -t backend:latest -f Dockerfile .
cd ../..

echo -e "\n>> Buildando imagem do frontend..."
cd frontend
docker build -t frontend:latest -f Dockerfile .
cd ..

echo -e "\n>> Instalando/reinstalando o Helm Chart..."
helm uninstall todoapi -n default >/dev/null 2>&1
helm install todoapi ./todoapi-chart

echo -e "\n>> Aguardando pods ficarem prontos..."
kubectl wait --for=condition=Ready pod -l app=backend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=frontend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=postgres --timeout=90s

echo -e "\n>> Inicie o tunnel manualmente em outro terminal com:"
echo "minikube tunnel"

echo -e "\n>> Deploy concluído. Acesse:"
echo "http://frontend.todoapi.local"
echo "http://backend.todoapi.local"
