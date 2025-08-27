import React, { useState, useEffect } from 'react';
import { Search, X, Users, FileText, Building, Wallet } from 'lucide-react';

interface GlobalSearchProps {
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'user' | 'policy' | 'property' | 'transaction';
  href: string;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'John Smith',
    subtitle: 'john.smith@email.com',
    type: 'user',
    href: '/users/1'
  },
  {
    id: '2',
    title: 'Policy #POL-2024-001',
    subtitle: '123 Main Street, Lagos',
    type: 'policy',
    href: '/policies/POL-2024-001'
  },
  {
    id: '3',
    title: 'Property #PROP-001',
    subtitle: 'Victoria Island, Lagos',
    type: 'property',
    href: '/properties/PROP-001'
  }
];

const typeIcons = {
  user: Users,
  policy: FileText,
  property: Building,
  transaction: Wallet
};

export function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        setResults(mockResults.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
        ));
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-slide-in">
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-4">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search users, policies, properties..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-pulse text-gray-500">Searching...</div>
            </div>
          )}

          {!loading && results.length === 0 && query.length > 2 && (
            <div className="p-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2">
              {results.map((result) => {
                const IconComponent = typeIcons[result.type];
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      // Navigate to result
                      onClose();
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-left"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3">
                      <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{result.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {query.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Quick search across all modules</p>
              <div className="flex flex-wrap justify-center gap-2">
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">⌘</kbd>
                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">K</kbd>
                <span className="text-xs text-gray-400 mx-2">to open search</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}