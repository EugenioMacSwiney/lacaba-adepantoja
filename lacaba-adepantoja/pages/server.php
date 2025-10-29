<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

define('RESERVAS_FILE', 'reservas.json');
define('BACKUP_DIR', 'backups/');

if (!file_exists(BACKUP_DIR)) {
    mkdir(BACKUP_DIR, 0755, true);
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'get_reservas') {
            getReservas();
        } elseif ($action === 'get_reserva') {
            getReserva($_GET['id'] ?? '');
        } else {
            getReservas();
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($action === 'crear_reserva') {
            crearReserva($input);
        } elseif ($action === 'actualizar_reserva') {
            actualizarReserva($input);
        } elseif ($action === 'eliminar_reserva') {
            eliminarReserva($input['id'] ?? '');
        } else {
            crearReserva($input);
        }
        break;
        
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        actualizarReserva($input);
        break;
        
    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        eliminarReserva($input['id'] ?? '');
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}

function getReservas() {
    $reservas = cargarReservas();
    echo json_encode(['reservas' => $reservas]);
}

function getReserva($id) {
    $reservas = cargarReservas();
    $reserva = array_filter($reservas, function($r) use ($id) {
        return $r['id'] === $id;
    });
    
    if (empty($reserva)) {
        http_response_code(404);
        echo json_encode(['error' => 'Reserva no encontrada']);
        return;
    }
    
    echo json_encode(['reserva' => array_values($reserva)[0]]);
}

function crearReserva($data) {

    if (empty($data['fecha']) || empty($data['hora']) || empty($data['personas']) || empty($data['email'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos los campos son obligatorios']);
        return;
    }
    
    $id = uniqid('res_', true);
    $numero_reserva = 'RES' . date('Ymd') . rand(1000, 9999);
    
    $nuevaReserva = [
        'id' => $id,
        'numero_reserva' => $numero_reserva,
        'fecha' => $data['fecha'],
        'hora' => $data['hora'],
        'personas' => intval($data['personas']),
        'email' => $data['email'],
        'nombre' => $data['nombre'] ?? '',
        'telefono' => $data['telefono'] ?? '',
        'comentarios' => $data['comentarios'] ?? '',
        'estado' => 'confirmada',
        'fecha_creacion' => date('Y-m-d H:i:s'),
        'fecha_actualizacion' => date('Y-m-d H:i:s')
    ];
    
    $reservas = cargarReservas();
    $reservas[] = $nuevaReserva;
    

    if (guardarReservas($reservas)) {

        $emailEnviado = enviarEmailConfirmacion($nuevaReserva);
        
        echo json_encode([
            'success' => true,
            'message' => 'Reserva creada exitosamente',
            'reserva' => $nuevaReserva,
            'email_enviado' => $emailEnviado
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar la reserva']);
    }
}

function actualizarReserva($data) {
    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de reserva requerido']);
        return;
    }
    
    $reservas = cargarReservas();
    $encontrada = false;
    
    foreach ($reservas as &$reserva) {
        if ($reserva['id'] === $data['id']) {
            $reserva['fecha'] = $data['fecha'] ?? $reserva['fecha'];
            $reserva['hora'] = $data['hora'] ?? $reserva['hora'];
            $reserva['personas'] = intval($data['personas'] ?? $reserva['personas']);
            $reserva['email'] = $data['email'] ?? $reserva['email'];
            $reserva['nombre'] = $data['nombre'] ?? $reserva['nombre'];
            $reserva['telefono'] = $data['telefono'] ?? $reserva['telefono'];
            $reserva['comentarios'] = $data['comentarios'] ?? $reserva['comentarios'];
            $reserva['estado'] = $data['estado'] ?? $reserva['estado'];
            $reserva['fecha_actualizacion'] = date('Y-m-d H:i:s');
            $encontrada = true;
            break;
        }
    }
    
    if (!$encontrada) {
        http_response_code(404);
        echo json_encode(['error' => 'Reserva no encontrada']);
        return;
    }
    
    if (guardarReservas($reservas)) {
        echo json_encode([
            'success' => true,
            'message' => 'Reserva actualizada exitosamente',
            'reserva' => $reserva
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar la reserva']);
    }
}

function eliminarReserva($id) {
    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de reserva requerido']);
        return;
    }
    
    $reservas = cargarReservas();
    $nuevasReservas = array_filter($reservas, function($reserva) use ($id) {
        return $reserva['id'] !== $id;
    });
    
    if (count($nuevasReservas) === count($reservas)) {
        http_response_code(404);
        echo json_encode(['error' => 'Reserva no encontrada']);
        return;
    }
    
    if (guardarReservas(array_values($nuevasReservas))) {
        echo json_encode([
            'success' => true,
            'message' => 'Reserva eliminada exitosamente'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al eliminar la reserva']);
    }
}

function cargarReservas() {
    if (!file_exists(RESERVAS_FILE)) {
        return [];
    }
    
    $contenido = file_get_contents(RESERVAS_FILE);
    return json_decode($contenido, true) ?: [];
}

function guardarReservas($reservas) {

    crearBackup();
    
    return file_put_contents(RESERVAS_FILE, json_encode($reservas, JSON_PRETTY_PRINT)) !== false;
}

function crearBackup() {
    if (file_exists(RESERVAS_FILE)) {
        $backupFile = BACKUP_DIR . 'reservas_backup_' . date('Y-m-d_H-i-s') . '.json';
        copy(RESERVAS_FILE, $backupFile);
    }
}

function enviarEmailConfirmacion($reserva) {

    $to = $reserva['email'];
    $subject = 'Confirmación de Reserva - La Cabaña de Pantoja';
    

    $fecha_formateada = date('l, d \d\e F \d\e Y', strtotime($reserva['fecha']));
    

    $template = file_get_contents('email-template-confirmacion.html');
    

    $template = str_replace('{{fecha}}', $fecha_formateada, $template);
    $template = str_replace('{{hora}}', $reserva['hora'], $template);
    $template = str_replace('{{personas}}', $reserva['personas'], $template);
    $template = str_replace('{{numero_reserva}}', $reserva['numero_reserva'], $template);
    

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= 'From: La Cabaña de Pantoja <reservas@lacabanadepantoja.com>' . "\r\n";
    

    return mail($to, $subject, $template, $headers);
}
?>