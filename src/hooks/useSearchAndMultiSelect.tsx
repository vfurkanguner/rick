import React, { useState, useEffect, useRef, RefObject } from "react";
import { BASE_API_URL } from "../configs";
import { useDebounce } from "./useDebounce";
import { Character } from "../types/character";


export interface UseSearchAndMultiSelectReturnTypes {
  removeTag: (tagName: string) => void;
  options: Character[];
  handleCheck: (id: number) => void;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  loading: boolean;
  searchTerm: string;
  isResultEmpty: boolean;
  errorMessage: string;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  scrollRef?: RefObject<HTMLLIElement>;
}

export const useSearchAndMultiSelect = (): UseSearchAndMultiSelectReturnTypes => {
  const [options, setOptions] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const debouncedName = useDebounce<string>(searchTerm, 500);
  const scrollRef = useRef<HTMLLIElement>(null);
  const isResultEmpty = options?.length === 0;

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && searchTerm === "" && tags.length > 0) {
      const tagsCopy = [...tags];
      removeTag(tagsCopy[tagsCopy.length - 1]);
    }
  };

  useEffect(() => {
    setLoading(true);

    if (errorMessage) {
      setErrorMessage("");
    }

    const fetchCharacters = async () => {
      try {
        const response = await fetch(
          `${BASE_API_URL}/character?name=${debouncedName}`
        );

        const data = await response.json();

        if (response.status === 404) {
          setErrorMessage(data.error);
          setLoading(false);
          return;
        }

        const fetchedOptions: Character[] = data?.results?.map(
          (character: Character) => ({
            ...character,
            isChecked: false,
          })
        );
        setOptions(fetchedOptions);
      } catch (err: unknown) {
        let message = "An unexpected error occurred";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }
        setErrorMessage(message);
        setOptions([]);
      }
      setLoading(false);
    };

    fetchCharacters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tags]);

  return {
    removeTag,
    options,
    handleCheck,
    setSearchTerm,
    tags,
    loading,
    searchTerm,
    isResultEmpty,
    errorMessage,
    handleKeyDown,
    scrollRef
  };
};
