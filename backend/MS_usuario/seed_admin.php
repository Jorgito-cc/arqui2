<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Config\Database;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Database\Capsule\Manager as Capsule;

// Inicializar base de datos
Database::boot();

echo "Sembrando roles y usuario Administrador...\n";

try {
    // 1. Crear los roles si no existen
    $roles = [
        ['id' => 1, 'nombre_rol' => 'Decano', 'activo' => true],
        ['id' => 2, 'nombre_rol' => 'Encargado de Mantenimiento', 'activo' => true],
        ['id' => 3, 'nombre_rol' => 'Estudiante', 'activo' => true]
    ];

    foreach ($roles as $rolData) {
        Rol::updateOrCreate(['id' => $rolData['id']], $rolData);
    }
    echo "- Roles creados/actualizados exitosamente.\n";

    // 2. Crear usuario administrador de prueba si no existe (con rol Decano/Admin - ID 1)
    $adminEmail = 'admin@gmail.com';
    
    // Eliminamos si existe un registro viejo inconsistente
    Usuario::where('correo', $adminEmail)->delete();
    
    Usuario::create([
        'nombres' => 'Administrador',
        'apellidos' => 'Sistema',
        'telefono' => '70000000',
        'correo' => $adminEmail,
        'password' => '12345678', // El mutador de Usuario se encarga de encriptarlo con BCRYPT
        'rol_id' => 1, // Decano
        'facultad_id' => 1, // Requerido si el rol es Decano (ID 1)
        'activo' => true
    ]);
    echo "- Usuario Administrador creado: $adminEmail / 12345678\n";

    echo "¡Sembrado completado con éxito!\n";

} catch (\Exception $e) {
    echo "Error en el sembrado: " . $e->getMessage() . "\n";
}
