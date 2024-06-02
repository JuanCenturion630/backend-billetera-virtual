CREATE DATABASE BizonBD;
USE BizonBD;

SELECT * FROM usuarios;

ALTER TABLE usuarios
DROP COLUMN updatedAt;

CREATE TABLE usuarios (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(220) NOT NULL UNIQUE,
    dni VARCHAR(8) NOT NULL UNIQUE,
    cuil VARCHAR(11) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    cvu VARCHAR(30) NOT NULL UNIQUE,
    alias VARCHAR(50) NOT NULL UNIQUE,
    saldo DECIMAL(9,2) NOT NULL
);

CREATE TABLE prestamos (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    monto_pedido DECIMAL(9,2) NOT NULL,
    monto_total DECIMAL(9,2) NOT NULL,
    monto_cuota DECIMAL(9,2) NOT NULL,
    cantidad_cuotas TINYINT NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    usuario_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE transacciones (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME NOT NULL,
    monto DECIMAL(9,2) NOT NULL,
    descripcion VARCHAR(255),
    categoria VARCHAR(20),
    emisor_id BIGINT NOT NULL,
    FOREIGN KEY (emisor_id) REFERENCES usuarios(id),
    receptor_id BIGINT NOT NULL,
    FOREIGN KEY (receptor_id) REFERENCES usuarios(id)
);

CREATE TABLE tarjetas (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    numero VARCHAR(19) NOT NULL UNIQUE,
    fecha_vencimiento DATE NOT NULL,
    codigo_seguridad VARCHAR(3) NOT NULL,
    nombre_titular VARCHAR(50) NOT NULL,
    direccion_facturacion VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios_tarjetas (
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    tarjeta_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (tarjeta_id) REFERENCES tarjetas(id),
    usuario_id BIGINT NOT NULL UNIQUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
