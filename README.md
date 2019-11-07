# Técnicas Avanzadas - Universidad de Palermo

[![Build status](https://dev.azure.com/kbrons/tecnicas-avanzadas/_apis/build/status/tecnicas-avanzadas-Generic%20analysis%20with%20SonarCloud-CI)](https://dev.azure.com/kbrons/tecnicas-avanzadas/_build/latest?definitionId=2)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kbrons_tecnicas-avanzadas&metric=alert_status)](https://sonarcloud.io/dashboard?id=kbrons_tecnicas-avanzadas)

Verificación de estado financiero de personas/empresas.

Solución basada en microservicios de NodeJS que resuelve los siguientes requerimientos.

| User story                               | As a user       | I want to                                                                             | So that I can                                                                               | Caso de aceptación                                                                                                                                                                 | Observaciones                           |
|------------------------------------------|-----------------|---------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| Validación de estado de usuario único    | Cliente web     | Acceder al estado del solicitante a partir de los datos enviados                      | Utilizar la información para alimentar procesos propios                                     | Resultado en formato json, campo estado con valores entre 1 y 5                                                                                                                    | Parametros: Nro CUIL/CUIT               |
| Validación de estado de bulk de usuarios | Cliente web     | Acceder al estado del solicitante a partir de los datos enviados                      | Utilizar la información para alimentar procesos propios                                     | Resultado en formato json, arreglo de objetos conteniendo el dato DNI/CUIT remitido más campo estado con el valor.                                                                 | Considerar un request de 5000 elementos |
| Validación de cuenta única               | Cliente web     | Contar con una clave única de usuario, para que nadie más que yo acceda a la consulta | Evitar que accedan a información utilizando la api                                          | Contar con una key o token, que me permita validar mi identidad                                                                                                                    |                                         |
| Máximo de requests por hora              | Cliente backend | Poder determinar una cuota máxima                                                     | Poder limitar el acceso o bien tener estadística de las peticiones de los clientes a la API | A través de un endpoint poder enviar como parámetro un ID de cliente web y un valor numérico que se corresponda con la cantidad de request permitidos en un intervalo de una hora. |                                         |

## Microservicios

### Financial Status
Permite verificar el estado financiero de uno o más CUIT/CUIL. Requiere el header Authorization con una API Key autorizada para autenticar al usuario contra el microservicio Account.

#### Endpoints
- GET /{cuit} permite obtener el estado financiero de un CUIT/CUIL
- POST / permite obtener el estado financiero de varios CUIT/CUILs. Espera un array de strings en el body

### Account
Permite autenticar un usuario de la solución utilizando un API Key. También se encarga de la creación y eliminación de usuarios. Requiere el header Authorization con una API Key autorizada para autenticar al usuario contra el microservicio Account.

#### Endpoints
- GET /account/{accountKey} permite obtener el detalle de un usuario. Requiere cuenta de administrador
- DELETE /account/{accountKey} permite borrar un usuario del sistema. Requiere cuenta de administrador
- PUT /account permite crear un nuevo usuario del sistema. Requiere cuenta de administrador
- GET /authorize permite autenticar un usuario sin permisos de administrador.
- GET /authorizeAdmin permite autenticar un usuario con permisos de administrador.

### Request
Permite mantener un registro de la cantidad de request de los usuarios y el momento en el que se realizaron. También permite obtener la cantidad de requests realizadas por un usuario en un tiempo determinado. Utiliza una única API Key para permitir el acceso al microservicio Account.

#### Endpoints
- GET /{accountKey} permite obtener la cantidad de requests realizadas por el usuario recibido en el tiempo determinado al iniciar
- PUT /{accountKey} permite crear un registro de un nuevo request para el usuario recibido
