<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model {
    protected $table = 'usuarios';
    protected $fillable = [
        'nombres',
        'apellidos',
        'telefono',
        'correo',
        'password',
        'rol_id',
        'facultad_id',
        'activo'
    ];
    public $timestamps = false;

    // Mutador para encriptar la contraseña automáticamente
    public function setPasswordAttribute($value) {
        $this->attributes['password'] = password_hash($value, PASSWORD_BCRYPT);
    }

    public function rol() {
        return $this->belongsTo(Rol::class, 'rol_id');
    }
}
