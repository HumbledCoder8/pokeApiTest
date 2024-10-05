import React, { createContext, useContext, useState, useCallback } from 'react';

const PokemonCacheContext = createContext();

export function PokemonCacheProvider({ children }) {
  const [cache, setCache] = useState({
    pokemon: {},
    evolutionChains: {}
  });

  const addPokemonToCache = useCallback((pokemonName, data, evolutionChainId = null) => {
    setCache(prevCache => ({
      ...prevCache,
      pokemon: {
        ...prevCache.pokemon,
        [pokemonName.toLowerCase()]: {
          ...data,
          evolutionChainId
        }
      }
    }));
  }, []);

  const getPokemonFromCache = useCallback((pokemonName) => {
    return cache.pokemon[pokemonName.toLowerCase()];
  }, [cache.pokemon]);

  const addEvolutionChainToCache = useCallback((evolutionId, pokemonArray) => {
    setCache(prevCache => ({
      ...prevCache,
      evolutionChains: {
        ...prevCache.evolutionChains,
        [evolutionId]: pokemonArray
      }
    }));
  }, []);

  const getEvolutionChainFromCache = useCallback((evolutionId) => {
    return cache.evolutionChains[evolutionId];
  }, [cache.evolutionChains]);

  const value = {
    addPokemonToCache,
    getPokemonFromCache,
    addEvolutionChainToCache,
    getEvolutionChainFromCache
  };

  return (
    <PokemonCacheContext.Provider value={value}>
      {children}
    </PokemonCacheContext.Provider>
  );
}

export function usePokemonCache() {
  return useContext(PokemonCacheContext);
}