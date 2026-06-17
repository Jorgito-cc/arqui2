<?php

namespace App\Controllers;

use App\Models\Usuario;
use App\Manejadores\ManejadorNombres;
use App\Manejadores\ManejadorCorreo;
use App\Manejadores\ManejadorPassword;
use App\Manejadores\ManejadorRol;

class UsuarioController {
    public function getUsuarios() {
        echo Usuario::where('activo', true)->with('rol')->get()->toJson();
    }

    public function getUsuario($id) {
        $usuario = Usuario::where('id', $id)->where('activo', true)->with('rol')->first();
        if (!$usuario) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado o inactivo']);
            return;
        }
        echo $usuario->toJson();
    }

    public function createUsuario() {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (is_null($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Cuerpo JSON inválido o vacío']);
            return;
        }

        // Ejecutar Cadena de Responsabilidad (Validaciones de negocio)
        $validador = new ManejadorNombres();
        $validador->setSiguiente(new ManejadorCorreo())
                  ->setSiguiente(new ManejadorPassword())
                  ->setSiguiente(new ManejadorRol());

        $error = $validador->validar($data);
        if ($error !== null) {
            http_response_code(400);
            echo json_encode(['error' => $error]);
            return;
        }



        try {
            $data['activo'] = true;
            $usuario = Usuario::create($data);
            http_response_code(201);
            echo $usuario->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al crear usuario: ' . $e->getMessage()]);
        }
    }

    public function updateUsuario($id) {
        $data = json_decode(file_get_contents('php://input'), true);

        if (is_null($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Cuerpo JSON inválido o vacío']);
            return;
        }

        // Metadatos para indicarle a la cadena que es una edición
        $data['is_edit'] = true;
        $data['id'] = (int)$id;

        // Ejecutar Cadena de Responsabilidad (Validaciones de negocio)
        $validador = new ManejadorNombres();
        $validador->setSiguiente(new ManejadorCorreo())
                  ->setSiguiente(new ManejadorPassword())
                  ->setSiguiente(new ManejadorRol());

        $error = $validador->validar($data);
        if ($error !== null) {
            http_response_code(400);
            echo json_encode(['error' => $error]);
            return;
        }

        // Buscar el usuario a editar
        $usuario = Usuario::where('id', $id)->where('activo', true)->first();
        if (!$usuario) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado o inactivo']);
            return;
        }

        // Remover campos auxiliares antes de actualizar
        unset($data['is_edit']);
        unset($data['id']);

        try {
            $usuario->update($data);
            echo $usuario->toJson();
        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => 'Error al actualizar usuario: ' . $e->getMessage()]);
        }
    }

    public function deleteUsuario($id) {
        $usuario = Usuario::where('id', $id)->where('activo', true)->first();
        if (!$usuario) {
            http_response_code(404);
            echo json_encode(['error' => 'Usuario no encontrado o inactivo']);
            return;
        }
        
        // Eliminación Lógica Manual
        $usuario->activo = false;
        $usuario->save();
        
        echo json_encode(['message' => 'Usuario desactivado exitosamente (eliminación lógica)']);
    }
}
