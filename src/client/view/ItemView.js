import { timeLeft, capitalizeFirstLetter } from "../js/utils";
export default class ItemView {
  constructor(controller) {
    this.controller = controller;
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
    this.deleteBtn = this.template.find("#delete-btn");
    this.detailBtn = this.template.find("#detail-btn");

    this.deleteBtn.click(function (ev) {
      this.controller.deleteTrip(ev.target.dataset.id);
    });

    this.detailBtn.click(function (ev) {
      this.controller.detailTrip(ev.target.dataset.id);
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
