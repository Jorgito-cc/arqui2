<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\States\EstadoIncidencia;
use App\States\EstadoPendiente;
use App\States\EstadoAsignado;
use App\States\EstadoEnProceso;
use App\States\EstadoFinalizado;

/**
 * Modelo DetalleProblema - CONTEXTO del Patrón Estado (State)
 * 
 * Este modelo contiene internamente un objeto de estado ($estado)
 * que determina su comportamiento ante las acciones del sistema.
 */
class DetalleProblema extends Model {
    protected $table = 'detalle_problema';
    protected $fillable = [
        'descripcion', 
        'estado_actual', 
        'ambiente_id', 
        'nota_id', 
        'tipo_incidencia_id', 
        'activo'
    ];
    public $timestamps = false; // El diagrama no especifica fechas automáticas en detalle

    // Variable interna del Patrón Estado (en memoria, no en BD)
    private ?EstadoIncidencia $estado = null;

    public function nota() {
        return $this->belongsTo('App\Models\NotaProblema', 'nota_id');
    }

    public function tipoIncidencia() {
        return $this->belongsTo('App\Models\TipoIncidencia', 'tipo_incidencia_id');
    }

    // =========================================================
    // MÉTODOS DEL PATRÓN ESTADO
    // =========================================================

    /**
     * Inicializa el objeto de estado en memoria basándose
     * en el valor del campo "estado_actual" de la base de datos.
     */
    public function inicializarEstado(): void {
        switch ($this->estado_actual) {
            case 'Pendiente':
                $this->estado = new EstadoPendiente();
                break;
            case 'Asignado':
                $this->estado = new EstadoAsignado();
                break;
            case 'En Proceso':
                $this->estado = new EstadoEnProceso();
                break;
            case 'Finalizado':
                $this->estado = new EstadoFinalizado();
                break;
            default:
                $this->estado = new EstadoPendiente();
                break;
        }
    }

    /**
     * Cambia el objeto de estado interno (usado por los estados concretos
     * para realizar las transiciones).
     */
    public function setEstado(EstadoIncidencia $nuevoEstado): void {
        $this->estado = $nuevoEstado;
    }

    /**
     * Delega la acción de asignar personal al objeto de estado actual.
     */
    public function asignarPersonal(int $personalId): string {
        $this->inicializarEstado();
        return $this->estado->asignarPersonal($this, $personalId);
    }

    /**
     * Delega la acción de agregar evidencia al objeto de estado actual.
     */
    public function agregarEvidencia(string $urlArchivo): string {
        $this->inicializarEstado();
        return $this->estado->agregarEvidencia($this, $urlArchivo);
    }

    /**
     * Delega la acción de finalizar al objeto de estado actual.
     */
    public function finalizar(): string {
        $this->inicializarEstado();
        return $this->estado->finalizar($this);
    }
}
