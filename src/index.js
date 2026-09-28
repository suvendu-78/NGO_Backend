// import Data from "./DB/database.js";
// import App from "./App.js";

// let isConnected = false;

// const connectDatabase = async () => {
//   if (!isConnected) {
//     await Data();
//     isConnected = true;
//     console.log("Database connected successfully");
//   }
// };

// const handler = async (req, res) => {
//   try {
//     await connectDatabase();

//     return App(req, res);
//   } catch (error) {
//     console.error("ERROR:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Database connection failed",
//     });
//   }
// };

// export default handler;



import Data from "./DB/database.js";
import App from "./App.js";

let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await Data();
    isConnected = true;
  }
};

const handler = async (req, res) => {
  try {
    await connectDatabase();

    return App(req, res);
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
};

export default handler;