FROM gradle:7-jdk11 AS build
#COPY --chown=gradle:gradle . /home/gradle/src
#WORKDIR /home/gradle/src
#RUN gradle buildFatJar --no-daemon

WORKDIR /home/gradle/src

# Copy the entire project into the container
COPY .. .

# Build the application inside the container
RUN gradle build --no-daemon


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