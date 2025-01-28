import React, { useState, useEffect } from 'react';
import { decode } from 'html-entities';
import './MemoryGame.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/vocIT.json');
        const data = await response.json();

        const shuffledData = [...data].sort(() => 0.5 - Math.random());
        const selectedPairs = shuffledData.slice(0, 5);

        const cardPairs = selectedPairs.flatMap(item => [
          { id: `${item.name}-pic`, type: 'picture', content: decode(item.htmlCode[0]), name: item.name, matched: false },
          { id: `${item.name}-word`, type: 'word', content: item.name, name: item.name, matched: false },
        ]);

        const shuffledCards = [...cardPairs].sort(() => 0.5 - Math.random());
        setCards(shuffledCards);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (card) => {
    if (flippedCards.length === 2 || card.matched || flippedCards.includes(card.id)) {
      return;
    }

    setFlippedCards([...flippedCards, card.id]);

    if (flippedCards.length === 1) {
      const [firstCardId] = flippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);

      if (firstCard.name === card.name) {
        setMatchedCards([...matchedCards, firstCard.id, card.id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [matchedCards, cards]);

  return (
    <div className="memory-game">
      <h2>Memory Game</h2>
      <div className="cards-container">
        {cards.length > 0 ? (
          cards.map((card) => (
            <div
              key={card.id}
              className={`card ${flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-front"></div>
                <div className={`card-back ${card.type === 'picture' ? 'picture' : ''}`}>
                  {card.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
      {gameOver && <div className="game-over">Stefano Fine del Gioco Game Over! Hai Vinto!</div>}
    </div>
  );
};

export default MemoryGame;
