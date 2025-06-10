const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import models
const User = require("./models/User");
const Property = require("./models/Property");

// Initialize app
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // Add your frontend origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB (updated connection string)
mongoose
  .connect(
    "mongodb+srv://sainakka09:saifire@cluster0.xfuc38w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: "true", // Stringified boolean to fix the error
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");

    // Create directory if it doesn't exist
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating uploads directory:", err);
        return cb(err);
      }
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
// Routes

// User Registration
// app.post("/api/register", async (req, res) => {
//   try {
//     const { name, email, username, password } = req.body;

//     // Check if user exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }],
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists with this email or username",
//       });
//     }

//     // Create new user (password will be hashed by pre-save hook)
//     const user = new User({ name, email, username, password });
//     await user.save();
//     console.log("Raw password during registration:", password);
//     await user.save();
//     console.log("Hash after save:", user.password);

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// });
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    // Create and save user (only once)
    const user = new User({ name, email, username, password });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});
// User Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("=== LOGIN ATTEMPT ===");
  console.log("Username:", username);
  console.log("Input password:", password);

  const user = await User.findOne({ username });
  if (!user) {
    console.log("User not found");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  console.log("Stored hash:", user.password);
  console.log("Password comparison starting...");

  const isMatch = await user.comparePassword(password);
  console.log("Password match result:", isMatch);

  if (!isMatch) {
    console.log("Possible issues:");
    console.log("- Wrong password entered");
    console.log("- Password not properly hashed during registration");
    console.log("- Database corruption");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});
// Property Listing
// Property Listing
app.post("/api/properties", upload.array("images", 10), async (req, res) => {
  try {
    const {
      owner,
      location,
      type,
      bhk,
      price,
      squareFeet,
      description,
      contactNumber,
    } = req.body;

    // Validate required fields
    if (
      !owner ||
      !location ||
      !type ||
      !bhk ||
      !price ||
      !squareFeet ||
      !description ||
      !contactNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Process uploaded files
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const property = new Property({
      owner,
      location,
      type,
      bhk,
      price,
      squareFeet,
      images,
      description,
      contactNumber,
    });

    await property.save();

    res.status(201).json({
      message: "Property listed successfully",
      property: {
        id: property._id,
        location: property.location,
        type: property.type,
        bhk: property.bhk,
        price: property.price,
        squareFeet: property.squareFeet,
        images: property.images,
        contactNumber: property.contactNumber,
      },
    });
  } catch (error) {
    console.error("Property listing error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get All Properties
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await Property.find({ status: "available" })
      .populate("owner", "name email")
      .sort({ createdAt: -1 }); // Newest first

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Server error" });
  }
});
//delete property
app.delete("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Optionally delete associated images from filesystem
    property.images.forEach((image) => {
      const imagePath = path.join(__dirname, image.replace("/uploads/", ""));
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get User's Properties
app.get("/api/users/:userId/properties", async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.params.userId });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/api/logout", (req, res) => {
  // In a real app, you would invalidate the token/session here
  res.json({ message: "Logged out successfully" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
