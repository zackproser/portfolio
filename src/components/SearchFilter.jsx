import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { trackSearchQuery } from "@/actions/query-tracking-actions";

export default function SearchFilter({ databases, onFilter, onReset, searchTerm: externalSearchTerm }) {
  const [search, setSearch] = useState(externalSearchTerm || '');
  const [filters, setFilters] = useState({
    cloud: false,
    local: false,
    on_premises: false,
    free_tier: false,
    open_source: false,
  });
  const trackingTimeoutRef = useRef(null);

  useEffect(() => {
    setSearch(externalSearchTerm || '');
  }, [externalSearchTerm]);

  // Debounced query tracking
  const trackQuery = useCallback((query, resultCount) => {
    if (trackingTimeoutRef.current) {
      clearTimeout(trackingTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      trackingTimeoutRef.current = setTimeout(() => {
        trackSearchQuery({
          query: query.trim(),
          source: 'vectordatabases',
          resultCount,
        });
      }, 1500); // Track after 1.5s of no typing
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearch(newSearchTerm);
    const filtered = applyFilters(newSearchTerm, filters);
    trackQuery(newSearchTerm, filtered.length);
  };

  const handleFilterChange = (key) => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    applyFilters(search, newFilters);
  };

  const applyFilters = (searchTerm, activeFilters) => {
    const filtered = databases.filter(db => {
      const matchesSearch = db.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        db.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
        if (!value) return true;
        switch (key) {
          case 'cloud':
          case 'local':
          case 'on_premises':
            return db.deployment?.[key] || false;
          case 'free_tier':
            return db.pricing?.free_tier || false;
          case 'open_source':
            return db.community_ecosystem?.open_source || false;
          default:
            return true;
        }
      });
      return matchesSearch && matchesFilters;
    });
    onFilter(filtered, searchTerm);
    return filtered;
  };

  const handleReset = () => {
    setSearch('');
    setFilters({
      cloud: false,
      local: false,
      on_premises: false,
      free_tier: false,
      open_source: false,
    });
    onReset();
  };

  return (
    <div className="mb-4 space-y-4">
      <Input
        type="text"
        placeholder="Search databases..."
        value={search}
        onChange={handleSearchChange}
      />
      <div className="flex flex-wrap gap-4">
        {Object.entries(filters).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={value}
              onCheckedChange={() => handleFilterChange(key)}
            />
            <Label htmlFor={key}>{key.replace('_', ' ')}</Label>
          </div>
        ))}
      </div>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
