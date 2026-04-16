import Async from "../Utils/Async.js";
import ApiError from "../Utils/Apierror.js";
import { User } from "../Module/module.js";
import Apiresponse from "../Utils/Apiresponce.js";

const Register = Async(async (req, res, next) => {
  const { fullName, Email, Mobile, Password } = req.body;
  if (!fullName) {
    throw new ApiError(404, "Name is missing!");
  }
  if (!Email) {
    throw new ApiError(404, "Email is missing!");
  }
  if (!Mobile) {
    throw new ApiError(404, "Mobile Number is missing !");
  }

  if (!Password) {
    throw new ApiError(404, "Password is missing !");
  }

  // user allready Exist or not

  const UserExist = await User.findOne({
    $or: [{ Email }, { Mobile }],
  });
  if (UserExist) {
    throw new ApiError(404, "user is allready exist!");
  }
  const user = await User.create({
    fullName: fullName.toLowerCase(),
    Password,
    Email,
    Mobile,
  });
  console.log(user);
  const CreatedUser = await User.findById(user._id).select(
    "-Password -refreshToken",
  );
  if (!CreatedUser) {
    throw new ApiError(400, "user object is not created");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, CreatedUser, "user register successfully"));

  // return res.status(200).json(req.body)
});

const Login = Async(async (req, res) => {
  const { Email, Password } = req.body;

  console.log(Email, Password);

  if (!Email) {
    throw new ApiError(404, "Email is required!");
  }

  if (!Password) {
    throw new ApiError(404, "password is required!");
  }

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const passwordValid = await user.isPasswordCorrect(Password);

  if (!passwordValid) {
    throw new ApiError(404, "Password is incorrect");
  }

  const accessToken = user.ACCESS_TOKEN();

  const logedin = await User.findById(user._id).select(
    "-Password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new Apiresponse(
        200,
        { logedin, accessToken },
        "User logged in successfully",
      ),
    );
});




import SendMail from "../Utils/sendMail.js";

const SendOtp = Async(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ Email: email });

  if (!user) throw new ApiError(404, "User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();

  // ✅ FIXED HERE
  await SendMail({
    to: email,
    subject: "OTP Code",
    html: `<h3>Your OTP is ${otp}</h3>`,
  });

  return res
    .status(200)
    .json(new Apiresponse(200, {}, "OTP sent successfully"));
});

const VerifyOtp = Async(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ Email: email });

  if (!user) throw new ApiError(404, "User not found");

  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.otpExpiry < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }

  return res.status(200).json(new Apiresponse(200, {}, "OTP verified"));
});

const ResetPassword = Async(async (req, res) => {
  const { email, password, otp } = req.body;

  const user = await User.findOne({ Email: email });

  if (!user) throw new ApiError(404, "User not found");

  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.otpExpiry < Date.now()) {
    throw new ApiError(400, "OTP expired");
  }

  user.Password = password; // ✅ auto hash

  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(new Apiresponse(200, {}, "Password reset successful"));
});



export { Register, Login,SendOtp,VerifyOtp,ResetPassword};
