const Group = require("../models/Group");

const {
  getIndianMovies
} = require("../services/movieService");

const {
  calculateGroupRecommendations
} = require("../services/matchingService");


const getRecommendations = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members.user", "name email");

    if (!group) {
      return res.status(404).json({
        message: "Movie night not found"
      });
    }

    // Check whether current user belongs to the group

    const isMember = group.members.some(
      (member) =>
        member.user._id.toString() === req.userId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this movie night"
      });
    }

    // Check whether everyone submitted preferences

    const allSubmitted = group.members.every(
      (member) => member.submitted
    );

    if (!allSubmitted) {
      return res.status(400).json({
        message:
          "All members must submit their preferences first"
      });
    }

    // Get movies

    const movies = getIndianMovies();

    // Calculate recommendations

    const recommendations =
      calculateGroupRecommendations(
        movies,
        group.members
      );

    // Return top 3

    const topRecommendations =
      recommendations.slice(0, 3);

    res.status(200).json({
      group: {
        id: group._id,
        name: group.name,
        memberCount: group.members.length
      },
      recommendations: topRecommendations
    });

  } catch (error) {
    console.error(
      "GET RECOMMENDATIONS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to generate recommendations"
    });
  }
};


module.exports = {
  getRecommendations
};
