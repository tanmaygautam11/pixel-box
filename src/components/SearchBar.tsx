"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Search from "../../public/icons/Search.svg";
import Image from "next/image";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 text-gray-200 bg-white shadow-md rounded-xl w-full">
      <Input
        type="text"
        placeholder="Enter your keywords..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
