const apiKey = "自身のAPIkey"

function searchWeatherByCity(city) {
    console.log("aaaa")
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=ja`;  // 現在の天気データ
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const weather_rough = data.weather[0].main;
      const weather = data.weather[0].description;
      const weatherElement = document.getElementById('currentWeather');
      let weatherIcon = '';

switch (weather_rough) {
  case 'Clear':
    weatherIcon = 'sun_1763.png'; 
    break;
  case 'Clouds':
    weatherIcon = 'cloudy-icon.png'; 
    break;
  case 'Drizzle':
    weatherIcon = 'rainy-icon.png';
    break;
  case 'Rain':
    weatherIcon = 'rainy-icon.png'; 
    break;
  case 'Thunderstorm':
    weatherIcon = 'rainy-icon.png'; 
    break;
  case 'Snow':
    weatherIcon = 'snowman.png'; 
    break;
}

const weatherIconElement = document.createElement('img');
weatherIconElement.src = weatherIcon;
weatherIconElement.alt = weather;

weatherIconElement.style.width = '100px';
weatherIconElement.style.height = '100px';

weatherElement.innerHTML = ''; 
weatherElement.appendChild(weatherIconElement);
const temperture  = data['main']['temp']
const tempertureElement = document.getElementById('currenttemperture')
tempertureElement.textContent = `気温：${temperture}℃`
const currenttime = document.getElementById('current')
currenttime.textContent = `現在の天気`
    
    });
}


let currentMarker = null; 

function initMap() {
  const map = L.map('map').setView([35.681236, 139.767125], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  map.on('click', async (event) => {
    const lat = event.latlng.lat;
    const lon = event.latlng.lng;

    const weatherInfo = await getWeatherInfo(lat, lon);
    if (weatherInfo) {
      
      const popupContent = `<b>天気:</b> ${weatherInfo.weather}<br><b>気温:</b> ${weatherInfo.temperature} ℃`;
  
      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      currentMarker = L.marker([lat, lon]).addTo(map).bindPopup(popupContent).openPopup();
    } else {
      alert('天気情報を取得できませんでした');
    }
  });
  };


function getWeatherInfo(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=ja`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const weather = data.weather[0].description;
      const temperature = data.main.temp;
      return { weather, temperature };
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      return null;
    });
}

  
function checkWeatherPrediction(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=ja`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const tomorrowWeather = data.list[8]; 
        const userPredictedWeather = document.getElementById('predictedWeather').value;
        const userPredictedTemp = parseFloat(document.getElementById('predictedTemp').value);
        const actualWeather = tomorrowWeather.weather[0].main;
        const actualTemp = tomorrowWeather.main.temp_max;
        let resultMessage = "";

        if (actualWeather === "Clear") {
            resultMessage += `明日の予報: 天気 - "晴れ"、 予想最高気温 : ${actualTemp.toFixed(1)}°C\n\n`;
        } else if (actualWeather === "Clouds") { 
            resultMessage += `明日の予報: 天気 - "くもり"、 予想最高気温 : ${actualTemp.toFixed(1)}°C\n\n`;
        } else if (actualWeather === "Rain") {
            resultMessage += `明日の予報: 天気 - "雨"、 予想最高気温 : ${actualTemp.toFixed(1)}°C\n\n`;
        } else if (actualWeather === "Snow") {
            resultMessage += `明日の予報: 天気 - "雪"、 予想最高気温 : ${actualTemp.toFixed(1)}°C\n\n`;
        }
        if(document.getElementById('predictedWeather').value==="Clear"){
          resultMessage += `あなたの予想: 天気 - ${"晴れ"}、 予想最高気温 : ${userPredictedTemp.toFixed(1)}°C\n\n`;
        }else if(document.getElementById('predictedWeather').value==="Clouds"){
          resultMessage += `あなたの予想: 天気 - ${"くもり"}、 予想最高気温 : ${userPredictedTemp.toFixed(1)}°C\n\n`;
        }else if(document.getElementById('predictedWeather').value==="Rain"){
          resultMessage += `あなたの予想: 天気 - ${"雨"}、 予想最高気温 : ${userPredictedTemp.toFixed(1)}°C\n\n`;
        }else if(document.getElementById('predictedWeather').value==="Snow"){
          resultMessage += `あなたの予想: 天気 - ${"雪"}、 予想最高気温 : ${userPredictedTemp.toFixed(1)}°C\n\n`;
        }
    
  
        if (actualWeather === userPredictedWeather && Math.abs(actualTemp - userPredictedTemp) <= 2) {
          resultMessage += '素晴らしい! きみの予想はかなり正確だったよ！';
        } else {
          resultMessage += '予想外れ…でもあきらめずに、次回またチャレンジしよう！';
        }
  
        document.getElementById('quizResult').innerText = resultMessage;
      });
  }
  
document.getElementById('submitPrediction').addEventListener('click', () => {
  const city = document.getElementById('cityName').value;
  if (city) {
    checkWeatherPrediction(city);
  } else {
    alert('先に市区町村名を入力してね！');
  }
});

document.getElementById('searchWeather').addEventListener('click', () => {
  const city = document.getElementById('cityName').value;
  searchWeatherByCity(city);
});

window.onload = initMap;