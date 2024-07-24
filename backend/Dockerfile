FROM eclipse-temurin:21.0.2_13-jre-alpine as build
COPY . .
RUN ./gradlew build -x test

FROM eclipse-temurin:21

# Create application directory and subdirectories
RUN mkdir -p /app /app/logs /app/tmp

COPY --from=build /build/libs/*.jar /app/backend.jar

# Add non-root user med id 150 og endre rettigheter
RUN adduser --uid 150 --disabled-password --gecos "" user && \
    chown -R user:user /app /app/logs /app/tmp

# Bytt til non-root user
USER user

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]