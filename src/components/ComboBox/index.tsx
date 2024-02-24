import React, { useEffect, useRef } from "react";
import IconClose from "../../assets/icons/IconClose";
import Loading from "../Loading";
import HighligtedText from "../HighligtedText";
import { Character } from "../../types/character";


interface ComboBoxProps {
  loading: boolean;
  tags: string[];
  removeTag: (tagName: string) => void;
  options: Character[];
  handleCheck: (id: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  searchTerm: string;
  isResultEmpty: boolean;
  errorMessage: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  loading,
  tags,
  removeTag,
  options,
  handleCheck,
  setSearchTerm,
  searchTerm,
  isResultEmpty,
  errorMessage
}) => {
  const dummy = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tags]);


  return (
    <div className="combobox">
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
            <li ref={dummy} />
          </ul>
        )}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
          className="combobox-input"
        />
      </div>
        <div className="combobox-search-list">
          {loading && <Loading />}
          {!errorMessage && !loading && options?.map((option) => (
            <label key={option.id} className="combobox-search-item">
              <input
                type="checkbox"
                checked={option.isChecked}
                onChange={() => handleCheck(option.id)}
               />
              <img src={option.image} />
              <div >
                <HighligtedText text={option.name} searchTerm={searchTerm} />
                <p className="combobox-search-info-text">
                  {option.episode.length} Episodes
                </p>
              </div>
            </label>
          ))}
          {!errorMessage && !loading && isResultEmpty && <div>Nothing found</div>}
          {errorMessage && <span className="combobox-error-message">{errorMessage}</span>}
        </div>
    </div>
  );
};

export default ComboBox;
