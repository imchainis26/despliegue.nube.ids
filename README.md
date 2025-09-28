Ejercicio - Despliegue en la Nube
Agostina Timberio

Levantar el LAB de AWS y lanzar una instancia de EC2 con:
-ubuntu
-t2 medium
-puertos 22 SSH Y TCP Custom 80
-generar el par de claves .pem
Lanzar la instancia
Abrir la terminal e ir a la ubicación donde se guardó el par de claves .pem
Ejecutar ssh -i <NOMBRE DEL ARCHIVO .PEM> ubuntu@ec2-3-80-57-148.compute-1.amazonaws.com
Luego, ejecutar los siguientes comandos:
-Instalar Node.js y npm
sudo apt update
sudo apt install nodejs npm git -y
node -v
npm -v
git --version
-Instalar MySQL
sudo apt update
sudo apt install mysql-server -y
-Crear base de datos y usuario
sudo mysql -> no pide contraseña porque se ingresa como root
CREATE DATABASE db;
CREATE USER 'miuser'@'localhost' IDENTIFIED BY 'Admin123!';
GRANT ALL PRIVILEGES ON db.* TO 'miuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
-Clonar repositorio
cd ~
git clone https://github.com/imchainis26/despliegue.nube.ids.git
-Instalar dependencias
cd despliegue.nube.ids
npm install
-Levantar la App
sudo node server.js

Puerto cambiado del 3001 al 80
cd Inventory/ -> me lleva al directorio root correcto
nano server.js -> modificación del const PORT = 3001 a 80. Cambios guardados.
sudo node server.js -> para correr la App

NOTA: hubo que incorporar el Custom TCP en las reglas de seguridad de la instancia EC2. 

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

