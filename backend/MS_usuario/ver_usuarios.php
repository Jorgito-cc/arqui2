<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Config\Database;
use App\Models\Usuario;

Database::boot();

echo "=== USUARIOS REGISTRADOS EN LA BD ===\n";
try {
    $usuarios = Usuario::all();
    foreach ($usuarios as $u) {
        echo "ID: {$u->id} | Nombre: {$u->nombres} {$u->apellidos} | Correo: {$u->correo} | Rol ID: {$u->rol_id}\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
