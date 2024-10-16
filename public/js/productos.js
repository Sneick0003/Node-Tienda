$(document).ready(function() {
  $('#productosTable').DataTable();

  // Manejar la eliminación de productos
  $('.delete-button').on('click', function(e) {
    e.preventDefault(); // Evitar el comportamiento por defecto del enlace
    const productoId = $(this).data('id');
    
    console.log('ID del producto a eliminar:', productoId); // Para depurar

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
          url: '/almacen/productos/delete/' + productoId,
          method: 'DELETE',
          success: function(response) {
            Swal.fire(
              'Eliminado!',
              'El producto ha sido eliminado.',
              'success'
            ).then(() => {
              location.reload();
            });
          },
          error: function(err) {
            console.error('Error al eliminar:', err); // Para depurar
            Swal.fire(
              'Error!',
              'No se pudo eliminar el producto.',
              'error'
            );
          }
        });
      }
    });
  });

  // Manejar la edición de productos
  $('.edit-form').on('submit', function(e) {
    e.preventDefault();
    const form = $(this);
    const productoId = form.attr('action').split('/').pop();
    const formData = form.serialize();

    $.ajax({
      url: '/almacen/productos/edit/' + productoId,
      method: 'POST',
      data: formData,
      success: function(response) {
        Swal.fire(
          'Actualizado!',
          'El producto ha sido actualizado.',
          'success'
        ).then(() => {
          location.reload();
        });
      },
      error: function(err) {
        console.error('Error al actualizar:', err); // Para depurar
        Swal.fire(
          'Error!',
          'No se pudo actualizar el producto.',
          'error'
        );
      }
    });
  });

  // Manejar la creación de nuevos productos
  $('#addProductForm').on('submit', function(e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.ajax({
      url: '/almacen/productos/add',
      method: 'POST',
      data: formData,
      success: function(response) {
        Swal.fire(
          'Creado!',
          'El producto ha sido agregado.',
          'success'
        ).then(() => {
          location.reload();
        });
      },
      error: function(err) {
        console.error('Error al agregar:', err); // Para depurar
        Swal.fire(
          'Error!',
          'No se pudo agregar el producto.',
          'error'
        );
      }
    });
  });
});

// JavaScript para mostrar/ocultar el formulario de creación de productos
document.getElementById('toggleFormBtn').addEventListener('click', function() {
  var form = document.getElementById('addProductForm');
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
    this.textContent = 'Cancelar'; // Cambia el texto del botón
  } else {
    form.style.display = 'none';
    this.textContent = 'Agregar Producto'; // Restaura el texto del botón
  }
});
