<?php

namespace App\Controllers;

use App\Models\Reportador;

class ReportadorController {
    public function getReportadores() {
        echo Reportador::where('activo', true)->get()->toJson();
    }

    public function getReportador($id) {
        $reportador = Reportador::where('id', $id)->where('activo', true)->first();
        if (!$reportador) {
            http_response_code(404);
            echo json_encode(['error' => 'Reportador no encontrado o inactivo']);
            return;
        }
        echo $reportador->toJson();
    }

    public function createReportador() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            // Reutilización de reportador por correo
            if (isset($data['correo'])) {
                $reportadorExistente = Reportador::where('correo', $data['correo'])->first();
                
                if ($reportadorExistente) {
                    // Actualiza sus datos en caso de que los haya escrito distinto esta vez
                    $reportadorExistente->update([
                        'nombres' => $data['nombres'] ?? $reportadorExistente->nombres,
                        'apellidos' => $data['apellidos'] ?? $reportadorExistente->apellidos,
                        'tipo_reportador' => $data['tipo_reportador'] ?? $reportadorExistente->tipo_reportador,
                        'activo' => true
                    ]);
                    
                    http_response_code(200); // 200 OK (Reutilizado)
                    echo $reportadorExistente->toJson();
                    return;
                }
            }

            // Flujo normal: creación
            $data['activo'] = true;
            $reportador = Reportador::create($data);
            http_response_code(201); // 201 Created
            echo $reportador->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear reportador: ' . $e->getMessage()]);
        }
    }

    public function updateReportador($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Verificar que el nuevo correo no pertenezca a otro reportador
        if (isset($data['correo'])) {
            $existente = Reportador::where('correo', $data['correo'])->where('id', '!=', $id)->first();
            if ($existente) {
                http_response_code(409); // 409 Conflict
                echo json_encode(['error' => 'El correo ingresado ya se encuentra en uso por otro reportador.']);
                return;
            }
        }

        $reportador = Reportador::where('id', $id)->where('activo', true)->first();
        if (!$reportador) {
            http_response_code(404);
            echo json_encode(['error' => 'Reportador no encontrado o inactivo']);
            return;
        }
        $reportador->update($data);
        echo $reportador->toJson();
    }

    public function deleteReportador($id) {
        $reportador = Reportador::where('id', $id)->where('activo', true)->first();
        if (!$reportador) {
            http_response_code(404);
            echo json_encode(['error' => 'Reportador no encontrado o inactivo']);
            return;
        }
        $reportador->activo = false;
        $reportador->save();
        echo json_encode(['message' => 'Reportador desactivado']);
    }
}
