<?php

namespace App\Controllers;

use App\Models\Evidencia;

class EvidenciaController {
    public function getEvidencias() {
        echo Evidencia::where('activo', true)->get()->toJson();
    }

    public function getEvidencia($id) {
        $evidencia = Evidencia::where('id', $id)->where('activo', true)->first();
        if (!$evidencia) {
            http_response_code(404);
            echo json_encode(['error' => 'Evidencia no encontrada']);
            return;
        }
        echo $evidencia->toJson();
    }

    public function createEvidencia() {
        // En php, las peticiones multipart/form-data viajan por $_POST y $_FILES
        $asignacion_id = $_POST['asignacion_id'] ?? null;
        $momento = $_POST['momento'] ?? 'Despues';

        // Validar si existe archivo
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'No se recibió ningún archivo válido.']);
            return;
        }

        if (!$asignacion_id) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el asignacion_id.']);
            return;
        }

        // Crear carpeta de evidencias si no existe
        $targetDir = __DIR__ . '/../../public/evidencia/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        // Generar nombre seguro
        $fileName = uniqid() . '_' . basename($_FILES['foto']['name']);
        $targetFile = $targetDir . $fileName;

        if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetFile)) {
            try {
                $evidencia = Evidencia::create([
                    'url_archivo' => '/evidencia/' . $fileName,
                    'momento' => $momento,
                    'asignacion_id' => $asignacion_id,
                    'activo' => true
                ]);
                http_response_code(201);
                echo $evidencia->toJson();
            } catch (\Exception $e) {
                http_response_code(400);
                echo json_encode(['error' => 'Error al guardar en BD: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al escribir el archivo en el disco.']);
        }
    }

    public function updateEvidencia($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $evidencia = Evidencia::where('id', $id)->where('activo', true)->first();
        if (!$evidencia) {
            http_response_code(404);
            echo json_encode(['error' => 'Registro no encontrado']);
            return;
        }
        $evidencia->update($data);
        echo $evidencia->toJson();
    }

    public function deleteEvidencia($id) {
        $evidencia = Evidencia::where('id', $id)->where('activo', true)->first();
        if ($evidencia) {
            $evidencia->activo = false;
            $evidencia->save();
        }
        echo json_encode(['message' => 'Evidencia desactivada']);
    }
}
