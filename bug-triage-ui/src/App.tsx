import { useState } from "react";
import TriageForm from "./components/TriageForm";
import './App.css';

function App() {
  const [result, setResult] = useState<string>("");

  const showSplitLayout = !!result;

  return (
    <div className="app-container">
      <div className={showSplitLayout ? "split-layout" : "center-layout"}>
        <div className="form-wrapper">
          <h1 className="title">Debug Navigator</h1>
          <TriageForm token="guest-token" setResult={setResult} />
        </div>
        {showSplitLayout && (
          <div className="result-area" aria-live="polite" role="region">
            <h3>AI Triage Result:</h3>
            <pre>{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


















