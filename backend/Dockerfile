FROM gradle:7-jdk17 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle buildFatJar --no-daemon

# Use a minimal JDK image to run the application
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /home/gradle/src/build/libs/*.jar /app/backend.jar
COPY application.properties /app/

# Specify the command to run the application
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]