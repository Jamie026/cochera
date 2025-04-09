-- Eliminar las tablas si existen
DROP TABLE IF EXISTS coche;
DROP TABLE IF EXISTS verificacion;
DROP TABLE IF EXISTS contrato;
DROP TABLE IF EXISTS reserva;
DROP TABLE IF EXISTS cochera;
DROP TABLE IF EXISTS usuario;

-- Crear la tabla `usuario`
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Crear la tabla `cochera`
CREATE TABLE cochera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    distrito VARCHAR(255) NOT NULL,
    espacio_m2 DECIMAL(10, 2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);

-- Crear la tabla `reserva` con el campo `estado` como ENUM
CREATE TABLE reserva (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_cochera INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    estado ENUM('Pendiente', 'Aprobada') DEFAULT 'Pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (id_cochera) REFERENCES cochera(id) ON DELETE CASCADE
);

-- Crear la tabla `contrato` con el campo `firmado` como ENUM
CREATE TABLE contrato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    fecha_firma DATETIME NOT NULL,
    firmado ENUM('Pendiente', 'Aprobada') DEFAULT 'Pendiente',
    monto DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id) ON DELETE CASCADE
);

-- Crear la tabla `verificacion` con el campo `estado` como ENUM
CREATE TABLE verificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    estado ENUM('Pendiente', 'Aprobada') DEFAULT 'Pendiente',
    observaciones TEXT,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id) ON DELETE CASCADE
);

-- Crear la tabla `coche`
CREATE TABLE coche (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    patente VARCHAR(20),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

-- Insertar usuarios
INSERT INTO usuario (username, password) 
VALUES 
    ('usuario1', 'password123'),
    ('usuario2', 'password456'),
    ('usuario3', 'password789');

-- Insertar cocheras
INSERT INTO cochera (nombre, distrito, espacio_m2, disponible) 
VALUES 
    ('Cochera A', 'Centro', 25.5, TRUE),
    ('Cochera B', 'Norte', 30.0, TRUE),
    ('Cochera C', 'Sur', 20.0, FALSE);

-- Insertar reservas
INSERT INTO reserva (id_usuario, id_cochera, fecha_inicio, fecha_fin, estado) 
VALUES 
    (1, 1, '2025-04-10 10:00:00', '2025-04-20 10:00:00', 'Pendiente'),
    (2, 2, '2025-04-12 09:00:00', '2025-04-15 09:00:00', 'Aprobada'),
    (3, 3, '2025-04-18 12:00:00', '2025-04-22 12:00:00', 'Pendiente');

-- Insertar contratos
INSERT INTO contrato (id_reserva, fecha_firma, firmado, monto) 
VALUES 
    (1, '2025-04-10 12:00:00', 'Pendiente', 1000.00),
    (2, '2025-04-12 10:00:00', 'Aprobada', 1500.00);

-- Insertar verificaciones
INSERT INTO verificacion (id_reserva, estado, observaciones) 
VALUES 
    (1, 'Pendiente', 'Pendiente de revisión'),
    (2, 'Aprobada', 'Verificación exitosa');

-- Insertar coches
INSERT INTO coche (id_usuario, marca, modelo, patente) 
VALUES 
    (1, 'Toyota', 'Corolla', 'ABC123'),
    (2, 'Ford', 'Focus', 'XYZ987'),
    (3, 'Chevrolet', 'Cruze', 'LMN456');