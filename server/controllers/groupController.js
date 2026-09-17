const Group = require("../models/Group");
const generateGroupCode = require("../services/groupCodeService");


const { getIndianMovies } = require("../services/movieService");

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;


    console.log("REQ USER ID:", req.userId);            //Test the JWT before creating a group


    if (!name) {
      return res.status(400).json({
        message: "Group name is required",
      });
    }

    let code;
    let existingGroup;

    do {
      code = generateGroupCode();

      existingGroup = await Group.findOne({ code });
    } while (existingGroup);

    const group = await Group.create({
      name,
      code,
      createdBy: req.userId,

      members: [
        {
          user: req.userId,
        },
      ],
    });

    res.status(201).json({
      message: "Movie night created successfully",
      group,
    });
  } catch (error) {
    console.error("CREATE GROUP ERROR:", error);

    res.status(500).json({
    //   message: "Failed to create movie night",
    message: error.message
    });
  }
};




const joinGroup = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Group code is required",
      });
    }

    const group = await Group.findOne({
      code: code.toUpperCase(),
    });

    if (!group) {
      return res.status(404).json({
        message: "Movie night not found",
      });
    }

    const alreadyMember = group.members.some(
      (member) => member.user.toString() === req.userId
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "You are already a member of this movie night",
      });
    }

    group.members.push({
      user: req.userId,
    });

    await group.save();

    res.status(200).json({
      message: "Joined movie night successfully",
      group,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to join movie night",
    });
  }
};




const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    if (!group) {
      return res.status(404).json({
        message: "Movie night not found",
      });
    }

    const isMember = group.members.some(
      (member) => member.user._id.toString() === req.userId   //Check if the user is a member of the group
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this movie night",
      });
    }


    const totalMembers = group.members.length;

    const submittedMembers = group.members.filter(
      (member) => member.submitted
    ).length;

    const preferencesCompleted =
      totalMembers > 0 &&
      submittedMembers === totalMembers;


    res.status(200).json({
      group,
      preferenceStatus: {
        totalMembers,
        submittedMembers,
        completed: preferencesCompleted
      }
    });
  } catch (error) {
    console.error("GET GROUP ERROR:",error);

    res.status(500).json({
      message: "Failed to get movie night",
    });
  }
};







/*
UPDATE USER PREFERENCES
*/

const updatePreferences = async (req, res) => {
  try {
    const { genres, languages, minRating, maxDuration } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({
        message: "Movie night not found",
      });
    }
    const member = group.members.find(
      (member) => member.user.toString() === req.userId
    );
    if (!member) {
      return res.status(403).json({
        message: "You are not a member of this movie night",
      });
    }
    // Update preferences
    member.preferences = {
      genres: Array.isArray(genres) ? genres : [],
      languages: Array.isArray(languages) ? languages : [],
      minRating: Number(minRating) || 0,
      maxDuration: Number(maxDuration) || 180,
    };
    member.submitted = true;
    await group.save();
    res.status(200).json({
      message: "Preferences saved successfully",
      preferences: member.preferences,
    });
  } catch (error) {
    console.error("UPDATE PREFERENCES ERROR:", error);
    res.status(500).json({
      message: "Failed to save preferences",
    });
  }
};
/*
GET MOVIE RECOMMENDATIONS
*/
const getRecommendations = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({
        message: "Movie night not found",
      });
    }
    // Check if current user belongs to group
    const isMember = group.members.some(
      // (member) => member.user.toString() === req.userId
      (member) =>
        member.user &&
        member.user._id.toString() === req.userId
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this movie night",
      });
    }
    // Everyone must submit preferences
    const allSubmitted =
      group.members.length > 0 &&
      group.members.every((member) => member.submitted);
    if (!allSubmitted) {
      return res.status(400).json({
        message: "All members must submit their preferences first",
      });
    }
    const movies = getIndianMovies();
    /*
      WEIGHTED RECOMMENDATION ALGORITHM

      Genre       = 35 points
      Language    = 25 points
      Rating      = 20 points
      Duration    = 20 points

      Total       = 100 points
    */
    const recommendations = movies.map((movie) => {
      let totalScore = 0;
      group.members.forEach((member) => {
        const preferences = member.preferences;
        /*
        GENRE MATCH - 35
        */
        const genreMatch =
          preferences.genres.length === 0 ||
          movie.genres.some((genre) =>
            preferences.genres.includes(genre)
          );
        if (genreMatch) {
          totalScore += 35;
        }
        /* 
        LANGUAGE MATCH - 25 
        */
        const languageMatch =
          preferences.languages.length === 0 ||
          preferences.languages.includes(movie.language);

        if (languageMatch) {
          totalScore += 25;
        }

        /* 
        RATING MATCH - 20 
        */
        if (movie.rating >= preferences.minRating) {
          totalScore += 20;
        }

        /* 
        DURATION MATCH - 20 
        */
        if (movie.duration <= preferences.maxDuration) {
          totalScore += 20;
        }
      });

      /*
        Maximum possible score for this movie
        = number of members * 100
      */

      const maxScore = group.members.length * 100;

      const matchScore = Math.round(
        (totalScore / maxScore) * 100
      );

      return {
        ...movie,
        matchScore,
      };
    });

    // Highest matching movies first
    recommendations.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    res.status(200).json({
      movies: recommendations,
    });
  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);

    res.status(500).json({
      message: "Failed to generate recommendations",
    });
  }
};

module.exports = {
  createGroup,
  joinGroup,
  getGroup,
  updatePreferences,
  getRecommendations,
};
