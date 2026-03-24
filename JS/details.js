// ------------------ PARAMS ------------------
const params = new URLSearchParams(window.location.search);
const name = decodeURIComponent(params.get("name"));
const type = params.get("type");
const container = document.getElementById("details");

// ------------------ MAIN ------------------
async function getDetails() {
  try {
    if (!name || !type) {
      throw new Error("Parámetros inválidos");
    }

    if (type === "pokemon") {
      await getPokemonDetails();
    } else if (type === "location") {
      await getLocationDetails();
    } else if (type === "game") {
      await getGameDetails();
    }

  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <p class="text-danger">Error cargando información 😢</p>
    `;
  }
}

// ------------------ POKÉMON ------------------
async function getPokemonDetails() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!res.ok) throw new Error("Error en Pokémon API");

  const data = await res.json();

  // 🔥 segunda API para descripción
  const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  const speciesData = await speciesRes.json();

  const description = speciesData.flavor_text_entries
    .find(entry => entry.language.name === "es" || entry.language.name === "en")
    ?.flavor_text.replace(/\f/g, " ");

  renderPokemon(data, description);
}

function renderPokemon(pokemon, description) {
  const types = pokemon.types.map(t => t.type.name).join(", ");
  const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");

  container.innerHTML = `
    <h2 class="text-capitalize">${pokemon.name}</h2>

    <img src="${pokemon.sprites.other['official-artwork'].front_default}" 
         class="img-fluid mb-3" style="width:250px">

    <p class="text-muted">${description || "Sin descripción"}</p>

    <p><strong>Tipo:</strong> ${types}</p>
    <p><strong>Habilidades:</strong> ${abilities}</p>
    <p><strong>Altura:</strong> ${pokemon.height}</p>
    <p><strong>Peso:</strong> ${pokemon.weight}</p>
  `;
}

// ------------------ LOCACIONES ------------------
async function getLocationDetails() {
  const res = await fetch(`https://pokeapi.co/api/v2/location/${name}`);
  if (!res.ok) throw new Error("Error en Location API");

  const data = await res.json();

  renderLocation(data);
}

function renderLocation(location) {
  container.innerHTML = `
    <h2 class="text-capitalize">${location.name}</h2>

    <img src="https://picsum.photos/400/250" class="mb-3">

    <p><strong>ID:</strong> ${location.id}</p>
    <p><strong>Región:</strong> ${location.region?.name || "Desconocida"}</p>
    <p><strong>Áreas:</strong> ${location.areas.length}</p>
  `;
}

// ------------------ JUEGOS ------------------
async function getGameDetails() {
  const res = await fetch(`https://pokeapi.co/api/v2/version/${name}`);
  if (!res.ok) throw new Error("Error en Game API");

  const data = await res.json();

  renderGame(data);
}

function renderGame(game) {
  container.innerHTML = `
    <h2 class="text-capitalize">${game.name}</h2>

    <img src="https://via.placeholder.com/400x250?text=${game.name}" class="mb-3">

    <p><strong>ID:</strong> ${game.id}</p>
    <p><strong>Grupo:</strong> ${game.version_group.name}</p>
  `;
}

// ------------------ INIT ------------------
getDetails();