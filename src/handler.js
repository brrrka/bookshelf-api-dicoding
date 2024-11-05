const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  bookshelf.push(newBook);
  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = bookshelf;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading == reading);
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished == finished);
  }

  const bookList = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response = h.response({
    status: 'success',
    data: {
      books: bookList,
    },
  });
  response.code(200);
  return response;
};

const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = bookshelf.find((book) => book.id === bookId);

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      message: 'Buku ditemukan!',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = bookshelf.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    bookshelf.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};
