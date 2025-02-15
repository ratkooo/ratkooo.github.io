// JavaScript to handle menu toggle for mobile and hover functionality for desktop
document.addEventListener('DOMContentLoaded', function () {
    const burgerButton = document.getElementById('burgerButton');
    const closeButton = document.getElementById('closeButton');
    const slidingMenu = document.getElementById('slidingMenu');
    const body = document.body;

    let isMobileMenuOpen = false;

    // Handle black burger button click for mobile view to open the menu
    burgerButton.addEventListener('click', function () {
        if (window.innerWidth <= 1024) {
            slidingMenu.classList.toggle('translate-x-full');
            slidingMenu.classList.toggle('opacity-0');
            isMobileMenuOpen = !isMobileMenuOpen;
            burgerButton.classList.toggle('text-white', isMobileMenuOpen);
        }
    });

    // Handle white "X" button click inside menu to close the menu
    closeButton.addEventListener('click', function () {
        if (window.innerWidth <= 1024) {
            slidingMenu.classList.add('translate-x-full');
            slidingMenu.classList.add('opacity-0');
            isMobileMenuOpen = false;
            burgerButton.classList.remove('text-white');
        }
    });

    // Close mobile menu if window is resized
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024 && isMobileMenuOpen) {
            slidingMenu.classList.add('translate-x-full');
            slidingMenu.classList.add('opacity-0');
            isMobileMenuOpen = false;
            burgerButton.classList.remove('text-white');
        }
    });

    // Handle hover for desktop view (min-width: 1024px)
    burgerButton.addEventListener('mouseenter', function () {
        if (window.innerWidth > 1024) {
            slidingMenu.classList.remove('translate-x-full');
            slidingMenu.classList.remove('opacity-0');
        }
    });

    // Close the menu when the cursor leaves the menu (desktop view)
    slidingMenu.addEventListener('mouseleave', function () {
        if (window.innerWidth > 1024) {
            slidingMenu.classList.add('translate-x-full');
            slidingMenu.classList.add('opacity-0');
        }
    });
});