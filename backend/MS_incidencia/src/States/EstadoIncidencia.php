<?php

namespace App\States;

use App\Models\DetalleProblema;

/**
 * Interfaz del Patrón Estado (State) - GoF
 * 
 * Define las acciones que cambian de comportamiento
 * según el estado actual de la incidencia.
 */
abstract class EstadoIncidencia {

    /**
     * Acción: Asignar un técnico a la incidencia.
     */
    abstract public function asignarPersonal(DetalleProblema $incidencia, int $personalId): string;

    /**
     * Acción: Agregar evidencia fotográfica a la incidencia.
     */
    abstract public function agregarEvidencia(DetalleProblema $incidencia, string $urlArchivo): string;

    /**
     * Acción: Finalizar/cerrar la incidencia.
     */
    abstract public function finalizar(DetalleProblema $incidencia): string;

    /**
     * Retorna el nombre del estado actual como texto.
     */
    abstract public function getNombreEstado(): string;
}
