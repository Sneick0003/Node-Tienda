// JavaScript para mostrar/ocultar el formulario
document.getElementById('toggleFormBtn').addEventListener('click', function() {
  var form = document.getElementById('addStudentForm');
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
    this.textContent = 'Cancelar'; // Cambia el texto del botón
  } else {
    form.style.display = 'none';
    this.textContent = 'Agregar Alumno'; // Restaura el texto del botón
  }
});
