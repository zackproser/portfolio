import { useState, ChangeEvent, FormEvent } from 'react';

interface SearchFormProps {
  suggestedSearches: string[];
  onSearch: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  buttonText?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ suggestedSearches, onSearch, setIsLoading, buttonText = "➔" }) => {
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