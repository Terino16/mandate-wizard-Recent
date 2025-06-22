import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SearchResultCardProps {
  title: string;
  description: string;
  link: string;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  title,
  description,
  link,
}) => {
  return (
    <div className="bg-background border border-primary/30 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-primary dark:text-primary  line-clamp-2 mb-1">
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {title}
            </a>
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
            {description}
          </p>
        </div>
        <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0 mt-1" />
      </div>
    </div>
  );
};
