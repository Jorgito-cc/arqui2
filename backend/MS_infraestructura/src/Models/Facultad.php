<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facultad extends Model {
    protected $table = 'facultad';
    protected $fillable = ['nombre', 'abreviatura', 'activo'];
    public $timestamps = false;

    public function modulos() {
        return $this->hasMany(Modulo::class, 'facultad_id');
    }
}
