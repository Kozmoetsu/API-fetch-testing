// ------------------ SLIDES ------------------
function createSlides(data, itemsPerSlide = 4) {
  const slides = [];
  for (let i = 0; i < data.length; i += itemsPerSlide) {
    slides.push(data.slice(i, i + itemsPerSlide));
  }
  return slides;
}

// ------------------ CARD TEMPLATE ------------------
function createCard(item) {
  return `
    <div class="col-md-3">
      <div class="card mb-3 text-center h-100">

        ${item.image ? `
          <img src="${item.image}" 
               class="card-img-top"
               onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
        ` : ""}

        <div class="card-body">
          <h5 class="card-title text-capitalize">${item.name}</h5>

          <a href="../HTML/details.html?name=${encodeURIComponent(item.name)}&type=${item.type}" 
             class="btn btn-primary">
             Ver más
          </a>
        </div>

      </div>
    </div>
  `;
}

// ------------------ RENDER ------------------
function renderCarousel(data, containerId) {
  const container = document.getElementById(containerId);
  const slides = createSlides(data);

  let html = "";

  slides.forEach((group, index) => {
    const active = index === 0 ? "active" : "";

    const cards = group.map(createCard).join("");

    html += `
      <div class="carousel-item ${active}">
        <div class="row">
          ${cards}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ------------------ IMÁGENES ------------------
function getLocationImage() {
  return "https://picsum.photos/300/200";
}

const gameImages = {
  leafgreen: "https://archives.bulbagarden.net/media/upload/1/1b/FireRed_LeafGreen_LeafGreen.png",
  emerald: "https://archives.bulbagarden.net/media/upload/7/7e/Emerald_EN_boxart.png",
  diamond: "https://archives.bulbagarden.net/media/upload/3/3f/Diamond_EN_boxart.png",
  soulsilver: "https://archives.bulbagarden.net/media/upload/6/6e/SoulSilver_EN_boxart.png",
  "black-2": "https://archives.bulbagarden.net/media/upload/2/2a/Black_2_EN_boxart.png",
  x: "https://archives.bulbagarden.net/media/upload/7/70/X_EN_boxart.png"
};

function getGameImage(name) {
  return gameImages[name] || "https://via.placeholder.com/300x200?text=Pokemon+Game";
}

// ------------------ POKÉMON ------------------
async function getPokemons() {
  const pokemonList = [
    "luxray",
    "kyurem-black",
    "suicune",
    "garchomp",
    "totodile",
    "delphox"
  ];

  try {
    const pokemons = await Promise.all(
      pokemonList.map(async (name) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) throw new Error("Error en Pokémon API");

        const data = await res.json();

        return {
          name: data.name,
          image: data.sprites.other["official-artwork"].front_default,
          type: "pokemon"
        };
      })
    );

    renderCarousel(pokemons, "pokemonContainer");

  } catch (error) {
    console.error(error);
  }
}

// ------------------ LOCACIONES ------------------
async function getLocations() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/location?limit=12");
    if (!res.ok) throw new Error("Error en Locations API");

    const data = await res.json();

    const locations = data.results.map(loc => ({
      name: loc.name,
      image: getLocationImage(),
      type: "location"
    }));

    renderCarousel(locations, "locationContainer");

  } catch (error) {
    console.error(error);
  }
}

// ------------------ JUEGOS ------------------
async function getGames() {
  const gameList = [
    "leafgreen",
    "emerald",
    "diamond",
    "soulsilver",
    "black-2",
    "x"
  ];

  try {
    const games = await Promise.all(
      gameList.map(async (name) => {
        const res = await fetch(`https://pokeapi.co/api/v2/version/${name}`);
        if (!res.ok) throw new Error("Error en Games API");

        const data = await res.json();

        return {
          name: data.name,
          image: getGameImage(name),
          type: "game"
        };
      })
    );

    renderCarousel(games, "gameContainer");

  } catch (error) {
    console.error(error);
  }
}

// ------------------ INIT ------------------
getPokemons();
getLocations();
getGames();