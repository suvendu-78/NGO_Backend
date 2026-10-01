import Data from "./DB/database.js";
import App from "./App.js";

let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await Data();
    isConnected = true;
    console.log("Database connected successfully");
  }
};

// Vercel handler
const handler = async (req, res) => {
  try {
    await connectDatabase();

    return App(req, res);
  } catch (error) {
    console.error("ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
};

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  connectDatabase()
    .then(() => {
      App.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("ERROR:", error.message);
    });
}

export default handler;



// import Data from "./DB/database.js";
// import App from "./App.js";

// let isConnected = false;

// const connectDatabase = async () => {
//   if (!isConnected) {
//     await Data();
//     isConnected = true;
//   }
// };

// const handler = async (req, res) => {
//   try {
//     await connectDatabase();

//     return App(req, res);
//   } catch (error) {
//     console.error("DATABASE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Database connection failed",
//       error: error.message,
//     });
//   }
// };

// export default handler;