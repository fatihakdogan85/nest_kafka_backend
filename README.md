
## Description

This project is an example project to show how Kafka and Nest.js can work together with the microservices module. It also has a DB connection layer utilizing TypeORM over MySql. Frontend application is a simple React page, where you can send requested number of email requests to backend api service. Backend service adds the requests to Kafka topic.

## Installation



```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

