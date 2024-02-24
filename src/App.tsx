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
    focusedOptionIndex,
    isFocusEnabled,
    scrollRef,
    outsideClickRef
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
          focusedOptionIndex={focusedOptionIndex}
          isFocusEnabled={isFocusEnabled}
          outsideClickRef={outsideClickRef}
        />
      </main>
    </div>
  );
};

export default App;
