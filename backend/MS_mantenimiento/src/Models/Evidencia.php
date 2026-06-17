<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evidencia extends Model {
    protected $table = 'evidencia';
    protected $fillable = ['url_archivo', 'momento', 'asignacion_id', 'activo'];
    public $timestamps = false;

    public function asignacion() {
        return $this->belongsTo('App\Models\Asignacion', 'asignacion_id');
    }
}
