import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import React, { useState } from "react";

const categories = [
  { id: "web-development", label: "Web Development" },
  { id: "frontend-development", label: "Frontend Development" },
  { id: "backend-development", label: "Backend Development" },
  { id: "full-stack-development", label: "Full Stack Development" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "data-science", label: "Data Science" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "devops", label: "DevOps & Cloud" },
  { id: "ui-ux-design", label: "UI/UX Design" },
  { id: "database", label: "Database Management" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "programming", label: "Programming Languages" },
  { id: "business", label: "Business & Management" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

        handleFilterChange(newCategories, sortByPrice);
        return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  }

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSortByPrice("");
    handleFilterChange([], "");
  };

  return (
    <div className="w-full space-y-5">
      {/* Price Sort Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-2 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
          SORT BY PRICE
        </h3>
        <Select onValueChange={selectByPriceHandler} value={sortByPrice}>
          <SelectTrigger className="w-full h-11 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm font-medium hover:shadow-lg transition-all duration-200 text-sm">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-xl">
            <SelectGroup>
              <SelectLabel className="font-semibold text-gray-700 dark:text-gray-300 px-3 py-2 text-xs">Sort Options</SelectLabel>
              <SelectItem value="low" className="font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm">💰 Low to High</SelectItem>
              <SelectItem value="high" className="font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm">💎 High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <Separator className="bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 h-px opacity-60" />
      
      {/* Categories Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-2 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          CATEGORIES
        </h3>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 dark:scrollbar-track-gray-800 scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="flex items-center space-x-3 p-2.5 rounded-lg bg-white/40 dark:bg-gray-800/40 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 transition-all duration-200 border border-gray-200/20 dark:border-gray-700/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 cursor-pointer group hover:shadow-sm"
            >
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm h-4 w-4"
              />
              <Label 
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 cursor-pointer flex-1"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator className="bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 h-px opacity-60" />
      
      {/* Active Filters & Clear Button */}
      {(selectedCategories.length > 0 || sortByPrice) && (
        <div className="space-y-3">
          {/* Selected Filters Display */}
          {selectedCategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Categories ({selectedCategories.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategories.slice(0, 3).map((categoryId) => {
                  const category = categories.find(cat => cat.id === categoryId);
                  return (
                    <span key={categoryId} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                      {category?.label}
                    </span>
                  );
                })}
                {selectedCategories.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                    +{selectedCategories.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* Clear Filters Button */}
          <Button
            onClick={clearAllFilters}
            variant="outline"
            size="sm"
            className="w-full border-2 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-lg font-semibold transition-all duration-200 h-9 text-sm"
          >
            <X className="h-3.5 w-3.5 mr-2" />
            Clear All ({selectedCategories.length + (sortByPrice ? 1 : 0)})
          </Button>
        </div>
      )}
    </div>
  );
};

export default Filter;
