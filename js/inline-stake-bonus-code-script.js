function engagement() {
    var engaged = false;

    setTimeout(function () {
        if (!engaged) {
            engaged = true;

            //insert GA custom event code
            ga('send', 'event', 'engaged', 'engaged user', { 'nonInteraction': 1 });
        }
    }, 30000);

    document.addEventListener('click', function (event) {
        if (!engaged && event.target.closest('a')) {
            engaged = true;

            //insert GA custom event code
            ga('send', 'event', 'engaged', 'engaged user');
        }
    });
}
engagement();

function change_login_button() {
    var quickCheckIDOne = document.getElementById('covers-CoversResponsiveHeader-accountIconId2');
    var quickCheckIDTwo = document.getElementById('covers-MobileMenu-accountsCont');
    var match = document.cookie.match(new RegExp('(^| )loggedIn=(true)'));

    if (match) {
        // Set Styling for account button
        quickCheckIDOne.classList.remove('covers-CoversHeader-responsiveAnon');
        quickCheckIDOne.classList.add('covers-CoversHeader-responsiveAuth');

        quickCheckIDTwo.classList.remove('covers-MobileMenu-accountsCont--anon');
        quickCheckIDTwo.classList.add('covers-MobileMenu-accountsCont--user');
    }
    else {
        quickCheckIDOne.classList.add('covers-CoversHeader-responsiveAnon');
        quickCheckIDOne.classList.remove('covers-CoversHeader-responsiveAuth');

        quickCheckIDTwo.classList.add('covers-MobileMenu-accountsCont--anon');
        quickCheckIDTwo.classList.remove('covers-MobileMenu-accountsCont--user');
    }

    quickCheckIDOne.classList.remove('loginHidden');
}

//Style accounts button if loggedIn cookie is set
function check_login_status() {
    change_login_button();
    $.ajax({
        url: 'https://www.covers.com/account' + '/LoginJson',
        success: function (data) {
            document.cookie = "loggedIn=" + (data != null && data.Authenticated).toString() + ";";
        },
        error: function () {
            document.cookie = 'loggedIn=; max-age=0;';
        },
        complete: function () {
            change_login_button();
        },
        dataType: 'jsonp'
    });
}

window.addEventListener('load', function (event) {
    check_login_status();
});

// Move the bonus cards outside the folded intro section
var introTextWrapperDivs = document.querySelectorAll(".covers-coversBetting-introTextWrapper div.covers-data-brick-wrapper");
var introTextFirst = document.querySelector(".atf-introText .data-brick-positioner");

for (var i = 0; i < introTextWrapperDivs.length; i++) {
    introTextFirst.appendChild(introTextWrapperDivs[i]);
}

function copyToClipboardPromoPage() {
    var displays = document.querySelectorAll(".tooltip-bonus");

    displays.forEach((display) => {
        display.innerHTML = "Copied!";
    });

    navigator.clipboard.writeText($("#promo-code").text());
    var screenWidth = window.innerWidth;

    setTimeout(() => {
        displays.forEach((display) => {
            if (screenWidth >= 585) {
                display.innerHTML = "Click to copy";
            }
            else {
                display.innerHTML = "Tap to copy";
            }
        });
    }, 1200);
}


//READ MORE FOR TIMELINE
const timelineElem = document.querySelector('[id*="-betting-updates"]');
const timelineNodes = timelineElem.parentNode.childNodes;
const timelinePCount = timelineElem.parentElement.querySelectorAll('p').length;
const lowerTimelineThreshold = 6;
const upperTimelineThreshold = 9;
let timelineReadState = true;

const readButton = document.createElement("button");
const readButtonText = document.createTextNode("Read more");
readButton.classList.add("covers-betting-region-timeline-button");
readButton.appendChild(readButtonText);

if (timelinePCount > upperTimelineThreshold) {
    timelineElem.parentElement.appendChild(readButton);
}

function toggleTimelineRead() {
    timelineNodeCount = 0;
    for (let i = 0; i < timelineNodes.length; i++) {
        if (timelineNodes[i].nodeName == "P") {
            timelineNodeCount++;
            if ((timelineNodeCount > lowerTimelineThreshold) && (timelinePCount > upperTimelineThreshold)) {
                timelineNodes[i].style.display = timelineReadState ? "none" : "block";
                readButtonText.nodeValue = timelineReadState ? "Read more" : "Read less";
            }
        }
    }
    timelineReadState = !timelineReadState;
}

readButton.addEventListener("click", () => toggleTimelineRead());
toggleTimelineRead();

var stickyCTAElement = document.querySelector('.coversBetting-review-sticky-CTA-container');
var footerCTAElement = document.querySelector('.Covers-CoversFooter-legal');
var stickyCTAText = document.getElementsByClassName('covers-data-brick-buttonWrapper');
var stickyPromoParent = document.querySelector('.atf-introText');
var potentialStickyPromo = document.querySelector('.covers-data-brick-wrapper');
var stickyCTAAvailable = (stickyCTAText[0].textContent !== 'Not Available in This Region');

// Promos can exist anywhere on the page, but we only want to find the one in the intro section
if (stickyPromoParent.contains(potentialStickyPromo)) {
    if (stickyCTAAvailable) {
        var stickyCTATopBlockObserver = new IntersectionObserver(function (entries) {
            if (entries[0]['isIntersecting'] === true) {
                stickyCTAElement.style.display = "none";
            }
            else {
                stickyCTAElement.style.display = "flex";
            }
        }, { root: null });

        stickyCTATopBlockObserver.observe(document.querySelector(".atf-introText"));
        var stickyCTAObserver = new IntersectionObserver(function (entries) {
            if (entries[0]['isIntersecting'] === true) {
                footerCTAElement.style.marginBottom = "72px";
            }
            else {
                footerCTAElement.style.marginBottom = "auto";
            }
        }, { root: null });
            stickyCTAObserver.observe(document.querySelector(".coversBetting-review-sticky-CTA-container"));
    }
}