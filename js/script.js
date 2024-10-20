
document.addEventListener('DOMContentLoaded', function () {

    let headerArea = document.querySelector('.header-area');

    let scrollToTop = document.querySelector('.scrollToTop');

    let skeletons = document.querySelectorAll('.skeleton');

    let wishlistCountNumber = document.querySelector('.wishlist-count-btn span');

    wishlistCountNumber.innerText = JSON.parse(localStorage.getItem('wishListBooksData'))?.length || 0;

    skeletons.forEach(skeleton => {
        skeleton.classList.remove('skeleton');
    });

    window.addEventListener('scroll', function() {
        if(window.scrollY > 1) {
            headerArea.classList.add('sticky');
            scrollToTop.classList.add('show');
        } else {
            headerArea.classList.remove('sticky');
            scrollToTop.classList.remove('show');
        }
    })

    scrollToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })

       
});
