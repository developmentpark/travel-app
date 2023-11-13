import { kelvinToCelsius } from "../js/utils";

export default class WeatherDayView {
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
