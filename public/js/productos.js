$(document).ready(function() {
  // Initialize DataTables
  $('#productosTable').DataTable();

  // Handle delete product
  $('.delete-button').on('click', function(e) {
    e.preventDefault();
    const productId = $(this).data('id');
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
          url: '/almacen/productos/delete/' + productId, // Adjust this URL based on your routing setup
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

  // Handle edit product
  $(document).on('submit', 'form[id^="editForm"]', function(e) {
    e.preventDefault();
    const form = $(this);
    const productId = form.attr('action').split('/').pop();
    const formData = form.serialize();

    $.ajax({
      url: '/almacen/productos/edit/' + productId, // Adjust this URL based on your routing setup
      method: 'POST',
      data: formData,
      success: function(response) {
        Swal.fire(
          'Actualizado!',
          'El producto ha sido actualizado correctamente.',
          'success'
        ).then(() => {
          location.reload();
        });
      },
      error: function(err) {
        Swal.fire(
          'Error!',
          'No se pudo actualizar el producto.',
          'error'
        );
      }
    });
  });

  // Handle new product form submission
  $('#newProductForm').on('submit', function(e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.ajax({
      url: '/almacen/productos/add', // Adjust this URL based on your routing setup
      method: 'POST',
      data: formData,
      success: function(response) {
        Swal.fire(
          'Producto Agregado!',
          'El nuevo producto ha sido agregado exitosamente.',
          'success'
        ).then(() => {
          location.reload(); // Reload the page to update the product list
        });
      },
      error: function(err) {
        Swal.fire(
          'Error!',
          'No se pudo agregar el producto.',
          'error'
        );
      }
    });
  });

  // Toggle the add product form
  $('#toggleFormBtn').click(function() {
    $('#addProductForm').toggle('slow', function() {
      if ($('#addProductForm').is(':visible')) {
        $('#toggleFormBtn').text('Cancelar');
      } else {
        $('#toggleFormBtn').text('Agregar Producto');
      }
    });
  });
});
