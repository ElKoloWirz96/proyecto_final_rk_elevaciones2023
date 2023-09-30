// Creo las variantes
const contenedorProductos = document.querySelector("#contenedorProductos");
const botonesCategorias = document.querySelectorAll(".botonCategoria");
const tituloPrincipal = document.querySelector("#tituloPrincipal");
let botonesAgregar = document.querySelectorAll(".productoAgregar");
const numerito = document.querySelector("#numerito");
let productos;
let productosEnCarrito;

// Cargar el archivo JSON
// Uso el try, catch, finally con el async y await

async function fetchData() {
  try {
    const response = await fetch("JSON/data.json");
    const data = await response.json();
    productos = data;
    cargarProductos(productos);
  } catch (error) {
    console.log("Fallo la carga del archivo JSON:", error);
  } finally {
    actualizarNumerito();
  }
}

fetchData();

// Acá cargo los productos y los separo por categoría (Haulotte y JCB)

function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";

  productosElegidos.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img class="productoImagen" src="${producto.imagen}" alt="${producto.titulo}">
      <div class="productoDetalles">
        <h3 class="productoTitulo">${producto.titulo}</h3>
        <p class="productoPrecio">USD$${producto.precio}</p>
        <button class="productoAgregar" id="${producto.id}">Agregar</button>
      </div>
    `;

    contenedorProductos.append(div);
  });

  actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach(boton => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id !== "todos") {
      const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
      cargarProductos(productosBoton);
      tituloPrincipal.innerText = productosBoton[0].categoria.nombre;
    } else {
      cargarProductos(productos);
      tituloPrincipal.innerText = "Todos los productos";
    }
  });
});

//Actualizo los Botones de Agregar al carrito

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".productoAgregar");

  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarritoLS = JSON.parse(localStorage.getItem("productosEnCarrito"));

if (productosEnCarritoLS) {
  productosEnCarrito = productosEnCarritoLS;
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

function agregarAlCarrito(e) {
  const idProducto = e.currentTarget.id;
  const productoSeleccionado = productos.find(producto => producto.id === idProducto);
  const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idProducto);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    productosEnCarrito.push({
      id: productoSeleccionado.id,
      titulo: productoSeleccionado.titulo,
      imagen: productoSeleccionado.imagen,
      precio: productoSeleccionado.precio,
      cantidad: 1
    });
  }
  actualizarNumerito();
  localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  numerito.innerText = nuevoNumerito;
}
