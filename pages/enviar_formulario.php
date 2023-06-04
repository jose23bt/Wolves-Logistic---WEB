<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $Nombre = $_POST['Nombre'];
  $Correo = $_POST['Correo'];
  $Numero = $_POST['Numero'];
  $Mensaje = $_POST['mensaje'];
  
  // Configura la dirección de correo a la que deseas enviar los datos
  $destinatario = 'mensajeria.wolves@gmail.com';
  
  // Configura el asunto del correo
  $asunto = 'Datos del formulario';
  
  // Crea el contenido del correo
  $mensaje = "Nombre: $Nombre\n";
  $mensaje .= "Correo electrónico: $Correo\n";
  $mensaje .= "Número de Contacto: $Numero\n";
  $mensaje .= "Mensaje: $Mensaje\n";
  
  // Envía el correo
  mail($destinatario, $asunto, $mensaje);
  
  // Redirige al usuario a una página de confirmación o muestra un mensaje de éxito
  echo 'Gracias por enviar el formulario. <br> <a href="https://logisticawolves.com/">Volver a la página web</a>';
}
?>