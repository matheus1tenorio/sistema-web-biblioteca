# Usa uma imagem leve do Nginx
FROM nginx:alpine

# Copia os arquivos do seu frontend para a pasta padrão do Nginx
COPY ./templates /usr/share/nginx/html
COPY ./static /usr/share/nginx/html/static

# Expõe a porta 80
EXPOSE 80