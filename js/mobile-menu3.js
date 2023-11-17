jQuery(document).ready(function($) {
    $(document).on('click', '#mobileMenu3', function() {
        $('body').toggleClass("noscroll");
    });
});

function mobileMenu3Click() {
    mobileMenu3 = document.getElementById("mobileMenu3");
    mainMenu = document.getElementById("covers-CoversMobileMenu2-mainMenu");
    body = document.body;

    if (mobileMenu3.classList.contains("covers-CoversHeaderV2-hamburgerButton")) {
        mobileMenu3.classList.remove("covers-CoversHeaderV2-hamburgerButton");
        mobileMenu3.classList.add("covers-CoversHeaderV2-exitButton");
        mainMenu.style.display = "block";
        //body.classList.add("noscroll");
    } else {
        secondLayer = document.getElementById("covers-CoversMobile-2ndlayercontainer");
        mobileMenu3.classList.remove("covers-CoversHeaderV2-exitButton");
        mobileMenu3.classList.add("covers-CoversHeaderV2-hamburgerButton");
        mainMenu.style.display = "none";
        secondLayer.style.display = "none"
        //body.classList.add("noscroll");
        const collection = document.getElementsByClassName("covers-CoversMobileMenu2-subMenu");
        for (let i = 0; i < collection.length; i++) {
            collection[i].style.display = 'none';
        }
        const collection2 = document.getElementsByClassName("covers-CoversMobileMenu2-subMenu2");
        for (let i = 0; i < collection2.length; i++) {
            collection[i].style.display = 'none';
        }

    }
}

function genericExpanderClick(element) {
    var word = element.innerHTML.replace(/ /g, '');
    document.getElementById("covers-CoversMobileMenu2-mainMenu").style.display = 'none';
    document.getElementById("covers-CoversMobileMenu2-subMenu2").style.display = 'none';
    document.getElementById("covers-CoversMobileMenu2-subMenu").style.display = 'block';
    document.getElementById("covers-CoversMobile-2ndlayercontainer").style.display = 'block';
    document.getElementById(word).style.display = 'block';
}

function genericExpander2Click(element) {
    var word = element.innerHTML.replace(/ /g, '');
    document.getElementById("covers-CoversMobileMenu2-mainMenu").style.display = 'none';
    document.getElementById("covers-CoversMobileMenu2-subMenu2").style.display = 'block';
    document.getElementById("covers-CoversMobileMenu2-subMenu").style.display = 'none';
    document.getElementById("covers-CoversMobile-2ndlayercontainer").style.display = 'block';
    document.getElementById(word).style.display = 'block';
}

function backButton3Click() {
    const collection = document.getElementsByClassName("covers-CoversMobileMenu2-subMenu");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.display = 'none';
    }
    document.getElementById("covers-CoversMobileMenu2-subMenu2").style.display = 'none';
    document.getElementById("covers-CoversMobileMenu2-mainMenu").style.display = 'block';
}

function backButton4Click() {
    const collection = document.getElementsByClassName("covers-CoversMobileMenu2-subMenu2");
    for (let i = 0; i < collection.length; i++) {
        collection[i].style.display = 'none';
    }
    document.getElementById("covers-CoversMobileMenu2-subMenu2").style.display = 'none';
    document.getElementById("covers-CoversMobileMenu2-subMenu").style.display = 'block';
}
