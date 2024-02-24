import React, { ForwardedRef } from "react";
import IconClose from "../../assets/icons/IconClose";
import Loading from "../Loading";
import HighligtedText from "../HighligtedText";
import { UseSearchAndMultiSelectReturnTypes } from "@hooks/useSearchAndMultiSelect";
import IconCaretDown from "../../assets/icons/IconCaretDown";
import { Character } from "types/character";

interface ComboBoxProps extends UseSearchAndMultiSelectReturnTypes {}

interface TagsProps {
  tags: string[];
  removeTag: (tagId: string) => void;
  ref: ForwardedRef<HTMLLIElement>;
}

interface SearchListItemProps {
  option: Character;
  isFocusEnabled: boolean;
  focusedOptionIndex: number | null;
  index: number;
  searchTerm: string;
  handleCheck: (id: number, index: number) => void;
}

const Tags: React.FC<TagsProps> = React.forwardRef<HTMLLIElement, TagsProps>(
  ({ tags, removeTag }, ref) => {
    return (
      tags.length > 0 && (
        <ul className="combobox-tag-list">
          {tags.map((tag, index) => (
            <li key={index} className="combobox-tag-item">
              <span>{tag}</span>
              <button
                className="combobox-tag-remove"
                onClick={() => removeTag(tag)}
              >
                <IconClose width={32} height={32} stroke="white" />
              </button>
            </li>
          ))}
          <li ref={ref} />
        </ul>
      )
    );
  }
);

const SearchListItem: React.FC<SearchListItemProps> = ({
  option,
  isFocusEnabled,
  focusedOptionIndex,
  index,
  searchTerm,
  handleCheck,
}) => {
  return (
    <label
      className={`combobox-search-item ${
        isFocusEnabled && focusedOptionIndex === index ? "item-focused" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={option.isChecked}
        onChange={() => handleCheck(option.id, index)}
      />
      <img src={option.image} alt={option.name} />
      <div>
        <HighligtedText text={option.name} searchTerm={searchTerm} />
        <p className="combobox-search-info-text">
          {option.episode.length} Episodes
        </p>
      </div>
    </label>
  );
};

const EmptyListRenderer = () => {
  return <div>Nothing found</div>;
};

const ErrorMessage = ({ message }: { message: string }) => {
  return <span className="combobox-error-message">{message}</span>;
};

const ComboBox = React.forwardRef<HTMLLIElement, ComboBoxProps>(
  (
    {
      loading,
      tags,
      removeTag,
      options,
      handleCheck,
      setSearchTerm,
      searchTerm,
      isResultEmpty,
      errorMessage,
      focusedOptionIndex,
      isFocusEnabled,
      outsideClickRef,
      setIsInputFocused,
      isInputFocused
    },
    ref
  ) => {
    const showData = !errorMessage && !loading;
    const showError = errorMessage;
    const showEmptRenderer = !errorMessage && !loading && isResultEmpty;

    return (
      <div className="combobox" ref={outsideClickRef}>
        <div className="combobox-input-container">
          <Tags tags={tags} removeTag={removeTag} ref={ref} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            className="combobox-input"
            onFocus={() => setIsInputFocused(true)}
          />
          <div className="combobox-caret-down-icon">
            <IconCaretDown width={16} height={16} stroke="#4A5567" />
          </div>
        </div>
        {isInputFocused &&
        <div className="combobox-search-list">
          {loading && <Loading />}
          {showData &&
            options.map((option, index) => (
              <SearchListItem
                key={option.id}
                option={option}
                isFocusEnabled={isFocusEnabled}
                focusedOptionIndex={focusedOptionIndex}
                index={index}
                searchTerm={searchTerm}
                handleCheck={handleCheck}
              />
            ))}
          {showEmptRenderer && <EmptyListRenderer />}
          {showError && <ErrorMessage message={errorMessage} />}
        </div>}
      </div>
    );
  }
);

export default ComboBox;
