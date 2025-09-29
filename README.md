Ejercicio - Despliegue en la Nube

Agostina Timberio

-------DESPLIEGUE MANUAL-------

APARTADO A: 

1. Levantar la instancia EC2 en AWS con los siguientes parámetros
a. AMI: Ubuntu

b. Tipo: t2.medium

c. Puertos: 22 (SSH) y 80 (Custom TCP)

d. Generar par de claves .pem


2. Lanzar la instancia
   
a. Abrir la terminal e ir a la ubicación donde se guardó el par de claves .pem

b. ssh -i <ARCHIVO_PEM> ubuntu@<IP_PUBLICA_DE_EC2>


3. Instalar Node.js, npm y Git

a. sudo apt update

b. sudo apt install nodejs npm git -y

c. node -v

d. npm -v

e. git --version


4. Instalar y configurar MySQL
   
a. sudo apt update

b. sudo apt install mysql-server -y

c. sudo mysql -> ejecutar la siguiente query
    Dentro de MySQL:
    CREATE DATABASE db;
    CREATE USER 'miuser'@'localhost' IDENTIFIED BY 'admin123';
    GRANT ALL PRIVILEGES ON db.* TO 'miuser'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;


5. Clonar repositorio e instalar dependencias

a. cd ~

b. git clone https://github.com/imchainis26/despliegue.nube.ids.git

c. cd despliegue.nube.ids

d. npm install


6. Ejecutar
    
a. sudo node server.js

VENTAJAS: control total en la configuración de la instancia y en la instalación de dependencias, ideal para un primer acercamiento a infraestructura

DESVENTAJAS: completamente manual, toma tiempo.


NOTA: la versión manual es la que se encuentra en el repositorio con los cambios realizados. 


APARTADO B: 

Para que la instancia arranque sola, se configuró en otra Instancia el siguiente User Data en la creación de la misma:


1. Levantar la instancia EC2 en AWS con los siguientes parámetros
   
a. AMI: Ubuntu

b. Tipo: t2.medium

c. Puertos: 22 (SSH) y 80 (Custom TCP)

d. Generar par de claves .pem

e. El siguiente User Data permite que la instancia se configure automáticamente y levante la aplicación sin necesidad de conectarse por SSH. Ingresar los siguientes comandos en User Data: 
    #!/bin/bash
    sudo apt update
    sudo apt install -y nodejs npm git mysql-server
    cd /home/ubuntu
    git clone https://github.com/imchainis26/despliegue.nube.ids.git
    cd despliegue.nube.ids
    npm install
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS db;"
    sudo mysql -e "CREATE USER IF NOT EXISTS 'miuser'@'localhost' IDENTIFIED BY 'admin123';"
    sudo mysql -e "GRANT ALL PRIVILEGES ON db.* TO 'miuser'@'localhost'; FLUSH PRIVILEGES;"
    nohup sudo node server.js > app.log 2>&1 &

3. Luego, simplemente abrir la IP Pública en el puerto 80 en el navegador.

VENTAJAS: la configuración inicial está automatizada, ahorrando tiempo.
DESVENTAJAS: los errores pasan desapercibidos y depende del orden de los comandos programados. Se configura en la creación de la instancia por lo que su modificación ya debe realizarse manualmente. 


-------DESPLIEGUE AWS CLI-------

1. Instalar AWS CLI:
   
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   
    unzip awscliv2.zip
   
    sudo ./aws/install
   
   
2. Configurar AWS CLI
   
    & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" configure
   
    NOTA: es necesario completar con Access Key ID, Secret Access Key, la región y el formato de output por defecto.


3. Crear clave .pem
    & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" ec2 create-key-pair --key-name tp-key --query 'KeyMaterial' --output text > tp-key.pem
    chmod 400 tp-key.pem

4. Crear grupos de seguridad

    & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" ec2 create-security-group --group-name tp-sg --description "Node.js app"
    
    & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" ec2 authorize-security-group-ingress --group-name tp-sg --protocol tcp --port 22 --cidr 0.0.0.0/0
    
    & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" ec2 authorize-security-group-ingress --group-name tp-sg --protocol tcp --port 80 --cidr 0.0.0.0/0


5. Crear archivo user-data.sh (para automatizar el lanzamiento de la instancia)

    #!/bin/bash
    sudo apt update
    sudo apt install -y nodejs npm git mysql-server
    cd /home/ubuntu
    git clone https://github.com/imchainis26/despliegue.nube.ids.git
    cd despliegue.nube.ids
    npm install
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS db;"
    sudo mysql -e "CREATE USER IF NOT EXISTS 'miuser'@'localhost' IDENTIFIED BY 'admin123';"
    sudo mysql -e "GRANT ALL PRIVILEGES ON db.* TO 'miuser'@'localhost'; FLUSH PRIVILEGES;"
    nohup sudo node server.js > app.log 2>&1 &


6. Lanzar instancia EC2 con User Data

   & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" ec2 run-instances `
    --image-id <AMI_ID_UBUNTU> `
    --count 1 `
    --instance-type t2.medium `
    --key-name tp-key `
    --security-groups tp-sg `
    --user-data file://user-data.sh


7. Obtener la IP pública

     & "C:\Program Files\Amazon\AWSCLIV2\aws.exe" ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId, PublicIpAddress, State.Name]" --output table


8. Ejecutar en el navegador

     http://<IP_PUBLICA_DE_LA_INSTANCIA>

VENTAJAS: se hace todo desde consola, es automatizable y reproducible
DESVENTAJAS: no es muy visual, interpretar los errores es difícil


-------DESPLIEGUE AWS ELASTIC BEANSTALK-------

Desde la consola de Elastic Beanstalk -> no tengo acceso, no me permitió hacerlo. 

VENTAJAS: mucho más automatizado, con gestión automática de la infraestructura, balanceo de carga y escalabilidad.

DESVENTAJAS: poco control, depende de la plataforma y no se puede desplegar sin los permisos. 

-------CAMBIOS PUNTO 4-------

1. Puerto cambiado del 3001 al 80
   
a. const PORT = 80;

b. mediante nano server.js


NOTA: es incorporar el Custom TCP en las reglas de seguridad de la instancia EC2. 


2. Cambio de base de datos SQLite3 a MySQL2
   
a. npm install mysql2 -> instalar el motor

b. nano server.js -> cambios en la inicialización, se reemplazaron los tipos de datos y métoods para ejecutar consultas en la base de datos

c. sudo mysql -u root -> ejecuté la siguiente query
    CREATE DATABASE db;
    CREATE USER 'miuser'@'localhost' IDENTIFIED BY 'admin123';
    GRANT ALL PRIVILEGES ON db.* TO 'miuser'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    
d. node server.js -> para correr la App.

