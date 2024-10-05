import React, {useState, useRef} from 'react';
import './pokemonEvolutionStuff.css';
import arrow from './assets/arrow.gif';


//file for rendering the evolution stuff. There will be 2 arrows, one on each side of the pokemon 
const MAIN_API_ENDPOINT = "https://pokeapi.co/api/v2/pokemon/";
const EVOLUTION_CHAIN_ENDPOINT = "https://pokeapi.co/api/v2/evolution-chain/";

//YOU WILL NEED TO CACHE LATER. DONT FORGET TO DO THAT.
export async function organizeEvolutionData(pokemonData,addPokemonToCache,getPokemonFromCache,addEvolutionChainToCache,getEvolutionChainFromCache) {
    try {
      // Fetch species data
      console.log("name of pokemon:",pokemonData.name);

      const speciesUrl = pokemonData.species.url;
      const cachedData = getPokemonFromCache(pokemonData.name);
      console.log("Cached data:", cachedData);
      const cachedEvolutionId = cachedData?.evolutionChainId;
      console.log("Cached evolution ID:", cachedEvolutionId);
      

      //const cachedEvolutionId = (cachedData.evolutionChainId); //need to add this
      console.log("heres the Evo Id ", cachedEvolutionId);

      //only do all this work if evolutionId is null: that means it hasnt been cached.
      if(cachedEvolutionId == null)
        {
          const speciesResponse = await fetch(speciesUrl);
          const speciesData = await speciesResponse.json();
      
          // Fetch evolution chain data
          const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
          const evolutionChainData = await evolutionChainResponse.json();
          const evolutionChainId = evolutionChainData.id;
          console.log("Here is the evolutionChain json: ", evolutionChainData.id);
      

          const evolutionNames = [];
          let currentStage = evolutionChainData.chain;
      
          // First, create an array with just the names
          while (currentStage) {
            evolutionNames.push({
                name: currentStage.species.name
            });
            //addToCache()
            currentStage = currentStage.evolves_to[0];
          }
      
          // Now, fetch additional data for each Pokémon
          const evolutionData = await Promise.all(evolutionNames.map(async (pokemon) => {
            try {
              const pokemonResponse = await fetch(`${MAIN_API_ENDPOINT}${pokemon.name}`);
              const pokemonData = await pokemonResponse.json();
              return {
                ...pokemon,
                speciesId: pokemonData.id,
                spriteUrl: pokemonData.sprites.front_default
              };
            } catch (error) {
              console.error(`Error fetching data for ${pokemon.name}:`, error);
              return pokemon; // Return the original object if there's an error
            }
          }));
      
          console.log("Evolution Data: ", evolutionData);


          return evolutionData; //will be an object now 
        }
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return [];
    }


  }
  
  //component will start simple but eventually become a monster. Will need to deal with 
  //stuff like evolutionary items, levels, etc. 
  export function EvolutionaryComponent({evolutionData, onPokemonClick}){

    const handlePokemonClick = (pokemonName) => {
      onPokemonClick(pokemonName);
    };
    //phase1: simple form.
    //data form[pokemon1,pokemon2,pokemon3. not accessing component if theres no evolution.]
    return (
        <div className="evolution-chain" >
            <h1>Evolutionary Chain</h1>

            <div className="evolution-chain-container">
                {evolutionData.map((pokemon, index) => (
                <React.Fragment key={index}>
                    <div className="pokemon-details">
                            #{pokemon.speciesId}
                        <span>{pokemon.name}</span>
                        <img src={pokemon.spriteUrl} onClick={() => handlePokemonClick(pokemon.name)}
                          alt={pokemon.name}
                          role="button"
                          aria-label={`Search for ${pokemon.name}`}
                        ></img>
                    </div>
                   
                    {index < evolutionData.length - 1 && (
                    <img src={arrow} alt="Evolution arrow" className="arrow-gif"/>
                    )}
                </React.Fragment>
                ))}
            </div>
        </div>
      );


      //evolutionData.sprites.front_default; Will this be dealt with properly? need to render all the 
      //sprites. Should they be fetched at beginning and transferred over?

  }

    


    //toggle flags. return object i guess. an object of the pokemon in the evolution chain with the flags:
    //divergent-evolution: the component will render differently, 
    
    //return an array of 1,2,3,4, wtv. the array will be something like [bulbasaur, ivysaur, venusaur]. 
    //The searched pokemon will be highlighted, perhaps with a glowing animation?. The other pokemon Will be 
    //rendered dynamically. That means if theres only 2, it will adjust to be centered, same as if there is 
    //just 1, or 3. 
    

    //if theres 1 object, flag arraytype1. if 2 objects, flag arraytype2

