import express from "express";
import { BookController } from "./book.controller";

const router = express.Router();

router.post("/books/create-book", BookController.insertIntoDB);
router.get("/books", BookController.getBooks);
router.get("/books/:id", BookController.getUserById);

router.delete("/books/:id", BookController.deleteFromDB);

router.patch("/books/:id", BookController.updateIntoDB);

export const bookRoutes = router;
