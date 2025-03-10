FROM golang:1.21 AS builder

WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY . .

# Baixa as dependências e compila o bot
RUN go mod tidy && go build -o bot

# Usa uma imagem menor para rodar o bot
FROM debian:bookworm-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o executável do bot da etapa anterior
COPY --from=builder /app/bot .

# Copia o arquivo .env (caso esteja usando variáveis de ambiente)
COPY .env .env

# Define o comando para rodar o bot
CMD ["./bot"]