const apiKey = '163b59841a67eadb0868aff7a9887d25';

function buscarPronostico() {
    const cityInput = document.getElementById('city');
    const cityName = document.getElementById('city-name');
    const forecastDiv = document.getElementById('forecast');

    const city = cityInput.value;

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`; // units=metric para obtener temperaturas en Celsius

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            cityName.textContent = data.city.name;
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

            for (const day in dailyTemperatures) {
                const { maxTemp, minTemp } = dailyTemperatures[day];

                const forecastItem = document.createElement('div');
                forecastItem.innerHTML = `<p>${day} - Máx: ${maxTemp.toFixed(2)}°C / Mín: ${minTemp.toFixed(2)}°C</p>`;
                forecastDiv.appendChild(forecastItem);
            }
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico del tiempo: ', error);
        });
}



