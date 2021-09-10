$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.delete-button', deleteBook);
  $('#bookShelf').on('click', '.read-button', markRead);
  // TODO - Add code for edit & delete buttons
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  }).then(function (response) {
    console.log('Response from server.', response);
    refreshBooks();
  }).catch(function (error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time. Please try again later.');
  });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();
  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td>
        <button class="delete-button" data-id="${book.id}">
        Delete
        </button>
        </td>
        <td>
        <button class="read-button" data-id="${book.id}"> Mark Read
        </button>
        </td>
      </tr>
    `);
  }
}

// Called when the delete button is pushed
function deleteBook() {
  console.log($(this));
  // getting the unique book id and setting it to bookId
  const bookId = $(this).data('id');
  console.log(bookId);
  $.ajax({
    // calling a DELETE method and sending the unique id
    // as a parameter
    method: 'DELETE',
    url: `/books/${bookId}`
  }).then(function (response) {
    // After the book is deleted inform the user and
    // refresh the book list on the DOM
    console.log('Book deleted');
    refreshBooks();
  }).catch(function (error) {
    console.log('Error in deleting book');
  })
}


// Called when the update button is pushed
function markRead() {
  console.log($(this));
  // getting the unique book id and setting it to bookRead
  let bookRead = $(this).data('id');
  $.ajax({
    // calling a PUT method and sending the unique id
    // as a parameter
    method: 'PUT',
    url: `/books/${bookRead}`
  }).then(function (response) {
    // Let the user know the book was updated
    console.log('Book updated!');
    // Refresh the book list on the DOM
    refreshBooks();
  }).catch(function (error) {
    console.log('There was an error updating!');
  })
}
