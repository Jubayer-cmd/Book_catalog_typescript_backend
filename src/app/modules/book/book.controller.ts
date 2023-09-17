import { Book } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import pick from "../../../utils/pick";
import prisma from "../../../utils/prisma";
import sendResponse from "../../../utils/sendResponse";
import { bookService } from "./book.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book created successfully",
    data: result,
  });
});

const getBooks: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.query);

    // Cast req.query to the appropriate type
    const query = req.query as Record<string, string | undefined>;

    // Filter out undefined query parameters
    const filters: Record<string, string> = {};
    for (const key in query) {
      if (query[key] !== undefined) {
        filters[key] = query[key] as string; // No need for the "as string"
      }
    }

    const options = pick(query, ["limit", "page", "sortBy", "sortOrder"]);

    if (Object.keys(filters).length === 0) {
      // If there are no query parameters, fetch all data
      const allBooks = await prisma.book.findMany();
      return sendResponse<Book[]>(res, {
        statusCode: 200,
        success: true,
        message: "All books fetched successfully",
        meta: {
          total: allBooks.length,
          page: 1, // Assuming page 1 for all data
          limit: allBooks.length, // Assuming all data is on one page
        },
        data: allBooks,
      });
    } else {
      const result = await bookService.getAllBooks(filters, options);
      return sendResponse<Book[]>(res, {
        statusCode: 200,
        success: true,
        message: "Books fetched successfully",
        meta: result.meta,
        data: result.data,
      });
    }
  }
);

// Rest of your code

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.getBookById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.deleteFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.updateIntoDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book updated successfully",
    data: result,
  });
});

export const BookController = {
  insertIntoDB,
  getUserById,
  updateIntoDB,
  deleteFromDB,
  getBooks,
};
