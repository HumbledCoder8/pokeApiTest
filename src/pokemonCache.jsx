//rewrite from scratch to prove understanding.


import React, { createContext, useContext, useState } from 'react';

const PokemonCacheContext = createContext();

export function PokemonCacheProvider({ children }) {
  const [cache, setCache] = useState({});

  const addToCache = (pokemonName, data) => {
    setCache(prevCache => ({
      ...prevCache,
      [pokemonName.toLowerCase()]: data
    }));
  };

  const getFromCache = (pokemonName) => {
    return cache[pokemonName.toLowerCase()];
  };

  return (
    <PokemonCacheContext.Provider value={{ addToCache, getFromCache }}>
      {children}
    </PokemonCacheContext.Provider>
  );
}

export function usePokemonCache() {
  return useContext(PokemonCacheContext);
}