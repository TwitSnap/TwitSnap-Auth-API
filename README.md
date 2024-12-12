# Servicio De autenticacion para la app TwitSnap

Para empezar a correr esta api se necesitara tener docker instalado en su maquina. Para correr el proyecto ejecutar el comando:
` docker-compose up -d --build` y dirigirse a [Api-docs](http://localhost:5000/api-docs).

## Environment variables
- PORT= Puerto donde escucha solicitudes HTTP
- NODE_ENV= Entorno

- JWT_SECRET=Secreto
- JWT_EXPIRATION_TIME=Tiempo de expiracion del token
- JWT_NEW_PASSWORD=New password token secret
- JWT_NEW_PASSWORD_EXPIRATION_TIME=New password token expiration time

- LOG_ROUTE=log route
- LOGGING=logging true o false
- LOG_INFO=logging info true o false
- LOG_ERROR=log error true o false
- LOG_DEBUG=log debug true o false

- DB_HOST=DB URL
- DB_PORT=DB Port
- DB_USERNAME=DB User
- DB_PASSWORD=DB Password
- DB_NAME=DB Name
- DB_SYNCHRONIZE=update db schema
- DB_LOGGING=show db logs
- DB_TYPE=database type

- USERS_MS_URI=URL MSG Users
- GET_USER_ID_FROM_USER_EMAIL_ENDPOINT_PATH=Path to get user id from user email
- NOTIFICATIONS_MS_URI=URL MS Notifications
- SEND_NOTIFICATION_ENDPOINT_PATH=Send notification endpoint path

## Endpoints
- **POST /v1/auth/register**: Registra un usuario.
- **POST /v1/auth/login**: Inicia sesión.
- **POST /v1/auth/:token**: Valida un token. En caso de éxito, devuelve el userId asociado a ese token.
- **POST /v1/auth/password**: Envía un correo para recuperar la contraseña.
- **PATCH /v1/auth/password**: Valida un token para actualizar la contraseña.
- **GET /v1/auth/resetPasswordToken/valid/:token**: Valida un token para recuperar la contraseña.
- **GET /v1/auth/federate/google/login**: Recibe un token {code:token} de google firebase por query y registra/inicia sesion al usuario