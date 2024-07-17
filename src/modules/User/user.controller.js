import User from "../../../DB/Models/user.model.js";

//================================= Update Account API =====================//
export const updateAccount = async (req, res, next) => {
  // 1- destructure the required data from the request body
  const { username, email, role } =req.body;
  const { _id } = req.authUser;

  if (email) {
    // email check
    const isEmailExists = await User.findOne({ email });
    if (!isEmailExists)
      return next(new Error("Email is not found", { cause: 404 }));
  }
  //update user
  const updatedUser = await User.findByIdAndUpdate(_id,{username,email,role},
    {
      new: true,
    }
  );
  if (!updatedUser) return next(new Error("update fail"));
  res.status(200).json({ message: "done", updatedUser });
};
//=============================== Delete Account API =====================//
export const deleteAccount = async (req, res, next) => {
  const { _id } = req.authUser;
  const deletedUser = await User.findByIdAndDelete(_id);
  if (!deletedUser) return next(new Error("delete fail"));
  res.status(200).json({ message: "done" });
};
//================================= Get User Profile API =====================//
export const getUserProfile = async (req, res, next) => {
  res.status(200).json({ message: "User data:", data: req.authUser });
};
