<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asignacion extends Model {
    protected $table = 'asignacion';
    protected $fillable = ['fecha_asignacion', 'detalle_problema_id', 'usuario_id', 'activo'];
    public $timestamps = false;

    public function historial() {
        return $this->hasMany('App\Models\HistorialEstado', 'asignacion_id');
    }

    public function evidencias() {
        return $this->hasMany('App\Models\Evidencia', 'asignacion_id');
    }
}
