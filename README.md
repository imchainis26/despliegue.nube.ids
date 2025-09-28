Ejercicio - Despliegue en la Nube
Agostina Timberio
----------------------------------------------------------

----------------------------------------------------------
Puerto cambiado del 3001 al 80
cd Inventory/ -> me lleva al directorio root correcto
nano server.js -> modificación del const PORT = 3001 a 80. Cambios guardados.
sudo node server.js -> para correr la App

NOTA: hubo que incorporar el Custom TCP en las reglas de seguridad de la instancia EC2. 
----------------------------------------------------------
Cambio de base de datos SQLite3 a MySQL2
npm install mysql2 -> instalar el motor
nano server.js -> cambios en la inicialización, se reemplazaron los tipos de datos y métoods para ejecutar consultas en la base de datos
sudo mysql -u root -> para ingresar en la configuración de MySQL
CREATE DATABASE db;
CREATE USER 'miuser'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON db.* TO 'miuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
node server.js -> para correr la App.

