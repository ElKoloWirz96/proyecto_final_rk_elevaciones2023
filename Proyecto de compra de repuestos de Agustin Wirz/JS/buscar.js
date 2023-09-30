// Espero a que el documento esté cargado
document.addEventListener("DOMContentLoaded", function() {
  const inputBuscar = document.querySelector("#buscar");
  const contenedorCarrito = document.querySelector(".contenedorCarrito");
  let data;
  let productosEnCarrito = [];

  // Carga los datos del archivo data.json
  fetch("JSON/data.json")
    .then(response => response.json())
    .then(jsonData => {
      data = jsonData;
    })
    .catch(error => {
      console.log("Error al cargar los datos del archivo data.json:", error);
    });

  // Agrega un evento de escucha al campo de búsqueda
  inputBuscar.addEventListener("input", buscarProductos);

  // Función para buscar productos
  function buscarProductos() {
    const valorBusqueda = inputBuscar.value.toLowerCase();
    contenedorCarrito.innerHTML = "";

    // Filtra los productos según el valor de búsqueda
    const productosEncontrados = data.filter(producto => {
      const titulo = producto.titulo.toLowerCase();
      return titulo.includes(valorBusqueda);
    });

    // Agrega los productos encontrados al contenedor del carrito
    productosEncontrados.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img class="productoImagen" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="productoInfo">
          <h3 class="productoTitulo">${producto.titulo}</h3>
          <p class="productoPrecio">USD$${producto.precio}</p>
          <input class="productoCantidad" type="number" min="1" value="1">
          <button class="productoAgregar" data-id="${producto.id}">Agregar al carrito</button>
        </div>
      `;

      const botonAgregar = div.querySelector(".productoAgregar");
      botonAgregar.addEventListener("click", function() {
        const cantidad = parseInt(div.querySelector(".productoCantidad").value);
        agregarAlCarrito(producto.id, cantidad);
      });

      contenedorCarrito.appendChild(div);
    });
  }

  // Función para agregar un producto al carrito
  function agregarAlCarrito(idProducto, cantidad) {
    const productoSeleccionado = data.find(producto => producto.id === idProducto);
    const productoEnCarrito = productosEnCarrito.find(producto => producto.id === idProducto);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad += cantidad;
    } else {
      productosEnCarrito.push({
        id: productoSeleccionado.id,
        titulo: productoSeleccionado.titulo,
        imagen: productoSeleccionado.imagen,
        precio: productoSeleccionado.precio,
        cantidad: cantidad
      });
    }
    actualizarNumeritoCarrito();
    localStorage.setItem("productosEnCarrito", JSON.stringify(productosEnCarrito));
  }

  // Función para actualizar el numerito del carrito
  function actualizarNumeritoCarrito() {
    const numeritoCarrito = document.querySelector("#numerito");
    numeritoCarrito.innerText = calcularTotalProductos();
  }

  // Función para calcular el total de productos en el carrito
  function calcularTotalProductos() {
    let total = 0;
    productosEnCarrito.forEach(producto => {
      total += producto.cantidad;
    });
    return total;
  }

  // Cargar carrito desde el LocalStorage al cargar la página
  function cargarCarritoDesdeLocalStorage() {
    const carrito = localStorage.getItem("productosEnCarrito");
    if (carrito) {
      productosEnCarrito = JSON.parse(carrito);
    }
    actualizarNumeritoCarrito();
  }

  // Llamada a la función para cargar el carrito desde el LocalStorage
  cargarCarritoDesdeLocalStorage();
});