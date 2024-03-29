﻿//-------header-----//

const toggleBtn = document.querySelector('.toggle_btn')
const toggle_btnIcon = document.querySelector('.toggle_btn i')
const dropDownMenu = document.querySelector('.dropdown_menu')

toggleBtn.onclick = function () {
    dropDownMenu.classList.toggle('open')
}

//-----------tarejtas-precios---------------//

/*BOTONES TARJETA DE PRECIOS*/

const toggleBtns = document.querySelectorAll('.tarjetaBoton');
const dropDownMenus = document.querySelectorAll('.tarjetaPrecios');

toggleBtns.forEach((toggleBtn, index) => {
    toggleBtn.addEventListener('click', () => {
        dropDownMenus[index].classList.toggle('open');
    });
});


/*-----------PREGUNTAS---FRECUENTES---------------*/

	// Añadimos un evento "click" a cada botón de preguntas frecuentes para mostrar o esconder su respuesta
	let faqBtns = document.querySelectorAll(".faq-btn");
	faqBtns.forEach(function(btn) {
		btn.addEventListener("click", function() {
			this.classList.toggle("active");
			let faqContent = this.nextElementSibling;
			faqContent.classList.toggle("active");
		});
	});


//-------------------COTIZADOR POR ZONAS-------------------------//

// Obtener los botones
const botonesAgregar = document.querySelectorAll('.agregar');
const botonesEliminar = document.querySelectorAll('.eliminar');

console.log(botonesAgregar); // Verificar si se seleccionan los botones correctamente
console.log(botonesEliminar); // Verificar si se seleccionan los botones correctamente

// Obtener el carrito desde el almacenamiento local (si existe)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Actualizar el carrito en el almacenamiento local
function actualizarCarrito() {
    const carritoUL = document.querySelector('.carrito ul');
    carritoUL.innerHTML = '';
    let total = 0;
    const productosAgregados = {};

    carrito.forEach(producto => {
        const nombreProducto = producto.nombre;
        const precioProducto = parseFloat(producto.precio);
        total += precioProducto;

        // Agregar el producto al objeto productosAgregados y contar cuántas veces se ha agregado
        if (nombreProducto in productosAgregados) {
            productosAgregados[nombreProducto]++;
        } else {
            productosAgregados[nombreProducto] = 1;
        }
    });

    for (const nombreProducto in productosAgregados) {
        const cantidad = productosAgregados[nombreProducto];
        const li = document.createElement('li');
        li.innerHTML = `${nombreProducto} x${cantidad} <span>$${(cantidad * parseFloat(carrito.find(item => item.nombre === nombreProducto).precio)).toFixed(2)}</span>`;
        carritoUL.appendChild(li);
    }

    document.querySelector('.total').innerHTML = `Total: $${total.toFixed(2)}`;
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar un producto al carrito
function agregarProducto(evento) {
    // Obtener el nombre y el precio del producto
    const producto = evento.target.dataset.producto;
    const precio = evento.target.closest('.card').querySelector('.precio').textContent.replace('$', '');
    // Agregar el producto al carrito
    carrito.push({ nombre: producto, precio: precio });

    // Actualizar el carrito en la página y en el almacenamiento local
    actualizarCarrito();
}

// Eliminar un producto del carrito
function eliminarProducto(evento) {
    // Obtener el nombre del producto
    const producto = evento.target.dataset.producto;

    // Buscar y eliminar el producto del carrito
    carrito = carrito.filter(item => item.nombre !== producto);

    // Actualizar el carrito en la página y en el almacenamiento local
    actualizarCarrito();
}

// Agregar eventos a los botones de agregar y eliminar
botonesAgregar.forEach(boton => boton.addEventListener('click', agregarProducto));
botonesEliminar.forEach(boton => boton.addEventListener('click', eliminarProducto));

// Mostrar el carrito al cargar la página
actualizarCarrito();

function solicitarViaje(obj) {
    // Obtener los productos agrupados por nombre y sumar las cantidades
    const productosAgrupados = carrito.reduce((acumulador, producto) => {
        if (!acumulador[producto.nombre]) {
            acumulador[producto.nombre] = {
                nombre: producto.nombre,
                precio: parseFloat(producto.precio),
                cantidad: 1
            };
        } else {
            acumulador[producto.nombre].precio += parseFloat(producto.precio);
            acumulador[producto.nombre].cantidad++;
        }
        return acumulador;
    }, {});

    // Crear una cadena de consulta URL-encoded con los productos y sus cantidades
    const queryString = Object.values(productosAgrupados)
        .map(producto => `${encodeURIComponent(producto.nombre)} x${producto.cantidad}=${encodeURIComponent(producto.precio)}`)
        .join('%0A');

    // Obtener el precio total
    const total = Object.values(productosAgrupados)
        .reduce((acumulador, producto) => acumulador + producto.precio, 0);

// Crear el mensaje con los productos y el precio total
const mensaje = `¡Hola! Quiero solicitar un viaje con los siguientes productos:%0A
${queryString}%0A%0A
Total: $${total.toFixed(2)}%0A%0A
Nombre: ${obj.Nombre}%0A
Contacto: ${obj.Contacto}%0A
Email: ${obj.Email}%0A
Direccion: ${obj.Direccion} barrio: ${obj.Barrio}%0A
localidad: ${obj.Localidad} Codigo Postal: ${obj.CP}`;

// Crear la URL de la conversación de WhatsApp con el mensaje
const url = `https://api.whatsapp.com/send/?phone=5491123318355&text=${mensaje}`;

// Abrir la conversación de WhatsApp en una pestaña nueva
window.open(url, '_blank');
}

export {solicitarViaje}

//REINICIAR COTIZADOR

const botonReiniciar = document.querySelector('.reiniciar');

function reiniciarCotizador() {
    carrito = [];
    actualizarCarrito();
}

botonReiniciar.addEventListener('click', reiniciarCotizador);


