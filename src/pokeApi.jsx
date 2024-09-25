//ntegrate:, habitat, moves, etc. -cry(audio component), -pokemon evolutions


import React, { useState, useCallback } from "react";
import './pokeApi.css';
import pokeBallGif from './assets/pokeballgif.gif'; // Adjust the path as needed
import {usePokemonCache} from './pokemonCache.jsx';
import useDebounce from './useDebounce.jsx';
import PokemonSpriteStuff from './pokemonSpriteStuff.jsx';

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
  const [error, setError] = useState(null);
  const {addToCache, getFromCache} = usePokemonCache();


  const getTypeColor = (type) => {
     return typeColors[type] || '#777' //defaults to a gray color.
  }

  //this returns a const 



  const handleSubmit = async () => {
    try {
      if(!inputValue.trim()){
        throw new Error("Please enter a Pokemon name.");
      }

      setError(null);

      const pokemonName = inputValue.toLowerCase();
      const cachedData = getFromCache(pokemonName);

      if(cachedData) {
        console.log('Data retrieved from cache');
        setPokemonData(cachedData);
        return; //important so to skip the const response, instead of using an else. 
      }

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue.toLowerCase()}`);
      if (!response.ok) {
        throw new Error("That's not a pokemon.");
      }
      
      const data = await response.json();
      console.log("data from the api: ", data);
      // Handle the Pokemon data here
      setPokemonData(data); //data is being set to pokemonData, so that the data can be tracked across 
      //space and time. otherwise it just goes..."poof".
      addToCache(pokemonName, data);
    } catch (error) {
      console.error('Error:', error);
      setError('Pokemon not found.');
      setPokemonData(null);
    }
  };

  const debouncedHandleSubmit = useDebounce(handleSubmit, 300)

  const handleKeyDown = (event) => {
    if(event.key == 'Enter'){
        debouncedHandleSubmit();
        //handleSubmit();
    }
  }

  //important function that renders all important information about the pokemon
  const renderPokemonInfo = (pokemonData) => {
    
    const typeName = pokemonData.types[0].type.name;
    //const audioUrl = pokemonData.cries.latest; Not available for now
    const audioUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonData.name.toLowerCase()}.ogg`;
    const spriteUrl = pokemonData.sprites.front_default;
    return (
      <div className="pokemon-info">
        <div className="pokemon-name">{pokemonData.name}</div>
        <div className="pokemon-id">#{pokemonData.id}</div>
        <div className="pokemon-type" style={{backgroundColor: getTypeColor(typeName)}}>
          {typeName}
        </div>
        <PokemonSpriteStuff 
          pokemonName = {pokemonData.name}
          spriteUrl = {spriteUrl}
          audioUrl = {audioUrl} />
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
      <button className="poke-button" onClick={debouncedHandleSubmit}>Search Pokemon</button>
   
    {error && <div className="error-message">{error}</div>}
    {pokemonData && renderPokemonInfo(pokemonData)}

    </div>
  );
}

export default PokeApi;


//must retrieve from cachÉ but also add logic to add to cachÉ.