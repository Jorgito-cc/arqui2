<?php

namespace App\Controllers;

use App\Models\Rol;

class RolController {
    public function getRoles() {
        echo Rol::where('activo', true)->get()->toJson();
    }

    public function getRol($id) {
        $rol = Rol::where('id', $id)->where('activo', true)->first();
        if (!$rol) {
            http_response_code(404);
            echo json_encode(['error' => 'Rol no encontrado o inactivo']);
            return;
        }
        echo $rol->toJson();
    }

    public function createRol() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $rol = Rol::create($data);
            http_response_code(201);
            echo $rol->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear rol: ' . $e->getMessage()]);
        }
    }

    public function updateRol($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $rol = Rol::where('id', $id)->where('activo', true)->first();
        if (!$rol) {
            http_response_code(404);
            echo json_encode(['error' => 'Rol no encontrado o inactivo']);
            return;
        }
        $rol->update($data);
        echo $rol->toJson();
    }

    public function deleteRol($id) {
        $rol = Rol::where('id', $id)->where('activo', true)->first();
        if (!$rol) {
            http_response_code(404);
            echo json_encode(['error' => 'Rol no encontrado o inactivo']);
            return;
        }
        
        $rol->activo = false;
        $rol->save();
        
        echo json_encode(['message' => 'Rol desactivado exitosamente (eliminación lógica)']);
    }
}
