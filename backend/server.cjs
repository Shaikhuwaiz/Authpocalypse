const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 1000;

app.use(cors({ origin: "http://localhost:1000", credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { dbName: "test" })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

app.post("/register", async (req, res) => {
  const { name, age, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = new User({ name, age, email, password });
  await user.save();
  res.json({ message: "Registered successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🛜`));
