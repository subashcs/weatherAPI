# weatherAPI

weather information specific to a country

## How to Run ?

- Clone the Repo
- Navigate to Project Root Directory
- Run Command "yarn install"
- Run Command "yarn start" to run the api
- Run "yarn test" to test api

## Routes Available

1. api/v1/weather -> to get current weather data of hongkong in json format
2. api/v1/user/register -> to register user with name, email and password
3. api/v1/user/login -> to login user get response auth_token and use it as Bearer token to conduct weather request with authenticity.

## Configure custom Mongo Environment

1.Change the .env MONGO_URL to configure different mongo db server
