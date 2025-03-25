# Use a minimal JDK image to run the application
FROM eclipse-temurin:21-jre-alpine
RUN apk update && apk upgrade
# Create a non-root
RUN mkdir /app
EXPOSE 8080
RUN adduser -D user && chown -R user /app
WORKDIR .
COPY build/libs/*.jar /app/regelrett.jar
USER user
ENV ALLOWED_CORS_HOSTS="regelrett.atgcp1-dev.kartverket-intern.cloud,regelrett.atgcp1-prod.kartverket-intern.cloud,frisk.atgcp1-dev.kartverket-intern.cloud,frisk.atgcp1-prod.kartverket-intern.cloud"
ENTRYPOINT ["java", "-Duser.timezone=Europe/Oslo", "-jar", "/app/regelrett.jar"]
