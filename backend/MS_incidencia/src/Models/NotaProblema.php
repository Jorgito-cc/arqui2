<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotaProblema extends Model {
    protected $table = 'nota_problemas';
    protected $fillable = ['fecha_envio', 'reportador_id', 'activo'];
    public $timestamps = false;

    public function reportador() {
        return $this->belongsTo(Reportador::class, 'reportador_id');
    }

    public function detalles() {
        return $this->hasMany('App\Models\DetalleProblema', 'nota_id');
    }
}
