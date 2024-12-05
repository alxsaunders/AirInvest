import React, { useState } from 'react';
import Icon from './Icon/Icon';
import PropertySearch from './PropertySearch';
import ZillowDetailSearch from './ZillowDetailSearch';
import './SearchFlipCard.css';

interface SearchFlipCardProps {
  onLocationUpdate: (location: any) => void;
}

const SearchFlipCard: React.FC<SearchFlipCardProps> = ({ onLocationUpdate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flip-card-container">
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-front">
          <div className="search-content">
            <Icon
              name="flip"
              size={94}
              color="#000000"
              onClick={handleFlip}
              className="flip-icon"
            />
            <h1 className="text-4xl font-bold text-white mb-8">
              Search Properties
            </h1>
            <PropertySearch onLocationUpdate={onLocationUpdate} />
          </div>
        </div>

        <div className="flip-card-back">
          <div className="search-content">
            <Icon
              name="flip"
              size={94}
              color="#000000"
              onClick={handleFlip}
              className="flip-icon"
            />
            <h1 className="text-4xl font-bold text-white mb-8">
              Search by Zillow ID
            </h1>
            <ZillowDetailSearch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFlipCard;