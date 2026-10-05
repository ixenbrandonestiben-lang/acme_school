# Configuración de Base de Datos

> [!IMPORTANT]
> El proyecto requiere un motor de base de datos **MySQL** en ejecución. 

## 1. Crear la Base de Datos y el Esquema

Dentro de la carpeta `esquema/` (si existe) o utilizando tu cliente SQL preferido (MySQL Workbench, DBeaver, phpMyAdmin), debes ejecutar el script SQL proporcionado para construir las tablas de `acme_school`.

1. Abre tu cliente SQL e inicia sesión en tu servidor (usualmente `root`).
2. Crea la base de datos si no existe:
   ```sql
   CREATE DATABASE IF NOT EXISTS acme_school;
   USE acme_school;
   ```
3. Ejecuta los comandos del esquema para crear las tablas (`students`, `teachers`, `courses`, etc.).

## 2. Configurar las Variables de Entorno

El proyecto usa variables de entorno para no exponer contraseñas en el código.

1. En la raíz del proyecto, busca el archivo llamado `.env.example`.
2. Duplica ese archivo y nombra a la copia exactamente **`.env`**.
3. Abre el archivo `.env` en tu editor de texto y cambia los valores para que coincidan con los de tu entorno local:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_secreta
DB_NAME=acme_school
DB_PORT=3306
```

> [!WARNING]
> Nunca incluyas el archivo `.env` en tus commits de Git. Si miras el archivo `.gitignore`, verás que ya está excluido por seguridad.

## 3. Comprobar Conexión

Una vez guardado el archivo, la aplicación automáticamente leerá tus credenciales cuando arranques el servidor con `npm start`.
