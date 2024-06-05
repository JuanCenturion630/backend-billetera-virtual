CREATE DATABASE bizonbd;
USE bizonbd;

DROP DATABASE bizonbd;
SELECT * FROM usuarios;
SELECT * FROM transacciones;
UPDATE usuarios SET saldo=saldo+25000 WHERE email="centurion.juan128@gmail.com";
INSERT INTO transacciones(fecha,monto,descripcion,categoria,emisor_id,receptor_id,createdAt,updatedAt) 
VALUES ("2024-06-05 00:59:00",300,"Probando","Test",1,2,"2024-06-05 00:00:00","2024-06-05 00:00:01");
SHOW CREATE TABLE transacciones;

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
