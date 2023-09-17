"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const pick_1 = __importDefault(require("../../../utils/pick"));
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const book_service_1 = require("./book.service");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.bookService.insertIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book created successfully",
        data: result,
    });
}));
const getBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    // Cast req.query to the appropriate type
    const query = req.query;
    // Filter out undefined query parameters
    const filters = {};
    for (const key in query) {
        if (query[key] !== undefined) {
            filters[key] = query[key]; // No need for the "as string"
        }
    }
    const options = (0, pick_1.default)(query, ["limit", "page", "sortBy", "sortOrder"]);
    if (Object.keys(filters).length === 0) {
        // If there are no query parameters, fetch all data
        const allBooks = yield prisma_1.default.book.findMany();
        return (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "All books fetched successfully",
            meta: {
                total: allBooks.length,
                page: 1,
                limit: allBooks.length, // Assuming all data is on one page
            },
            data: allBooks,
        });
    }
    else {
        const result = yield book_service_1.bookService.getAllBooks(filters, options);
        return (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Books fetched successfully",
            meta: result.meta,
            data: result.data,
        });
    }
}));
// Rest of your code
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.bookService.getBookById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book fetched successfully",
        data: result,
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.bookService.deleteFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book deleted successfully",
        data: result,
    });
}));
const updateIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_service_1.bookService.updateIntoDB(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Book updated successfully",
        data: result,
    });
}));
exports.BookController = {
    insertIntoDB,
    getUserById,
    updateIntoDB,
    deleteFromDB,
    getBooks,
};
