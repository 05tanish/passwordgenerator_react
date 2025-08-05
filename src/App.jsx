import { useState, useCallback, useEffect } from "react";

const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.match(/[0-9]/)) score++;
  if (pwd.match(/[!@#$%^&*()]/)) score++;
  if (pwd.match(/[A-Z]/)) score++;
  return score;
};

export default function App() {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()-_=+[]{}";
    if (avoidAmbiguous) chars = chars.replace(/[l1O0]/g, "");

    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(pwd);
    setHistory((prev) => [pwd, ...prev.slice(0, 4)]); // keep last 5
  }, [length, includeNumbers, includeSymbols, avoidAmbiguous]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = getStrength(password);
  const strengthColor = ["text-red-400", "text-yellow-400", "text-blue-400", "text-green-400"];
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-zinc-800 p-6 rounded-xl shadow-xl space-y-6">
        <h1 className="text-center text-3xl font-bold">🔐 Secure Password Generator</h1>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full px-3 py-2 bg-zinc-700 text-white font-mono rounded-md"
          />
          <button
            onClick={copyToClipboard}
            className={`px-3 py-2 rounded-md text-sm font-semibold ${
              copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="text-sm">
          <span className="font-semibold">Strength:</span>{" "}
          <span className={`font-bold ${strengthColor[strength - 1] || "text-red-400"}`}>
            {strengthLabel[strength - 1] || "Too Weak"}
          </span>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded ${
                  strength >= s ? "bg-green-500" : "bg-gray-600"
                } transition-all duration-300`}
              ></div>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <label htmlFor="length">Length: {length}</label>
            <input
              type="range"
              min={6}
              max={30}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-1/2"
            />
          </div>

          <div className="flex justify-between items-center">
            <label>Include Numbers</label>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers((prev) => !prev)}
              className="w-5 h-5 accent-blue-500"
            />
          </div>

          <div className="flex justify-between items-center">
            <label>Include Symbols</label>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols((prev) => !prev)}
              className="w-5 h-5 accent-blue-500"
            />
          </div>

          <div className="flex justify-between items-center">
            <label>Avoid Ambiguous Chars (l, 1, O, 0)</label>
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={() => setAvoidAmbiguous((prev) => !prev)}
              className="w-5 h-5 accent-blue-500"
            />
          </div>
        </div>

        <button
          onClick={generatePassword}
          className="w-full py-2 mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
        >
          🔁 Generate Again
        </button>

        <div className="pt-4 border-t border-zinc-600 text-sm">
          <p className="font-semibold mb-1">Recent Passwords:</p>
          <ul className="list-disc list-inside text-zinc-300 space-y-1">
            {history.map((pwd, i) => (
              <li key={i} className="font-mono text-xs truncate">{pwd}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
