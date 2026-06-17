<?php

namespace App\States;

use App\Models\DetalleProblema;

/**
 * Estado Concreto: FINALIZADO
 * 
 * La incidencia ha sido resuelta y cerrada.
 * - Bloquea: TODAS las acciones. La orden ya está cerrada.
 */
class EstadoFinalizado extends EstadoIncidencia {

    public function asignarPersonal(DetalleProblema $incidencia, int $personalId): string {
        // BLOQUEADO: La incidencia ya fue resuelta
        return "ERROR: La incidencia ya ha sido resuelta y cerrada. No se puede asignar personal.";
    }

    public function agregarEvidencia(DetalleProblema $incidencia, string $urlArchivo): string {
        // BLOQUEADO: No se pueden subir fotos a una incidencia cerrada
        return "ERROR: No se pueden agregar evidencias. La incidencia ya ha sido finalizada.";
    }

    public function finalizar(DetalleProblema $incidencia): string {
        // BLOQUEADO: Ya está cerrada
        return "ERROR: La incidencia ya fue finalizada anteriormente. No se puede cerrar dos veces.";
    }

    public function getNombreEstado(): string {
        return 'Finalizado';
    }
}
