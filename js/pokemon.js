class Pokemon {

    // (1)
    static activePokemon = null;

    // (2)
    static keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    };

    constructor(name, sprite) {
        this.name = name;
        this.sprite = sprite;
        this.element = this.createElement();
        this.addEventListeners();
    }
    
    createElement() {
      // (3) 
      const img = document.createElement("img");
      img.src = this.sprite;
      img.style.position = 'absolute';
      img.style.top = Math.ceil(Math.random() * 100) + 'px';
      img.style.left = Math.ceil(Math.random() * 100) + 'px';
      document.body.appendChild(img);
      return img;
    }
    
    addEventListeners() {   
      // (4)
      this.element.addEventListener("click", () => {
        Pokemon.activePokemon = this;
      });
    }
    
    move(step) { 
      // (5)
      let top = parseInt(this.element.style.top);
      let left = parseInt(this.element.style.left);

      if (Pokemon.keys.ArrowUp)
        this.element.style.top = (top - step) + "px";
      if (Pokemon.keys.ArrowDown)
        this.element.style.top = (top + step) + "px";
      if (Pokemon.keys.ArrowLeft)
        this.element.style.left = (left - step) + "px";
      if (Pokemon.keys.ArrowRight)
        this.element.style.left = (left + step) + "px";
    }
} // end of Pokemon class


document.addEventListener('keydown', function (event) {
   // (6)
   Pokemon.keys[event.key] = true;
});

document.addEventListener('keyup', function (event) {
  // (7)
  Pokemon.keys[event.key] = false;
});

function moveActivePokemon() {
  // (8)
  const step = 5;
  if (Pokemon.activePokemon) {
    Pokemon.activePokemon.move(step);
  }
}

setInterval(moveActivePokemon, 10);

// Instantiate Pokémon
const pokemonNames = ['pikachu', 'bulbasaur', 'charmander', 'squirtle'];

function cargarJuego() {
  const promesas = pokemonNames.map(name => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(r => r.json())
      .then(data => {
        const sprite = data.sprites.front_default;
        return new Pokemon(name, sprite);
      });
  });

  Promise.all(promesas)
    .then(pokemons => console.log("Todos los Pokemon cargados", pokemons))
    .catch(err => console.error("Error cargando los Pokemon", err));
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    let imagen = new Image();
    imagen.src = url;
    imagen.onload = () => resolve(imagen);
    imagen.onerror = () => reject(new Error("No se pudo cargar la imagen"));
  });
}

// Carga inicial
loadImage("https://preview.redd.it/dnlz6c3xni951.jpg?width=1080&crop=smart&auto=webp&s=84af1d3e4e27eddc5c612a7b75244a9886389f77")
  .then(image => document.body.append(image))
  .catch(err => console.error(err));

cargarJuego();

// Esperamos a que el DOM esté listo para capturar los inputs y el botón
document.addEventListener('DOMContentLoaded', () => {
    let nombrePokemon = document.getElementById("nombrePokemon");
    let checkbox = document.getElementById("shiny");
    let botonBuscar = document.getElementById("buscarPokemon");

    function buscarYAgregarPokemon() {
      let name = nombrePokemon.value.trim().toLowerCase();
      if (!name) return;

      if (checkbox.checked) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
          .then(r => r.json())
          .then(data => {
            const sprite = data.sprites.front_shiny;
            return new Pokemon(name, sprite);
          })
          .catch(err => alert("Pokémon no encontrado"));

      } else {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
          .then(r => r.json())
          .then(data => {
            const sprite = data.sprites.front_default;
            return new Pokemon(name, sprite);
          })
          .catch(err => alert("Pokémon no encontrado"));
      }

      nombrePokemon.value = ''; // Limpiar el input
    }

    botonBuscar.addEventListener("click", buscarYAgregarPokemon);
});