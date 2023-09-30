// Creo las variables
let productosEnCarrito = localStorage.getItem("productosEnCarrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carritoVacio");
const contenedorCarritoProductos = document.querySelector("#carritoProductos");
const contenedorCarritoAcciones = document.querySelector("#carritoAcciones");
const contenedorCarritoComprado = document.querySelector("#carritoComprado");
let botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");
const botonVaciar = document.querySelector("#carritoAccionesVaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carritoAccionesComprar");

// Cargo los productos seleccionados en el carrito

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.style.display = "none";
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.style.display = "none";

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carritoProducto");
            div.innerHTML = `
                <img class="carritoProductoImagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carritoProductoTitulo">
                    <small>Titulo</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carritoProductoCantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carritoProductoPrecio">
                    <small>Precio</small>
                    <p>USD$${producto.precio}</p>
                </div>
                <button class="carritoProductoEliminar" data-id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });
    } else {
        contenedorCarritoVacio.style.display = "block";
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

    actualizarBotonesEliminar();
    actualizarTotal();
}

cargarProductosCarrito();

// Creo una funcion para el boton eliminar

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carritoProductoEliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.getAttribute("data-id");
    productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idBoton);
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

//Creo la funcion para vaciar el carrito

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    productosEnCarrito = [];
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    contenedorTotal.innerText = `USD$${totalCalculado}`;
}

// Creo la funcion para comprar

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    productosEnCarrito = [];
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));

    contenedorCarritoVacio.style.display = "none";
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.style.display = "block";
}