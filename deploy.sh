#!/bin/bash

# ============================
# Script de Deploy via Bash
# ============================

set -e  # Encerra o script se qualquer comando falhar

echo -e "\n[1/7] Exportando variáveis do Docker Minikube..."
eval $(minikube -p minikube docker-env)

echo -e "\n[2/7] Buildando imagem do backend..."
pushd backend/TodoApi > /dev/null
docker build -t backend:latest -f Dockerfile .
popd > /dev/null

echo -e "\n[3/7] Buildando imagem do frontend..."
pushd frontend > /dev/null
docker build -t frontend:latest -f Dockerfile .
popd > /dev/null

echo -e "\n[4/7] Aplicando Helm Chart (upgrade/install)..."
helm upgrade --install todoapi ./todoapi-chart

echo -e "\n[5/7] Aguardando inicialização dos pods..."
kubectl wait --for=condition=Ready pod -l app=backend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=frontend --timeout=90s
kubectl wait --for=condition=Ready pod -l app=postgres --timeout=90s

echo -e "\n[6/7] Inicie o tunnel manualmente em outro terminal com:"
echo "         minikube tunnel"

echo -e "\n[7/7] Deploy concluído com sucesso!"
echo "         Frontend: http://k8s.local/"
echo "         Backend:  (acessível via Ingress interno se configurado)"
