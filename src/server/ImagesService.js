const URL_BASE = process.env.PIXABAY_URL_BASE;
const API_KEY = process.env.PIXABAY_API_KEY;

async function getImages(keyword) {
  const params = {
    image_type: "photo",
    category: "places",
    min_width: 150,
    per_page: 10,
    orientation: "horizontal",
    q: keyword,
    key: API_KEY,
  };

  const url = `${URL_BASE}?${Object.entries(params)
    .map((p) => p.join("="))
    .join("&")}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { status: res.status, message: res.statusText };
    }
    const data = await res.json();
    if (data.hits.length === 0) {
      return { status: 404 };
    }

    const images = data.hits.map((image) => ({
      id: image.id,
      src: image.webformatURL,
      tags: image.tags,
    }));

    return { status: 200, images };
  } catch (error) {
    console.log("Error: ", error.message);
    return { status: 500 };
  }
}

module.exports = { getImages };
