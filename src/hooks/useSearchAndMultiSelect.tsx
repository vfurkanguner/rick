import React, { useState, useEffect } from "react";
import { BASE_API_URL } from "../configs";
import { useDebounce } from "./useDebounce";

interface CharacterOption {
  id: number;
  name: string;
  isChecked: boolean;
}

export const useSearchAndMultiSelect: React.FC = () => {
  const [options, setOptions] = useState<CharacterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedName = useDebounce<string>(searchTerm, 500);
  const isResultEmpty = options.length === 0;

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch(
          `${BASE_API_URL}/character?name=${debouncedName}`
        );
        const data = await response.json();
        console.log({ data });
        const fetchedOptions: CharacterOption[] = data?.results?.map(
          (character: any) => ({
            ...character,
            isChecked: false,
          })
        );
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("There was an error fetching the characters:", error);
        setOptions([]); // Clear options or handle errors as needed
      }
      setLoading(false);
    };

    fetchCharacters();
  }, [debouncedName]);

  const handleCheck = (id: number) => {
    const newOptions = options?.map((option) => {
      if (option.id === id) {
        option.isChecked = !option.isChecked;
        if (option.isChecked) {
          setTags([...tags, option.name]);
        } else {
          setTags(tags.filter((tag) => tag !== option.name));
        }
      }
      return option;
    });
    setOptions(newOptions);
  };

  const removeTag = (tagName: string) => {
    setTags(tags.filter((tag) => tag !== tagName));
    const newOptions = options?.map((option) => {
      if (option.name === tagName) {
        option.isChecked = false;
      }
      return option;
    });
    setOptions(newOptions);
  };

  return {
    removeTag,
    options,
    handleCheck,
    setSearchTerm,
    tags,
    loading,
    searchTerm,
    isResultEmpty,
  };
};
