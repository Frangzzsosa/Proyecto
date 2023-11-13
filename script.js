const apiKey = "163b59841a67eadb0868aff7a9887d25";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Función para obtener la información del clima basada en la ciudad
async function getWeatherByCity(city) {
    try {
        const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Error al buscar la ciudad: ${response.statusText}`);
        }

        const data = await response.json();
        updateWeatherData(data);
    } catch (error) {
        console.error(error.message);
        console.log(response); // Agrega esta línea
    }
}

// Función para obtener la ubicación actual y consultar el clima
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                // Hacer la solicitud a la API de OpenWeatherMap con las coordenadas
                const response = await fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
                if (!response.ok) {
                    throw new Error(`Error al obtener la ubicación actual: ${response.statusText}`);
                }

                const data = await response.json();
                updateWeatherData(data);
            } catch (error) {
                console.error(error.message);
                console.log(response); // Agrega esta línea
            }
        }, (error) => {
            console.error("Error al obtener la ubicación:", error);
        });
    } else {
        console.error("La geolocalización no es compatible en este navegador.");
    }
}

// Función para actualizar la interfaz con la información del clima
function updateWeatherData(data) {
    document.querySelector(".city").innerHTML = `${data.name}, ${data.sys.country}`;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    // Actualizar el ícono del clima según el tipo de clima
    updateWeatherIcon(data.weather[0].main);

    // Mostrar la sección del clima
    document.querySelector(".weather").style.display = "block";
}

// Función para actualizar el ícono del clima
function updateWeatherIcon(weatherType) {
    switch (weatherType.toLowerCase()) {
        case "clear":
            weatherIcon.src = "imagenes/clear.png";
            break;
        case "clouds":
            weatherIcon.src = "imagenes/clouds.png";
            break;
        case "rain":
            weatherIcon.src = "imagenes/rain.png";
            break;
        case "drizzle":
            weatherIcon.src = "imagenes/drizzle.png";
            break;
        case "mist":
            weatherIcon.src = "imagenes/mist.png";
            break;
        default:
            weatherIcon.src = "imagenes/default.png";
            break;
    }
}

// Agregar un event listener al botón de búsqueda
searchBtn.addEventListener("click", () => {
    // Llamar a la función getWeatherByCity con el valor del campo de búsqueda
    const cityName = searchBox.value;
    if (cityName) {
        getWeatherByCity(cityName);
    } else {
        console.error("Por favor, ingrese el nombre de la ciudad.");
    }
});

// Llamar a la función para obtener la ubicación actual y consultar el clima al cargar la página
document.addEventListener("DOMContentLoaded", getCurrentLocationWeather);


