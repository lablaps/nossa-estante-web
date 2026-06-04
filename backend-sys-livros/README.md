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

## Clonar repositório
git clone https://github.com/PauloBarataCreator/syslivros.git

## Entrar na pasta
cd projeto

## Rodar
./mvnw spring-boot:run

## 📡 Endpoints

Acesse API online: https://nossa-estante-spring-boot-with-postgresql.onrender.com
Acesse API local: http://localhost:8080

| Método | Rota                       | Descrição                                          |
|--------|----------------------------|----------------------------------------------------|
| GET    | /api/catalogo/books        | Lista livros catálogo ordem descendente            |
| GET    | /api/catalogo/books/filters?id=3&gender=ficcao | catálogo busca filtrada        |
| GET    | /api/catalogo/books/{id}   | Lista livros por id                                |
|                                                                                          |
| POST   | /api/auth/register         | Register user                                      |
| GET    | /api/auth/verify/{token}   | Verification throught email                        |
| POST   | /api/auth/login            | Login user                                         |
| POST   | /api/user-data             | Step-by-step user registration                     |
|                                                                                          |
| POST   | /api/books/                | Add livro                                          |
| POST   | /api/exchanges             | Request new books exchanging                       |
| PUT    | /api/exchanges             | Update book exchanging                             |
| GET    | /api/books                 | Lista livros                                       |
| GET    | /api/books/user            | Lista livros por user                              |
| GET    | /api/books/{id}            | Lista livros por id                                |

Acesse: http://localhost:8080/swagger-ui/index.html

## 🔥 Exemplo de requisição

POST /books

{
	"isbn": "frrrf4454545",
    "material_state":"GOOD",
    "status":"PROCESSING",
    "cost":12
}

## 🐳 Docker


- Check in applicaiton.properties if the url is for docker using
- mvn clean install
- docker build -t <dockerhub site username>/<give a image name> .
- docker push <name of your docker image>

Obs.: open your Docker Hub app and must sign-in.


## 📁 Estrutura

src/main/java/br/com/treinaweb/twjobs/
 ├── api/
 ├── config/
 ├── core/
 └── resources/


