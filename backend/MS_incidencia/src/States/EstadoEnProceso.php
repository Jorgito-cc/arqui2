<?php

namespace App\States;

use App\Models\DetalleProblema;

/**
 * Estado Concreto: EN PROCESO
 * 
 * El técnico está trabajando activamente en la reparación.
 * - Permite: agregarEvidencia() (sin cambiar estado, solo documenta avance)
 * - Permite: finalizar() → transiciona a "Finalizado"
 * - Bloquea: asignarPersonal() (ya está en proceso)
 */
class EstadoEnProceso extends EstadoIncidencia {

    public function asignarPersonal(DetalleProblema $incidencia, int $personalId): string {
        // BLOQUEADO: La incidencia ya está en proceso de reparación
        return "ERROR: La incidencia ya está en proceso de reparación. No se puede reasignar.";
    }

    public function agregarEvidencia(DetalleProblema $incidencia, string $urlArchivo): string {
        // PERMITIDO: Se pueden agregar más fotos de avance sin cambiar el estado
        return "Evidencia de avance registrada correctamente. Estado actual: En Proceso.";
    }

    public function finalizar(DetalleProblema $incidencia): string {
        // Transicionar al estado "Finalizado"
        $incidencia->estado_actual = 'Finalizado';
        $incidencia->save();

        return "Incidencia finalizada con éxito. La orden de trabajo ha sido cerrada. Estado actual: Finalizado.";
    }

    public function getNombreEstado(): string {
        return 'En Proceso';
    }
}
