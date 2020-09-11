//===============GLOBAL VARIABLES===============

const api = {
  key: "b902c7504d19f9930dd6890e5b9fe3e4",
  baseurl: "https://api.openweathermap.org/data/2.5/",
  imageurl: "https://openweathermap.org/img/wn/",
};

//=================DOM ELEMENTS=================
const form = document.querySelector(".top-banner form");
const searchInput = document.querySelector(".search-box");
const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const feels_like = document.querySelector(".feels-like");
const temp_icon = document.querySelector(".temp-icon");
const temp_description = document.querySelector(".temp-description");
const hilow = document.querySelector(".hi-low");
const errorWrap = document.querySelector('#info-wrap');


//==================DATE BUILDER=================
const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
};

(function displayDate() {
  let now = new Date();
  let date = document.querySelector(".date");
  date.innerHTML = dateBuilder(now);
})();

//==================WEATHER DATA=================
async function getResults({ query, lat, lon }) {
  try {
    let response;
    if (query) {
      response = await fetch(
        `${api.baseurl}weather?q=${query}&units=metric&appid=${api.key}`
      );
    } else {
      response = await fetch(
        `${api.baseurl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`
      );
    }

    const data = await response.json();

    displayResults(data);
  } catch (error) {
    console.log(error);

  }
}

//===================DISPLAY RESULTS===============
const updateUI = (lCity, lTemp, feelsLike, tempIcon, tempAlt, tempDesc, lHilow) => {
  city.innerHTML = lCity;
  temp.innerHTML = lTemp;
  feels_like.innerHTML = feelsLike;
  temp_icon.src = tempIcon;
  temp_icon.alt = tempAlt;
  temp_description.innerHTML = tempDesc;
  hilow.innerHTML = lHilow;
};

const displayResults = (data) => {
  const { name, sys, main, weather } = data;
  if (typeof sys === 'undefined') {
    errorWrap.style.display = 'block';
    errorWrap.querySelector('#error-message').innerHTML = `${searchInput.value} Not Found`;
    return;
  }

  lCity = `${name}, ${sys.country}`;

  lTemp = `${Math.floor(main.temp)}<span>℃</span>`;

  feelsLike = `Feels like ${Math.floor(
    main.feels_like
  )}<span>℃</span>`;

  tempIcon = `${api.imageurl}${weather[0].icon}@2x.png`;
  tempAlt = `${weather[0].description}`;

  tempDesc = `${weather[0].description}`;

  lHilow = `${Math.floor(main.temp_min)}℃ / ${Math.floor(
    main.temp_max
  )}℃`;

  localStorage.setItem("lCity", lCity);
  localStorage.setItem("lTemp", lTemp);
  localStorage.setItem("feelsLike", feelsLike);
  localStorage.setItem("tempIcon", tempIcon);
  localStorage.setItem("tempAlt", tempAlt);
  localStorage.setItem("tempDesc", tempDesc);
  localStorage.setItem("lHilow", lHilow);

  updateUI(lCity, lTemp, feelsLike, tempIcon, tempAlt, tempDesc, lHilow);
};


//==================GET LOCATION=================
window.addEventListener("load", () => {

  if (localStorage.getItem('lCity') !== null) {
    updateUI(localStorage.getItem("lCity"),
      localStorage.getItem("lTemp"),
      localStorage.getItem("feelsLike"),
      localStorage.getItem("tempIcon"),
      localStorage.getItem("tempAlt"),
      localStorage.getItem("tempDesc"),
      localStorage.getItem("lHilow"));
    return;
  }
  let lon;
  let lat;


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat = position.coords.latitude;
      lon = position.coords.longitude;

      getResults({ lat: lat, lon: lon });
    });
  }
});

//===================SEARCH QUERY==================
const setQueryAfterKeypress = (e) => {
  if (e.keyCode == 13) {
    query = searchInput.value;
    getResults({ query: query });
  }
};

const setQueryAfterClick = (e) => {
  errorWrap.style.display = 'none';
  e.preventDefault();
  getResults({ query: searchInput.value });
};

searchInput.addEventListener("keypress", setQueryAfterKeypress);
form.addEventListener("submit", setQueryAfterClick);

// Register the Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}