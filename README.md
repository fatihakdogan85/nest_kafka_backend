
## Description

This project is an example project to show how Kafka and Nest.js can work together with the microservices module. It also has a DB connection layer utilizing TypeORM over MySQL. Frontend application is a simple React page, where you can send requested number of email requests to backend api service. Backend service adds the requests to Kafka topic.

## Installation

- On the root folder, run the following to get local Docker up. It will use "docker-compose.yml".
```bash
$ docker compose up -d
```

- On the root folder, "ormconfig.ts" file stores MySQL connection information. You should create an empty schema named "nest_tutorial" on your MySQL DB.

- Install the project dependencies
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

