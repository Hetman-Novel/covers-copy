// Move the bonus cards outside the folded intro section
var introTextWrapperDivs = document.querySelectorAll(".covers-coversBetting-introTextWrapper div.covers-data-brick-wrapper");
var introTextFirst = document.querySelector(".atf-introText .data-brick-positioner");

for (var i = 0; i < introTextWrapperDivs.length; i++) {
    introTextFirst.appendChild(introTextWrapperDivs[i]);
}