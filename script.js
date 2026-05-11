
function updateDateTime(){

    let now = new Date();

    let options = {

        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"

    };

    let date = now.toLocaleDateString(
        "en-US",
        options
    );

    let time = now.toLocaleTimeString();

    document.getElementById("dateTime").innerHTML =
    `${date}<br>${time}`;

}

setInterval(updateDateTime,1000);

updateDateTime();

async function getWeather() {

    let city = document.getElementById("city").value;

    saveHistory(city);

    let apiKey = "bc20e9f4deeacda5f679450652bbf2bd";

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    let forecastUrl =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    document.getElementById("result").innerHTML =
    "<h3>Loading...</h3>";

    try {

        let response = await fetch(url);

        let data = await response.json();
        
        let forecastResponse = await fetch(forecastUrl);

        let forecastData = await forecastResponse.json();

        console.log(forecastData);


        let weatherCondition = data.weather[0].main;



        console.log(data);

        let icon = data.weather[0].icon;

        let iconUrl =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

        if(weatherCondition === "Clear"){

    document.body.style.background =
    "linear-gradient(135deg,#f6d365,#fda085)";

}

else if(weatherCondition === "Rain"){

    document.body.style.background =
    "linear-gradient(135deg,#4b79a1,#283e51)";

}

else if(weatherCondition === "Clouds"){

    document.body.style.background =
    "linear-gradient(135deg,#bdc3c7,#2c3e50)";

}

else{

    document.body.style.background =
    "linear-gradient(135deg,#00c6ff,#0072ff)";

}

        document.getElementById("result").innerHTML = `
        
            <h2>${data.name}</h2>

            <img src="${iconUrl}">

            <h3>${data.main.temp} °C</h3>

            <p>${data.weather[0].main}</p>

            <p>Humidity : ${data.main.humidity}%</p>

            <p>Wind Speed : ${data.wind.speed} km/h</p>
        `;

        let forecastHTML = "";

for(let i=0; i<40; i += 8){

    let item = forecastData.list[i];

    let date = item.dt_txt.split(" ")[0];

    let temp = item.main.temp;

    let icon = item.weather[0].icon;

    let iconUrl =
    `https://openweathermap.org/img/wn/${icon}.png`;

    forecastHTML += `
    
        <div class="forecast-card">

            <p>${date}</p>

            <img src="${iconUrl}">

            <p>${temp} °C</p>

        </div>
    `;
}

document.getElementById("forecast").innerHTML =
forecastHTML;
    }

    catch(error) {

        console.log(error);

        document.getElementById("result").innerHTML =
        "<h3>Something went wrong</h3>";

    }

}

document.getElementById("city")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        getWeather();

    }

});

function getLocationWeather(){

    navigator.geolocation.getCurrentPosition(
        success,
        error
    );

}

async function success(position){

    let lat = position.coords.latitude;

    let lon = position.coords.longitude;

    let apiKey = "bc20e9f4deeacda5f679450652bbf2bd";

    let url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try{

        let response = await fetch(url);

        let data = await response.json();

        console.log(data);

        let icon = data.weather[0].icon;

        let iconUrl =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

        document.getElementById("result").innerHTML = `
        
            <h2>${data.name}</h2>

            <img src="${iconUrl}">

            <h3>${data.main.temp} °C</h3>

            <p>${data.weather[0].main}</p>

            <p>Humidity : ${data.main.humidity}%</p>

            <p>Wind Speed : ${data.wind.speed} km/h</p>
        `;

    }

    catch(error){

        console.log(error);

    }

}

function error(){

    alert("Location access denied");

}

function toggleTheme(){

    document.body.classList.toggle("dark-mode");

    let btn =
    document.getElementById("themeBtn");

    if(document.body.classList.contains("dark-mode")){

        btn.innerHTML = "Light Mode";

    }

    else{

        btn.innerHTML = "Dark Mode";

    }



}

function saveHistory(city){

    let history =
    JSON.parse(localStorage.getItem("cities")) || [];

    if(!history.includes(city)){

        history.push(city);

        localStorage.setItem(
            "cities",
            JSON.stringify(history)
        );

    }

    showHistory();

}

function showHistory(){

    let history =
    JSON.parse(localStorage.getItem("cities")) || [];

    let historyHTML = "";

    history.forEach(city => {

        historyHTML += `
        
            <li onclick="searchFromHistory('${city}')">
                ${city}
            </li>
        `;

    });

    document.getElementById("history").innerHTML =
    historyHTML;

}

function searchFromHistory(city){

    document.getElementById("city").value = city;

    getWeather();

}

showHistory();