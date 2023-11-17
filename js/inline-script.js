
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

function toggleFaqArrow(e) {
    if (!$(e).hasClass("faq-open")) {
        $(e).find(".faq-caret").toggleClass("faq-open");
        $(e).find(".hiddenSpan").toggleClass("hideFAQtoggle");
    }
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

function copyToClipboard(toCopy) {
    var displays = document.querySelectorAll(".tooltip-bonus");
    displays.forEach((display) => {
        display.innerHTML = "Copied!";
    });

    navigator.clipboard.writeText(toCopy);
    var screenWidth = window.innerWidth;
    setTimeout(() => {
        displays.forEach((display) => {
            if (screenWidth >= 585) {
                display.innerHTML = "Click to copy";
            }
            else
            {
                display.innerHTML = "Tap to copy";
            }
        });
    }, 1200);
}

(function($) {

    var region = "US";
    var geoCookieName = "UserCountryCode";
    var wtpUrl = "https://www.covers.com/betting/GetUserCountryCode";

    // Look for country code switcher in URL
    var results = new RegExp('[\?&]countrycode=([^&#]*)', 'i').exec(window.location.href);
    var paramFound = (results !== null && results !== undefined && results.length > 0) ? true : false;

    // If no parameter, look for Cookie
    if (!paramFound) {

        try {
            // EXIT if we have a cookie
            var countryCode = $.cookie(geoCookieName); // jquery.cookie.js

            if (countryCode != null) {
                hideShowGeoContent(countryCode);
                return;
            }
        } catch (error) {
        }
    }
    else {
        wtpUrl = wtpUrl + "?countrycode=" + results[1];
    }

    // If there is no country code, WTP determines user's country by IP
    $.ajax({
        url: wtpUrl,
        dataType: "json",
        success: function (data) {
            region = data;
            var date = new Date();
            var minutes = 60;
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            $.cookie(geoCookieName, region, { expires: date, path: '/', domain: 'covers.com', secure: 'secure', samesite: 'strict' });
        },
        complete: function() {
            hideShowGeoContent(region);
        }
    });

    function hideShowGeoContent(country) {
        if (country.toUpperCase() === "US") {
            $(".cmg_geocontent_us").show();
        }
        else if (country.toUpperCase() === "CA") {
            $(".cmg_geocontent_ca").show();
        }
        else {
            $(".cmg_geocontent_zz").show();
        }
    }
})(jQuery);

// Move the bonus cards outside the folded intro section
var introTextWrapperDivs = document.querySelectorAll(".covers-coversBetting-introTextWrapper div.covers-data-brick-wrapper");
var introTextFirst = document.querySelector(".atf-introText .data-brick-positioner");

for (var i = 0; i < introTextWrapperDivs.length; i++) {
    introTextFirst.appendChild(introTextWrapperDivs[i]);
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

var cmsDefaultSort = 'default';

function sendAdobeEvent(filterCategory, componentValue) {
    var componentEvent = new CustomEvent('componentInteraction', {bubbles: true, detail: { componentName: "Toplist Filter", componentOption: "Filter by " + filterCategory, componentValue: componentValue, componentType: "Checkbox", interactionType: "Select", componentLocation: "Not Applicable"}});
    window.dispatchEvent(componentEvent);
}