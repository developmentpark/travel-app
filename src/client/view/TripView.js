import WeatherDayView from "./WeatherDayView";
import { timeLeft, capitalizeFirstLetter } from "../js/utils";

export default class TripView {
  constructor(controller) {
    this.controller = controller;
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
    this.backBtn = this.template.find("#back-btn");
    this.backBtn.click(function () {
      this.controller.index();
    });
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
