<?php

namespace App\Manejadores;

class ManejadorCorreo extends ManejadorUsuario {
    protected function validarCampo(array &$data): ?string {
        $correo = trim($data['correo'] ?? '');

        if (empty($correo)) {
            return "El correo electrónico es obligatorio.";
        }

        // Valida formato de email estándar
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return "El formato del correo electrónico es inválido.";
        }

        // Validación de negocio adicional: solo permitir dominios @gmail.com
        if (!str_ends_with($correo, '@gmail.com')) {
            return "El correo debe pertenecer al dominio @gmail.com.";
        }

        return null;
    }
}
