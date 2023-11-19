import ItemView from "./ItemView";

export default class TripListView {
  constructor(controller) {
    this.controller = controller;
    this.template = $(`
      <section class="section plans">
        <h2 class="section__title plans__title">
        <i class="icon fa-solid fa-list-check"></i>My trips
        </h2>
        <ul class="section__content plans__list"></ul>
      </section>`);

    this.planList = this.template.find(".plans__list");

    const self = this;
    $(document).on("click", "#new-btn", function () {
      self.controller.newTrip();
    });
  }

  render(list) {
    $("main").empty();
    this.planList.empty();
    list.forEach((item) =>
      new ItemView(this.controller).render(this.planList, item),
    );
    $("main").html(this.template);
  }
}
