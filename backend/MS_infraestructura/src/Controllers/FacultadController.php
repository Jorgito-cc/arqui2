<?php

namespace App\Controllers;

use App\Models\Facultad;

class FacultadController {
    public function getFacultades() {
        echo Facultad::where('activo', true)->with(['modulos' => function($q) {
            $q->where('activo', true)->with(['ambientes' => function($q2) {
                $q2->where('activo', true);
            }]);
        }])->get()->toJson();
    }

    public function getFacultad($id) {
        $facultad = Facultad::where('id', $id)->where('activo', true)->with('modulos')->first();
        if (!$facultad) {
            http_response_code(404);
            echo json_encode(['error' => 'Facultad no encontrada o inactiva']);
            return;
        }
        echo $facultad->toJson();
    }

    public function createFacultad() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $facultad = Facultad::create($data);
            http_response_code(201);
            echo $facultad->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear facultad: ' . $e->getMessage()]);
        }
    }

    public function updateFacultad($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $facultad = Facultad::where('id', $id)->where('activo', true)->first();
        if (!$facultad) {
            http_response_code(404);
            echo json_encode(['error' => 'Facultad no encontrada o inactiva']);
            return;
        }
        $facultad->update($data);
        echo $facultad->toJson();
    }

    public function deleteFacultad($id) {
        $facultad = Facultad::where('id', $id)->where('activo', true)->first();
        if (!$facultad) {
            http_response_code(404);
            echo json_encode(['error' => 'Facultad no encontrada o inactiva']);
            return;
        }
        
        $facultad->activo = false;
        $facultad->save();
        
        echo json_encode(['message' => 'Facultad desactivada exitosamente']);
    }
}
