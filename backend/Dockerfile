# FROM openjdk:21
FROM maven:3.9.6-eclipse-temurin-21-jammy
WORKDIR /app
COPY  target/booksproject-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]















# FROM maven:3.9.6-eclipse-temurin-21-jammy

# WORKDIR /app

# COPY  target/docker-demo-livrosapp.jar app.jar

# EXPOSE 9090

# CMD ["java", "-jar", "app.jar"]





# FROM openjdk:21
# # FROM maven:3.9.6-eclipse-temurin-21-jammy
# EXPOSE 9090
# ADD target/docker-demo-app-livros.jar docker-demo-app-livros.jar
# ENTRYPOINT ["java", "-jar", "/docker-demo-app-livros.jar"]