import { httpService } from "./httpService";

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

class WeatherDayView {
  constructor() {
    this.template = $(`<div class="weather__day">
      <div class="weather__day-name"></div>
      <div class="weather__temp">
        <img class="weather__icon"/>
        <div class="weather__grades"></div>
      </div>
    </div>`);

    this.weatherDayName = this.template.find(".weather__day-name");
    this.weatherIcon = this.template.find(".weather__icon");
    this.weatherGrader = this.template.find(".weather__grades");
  }

  render(root, { date, icon, temp }) {
    const dayName = new Date(date).toLocaleString("en", { weekday: "short" });
    this.weatherDayName.text(dayName);
    this.weatherIcon.attr(
      "src",
      `https://openweathermap.org/img/wn/${icon}@2x.png`,
    );
    this.weatherGrader.text(`${kelvinToCelsius(temp)}º`);

    root.append(this.template);
  }
}

function capitalizeFirstLetter(word) {
  return word[0].toUpperCase() + word.slice(1);
}

class TripView {
  constructor() {
    this.template = $(`
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
            </div>
            <div class="plan__country"></div>
          </div>
          <div class="plan__departing">
            <i class="plan__departing-icon fa-regular fa-calendar-days"></i>
            <span class="plan__departing-value"></span
            ><span>left until departure</span>
          </div>
          <div class="image">
            <div class="image__caption"></div>
            <img
              class="image__content"
            />
          </div>
          <div class="weather">
            <div class="weather__title">Weather</div>
            <div class="weather__content"></div>
          </div>
        </div>
      </section>
    `);

    this.weatherContentEl = this.template.find(".weather__content");
    this.imageContentEl = this.template.find(".image__content");
    this.imageCaptionEl = this.template.find(".image__caption");
    this.planDepartingValueEl = this.template.find(".plan__departing-value");
    this.planCountryEl = this.template.find(".plan__country");
    this.planCityEl = this.template.find(".plan__city");
  }

  render({ images, weather, city, country, departing }) {
    const _city = capitalizeFirstLetter(city);
    this.planCityEl.html(
      `<i class="fa-solid fa-location-dot"></i><span>${_city}</span>`,
    );

    this.planCountryEl.text(country);

    const _timeLeft = timeLeft(new Date(departing));
    this.planDepartingValueEl.text(`${_timeLeft.value} ${_timeLeft.unit}`);

    const tag = capitalizeFirstLetter(firstTag);
    this.imageCaptionEl.text(tag);

    const imageIdx = Math.floor(Math.random() * images.length);
    const imageSrc = images[imageIdx].src;
    this.imageContentEl.attr("src", imageSrc);
    this.imageContentEl.attr("alt", tag);

    weather.forEach(({ date, icon, temp }) =>
      new WeatherDayView().render(this.weatherContentEl, { date, icon, temp }),
    );

    $("main").html(this.template);
  }
}

class WeatherDayView {
  constructor() {
    this.template = $(`<div class="weather__day">
      <div class="weather__day-name"></div>
      <div class="weather__temp">
        <img class="weather__icon"/>
        <div class="weather__grades"></div>
      </div>
    </div>`);

    this.weatherDayName = this.template.find(".weather__day-name");
    this.weatherIcon = this.template.find(".weather__icon");
    this.weatherGrader = this.template.find(".weather__grades");
  }

  render(root, { date, icon, temp }) {
    const dayName = new Date(date).toLocaleString("en", { weekday: "short" });
    this.weatherDayName.text(dayName);
    this.weatherIcon.attr(
      "src",
      `https://openweathermap.org/img/wn/${icon}@2x.png`,
    );
    this.weatherGrader.text(`${kelvinToCelsius(temp)}º`);

    root.append(this.template);
  }
}

const tripView = new TripView();

function saveController({ city, departing }) {
  httpService
    .save({ city, departing })
    .then((data) => tripView.render(data))
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

function newController() {
  new FormView().render();
}

function deleteController(id) {
  httpService
    .deleteTrip(id)
    .then(() => indexController())
    .catch((error) => console.log(error));
}

function detailController(id) {
  httpService
    .getTrip(id)
    .then((data) => tripView.render(data))
    .catch((error) => console.log(error));
}

document.addEventListener("click", (ev) => {
  if (ev.target.matches("button")) {
    ev.preventDefault();
  }
  if (ev.target.matches("#new-btn")) {
    newController();
  } else if (ev.target.matches("#delete-btn")) {
    deleteController(ev.target.dataset.id);
  } else if (ev.target.matches("#detail-btn")) {
    detailController(ev.target.dataset.id);
  } else if (ev.target.matches("#back-btn")) {
    indexController();
  }
});

class ItemView {
  constructor() {
    this.template = $(`
      <div class="item">
        <p class="item__description"></p>
        <div class="item__actions">
        <button id="delete-btn" class="button button_mini button_delete">
            <i class="fa-solid fa-circle-minus"></i>Delete
        </button>
        <button id="detail-btn" class="button button_mini">
            <i class="fa-solid fa-eye"></i>Details
        </button>
        </div>
      </div>`);

    this.description = this.template.find(".item__description");
    this.deleteBtn = this.template.find(".delete-btn");
    this.detailBtn = this.template.find(".detail-btn");

    this.deleteBtn.click(function (ev) {
      deleteController(ev.target.dataset.id);
    });

    this.detailBtn.click(function (ev) {
      detailController(ev.target.dataset.id);
    });
  }

  render(root, { id, city, country, departing }) {
    const _timeLeft = timeLeft(new Date(departing));
    const _city = capitalizeFirstLetter(city);

    this.description
      .html(`<span class="item__city">${_city}</span>, ${country} is
    <span class="item__time-left">${_timeLeft.value} ${_timeLeft.unit} away</span>`);

    this.deleteBtn.attr("data-id", id);
    this.detailBtn.attr("data-id", id);

    root.append(this.template);
  }
}

class TripListView {
  constructor() {
    this.template = $(`
    <section class="section plans">
      <h2 class="section__title plans__title">
      <i class="icon fa-solid fa-list-check"></i>My trips
      </h2>
      <ul class="section__content plans__list"></ul>
    </section>`);

    this.planList = this.template.find(".plans_list");
  }

  render(list) {
    list.forEach((item) => new ItemView().render(this.planList, item));
    $("main").html(this.template);
  }
}

function indexController() {
  httpService
    .getAll()
    .then((data) => new TripListView().render(data))
    .catch((error) => console.log(error));
}

document.addEventListener("DOMContentLoaded", indexController);
