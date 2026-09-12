const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    genres: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    minRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },

    maxDuration: {
      type: Number,
      default: 180,
      min: 1
    },

    // mood: {
    //   type: String,
    //   default: "Any",
    // },
  },
  {
    _id: false,
  }
);

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    preferences: {
      type: preferenceSchema,
      default: () => ({}),
    },

    submitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: {
      type: [memberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);
