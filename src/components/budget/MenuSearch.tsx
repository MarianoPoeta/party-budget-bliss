
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface MenuSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const MenuSearch: React.FC<MenuSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
      <Input
        placeholder="Search menus..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default MenuSearch;
