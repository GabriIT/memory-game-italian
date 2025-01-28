import React, { useState, useEffect } from 'react';
import { decode } from 'html-entities';
import './MemoryGame.css'; // Import the CSS file

const MemoryGame = () => {
  // 1. Load and Prepare Data
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Fetch data from vocIT.json
    const fetchData = async () => {
      try {
        const response = await fetch('/vocIT.json');
        const data = await response.json();

        // Select 5 random animal pairs
        const shuffledData = [...data].sort(() => 0.5 - Math.random());
        const selectedPairs = shuffledData.slice(0, 5);

        // Create cards array with picture and word cards
        const cardPairs = selectedPairs.flatMap(item => [
          { id: `${item.name}-pic`, type: 'picture', content: decode(item.htmlCode[0]), name: item.name, matched: false },
          { id: `${item.name}-word`, type: 'word', content: item.name, name: item.name, matched: false },
        ]);

        // Shuffle the cards
        const shuffledCards = [...cardPairs].sort(() => 0.5 - Math.random());
        setCards(shuffledCards);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // 2. Handle Card Flip Logic
  const handleCardClick = (card) => {
    if (flippedCards.length === 2 || card.matched || flippedCards.includes(card.id)) {
      return; // Ignore clicks if 2 cards are already flipped or card is matched or already flipped
    }

    // Flip the card
    setFlippedCards([...flippedCards, card.id]);

    // Check for match after 2 cards are flipped
    if (flippedCards.length === 1) {
      const [firstCardId] = flippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);

      if (firstCard.name === card.name) {
        // Match found
        setMatchedCards([...matchedCards, firstCard.id, card.id]);
        setFlippedCards([]);
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // 3. Check for Game Over
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  // 4. Render the Game UI
  return (
    <div className="memory-game">
      <h2>Memory Game di Stefano</h2>
      <div className="cards-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-inner">
              <div className="card-front"></div>
              <div className="card-back">
                {card.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      {gameOver && <div className="game-over">Il Gioco e' finito Stefano! Hai vinto!</div>}
    </div>
  );
};

export default MemoryGame;
