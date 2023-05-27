// Características del mapa
const myLatLng = { lat: -34.6148108, lng: -58.502316 };
const mapOptions = {
    center: myLatLng,
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

// El mapa
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
            output.innerHTML = "<div>Origen: " + document.getElementById("from").value + ".<br />Destino: " + document.getElementById("to").value + ".<br /> distancia del recorrido: " + result.routes[0].legs[0].distance.text + ".<br />Duración : " + result.routes[0].legs[0].duration.text + ".<br /> Tarifa $ : " + fare + ".</div>"
            // Mostrar la ruta
            directionsDisplay.setDirections(result);
        }
        else {
            // Eliminar la ruta del mapa
            directionsDisplay.setDirections({ routes: [] });
            // Centrar el mapa en Buenos Aires
            map.setCenter(myLatLng);

            // Mostrar mensaje de error
            output.innerHTML = "<div>No se pudo recuperar la distancia del viaje.</div>";
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

// Esperar a que se cargue el DOM
document.addEventListener('DOMContentLoaded', function () {
    // Obtener referencia al botón
    var cotizarBtn = document.getElementById('cotizarBtn');

        // Agregar evento onclick al botón
        cotizarBtn.addEventListener('click', function () {
            // Llamar a la función calcRoute()
            calcRoute();
        });
    });