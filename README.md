https://github.com/EXCALOFRIO/exSw1?tab=readme-ov-file

https://github.com/galvarez33/FINAL-SW2

https://github.com/pblrvo/simulacroSWII

https://github.com/bereilhp/web/tree/main/web2

----------------------------------------------------------

### GET /books: Obtener todos los libros con paginación, ordenación y filtrado opcional por título.

Método: GET
URL: http://localhost:3000/books
Parámetros de consulta:
limit: (Opcional) Número máximo de resultados por página.
page: (Opcional) Número de página.
title: (Opcional) Título del libro para filtrar.
sort: (Opcional) Campo por el cual ordenar los resultados.
Ejemplo en Postman:

### GET /books/: Obtener un libro por su ID.

Método: GET
URL: http://localhost:3000/books/{id}
Sustituir {id} con el ID real del libro.
Ejemplo en Postman:

### POST /books: Agregar un nuevo libro.

Método: POST
URL: http://localhost:3000/books
Cuerpo de la solicitud (formato JSON):
json
{
  "title": "Nuevo libro",
  "author": "Autor del nuevo libro"
}
Ejemplo en Postman:


### DELETE /books/ : Eliminar un libro por su ID.

Método: DELETE
URL: http://localhost:3000/books/{id}
Sustituir {id} con el ID real del libro que deseas eliminar.
Ejemplo en Postman:

### PUT /books/ : Actualizar parcialmente un libro por su ID.

Método: PUT
URL: http://localhost:3000/books/{id}
Sustituir {id} con el ID real del libro que deseas actualizar.
Cuerpo de la solicitud (formato JSON):
json
{
  "title": "Nuevo título"
}

### DELETE /books: Eliminar varios libros a la vez.

Método: DELETE
URL: http://localhost:3000/books
Cuerpo de la solicitud (formato JSON):
json
{
  "ids": ["612345678901234567890123", "612345678901234567890124"]
}
Reemplazar los IDs con los IDs reales de los libros que deseas eliminar.