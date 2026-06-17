<?php

require __DIR__ . '/../vendor/autoload.php';

// Desactivar warnings depreciados para evitar corromper las respuestas JSON en PHP 8.4+
error_reporting(E_ALL & ~E_DEPRECATED);

use App\Config\Database;
use App\Controllers\UsuarioController;
use App\Controllers\RolController;
use App\Controllers\AuthController;
use App\Middleware\AuthMiddleware;

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
    // Auth
    $r->addRoute('POST', '/login', [AuthController::class, 'login']);

    // Usuarios
    $r->addRoute('GET', '/usuarios', [UsuarioController::class, 'getUsuarios']);
    $r->addRoute('GET', '/usuarios/{id:\d+}', [UsuarioController::class, 'getUsuario']);
    $r->addRoute('POST', '/usuarios', [UsuarioController::class, 'createUsuario']);
    $r->addRoute('PUT', '/usuarios/{id:\d+}', [UsuarioController::class, 'updateUsuario']);
    $r->addRoute('DELETE', '/usuarios/{id:\d+}', [UsuarioController::class, 'deleteUsuario']);

    // Roles
    $r->addRoute('GET', '/roles', [RolController::class, 'getRoles']);
    $r->addRoute('GET', '/roles/{id:\d+}', [RolController::class, 'getRol']);
    $r->addRoute('POST', '/roles', [RolController::class, 'createRol']);
    $r->addRoute('PUT', '/roles/{id:\d+}', [RolController::class, 'updateRol']);
    $r->addRoute('DELETE', '/roles/{id:\d+}', [RolController::class, 'deleteRol']);
});

// Fetch method and URI from somewhere
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Strip query string (?foo=bar) and decode URI
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

// Para propósitos de este microservicio, asumimos que se corre desde la raíz o ajustamos el path
// Si se usa un subdirectorio como /backend/usuarios/public, ajustarlo aquí o vía .htaccess

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada']);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        
        // Middleware para rutas protegidas
        // EXCEPCIONES: /login y registro de usuarios (POST)
        if ($uri !== '/login' && !($uri === '/usuarios' && $httpMethod === 'POST') && $httpMethod !== 'OPTIONS') {
            AuthMiddleware::handle();
        }

        $controller = new $handler[0]();
        $method = $handler[1];
        call_user_func_array([$controller, $method], $vars);
        break;
}
