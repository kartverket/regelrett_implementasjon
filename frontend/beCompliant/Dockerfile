FROM nginx:alpine

# Update to exact version to keep image "mostly" stable
# Can be removed once nginx:alpine is updated
RUN apk upgrade libxml2=2.12.7-r2

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./dist /usr/share/nginx/html/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
