# Diagrama Procedimental / Clases - CU-04: Gestión de Usuarios

A continuación se presenta el diagrama procedimental y de arquitectura estructurado para el **Caso de Uso 04: Gestión de Usuarios**, basado en el análisis de tu proyecto (React Frontend, Gateway y MS_usuario). 

Puedes usar cualquier visualizador de Markdown que soporte **Mermaid.js** (como GitHub, GitLab o extensiones de VSCode) para renderizar este código y ver las cajitas dibujadas con rayas y líneas tal como pediste.

```mermaid
classDiagram
    direction LR

    %% Definicion de colores para agrupar visualmente igual que en tu ejemplo
    classDef frontend fill:#ccffff,stroke:#00cccc,stroke-width:2px;
    classDef gateway fill:#ffe6cc,stroke:#ff9933,stroke-width:2px;
    classDef backend fill:#ffe6cc,stroke:#cc6600,stroke-width:2px;
    classDef controller fill:#ffe6cc,stroke:#000000,stroke-width:1px;

    %% ================= FRONTEND (Cliente) =================
    namespace cliente {
        class UsersPage {
            - users: Usuario[]
            - userToEdit: Usuario
            - loading: boolean
            + fetchUsers(): void
            + handleDelete(id): void
            + openCreateModal(): void
            + openEditModal(user): void
        }

        class UserModal {
            - formData: Usuario
            - roles: Rol[]
            - facultades: Facultad[]
            + loadDependencies(): void
            + handleSubmit(): void
        }

        class usuarioService {
            + getUsuarios(): Promise~data~
            + getUsuario(id): Promise~data~
            + createUsuario(data): Promise~data~
            + updateUsuario(id, data): Promise~data~
            + deleteUsuario(id): Promise~data~
            + getRoles(): Promise~data~
        }

        class Type_Usuario {
            <<type>>
            - id: int
            - nombres: string
            - apellidos: string
            - correo: string
            - password: string
            - telefono: string
            - rol_id: int
            - facultad_id: int
            - activo: boolean
        }
        
    }

    %% ================= GATEWAY =================
    class gateway {
        - inputData: string
        - isPublic: boolean
        - method: string
        - response: string
        - routes: [string]
        - targetPath: string
        - url: string
        + proxyRequest(url, method, data): response
    }

    %% ================= BACKEND (MS usuarios) =================
    namespace MS_usuarios {
        class index {
            - dispatcher: int
            - httpMethod: string
            - routeInfo: int
            - url: string
            + Database::boot(): void
        }

        class UsuarioController {
            + getUsuarios(): json
            + getUsuario(id): json
            + createUsuario(): json
            + updateUsuario(id): json
            + deleteUsuario(id): json
        }

        class Model_Usuario {
            - fillable: [string]
            - table: string
            - timestamps: boolean
            + setPasswordAttribute(value): void
            + rol(): void
        }
    }

    %% ================= RELACIONES (Rayas y líneas) =================
    
    %% Relaciones en Fronend
    UsersPage ..> UserModal : abre
    UsersPage ..> usuarioService : llama API
    UserModal ..> usuarioService : llama API
    usuarioService ..> Type_Usuario : retorna/envía

    %% Frontend hacia Gateway
    usuarioService ..> gateway : Petición HTTP

    %% Gateway hacia Microservicio
    gateway ..> index : Redirecciona

    %% Flujo interno Microservicio
    index ..> UsuarioController : Enruta (Dispatcher)
    UsuarioController ..> Model_Usuario : Interactúa / Persiste

    %% Aplicacion de estilos
    class UsersPage,UserModal,usuarioService,Type_Usuario frontend;
    class gateway gateway;
    class index,UsuarioController,Model_Usuario backend;
```

### Explicación de los Componentes

1. **cliente (Frontend en React)**
   - **UsersPage**: Es la pantalla principal donde se lista a los usuarios. Tiene métodos para hacer dispatch de datos y abrir modales de edición/creación.
   - **UserModal**: Es el formulario modal donde ingresamos nombres, apellidos, correo y seleccionamos el Rol o Facultad.
   - **usuarioService**: Es el puente que hace los fecthes (Axios/Fetcher) con nuestro backend (GET, POST, PUT, DELETE).
   - **Type_Usuario**: Representa la estructura de datos que viaja en el cliente.

2. **gateway**
   - Recibe la petición desde `usuarioService`, verifica las rutas públicas/privadas y redirige la llamada al microservicio que corresponde, en este caso, **MS_usuario**.

3. **MS_usuarios (Backend en PHP/Eloquent)**
   - **index**: El archivo de entrada que arranca la base de datos `Database::boot()` y tiene el dispatcher/enrutador.
   - **UsuarioController**: Controla la lógica de negocio, inserta, actualiza, da baja lógica (`deleteUsuario`), valida los correos únicos y procesa el cuerpo JSON de entrada.
   - **Model_Usuario**: Representa la tabla `usuarios` en la base de datos, tiene encriptación en sus mutadores `setPasswordAttribute` para cifrar la clave y relaciones de datos como `rol()`.
