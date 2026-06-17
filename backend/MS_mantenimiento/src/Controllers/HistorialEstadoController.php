<?php

namespace App\Controllers;

use App\Models\HistorialEstado;

class HistorialEstadoController {
    public function getHistoriales() {
        echo HistorialEstado::where('activo', true)->get()->toJson();
    }

    public function getHistorial($id) {
        $historial = HistorialEstado::where('id', $id)->where('activo', true)->first();
        if (!$historial) {
            http_response_code(404);
            echo json_encode(['error' => 'Registro de historial no encontrado']);
            return;
        }
        echo $historial->toJson();
    }

    public function createHistorial() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $data['fecha_cambio'] = $data['fecha_cambio'] ?? date('Y-m-d H:i:s');
            $historial = HistorialEstado::create($data);
            http_response_code(201);
            echo $historial->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear historial: ' . $e->getMessage()]);
        }
    }

    public function updateHistorial($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $historial = HistorialEstado::where('id', $id)->where('activo', true)->first();
        if (!$historial) {
            http_response_code(404);
            echo json_encode(['error' => 'Registro no encontrado']);
            return;
        }
        $historial->update($data);
        echo $historial->toJson();
    }

    public function deleteHistorial($id) {
        $historial = HistorialEstado::where('id', $id)->where('activo', true)->first();
        if ($historial) {
            $historial->activo = false;
            $historial->save();
        }
        echo json_encode(['message' => 'Registro desactivado']);
    }
}
