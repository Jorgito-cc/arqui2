# Guía de Uso: API Gateway

Este servicio actúa como el punto de entrada único para el frontend. Todas las peticiones deben dirigirse a este servicio, el cual se encarga de validar la autenticación y redirigir al microservicio correspondiente.

## Configuración de Puertos Sugerida
- **API Gateway:** Puerto 3000
- **Microservicio Usuarios:** Puerto 3001
- **Microservicio Ubicación:** Puerto 3002

## Endpoints Disponibles

### Autenticación (Público)
- **POST** `http://localhost:3000/api/login`
  - *Cuerpo:* `{"correo": "...", "password": "..."}`
  - *Respuesta:* Token JWT.

### Usuarios (Protegido)
- **GET** `http://localhost:3000/api/usuarios`
- **POST** `http://localhost:3000/api/usuarios`
- **GET** `http://localhost:3000/api/usuarios/{id}`
- **PUT** `http://localhost:3000/api/usuarios/{id}`
- **DELETE** `http://localhost:3000/api/usuarios/{id}`

### Ubicación (Protegido)
- **Facultades:** `http://localhost:3000/api/facultades` (GET, POST, PUT, DELETE)
- **Módulos:** `http://localhost:3000/api/modulos` (GET, POST, PUT, DELETE)
- **Ambientes:** `http://localhost:3000/api/ambientes` (GET, POST, PUT, DELETE)

## Cómo realizar peticiones protegidas

Para cualquier ruta protegida, debes incluir el token JWT obtenido en el login dentro de las cabeceras HTTP:

```http
Authorization: Bearer <TU_TOKEN_JWT>
Content-Type: application/json
```

## Ejemplo con cURL

```bash
curl -X GET http://localhost:3000/api/usuarios \
     -H "Authorization: Bearer <TOKEN>"
```

## Notas Técnicas
- El Gateway utiliza la extensión **cURL** de PHP para el reenvío de peticiones.
- La validación del token se realiza en la clase `App\Middleware\AuthMiddleware` del Gateway.
