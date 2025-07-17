import { useState } from "react";

type AuthFormProps = {
  onLogin: (token: string) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<"login" | "signup" | "guest">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "guest") {
        onLogin("guest-token");
      } else {
        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
        const response = await fetch(`http://localhost:4002${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok && data.token) {
          onLogin(data.token);
        } else {
          setError(data.error || "Authentication failed");
        }
      }
    } catch (err) {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {mode === "login" ? "Login" : mode === "signup" ? "Sign Up" : "Guest Login"}
        </h2>

        {(mode === "login" || mode === "signup") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
        )}

        {mode === "guest" && (
          <div className="space-y-4">
            <p className="text-sm text-center text-gray-600">
              Continue as guest with limited access.
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition"
            >
              {loading ? "Please wait..." : "Continue as Guest"}
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-4 text-sm">
          {mode !== "login" && (
            <button className="text-blue-500" onClick={() => setMode("login")}>
              Login
            </button>
          )}
          {mode !== "signup" && (
            <button className="text-blue-500" onClick={() => setMode("signup")}>
              Sign Up
            </button>
          )}
          {mode !== "guest" && (
            <button className="text-blue-500" onClick={() => setMode("guest")}>
              Guest Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;





 
