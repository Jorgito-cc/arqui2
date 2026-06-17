<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reportador extends Model {
    protected $table = 'reportador';
    protected $fillable = ['nombres', 'apellidos', 'correo', 'tipo_reportador', 'activo'];
    public $timestamps = false; // El diagrama no especifica fechas automáticas

    public function notas() {
        return $this->hasMany('App\Models\NotaProblema', 'reportador_id');
    }
}
