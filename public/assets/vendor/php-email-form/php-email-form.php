use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

<?php


// require 'vendor/autoload.php';

// Check if form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.example.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@example.com';
        $mail->Password = 'your-email-password';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // Recipients
        $mail->setFrom('your-email@example.com', 'Your Name');
        $mail->addAddress('recipient@example.com', 'Recipient Name');

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = "Name: $name<br>Email: $email<br>Message: $message";

        // Send the email
        $mail->send();

        echo 'Message has been sent successfully!';
    } catch (Exception $e) {
        echo 'Message could not be sent. Error: ', $mail->ErrorInfo;
    }
}

?>