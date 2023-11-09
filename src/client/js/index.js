const locationEl = document.querySelector("#location");
const departingEl = document.querySelector("#departing");

function render(view, data) {
  document.querySelector("main").innerHTML = view(data);
}

function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

function timeLeft(date) {
  const today = Date.now();
  const millisLeft = date - today;
  if (millisLeft < 0) {
    return -1;
  }
  const hoursLeft = Math.round(millisLeft / (1000 * 60 * 60));
  if (hoursLeft >= 24) {
    const daysLeft = Math.round(millisLeft / (1000 * 60 * 60 * 24));
    return { unit: "days", value: daysLeft };
  }
  return { unit: "hours", value: hoursLeft };
}

function weatherDayView({ date, icon, temp }) {
  const dayName = new Date(date).toLocaleString("en", { weekday: "short" });
  return `<div class="weather__day">
      <div class="weather__day-name">${dayName}</div>
      <div class="weather__temp">
        <div class="weather__icon">
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
        </div>
        <div class="weather__grades">${kelvinToCelsius(temp)}º</div>
      </div>
    </div>`;
}

function tripView({ images, weather, city, country, departing }) {
  const imageIdx = Math.floor(Math.random() * images.length);
  const imageSrc = images[imageIdx].src;
  const firstTag = images[imageIdx].tags.split(",")[0];
  const _timeLeft = timeLeft(new Date(departing));
  const _city = city[0].toUpperCase() + city.slice(1);
  const tag = firstTag[0].toUpperCase() + firstTag.slice(1);

  return `
        <section class="section plan">
        <div class="section__title plan__title">
          <i class="fa-solid fa-passport"></i> My trip
        </div>
        <div class="section__content plan__content">
          <div class="plan__city-country">
            <div class="plan__city">
              <i class="fa-solid fa-location-dot"></i><span>${_city}</span>
            </div>
            <div class="plan__country">${country}</div>
          </div>
          <div class="plan__departing">
            <i class="plan__departing-icon fa-regular fa-calendar-days"></i>
            <span class="plan__departing-value">${_timeLeft.value} ${
              _timeLeft.unit
            }</span
            ><span>left until departure</span>
          </div>
          <div class="image">
            <div class="image__caption">${tag}</div>
            <img
              class="image__content"
              src="${imageSrc}"
              alt="${tag}"
            />
          </div>
          <div class="weather">
            <div class="weather__title">Weather</div>
            <div class="weather__content">
            ${weather
              .map(({ date, icon, temp }) =>
                weatherDayView({ date, icon, temp }),
              )
              .join("")}
            </div>
          </div>
        </div>
      </section>
        `;
}

async function save({ city, departing }) {
  const apiUrl = "http://localhost:5050/api/v0/trips";
  const res = await fetch(apiUrl, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ city, departing }),
  });
  const { data } = await res.json();
  return data;
}

function saveController({ city, departing }) {
  save({ city, departing })
    .then((data) => render(tripView, data))
    .catch((error) => console.log(error));
}

document.addEventListener("click", (ev) => {
  if (ev.target.matches("button")) {
    ev.preventDefault();
  }
  if (ev.target.matches("#save-btn")) {
    saveController({
      city: locationEl.value,
      departing: departingEl.value.replace(/-/g, "/"),
    });
  }
});

function itemView(item) {
  return `
    <div class="item">
        <div class="menu">
          <i class="menu__btn fa-solid fa-ellipsis-vertical"></i>
          <div class="menu__content">
            <div class="menu__option menu__option_delete">
              <i class="fa-solid fa-circle-minus"></i>Delete
            </div>
          </div>
        </div>

        <div class="item__description">
          <span class="item__city">${item.city}</span>, ${item.country} is
          <span class="item__time-left">0 days away</span>
        </div>
      </div>
    `;
}

function tripListView(list) {
  return `
    <section class="section plans">
    <h2 class="section__title plans__title">
      <i class="icon fa-solid fa-list-check"></i>My trips
    </h2>
    <ul class="section__content plans__list">
      ${list.map((item) => itemView(item)).join("")}
    </ul>
  </section>
    `;
}

async function getAll() {
  const apiUrl = "http://localhost:5050/api/v0/trips";
  const res = await fetch(apiUrl);
  const { data } = await res.json();
  return data;
}

function indexController() {
  getAll()
    .then((data) => render(tripListView, data))
    .catch((error) => console.log(error));
}

document.addEventListener("DOMContentLoaded", indexController);
