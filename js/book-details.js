document.addEventListener('DOMContentLoaded', async () => {
    let bookDetailsContent = document.querySelector('.book-details-content');
    let singleBookImg = document.querySelector('.singleBookImg');
    let bookNumber = document.querySelector('.bookNumber');
    let bookTitle = document.querySelector('.bookTitle');
    let bookAuthor = document.querySelector('.bookAuthor');
    let bookSubjects = document.querySelector('.bookSubjects');

    const queryParams = new URLSearchParams(window.location.search);
    const bookID = queryParams.get('id');

    let formatedBookId = bookID.toString().padStart(5, 0);

    if (bookID) {
        try {
            bookDetailsContent.classList.add('skeleton');
            const res = await fetch(`https://gutendex.com/books/${bookID}`);
            const book = await res.json();

            bookNumber.innerText = `ZEPTO${formatedBookId}`;
            bookTitle.innerText = book.title;
            singleBookImg.src = book.formats?.['image/jpeg'] || '';
            bookAuthor.innerText = `Authors: ${book.authors.map(author => author.name).join(', ')}`;
            bookSubjects.innerText = `Categories: ${book.subjects.join(', ')}`;
        } catch (error) {
            window.location.href="index.html";
        } finally {
            bookDetailsContent.classList.remove('skeleton');
        }
    }

});