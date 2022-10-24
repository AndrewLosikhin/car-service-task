# Car(Vehicle) Service Task #5
#### Preprequisites
- docker
- yarn

### Installation
```
# root folder commands
docker-compose up # deploy in containers db and rabbitmq
yarn install 
yarn start # start api and mock venders consumer
```

This project contains mock vender service that could be connected with via AMQP with API service.
In real situation we surely need RabbitMQ federation mode for federated exchange between organizations.

I decided to not to use nested REST API routing approach since it's more easier to control over put/delete operations but it's still negotiable.

Swagger: http://localhost:3000/api#/default

API could be splitted into two BFFs since mostly all REST endpoints (excepting clients/:id/widgets and clients/:id/sensors-data) are boilerplate CRUD code that could be used by Administrator.

For showing the screen in the task we need only two endpoints
- GET clients/:id/widgets (SSE)
- POST clients/:id/sensors-data