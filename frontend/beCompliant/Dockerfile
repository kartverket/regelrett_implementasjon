FROM node:22-alpine
# Create a non-root
RUN mkdir /app
EXPOSE 8080
RUN adduser -D user && chown -R user /app
WORKDIR .
COPY dist/ /app/.
USER user
EXPOSE 3000
ENTRYPOINT [ "serve", "-s", "/app/." ]




