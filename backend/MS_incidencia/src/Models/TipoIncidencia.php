<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoIncidencia extends Model {
    protected $table = 'tipo_incidencia';
    protected $fillable = ['nombre_tipo', 'activo'];
    public $timestamps = false;

    public function detalles() {
        return $this->hasMany('App\Models\DetalleProblema', 'tipo_incidencia_id');
    }
}
