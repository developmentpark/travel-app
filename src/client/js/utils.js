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

function capitalizeFirstLetter(word) {
  return word[0].toUpperCase() + word.slice(1);
}

export { kelvinToCelsius, timeLeft, capitalizeFirstLetter };
