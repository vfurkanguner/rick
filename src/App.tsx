import React from "react";
import { ComboBox } from "@components/index";
import { useSearchAndMultiSelect } from "@hooks/useSearchAndMultiSelect";
import '@styles/App.css'

const App: React.FC = () => {
  const { scrollRef, outsideClickRef, ...props } = useSearchAndMultiSelect();

  return (
    <div className="App">
      <main className="app-container">
        <h1 className="heading">Rick & Morty Wiki Search</h1>
        <ComboBox
          ref={scrollRef}
          outsideClickRef={outsideClickRef}
          {...props}
        />
      </main>
    </div>
  );
};

export default App;
