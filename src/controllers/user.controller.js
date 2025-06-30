import asyncHandler from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  //get user details form frontend
  //validate the data
  //check if user already exists(username,email)
  //check for images,avatar
  //upload images to cloudinary,avatar
  //create user in database
  //remove password and refreshToken from response
  //check for user creation
  //return res

  const {fullname,email,username,password}=req.body;
  console.log(email);

  if([fullname,email,password,username].some((field)=>
    field?.trim()==" ")
  ){
    throw new ApiError(400, "All fields are required");
  }

  const existedUser=User.findOne({
    $or:[{email},{username}]
  });

  if(existedUser){
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath=req.files?.avatar[0]?.path;
  const coverImageLocalPath=req.files?.coverImage[0]?.path;

  if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar=await uploadOnCloudinary(avatarLocalPath);
  const coverImage=await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user= await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase(),
  })

  const createdUser=await user.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "User creation failed");
  }

  return res.status(201).json(
    new ApiResponse(201,createdUser, "User created successfully")
  )
})

export { registerUser };