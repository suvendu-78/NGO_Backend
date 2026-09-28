import mongoose from "mongoose";
import DB_NAMME from "../constant.js";

const Data = async () => {
  try {
    console.log("MONGODB exists:", !!process.env.MONGODB);
    console.log("Database name:", DB_NAMME);

    if (!process.env.MONGODB) {
      throw new Error("MONGODB environment variable is NOT available");
    }

    const response = await mongoose.connect(
      `${process.env.MONGODB}/${DB_NAMME}`,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log("MongoDB connected successfully");

    return response;
  } catch (error) {
    console.error("MONGODB ERROR:", error);
    throw error;
  }
};

export default Data;