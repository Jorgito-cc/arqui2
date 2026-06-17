<?php

namespace App\Manejadores;

class ManejadorRol extends ManejadorUsuario {
    protected function validarCampo(array &$data): ?string {
        $rolId = $data['rol_id'] ?? null;

        if (empty($rolId)) {
            return "El rol del sistema es obligatorio.";
        }

        // Validar que SOLO se pueda registrar personal con el rol de Encargado de Mantenimiento (ID 2)
        if ((int)$rolId !== 2) {
            return "Solo está permitido registrar personal con el rol de Encargado de Mantenimiento.";
        }

        return null;
    }
}
