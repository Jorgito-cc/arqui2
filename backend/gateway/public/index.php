<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Middleware\AuthMiddleware;
use Dotenv\Dotenv;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Desactivar warnings depreciados para evitar corromper las respuestas JSON en PHP 8.4+
error_reporting(E_ALL & ~E_DEPRECATED);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Limpiar la URI
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

// Definir mapeo de rutas a microservicios
$routes = [
    //microservicio de usuarios
    '/api/usuarios' => $_ENV['USERS_SERVICE_URL'],
    '/api/login' => $_ENV['USERS_SERVICE_URL'],
    '/api/roles' => $_ENV['USERS_SERVICE_URL'],
    
    //microservicio de ubicacion
    '/api/ubicacion' => $_ENV['UBICACION_SERVICE_URL'],
    '/api/facultades' => $_ENV['UBICACION_SERVICE_URL'],
    '/api/modulos' => $_ENV['UBICACION_SERVICE_URL'],
    '/api/ambientes' => $_ENV['UBICACION_SERVICE_URL'],
    
    // Microservicio de Reportes (PUBLICO)
    '/api/reportadores' => $_ENV['REPORTE_SERVICE_URL'],
    '/api/tipos-incidencia' => $_ENV['REPORTE_SERVICE_URL'],
    '/api/notas' => $_ENV['REPORTE_SERVICE_URL'],
    '/api/detalles' => $_ENV['REPORTE_SERVICE_URL'],
    
    // Microservicio de Gestión y Evidencia (PRIVADO)
    '/api/asignaciones' => $_ENV['GESTION_SERVICE_URL'],
    '/api/historial' => $_ENV['GESTION_SERVICE_URL'],
    '/api/evidencias' => $_ENV['GESTION_SERVICE_URL'],
];

$targetService = null;
$targetPath = $uri;

foreach ($routes as $prefix => $url) {
    if (strpos($uri, $prefix) === 0) {
        $targetService = $url;
        // Quitar el prefijo /api para el microservicio
        // Si la ruta es /api/reportes/notas, pasará como /reportes/notas
        $targetPath = str_replace('/api', '', $uri);
        break;
    }
}

if (!$targetService) {
    http_response_code(404);
    echo json_encode(['error' => 'Ruta no mapeada en el Gateway']);
    exit();
}

// Validación de Seguridad (JWT)
// EXCEPCIONES: /api/login, registro de usuarios (POST), reportes (Públicas) y listado de ubicaciones (GET)
$isPublic = (
    $uri === '/api/login' || 
    ($uri === '/api/usuarios' && $method === 'POST') || 
    strpos($uri, '/api/reportadores') === 0 ||
    strpos($uri, '/api/tipos-incidencia') === 0 ||
    strpos($uri, '/api/notas') === 0 ||
    strpos($uri, '/api/detalles') === 0 ||
    ($method === 'GET' && (strpos($uri, '/api/facultades') === 0 || strpos($uri, '/api/modulos') === 0 || strpos($uri, '/api/ambientes') === 0))
);

if (!$isPublic) {
    AuthMiddleware::handle();
}

// Función para reenviar la petición (Proxy) 
function proxyRequest($url, $method, $data = null) {
    $ch = curl_init($url);
    
    // Filtrar headers originales para evitar conflictos (especialmente 'Host')
    $headers = [];
    $excludeHeaders = ['host', 'content-length', 'connection'];
    
    // Si los datos son un arreglo (cURL genera su propio boundary multipart, por lo que bloqueamos la cabecera vieja)
    if (is_array($data)) {
        $excludeHeaders[] = 'content-type';
    }
    
    foreach (getallheaders() as $key => $value) {
        if (!in_array(strtolower($key), $excludeHeaders)) {
            $headers[] = "$key: $value";
        }
    }

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    if ($data && ($method === 'POST' || $method === 'PUT')) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        http_response_code(502);
        echo json_encode(['error' => 'Error de conexión con el microservicio: ' . curl_error($ch)]);
        curl_close($ch);
        exit();
    }

    curl_close($ch);
    http_response_code($httpCode);
    return $response;
}

// Obtener datos del cuerpo
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos(strtolower($contentType), 'multipart/form-data') !== false) {
    // Si es multipart, reconstruimos los datos con las variables nativas PHP
    $inputData = $_POST;
    // Anexamos los archivos fisicos a nivel de sistema usando CurlFile
    foreach ($_FILES as $key => $file) {
        if ($file['error'] === UPLOAD_ERR_OK) {
            $inputData[$key] = new \CURLFile($file['tmp_name'], $file['type'], $file['name']);
        }
    }
} else {
    // Si es puro JSON, leemos de la entrada cruda stringificada
    $inputData = file_get_contents('php://input');
}

// Ejecutar el proxy
$targetUrl = $targetService . $targetPath;
$response = proxyRequest($targetUrl, $method, $inputData);

echo $response;
