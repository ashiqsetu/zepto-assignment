
document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://gutendex.com/books';
    let booksListWrapper = document.querySelector('.books-list-wrapper');
    let booksList = document.querySelector('.books-list');

    let booksFindOptions = document.querySelector('.books-find-options');
    let booksSearch = document.querySelector('.booksSearch');

    let firstIndexOfBooks = document.querySelector('.firstIndexOfBooks');
    let lastIndexOfBooks = document.querySelector('.lastIndexOfBooks');
    let totalBooks = document.querySelector('.totalBooks');

    let currentPage = 1;
    const BOOKS_PER_PAGE = 32;
    let totalNumberOfBooks = 0;

    let pagination = document.querySelector('.pagination');

    let skeletons = document.querySelectorAll('.skeleton');

    let timer;
    let typingInterval = 2000;
    let stopTyping = false;

    const loadBooks = async (page = 1) => {
        booksList.innerHTML = '';
        try {
            booksListWrapper.classList.add('skeleton');
            booksList.classList.add('skeleton');
            booksFindOptions.classList.add('skeleton');
            pagination.classList.add('skeleton');

            const url = `${API_URL}?page=${page}`;
            const res = await fetch(url);
            const data = await res.json();

            let booksData = data.results;
            totalNumberOfBooks = data.count;
            const totalPages = Math.ceil(totalNumberOfBooks / BOOKS_PER_PAGE);

            showBooks(booksData);
            showPagination(totalPages);
        } catch (error) {
            console.error('Error fetching books:', error);
            let errorMsg = document.createElement('p');
            errorMsg.classList.add('errorMsg');
            errorMsg.innerText = error;
            return;
        } finally {
            skeletons.forEach(skeleton => {
                skeleton.classList.remove('skeleton');
            });
            booksListWrapper.classList.remove('skeleton');
            booksList.classList.remove('skeleton');
            booksFindOptions.classList.remove('skeleton');
            pagination.classList.remove('skeleton');
        }
    }

    const showBooks = (books) => {
        firstIndexOfBooks.innerText = `${(currentPage - 1) * BOOKS_PER_PAGE + 1} - `;

        if(totalNumberOfBooks < BOOKS_PER_PAGE) {
            lastIndexOfBooks.innerText = `${totalNumberOfBooks} of `;
        } else {
            lastIndexOfBooks.innerText = `${currentPage * BOOKS_PER_PAGE} of `;
        }

        totalBooks.innerText = totalNumberOfBooks;

        setTimeout(() => {
            books.forEach((book) => {
                let singleBook = document.createElement('div');
                singleBook.classList.add('single-book', 'appear');
    
                const imageUrl = book.formats?.['image/jpeg'] || '';
                let authorNames = getAuthorsName(book['authors']);
    
                // <p>${book.id}</p>
                singleBook.innerHTML = `<div class="book-img">
                            <img src="${imageUrl}" alt="${book.title}">
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
        }, 300)
    }

    function getAuthorsName(authors) {
        return authors.map(author => author.name).join(' & ');
    }

    const showPagination = (totalPages) => {
        pagination.innerHTML = '';

        const createPageButton = (page, text = page, isDisabled = false) => {
            const paginationItem = document.createElement('li');

            const button = document.createElement('button');
            button.className = `paginateBtn ${isDisabled ? 'disabled' : ''} ${currentPage === page ? 'active' : ''}`;
            button.innerText = text;

            if (!isDisabled && page) {
                button.addEventListener('click', () => {
                    currentPage = page;
                    loadBooks(currentPage);
                });
            }

            paginationItem.appendChild(button);
            return paginationItem;
        };

        if(totalPages > 1) {
            pagination.appendChild(createPageButton(currentPage - 1, '<', currentPage === 1));
        }
        pagination.appendChild(createPageButton(1, 1, currentPage === 1));

        if(totalPages > 1) {
            if (currentPage > 3) {
                pagination.appendChild(createPageButton(null, '...'));
            }
    
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pagination.appendChild(createPageButton(i));
            }
    
            if (currentPage < totalPages - 2) {
                pagination.appendChild(createPageButton(null, '...'));
            }
    
            pagination.appendChild(createPageButton(totalPages, totalPages, currentPage === totalPages));
            pagination.appendChild(createPageButton(currentPage + 1, '>', currentPage === totalPages));
        }

    };

    const searchBooks = async (search) => {
        try {
            booksList.innerHTML = '';
            booksListWrapper.classList.add('skeleton');
            booksList.classList.add('skeleton');
            booksFindOptions.classList.add('skeleton');
            pagination.classList.add('skeleton');
            
            const url = `${API_URL}?search=${encodeURIComponent(search)}`;
            const res = await fetch(url);
            const data = await res.json();

            let searchResults = data.results.filter(book => 
                book.title.toLowerCase().includes(search.toLowerCase())
            );

            totalNumberOfBooks = searchResults.length;
            currentPage = 1;

            showBooks(searchResults.slice(0, BOOKS_PER_PAGE));
            showPagination(Math.ceil(totalNumberOfBooks / BOOKS_PER_PAGE));
        } catch (error) {
            let errorMsg = document.createElement('p');
            errorMsg.classList.add('errorMsg');
            errorMsg.innerText = error;
        } finally {
            booksListWrapper.classList.remove('skeleton');
            booksList.classList.remove('skeleton');
            booksFindOptions.classList.remove('skeleton');
            pagination.classList.remove('skeleton');
        }
    }

    booksSearch.addEventListener('input', function() {
        let searchText = booksSearch.value.trim();

        stopTyping = false;
        clearTimeout(timer);

        timer = setTimeout(() => {
            stopTyping = true;

            if (stopTyping) {
                if (searchText) {
                    searchBooks(searchText);
                } else {
                    loadBooks(currentPage);
                }
            }
        }, typingInterval);
    });

    loadBooks();
    
});
