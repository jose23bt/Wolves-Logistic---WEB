//VIAJES PARTICULARES CON MAPA

// CARACTERISTICAS DEL MAPA
const myLatLng = { lat: -34.6148108, lng: -58.502316 };
const mapOptions = {
    center: myLatLng,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

// EL MAPA
const map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

// Crear un objeto DirectionsService para usar el método de ruta y obtener un resultado para nuestra solicitud
const directionsService = new google.maps.DirectionsService();

// Crear un objeto DirectionsRenderer que usaremos para mostrar la ruta
const directionsDisplay = new google.maps.DirectionsRenderer();

// Vincular DirectionsRenderer al mapa
directionsDisplay.setMap(map);

// Definir función calcRoute
function calcRoute() {
    // Crear solicitud
    const request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, 
        unitSystem: google.maps.UnitSystem.METRIC,
    };

    // Pasar la solicitud al método de ruta
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            // Obtener distancia y tiempo
            const output = document.querySelector('#output');
            const fare = calculateFare_km(result.routes[0].legs[0].distance.value);
            output.innerHTML = "<div class='alert-info'>Origen: " + document.getElementById("from").value + ".<br />Destino: " + document.getElementById("to").value + ".<br /> distancia del recorrido <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duración <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".<br /> Tarifa $ : " + fare + ".</div>"
            // Mostrar la ruta
            directionsDisplay.setDirections(result);
        }
        else {
            // Eliminar la ruta del mapa
            directionsDisplay.setDirections({ routes: [] });
            // Centrar el mapa en buenos aires
            map.setCenter(myLatLng);

            // Mostrar mensaje de error
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> No se pudo recuperar la distancia del viaje.</div>";
        }
    });
}

// Crear objetos de autocompletado para todas las entradas
const options = {
    types: ['(cities)']
};

const input1 = document.getElementById("from");
const autocomplete1 = new google.maps.places.Autocomplete(input1, options);

const input2 = document.getElementById("to");
const autocomplete2 = new google.maps.places.Autocomplete(input2, options);

function calculateFare_km(kilometros) {
    const fare = (kilometros * 0.100).toFixed(2);
    return fare;
}

//COTIZADOR POR ZONAS

// Obtener los botones
const botonesAgregar = document.querySelectorAll('.agregar');
const botonesEliminar = document.querySelectorAll('.eliminar');

// Obtener el carrito desde el almacenamiento local (si existe)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Actualizar el carrito en el almacenamiento local
function actualizarCarrito() {
    // Obtener el elemento <ul> del carrito
    const carritoUL = document.querySelector('.carrito ul');

    // Reiniciar el contenido del carrito
    carritoUL.innerHTML = '';

    // Comprobar que el carrito tenga algún producto
    if (carrito.length === 0) {
        document.querySelector('.total').innerHTML = 'Total: $0.00';
        return;
    }

    // Agregar cada producto al carrito
    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.innerHTML = `${producto.nombre} <span>$${producto.precio}</span>`;
        carritoUL.appendChild(li);
    });

    // Calcular el total y mostrarlo
    const total = carrito.reduce((acumulador, producto) => acumulador + parseFloat(producto.precio), 0);
    document.querySelector('.total').innerHTML = `Total: $${total.toFixed(2)}`;

    // Actualizar el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar un producto al carrito
function agregarProducto(evento) {
    // Obtener el nombre y el precio del producto
    const producto = evento.target.dataset.producto;
    const precio = evento.target.parentNode.querySelector('.precio').textContent.replace('$', '');
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

