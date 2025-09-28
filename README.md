Ejercicio - Despliegue en la Nube
Agostina Timberio

1. Levantar la instancia EC2 en AWS

AMI: Ubuntu
Tipo: t2.medium
Puertos: 22 (SSH) y 80 (Custom TCP)
Generar par de claves .pem

2. Lanzar la instancia
Abrir la terminal e ir a la ubicación donde se guardó el par de claves .pem
ssh -i <ARCHIVO_PEM> ubuntu@<IP_PUBLICA_DE_EC2>

3. Instalar Node.js, npm y Git
sudo apt update
sudo apt install nodejs npm git -y
node -v
npm -v
git --version

4. Instalar y configurar MySQL
sudo apt update
sudo apt install mysql-server -y
sudo mysql

Dentro de MySQL:
CREATE DATABASE db;
CREATE USER 'miuser'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON db.* TO 'miuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

-Clonar repositorio
cd ~
git clone https://github.com/imchainis26/despliegue.nube.ids.git

5. Clonar repositorio e instalar dependencias
cd ~
git clone https://github.com/imchainis26/despliegue.nube.ids.git
cd despliegue.nube.ids
npm install

6. Ejecutar
sudo node server.js

-CAMBIOS IMPORTANTES-
Puerto cambiado del 3001 al 80
const PORT = 80;
mediante nano server.js

NOTA: es incorporar el Custom TCP en las reglas de seguridad de la instancia EC2. 

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

