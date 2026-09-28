# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY mht_cet_cutoffs.csv .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]