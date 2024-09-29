import React, {useState, useRef} from 'react';
import './pokemonEvolutionStuff.css';
import arrow from './assets/arrow.gif';

//file for rendering the evolution stuff. There will be 2 arrows, one on each side of the pokemon 

export async function organizeEvolutionData(speciesUrl) {
    try {
      // Fetch species data
      const speciesResponse = await fetch(speciesUrl);
      const speciesData = await speciesResponse.json();
  
      // Fetch evolution chain data
      const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionChainData = await evolutionChainResponse.json();
  
      const evolutionNames = [];
      let currentStage = evolutionChainData.chain;
  
      // Traverse the evolution chain from base to final form
      while (currentStage) {
        evolutionNames.push(currentStage.species.name);
        currentStage = currentStage.evolves_to[0]; // Move to the next evolution
      }
      
      console.log("Evolution Names: ", evolutionNames);
      return evolutionNames;
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return [];
    }
  }
  
  //component will start simple but eventually become a monster. Will need to deal with 
  //stuff like evolutionary items, levels, etc. 
  export function EvolutionaryComponent({evolutionData}){
    //phase1: simple form.
    //data form[pokemon1,pokemon2,pokemon3. not accessing component if theres no evolution.]
    return (
        <div className="evolution-chain" >
            <h1>Evolutionary Chain</h1>

            <div className="evolution-chain-container">
                {evolutionData.map((pokemon, index) => (
                <React.Fragment key={index}>

                    <span>{pokemon}</span>
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

