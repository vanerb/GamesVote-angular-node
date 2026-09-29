# 🎮 GamesVote — Angular + Node.js

**GamesVote** es una aplicación web desarrollada con **Angular** en el frontend y **Node.js** en el backend que permite consultar un catálogo de videojuegos, valorarlos, escribir reseñas y gestionar una colección personal.

La aplicación utiliza la API de **IGDB** para obtener información sobre videojuegos y **MySQL** para almacenar los datos propios de la aplicación.

---

## ✨ Funcionalidades

### 🎮 Catálogo de videojuegos

La aplicación permite consultar un catálogo de videojuegos utilizando información obtenida mediante la API de **IGDB**.

Los usuarios pueden consultar información sobre diferentes títulos y acceder a sus detalles.

### ⭐ Valoraciones

Los usuarios pueden valorar los videojuegos y registrar su opinión sobre los diferentes títulos.

### 📝 Reseñas

Es posible añadir reseñas y opiniones personales sobre los videojuegos.

### 🔎 Búsqueda y filtrado

La aplicación permite buscar videojuegos y filtrar los resultados para localizar rápidamente los títulos deseados.

### 💾 Gestión de datos

La información propia de la aplicación se almacena en una base de datos **MySQL**, permitiendo conservar los datos de los usuarios, valoraciones y reseñas.

---

## 🛠️ Tecnologías utilizadas

### Frontend

* **Angular**
* **TypeScript**
* **HTML5**
* **CSS**
* **Tailwind CSS**

### Backend

* **Node.js**
* **JavaScript**
* **MySQL**
* **REST API**

### APIs y herramientas

* **IGDB API**
* **Git**
* **GitHub**
* **npm**

---

## 📂 Estructura del proyecto

```text
GamesVote-angular-node/
│
├── frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── index.js
│   ├── server.js
│   ├── ...
│   └── package.json
│
└── README.md
```

---

## 🏗️ Arquitectura

El proyecto está dividido en dos partes principales:

```text
                 ┌───────────────────┐
                 │      Usuario      │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │      Angular     │
                 │     Frontend     │
                 └─────────┬─────────┘
                           │
                      HTTP / REST
                           │
                           ▼
                 ┌───────────────────┐
                 │      Node.js      │
                 │      Backend      │
                 └───────┬─────┬─────┘
                         │     │
                ┌────────┘     └─────────┐
                ▼                        ▼
        ┌──────────────┐         ┌──────────────┐
        │    MySQL     │         │   IGDB API   │
        │   Database   │         │ Video Games  │
        └──────────────┘         └──────────────┘
```

---

## 🌐 Integración con IGDB

GamesVote utiliza la **IGDB API (Internet Games Database)** para obtener información sobre videojuegos.

Esta integración permite consultar información sobre diferentes títulos sin tener que almacenar todo el catálogo de videojuegos en la base de datos propia.

La aplicación combina la información obtenida de IGDB con los datos gestionados por el backend, como las valoraciones y reseñas.

---

## 🗄️ Base de datos

El proyecto utiliza **MySQL** para almacenar la información propia de la aplicación.

La base de datos permite conservar datos relacionados con:

* Usuarios
* Videojuegos
* Valoraciones
* Reseñas
* Favoritos

Los datos generales de los videojuegos se obtienen principalmente mediante la API de IGDB.

---

## 🛠️ Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado:

* **Node.js**
* **npm**
* **Angular CLI**
* **MySQL**
* **Git**

Para utilizar la integración con IGDB también es necesario disponer de las credenciales correspondientes de la API.

---

## 📥 Clonar el repositorio

```bash
git clone https://github.com/vanerb/GamesVote-angular-node.git
cd GamesVote-angular-node
```

---

# 🖥️ Instalación y ejecución

## 1️⃣ Backend — Node.js

Accede al directorio del backend:

```bash
cd backend
```

Instala las dependencias:

```bash
npm install
```

### 🗄️ Configurar MySQL

Crea una base de datos MySQL para el proyecto y configura los datos de conexión en el archivo correspondiente del backend.

Por ejemplo:

```text
Host: localhost
Puerto: 3306
Base de datos: TU_BASE_DE_DATOS
Usuario: TU_USUARIO
Contraseña: TU_CONTRASEÑA
```

Asegúrate también de configurar las credenciales necesarias para utilizar la API de IGDB.

Una vez configurado todo, inicia el servidor:

```bash
node server.js
```

El backend estará disponible por defecto en:

```text
http://localhost:3000
```

---

## 2️⃣ Frontend — Angular

Abre otra terminal y accede al frontend:

```bash
cd frontend
```

Instala las dependencias:

```bash
npm install
```

Ejecuta la aplicación:

```bash
ng serve
```

El frontend estará disponible normalmente en:

```text
http://localhost:4200
```

---

## 🔄 Flujo de funcionamiento

```text
                         Usuario
                            │
                            ▼
                     ┌─────────────┐
                     │   Angular   │
                     │  Frontend   │
                     └──────┬──────┘
                            │
                         REST API
                            │
                            ▼
                     ┌─────────────┐
                     │   Node.js   │
                     │   Backend   │
                     └──────┬──────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          ┌─────────────┐       ┌─────────────┐
          │    MySQL    │       │   IGDB API  │
          │  Datos app  │       │ Videojuegos │
          └─────────────┘       └─────────────┘
```

---

## 🎯 Objetivo del proyecto

El objetivo de **GamesVote** es desarrollar una aplicación web que permita **descubrir, consultar y valorar videojuegos**, combinando información procedente de una API externa con datos gestionados por la propia aplicación.

El proyecto permite poner en práctica diferentes conceptos de desarrollo web:

* Desarrollo de aplicaciones SPA con Angular.
* Creación de APIs REST con Node.js.
* Consumo e integración de APIs externas.
* Integración con IGDB.
* Persistencia de datos mediante MySQL.
* Gestión de usuarios.
* Búsqueda y filtrado de videojuegos.
* Sistema de valoraciones.
* Sistema de reseñas.
* Comunicación entre frontend y backend.

---

## 📌 Estado del proyecto

**En desarrollo.**

Actualmente el proyecto está planteado como una **aplicación web** desarrollada con Angular y Node.js.

Entre las posibles ampliaciones futuras se encuentran:

* 📊 Estadísticas personales.
* 🏆 Logros y objetivos.
* 📚 Historial de videojuegos jugados.
* 🎮 Seguimiento del estado de cada videojuego.
* 👥 Perfiles de usuario.
* 💬 Interacción entre usuarios.
* 📱 Adaptación futura a dispositivos móviles.

---

## 👩‍💻 Autora

**Vanesa Ribera Bautista**

Proyecto desarrollado utilizando **Angular + Node.js + MySQL + IGDB API**.
