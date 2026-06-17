<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model {
    protected $table = 'rol';
    protected $fillable = ['nombre_rol', 'activo'];
    public $timestamps = false;

    public function usuarios() {
        return $this->hasMany(Usuario::class, 'rol_id');
    }
}
