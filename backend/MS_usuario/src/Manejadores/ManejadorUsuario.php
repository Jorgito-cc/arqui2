<?php

namespace App\Manejadores;

abstract class ManejadorUsuario {
    private ?ManejadorUsuario $siguiente = null;

    // Método para encadenar el siguiente manejador
    public function setSiguiente(ManejadorUsuario $manejador): ManejadorUsuario {
        $this->siguiente = $manejador;
        return $manejador;
    }

    // Método plantilla que ejecuta la validación y continúa la cadena
    public function validar(array &$data): ?string {
        $error = $this->validarCampo($data);
        
        if ($error !== null) {
            return $error; // Se detiene la cadena y devuelve el error
        }

        // Si no hay error y existe un siguiente, continúa la cadena
        return $this->siguiente ? $this->siguiente->validar($data) : null;
    }

    // Método abstracto a implementar por cada manejador concreto
    protected abstract function validarCampo(array &$data): ?string;
}
