import React, { useState, useEffect, useRef, RefObject } from "react";
import { BASE_API_URL } from "../configs";
import { useDebounce } from "./useDebounce";
import { useOnClickOutside } from "./useOnClickOutside";
import { Character } from "../types/character";

export interface UseSearchAndMultiSelectReturnTypes {
  removeTag: (tagName: string) => void;
  options: Character[];
  handleCheck: (id: number, index: number) => void;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  loading: boolean;
  searchTerm: string;
  isResultEmpty: boolean;
  errorMessage: string;
  scrollRef?: RefObject<HTMLLIElement>;
  outsideClickRef?: RefObject<HTMLDivElement>;
  focusedOptionIndex: number | null;
  isFocusEnabled: boolean;
}
const SCROLL_INDEX_START = -1;

export const useSearchAndMultiSelect =
  (): UseSearchAndMultiSelectReturnTypes => {
    const [options, setOptions] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isFocusEnabled, setFocusEnabled] = useState<boolean>(false);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(
      SCROLL_INDEX_START
    );

    const scrollRef = useRef<HTMLLIElement>(null);
    const outsideClickRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce<string>(searchTerm, 500);
    const isResultEmpty = options?.length === 0;

    const handleCheck = (id: number, index: number) => {
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
      setFocusedOptionIndex(index);
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

    const getFocusedAndScroll =
      (focusedItem: Element | null) => (callback: () => void) => {
        setFocusEnabled(true);
        callback();
        focusedItem?.scrollIntoView();
      };

    // lose focus on outside click.
    useOnClickOutside(outsideClickRef, () => {
      setFocusEnabled(false);
    });

    // data fetch operations.
    useEffect(() => {
      setLoading(true);

      if (errorMessage) {
        setErrorMessage("");
      }

      const fetchCharacters = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL}/character?name=${debouncedSearch}`
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
    }, [debouncedSearch]);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [tags]);

    // keyboard navigations.
    // TODO: maybe could do better with custom KeyboardManagerClass?
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        const focusedItem = window.document.querySelector(".item-focused");
        const handleFocusAndScroll = getFocusedAndScroll(focusedItem);

        switch (event.key) {
          case "Backspace":
            if (tags.length > 0) {
              const tagsCopy = [...tags];
              removeTag(tagsCopy[tagsCopy.length - 1]);
            }
            break;
          case "Escape":
            setFocusedOptionIndex(null);
            setFocusEnabled(false);
            break;
          case "ArrowUp":
            handleFocusAndScroll(() =>
              setFocusedOptionIndex((prevIndex) =>
                prevIndex !== null
                  ? prevIndex > 0
                    ? prevIndex - 1
                    : options.length - 1
                  : options.length - 1
              )
            );
            break;
          case "ArrowDown":
            handleFocusAndScroll(() =>
              setFocusedOptionIndex((prevIndex) =>
                prevIndex === null ? 0 : (prevIndex + 1) % options.length
              )
            );
            break;
          case "Tab":
            handleFocusAndScroll(() =>
              setFocusedOptionIndex((prevIndex) =>
                prevIndex === null ? 0 : (prevIndex + 1) % options.length
              )
            );
            break;
          case "Enter":
            if (focusedOptionIndex !== null) {
              const optionId = options[focusedOptionIndex]?.id;
              if (optionId !== undefined) {
                handleCheck(optionId, focusedOptionIndex);
              }
            }
            break;
          default:
            break;
        }
      };

      window.addEventListener("keydown", handleKeyPress);

      return () => window.removeEventListener("keydown", handleKeyPress);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusedOptionIndex, options]);

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
      scrollRef,
      outsideClickRef,
      focusedOptionIndex,
      isFocusEnabled,
    };
  };
