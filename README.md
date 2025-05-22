```markdown
# TodoApi-devops

## 📚 Tutorial de Criação da Aplicação

Este tutorial orienta como criar uma aplicação composta por múltiplos contêineres:
- **Backend** em .NET 8 Web API  
- **Frontend** em React (Vite) servido por Nginx  
- **Banco de Dados** em PostgreSQL  
- Orquestração com Docker Compose  

---

## ✅ Tecnologias Utilizadas

- **Backend**: .NET 8 Web API  
- **Frontend**: React + Vite + Nginx  
- **Banco de Dados**: PostgreSQL  
- **Orquestração**: Docker e docker-compose  
- **Imagens base**:  
  - Backend: Debian Slim  
  - Frontend: Node 18-Alpine + Nginx-Alpine  
  - Banco de Dados: Debian  

---

## 📂 Estrutura do Projeto

```
/projeto
  /backend
    Dockerfile
    *.csproj
    /Controllers
    /Models
  /frontend
    Dockerfile
    /src
    package.json
    vite.config.js
    nginx.conf
  /database
    (sem arquivos; configuração no docker-compose)
docker-compose.yml
nginx.conf
README.md
```

---

## 🚀 Passos para Desenvolvimento

### 1️⃣ Backend (.NET 8 Web API)

#### ✔️ Instalação do SDK .NET

Baixe e instale o .NET SDK 8 em  
https://dotnet.microsoft.com/download/dotnet/8.0  

Verifique:
```bash
dotnet --version
```

#### ✔️ Criando o Projeto
```bash
dotnet new webapi -n TodoApi
cd TodoApi
```

#### ✔️ Model e DbContext

Models/TodoItem.cs
```csharp
[Table("TodoItem", Schema = "todos")]
public class TodoItem
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public bool IsComplete { get; set; }
}
```

Data/TodoContext.cs
```csharp
public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options)
        : base(options) { }

    public DbSet<TodoItem> TodoItems { get; set; }
}
```

#### ✔️ Pacotes EF Core
```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

#### ✔️ appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=database;Database=todo;Username=postgres;Password=postgres"
  }
}
```

#### ✔️ Program.cs
```csharp
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

#### ✔️ Migrations
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### ✔️ Dockerfile (backend)
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./

RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/out ./

ENTRYPOINT ["dotnet", "TodoApi.dll"]
```

---

### 2️⃣ Banco de Dados (PostgreSQL)

No docker-compose.yml:
```yaml
database:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: todo
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
  ports:
    - "5432:5432"
```

---

### 3️⃣ Frontend (React + Vite + Nginx)

#### ✔️ Criando o frontend com Vite
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Desenvolva sua UI em `/src`.

#### ✔️ Dockerfile (frontend)
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### ✔️ vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
```

#### ✔️ nginx.conf
```nginx
server {
    listen 80;
    server_name todolist.local;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://backend:80/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

### 4️⃣ docker-compose.yml
```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - database

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  database:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: todo
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

---

## 🏁 Execução

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/TodoApi-devops.git
cd TodoApi-devops
```

2. Suba os contêineres:
```bash
docker-compose up --build
```

3. Acesse no navegador:
- Frontend: http://localhost:3000  
- Backend: http://localhost:5000/api/todoitems  

---

## 🔗 Observações

- Comunicação entre contêineres via **nomes de serviço**, não `localhost`.  
- Frontend faz proxy em `/api` para o backend.  
- Banco configurado em `ConnectionStrings` apontando `Host=database`.

---

## 📄 Autor

- Aluno: Pedro Cassiano Coleone
- Curso: Bacharelado em Ciência da Computação 
- Professor: Delano Medeiros Beder 
- Data: 22/05/2025
```
