$(document).ready(function() {
  $('#alumnosTable').DataTable();

  // Manejar la eliminación de alumnos
  $('.delete-button').on('click', function(e) {
    e.preventDefault(); // Evitar el comportamiento por defecto del enlace
    const alumnoId = $(this).data('id');
    
    console.log('ID del alumno a eliminar:', alumnoId); // Para depurar

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: '/delete/' + alumnoId,
          method: 'DELETE',
          success: function(response) {
            Swal.fire(
              'Eliminado!',
              'El alumno ha sido eliminado.',
              'success'
            ).then(() => {
              location.reload();
            });
          },
          error: function(err) {
            console.error('Error al eliminar:', err); // Para depurar
            Swal.fire(
              'Error!',
              'No se pudo eliminar el alumno.',
              'error'
            );
          }
        });
      }
    });
  });

  // Manejar la edición de alumnos
  $('.edit-form').on('submit', function(e) {
    e.preventDefault();
    const form = $(this);
    const alumnoId = form.attr('action').split('/').pop();
    const formData = form.serialize();

    $.ajax({
      url: '/edit/' + alumnoId,
      method: 'POST',
      data: formData,
      success: function(response) {
        Swal.fire(
          'Actualizado!',
          'El alumno ha sido actualizado.',
          'success'
        ).then(() => {
          location.reload();
        });
      },
      error: function(err) {
        console.error('Error al actualizar:', err); // Para depurar
        Swal.fire(
          'Error!',
          'No se pudo actualizar el alumno.',
          'error'
        );
      }
    });
  });

  // Manejar la creación de nuevos alumnos
  $('#addStudentForm').on('submit', function(e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.ajax({
      url: '/add',
      method: 'POST',
      data: formData,
      success: function(response) {
        Swal.fire(
          'Creado!',
          'El alumno ha sido agregado.',
          'success'
        ).then(() => {
          location.reload();
        });
      },
      error: function(err) {
        console.error('Error al agregar:', err); // Para depurar
        Swal.fire(
          'Error!',
          'No se pudo agregar el alumno.',
          'error'
        );
      }
    });
  });
});
