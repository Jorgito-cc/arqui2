<?php

namespace App\States;

use App\Models\DetalleProblema;

/**
 * Estado Concreto: PENDIENTE
 * 
 * La incidencia fue reportada pero aún no tiene técnico asignado.
 * - Permite: asignarPersonal() → transiciona a "Asignado"
 * - Bloquea: agregarEvidencia(), finalizar()
 */
class EstadoPendiente extends EstadoIncidencia {

    public function asignarPersonal(DetalleProblema $incidencia, int $personalId): string {
        // Transicionar al estado "Asignado"
        $incidencia->estado_actual = 'Asignado';
        $incidencia->save();

        return "Técnico asignado correctamente. Estado actual: Asignado.";
    }

    public function agregarEvidencia(DetalleProblema $incidencia, string $urlArchivo): string {
        // BLOQUEADO: No se puede documentar sin técnico asignado
        return "ERROR: No se puede agregar evidencia. La incidencia está pendiente y no tiene técnico asignado.";
    }

    public function finalizar(DetalleProblema $incidencia): string {
        // BLOQUEADO: No se puede cerrar algo que no ha iniciado
        return "ERROR: No se puede finalizar. La incidencia aún está pendiente de asignación.";
    }

    public function getNombreEstado(): string {
        return 'Pendiente';
    }
}
