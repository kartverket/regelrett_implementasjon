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

# Specify the command to run the application
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]









# Huff gammelt under

# Sjekk om jdk er riktig, virker gammel
#FROM gradle:7-jdk11 AS build

# Hør med Didrik Sæther om veldig slim java image
# 1. Fikse gradle image feil 2. Kun kjøre jdk uten å laste inn gradle image. Kjøre gradlew osv

#COPY --chown=gradle:gradle . /home/gradle/src
#WORKDIR /home/gradle/src
#RUN gradle buildFatJar --no-daemon

#WORKDIR /home/gradle/src

# Copy the entire project into the container
#COPY .. .

# Build the application inside the container
#RUN gradle build --no-daemon


#COPY gradle/ /gradle/
#COPY gradlew .
#COPY build.gradle.kts /home/gradle
#COPY ../settings.gradle.kts .

# Copy the application source code
#COPY src src

# Build the application
#RUN ./gradlew build


#FROM openjdk:11-jre-slim
#
## Set the working directory
#WORKDIR /backend
#
## Copy the build output from the first stage
#COPY --from=build /backend/build/install /backend
#
## Expose the application port
#EXPOSE 8080
#
## Set the entry point to run the application
#COPY ./build/libs/*-all.jar /backend/backend.jar
#ENTRYPOINT ["java","-jar","/backend/backend.jar"]
#CMD ["/backend/bin/backend.jar"]