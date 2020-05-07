// Book model
class Book {
    constructor(title, genre) {
        this.title = title;
        this.genre = genre;
    }
}

// UI
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.genre}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>`;

        list.appendChild(row)
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Fade alert
        setTimeout(() => document.querySelector('.alert').remove(), 5000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#genre').value = '';
    }
}

// Store
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];            
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(title) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.title === title) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Read Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Get values from form
    const title = document.querySelector('#title').value;
    const genre = document.querySelector('#genre').value;

    // Form validation
    if(title === "" || genre === "") {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {    
    // Instantiate Book
    const book = new Book(title, genre);

    // Add book to table
    UI.addBookToList(book);

    // Retain book in store
    Store.addBook(book);

    //Show success message
    UI.showAlert('Book added successfully', 'success')

    // Clear fields
    UI.clearFields();
    }
});


// Remove Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from table
    UI.deleteBook(e.target);
    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //Show success message
    UI.showAlert('Book removed', 'warning');
});
