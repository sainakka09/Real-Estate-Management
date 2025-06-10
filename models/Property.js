const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    type: {
      type: String,
      enum: ["flat", "house", "shop"],
      required: [true, "Property type is required"],
    },
    bhk: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "4BHK"],
      required: [true, "BHK configuration is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least 1"],
    },
    squareFeet: {
      type: Number,
      required: [true, "Square footage is required"],
      min: [1, "Square footage must be at least 1"],
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /\.(jpg|jpeg|png|webp)$/i.test(v);
          },
          message: (props) => `${props.value} is not a valid image URL`,
        },
      },
    ],
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
    coordinates: {
      // For geospatial queries (optional)
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    },
    amenities: {
      // Optional: List of amenities
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Geospatial index for location-based queries
PropertySchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Property", PropertySchema);
