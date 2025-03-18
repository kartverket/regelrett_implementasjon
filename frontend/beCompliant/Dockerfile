FROM nginx:alpine

# Can be removed once nginx:stable-alpine updates libxml2
RUN apk upgrade libxml2
RUN apk upgrade libxslt
RUN apk upgrade libexpat
      
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./dist /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
