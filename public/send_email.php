<?php
// send_email.php - Simple PHP email handler
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    // Validate required fields
    if (empty($data['firstName']) || empty($data['lastName']) || empty($data['email']) || empty($data['phone'])) {
        http_response_code(400);
        echo json_encode(['error' => 'חסרים שדות חובה']);
        exit;
    }
    
    // Email configuration
    $to = 'yuval056@gmail.com';
    $subject = 'בקשת הצעת מחיר מהאתר - ' . $data['firstName'] . ' ' . $data['lastName'];
    
    // Email content in Hebrew
    $message = "שלום מושיקו,\n\n";
    $message .= "קיבלת בקשה חדשה להצעת מחיר מהאתר:\n\n";
    $message .= "שם: " . $data['firstName'] . ' ' . $data['lastName'] . "\n";
    $message .= "אימייל: " . $data['email'] . "\n";
    $message .= "טלפון: " . $data['phone'] . "\n";
    
    if (!empty($data['message'])) {
        $message .= "\nהודעה:\n" . $data['message'] . "\n";
    }
    
    $message .= "\n---\n";
    $message .= "נשלח מהאתר של ידיים הדבקות והפקות דפוס\n";
    
    // Email headers
    $headers = array(
        'From: no-reply@' . $_SERVER['HTTP_HOST'],
        'Reply-To: ' . $data['email'],
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit'
    );
    
    // Send email
    if (mail($to, $subject, $message, implode("\r\n", $headers))) {
        echo json_encode(['success' => true, 'message' => 'הבקשה נשלחה בהצלחה']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'שגיאה בשליחת האימייל']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>