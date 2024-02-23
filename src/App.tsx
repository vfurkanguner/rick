import React from "react";
import { ComboBox } from "./components";
import { useSearchAndMultiSelect } from "./hooks/useSearchAndMultiSelect";
import "./App.css";

const App: React.FC = () => {
  const {
    loading,
    tags,
    removeTag,
    options,
    handleCheck,
    setSearchTerm,
    searchTerm,
  } = useSearchAndMultiSelect();

  return (
    <div className="App">
      <ComboBox
        options={options}
        handleCheck={handleCheck}
        removeTag={removeTag}
        setSearchTerm={setSearchTerm}
        tags={tags}
        loading={loading}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default App;
