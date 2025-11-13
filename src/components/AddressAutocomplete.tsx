import React, { useState, useEffect, useRef } from 'react';
import { locationService, AddressSuggestion } from '../services/locationService';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  className?: string;
  userLocation?: { lat: number; lng: number };
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Enter your delivery address...",
  className = "",
  userLocation,
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search for suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Only search if user has typed at least 3 characters and it's not just spaces
    if (value.trim().length >= 3) {
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await locationService.getAddressSuggestions(value.trim(), userLocation);
          setSuggestions(results);
          // Only show suggestions if we have results and user is still focused
          setShowSuggestions(results.length > 0 && document.activeElement === inputRef.current);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoading(false);
        }
      }, 500); // Increased debounce time to reduce API calls
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, userLocation]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    try {
      // Get detailed place information
      const placeDetails = await locationService.getPlaceDetails(suggestion.place_id);

      if (placeDetails) {
        // Use the formatted address from Google Places Details API
        onChange(placeDetails.formatted_address);
        onSelect?.(suggestion);
      } else {
        // Fallback to suggestion description
        onChange(suggestion.description);
        onSelect?.(suggestion);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      // Fallback to suggestion description
      onChange(suggestion.description);
      onSelect?.(suggestion);
    }

    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="address-autocomplete-container" style={{ position: 'relative' }}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          // Only show suggestions if we have results and user has typed enough
          if (suggestions.length > 0 && value.trim().length >= 3) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className={className}
        rows={4}
        style={{
          width: '100%',
          resize: 'vertical',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '12px',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionSelect(suggestion)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: selectedIndex === index ? '#f0fdf4' : 'white',
                borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                borderRadius: index === 0 ? '12px 12px 0 0' :
                           index === suggestions.length - 1 ? '0 0 12px 12px' : '0',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              onMouseLeave={() => setSelectedIndex(-1)}
            >
              <div style={{ fontWeight: 600, color: '#111827', marginBottom: '2px' }}>
                {suggestion.structured_formatting.main_text}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AddressAutocomplete;