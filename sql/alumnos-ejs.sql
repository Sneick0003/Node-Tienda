
DROP DATABASE IF EXISTS alumnos_ejs;
CREATE DATABASE alumnos_ejs;
USE alumnos_ejs;

CREATE TABLE alumnos (
    id                  VARCHAR(15) PRIMARY KEY,
    nombre              VARCHAR(50),
    apellidoPaterno     VARCHAR(50),
    apellidoMaterno     VARCHAR(50),
    calificacion1       DECIMAL(5,2),
    calificacion2       DECIMAL(5,2),
    calificacion3       DECIMAL(5,2)
) ENGINE = InnoDB;

CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    contra VARCHAR(255) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
) ENGINE = InnoDB;

CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permiso_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
) ENGINE = InnoDB;

CREATE TABLE usuario_roles (
    usuario_id INT,
    rol_id INT,
    FOREIGN KEY (usuario_id) REFERENCES login(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE = InnoDB;

CREATE TABLE rol_permisos (
    rol_id INT,
    permiso_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
) ENGINE = InnoDB;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad_en_almacen INT NOT NULL,
    cantidad_vendida INT DEFAULT 0
) ENGINE = InnoDB;

CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    cantidad INT,
    fecha_compra  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
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
    ('Miguel', 'migu0313@gmail.com', '1234567890');

INSERT INTO usuario_roles (usuario_id, rol_id)
VALUES 
    (1, 1); -- Usuario 1 es Admin

INSERT INTO rol_permisos (rol_id, permiso_id)
VALUES 
    (1, 1), -- Admin puede Crear
    (1, 2), -- Admin puede Leer
    (1, 3), -- Admin puede Actualizar
    (1, 4); -- Admin puede Eliminar

INSERT INTO alumnos (id, nombre, apellidoPaterno, apellidoMaterno, calificacion1, calificacion2, calificacion3)
VALUES
    ('57231900108', 'Ingrid Lizbeth', 'Garcia', 'Garcia', 8.00, 8.00, 8.00),
    ('57231900157', 'Carlos Arturo', 'Guiterez', 'Tlatempa', 9.00, 9.00, 9.00),
    ('57231900109', 'Pablo Armando', 'Izoteco', 'Salgado', 9.00, 10.00, 10.00),
    ('57231900110', 'Marco Antonio', 'Jimenez', 'Tenorio', 10.00, 10.00, 10.00), 
    ('57231900111', 'Antonio Miguel', 'Marinez', 'Martinez', 10.00, 8.00, 8.00),
    ('57231900112', 'Rogelio', 'Nava', 'Garcia', 9.00, 9.00, 9.00),
    ('57231900113', 'Fernado Angel', 'Rendon', 'Tenorio', 10.00, 10.00, 10.00),
    ('57231900158', 'Andres', 'Rita', 'Rita', 8.00, 8.00, 8.00),
    ('57231900114', 'Edgar A  Alexis', 'Rojas', 'Mateos', 7.00, 7.00, 7.00),
    ('57231900115', 'Eduardo Alejandro', 'Rojas', 'Morales', 9.00, 9.00, 9.00),
    ('57231900116', 'Ederlin', 'Ruiz', 'Angeles', 9.00, 9.00, 9.00),
    ('57231212121', 'Juana', 'Diaz', 'Sanchez', 9.00, 9.00, 9.00);


INSERT INTO productos (nombre, descripcion, precio, cantidad_en_almacen, cantidad_vendida)
VALUES 
    ('Pan Integral', 'Pan hecho con harina integral', 20.00, 50, 10),
    ('Croissant', 'Croissant de mantequilla fresco', 25.00, 30, 5),
    ('Baguette', 'Pan baguette crujiente', 30.00, 40, 7),
    ('Hamburguesa', 'Pan de hamburguesa suave', 15.00, 100, 20),
    ('Galleta', 'Galleta de chocolate casera', 10.00, 200, 50),
    ('Galleta Salada', 'Galleta salada para acompañar', 12.00, 150, 25);

-- Reemplaza 'HASH_GENERADO' con el hash obtenido del paso anterior
UPDATE login
SET contra = '$2b$10$tLzK5knW8ftXV7rB3k5OHevze2VDNquQEmSfMeqzQnW38eIGCLbV2'
WHERE email = 'migu0313@gmail.com';

INSERT INTO compras (producto_id, cantidad)
VALUES (LAST_INSERT_ID(), 5);