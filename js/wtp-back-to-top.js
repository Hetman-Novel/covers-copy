mybutton = document.getElementById("wtpBackToTop");

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function toggleFaqArrow(e) {
    if (!$(e).hasClass("faq-open")) {
        $(e).find(".faq-caret").toggleClass("faq-open");
        $(e).find(".hiddenSpan").toggleClass("hideFAQtoggle");
    }
}