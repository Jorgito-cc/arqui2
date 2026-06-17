<?php

namespace App\States;

use App\Models\DetalleProblema;

/**
 * Estado Concreto: ASIGNADO
 * 
 * La incidencia ya tiene un técnico asignado pero aún no inicia trabajo.
 * - Permite: agregarEvidencia() → transiciona a "En Proceso"
 * - Bloquea: asignarPersonal() (ya tiene técnico), finalizar() (no ha iniciado)
 */
class EstadoAsignado extends EstadoIncidencia {

    public function asignarPersonal(DetalleProblema $incidencia, int $personalId): string {
        // BLOQUEADO: Ya existe un técnico asignado
        return "ERROR: La incidencia ya tiene un técnico asignado. No se puede reasignar.";
    }

    public function agregarEvidencia(DetalleProblema $incidencia, string $urlArchivo): string {
        // Transicionar al estado "En Proceso"
        $incidencia->estado_actual = 'En Proceso';
        $incidencia->save();

        return "Evidencia registrada. El técnico inició el trabajo. Estado actual: En Proceso.";
    }

    public function finalizar(DetalleProblema $incidencia): string {
        // BLOQUEADO: Debe iniciarse el proceso de reparación antes
        return "ERROR: No se puede finalizar. El técnico aún no ha iniciado el trabajo de reparación.";
    }

    public function getNombreEstado(): string {
        return 'Asignado';
    }
}
