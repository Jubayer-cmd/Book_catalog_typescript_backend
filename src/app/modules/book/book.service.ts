import { Book, Prisma } from "@prisma/client";
import { IGenericResponse } from "../../../interface/common";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../utils/paginationHelper";
import prisma from "../../../utils/prisma";
import { IBookFilterRequest, bookSearchableFields } from "./book.constants";

const insertIntoDB = async (data: Book): Promise<Book> => {
  const result = await prisma.book.create({
    data,
  });
  return result;
};

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

const getAllBooks = async (
  filters: IBookFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // Here, we'll create an empty whereConditions object initially
  const whereConditions: Prisma.BookWhereInput = {};

  // You can keep the rest of your filter conditions as they are
  const { search, genre, publicationDate, ...filterData } = filters;
  console.log("Search:", search);
  console.log("Genre:", genre);
  console.log("Publication Date:", publicationDate);
  const andConditions = [];

  if (search) {
    andConditions.push({
      OR: bookSearchableFields.map((field) => ({
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
        if (bookSearchableFields.includes(key)) {
          return {
            [key]: {
              contains: (filterData as any)[key],
              mode: "insensitive",
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  whereConditions.OR = andConditions; // Use OR for multiple filter conditions

  const result = await prisma.book.findMany({
    skip,
    take: Number(limit),
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereConditions,
  });

  const total = await prisma.book.count({
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
};

const getBookById = async (id: string): Promise<Book | null> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<Book>
): Promise<Book> => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Book> => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
  });
  return result;
};

export const bookService = {
  insertIntoDB,
  getBookById,
  updateIntoDB,
  deleteFromDB,
  getAllBooks,
};
