import { useState } from "react";

interface TriageFormProps {
  token: string;
  setResult: (result: string) => void;
}

const TriageForm: React.FC<TriageFormProps> = ({ token, setResult }) => {
  const [description, setDescription] = useState("");
  const [codeContext, setCodeContext] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(""); // Clear result before new submission
    try {
      const response = await fetch("http://localhost:4002/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, codeContext }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.result || JSON.stringify(data, null, 2));
      } else {
        setResult("❌ Error: " + (data.error || "Unknown error"));
      }
    } catch {
      setResult("❌ Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="description">Bug Description:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        required
      />
      <label htmlFor="codeContext">Code Context (optional):</label>
      <textarea
        id="codeContext"
        value={codeContext}
        onChange={(e) => setCodeContext(e.target.value)}
        rows={4}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Submit"}
      </button>
    </form>
  );
};

export default TriageForm;








