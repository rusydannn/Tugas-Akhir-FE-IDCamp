// Helper function to get books from localStorage
function getBooksFromLocalStorage(isComplete) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    return books.filter(book => book.isComplete === isComplete);
  }
  
  // Helper function to save books to localStorage
  function saveBooksToLocalStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
  }
  
  // Function to create a book element
  function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');
  
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? 'Tandai Belum Selesai' : 'Tandai Selesai Dibaca'}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;
  
    // Event listener for complete button
    bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
      toggleBookCompletion(book.id);
    });
  
    // Event listener for delete button
    bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
      deleteBook(book.id);
    });
  
    // Event listener for edit button
    bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => {
      editBook(book.id);
    });
  
    return bookElement;
  }
  
  // Function to render books
  function renderBooks() {
    const incompleteBooks = getBooksFromLocalStorage(false);
    const completeBooks = getBooksFromLocalStorage(true);
  
    // Render incomplete books
    const incompleteBookList = document.getElementById('incompleteBookList');
    incompleteBookList.innerHTML = '';
    incompleteBooks.forEach(book => {
      incompleteBookList.appendChild(createBookElement(book));
    });
  
    // Render complete books
    const completeBookList = document.getElementById('completeBookList');
    completeBookList.innerHTML = '';
    completeBooks.forEach(book => {
      completeBookList.appendChild(createBookElement(book));
    });
  }
  
  // Function to add a new book
  function addBook(event) {
    event.preventDefault();
  
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const id = Date.now();
  
    const newBook = { id, title, author, year, isComplete };
    const books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(newBook);
    saveBooksToLocalStorage(books);
  
    renderBooks();
    document.getElementById('bookForm').reset();
  }
  
  // Function to toggle book completion status
  function toggleBookCompletion(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(book => book.id === bookId);
    if (book) {
      book.isComplete = !book.isComplete;
      saveBooksToLocalStorage(books);
      renderBooks();
    }
  }
  
  // Function to delete a book
  function deleteBook(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const updatedBooks = books.filter(book => book.id !== bookId);
    saveBooksToLocalStorage(updatedBooks);
    renderBooks();
  }
  
  // Function to edit a book
  function editBook(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(book => book.id === bookId);
    if (book) {
      const title = prompt('Edit Judul Buku:', book.title);
      const author = prompt('Edit Penulis Buku:', book.author);
      const year = prompt('Edit Tahun Rilis Buku:', book.year);
      const isComplete = confirm('Apakah buku ini selesai dibaca?');
  
      if (title && author && year) {
        book.title = title;
        book.author = author;
        book.year = parseInt(year);
        book.isComplete = isComplete;
        saveBooksToLocalStorage(books);
        renderBooks();
      }
    }
  }
  
  // Function to search books by title
  function searchBooks(event) {
    event.preventDefault();
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  
    const allBooks = [...getBooksFromLocalStorage(false), ...getBooksFromLocalStorage(true)];
    const filteredBooks = allBooks.filter(book => book.title.toLowerCase().includes(searchTitle));
  
    document.getElementById('incompleteBookList').innerHTML = '';
    document.getElementById('completeBookList').innerHTML = '';
  
    filteredBooks.forEach(book => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        document.getElementById('completeBookList').appendChild(bookElement);
      } else {
        document.getElementById('incompleteBookList').appendChild(bookElement);
      }
    });
  }
  
  // Event listener for adding a new book
  document.getElementById('bookForm').addEventListener('submit', addBook);
  
  // Event listener for search form
  document.getElementById('searchBook').addEventListener('submit', searchBooks);
  
  // Initial render of books
  renderBooks();
  