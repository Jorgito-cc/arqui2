<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Config\Database;
use App\Controllers\ReportadorController;
use App\Controllers\TipoIncidenciaController;
use App\Controllers\NotaProblemaController;
use App\Controllers\DetalleProblemaController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Inicializar Base de Datos
Database::boot();

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    // Reportadores
    $r->addRoute('GET', '/reportadores', [ReportadorController::class, 'getReportadores']);
    $r->addRoute('GET', '/reportadores/{id:\d+}', [ReportadorController::class, 'getReportador']);
    $r->addRoute('POST', '/reportadores', [ReportadorController::class, 'createReportador']);
    $r->addRoute('PUT', '/reportadores/{id:\d+}', [ReportadorController::class, 'updateReportador']);
    $r->addRoute('DELETE', '/reportadores/{id:\d+}', [ReportadorController::class, 'deleteReportador']);

    // Tipos de Incidencia
    $r->addRoute('GET', '/tipos-incidencia', [TipoIncidenciaController::class, 'getTiposIncidencia']);
    $r->addRoute('GET', '/tipos-incidencia/{id:\d+}', [TipoIncidenciaController::class, 'getTipoIncidencia']);
    $r->addRoute('POST', '/tipos-incidencia', [TipoIncidenciaController::class, 'createTipoIncidencia']);
    $r->addRoute('PUT', '/tipos-incidencia/{id:\d+}', [TipoIncidenciaController::class, 'updateTipoIncidencia']);
    $r->addRoute('DELETE', '/tipos-incidencia/{id:\d+}', [TipoIncidenciaController::class, 'deleteTipoIncidencia']);

    // Notas de Problemas
    $r->addRoute('GET', '/notas', [NotaProblemaController::class, 'getNotasProblema']);
    $r->addRoute('GET', '/notas/{id:\d+}', [NotaProblemaController::class, 'getNotaProblema']);
    $r->addRoute('POST', '/notas', [NotaProblemaController::class, 'createNotaProblema']);
    $r->addRoute('PUT', '/notas/{id:\d+}', [NotaProblemaController::class, 'updateNotaProblema']);
    $r->addRoute('DELETE', '/notas/{id:\d+}', [NotaProblemaController::class, 'deleteNotaProblema']);

    // Detalles de Problemas
    $r->addRoute('GET', '/detalles', [DetalleProblemaController::class, 'getDetalles']);
    $r->addRoute('GET', '/detalles/{id:\d+}', [DetalleProblemaController::class, 'getDetalle']);
    $r->addRoute('POST', '/detalles', [DetalleProblemaController::class, 'createDetalle']);
    $r->addRoute('PUT', '/detalles/{id:\d+}', [DetalleProblemaController::class, 'updateDetalle']);
    $r->addRoute('DELETE', '/detalles/{id:\d+}', [DetalleProblemaController::class, 'deleteDetalle']);

    // Rutas del Patrón Estado (State) - CU-06: Gestión del Estado de Incidencias
    $r->addRoute('POST', '/detalles/{id:\d+}/asignar', [DetalleProblemaController::class, 'asignarPersonal']);
    $r->addRoute('POST', '/detalles/{id:\d+}/evidencia', [DetalleProblemaController::class, 'agregarEvidencia']);
    $r->addRoute('POST', '/detalles/{id:\d+}/finalizar', [DetalleProblemaController::class, 'finalizarIncidencia']);
});

$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada en Reporte de Problemas']);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        
        $controller = new $handler[0]();
        $method = $handler[1];
        call_user_func_array([$controller, $method], $vars);
        break;
}
