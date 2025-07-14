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
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-purple-400 relative">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        aria-label={`Open ${title} in a new tab`}
        tabIndex={-1}
      />
      <div className="flex items-start gap-3 relative z-20">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1 line-clamp-2">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline focus:underline transition-colors"
              tabIndex={0}
            >
              {title}
            </a>
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
            {description}
          </p>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open external link"
          className="ml-2 mt-1 rounded-full p-1 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:bg-purple-100 dark:focus:bg-purple-900/30"
        >
          <ExternalLink className="h-4 w-4 text-purple-500 group-hover:text-purple-600 transition-colors" />
        </a>
      </div>
    </div>
  );
};
