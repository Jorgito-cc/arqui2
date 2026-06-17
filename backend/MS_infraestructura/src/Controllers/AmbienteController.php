<?php

namespace App\Controllers;

use App\Models\Ambiente;

class AmbienteController {
    public function getAmbientes() {
        echo Ambiente::where('activo', true)->with('modulo')->get()->toJson();
    }

    public function getAmbiente($id) {
        $ambiente = Ambiente::where('id', $id)->where('activo', true)->with('modulo')->first();
        if (!$ambiente) {
            http_response_code(404);
            echo json_encode(['error' => 'Ambiente no encontrado o inactivo']);
            return;
        }
        echo $ambiente->toJson();
    }

    public function createAmbiente() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $ambiente = Ambiente::create($data);
            http_response_code(201);
            echo $ambiente->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear ambiente: ' . $e->getMessage()]);
        }
    }

    public function updateAmbiente($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $ambiente = Ambiente::where('id', $id)->where('activo', true)->first();
        if (!$ambiente) {
            http_response_code(404);
            echo json_encode(['error' => 'Ambiente no encontrado o inactivo']);
            return;
        }
        $ambiente->update($data);
        echo $ambiente->toJson();
    }

    public function deleteAmbiente($id) {
        $ambiente = Ambiente::where('id', $id)->where('activo', true)->first();
        if (!$ambiente) {
            http_response_code(404);
            echo json_encode(['error' => 'Ambiente no encontrado o inactivo']);
            return;
        }
        
        $ambiente->activo = false;
        $ambiente->save();
        
        echo json_encode(['message' => 'Ambiente desactivado exitosamente']);
    }
}
