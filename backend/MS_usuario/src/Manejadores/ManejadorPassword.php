<?php

namespace App\Manejadores;

class ManejadorPassword extends ManejadorUsuario {
    protected function validarCampo(array &$data): ?string {
        $password = isset($data['password']) ? trim($data['password']) : '';

        // Si la contraseña está vacía
        if (empty($password)) {
            // Si es edición, se remueve y pasa
            if (isset($data['is_edit']) && $data['is_edit'] === true) {
                unset($data['password']);
                return null;
            }
            // Si es registro nuevo, es obligatoria
            return "La contraseña es obligatoria.";
        }

        // Valida longitud mínima de 8 caracteres
        if (strlen($password) < 8) {
            return "La contraseña debe tener al menos 8 caracteres.";
        }

        // Valida que contenga al menos una letra
        if (!preg_match("/[a-zA-Z]/", $password)) {
            return "La contraseña debe contener al menos una letra.";
        }

        // Valida que contenga al menos un número
        if (!preg_match("/[0-9]/", $password)) {
            return "La contraseña debe contener al menos un número.";
        }

        return null;
    }
}
