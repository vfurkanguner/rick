import React, { ChangeEvent, useState } from 'react';
import { Character } from '../../types/Character';

interface Props {
  data: Character[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
}

const ComboBox: React.FC<Props> = ({ data, searchText, handleSearch }) => {
  const [tags, setTags] = useState<Character[]>([]);
  const [manipulatedData, setManipulatedData] = useState(data.map(item => ({ ...item, checked: false })));

  const onSelect = (selectedItem: Character, checked: boolean) => {
    setTags(prevTags => {
      const exists = prevTags.some(tag => tag.id === selectedItem.id);
      return checked ? (!exists ? [...prevTags, selectedItem] : prevTags) : prevTags.filter(tag => tag.id !== selectedItem.id);
    });

    setManipulatedData(prevData => prevData.map(item => item.id === selectedItem.id ? { ...item, checked } : item));
  };

  const onRemoveTag = (id: string | number) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== id));
    setManipulatedData(prevData => prevData.map(item => item.id === id ? { ...item, checked: false } : item));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, item: Character) => {
    onSelect(item, e.target.checked);
  };

  return (
    <div>
      <div>
        <input value={searchText} onChange={handleSearch} />
      </div>
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            {tag.name}
            <button onClick={() => onRemoveTag(tag.id)}>X</button>
          </li>
        ))}
      </ul>
      <ul>
        {manipulatedData.map(item => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={e => handleCheckboxChange(e, item)}
              />
              {item.image && <img src={item.image} alt={item.name} style={{ width: 40 }} />}
              {item.name}
              {item.episode && <p>{item.episode.length} Episodes</p>}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComboBox;
