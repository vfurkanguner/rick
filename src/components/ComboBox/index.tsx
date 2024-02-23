import React from "react";

const ComboBox: React.FC = ({
  loading,
  tags,
  removeTag,
  options,
  handleCheck,
  setSearchTerm,
  searchTerm
}) => {
  return (
    <div className="combobox">
      <ul>
        {tags?.map((tag, index) => (
          <li key={index} className="tag">
            {tag} <button onClick={() => removeTag(tag)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
      />
      {loading && <div>Searching... </div>}
      {!loading && (
        <div>
          {options?.map((option) => (
            <label key={option.id}>
              <input
                type="checkbox"
                checked={option.isChecked}
                onChange={() => handleCheck(option.id)}
              />
              {option.name}
            </label>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default ComboBox;
