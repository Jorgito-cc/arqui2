<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ambiente extends Model {
    protected $table = 'ambiente';
    protected $fillable = ['nombre_ambiente', 'piso', 'modulo_id', 'activo'];
    public $timestamps = false;

    public function modulo() {
        return $this->belongsTo(Modulo::class, 'modulo_id');
    }
}
