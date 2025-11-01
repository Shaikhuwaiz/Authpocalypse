import React, { useState, ChangeEvent, FormEvent } from "react";

interface User {
  name: string;
  age: number;
  email: string;
  password: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    name: "",
    age: 0,
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: name === "age" ? Number(value) : value }));
  };

  const clearForm = () => {
    setFormData({ name: "", age: 0, email: "", password: "" });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // --- Registration ---
    if (!isLogin) {
      localStorage.setItem(formData.email, JSON.stringify(formData));
      setMessage("Registration successful. Redirecting to login...");
      setMessageColor("green"); // ✅ added
      clearForm();

      setTimeout(() => {
        setIsLogin(true);
        setMessage("You may now login.");
        setMessageColor("green"); // ✅ added
        setLoading(false);
      }, 900);

      return;
    }

    // --- Login flow ---
    const stored = localStorage.getItem(formData.email);
    const storedUser: User | null = stored ? JSON.parse(stored) : null;

    if (storedUser && storedUser.password === formData.password) {
      setUser(storedUser);
      setMessage("Login successful");
      setMessageColor("green"); // ✅ added
    } else {
      alert("Unauthorized user! Please register first.");
      setMessage("Login failed");
      setMessageColor("red");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setMessage("");
    clearForm();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-white/8 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-11/12 max-w-md text-center border border-gray-700 relative">
        {loading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-3xl">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!user ? (
          <>
            <h2 className="text-3xl font-semibold text-white mb-5">
              {isLogin ? "Login" : "Register"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-900 text-white focus:outline-none"
                    required
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age || ""}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-gray-900 text-white focus:outline-none"
                    required
                    min={1}
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-900 text-white focus:outline-none"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded bg-gray-900 text-white focus:outline-none"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <p className="text-gray-300 text-sm mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                  clearForm();
                }}
                className="text-blue-400 ml-1 underline"
                type="button"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>

            {message && (
              <p
                className={`mt-3 text-center ${
                  messageColor === "red" ? "text-red-500" : "text-green-400"
                }`}
              >
                {message}
              </p>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-2xl text-white mb-3">
              Welcome, {user.name} ({user.age})
            </h2>
            <p className="text-green-400 mb-3">{message}</p>
            <button
              onClick={handleLogout}
              className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
