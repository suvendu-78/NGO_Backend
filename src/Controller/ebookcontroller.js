// import Purchase from "../Module/ebookpurchase.model.js";
// import Async from "../Utils/Async.js";

// const CreateEbookPurchase = Async(async (req, res) => {
//   const userEmail = req.user.Email;
//   const { bookId, title, price } = req.body;

//   const purchase = await Purchase.create({
//     userEmail,
//     bookId,
//     title,
//     price,
//   });

//   res.status(201).json({
//     success: true,
//     message: "Ebook purchased",
//     purchase,
//   });
// });

// const GetMyEbooks = Async(async (req, res) => {
//   const userEmail = req.user.Email;

//   const ebooks = await Purchase.find({ userEmail });

//   res.json({
//     success: true,
//     ebooks,
//   });
// });

// export { CreateEbookPurchase, GetMyEbooks };

import Purchase from "../Module/ebookpurchase.model.js";
import { Book } from "../Module/Book.model.js";
import Async from "../Utils/Async.js";

const CreateEbookPurchase = Async(async (req, res) => {
  const userEmail = req.user.Email;
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Book ID is required",
    });
  }

  const book = await Book.findOne({
    _id: bookId,
    type: "ebook",
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Ebook not found",
    });
  }

  // Prevent duplicate purchase records for the same user and book
  const existingPurchase = await Purchase.findOne({
    userEmail,
    bookId: book._id,
  });

  if (existingPurchase) {
    return res.status(200).json({
      success: true,
      message: "Ebook already purchased",
      purchase: existingPurchase,
    });
  }

  const purchase = await Purchase.create({
    userEmail,
    bookId: book._id,
    title: book.title,
    price: book.price,
  });

  return res.status(201).json({
    success: true,
    message: "Ebook purchased successfully",
    purchase,
  });
});

const GetMyEbooks = Async(async (req, res) => {
  const userEmail = req.user.Email;

  const ebooks = await Purchase.find({ userEmail })
    .populate("bookId")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    ebooks,
  });
});

export { CreateEbookPurchase, GetMyEbooks };
