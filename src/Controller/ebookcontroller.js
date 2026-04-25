import Purchase from "../Module/ebookpurchase.model.js";
import Async from "../Utils/Async.js";

const CreateEbookPurchase = Async(async (req, res) => {
  const userEmail = req.user.Email;
  const { bookId, title, price } = req.body;

  const purchase = await Purchase.create({
    userEmail,
    bookId,
    title,
    price,
  });

  res.status(201).json({
    success: true,
    message: "Ebook purchased",
    purchase,
  });
});

const GetMyEbooks = Async(async (req, res) => {
  const userEmail = req.user.Email;

  const ebooks = await Purchase.find({ userEmail });

  res.json({
    success: true,
    ebooks,
  });
});

export { CreateEbookPurchase, GetMyEbooks };