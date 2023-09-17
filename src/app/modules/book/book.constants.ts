export const bookFilterableFields: string[] = ["genre", "publicationDate"];

export const bookSearchableFields: string[] = ["title", "author", "genre"];

export type IBookFilterRequest = {
  search?: string | undefined;
  genre?: string;
  publicationDate?: string;
};
