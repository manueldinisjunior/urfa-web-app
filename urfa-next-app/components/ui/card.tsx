import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, link }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      {imageUrl && <img className="w-full" src={imageUrl} alt={title} />}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      {link && (
        <div className="px-6 pt-4 pb-2">
          <a href={link} className="text-blue-500 hover:text-blue-800">
            Learn more
          </a>
        </div>
      )}
    </div>
  );
};

export default Card;