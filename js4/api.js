const apiKey = '2a9ccb198e94996c5b3063751aa9903e';  
const defaultCity =['Tashkent',"Москва","Таджикистан","Дубай"];
let forecastData ;

document.addEventListener('DOMContentLoaded', () => {
    loadWeather(defaultCity);
    document.getElementById('todayTab').addEventListener('click', () => showTab('today'));
    document.getElementById('fiveDayTab').addEventListener('click', () => showTab('fiveDay'));
    document.getElementById('searchButton').addEventListener('click', searchCity);
});

function searchCity() {
    const cityInput = document.getElementById('cityInput').value;
    if (cityInput) {
        loadWeather(cityInput);
    } else {
        showError("Введите правильное название города");
    }
}

function showTab(tab) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
        content.style.animation = ''; 
    });

    const activeTab = document.getElementById(tab);
    activeTab.classList.add('active');
    activeTab.style.animation = 'fadeIn 0.5s ease'; 
}

async function loadWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Город не найден');
        const data = await response.json();
        displayCurrentWeather(data);
        loadForecast(city);
    } catch (error) {
        showError(error.message);
    }
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = `
        <h2>Текущая погода в ${data.name}</h2>
        <p>${new Date().toLocaleDateString()}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        <p>${data.weather[0].description}</p>
        <p>Температура: ${data.main.temp}°C</p>
        
       
    `;
}

async function loadForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        forecastData = await response.json(); 
        displayForecast(forecastData);
    } catch (error) {
        showError("Введите правильное название города");
    }
}

function displayForecast(data) {
    const forecastDaysDiv = document.getElementById('forecastDays');
    forecastDaysDiv.innerHTML = '';
    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) { 
            forecastDaysDiv.innerHTML += `
                <div class="forecast" onclick="showDetailedForecast(${index})">
                    <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                    <p>Температура: ${forecast.main.temp}°C</p>
                </div>
            `;
        }
    });
}

function showDetailedForecast(index) {
    const detailedForecastDiv = document.getElementById('detailedForecast');
    const forecastDataDetail = forecastData.list[index];
    
    detailedForecastDiv.innerHTML = `
        <h3>Детальная информация о погоде</h3>
        <p>Дата: ${new Date(forecastDataDetail.dt * 1000).toLocaleDateString()}</p>
        <p>Ветер: ${forecastDataDetail.wind.speed} м/с</p>
        
        <p>Описание: ${forecastDataDetail.weather[0].description}</p>
       
    `;
    
    detailedForecastDiv.style.display = 'block';
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: message,
        showCloseButton: true,
        timer: 3000,    
        timerProgressBar: true,
    });
}
