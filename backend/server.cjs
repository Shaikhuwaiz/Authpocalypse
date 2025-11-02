const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors({
  origin: [
    "https://loginweb-git-main-shaikhuwaizs-projects.vercel.app",
    "https://loginweb-two.vercel.app/",
    "https://loginweb-c4opf34z4-shaikhuwaizs-projects.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { dbName: "test" })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB connection error ❌", err));

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

app.get("/", (req, res) => {
  res.send("Server is running correctly.");
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, age, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, age, email, password });
    await user.save();
    return res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🛜`));
