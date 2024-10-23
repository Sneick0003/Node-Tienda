-- Elimina la base de datos si existe y crea una nueva
DROP DATABASE IF EXISTS alumnos_ejs;
CREATE DATABASE alumnos_ejs;
USE alumnos_ejs;

-- Creación de la tabla login
CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    contra VARCHAR(255) NOT NULL
);

-- Creación de la tabla roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla permisos
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permiso_nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla usuario_roles
CREATE TABLE usuario_roles (
    usuario_id INT,
    rol_id INT,
    FOREIGN KEY (usuario_id) REFERENCES login(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Creación de la tabla rol_permisos
CREATE TABLE rol_permisos (
    rol_id INT,
    permiso_id INT,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    FOREIGN KEY (permiso_id) REFERENCES permisos(id)
);

-- Creación de la tabla productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad_en_almacen INT NOT NULL,
    cantidad_vendida INT DEFAULT 0
);

-- Creación de la tabla compras
CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    usuario_id INT,
    cantidad INT,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (usuario_id) REFERENCES login(id)
) ENGINE = InnoDB;

-- Creación de la tabla categorias
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Creación de la tabla ofertas
CREATE TABLE ofertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    descuento DECIMAL(5, 2) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Creación de la tabla imagenes
CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    url_imagen VARCHAR(255) NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Relación entre productos y categorías
ALTER TABLE productos ADD categoria_id INT;
ALTER TABLE productos ADD FOREIGN KEY (categoria_id) REFERENCES categorias(id);

-- Inserciones iniciales
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
    (1, 1);

INSERT INTO rol_permisos (rol_id, permiso_id)
VALUES 
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);

INSERT INTO productos (nombre, descripcion, precio, cantidad_en_almacen, cantidad_vendida)
VALUES 
    ('Pan Integral', 'Pan hecho con harina integral', 20.00, 50, 10),
    ('Croissant', 'Croissant de mantequilla fresco', 25.00, 30, 5),
    ('Baguette', 'Pan baguette crujiente', 30.00, 40, 7),
    ('Hamburguesa', 'Pan de hamburguesa suave', 15.00, 100, 20),
    ('Galleta', 'Galleta de chocolate casera', 10.00, 200, 50),
    ('Galleta Salada', 'Galleta salada para acompañar', 12.00, 150, 25);

-- Asegúrate de insertar el usuario_id en la tabla compras
INSERT INTO compras (producto_id, usuario_id, cantidad)
VALUES (1, 1, 5);

-- Actualizar contraseñas para mayor seguridad
UPDATE login
SET contra = '$2b$10$tLzK5knW8ftXV7rB3k5OHevze2VDNquQEmSfMeqzQnW38eIGCLbV2' 
WHERE email = 'example@gmail.com';

-- Insertar categorías
INSERT INTO categorias (nombre, descripcion)
VALUES
    ('Panadería', 'Productos frescos de panadería'),
    ('Repostería', 'Dulces y pasteles para todo tipo de ocasión');

-- Actualizar productos existentes con categorías
UPDATE productos SET categoria_id = 1 WHERE nombre LIKE '%Pan%';
UPDATE productos SET categoria_id = 2 WHERE nombre IN ('Croissant', 'Galleta', 'Galleta Salada');

-- Insertar ofertas
INSERT INTO ofertas (producto_id, descuento, descripcion, fecha_inicio, fecha_fin)
VALUES
    (1, 10.00, '10% de descuento en Pan Integral', '2024-01-01 00:00:00', '2024-01-31 23:59:59');

