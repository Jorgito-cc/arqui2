# Guía de Pruebas de API con Thunder Client

Esta guía detalla cómo realizar peticiones a los microservicios del sistema de incidencias UAGRM utilizando la extensión Thunder Client de VS Code.

## 1. Configuración General

- **API Gateway (Punto de entrada):** `http://localhost:3000`
- **Formato de datos:** `JSON`
- **Encabezado obligatorio:** `Content-Type: application/json`

---

## 2. Autenticación y Seguridad

### Login (Obtener Token)
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/login`
- **Cuerpo (JSON):**
```json
{
  "correo": "admin@uagrm.edu.bo",
  "password": "password123"
}
```
- **Respuesta:** Copia el valor de `jwt` recibido.

### Uso del Token
Para las rutas **privadas** (Gestión, Usuarios, Ubicación), añade este encabezado en Thunder Client:
- **Key:** `Authorization`
- **Value:** `Bearer <pega_aqui_el_jwt>`

---

## 3. Microservicio: Usuarios (Puerto 3001)

### Listar Usuarios
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/usuarios` (Requiere Token)

### Registrar Usuario
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/usuarios` (Requiere Token)
- **Cuerpo:**
```json
{
  "nombres": "Juan",
  "apellidos": "Perez",
  "correo": "juan.perez@uagrm.edu.bo",
  "password": "password123",
  "rol_id": 1,
  "facultad_id": 1
}
```

---

## 4. Microservicio: Ubicación (Puerto 3002)

### Registrar Facultad
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/facultades` (Requiere Token)
- **Cuerpo:**
```json
{
  "nombre_facultad": "Facultad de Ciencias de la Computación",
  "abreviatura": "FICCT"
}
```

---

## 5. Microservicio: Reporte de Problemas (Puerto 3003) - ¡PÚBLICO!

*Nota: No es necesario enviar el token en estas rutas.*

### Registrar Reportador y Nota
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/reportes/reportadores`
```json
{
  "nombres": "Pedro",
  "apellidos": "Garcia",
  "correo": "pedro@gmail.com",
  "tipo_reportador": "Estudiante"
}
```

### Enviar Reporte de Problema (Nota + Detalle)
1. Primero registras la nota: `POST /api/reportes/notas`
2. Luego el detalle: `POST /api/reportes/detalles`
```json
{
  "descripcion": "El aire acondicionado no enfría",
  "ambiente_id": 1,
  "nota_id": 1,
  "tipo_incidencia_id": 1
}
```

---

## 6. Microservicio: Gestión y Evidencia (Puerto 3004)

### Registrar Asignación Técnica
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/asignaciones` (Requiere Token)
- **Cuerpo:**
```json
{
  "detalle_problema_id": 1,
  "usuario_id": 2
}
```

### Actualizar Estado (Historial)
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/historial` (Requiere Token)
```json
{
  "tipo": "Cambio de Estado",
  "estado": "En Proceso",
  "comentario_tecnico": "Iniciando revisión de cables",
  "asignacion_id": 1
}
```

---

## 7. Códigos de Respuesta Comunes

| Código | Significado | Descripción |
|---|---|---|
| **200 OK** | Éxito | La consulta fue exitosa. |
| **201 Created** | Creado | El registro se guardó correctamente. |
| **401 Unauthorized** | No Autorizado | Falta el token JWT o es inválido. |
| **404 Not Found** | No Encontrado | La URL o el ID del registro no existe. |
| **500 Error** | Error de Servidor | Problema interno (ver logs del backend). |
