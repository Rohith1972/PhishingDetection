FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
# Adjusted to copy from the BackEnd folder since we're in the repository root
COPY BackEnd/pom.xml .
COPY BackEnd/src ./src
RUN mvn clean package -DskipTests

# We use the generic JRE (not alpine) because Alpine doesn't support the Python ML libraries your app needs!
FROM eclipse-temurin:21-jre
WORKDIR /app

# Your application relies on a python machine learning script for spam detection. We MUST install Python in the container!
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-pandas python3-sklearn python3-joblib && \
    rm -rf /var/lib/apt/lists/*

# Copy the machine learning scripts into the final container
COPY BackEnd/ml_scripts /app/ml_scripts
RUN mkdir -p /app/ml_data

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
