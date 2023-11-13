class HttpService {
  constructor() {
    this.apiUrl = "http://localhost:5050/api/v0";
  }
  async getAll() {
    const url = this.apiUrl + "/trips";
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
  }
  async getTrip(id) {
    const url = this.apiUrl + `/trips/${id}`;
    const res = await fetch(url);
    const { data } = await res.json();
    return data;
  }
  async deleteTrip(id) {
    const url = this.apiUrl + `/trips/${id}`;
    await fetch(url, {
      method: "DELETE",
      credentials: "same-origin",
    });
  }
  async save({ city, departing }) {
    const url = this.apiUrl + "/trips";
    const res = await fetch(url, {
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
}

const httpService = new HttpService();

export { httpService };
