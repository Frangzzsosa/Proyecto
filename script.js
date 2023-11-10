const apiKey = '163b59841a67eadb0868aff7a9887d25';
let expanded = false; // Variable para rastrear si el pronóstico está expandido

function buscarPronostico() {
    const cityInput = document.getElementById('city');
    const cityName = document.getElementById('city-name');
    const forecastDiv = document.getElementById('forecast');

    const city = cityInput.value;

    // Obtener la ubicación actual del usuario
    if (!city && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Realizar una solicitud a la API de OpenWeatherMap con las coordenadas actuales
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const city = data.name;
                    const country = data.sys.country;
                    actualizarTitulo(`${city}, ${country}`);
                    mostrarPronostico(city);
                })
                .catch(error => {
                    console.error('Error al obtener el pronóstico del tiempo: ', error);
                });
        }, error => {
            console.error('Error al obtener la ubicación: ', error);
        });
    } else {
        // Si se ingresa una ciudad, realizar la búsqueda normal
        obtenerPaisPorCiudad(city);
    }
}

function obtenerPaisPorCiudad(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const country = data.sys.country;
            actualizarTitulo(`${city}, ${country}`);
            mostrarPronostico(city);
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico del tiempo: ', error);
        });
}

function actualizarTitulo(title) {
    const cityName = document.getElementById('city-name');
    cityName.textContent = `Pronóstico para ${title}`;
}

function mostrarPronostico(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = '';

            const dailyTemperatures = {};

            data.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('es-ES', { weekday: 'long' }).charAt(0).toUpperCase() + date.toLocaleDateString('es-ES', { weekday: 'long' }).slice(1); // Capitalizar la primera letra
                const temperature = item.main.temp;

                if (!dailyTemperatures[day]) {
                    dailyTemperatures[day] = {
                        maxTemp: temperature,
                        minTemp: temperature
                    };
                } else {
                    if (temperature > dailyTemperatures[day].maxTemp) {
                        dailyTemperatures[day].maxTemp = temperature;
                    }
                    if (temperature < dailyTemperatures[day].minTemp) {
                        dailyTemperatures[day].minTemp = temperature;
                    }
                }
            });

            const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleDateString('es-ES', { weekday: 'long' }).slice(1);
            const { maxTemp, minTemp } = dailyTemperatures[today];

            const forecastItem = document.createElement('div');
            forecastItem.innerHTML = `<p>${today} - Máx: ${maxTemp.toFixed(2)}°C / Mín: ${minTemp.toFixed(2)}°C</p>`;
            forecastDiv.appendChild(forecastItem);

            // Agregar la flecha para expandir/cerrar el pronóstico
            const toggleButton = document.getElementById('toggle-button');
            if (Object.keys(dailyTemperatures).length > 1) {
                toggleButton.style.display = 'block';
                if (expanded) {
                    for (const day in dailyTemperatures) {
                        if (day !== today) {
                            const { maxTemp, minTemp } = dailyTemperatures[day];
                            const forecastItem = document.createElement('div');
                            forecastItem.innerHTML = `<p>${day} - Máx: ${maxTemp.toFixed(2)}°C / Mín: ${minTemp.toFixed(2)}°C</p>`;
                            forecastDiv.appendChild(forecastItem);
                        }
                    }
                    toggleButton.textContent = 'Ocultar Pronóstico';
                } else {
                    toggleButton.textContent = 'Mostrar Pronóstico';
                }
            } else {
                toggleButton.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico del tiempo: ', error);
        });
}

function toggleForecast() {
    expanded = !expanded;
    buscarPronostico();
}

// Llamar a buscarPronostico al cargar la página para obtener la ubicación actual
buscarPronostico();


