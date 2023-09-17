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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookService = void 0;
const paginationHelper_1 = require("../../../utils/paginationHelper");
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const book_constants_1 = require("./book.constants");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.create({
        data,
    });
    return result;
});
// const getAllBooks = async (
//   filters: IBookFilterRequest,
//   options: IPaginationOptions
// ): Promise<IGenericResponse<Book[]>> => {
//   const { limit, page, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(options);
//   const { search, genre, publicationDate, ...filterData } = filters;
//   console.log("Search:", search);
//   console.log("Genre:", genre);
//   console.log("Publication Date:", publicationDate);
//   const andConditions = [];
//   if (search) {
//     andConditions.push({
//       OR: bookSearchableFields.map((field) => ({
//         [field]: {
//           contains: search,
//           mode: "insensitive",
//         },
//       })),
//     });
//   }
//   if (Object.keys(filterData).length > 0) {
//     andConditions.push({
//       AND: Object.keys(filterData).map((key) => {
//         if (bookSearchableFields.includes(key)) {
//           return {
//             [key]: {
//               contains: (filterData as any)[key],
//               mode: "insensitive",
//             },
//           };
//         } else {
//           return {
//             [key]: {
//               equals: (filterData as any)[key],
//             },
//           };
//         }
//       }),
//     });
//   }
//   const whereConditions: Prisma.BookWhereInput =
//     andConditions.length > 0 ? { AND: andConditions } : {};
//   const result = await prisma.book.findMany({
//     skip,
//     take: Number(limit),
//     orderBy: {
//       [sortBy]: sortOrder,
//     },
//     where: whereConditions,
//   });
//   const total = await prisma.book.count({
//     where: whereConditions,
//   });
//   const totalPages = Math.ceil(total / Number(limit));
//   return {
//     meta: {
//       total,
//       page,
//       limit,
//       totalPages,
//     },
//     data: result,
//   };
// };
const getAllBooks = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // Here, we'll create an empty whereConditions object initially
    const whereConditions = {};
    // You can keep the rest of your filter conditions as they are
    const { search, genre, publicationDate } = filters, filterData = __rest(filters, ["search", "genre", "publicationDate"]);
    console.log("Search:", search);
    console.log("Genre:", genre);
    console.log("Publication Date:", publicationDate);
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: book_constants_1.bookSearchableFields.map((field) => ({
                [field]: {
                    contains: search,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (genre) {
        andConditions.push({
            genre: {
                equals: genre,
            },
        });
    }
    if (publicationDate) {
        andConditions.push({
            publicationDate: {
                equals: publicationDate,
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (book_constants_1.bookSearchableFields.includes(key)) {
                    return {
                        [key]: {
                            contains: filterData[key],
                            mode: "insensitive",
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    whereConditions.OR = andConditions; // Use OR for multiple filter conditions
    const result = yield prisma_1.default.book.findMany({
        skip,
        take: Number(limit),
        orderBy: {
            [sortBy]: sortOrder,
        },
        where: whereConditions,
    });
    const total = yield prisma_1.default.book.count({
        where: whereConditions,
    });
    const totalPages = Math.ceil(total / Number(limit));
    return {
        meta: {
            total,
            page,
            limit,
            totalPages,
        },
        data: result,
    };
});
const getBookById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.bookService = {
    insertIntoDB,
    getBookById,
    updateIntoDB,
    deleteFromDB,
    getAllBooks,
};
