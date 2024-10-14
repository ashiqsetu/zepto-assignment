
const loadBooks = async () => {
    const res = await fetch('https://gutendex.com/books?page=1')
    const data = await res.json();
    const booksData = data['results'];
    console.log(booksData);
    showBooks(booksData);
}

const showBooks = (books) => {
    let booksList = document.querySelector('.books-list');

    function getAuthorsName(authors) {
        return authors.map(author => author.name).join(' & ')
    }

    books.forEach((book) => {
        let singleBook = document.createElement('div');
        singleBook.classList.add('single-book');

        let authorNames = getAuthorsName(book['authors']);

        singleBook.innerHTML = `<div class="book-img">
                        <img src="${book['formats']['image/jpeg']}" alt="${book['title']}">
                    </div>
                    <div class="book-content">
                        <h3>
                            <a href="#">${book['title']}</a>
                        </h3>
                        <ul class="book-info-list">
                            <li>Author: ${authorNames}</li>
                            <li>Genre: </li>
                        </ul>
                        <div>
                            <span></span>
                            <span>Love It</span>
                        </div>
                    </div>`;
        booksList.appendChild(singleBook);
    });
}

loadBooks();


document.addEventListener('DOMContentLoaded', function () {

});
