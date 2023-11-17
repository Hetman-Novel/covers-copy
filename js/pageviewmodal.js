/**
 * For CC-449
 * Modal that displays after a certain number of page views.
 * Modal displays an embedded Hubspot form for email collection, and cannot be 
 * dismissed without completing the form.
 * 
 * Page view data is stored in a cookie. Cookie can track page views on different
 * areas of the site independently (Ex: article views will increment separately from free pick views)
 * 
 * There is also a page footer where users can see the number of page views remaining,
 * and have the option to activate the modal early. In this case, the modal is dismissable.
 */

var pageViewModal = {

    // Covers host address (environment)
    host: "",
    // Accounts host address
    accountsHost: "",
    // Controls which version of the modal will load
    experimentVersion: 0,
    // Number of page views before modal will display
    maxPageViews: 3,
    // Flag indicating if the user is logged in
    loggedIn: "",
    // Name of the cookie being used to track page views
    signupCookieName: "pageviewmodal",
    //// name of te login cookie
    //loginCookieName: "loggedIn",
    // Key for the "Form Submitted" flag in the cookie
    formSubmittedKey: "formsubmitted",
    // Form Id for the modal
    formId: "6ae6de74-6b93-474f-9a83-e33c17febe94",
    // Id of the form wrapper (Hubspot forms will load here)
    formWrapperId: "#signup-modal-body",
    // Id for the modal (run bootstrap modal javascript on this element)
    modalId: "#signupModal",
    // Wrapper Id for the modal and footer markup
    modalWrapper: "pageViewModalWrapper",
    // Id for the "remaining page views" footer
    signupFooterLink: "signup-footer-wrapper",
    // Id of the article count span in the footer
    pageCountNumber: "footer-article-count",
    // Id of the article text in the footer (to make it singular/plural)
    pageCountText: "footer-article-text",
    // Id for the optional "Close" button
    closeButton: "signup-modal-dismiss",
    // Id for the hidden submit button (used to fire Adobe Connector event)
    accFormSubmitButton: "acc-form-submitted",
    // Id for the submit button (Hubspot form)
    submitButtonId: ".hs-button.primary.large",
    // Specific paths that will be excluded from the signup modal
    excludedPaths: [
        "/nfl/super-bowl", "/nfl/super-bowl/odds", "/nfl/super-bowl/props", "/nfl/super-bowl/props/player-props", "/nfl/super-bowl/props/national-anthem", "/nfl/super-bowl/props/coin-toss", "/nfl/super-bowl/props/halftime-bets", "/nfl/super-bowl/props/gatorade-color", "/nfl/super-bowl/props/cross-sport-props", "/nfl/super-bowl/mvp-odds", "/nfl/super-bowl/squares", "/nfl/super-bowl/biggest-bets", "/nfl/super-bowl/how-to-bet",
        "/nba/finals/", "/nba/finals/odds", "/nba/finals/mvp-odds",
        "/nhl/stanley-cup", "/nhl/stanley-cup/odds", "/nhl/stanley-cup/conn-smythe-trophy-odds",
        "/mlb/world-series", "/mlb/world-series/odds", "/mlb/world-series/mvp-odds",
        "/ncaab/march-madness", "/ncaab/march-madness/odds", "/ncaab/march-madness/picks", "/ncaab/march-madness/bracket", "/ncaab/march-madness/bracket-prediction", "/ncaab/march-madness/how-to-fill-out-bracket", "/ncaab/march-madness/best-bracket-contests", "/ncaab/march-madness/props/mvp-odds", "/ncaab/march-madness/props", "/ncaab/march-madness/trends", "/ncaab/march-madness/upsets", "/ncaab/march-madness/how-to-bet"
    ],

    // Initialize the modal script
    // @param  {string} host: Covers Root host name
    // @param  {number} experimentVersion: Toggles which modal version to display. If 0, stops execution
    initModalScript: function ({ host = "", accountsHost = "", experimentVersion = 0 }) {
        // Validate params. Check for version 0 (no modal)
        if (host == undefined || host == "") return;
        pageViewModal.host = host;
        pageViewModal.accountsHost = accountsHost;

        // enable experiment for non articles
        var pathKey = pageViewModal._getPathKey();
        if (pathKey != 'article') {
            const params = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop),
            });
            let version = params.experimentVersion;

            if (version)
                pageViewModal.experimentVersion = parseInt(version);
            else
                pageViewModal.experimentVersion = experimentVersion;
        }

        // execute modal only if pathKey is available
        if (pathKey == 'article' || (pathKey == 'mlb' && pageViewModal.experimentVersion > 2)) {
            // Get user's logged in status
            pageViewModal.getLoggedIn(function () {
                // Get markup and styles for the modal
                pageViewModal.getModalContent(function () {
                    // Get the Hubspot script. The "readyState" check insures this won't be called before DOMContentLoaded
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', pageViewModal.loadHubspotScript());
                    } else {
                        pageViewModal.loadHubspotScript();
                    }
                });
            });
        }
    },
    // Get cookie value
    // @param  {string} name: Cookie name
    // @return {string}     Cookie value
    _getCookie: function (name) {
        var returnVal = null;
        // login cookies are being set incorrectly, so we need a hack
        var loginArray = [];
        var cookieArr = document.cookie.split(";");
        for (let i = 0; i < cookieArr.length; i++) {
            var cookiePair = cookieArr[i].split("=");
            if (name == pageViewModal.loginCookieName && name == cookiePair[0].trim()) {
                loginArray.push(decodeURIComponent(cookiePair[1].trim()))
            }
            else if (name == cookiePair[0].trim()) {
                returnVal = decodeURIComponent(cookiePair[1].trim());
                break;
            }
        }
        if (name == pageViewModal.loginCookieName) {
            returnVal = loginArray.includes("true") ? "true" : "false";
        }
        return returnVal;
    },
    // Set cookie value
    // @param  {string} name: Cookie name
    // @param  {string} value: Cookie value
    // @param  {number} daysToLive: Duration of the cookie (days).
    _setCookie: function (name, value, daysToLive) {
        var cookie = name + "=" + encodeURIComponent(value);
        cookie += ";max-age=" + (daysToLive * 24 * 60 * 60) + ";path=/";
        document.cookie = cookie;
    },
    // Checks path, gets the key used to store page view data for the current page (as key/value pair).
    // @return  {string}    Page view data key. Returns empty string if page views aren't tracked on current page
    _getPathKey: function () {
        var pathKey = "";
        var leaguePaths = ["nfl", "ncaaf", "nba", "ncaab", "mlb", "nhl", "wnba", "cfl", "ufc", "soccer", "pga", "f1"];
        var industryPaths = ["politics", "entertainment"];
        var otherPaths = ["picks", "sport", "sports"];
        var validPathList = leaguePaths.concat(industryPaths).concat(otherPaths);
        var path = window.location.pathname;
        var pathArray = path.split("/").filter((x) => x != "").map((x) => x.toLowerCase());
        // Test for valid path.
        if (pathArray.length > 0 && validPathList.includes(pathArray[0])) {
            var isArticlePath = leaguePaths.concat(industryPaths).includes(pathArray[0]);
            // Exclude betting news pages (ex: /nfl/betting-news)
            if (isArticlePath && pathArray.length == 2 && pathArray[1] == "betting-news") pathKey = "";
            // Exclude specific pages we don't want to wall off
            else if (pageViewModal.isExcludedPath(path)) pathKey = "";
            // Everything else with more than one path segment should be editorial content (disabled)
            else if (isArticlePath && pathArray.length > 1)
                pathKey = "";
            else
                pathKey = leaguePaths.find(i => pathArray.includes(i));
        }
        return pathKey;
    },
    // Checks path against a list of url paths that are excluded from page view tracking
    // @param  {string} path: Path of the current page
    // @return  {boolean}   True if path matched anything in the excluded path list
    isExcludedPath: function (path) {
        var isExcludedPath = false;
        for (let excludedPath of pageViewModal.excludedPaths) {
            if (excludedPath == path) {
                isExcludedPath = true;
                break;
            }
        }
        return isExcludedPath;
    },
    // Gets the value of the signup cookie, and maps it to the properties of an object
    // @param  {string} name: Cookie name
    // @return  {Object}   Cookie value, as an object
    getSignupCookieData: function (name) {
        var cookieData = {};
        var cookie = pageViewModal._getCookie(name);
        if (cookie) {
            cookieString = decodeURIComponent(cookie);
            cookieData = Object.fromEntries(cookieString.split(",").map(s => s.split(':')));
        }
        return cookieData;
    },
    // Converts an object containing signup cookie data into a string, and sets the cookie
    // @param  {string} name: Cookie name
    // @param  {Object} cookieData: Cookie data, mapped to an object
    // @param  {number} daysToLive: Duration of the cookie (in days)
    updateSignupCookie: function (name, cookieData, daysToLive) {
        var cookieString = Object.keys(cookieData).map((key) => "" + key + ":" + cookieData[key]).join(",");
        cookieString = encodeURIComponent(cookieString);
        pageViewModal._setCookie(name, cookieString, daysToLive);
    },
    // Checks the data in the signup cookie to determine if/how the modal should be displayed on the page
    checkSignupCookie: function () {
        var cookieDuration = 30; // Days
        var signupCookieData = pageViewModal.getSignupCookieData(pageViewModal.signupCookieName);
        var loginCookieValue = pageViewModal.loggedIn;
        // Check if user is logged in, or has submitted the form
        if (loginCookieValue == "true" || pageViewModal.formSubmittedKey in signupCookieData) {
            return;
        }
        // pathKey is empty if modal should not appear on this page
        var pathKey = pageViewModal._getPathKey();
        if (pathKey == 'article' || (pathKey == 'mlb' && pageViewModal.experimentVersion > 2)) {
            var pageViews = pathKey in signupCookieData ? parseInt(signupCookieData[pathKey]) : 0;
            if (pageViews >= pageViewModal.maxPageViews) {
                // If page views > max, display the modal (can only be dismissed on submit)
                pageViewModal.displayModal();
            } else {
                // If page views < max, display the article count footer
                var newPageViews = pageViews + 1;
                signupCookieData[pathKey] = (newPageViews).toString();
                pageViewModal.updateSignupCookie(pageViewModal.signupCookieName, signupCookieData, cookieDuration);
                pageViewModal.showPageCount(newPageViews);
                pageViewModal.togglePageViewFooter("show");
            }
        }
    },
    // Updates the signup cookie to show that the form has been submitted
    setFormSubmitted: function () {
        var signupCookieData = pageViewModal.getSignupCookieData(pageViewModal.signupCookieName);
        signupCookieData[pageViewModal.formSubmittedKey] = "true";
        pageViewModal.updateSignupCookie(pageViewModal.signupCookieName, signupCookieData, 30);

        $(pageViewModal.modalId).modal("hide");
        // Fires click event on the hidden Adobe Connector button
        document.getElementById(pageViewModal.accFormSubmitButton).click();
    },
    // Updates the number of remaining page views displayed on the footer
    // @param  {number} pageCount: Current # of page views
    showPageCount: function (pageCount) {
        var remainingPages = pageViewModal.maxPageViews - pageCount;
        var pageCount = document.getElementById(pageViewModal.pageCountNumber);
        pageCount.textContent = remainingPages;
        // If 1 article left, update the "articles" text in the footer
        if (remainingPages == 1) {
            var pageCountText = document.getElementById(pageViewModal.pageCountText);
            pageCountText.textContent = "article";
        }
    },
    // Gets the markup from the server and appends it to the page
    // @param  {Function} callback: Code to run after the modal has been appended to the body
    getModalContent: function (callback) {
        var url = `${pageViewModal.host}/signup/pageviewmodal?experimentVersion=${pageViewModal.experimentVersion}`;
        fetch(url).then((resp) => { return resp.text() }).then((text) => {
            if (text != null && text != "") {
                var wrapper = document.createElement("div");
                wrapper.setAttribute("id", pageViewModal.modalWrapper);
                wrapper.innerHTML = text;
                document.body.appendChild(wrapper);
                // Display page count footer if the "close" button is clicked
                var closeButton = document.getElementById(pageViewModal.closeButton);
                closeButton.addEventListener('click', function () {
                    pageViewModal.togglePageViewFooter();
                });

                if (callback != null) {
                    callback();
                }
            }
        });
    },
    // Gets the user's login status
    // @param  {Function} callback: Code to run after the login status is retrieved
    getLoggedIn: function (callback) {
        var url = pageViewModal.accountsHost + "/LoginJson";
        $.ajax({
            url: url,
            success: function (data) {
                pageViewModal.loggedIn = (data != null && data.Authenticated).toString();
                if (callback != null) {
                    callback();
                }
            },
            dataType: 'jsonp'
        });
    },
    // Conditionally loads Hubspot script, then continues running the modal script
    loadHubspotScript: function () {
        // Check if hubspot object already defined (ex: script already included on home page)
        if (typeof hbspt !== 'undefined' || pageViewModal.experimentVersion > 2) {
            pageViewModal.checkSignupCookie();
        } else {
            var scriptTag = document.createElement("script");
            scriptTag.setAttribute("src", "//js.hsforms.net/forms/embed/v2.js");
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("defer", true);
            scriptTag.setAttribute("async", true);
            document.body.appendChild(scriptTag);
            scriptTag.addEventListener("load", () => {
                pageViewModal.checkSignupCookie();
            });
        }
    },
    // Displays the Modal.
    // @param {boolean} dismissable: Allowes the Modal to be dismissed normally if enabled ("close" cta, esc key, lose focus, etc)
    displayModal: function (dismissable = false) {
        if (pageViewModal.experimentVersion > 2)
        {
            pageViewModal.togglePageViewFooter("hide");
            pageViewModal.toggleCloseButton(dismissable ? "show" : "hide");
            $(pageViewModal.modalId).modal({
                backdrop: dismissable ? true : 'static',
                keyboard: dismissable,
                show: true
            });

            var form = document.forms['signupModalForm'];
            if (!form) {
                document.forms['emailModalForm'].addEventListener('submit', (event) => {
                    event.preventDefault();
                    // TODO do something here to show user that form is being submitted
                    fetch(event.target.action, {
                        method: 'POST',
                        body: new URLSearchParams(new FormData(event.target)) // event.target is the form
                    }).then((response) => {
                        return response.text();
                    }).then((text) => {
                        if (text != null && text != "") {
                            $(pageViewModal.modalId).modal("hide");
                            var wrapper = document.getElementById(pageViewModal.modalWrapper);
                            wrapper.innerHTML = text;
                            // Display page count footer if the "close" button is clicked
                            var closeButton = document.getElementById(pageViewModal.closeButton);
                            closeButton.addEventListener('click', function () {
                                pageViewModal.togglePageViewFooter();
                            });

                            pageViewModal.displayModal(dismissable);
                        }
                    });
                });
            }
            else {
                var pageName = document.getElementById("PageName");
                var pageUrl = document.getElementById("PageUrl");

                pageUrl.value = window.location.href;
                pageName.value = document.title;

                document.forms['signupModalForm'].addEventListener('submit', (event) => {
                    event.preventDefault();
                    fetch(event.target.action, {
                        method: 'POST',
                        body: new URLSearchParams(new FormData(event.target)) // event.target is the form
                    }).then((response) => {
                        if (response.ok) {
                            pageViewModal.setFormSubmitted();
                        }
                        return response.json(); // or response.text() or whatever the server sends
                    });
                });
            }
        }
        else
            pageViewModal.loadHubspotForm(function () {
                pageViewModal.togglePageViewFooter("hide");
                pageViewModal.toggleCloseButton(dismissable ? "show" : "hide");
                $(pageViewModal.modalId).modal({
                    backdrop: dismissable ? true : 'static',
                    keyboard: dismissable,
                    show: true
                });
            });
    },
    // Loads the Hubspot form for this experiment version
    // @param  {Function} callback: Code to run after the form has loaded
    loadHubspotForm: function (callback) {
        hbspt.forms.create({
            region: "na1",
            portalId: "3462941",
            formId: pageViewModal.formId,
            target: pageViewModal.formWrapperId,
            onFormSubmit: function ($form) {
                pageViewModal.setFormSubmitted();
            },
            onFormReady: function ($form) {
                if (callback != null) {
                    callback();
                }
            }
        });
    },
    // Shows/hides the page view footer
    // @param  {string} showHide: Toggles footer display. Values = "show" or "hide"
    togglePageViewFooter: function (showHide = "show") {
        var footerLink = document.getElementById(pageViewModal.signupFooterLink);
        if (showHide === "hide") {
            footerLink.style.display = 'none';
        } else if (showHide === "show") {
            footerLink.style.display = 'flex';
        }
    },
    // Shows/hides the dismiss button (for the dismissable modal)
    // @param  {string} showHide: Toggles "Close" button display. Values = "show" or "hide"
    toggleCloseButton: function (showHide = "show") {
        var closeButton = document.getElementById(pageViewModal.closeButton);
        if (showHide === "hide") {
            closeButton.style.display = 'none';
        } else if (showHide === "show") {
            closeButton.style.display = 'block';
        }
    }
}

