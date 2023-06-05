let map;
let directionsService;
let directionsRenderer;
let markers = [];
let distance = 0;
const pricePerKm = 130;
let autocompleteService;

// Agregar un evento para esperar a que se cargue el contenido de la página
document.addEventListener('DOMContentLoaded', function () {
    // Llamar a la función para inicializar el mapa y agregar el autocompletado
    initMap();

    // Obtener los botones por su ID
    const agregarDireccionBtn = document.getElementById('agregar-direccion-btn');
    const calcularRutaBtn = document.getElementById('calcular-ruta-btn');
    const reiniciarBtn = document.getElementById('reiniciar-btn');

    // Agregar event listeners a los botones
    agregarDireccionBtn.addEventListener('click', agregarDireccion);
    calcularRutaBtn.addEventListener('click', calcularRuta);
    reiniciarBtn.addEventListener('click', resetSummaryAndInputs);
});

// Función para inicializar el mapa
function initMap() {
    const buenosAires = { lat: -34.6037, lng: -58.3816 };

    map = new google.maps.Map(document.getElementById('map'), {
        center: buenosAires,
        zoom: 12,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Inicializar el autocompletado
    autocompleteService = new google.maps.places.AutocompleteService();

    // Agregar autocompletado a los campos de dirección existentes
    const direccionInputs = document.querySelectorAll('#direccion-lista input');
    direccionInputs.forEach(addAutocomplete);
}

// Función para agregar campos de entrada de direcciones
function agregarDireccion() {
    const inputContainer = document.getElementById('direccion-lista');
    const direccionCount = inputContainer.children.length + 2;

    const input = document.createElement('li');
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = `Dirección ${direccionCount}`;
    input.appendChild(inputField);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Eliminar';
    removeButton.addEventListener('click', () => {
        eliminarDireccion(input);
    });

    input.appendChild(removeButton);

    inputContainer.appendChild(input);

    // Agregar autocompletado al nuevo campo de dirección
    addAutocomplete(inputField);
}

// Función para eliminar un campo de entrada de dirección
function eliminarDireccion(input) {
    const inputContainer = document.getElementById('direccion-lista');
    inputContainer.removeChild(input);
}

// Función para agregar autocompletado a un campo de dirección
function addAutocomplete(input) {
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['address'],
        componentRestrictions: { country: 'AR' }, // Restricción para buscar direcciones en Argentina
        fields: ['address_components', 'geometry'],
    });

    // Evento de selección de un lugar en el autocompletado
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            return;
        }

        // Obtener la ubicación seleccionada y centrar el mapa en ella
        const location = place.geometry.location;
        map.setCenter(location);

        // Crear un marcador en la ubicación seleccionada
        const marker = new google.maps.Marker({
            map: map,
            position: location,
        });

        // Agregar el marcador a la lista de marcadores
        markers.push(marker);
    });
}

// Función para calcular la ruta
function calcularRuta() {
    clearMarkers();
    resetSummary();

    const direccionInputs = document.querySelectorAll('#direccion-lista input');
    const direcciones = Array.from(direccionInputs).map((input) => input.value);

    const directionsRequest = {
        origin: direcciones[0], // Obtener la dirección de origen desde el primer input
        destination: direcciones[direcciones.length - 1], // Obtener la dirección de destino desde el último input
        waypoints: getWaypoints(direcciones),
        optimizeWaypoints: false,
        travelMode: 'DRIVING',
    };

    directionsService.route(directionsRequest, (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);

            const legs = response.routes[0].legs;
            distance = legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000; // Convertir de metros a kilómetros

            // Actualizar el resumen de la ruta
            document.getElementById('distancia-total').textContent = `Distancia total: ${distance.toFixed(2)} km`;
            document.getElementById('precio-total').textContent = `Precio total: $${(distance * pricePerKm).toFixed(2)}`;
            document.getElementById('resumen-ruta').style.display = 'block';
            // Almacenar las direcciones buscadas
            direccionesBuscadas = direcciones;

        } else {
            alert('No se pudo calcular la ruta. Por favor, verifica las direcciones ingresadas.');
        }
    });
}

// Función para reiniciar el resumen de la ruta y los inputs
function resetSummaryAndInputs() {
    resetSummary();
    clearInputs();
    directionsRenderer.setDirections({ routes: [] });
    document.getElementById('resumen-ruta').style.display = 'none';
}

// Función para borrar los inputs de dirección
function clearInputs() {
    const direccionInputs = document.querySelectorAll('#direccion-lista input');
    direccionInputs.forEach((input) => {
        input.value = '';
    });
}

// Función para reiniciar el resumen de la ruta
function resetSummary() {
    distance = 0;
    document.getElementById('distancia-total').textContent = '';
    document.getElementById('precio-total').textContent = '';
}

// Función para obtener los puntos intermedios de la ruta
function getWaypoints(direcciones) {
    const waypoints = [];

    for (let i = 1; i < direcciones.length - 1; i++) {
        waypoints.push({
            location: direcciones[i],
            stopover: true,
        });
    }

    return waypoints;
}

// Función para eliminar los marcadores anteriores del mapa
function clearMarkers() {
    markers.forEach((marker) => {
        marker.setMap(null);
    });

    markers = [];
}
//BOTON SOLICITAR VIAJE EN MAPA//

// Obtener elementos del DOM
const openModalButton = document.getElementById('openModalButton');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModalButton');
const solicitarButton = document.getElementById('solicitarButton');
const remitenteNombreInput = document.getElementById('remitenteNombre');
const remitenteContactoInput = document.getElementById('remitenteContacto');

// Abrir el modal al hacer clic en el botón
openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Cerrar el modal al hacer clic en la "X"
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar el modal al hacer clic fuera del contenido del modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Variables globales
let distanciaTotal = distance * pricePerKm;
let direccionesBuscadas = [distance];

// Manejar clic en el botón de solicitar
solicitarButton.addEventListener('click', () => {
    const remitenteNombre = remitenteNombreInput.value;
    const remitenteContacto = remitenteContactoInput.value;

    // Obtener las direcciones solicitadas
    const direccionesSolicitadas = direccionesBuscadas;

    // Calcular el kilometraje total y el monto total
    const kilometrajeTotal = distanciaTotal;
    const montoTotal = distance * pricePerKm;

    // Construir el mensaje
    let mensaje = `Datos del Remitente:\nNombre: ${remitenteNombre}\nContacto: ${remitenteContacto}\n\n`;
    mensaje += 'Direcciones Solicitadas:\n';
    direccionesSolicitadas.forEach((direccion) => {
        mensaje += `${direccion}\n`;
    });
    mensaje += `\nKilometraje Total: ${distance.toFixed(2)} km\nMonto Total: $${(distance * pricePerKm).toFixed(2)}`;

    // Enviar el mensaje por WhatsApp (simulado)
    const numeroWhatsApp = '5491123318355';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url);

    // Cerrar el modal
    modal.style.display = 'none';
});