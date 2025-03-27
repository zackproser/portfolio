import { useState, ChangeEvent, FormEvent } from 'react';

interface SearchFormProps {
  suggestedSearches: string[];
  onSearch: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  buttonText?: string;
  onClearChat?: () => void;
  showClearButton?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  suggestedSearches, 
  onSearch, 
  setIsLoading, 
  buttonText = "➔",
  onClearChat,
  showClearButton = false
}) => {
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        {showClearButton && onClearChat && (
          <button
            onClick={() => {
              onClearChat();
              setQuery("");
              setShowSuggestions(true);
            }}
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
            type="button"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear chat
          </button>
        )}
        <div></div> {/* Spacer */}
      </div>
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="w-full px-4 py-2 border border-gray-300 dark:text-zinc-800 bg-gray-200 rounded-lg shadow-sm focus:outline-none"
          placeholder="Ask me anything..."
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 transform -translate-y-1/2 right-14 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          onClick={(e: FormEvent) => {
            handleSubmit(e).then(() => setIsLoading(true));
          }}
          className={`absolute top-1/2 transform -translate-y-1/2 -right-14 ${buttonText !== "➔" ? 'w-auto px-4' : 'w-12'} h-12 flex items-center justify-center bg-emerald-600 text-white rounded-full ${!query && 'opacity-50 bg-gray-600 cursor-not-allowed'}`}
          disabled={!query}
        >
          {buttonText}
        </button>
        {showSuggestions && suggestedSearches.length > 0 && (
          <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
            <div className="px-4 py-2 text-gray-700 font-semibold">Popular searches</div>
            {suggestedSearches.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                onClick={() => {
                  setQuery(suggestion);
                  onSearch(suggestion);
                  setShowSuggestions(false);
                  setIsLoading(true);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;