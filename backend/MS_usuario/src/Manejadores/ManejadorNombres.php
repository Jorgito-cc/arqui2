<?php

namespace App\Manejadores;

class ManejadorNombres extends ManejadorUsuario {
    protected function validarCampo(array &$data): ?string {
        $nombres = trim($data['nombres'] ?? '');
        $apellidos = trim($data['apellidos'] ?? '');

        if (empty($nombres)) {
            return "El nombre es obligatorio.";
        }

        if (empty($apellidos)) {
            return "El apellido es obligatorio.";
        }

        // Expresión regular para permitir letras y espacios (incluyendo acentos y ñ)
        if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/", $nombres)) {
            return "El nombre solo debe contener letras.";
        }

        if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/", $apellidos)) {
            return "El apellido solo debe contener letras.";
        }

        return null;
    }
}
