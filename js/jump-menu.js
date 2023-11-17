$("#jumpMenu").click(function () {
    if (document.getElementById("MobileJumpNav").style = "display none") {
        $("#MobileJumpNav").toggle(true);
    }
});

$("#MobileJumpNav").click(function () {
    $("#MobileJumpNav").toggle(false);
});

function calcHeight() {
    $("#covers-CoversBetting-asideContent").css("height", ($("#covers-CoversBetting-aux-mainContent").height()));
}

$(document).ready(function () {
    calcHeight();
    setTimeout(function () { calcHeight(); }, 1000);
    setTimeout(function () { calcHeight(); }, 2000);
    setTimeout(function () { calcHeight(); }, 5000);
    setTimeout(function () { calcHeight(); }, 10000);

});

window.addEventListener('resize', function () {
    calcHeight();
});

// Variable for updating sidebar
var sidebarSectionLinkWithColorClass = "";

var waitForJQuery = setInterval(function () {
if (typeof $ != 'undefined') {

    //If sidebar exists clone into the mobile jump nav dropdown and display
    if ($('.covers-CoversBetting-sidebarBlock').length) {
        var $linkList = $('#covers-CoversBetting-sidebarLinkCon ul li').clone();
        $('#MobileJumpNav').html($linkList);
        $('#covers-CoversBetting-jumpMenu').css("display", "block");
    }

    findCurrentSectionIndex();
    clearInterval(waitForJQuery);
}
}, 1000);

function getCurrentLocationOnPage(section) {
    var isThisMyCurrentSection = document.getElementById(section).getBoundingClientRect().y;
    return isThisMyCurrentSection;
}

var initialSidebarHeightCalculated = false;

document.addEventListener('scroll', function () {
    findCurrentSectionIndex();
});

function findCurrentSectionIndex() {
    var leftPos = 0;
    var rightPos = (arrayOfSidebarLinks.length - 1);
    var middlePos = 0;

    while (true) {
        middlePos = Math.floor(((rightPos + leftPos) / 2));
        currentItem = arrayOfSidebarLinks[middlePos];
        currentItemDistanceFromTop = getCurrentLocationOnPage(currentItem);

        if (currentItemDistanceFromTop > 2) {
            rightPos = middlePos;
        } else {
            leftPos = (middlePos + 1);
        }

        if (leftPos == rightPos) {

            // Special check for middlePos 0
            if (middlePos == 0) {
                // Item is actually page heading (above all sections)
                if (currentItemDistanceFromTop > 2) {
                    updateCurrentSidebarLocation(-1);
                    break;
                }
                // Item is first section item
                else {
                    updateCurrentSidebarLocation(middlePos);
                    break;
                }
            }
            // Else, middlePos is not 0
            else {

                if (currentItemDistanceFromTop <= 2) {

                    var leftPosItem = arrayOfSidebarLinks[leftPos];
                    var leftPosItemDistanceFromTop = getCurrentLocationOnPage(leftPosItem);

                    if (leftPosItemDistanceFromTop <= 2) {
                        updateCurrentSidebarLocation(leftPos);
                        break;
                    }

                    updateCurrentSidebarLocation(middlePos);
                    break;
                }

                updateCurrentSidebarLocation(leftPos - 1);
                break;
            }

            break;
        }
    }
}

function updateCurrentSidebarLocation(currSectionIndex) {

    if (currSectionIndex == -1) {
        currSectionIndex = 99;
    }

    var sidebarLinkToChangeColorOfDesktop = document.querySelectorAll('.sidebar-section-link-' + currSectionIndex)[1].classList;
    var sidebarLinkToChangeColorOfMobile = document.querySelectorAll('.sidebar-section-link-' + currSectionIndex)[0].classList;

    // If the last sidebar link has been set
    if (sidebarSectionLinkWithColorClass != "") {
        if (sidebarSectionLinkWithColorClass != sidebarLinkToChangeColorOfDesktop) {
            // Remove the color from the old class
            sidebarSectionLinkWithColorClass.remove("sectionCurrentlyBeingViewed");
            // REMOVE FROM DESKTOP AND MOBILE
            document.querySelectorAll("." + sidebarSectionLinkWithColorClass)[1].classList.remove("sectionCurrentlyBeingViewed");
            document.querySelectorAll("." + sidebarSectionLinkWithColorClass)[0].classList.remove("sectionCurrentlyBeingViewed");
            // Set the class of the new current section index
            sidebarSectionLinkWithColorClass = sidebarLinkToChangeColorOfDesktop;
            // Add the color to the new class
            sidebarLinkToChangeColorOfDesktop.add("sectionCurrentlyBeingViewed");
            sidebarLinkToChangeColorOfMobile.add("sectionCurrentlyBeingViewed");
        }
    }
    // Sidebar hasn't been updated, add class to set initial values
    else {
        sidebarSectionLinkWithColorClass = sidebarLinkToChangeColorOfDesktop;
        sidebarLinkToChangeColorOfDesktop.add("sectionCurrentlyBeingViewed");
        sidebarSectionLinkWithColorClass = sidebarLinkToChangeColorOfMobile;
        sidebarLinkToChangeColorOfMobile.add("sectionCurrentlyBeingViewed");
    }

    // Update Mobile JumpMenu Text
    document.querySelector(".MobileJumpMenuText").innerText = document.querySelectorAll('.sidebar-section-link-' + currSectionIndex)[1].innerText;
}

const el = document.querySelector(".coversMobileJumpMenuTrigger");
const coversMobileJumpMenu = document.querySelector(".coversMobileJumpMenu");
const observer = new IntersectionObserver(([e]) => coversMobileJumpMenu.classList.toggle("is-pinned", (e.intersectionRatio < 1) && (getCurrentLocationOnPage('jumpMenuTopDistance') < 120)), { threshold: [1] });

observer.observe(el);
var arrayOfSidebarLinks = [];

$(document).ready(function () {
    dynamicSidebarList("covers-CoversBetting-mainContent", "h2", "covers-DynamicSidebarList");
});

function dynamicSidebarList(targetID, targetElement, destinationID) {

    var destinationElement = document.getElementById(destinationID);
    var sectionHeadings = document.getElementById(targetID).getElementsByTagName(targetElement);
    for (var i = 0; i < sectionHeadings.length; i++) {
        var sidebarOverrideValue = sectionHeadings[i].getAttribute('value');
        var sidebarAnchorLink = sectionHeadings[i].previousElementSibling.id;

        if (sidebarOverrideValue != undefined) {
            dynamicSidebarListItemHelper("#" + sidebarAnchorLink, sidebarOverrideValue, i, destinationElement);
            arrayOfSidebarLinks.push(sidebarAnchorLink);
        } else {
            dynamicSidebarListItemHelper("#" + sidebarAnchorLink, sectionHeadings[i].innerHTML, i, destinationElement);
            arrayOfSidebarLinks.push(sidebarAnchorLink);
        }

    }

    if ($('.covers-CoversBetting-sidebarBlock').length) {
        var $linkList = $('#covers-CoversBetting-sidebarLinkCon ul li').clone();
        $('#MobileJumpNav').html($linkList);
        $('#covers-CoversBetting-jumpMenu').css("display", "block");
    }

    findCurrentSectionIndex();
}

function dynamicSidebarListItemHelper(anchorHref, anchorText, sidebarSection, destinationElement) {
    const listItemLiTag = document.createElement("li");
    const listItemATag = document.createElement("a");
    const listItemSpanTag = document.createElement("span");

    const listItemAnchorText = document.createTextNode(anchorText); 
    listItemATag.href = anchorHref; 
    listItemATag.classList.add("sidebar-section-link-" + sidebarSection); 

    listItemLiTag.appendChild(listItemATag); 
    listItemATag.appendChild(listItemSpanTag); 
    listItemATag.appendChild(listItemAnchorText); 

    destinationElement.appendChild(listItemLiTag);
}