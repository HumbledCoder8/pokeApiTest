import React, { useState, useEffect } from "react";
import './pokeApi.css';
import pokeBallGif from './assets/pokeballgif.gif'; // Adjust the path as needed


const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  };

function PokeApi() {
  const [inputValue, setInputValue] = useState('');
  const [pokemonData, setPokemonData] = useState(null);

  const getTypeColor = (type) => {
     return typeColors[type] || '#777' //defaults to a gray color.
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}`);
      const data = await response.json();
      console.log(data);
      // Handle the Pokemon data here
      setPokemonData(data); //data is being set to pokemonData, so that the data can be tracked across 
      //space and time. otherwise it just goes..."poof".
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleKeyDown = (event) => {
    if(event.key == 'Enter'){
        handleSubmit();
    }
  }

  const renderPokemonInfo = (pokemonData) => {
    const typeName = pokemonData.types[0].type.name;
    return (
      <div className="pokemon-info">
        <div className="pokemon-name">{pokemonData.name}</div>
        <div className="pokemon-type" style={{backgroundColor: getTypeColor(typeName)}}>
          {typeName}
        </div>
        <div className="pokemon-sprite">
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
        </div>
      </div>
    );
  };

  return (
    <div className="poke-api-container">
      <div className="header-container">
        <img src={pokeBallGif} alt="Pokeball" className="header-gif" />
        <h1>Gotta Catch em All</h1>
        <img src={pokeBallGif} alt="Pokeball" className="header-gif" />
      </div>
      <input className="poke-input"
        type="text"
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Pokemon name"
      />
      <button className="poke-button" onClick={handleSubmit}>Search Pokemon</button>
   

    {pokemonData && renderPokemonInfo(pokemonData)}

    </div>
  );
}

export default PokeApi;