# E-commerce MongoDB and PostgreSQL Data Structure

Este proyecto tiene como objetivo implementar una estructura de datos básica para un sistema de e-commerce, utilizando **MongoDB** para colecciones dinámicas y **PostgreSQL** para la tabla usuarios. La estructura de datos está diseñada para relacionar categorías, productos, carritos, órdenes y usuarios.

---

## Estructura de las Colecciones en MongoDB

### 1. **Categories**
La colección `Categories` define las categorías bajo las cuales se agrupan los productos.

**Ejemplo de documento:**  
Aqui se muestra como se puede crear el objeto en la coleccion a partir de un JSON    

**Campos:**  
+ name (string): Nombre de la categoría.  
+ description (string): Descripción de la categoría.  
   
```json
{
    "name": "Computadores",
    "description": "Encuentra los mejores equipos de cómputo, desde potentes computadoras de escritorio hasta laptops de alto rendimiento. Perfectos para profesionales, gamers y estudiantes que buscan velocidad, capacidad y tecnología avanzada."
}
```
**Colección:**  

![Categorias](/img/ColeccionCategorias.png)



### 2. **Products**
La colección Products almacena la información de los productos disponibles para la venta.

**Ejemplo de documento:**

**Campos:**  
+ name (string): Nombre del producto.
+ description (string): Descripción del producto.
+ price (number): Precio del producto.
+ imgUrl (string): URL de la imagen del producto.
+ stock (number): Cantidad de productos disponibles.
+ category (ObjectId): Referencia a la categoría a la que pertenece el producto.
```json
{
    "name": "Silla de Oficina Básica",
    "description": "Silla de oficina económica con respaldo de malla.",
    "price": 300000,
    "imgUrl": "../img",
    "stock": 20,
    "category": "674a84408adf11109acef3b0"
}
```
**Colección:** 

![Productos](/img/ColeccionProductos.png)



### 3. **Carts**
La colección Carts almacena los productos guardados en el carrito por cada usuario antes de completar una orden.

**Ejemplo de documento:**

**Campos:**
+ userId (string): Identificador del usuario que creó el carrito.
+ products (array): Lista de productos en el carrito, cada elemento contiene:
    + product (ObjectId): Referencia al producto.
    + quantity (number): Cantidad de este producto.
```json
{
    "userId": "7",
    "products": [
        {
            "product": "674a86a58adf11109acef3bb",
            "quantity": 1
        },
        {
            "product": "674a873c8adf11109acef3d1",
            "quantity": 1
        }
    ]
}
```
**Colección:** 

![Carrito](/img/ColeccionCarrito.png)


### 4. **Orders**
La colección Orders registra las ordenes de compra realizadas por los usuarios.

**Ejemplo de documento:**

**Campos:**
+ user (string): Identificador del usuario que realizó la compra.
+ cartId (ObjectId): Referencia al carrito utilizado.
+ products (array): Lista de productos comprados, cada elemento contiene:
    + product (ObjectId): Referencia al producto.
    + quantity (number): Cantidad comprada de este producto.
    + price (number): Precio final de este producto.
+ total (number): Total a pagar por la orden.
```json
{
    "user": "7",
    "cartId": "674f371e053b902fd40df13b",
    "products": [
        {
            "product": "674a86a58adf11109acef3bb",
            "quantity": 1,
            "price": 2990000
        },
        {
            "product": "674a873c8adf11109acef3d1",
            "quantity": 1,
            "price": 300000
        }
    ],
    "total": 3290000
}
```
**Colección:** 

![Ordenes](/img/ColeccionOrdenes.png)


### 5. **Tabla users**
La tabla users almacena la información de los clientes y administradores del sistema.

**Ejemplo de documento:**

**Campos:**
* name (string): Nombre del usuario.
* email (string): Correo electrónico del usuario (único).
* password (string): Contraseña del usuario (cifrada en producción).
* address (string): Dirección física del usuario.
* phone (string): Número de teléfono del usuario.
* role (string): Rol del usuario, puede ser:
    * cliente (por defecto).
    * admin (administrador).
* created_at (timestamp): Fecha y hora de creación del registro (por defecto el momento de creación).
```json
{
    "name": "Cliente1000",
    "email": "cliente10000@gmail.com",
    "password": "cliente1",
    "address": "Calle 100", 
    "phone": "3001002020",
    "role": "cliente",
    "created_at": "2024-12-03T10:00:00Z"
}

```
**Tabla:** 

![Usuarios](/img/TablaUsuarios.png)
