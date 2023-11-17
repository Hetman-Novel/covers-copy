function toggleFaqArrow(e) {
    if (!$(e).hasClass("faq-open")) {
        $(e).find(".faq-caret").toggleClass("faq-open");
        $(e).find(".hiddenSpan").toggleClass("hideFAQtoggle");
    }
}