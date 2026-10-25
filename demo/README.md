# GamesVote — Demo de portfolio

Versión demostrativa y estática de GamesVote. Se puede abrir directamente en un navegador y no necesita Angular, Node.js, base de datos, registro ni credenciales de IGDB.

## Cómo probarla

1. Abre `index.html` en el navegador, o publícala como una página estática.
2. Busca juegos por título, estudio o género.
3. Filtra por género y muestra solo tus favoritos.
4. Puntúa los juegos del 1 al 5 y abre sus detalles.
5. Los votos y favoritos se guardan en `localStorage` del navegador.

## Alcance y limitaciones

- Incluye datos ficticios/de muestra para enseñar la experiencia.
- No conecta con el backend original ni con IGDB.
- Las valoraciones son locales a cada navegador y no se comparten con otros usuarios.
- Esta carpeta es independiente; no modifica el frontend ni el backend originales.

## Publicación estática

Se puede publicar la carpeta en GitHub Pages u otro hosting estático gratuito. No se necesitan variables de entorno ni claves API.

## Proyecto original

GamesVote está desarrollado con Angular y Node.js e integra una API de videojuegos. Esta demo permite explorar parte de la experiencia sin desplegar esos servicios.
