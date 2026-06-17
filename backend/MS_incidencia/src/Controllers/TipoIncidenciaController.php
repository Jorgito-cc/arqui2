<?php

namespace App\Controllers;

use App\Models\TipoIncidencia;

class TipoIncidenciaController {
    public function getTiposIncidencia() {
        echo TipoIncidencia::where('activo', true)->get()->toJson();
    }

    public function getTipoIncidencia($id) {
        $tipo = TipoIncidencia::where('id', $id)->where('activo', true)->first();
        if (!$tipo) {
            http_response_code(404);
            echo json_encode(['error' => 'Tipo de incidencia no encontrado o inactivo']);
            return;
        }
        echo $tipo->toJson();
    }

    public function createTipoIncidencia() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $tipo = TipoIncidencia::create($data);
            http_response_code(201);
            echo $tipo->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear tipo de incidencia: ' . $e->getMessage()]);
        }
    }

    public function updateTipoIncidencia($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $tipo = TipoIncidencia::where('id', $id)->where('activo', true)->first();
        if (!$tipo) {
            http_response_code(404);
            echo json_encode(['error' => 'Tipo de incidencia no encontrado o inactivo']);
            return;
        }
        $tipo->update($data);
        echo $tipo->toJson();
    }

    public function deleteTipoIncidencia($id) {
        $tipo = TipoIncidencia::where('id', $id)->where('activo', true)->first();
        if (!$tipo) {
            http_response_code(404);
            echo json_encode(['error' => 'Tipo de incidencia no encontrado o inactivo']);
            return;
        }
        $tipo->activo = false;
        $tipo->save();
        echo json_encode(['message' => 'Tipo de incidencia desactivado']);
    }
}
