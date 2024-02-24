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
    isResultEmpty,
    errorMessage,
    handleKeyDown,
    focusedOptionIndex,
    onSelect,
    isFocusEnabled,
    scrollRef
  } = useSearchAndMultiSelect();

  return (
    <div className="App">
      <main className="app-container">
        <h1 className="heading">
          Rick & Morty Wiki Search
        </h1>
        <ComboBox
          ref={scrollRef}
          options={options}
          handleCheck={handleCheck}
          removeTag={removeTag}
          setSearchTerm={setSearchTerm}
          tags={tags}
          loading={loading}
          searchTerm={searchTerm}
          isResultEmpty={isResultEmpty}
          errorMessage={errorMessage}
          handleKeyDown={handleKeyDown}
          focusedOptionIndex={focusedOptionIndex}
          onSelect={onSelect}
          isFocusEnabled={isFocusEnabled}
        />
      </main>
    </div>
  );
};

export default App;
