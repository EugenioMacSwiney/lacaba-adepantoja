<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);
    
    $fecha = $input['fecha'] ?? '';
    $hora = $input['hora'] ?? '';
    $personas = $input['personas'] ?? '';
    $email = $input['email'] ?? '';
    if (empty($fecha) || empty($hora) || empty($personas) || empty($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos los campos son obligatorios']);
        exit;
    }
    
    $numero_reserva = 'RES' . date('Ymd') . rand(1000, 9999);
    
    $reserva_guardada = guardarReserva($fecha, $hora, $personas, $email, $numero_reserva);
    
    if ($reserva_guardada) {
 
        $email_enviado = enviarEmailConfirmacion($fecha, $hora, $personas, $email, $numero_reserva);
        
        if ($email_enviado) {
            echo json_encode([
                'success' => true,
                'message' => 'Reserva confirmada y email enviado',
                'numero_reserva' => $numero_reserva
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'message' => 'Reserva confirmada pero no se pudo enviar el email',
                'numero_reserva' => $numero_reserva
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar la reserva']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

function guardarReserva($fecha, $hora, $personas, $email, $numero_reserva) {
    $reserva = [
        'fecha' => $fecha,
        'hora' => $hora,
        'personas' => $personas,
        'email' => $email,
        'numero_reserva' => $numero_reserva,
        'fecha_creacion' => date('Y-m-d H:i:s')
    ];
    
    $reservas = [];
    if (file_exists('reservas.json')) {
        $reservas = json_decode(file_get_contents('reservas.json'), true);
    }
    
    $reservas[] = $reserva;
    file_put_contents('reservas.json', json_encode($reservas, JSON_PRETTY_PRINT));
    
    return true;
}

function enviarEmailConfirmacion($fecha, $hora, $personas, $email, $numero_reserva) {

    $to = $email;
    $subject = 'Confirmación de Reserva - La Cabaña de Pantoja';
    
    $fecha_formateada = date('l, d \d\e F \d\e Y', strtotime($fecha));
    
    $template = file_get_contents('email-template-confirmacion.html');
    
    $template = str_replace('{{fecha}}', $fecha_formateada, $template);
    $template = str_replace('{{hora}}', $hora, $template);
    $template = str_replace('{{personas}}', $personas, $template);
    $template = str_replace('{{numero_reserva}}', $numero_reserva, $template);
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: La Cabaña de Pantoja <reservas@lacabanadepantoja.com>' . "\r\n";
    
    return mail($to, $subject, $template, $headers);
}
?>