# Use a minimal JDK image to run the application
FROM eclipse-temurin:24.0.2_12-jre-alpine-3.22
RUN apk update && apk upgrade
# Create a non-root
RUN mkdir /app
EXPOSE 8080
RUN adduser -D user && chown -R user /app
WORKDIR /app
COPY build/libs/*.jar /app/regelrett.jar
COPY --from=conf . /app/conf/
USER user
ENV ALLOWED_CORS_HOSTS="regelrett.atgcp1-dev.kartverket-intern.cloud,regelrett.atgcp1-prod.kartverket-intern.cloud,frisk.atgcp1-dev.kartverket-intern.cloud,frisk.atgcp1-prod.kartverket-intern.cloud"
ENTRYPOINT ["java", "-Duser.timezone=Europe/Oslo", "-jar", "/app/regelrett.jar"]
