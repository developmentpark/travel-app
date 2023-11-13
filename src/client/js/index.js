function render(view, data) {
  document.querySelector("main").innerHTML = view(data);
}

function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2);
}

function timeLeft(date) {
  const today = Date.now();
  const millisLeft = date - today;
  let hoursLeft = 0;
  if (millisLeft <= 0) {
    return { unit: "hours", value: hoursLeft };
  }
  hoursLeft = Math.round(millisLeft / (1000 * 60 * 60));
  if (hoursLeft < 24) {
    return { unit: "hours", value: hoursLeft };
  }
  const daysLeft = Math.round(millisLeft / (1000 * 60 * 60 * 24));
  return { unit: "days", value: daysLeft };
}

function weatherDayView({ date, icon, temp }) {
  const dayName = new Date(date).toLocaleString("en", { weekday: "short" });
  return `<div class="weather__day">
      <div class="weather__day-name">${dayName}</div>
      <div class="weather__temp">
        <img class="weather__icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
        <div class="weather__grades">${kelvinToCelsius(temp)}º</div>
      </div>
    </div>`;
}

function capitalizeFirstLetter(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function tripView({ images, weather, city, country, departing }) {
  const imageIdx = Math.floor(Math.random() * images.length);
  const imageSrc = images[imageIdx].src;
  const firstTag = images[imageIdx].tags.split(",")[0];
  const _timeLeft = timeLeft(new Date(departing));
  const _city = capitalizeFirstLetter(city);
  const tag = capitalizeFirstLetter(firstTag);

  return `
        <section class="section">
        <button id="back-btn" class="button button_secondary"><i class="fa-solid fa-arrow-left"></i>Back</button>
        </section>
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

class FormView {
  constructor() {
    this.template = $(`
    <section class="section">
    <button id="back-btn" class="button button_secondary"><i class="fa-solid fa-arrow-left"></i>Back</button>
    </section>
      <section class="section new-plan">
          <div class="section__title">
          <i class="icon fa-solid fa-suitcase-rolling"></i
          ><span>New trip</span>
          </div>
          <div class="section__content new-plan__content">
          <form class="form">
              <div class="input-col">
              <div class="input-container">
                  <label class="label" for="location">Where to?</label>
                  <input
                  class="input"
                  id="location"
                  type="text"
                  placeholder="e.g. Paris, France"
                  />
              </div>
              <div class="input-container">
                  <label class="label" for="departing">When to?</label>
                  <input class="input" id="departing" type="date" />
              </div>
              </div>
              <button id="save-btn" type="submit" class="button save-btn">
              Start planning
              </button>
          </form>
          </div>
      </section>
    `);

    this.locationEl = this.template.find("#location");
    this.departingEl = this.template.find("#departing");

    this.saveBtn = this.template.find("#save-btn");
    const self = this;
    this.saveBtn.click(function () {
      saveController({
        city: self.locationEl.val(),
        departing: self.departingEl.val().replace(/-/g, "/"),
      });
    });
  }

  render() {
    $("main").html(this.template);
  }
}

/* function formView() {
  return `
  <section class="section">
  <button id="back-btn" class="button button_secondary"><i class="fa-solid fa-arrow-left"></i>Back</button>
  </section>
    <section class="section new-plan">
        <div class="section__title">
        <i class="icon fa-solid fa-suitcase-rolling"></i
        ><span>New trip</span>
        </div>
        <div class="section__content new-plan__content">
        <form class="form">
            <div class="input-col">
            <div class="input-container">
                <label class="label" for="location">Where to?</label>
                <input
                class="input"
                id="location"
                type="text"
                placeholder="e.g. Paris, France"
                />
            </div>
            <div class="input-container">
                <label class="label" for="departing">When to?</label>
                <input class="input" id="departing" type="date" />
            </div>
            </div>
            <button id="save-btn" type="submit" class="button save-btn">
            Start planning
            </button>
        </form>
        </div>
    </section>
    `;
} */

function newController() {
  new FormView().render();
  /* render(formView); */
}

async function deleteTrip(id) {
  const apiUrl = `http://localhost:5050/api/v0/trips/${id}`;
  await fetch(apiUrl, {
    method: "DELETE",
    credentials: "same-origin",
  });
}

function deleteController(id) {
  deleteTrip(id)
    .then(() => indexController())
    .catch((error) => console.log(error));
}

async function getTrip(id) {
  const apiUrl = `http://localhost:5050/api/v0/trips/${id}`;
  const res = await fetch(apiUrl);
  const { data } = await res.json();
  return data;
}

function detailController(id) {
  getTrip(id)
    .then((data) => render(tripView, data))
    .catch((error) => console.log(error));
}

document.addEventListener("click", (ev) => {
  if (ev.target.matches("button")) {
    ev.preventDefault();
  }
  /* if (ev.target.matches("#save-btn")) {
    const locationEl = document.querySelector("#location");
    const departingEl = document.querySelector("#departing");
    saveController({
      city: locationEl.value,
      departing: departingEl.value.replace(/-/g, "/"),
    });
  } else */ if (ev.target.matches("#new-btn")) {
    newController();
  } else if (ev.target.matches("#delete-btn")) {
    deleteController(ev.target.dataset.id);
  } else if (ev.target.matches("#detail-btn")) {
    detailController(ev.target.dataset.id);
  } else if (ev.target.matches("#back-btn")) {
    indexController();
  }
});

function itemView({ id, city, country, departing }) {
  const _timeLeft = timeLeft(new Date(departing));
  const _city = capitalizeFirstLetter(city);

  return `
    <div class="item">
        <p class="item__description">
        <span class="item__city">${_city}</span>, ${country} is
        <span class="item__time-left">${_timeLeft.value} ${_timeLeft.unit} away</span>
        </p>
        <div class="item__actions">
        <button id="delete-btn" data-id="${id}" class="button button_mini button_delete">
            <i class="fa-solid fa-circle-minus"></i>Delete
        </button>
        <button id="detail-btn" data-id="${id}" class="button button_mini">
            <i class="fa-solid fa-eye"></i>Details
        </button>
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
