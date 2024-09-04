FROM node:22-alpine
RUN mkdir /app
RUN npm i -g serve
RUN adduser -D user && chown -R user /app
WORKDIR app
COPY dist/ /app/dist
USER user
EXPOSE 3000
ENTRYPOINT ["serve", "dist"]
