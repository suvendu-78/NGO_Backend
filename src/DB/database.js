import mongoose from "mongoose";
import DB_NAMME from "../constant.js";

const Data = async () => {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGODB}/${DB_NAMME}`
    );

    console.log("Database connected successfully");

    return response;
  } catch (error) {
    console.error("Database connection error:", error);

    throw error;
  }
};

export default Data;