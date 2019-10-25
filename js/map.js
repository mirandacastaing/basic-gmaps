//Inicializacion del mapa
var map = new GMaps({
    el: '#map',         //el toma el tag con el id #map e ininializa un nuevo mapa
    zoom: 14,           //se le puede setear que tanto zoom se quiere
    lat: 9.909580,      //latitud del centro del mapa
    lng: -84.054062,    //longitu del centro del mapa
    click: addMarker    //se añade el evento click y se referencia a la funcion addMarker
});

function addMarker(e) {                         //La función addMarker recibe el evento como parametro
    if (map.markers.length <= 2) {              //Se chequea la lista de markers
        if (map.markers.length == 0) {          //Si la lista esta vacia se añade el punto inicial
            addStartPoint(e);                   //Referencia a la función que dibuja el punto inicial
        }
        else if (map.markers.length == 1) {     //Si la lista de markers tiene solamente uno se añade el punto final
            addEndPoint(e);                     //Referencia a la función que dibuja el punto final 
            drawRoute();                        //Referencia al dibujo de la ruta
            calculateDistance();                //Referencia al calculo de la distancia
        }
    }
}

function addStartPoint(e) {                     //Se añade el punto inicial
    map.addMarker({                             //llamada a funcion de Gmaps --> addMarker
        lat: e.latLng.lat(),                    //El Objeto e (evento) trae dentro de sus propiedades la lat               
        lng: e.latLng.lng(),                    //Lo mismo con la longitud
        title: "Start Point",                   //Esta propiedad es opcional pero ayuda a referenciarla luego
        icon: {                                 //Añadir el icono tambien es configurable
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5, //tamaño
            strokeColor: '#f00', //color del borde
            strokeWeight: 10
        }
    });
}

function addEndPoint(e) {                       //Se añade el punto inicial
    map.addMarker({                             //llamada a funcion de Gmaps --> addMarker
        lat: e.latLng.lat(),                    //El Objeto e (evento) trae dentro de sus propiedades la lat 
        lng: e.latLng.lng(),                    //Lo mismo con la longitud
        title: "End Point",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5, //tamaño
            strokeColor: '#009975', //color del borde
            strokeWeight: 10
        }
    });
}

function drawRoute() {                          //Se dibuja la ruta
    var start = map.markers[0].position;        //De la lista de markers se toma el primer elemento como punto inicial
    var end = map.markers[1].position;          //De la lista de markers se toma el segundo elemento como punto inicial

    map.drawRoute({                             //llamada a funcion de Gmaps --> drawRoute
        origin: [start.lat(), start.lng()],     //Se toma la lat y long del punto inicial
        destination: [end.lat(), end.lng()],    //Lo mismo con el punto final
        travelMode: 'driving',                  //Se detalla el tipo de modo de translado
        strokeColor: '#131540',                 //Se setean estilos de la rutas
        strokeOpacity: 0.6,
        strokeWeight: 6
    });
}

/*  Se calcula la distancia entre los 2 puntos tomando las coordenadas, 
    se toma la latitud y longitud del punto inicial y del punto final.
    El calculo se hace por trigonometría utilizando la tierra como una esfera
     */
function calculateDistance() {
    var start = map.markers[0].position;
    var end = map.markers[1].position;
    var lat1 = 0, lat2 = 0, long1 = 0, lon2 = 0, dist = 0;

    lat1 = start.lat();
    lat2 = end.lat();
    lon1 = start.lng();
    lon2 = end.lng();
    if ((lat1 == lat2) && (lon1 == lon2)) {
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
    }

    //Se pega el resultado en el html usando Jquery, tanto para la distancia como para el tiempo de llegada
    $("#distance").html("Distancia: " + Math.round(dist).toFixed(1) + "km");
    $("#time").html("Tiempo estimado : " + Math.round(dist * 4).toFixed(0) + "min");

    /* Nota:    el tiempo estimado depende de las condiciones del trafico, tipo de transporte, etc. 
                Para efectos de este ejemplo se toma un tiempo promedio de 4 minutos por km. 
                Este número se puede refinar */
}
