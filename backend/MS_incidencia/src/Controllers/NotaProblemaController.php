<?php

namespace App\Controllers;

use App\Models\NotaProblema;

class NotaProblemaController {
    public function getNotasProblema() {
        echo NotaProblema::where('activo', true)->with(['reportador', 'detalles.tipoIncidencia'])->get()->toJson();
    }

    public function getNotaProblema($id) {
        $nota = NotaProblema::where('id', $id)->where('activo', true)->with(['reportador', 'detalles.tipoIncidencia'])->first();
        if (!$nota) {
            http_response_code(404);
            echo json_encode(['error' => 'Nota de problema no encontrada o inactiva']);
            return;
        }
        echo $nota->toJson();
    }

    public function createNotaProblema() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $data['fecha_envio'] = $data['fecha_envio'] ?? date('Y-m-d H:i:s');
            $nota = NotaProblema::create($data);
            http_response_code(201);
            echo $nota->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear nota de problema: ' . $e->getMessage()]);
        }
    }

    public function updateNotaProblema($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $nota = NotaProblema::where('id', $id)->where('activo', true)->first();
        if (!$nota) {
            http_response_code(404);
            echo json_encode(['error' => 'Nota de problema no encontrada o inactiva']);
            return;
        }
        $nota->update($data);
        echo $nota->toJson();
    }

    public function deleteNotaProblema($id) {
        $nota = NotaProblema::where('id', $id)->where('activo', true)->first();
        if (!$nota) {
            http_response_code(404);
            echo json_encode(['error' => 'Nota de problema no encontrada o inactiva']);
            return;
        }
        $nota->activo = false;
        $nota->save();
        echo json_encode(['message' => 'Nota de problema desactivada']);
    }
}
