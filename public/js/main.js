$(document).ready(function() {
  $('#alumnosTable').DataTable();

  // Ejemplo de cómo usar SuitAlert para mostrar alertas
  function showAlert(message, type) {
    Swal.fire({
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }

  // Mostrar alertas si existen
  if (typeof window.mensaje !== 'undefined' && typeof window.tipoMensaje !== 'undefined') {
    showAlert(window.mensaje, window.tipoMensaje);
  }
});
