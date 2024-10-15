
const API_URL = 'https://gutendex.com/books';
let booksList = document.querySelector('.books-list');
let booksSearch = document.querySelector('.booksSearch');

const loadBooks = async (page = 1) => {
    let booksData = JSON.parse(localStorage.getItem('booksResult'));
 
    if(!booksData) {
        try {
            const url = `${API_URL}?page=${page}`;
            const res = await fetch(url);
            const data = await res.json();
            let booksResult = data['results'];

            localStorage.setItem('booksResult', JSON.stringify(booksResult));
            booksData = JSON.parse(localStorage.getItem('booksResult'));
            showBooks(booksData);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    showBooks(booksData);
}

const showBooks = (books) => {
    booksList.innerHTML = '';

    books.forEach((book) => {
        let singleBook = document.createElement('div');
        singleBook.classList.add('single-book');

        const imageUrl = book.formats?.['image/jpeg'] || '';
        let authorNames = getAuthorsName(book['authors']);

        singleBook.innerHTML = `<div class="book-img">
                        <img src="${imageUrl}" alt="${book.title}}">
                    </div>
                    <div class="book-content">
                        <h3>
                            <a href="#">${book.title}</a>
                        </h3>
                        <ul class="book-info-list">
                            <li>Author: ${authorNames}</li>
                            <li>Genre: ${book.subjects[0]}</li>
                        </ul>
                        <div>
                            <a href="#" class="addWishlistBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </a>
                        </div>
                    </div>`;
        booksList.appendChild(singleBook);
    });
}

function getAuthorsName(authors) {
    return authors.map(author => author.name).join(' & ');
}


booksSearch.addEventListener('input', function(event) {
    let searchText = booksSearch.value.trim().toLowerCase();

    let booksData = JSON.parse(localStorage.getItem('booksResult'));

    let filteredBooks = booksData.filter(book => 
        book.title.toLowerCase().includes(searchText)
    );

    showBooks(filteredBooks);
});



loadBooks();


document.addEventListener('DOMContentLoaded', function () {

});
