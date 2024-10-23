DROP DATABASE IF EXISTS alumnos_ejs;
CREATE DATABASE alumnos_ejs;
USE alumnos_ejs;

CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    contra VARCHAR(255) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permiso_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

CREATE TABLE usuario_roles (
    usuario_id INT,
    rol_id INT,
    FOREIGN KEY (usuario_id) REFERENCES login(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE rol_permisos (
    rol_id INT,
    permiso_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad_en_almacen INT NOT NULL,
    cantidad_vendida INT DEFAULT 0
);

CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    usuario_id INT,  -- Nueva columna para almacenar el ID del usuario
    cantidad INT,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES login(id)  -- Clave foránea que refiere a la tabla login
) ENGINE = InnoDB;

INSERT INTO roles (rol_nombre, descripcion)
VALUES 
    ('Admin', 'Administrador con acceso total'),
    ('Comprador', 'Acceso limitado');

INSERT INTO permisos (permiso_nombre, descripcion)
VALUES 
    ('Crear', 'Permiso para crear nuevos registros'),
    ('Leer', 'Permiso para leer registros'),
    ('Actualizar', 'Permiso para actualizar registros'),
    ('Eliminar', 'Permiso para eliminar registros');

INSERT INTO login (nombre, email, contra)
VALUES
    ('Miguel', 'example@gmail.com', '1234567890');

INSERT INTO usuario_roles (usuario_id, rol_id)
VALUES 
    (1, 1); -- Usuario 1 es Admin

INSERT INTO rol_permisos (rol_id, permiso_id)
VALUES 
    (1, 1), -- Admin puede Crear
    (1, 2), -- Admin puede Leer
    (1, 3), -- Admin puede Actualizar
    (1, 4); -- Admin puede Eliminar


INSERT INTO productos (nombre, descripcion, precio, cantidad_en_almacen, cantidad_vendida)
VALUES 
    ('Pan Integral', 'Pan hecho con harina integral', 20.00, 50, 10),
    ('Croissant', 'Croissant de mantequilla fresco', 25.00, 30, 5),
    ('Baguette', 'Pan baguette crujiente', 30.00, 40, 7),
    ('Hamburguesa', 'Pan de hamburguesa suave', 15.00, 100, 20),
    ('Galleta', 'Galleta de chocolate casera', 10.00, 200, 50),
    ('Galleta Salada', 'Galleta salada para acompañar', 12.00, 150, 25);

UPDATE login
SET contra = '$2b$10$tLzK5knW8ftXV7rB3k5OHevze2VDNquQEmSfMeqzQnW38eIGCLbV2' 
WHERE email = 'example@gmail.com';

-- Asegúrate de insertar el usuario_id en la tabla compras
INSERT INTO compras (producto_id, usuario_id, cantidad)
VALUES (1, 1, 5);