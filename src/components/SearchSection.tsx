// components/SearchSection.tsx
import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import Icon from './Icon/Icon';
import PropertySearch from './PropertySearch';
import ZillowDetailSearch from './ZillowDetailSearch';

interface SearchSectionProps {
  onLocationUpdate: (location: any) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onLocationUpdate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="h-[275px] relative z-50"> {/* Added z-50 for highest priority */}
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        {/* Front Side */}
        <div className="text-center">
          <Icon
            name="flip"
            size={94}
            color="#000000"
            onClick={handleFlip}
            className="cursor-pointer hover:scale-105 transition-transform"
          />
          <h1 className="text-4xl font-bold text-white mb-8">
            Search Properties
          </h1>
          <PropertySearch onLocationUpdate={onLocationUpdate} />
        </div>

        {/* Back Side */}
        <div className="text-center">
          <Icon
            name="flip"
            size={94}
            color="#000000"
            onClick={handleFlip}
            className="cursor-pointer hover:scale-105 transition-transform"
          />
          <h1 className="text-4xl font-bold text-white mb-8">
            Search by Zillow URL
          </h1>
          <ZillowDetailSearch />
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default SearchSection;