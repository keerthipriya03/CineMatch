const Group = require("../models/Group");
const generateGroupCode = require("../services/groupCodeService");

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





module.exports = {
  createGroup,
  joinGroup,
  getGroup,
};
