// import Razorpay from "razorpay";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const options = {
//       amount: Math.round(amount * 100), // convert to paise
//       currency: "INR",
//       receipt: "receipt_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create Razorpay order",
//     });
//   }
// };
import "dotenv/config";
import Razorpay from "razorpay";

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error("RAZORPAY_KEY_ID is missing");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET is missing");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};
