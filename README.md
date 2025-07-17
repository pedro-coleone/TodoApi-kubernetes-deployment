# TodoApi Kubernetes Deployment

Este projeto contém a infraestrutura para deploy da aplicação `TodoApi` (backend em ASP.NET Core, frontend em Node/Vite + NGINX e banco de dados PostgreSQL) utilizando **Kubernetes com Minikube** e **Helm Charts**.

## 📦 Componentes

- **Backend:** API ASP.NET Core 8.0  
- **Frontend:** Aplicação Node/Vite servida por NGINX  
- **Banco de dados:** PostgreSQL 15  
- **Orquestração:** Kubernetes com Helm  
- **Ingress:** NGINX + domínio local `k8s.local`

---

## 🚀 Instruções de Deploy

### Linux/macOS
```bash
chmod +x deploy.sh
./deploy.sh
```

### Windows (PowerShell)
```powershell
./deploy.ps1
```

## 🌐 Acesso

Após o deploy e com o `minikube tunnel` ativo, acesse:

- **Frontend:** `http://k8s.local`

## 📁 Estrutura do Projeto

```plaintext
TodoApi-devops/
│
├── backend/                # Código-fonte da API .NET
├── frontend/               # Código-fonte do frontend
├── todoapi-chart/          # Helm Chart completo
│   ├── templates/
│   └── values.yaml
│
├── deploy.sh               # Script de automação (Linux/macOS)
├── deploy.ps1              # Script de automação (Windows)
└── README.md
```