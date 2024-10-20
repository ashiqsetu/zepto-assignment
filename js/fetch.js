
document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://gutendex.com/books';
    let booksListWrapper = document.querySelector('.books-list-wrapper');
    let booksList = document.querySelector('.books-list');

    let booksFindOptions = document.querySelector('.books-find-options');
    let booksSearch = document.querySelector('.booksSearch');

    let firstIndexOfBooks = document.querySelector('.firstIndexOfBooks');
    let lastIndexOfBooks = document.querySelector('.lastIndexOfBooks');
    let totalBooks = document.querySelector('.totalBooks');

    let genreFilter = document.querySelector('.genre-filter');

    let currentPage = 1;
    const BOOKS_PER_PAGE = 32;
    let totalNumberOfBooks = 0;

    let pagination = document.querySelector('.pagination');

    let skeletons = document.querySelectorAll('.skeleton');

    let timer;
    let typingInterval = 2000;
    let stopTyping = false;

    let wishlistCountBtn = document.querySelector('.wishlist-count-btn');
    let wishlistCountNumber = document.querySelector('.wishlist-count-btn span');
    let wishListBooksData = JSON.parse(localStorage.getItem('wishListBooksData')) || [];

    const loadBooks = async (page = 1) => {
        booksList.innerHTML = '';

        try {
            addSkeleton();

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
            booksList.appendChild(errorMsg);
            return;
        } finally {
            skeletons.forEach(skeleton => {
                skeleton.classList.remove('skeleton');
            });
            removeSkeleton();
        }
    }

    const showBooks = (books) => {
        firstIndexOfBooks.innerText = `Showing ${(currentPage - 1) * BOOKS_PER_PAGE + 1} - `;

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
                                <a href="book-details.html?id=${book.id}">${book.title}</a>
                            </h3>
                            <ul class="book-info-list">
                                <li>Author: <span class="author-name">${authorNames}</span></li>
                                <li>Genre: <span class="genre-name">${book.subjects[0]}</span></li>
                            </ul>
                            <div>
                                <a href="#" class="addWishlistBtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d6b161" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                </a>
                                <input type="hidden" value="${book.id}">
                            </div>
                        </div>`;
                booksList.appendChild(singleBook);
                changeWishListIconColor(singleBook, book.id);
            });

            let addWishlistBtn = document.querySelectorAll('.addWishlistBtn');
            addWishlistBtn.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    let booksId = parseInt(btn.nextElementSibling.value);
                    let parentElement = btn.parentElement.parentElement.parentElement;

                    let booksData = {
                        id: booksId,
                        img: parentElement.querySelector('img').src,
                        title: parentElement.querySelector('h3 a').innerText,
                        author: parentElement.querySelector('.author-name').innerText,
                        genre: parentElement.querySelector('.genre-name').innerText
                    }

                    let existingBookIndex = wishListBooksData.findIndex(book => book.id === booksId);

                    if(existingBookIndex !== -1) {
                        wishListBooksData.splice(existingBookIndex, 1);
                        localStorage.setItem('wishListBooksData', JSON.stringify(wishListBooksData));
                    } else {
                        wishListBooksData.push(booksData);
                        localStorage.setItem('wishListBooksData', JSON.stringify(wishListBooksData));

                        // Image animation for adding a book to wishlist
                        let targetParent = btn.parentElement.parentElement.parentElement;
                        targetParent.style.zIndex = "100";

                        let img_clone = targetParent.querySelector('img');
                        let flyingImg = img_clone.cloneNode();
                        flyingImg.classList.add('flying-img');

                        targetParent.appendChild(flyingImg);

                        const flyingImgPosition = flyingImg.getBoundingClientRect();
                        const wishlistCountBtnPosition = wishlistCountBtn.getBoundingClientRect();

                        let data = {
                            left: wishlistCountBtnPosition.left - (wishlistCountBtnPosition.width / 2 + flyingImgPosition.left + flyingImgPosition.width / 2),
                            top: wishlistCountBtnPosition.bottom - flyingImgPosition.bottom + 100
                        }

                        flyingImg.style.left = '0px';
                        flyingImg.style.top = '0px';
                        flyingImg.style.setProperty('--left', `${data.left.toFixed(2)}px`);
                        flyingImg.style.setProperty('--top', `${data.top.toFixed(2)}px`);

                        setTimeout(() => {
                            targetParent.style.zIndex = "";
                            targetParent.removeChild(flyingImg);
                        }, 1000);
                        
                    }
                    setTimeout(() => {
                        wishlistCountNumber.innerText = JSON.parse(localStorage.getItem('wishListBooksData'))?.length;
                    }, 1000);
                    changeWishListIconColor(parentElement, booksId);
                })
            })
        }, 300)
    }

    function changeWishListIconColor(singleBook, bookID) {
        let svg = singleBook.querySelector('svg');
        if(wishListBooksData.find(book => book.id === bookID)) {
            svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f00" stroke="#f00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
        } else {
            svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d6b161" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
        }
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

    // Filter books by genre 
    const filterBooks = async (genre) => {
        try {
            booksList.innerHTML = '';
            addSkeleton();
            
            const url = `${API_URL}?topic=${encodeURIComponent(genre)}`;
            const res = await fetch(url);
            const data = await res.json();

            let filterResults = data.results.filter(book => 
                book.bookshelves.some(subject =>
                    subject.toLowerCase().includes(genre.toLowerCase())
                )
            );

            totalNumberOfBooks = filterResults.length;
            currentPage = 1;

            showBooks(filterResults.slice(0, BOOKS_PER_PAGE));
            showPagination(Math.ceil(totalNumberOfBooks / BOOKS_PER_PAGE));
        } catch (error) {
            let errorMsg = document.createElement('p');
            errorMsg.classList.add('errorMsg');
            errorMsg.innerText = error;
            booksList.appendChild(errorMsg);
        } finally {
            removeSkeleton();
        }
    }

    genreFilter.addEventListener('change', () => {
        currentPage = 1;
        const selectedGenre = genreFilter.value;
        if (selectedGenre) {
            filterBooks(selectedGenre);
        } else {
            loadBooks(currentPage);
        }
    });

    // Books search 
    const searchBooks = async (search) => {
        try {
            booksList.innerHTML = '';
            addSkeleton();
            
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
            booksList.appendChild(errorMsg);
        } finally {
            removeSkeleton();
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

    const addSkeleton = () => {
        booksListWrapper.classList.add('skeleton');
        booksList.classList.add('skeleton');
        booksFindOptions.classList.add('skeleton');
        pagination.classList.add('skeleton');
    }

    const removeSkeleton = () => {
        booksListWrapper.classList.remove('skeleton');
        booksList.classList.remove('skeleton');
        booksFindOptions.classList.remove('skeleton');
        pagination.classList.remove('skeleton');
    }

    loadBooks();
    
});
