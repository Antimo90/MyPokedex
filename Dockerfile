# Use a lightweight OpenJDK image with Maven preinstalled
FROM eclipse-temurin:21-jdk-jammy

# Set working directory
WORKDIR /app

# Copy the entire backend source code and Maven wrapper into the container
COPY . .

# Make sure the Maven wrapper is executable
RUN chmod+x mvnw

# Build the SpringBoot application
RUN ./mvnw clean package -DskipTests

# Expose port
Expose 3001

# Run the generated JAR file
CMD["java", "-jar", "target/mypokedex-0.0.1-SNAPSHOT.jar"]