document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'fcabb6d62e555aff2da1cc73aff4c63d'; //  clave de API
    
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const cityName = document.getElementById('city-name');
    const currentTemp = document.getElementById('current-temp');
    const currentDesc = document.getElementById('current-desc');
    const weatherIcon = document.getElementById('weather-icon');
    const forecastContainer = document.getElementById('forecast-cards');

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            getWeatherData(city);
        } else {
            alert('Por favor, ingresa el nombre de una ciudad.');
        }
    });

    function getWeatherData(city) {
        // Fetch para el clima actual
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
        
        // Fetch para el pronóstico de 5 días
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=es`;

        // Limpiar contenido anterior
        cityName.textContent = 'Cargando...';
        currentTemp.textContent = '';
        currentDesc.textContent = '';
        weatherIcon.src = '';
        forecastContainer.innerHTML = '';

        Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ])
        .then(responses => {
            const [currentRes, forecastRes] = responses;
            if (!currentRes.ok || !forecastRes.ok) {
                throw new Error('Ciudad no encontrada o error en la solicitud.');
            }
            return Promise.all([currentRes.json(), forecastRes.json()]);
        })
        .then(([currentData, forecastData]) => {
            displayCurrentWeather(currentData);
            displayForecast(forecastData);
        })
        .catch(error => {
            displayError(error.message);
        });
    }

    function displayCurrentWeather(data) {
        cityName.textContent = data.name;
        currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
        currentDesc.textContent = data.weather[0].description;
        weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherIcon.alt = data.weather[0].description;
    }

    function displayForecast(data) {
        // Filtrar el pronóstico para obtener un solo punto de datos por día (a mediodía)
        const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        if (dailyForecast.length === 0) {
            dailyForecast = data.list.slice(0, 5); // Fallback si no hay datos de mediodía
        }

        dailyForecast.forEach(day => {
            const date = new Date(day.dt * 1000);
            const dayOfWeek = date.toLocaleDateString('es-ES', { weekday: 'short' });
            
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <p><strong>${dayOfWeek}</strong></p>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                <p>${Math.round(day.main.temp)}°C</p>
                <p class="description">${day.weather[0].description}</p>
            `;
            forecastContainer.appendChild(card);
        });
    }

    function displayError(message) {
        cityName.textContent = '';
        currentTemp.textContent = '';
        currentDesc.textContent = '';
        weatherIcon.src = '';
        forecastContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
});