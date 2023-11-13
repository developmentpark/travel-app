import { httpService } from "./httpService";
import TripListView from "../view/TripListView";
import TripView from "../view/TripView";
import FormView from "../view/FormView";

export default class Controller {
  constructor() {
    this.tripListView = new TripListView(this);
    this.formView = new FormView(this);
    this.tripView = new TripView(this);
    this.index();
  }
  index() {
    httpService
      .getAll()
      .then((data) => this.tripListView.render(data))
      .catch((error) => console.log(error));
  }
  detailTrip(id) {
    httpService
      .getTrip(id)
      .then((data) => this.tripView.render(data))
      .catch((error) => console.log(error));
  }
  newTrip() {
    this.formView.render();
  }
  deleteTrip(id) {
    httpService
      .deleteTrip(id)
      .then(() => this.index())
      .catch((error) => console.log(error));
  }
  saveTrip({ city, departing }) {
    httpService
      .save({ city, departing })
      .then((data) => this.tripView.render(data))
      .catch((error) => console.log(error));
  }
}
