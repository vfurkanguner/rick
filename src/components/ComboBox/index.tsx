import React from "react";
import IconClose from "../../assets/icons/IconClose";
import Loading from "../Loading";
import HighligtedText from "../HighligtedText";
import { UseSearchAndMultiSelectReturnTypes } from "../../hooks/useSearchAndMultiSelect";
import IconCaretDown from "../../assets/icons/IconCaretDown";

interface ComboBoxProps extends UseSearchAndMultiSelectReturnTypes {}

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
    },
    ref
  ) => {
    return (
      <div className="combobox" ref={outsideClickRef}>
        <div className="combobox-input-container">
          {tags.length > 0 && (
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
          )}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            className="combobox-input"
          />
          <div
            style={{
              position: "absolute",
              right: 5,
              top: 13,
            }}
          >
            <IconCaretDown width={16} height={16} stroke="#4A5567" />
          </div>
        </div>
        <div className="combobox-search-list">
          {loading && <Loading />}
          {!errorMessage &&
            !loading &&
            options?.map((option, index) => (
              <label
                key={option.id}
                className={`combobox-search-item ${
                  isFocusEnabled && focusedOptionIndex === index
                    ? "item-focused"
                    : ""
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
            ))}
          {!errorMessage && !loading && isResultEmpty && (
            <div>Nothing found</div>
          )}
          {errorMessage && (
            <span className="combobox-error-message">{errorMessage}</span>
          )}
        </div>
      </div>
    );
  }
);

export default ComboBox;
