<?php

namespace App\Controllers;

use App\Models\Usuario;
use Firebase\JWT\JWT;

class AuthController {
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['correo']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Correo y contraseña son requeridos']);
            return;
        }

        // Verificar que el usuario esté activo al intentar loguearse
        $usuario = Usuario::where('correo', $data['correo'])
                          ->where('activo', true)
                          ->first();

        if (!$usuario || !password_verify($data['password'], $usuario->password)) {
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales inválidas o cuenta desactivada']);
            return;
        }

        $payload = [
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 horas
            'uid' => $usuario->id,
            'email' => $usuario->correo,
            'rol' => $usuario->rol_id
        ];

        $jwt = JWT::encode($payload, $_ENV['JWT_SECRET'], $_ENV['JWT_ALGORITHM']);

        echo json_encode([
            'message' => 'Login exitoso',
            'token' => $jwt,
            'usuario' => [
                'nombres' => $usuario->nombres,
                'apellidos' => $usuario->apellidos,
                'correo' => $usuario->correo,
                'rol_id' => $usuario->rol_id
            ]
        ]);
    }
}
