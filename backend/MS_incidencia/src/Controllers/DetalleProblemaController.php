<?php

namespace App\Controllers;

use App\Models\DetalleProblema;

/**
 * Controlador de Detalle de Problemas - CLIENTE del Patrón Estado (State)
 * 
 * Este controlador recibe las peticiones HTTP y delega las acciones
 * al modelo DetalleProblema, quien internamente usa el patrón Estado
 * para decidir si la operación es válida o no.
 */
class DetalleProblemaController {
    public function getDetalles() {
        echo DetalleProblema::where('activo', true)->with('nota', 'tipoIncidencia')->get()->toJson();
    }

    public function getDetalle($id) {
        $detalle = DetalleProblema::where('id', $id)->where('activo', true)->with('nota', 'tipoIncidencia')->first();
        if (!$detalle) {
            http_response_code(404);
            echo json_encode(['error' => 'Detalle de problema no encontrado o inactivo']);
            return;
        }
        echo $detalle->toJson();
    }

    public function createDetalle() {
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $data['activo'] = true;
            $data['estado_actual'] = $data['estado_actual'] ?? 'Pendiente';
            $detalle = DetalleProblema::create($data);
            http_response_code(201);
            echo $detalle->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear detalle de problema: ' . $e->getMessage()]);
        }
    }

    public function updateDetalle($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $detalle = DetalleProblema::where('id', $id)->where('activo', true)->first();
        if (!$detalle) {
            http_response_code(404);
            echo json_encode(['error' => 'Detalle de problema no encontrado o inactivo']);
            return;
        }
        $detalle->update($data);
        echo $detalle->toJson();
    }

    public function deleteDetalle($id) {
        $detalle = DetalleProblema::where('id', $id)->where('activo', true)->first();
        if (!$detalle) {
            http_response_code(404);
            echo json_encode(['error' => 'Detalle de problema no encontrado o inactivo']);
            return;
        }
        $detalle->activo = false;
        $detalle->save();
        echo json_encode(['message' => 'Detalle de problema desactivado']);
    }

    // =========================================================
    // ENDPOINTS DEL PATRÓN ESTADO (State) - CU-06
    // =========================================================

    /**
     * POST /detalles/{id}/asignar
     * Asigna un técnico a la incidencia. Solo es válido si está en estado "Pendiente".
     */
    public function asignarPersonal($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $detalle = DetalleProblema::where('id', $id)->where('activo', true)->first();

        if (!$detalle) {
            http_response_code(404);
            echo json_encode(['error' => 'Incidencia no encontrada o inactiva']);
            return;
        }

        $personalId = $data['usuario_id'] ?? null;
        if (!$personalId) {
            http_response_code(400);
            echo json_encode(['error' => 'Se requiere el campo usuario_id para asignar personal.']);
            return;
        }

        // Delegar al Patrón Estado (el modelo decide si la acción es válida)
        $resultado = $detalle->asignarPersonal((int)$personalId);

        // Si el resultado contiene "ERROR", devolver código 400
        if (str_starts_with($resultado, 'ERROR')) {
            http_response_code(400);
            echo json_encode(['error' => $resultado, 'estado_actual' => $detalle->estado_actual]);
        } else {
            echo json_encode([
                'message' => $resultado,
                'estado_actual' => $detalle->estado_actual,
                'incidencia_id' => $detalle->id
            ]);
        }
    }

    /**
     * POST /detalles/{id}/evidencia
     * Agrega evidencia fotográfica. Solo válido en estados "Asignado" o "En Proceso".
     */
    public function agregarEvidencia($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $detalle = DetalleProblema::where('id', $id)->where('activo', true)->first();

        if (!$detalle) {
            http_response_code(404);
            echo json_encode(['error' => 'Incidencia no encontrada o inactiva']);
            return;
        }

        $urlArchivo = $data['url_archivo'] ?? null;
        if (!$urlArchivo) {
            http_response_code(400);
            echo json_encode(['error' => 'Se requiere el campo url_archivo para agregar evidencia.']);
            return;
        }

        // Delegar al Patrón Estado
        $resultado = $detalle->agregarEvidencia($urlArchivo);

        if (str_starts_with($resultado, 'ERROR')) {
            http_response_code(400);
            echo json_encode(['error' => $resultado, 'estado_actual' => $detalle->estado_actual]);
        } else {
            echo json_encode([
                'message' => $resultado,
                'estado_actual' => $detalle->estado_actual,
                'incidencia_id' => $detalle->id
            ]);
        }
    }

    /**
     * POST /detalles/{id}/finalizar
     * Finaliza/cierra la incidencia. Solo válido en estado "En Proceso".
     */
    public function finalizarIncidencia($id) {
        $detalle = DetalleProblema::where('id', $id)->where('activo', true)->first();

        if (!$detalle) {
            http_response_code(404);
            echo json_encode(['error' => 'Incidencia no encontrada o inactiva']);
            return;
        }

        // Delegar al Patrón Estado
        $resultado = $detalle->finalizar();

        if (str_starts_with($resultado, 'ERROR')) {
            http_response_code(400);
            echo json_encode(['error' => $resultado, 'estado_actual' => $detalle->estado_actual]);
        } else {
            echo json_encode([
                'message' => $resultado,
                'estado_actual' => $detalle->estado_actual,
                'incidencia_id' => $detalle->id
            ]);
        }
    }
}
