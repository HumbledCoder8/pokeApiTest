import React, {useState, useRef, useEffect} from 'react';
import './pokeApi.css';

const PokemonSpriteStuff = ({ pokemonName, spriteUrl, audioUrl }) => {
  const audioRef = React.useRef(null);
  const [audioError, setAudioError] = useState(false);
  
  useEffect(() => {
    setAudioError(false);
  }, [pokemonName, spriteUrl, audioUrl]);




  const handlePlay = () => {
    if (audioRef.current && !audioError) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setAudioError(true);
      });
    }
    else if(audioError){
      console.error("audio doesn't work");
    }
  };

  const handleAudioError = () => {
    console.error("audio doesn't work2");
    console.error(audioUrl);
    setAudioError(true);
  }
  

  return (
    <div className="pokemon-sprite">
      <img 
        src={spriteUrl}
        alt={`${pokemonName} sprite`} 
        onClick={handlePlay} 
        style={{ cursor: 'pointer' }} 
      />
         <audio ref={audioRef} 
         src={audioUrl}
         onError={handleAudioError} />
   
    </div>
  );

}

export default PokemonSpriteStuff;


//add this once a solution is found