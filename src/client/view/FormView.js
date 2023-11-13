export default class FormView {
  constructor(controller) {
    this.controller = controller;
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
      this.controller.saveTrip({
        city: self.locationEl.val(),
        departing: self.departingEl.val().replace(/-/g, "/"),
      });
    });
  }

  render() {
    $("main").html(this.template);
  }
}
