document.addEventListener('DOMContentLoaded', function () {

    let booksListWrapper = document.querySelector('.books-list-wrapper');
    let booksList = document.querySelector('.books-list');

    let wishlistBooks = JSON.parse(localStorage.getItem('wishListBooksData'));

    const loadWishlistBooks = () => {
        booksList.innerHTML = '';
        if(!wishlistBooks || wishlistBooks?.length === 0) {
            let msg = document.createElement('p');
            msg.classList.add('no-wishlist-msg')
            msg.innerText = 'You haven\'t added any books to the wishlist yet! 🥲';
            booksListWrapper.appendChild(msg);
        } else {
            wishlistBooks.forEach((book) => {
                let singleBook = document.createElement('div');
                singleBook.classList.add('single-book', 'appear');
    
                // <p>${book.id}</p>
                singleBook.innerHTML = `<div class="book-img">
                        <img src="${book.img}" alt="${book.title}">
                    </div>
                    <div class="book-content">
                        <h3>
                            <a href="book-details.html?id=${book.id}">${book.title}</a>
                        </h3>
                        <ul class="book-info-list">
                            <li>Author: <span class="author-name">${book.author}</span></li>
                            <li>Genre: <span class="genre-name">${book.genre}</span></li>
                        </ul>
                        <div>
                            <a href="#" class="addWishlistBtn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f00" stroke="#f00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </a>
                            <input type="hidden" value="${book.id}">
                        </div>
                    </div>`;
                booksList.appendChild(singleBook);
            });
    
            let removeBtns = document.querySelectorAll('.addWishlistBtn');
            
            removeBtns.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    let bookId = parseInt(btn.nextElementSibling.value);
                    wishlistBooks = wishlistBooks.filter(book => book.id !== bookId);
                    localStorage.setItem('wishListBooksData', JSON.stringify(wishlistBooks));
                    window.location.reload();
                });
            });
    
        }
    }

    loadWishlistBooks();
           
});