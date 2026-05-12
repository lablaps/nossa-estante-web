# 📚 API de Gerenciamento de Livros

API REST desenvolvida com Spring Boot para gerenciar livros, usuários e trocas.

## 🚀 Tecnologias

- Java 21
- Spring Boot
- PostgreSQL
- Maven
- Docker 

## 🗄️ Configuração do banco (PostgreSQL)

Crie um banco:

Criação automática. Apenas coloque username e password no application.properties

## ▶️ Executando a aplicação

# Clonar repositório
git clone https://github.com/PauloBarataCreator/syslivros.git

# Entrar na pasta
cd projeto

# Rodar
./mvnw spring-boot:run

## 📡 Endpoints

| Método | Rota               | Descrição              |
|--------|--------------      |------------------      |
| GET    | /api/books         | Lista livros           |
| GET    | /api/books/user    | Lista livros por user  |
| GET    | /api/books/{id}    | Lista livros por id    |
| POST   | /api/books/        | Add livro              |
| POST   | /api/auth/login    | Login user             |
| POST   | /api/auth/register | Register user          |
| POST   | /api/user-data     | Register user details  |

Acesse: http://localhost:8080/swagger-ui/index.html

## 🐳 Docker


- Check in applicaiton.properties if the url is for docker using
- mvn clean install
- docker build -t <dockerhub site username>/<give a image name> .

## 📁 Estrutura

src/main/java/br/com/treinaweb/twjobs/
 ├── api/
 ├── config/
 ├── core/
 └── resources/

## 🔥 Exemplo de requisição

POST /books

{
	"isbn": "frrrf4454545",
    "material_state":"GOOD",
    "status":"PROCESSING",
    "cost":12
}


### 🔝 Deploying steps on Render

## Postgresql Database

- New => Postgresql => Give a name for your db => Postgresql version should be the same of the one of your tests => Select free version => Create database
- Setting up the Hosted database credentials for you application.properties => https://youtu.be/-zqoGttHmtg?si=AKPCBxf9l6T5Csvh

## Web Service

# Create image

# Send image to Docker-Hub

- docker push <your image name>

# Check if the image is in Docker-Hub

# Upload image on Render

- Home page: new => Existing Image => Put the Docker-Hub image name here => Connect => Give a name => Deploy Web Service => End