const Group = require("../models/Group");

const {
  SUPPORTED_LANGUAGES,
  SUPPORTED_GENRES
} = require("../constants/preferences");

const updatePreferences = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      languages,
      genres,
      minRating,
      maxDuration
    } = req.body;

    // 1. Find group
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found"
      });
    }

    // 2. Check whether user is a member
    const member = group.members.find(
      (member) => member.user.toString() === req.userId
    );

    if (!member) {
      return res.status(403).json({
        message: "You are not a member of this group"
      });
    }

    // 3. Validate arrays
    if (!Array.isArray(languages)) {
      return res.status(400).json({
        message: "Languages must be an array"
      });
    }

    if (!Array.isArray(genres)) {
      return res.status(400).json({
        message: "Genres must be an array"
      });
    }


    // 4. Check that at least one language is selected
    if (languages.length === 0) {
      return res.status(400).json({
        message: "Please select at least one language"
      });
    }

    // 5. Check that at least one genre is selected
    if (genres.length === 0) {
      return res.status(400).json({
        message: "Please select at least one genre"
      });
    }



    // 6. Validate languages
    const invalidLanguages = languages.filter(
      (language) => !SUPPORTED_LANGUAGES.includes(language)
    );

    if (invalidLanguages.length > 0) {
      return res.status(400).json({
        message: "Invalid language selected",
        invalidLanguages
      });
    }

    // 7. Validate genres
    const invalidGenres = genres.filter(
      (genre) => !SUPPORTED_GENRES.includes(genre)
    );

    if (invalidGenres.length > 0) {
      return res.status(400).json({
        message: "Invalid genre selected",
        invalidGenres
      });
    }

    // 8. Validate rating
    if (
      typeof minRating !== "number" ||
      minRating < 0 ||
      minRating > 10
    ) {
      return res.status(400).json({
        message: "Minimum rating must be between 0 and 10"
      });
    }

    // 9. Validate duration
    if (
      typeof maxDuration !== "number" ||
      maxDuration <= 0
    ) {
      return res.status(400).json({
        message: "Maximum duration must be greater than 0"
      });
    }

    // 10. Save preferences
    member.preferences = {
      languages,
      genres,
      minRating,
      maxDuration
    };

    // 11. Mark submitted
    member.submitted = true;

    // 12. Save group
    await group.save();

    res.json({
      message: "Preferences saved successfully",
      preferences: member.preferences,
      submitted: member.submitted
    });

  } catch (error) {
    console.error("Update preferences error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  updatePreferences
};
