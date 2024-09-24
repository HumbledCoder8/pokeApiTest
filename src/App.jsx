
import './App.css';
import PokeApi from './pokeApi.jsx';
import {PokemonCacheProvider} from "./pokemonCache.jsx";

function App() {
  return (
    <div>
      <header className="App-header">
       <PokemonCacheProvider>
        <PokeApi/>
       </PokemonCacheProvider> 
 
      </header>
    </div>
  );
}

export default App;
