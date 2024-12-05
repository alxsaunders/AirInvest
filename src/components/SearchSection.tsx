// components/SearchSection.tsx
import React, { useState } from 'react';
import Icon from './Icon/Icon';
import PropertySearch from './PropertySearch';
import ZillowDetailSearch from './ZillowDetailSearch';

interface SearchSectionProps {
  onLocationUpdate: (location: any) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onLocationUpdate }) => {
  const [isZillowSearch, setIsZillowSearch] = useState(false);

  const handleFlip = () => {
    setIsZillowSearch(!isZillowSearch);
  };

  return (
    <div className="text-center">
      <Icon
        name="flip"
        size={94}
        color="#000000"
        onClick={handleFlip}
        className="cursor-pointer hover:scale-105 transition-transform"
      />
      <h1 className="text-4xl font-bold text-white mb-8">
        {isZillowSearch ? 'Search by Zillow ID' : 'Search Properties'}
      </h1>

      {isZillowSearch ? (
        <ZillowDetailSearch />
      ) : (
        <PropertySearch onLocationUpdate={onLocationUpdate} />
      )}
    </div>
  );
};

export default SearchSection;