import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: String,
  price: Number,
  purchaseDate: { type: Date, default: Date.now },
});

export default mongoose.model("Purchase", purchaseSchema);