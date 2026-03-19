# ==========================================
# STAGE 1: Build the React (Vite) Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend source
COPY FrontEnd/package*.json ./
RUN npm install
COPY FrontEnd/ ./

# Build the production React app
RUN npm run build 

# ==========================================
# STAGE 2: Build the Spring Boot Backend
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend

# Copy backend source
COPY PhishGuard-Backend/pom.xml .
RUN mvn dependency:go-offline

COPY PhishGuard-Backend/src ./src

# Copy the constructed React App over into Spring Boot's static resources folder!
# (Spring Boot automatically intercepts and serves files within /static to the root URL `/`)
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Build the backend Uber-Jar
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 3: Production Runner
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the ultimate .jar (Which now contains the frontend!)
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Expose the SINGLE port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
