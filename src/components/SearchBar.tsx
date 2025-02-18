"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Search from "../../public/icons/Search.svg";
import Image from "next/image";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery: string; // New prop to pass the query value
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery); // Update query if initialQuery prop changes
  }, [initialQuery]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query); // Pass the query to the parent component
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 text-gray-200 bg-white shadow-md rounded-xl w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your keywords..."
        className="flex-1 border-none rounded-[8px] focus-visible:ring-0 focus-visible:ring-offset-0"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch} className="rounded-xl hover:bg-zinc-100">
        <Image src={Search} alt="search button" className="w-8 h-8" />
      </Button>
    </div>
  );
};

export default SearchBar;
