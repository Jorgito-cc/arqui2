<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialEstado extends Model {
    protected $table = 'historial_estados';
    protected $fillable = [
        'tipo', 
        'estado', 
        'fecha_cambio', 
        'comentario_tecnico', 
        'asignacion_id', 
        'activo'
    ];
    public $timestamps = false;

    public function asignacion() {
        return $this->belongsTo('App\Models\Asignacion', 'asignacion_id');
    }
}
