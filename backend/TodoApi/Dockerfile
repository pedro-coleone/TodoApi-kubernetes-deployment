# Usa imagem SDK do dotnet para build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copia csproj e restaura dependências pra aproveitar o cache
COPY *.csproj ./
RUN dotnet restore

# Copia todo o código fonte
COPY . ./

# Publica o projeto para Release
RUN dotnet publish -c Release -o out

# Usa imagem runtime para rodar a aplicação
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copia arquivos publicados da etapa de build
COPY --from=build /app/out ./

# Comando para iniciar a aplicação
ENTRYPOINT ["dotnet", "TodoApi.dll"]
