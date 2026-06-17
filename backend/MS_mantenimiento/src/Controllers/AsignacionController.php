<?php

namespace App\Controllers;

use App\Models\Asignacion;

class AsignacionController {
    public function getAsignaciones() {
        echo Asignacion::where('activo', true)->with('historial', 'evidencias')->get()->toJson();
    }

    public function getAsignacion($id) {
        $asignacion = Asignacion::where('id', $id)->where('activo', true)->with('historial', 'evidencias')->first();
        if (!$asignacion) {
            http_response_code(404);
            echo json_encode(['error' => 'Asignación no encontrada']);
            return;
        }
        echo $asignacion->toJson();
    }

    public function createAsignacion() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $data['fecha_asignacion'] = $data['fecha_asignacion'] ?? date('Y-m-d H:i:s');
            $asignacion = Asignacion::create($data);
            
            http_response_code(201);
            echo $asignacion->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear asignación: ' . $e->getMessage()]);
        }
    }

    // Nota: No se implementan update ni destroy por requerimientos del modelo de negocio
}
