const locationEl = document.querySelector("#location");
const departingEl = document.querySelector("#departing");

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
  const data = await res.json();
  return data;
}

function saveController({ city, departing }) {
  save({ city, departing })
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

document.addEventListener("click", (ev) => {
  if (ev.target.matches("button")) {
    ev.preventDefault();
  }
  if (ev.target.matches("#save-btn")) {
    saveController({
      city: locationEl.value,
      departing: departingEl.value,
    });
  }
});
