//ntegrate:, habitat, moves, etc. -cry(audio component), -pokemon evolutions
//UseEffect runs after every render of the component. second element is a dependency array; it affects the 
//behavior of the hook.

import React, { useState, useEffect, useCallback, useMemo } from "react";
import './pokeApi.css';
import pokeBallGif from './assets/pokeballgif.gif'; // Adjust the path as needed
import {usePokemonCache} from './pokemonCache.jsx';
import useDebounce from './useDebounce.jsx';
import PokemonSpriteStuff from './pokemonSpriteStuff.jsx';
import {EvolutionaryComponent, organizeEvolutionData} from './pokemonEvolutionStuff.jsx';

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

  const [evolutionData,setEvolutionData] = useState(null);


  useEffect(() => {
    async function fetchEvolutionData() {
      if (pokemonData && pokemonData.species && pokemonData.species.url) {
        try {
          //organizeEvolutionData arranges the pokemon names in order. eg: [bulbasaur,ivysaur,venasaur]
          //This array should just be 1 component. We need the #, 
          const evolutionData = await organizeEvolutionData(pokemonData.species.url);
          setEvolutionData(evolutionData);
        } catch (error) {
          console.error("Error fetching evolution data:", error);
          setEvolutionData(null);
        }
      } else {
        setEvolutionData(null);
      }
    }

    fetchEvolutionData();
  }, [pokemonData]);


  const getTypeColor = (type) => {
     return typeColors[type] || '#777' //defaults to a gray color.
  }

  //this returns a const 

  //handle the pokemonEvolutionStuff component

  

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
    
  
    //const handleEvolution = pokemonEvolutionStuff(pokemonData.species.url);
    
    //const audioUrl = pokemonData.cries.latest; Not available for now

    //so probably what should be done: we go down the rabbit whole of species, first we start with what
    //the user searched for and send it through to a the pokemonEvolutionStuff component.
    //This component will sort out where the pokemon 

    const audioUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonData.name.toLowerCase()}.ogg`;
    const spriteUrl = pokemonData.sprites.front_default;
    return (
      <div className="pokemon-info">
        <div className="pokemon-name">{pokemonData.name}</div>
        <div className="pokemon-id">#{pokemonData.id}</div>
        {pokemonData.types.map((typeInfo, index) => (
          <div 
            key={index}
            className="pokemon-type" 
            style={{backgroundColor: getTypeColor(typeInfo.type.name)}}
          >
            {typeInfo.type.name}
          </div>
        ))}
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
  

      {evolutionData && evolutionData.length > 1 && (
        <EvolutionaryComponent evolutionData={evolutionData} />
      )}

    </div>
  );
}

export default PokeApi;


//must retrieve from cachÉ but also add logic to add to cachÉ.