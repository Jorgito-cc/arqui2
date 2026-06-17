<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model {
    protected $table = 'modulo';
    protected $fillable = ['numero_modulo', 'facultad_id', 'activo'];
    public $timestamps = false;

    public function facultad() {
        return $this->belongsTo(Facultad::class, 'facultad_id');
    }

    public function ambientes() {
        return $this->hasMany(Ambiente::class, 'modulo_id');
    }
}
