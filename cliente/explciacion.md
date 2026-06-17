# Explicación de Diagramas de Arquitectura y Flujo (Casos de Uso)

A continuación, te detallo la explicación paso a paso de lo que ocurre en cada uno de los diagramas que enviaste. Estos diagramas de clases muestran la estructura arquitectónica y el flujo de ejecución ("procedimental") desde el Frontend hasta los distintos Microservicios pasando por el Gateway.

---

## 1. CU-03: Registro de los reportadores de incidencia (Imagen 1)

**Propósito:** Este diagrama ilustra cómo el sistema permite crear y registrar a una persona que reporta un problema o incidencia.

*   **1. Capa de Cliente (Frontend):** 
    *   Todo inicia en la vista **`ReportePage`**. Esta página captura los datos de la persona (`personalData`).
    *   Para hacer la petición, la vista delega la acción a una clase de servicio. *(Nota: aunque los atributos dicen `reporteService`, la flecha apunta hacia `ubicacionService`, indicando que este servicio encapsula la lógica para enviar la petición, aunque a nivel técnico debería ser el servicio de reportes).*
    *   También se apoya en el modelo de datos **`TipoIncidencia`** para estructurar qué tipo de incidencia se reportará en el futuro.
*   **2. Capa de Gateway:** 
    *   El servicio del frontend hace un llamado HTTP (REST) al **`gateway`** exponiendo la ruta y payload (datos del reporte). El `gateway` actúa como intermediario de seguridad y redirección.
*   **3. Capa de Microservicio (`MS:Incidencia`):**
    *   El Gateway sabe hacia dónde enrutar la petición y la manda al archivo **`index`** del microservicio de incidencias.
    *   El index (mediante su *dispatcher*) analiza la URL y delega la ejecución al **`ReportadorController`**.
    *   El controlador ejecuta el método `createReportador()` interactuando tanto con la **`Entidad_reportador`** (probablemente para mapeo de datos u objetos DTO) como con el modelo de base de datos **`M_Reportador`**, que utiliza ORM (como Eloquent) para guardar finalmente el registro en la base de datos usando atributos como `fillable` o `table`.

---

## 2. CU-05: Gestionar Infraestructura Física (Imagen 2)

**Propósito:** Este diagrama muestra el flujo complejo para realizar un CRUD (Crear, Leer, Actualizar, Eliminar) sobre la estructura física de la institución: Módulos, Facultades y Ambientes.

*   **1. Capa de Cliente (Frontend):**
    *   Existen múltiples pantallas involucradas, como **`AmbientePage`** y **`ModuloModal`** (e incluso se menciona de refilón la `ReportePage` interactuando).
    *   Todas estas pantallas se comunican con un núcleo central: el **`ubicacionService`**.
    *   Este servicio contiene exhaustivos métodos para gestionar la infraestructura: `createAmbiente()`, `deleteModulo()`, `getFacultades()`, etc.
    *   El servicio formatea los datos valiéndose de los tipos o interfaces **`Ambiente`**, **`Modulo`** y **`Facultad`**.
*   **2. Capa de Gateway:**
    *   Al igual que en otros casos, recibe la petición proxy de `ubicacionService` y la despacha.
*   **3. Capa de Microservicio (`MS:infraestructura`):**
    *   El request llega al **`index`** de `MS:infraestructura`.
    *   De acuerdo con lo que haya solicitado el frontend (si es ambiente o módulo), el `dispatcher` bifurca el camino:
        *   Puede ir a **`AmbienteController`** (para gestionar Ambientes).
        *   O puede ir a **`ModuloController`** (para gestionar Módulos).
    *   A su vez, cada controlador se conecta paralelamente a su Modelo correspondiente (**`M_Ambiente`** y **`M_Modulo`**) asegurando la validación e inserción en la base de datos, y se apoyan estandarizando su forma con atributos representados en las clases de **`Entidad`**.

---

## 3. CU-11: Finalizar Orden de Mantenimiento (Imagen 3)

**Propósito:** Este es un **flujo orquestado complejo**. A diferencia de los anteriores, finalizar un mantenimiento requiere actualizar múltiples partes del sistema que están en **diferentes microservicios** (una operación distribuida).

*   **1. Capa de Cliente (Frontend):**
    *   Se origina en la pantalla del trabajador: **`EncargadoPage`**.
    *   El Encargado llena datos de cierre (como un informe o una captura de imagen/evidencia `photo-file`).
    *   Para finalizar el mantenimiento, el frontend tiene que comunicarse con **dos servicios paralelos**:
        *   **`reporteService`**: Encargado de actualizar detalles de incidencias y notas.
        *   Un servicio de gestión (aparentemente llamado **`getService`** o de gestión) que envía evidencias e historiales de estado.
*   **2. Capa de Gateway:**
    *   Este diagrama revela el poder del **`gateway`**. Recibe peticiones del frontend y dependiendo de la URL base, redirecciona tráfico simultáneo hacia *dos microservicios distintos y por separado*.
*   **3. Capa de Microservicios:**
    *   **Hacia `MS_mantenimiento`:** Entra por su `index` y se dirige a controladores como **`HistorialEstadoController`** (para dejar rastro de que el orden finalizó) y **`AsignacionController`** (para marcar la asignación como completada). Estos usan sus modelos (`M_Asignacion`, `HistorialEstado`).
    *   **Hacia `MS_Incidencia`:** Adicionalmente, el proceso también visita el microservicio de incidencias. A través del index, manda peticiones a **`DetalleProblemaController`** (para agregar las fotos o modificar cómo se solucionó por parte del trabajador) y **`NotaProblemaController`**. Modelos involucrados: `M_DetalleProblema` y `M_NotaProblema`.

---

### Resumen Analítico para tu examen:
La estructura común que sigues en todos los casos de uso se compone del patrón arquitectónico de **Microservicios con un API Gateway (Patrón Facade distribudo)**. 
1. El **Cliente** (capa de presentación) aísla el manejo del estado usando `Pages`, que usan `Services` inyectados y Tipos de datos, aislando así la vista de la lógica de negocio.
2. El **Gateway** hace de punto único de acceso, impidiendo que el cliente deba saber en qué puerto o IP exacto vive cada MS.
3. Los **Microservicios**, usando el patrón MVC, delegan la interceptación al `index.php` (Front Controller), la lógica al `Controller` y el acceso a datos al `Modelo`.

Si necesitas agregar más partes o quieres otro diagrama estructurado al estilo de Mermaid como el de usuarios, ¡avísame!
