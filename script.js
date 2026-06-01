// ===============================
// OPENWEATHER API KEY
// ===============================

const apiKey = "3bbfacafdb8eb828ad72459d25391469";


// ===============================
// SELECT HTML ELEMENTS
// ===============================

const voiceBtn = document.getElementById("voiceBtn");

const city = document.getElementById("city");

const temperature = document.getElementById("temperature");

const condition = document.getElementById("condition");

const humidity = document.getElementById("humidity");

const wind = document.getElementById("wind");

const weatherIcon = document.getElementById("weatherIcon");

const loader = document.getElementById("loader");


// ===============================
// SPEECH RECOGNITION SETUP
// ===============================

const recognition =
  new (window.SpeechRecognition ||
       window.webkitSpeechRecognition)();

recognition.lang = "en-US";

recognition.continuous = false;


// ===============================
// MIC BUTTON CLICK
// ===============================

voiceBtn.addEventListener("click", () => {

  recognition.start();

  voiceBtn.innerHTML = "🎧 Listening...";

});


// ===============================
// WHEN USER SPEAKS
// ===============================

recognition.onresult = function(event) {

  // Get spoken text
  const speechResult =
    event.results[0][0].transcript;

  console.log("User Said:", speechResult);

  // Extract city name
  let cityName = speechResult
    .toLowerCase()
    .replace("weather in", "")
    .trim();

  console.log("City Name:", cityName);

  // Call weather function
  getWeather(cityName);

};


// ===============================
// GET WEATHER FUNCTION
// ===============================

async function getWeather(cityName) {

  // Show loader
  loader.style.display = "block";

  // API URL
  const apiUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

  try {

    // Fetch API data
    const response = await fetch(apiUrl);

    // Convert response to JSON
    const data = await response.json();

    console.log(data);

    // Hide loader
    loader.style.display = "none";


    // ===============================
    // HANDLE ERRORS
    // ===============================

    if (data.cod != 200) {

      alert(data.message);

      return;
    }


    // ===============================
    // DISPLAY WEATHER DATA
    // ===============================

    city.innerHTML = data.name;

    temperature.innerHTML =
      Math.round(data.main.temp) + "°C";

    condition.innerHTML =
      data.weather[0].main;

    humidity.innerHTML =
      "Humidity: " + data.main.humidity + "%";

    wind.innerHTML =
      "Wind: " + data.wind.speed + " km/h";


    // ===============================
    // WEATHER CONDITIONS
    // ===============================

    const weatherMain =
      data.weather[0].main;


    // SUNNY
    if (weatherMain === "Clear") {

      weatherIcon.innerHTML = "☀️";

      document.body.className = "sunny";
    }


    // CLOUDY
    else if (weatherMain === "Clouds") {

      weatherIcon.innerHTML = "☁️";

      document.body.className = "cloudy";
    }


    // RAINY
    else if (
      weatherMain === "Rain" ||
      weatherMain === "Drizzle"
    ) {

      weatherIcon.innerHTML = "🌧️";

      document.body.className = "rainy";
    }


    // SNOWY
    else if (weatherMain === "Snow") {

      weatherIcon.innerHTML = "❄️";

      document.body.className = "snowy";
    }


    // DEFAULT
    else {

      weatherIcon.innerHTML = "🌤️";

      document.body.className = "";
    }


    // ===============================
    // TEXT TO SPEECH
    // ===============================

    const speechText =
      `The weather in ${data.name} is ${Math.round(data.main.temp)} degrees Celsius with ${data.weather[0].description}`;

    // Create speech object
    const speech =
      new SpeechSynthesisUtterance(speechText);

    // Speak result
    window.speechSynthesis.speak(speech);

  }

  catch (error) {

    console.log("FULL ERROR:", error);

    loader.style.display = "none";

    alert("Something went wrong!");

  }

}


// ===============================
// WHEN SPEECH ENDS
// ===============================

recognition.onend = function() {

  voiceBtn.innerHTML =
    `<i class="fa-solid fa-microphone"></i> Speak`;

};