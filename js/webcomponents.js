var ajax = {};
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

function getCookie(name) {
    const value = '; ${document.cookie}';
    const parts = value.split('; ${name}=');
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(cname, cvalue, exdays) {
    var expires = "expires=" + exdays.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function setFallbackImage() {
    var noLogoImage = "https://img.covers.com/covers/icons/global-icons/no-logo.svg";
    var usedFallback = this.dataset.fallback;
    var fallbackImage = this.dataset.fallbackImage;
    if (usedFallback == 0) {
        this.src = fallbackImage;
    } else {
        this.src = noLogoImage;
        this.onerror = null;
    }
    usedFallback++;
    this.dataset.fallback = usedFallback;
}

class CoversTopConsensus extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://contests.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Consensus/Content/Widget.css?v=1"';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        var records = this.getAttribute('records');
        var callToAction = this.getAttribute('cta');
        var removeBranding = this.getAttribute('removeBranding');

        var encoded = encodeURIComponent(callToAction);
        var url = this.host + '/Consensus/Widget/TopConsensus/' + records + '/' + removeBranding + '/' + encoded;

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {

                wrapper.innerHTML = text;

                var tabLinks = wrapper.querySelectorAll(".consensusLeagueLink");

                for (var i = 0; i < tabLinks.length; i++) {
                    tabLinks[i].onclick = function (event) {
                        event.preventDefault();
                        var url = this.href;

                        var otherTabs = wrapper.querySelector(".consensusNav").getElementsByTagName("li");
                        for (var y = 0; y < otherTabs.length; y++) {
                            otherTabs[y].className = "";
                        }

                        this.parentElement.className = "selected";

                        fetch(url).then((response) => { return response.text() }).then((text) => {
                            wrapper.querySelector("#TopConsensusBrickContent").innerHTML = text;
                        }).
                            catch(function (xmlHttpRequest, textStatus, errorThrown) {
                                console.log(errorThrown + '\r\n' + xmlHttpRequest);
                            });
                    };
                }
            });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversLeagueConsensus extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://contests.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Consensus/Content/Widget.css?v=1"';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Takes attribute content to use inside
        var league = this.getAttribute('league');

        var records = this.getAttribute('records');
        var callToAction = this.getAttribute('cta');
        var removeBranding = this.getAttribute('removeBranding');

        var url = '/Consensus/Widget/LeagueConsensus/' + league + "/"
            + records + "/"
            + removeBranding + "/"
            + encodeURIComponent(callToAction);

        fetch(this.host + url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversMatchupConsensus extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://contests.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Consensus/Content/Widget.css?v=1"';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Takes attribute content to use inside
        var event = this.getAttribute('event');

        if (event) {
            var callToAction = this.getAttribute('cta');
            var removeBranding = this.getAttribute('removeBranding');
            var hideAnalysis = this.getAttribute('hideAnalysis');

            var url = "/Consensus/Widget/MatchupConsensus/" + event + "/"
                + hideAnalysis + "/"
                + removeBranding + "/"
                + encodeURIComponent(callToAction);

            fetch(this.host + url).then(
                (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

            shadowRoot.appendChild(style);
            shadowRoot.appendChild(wrapper);
        }

    }
}


class ExpertsFreePick extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://experts.covers.com";

        var sidebar = this.getAttribute('sidebar');

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');

        if (sidebar != null && sidebar === 'true') {
            style.textContent = '@import "' + this.host + '/Content/Widget_Sidebar.css"';
        } else {
            style.textContent = '@import "' + this.host + '/Content/Widget.css?v=1"';
        }

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Takes attribute content to use inside
        var pickId = this.getAttribute('pick-id');
        var hideAnalysis = this.getAttribute('hide-analysis');
        var hideExpertName = this.getAttribute('hide-expert-name');
        var hideSportsbook = this.getAttribute('hide-sportsbook');
        var removeBranding = this.getAttribute('remove-branding');

        var url = this.host + '/Widget/FreePick/' + pickId +
            '?hideAnalysis=' + hideAnalysis +
            '&hideExpertName=' + hideExpertName +
            '&hideSportsbook=' + hideSportsbook +
            '&removeBranding=' + removeBranding;

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversEditorialMinimal extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Editorial/Content/source/ExternalArticleEmbed.css"';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var articleId = this.getAttribute('articleId');
        var removeBranding = this.getAttribute('removeBranding');
        var headline = this.getAttribute('headline');

        if (articleId.length < 36) {
            var url = this.host + '/ArticleWidget?id=' + articleId;
        } else {
            var url = this.host + '/Editorial/external/ArticleWidget?id=' + articleId;
        }

        if (headline != null) {
            url = url + "&headline=" + headline;
        }

        if (removeBranding != null) {
            url = url + "&removeBranding=" + removeBranding;
        }

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversEditorialTag extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var tagIds = this.getAttribute('articleTags');
        var limit = this.getAttribute('limit');
        var header = this.getAttribute('header');

        if (header != null && header !== undefined) {
            var url = this.host + '/ArticleTagWidget?tagids=' + tagIds + '&limit=' + limit + '&header=' + header;
        } else {
            var url = this.host + '/ArticleTagWidget?tagids=' + tagIds + '&limit=' + limit
        }

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;
            });

        shadowRoot.appendChild(wrapper);
    }
}

class CoversLineLeague extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Sports/Content/css/covers_line_widget.css?v=1';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var league = this.getAttribute('league');
        var market = !this.getAttribute('market') ? "all" : this.getAttribute('market');
        var property = this.getAttribute('property')
        var records = this.getAttribute('records');
        var callToAction = this.getAttribute('cta');
        var oddsType = this.getAttribute('odds-type');
        var property = this.getAttribute('property');
        //var timeZone = this.getAttribute('time-zone');
        // Deprecated for removeHeading. Left in for backwards compatibility
        var removeBranding = this.getAttribute('removeBranding');
        var removeHeading = this.getAttribute('removeHeading');
        var removeClickouts = this.getAttribute('removeLinking');
        var startDate = this.getAttribute('startDate');
        var endDate = this.getAttribute('endDate');
        //var oddsProvider = this.getAttribute('odds-provider');       

        property = (!property) ? "" : property;
        if (removeBranding && !removeHeading) {
            removeHeading = removeBranding;
        }

        var url = this.host + '/sport/widgets/leagueodds?'
            + "league=" + league
            + "&market=" + market
            + "&property=" + property
            + "&cta=" + callToAction
            + "&oddsType=" + oddsType
            //+ "&timeZone=" + timeZone
            + "&records=" + records
            + "&removeHeading=" + removeHeading
            //+ "&oddsProvider=" + oddsProvider
            + "&removeClickouts=" + removeClickouts
            + "&startDate=" + startDate
            + "&endDate=" + endDate;



        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;

                var teamLogos = shadowRoot.querySelectorAll(".__teamLogo");
                for (var i = 0; i < teamLogos.length; i++) {
                    teamLogos[i].addEventListener("error", setFallbackImage);
                }
            });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversLineMatchup extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Sports/Content/css/covers_line_widget.css?v=1';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var league = this.getAttribute('league');
        var competitionId = this.getAttribute('competitionId');
        var callToAction = this.getAttribute('cta');
        var oddsType = this.getAttribute('odds-type');
        var timeZone = this.getAttribute('time-zone');
        var removeBranding = this.getAttribute('removeBranding');
        var removeLinking = this.getAttribute('removeLinking');
        var oddsProvider = this.getAttribute('odds-provider');
        var alternateDesign = this.getAttribute('alternateDesign');

        var url = this.host + '/sports/OddsWidgets/CompetitionLinesWidget/' + league + "/" + competitionId + "?"
            + "callToAction=" + callToAction
            + "&oddsType=" + oddsType
            + "&timeZone=" + timeZone
            + "&removeBranding=" + removeBranding
            + "&oddsProvider=" + oddsProvider
            + "&removeLinking=" + removeLinking;

        // Add the alternate design parameter if it is not null
        if (alternateDesign != null) {
            url = url + "&alternateDesign=" + alternateDesign;
        }

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversLineFutures extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Sports/Content/css/covers_line_widget.css?v=1';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        // long oddsEventId, string sportsBook = "covers", string oddsType = "ml", int numberOfTeams = 0, bool removeBranding = false, string callToAction = null
        var oddsEventId = this.getAttribute('odds-eventid');
        var sportsBook = this.getAttribute('odds-provider');
        var oddsType = this.getAttribute('odds-type');
        var numberOfTeams = this.getAttribute('teams');
        var removeBranding = this.getAttribute('removeBranding');
        var callToAction = this.getAttribute('cta');

        var url = this.host + '/sport/widgets/futureswidget?'
            + "oddsEventId=" + oddsEventId
            + "&sportsBook=" + sportsBook
            + "&oddsType=" + oddsType
            + "&numberOfTeams=" + numberOfTeams
            + "&removeBranding=" + removeBranding
            + "&callToAction=" + callToAction;


        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversLineMultiPartnerFutures extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import ' + this.host + '/Sports/Content/css/covers_line_widget.css;';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside

        var oddsEventId = this.getAttribute('odds-eventid');
        var league = this.getAttribute('odds-league');
        var header = this.getAttribute('header');
        var cta = this.getAttribute('cta');
        var linkUrl = this.getAttribute('url');
        var tabOne = this.getAttribute('tabOne');
        var tabTwo = this.getAttribute('tabTwo');
        var tabThree = this.getAttribute('tabThree');
        var limit = this.getAttribute('limit');
        var favLimit = this.getAttribute('favLimit');
        var included = this.getAttribute('included');
        var property = this.getAttribute('property');

        if (!included) {
            included = "";
        }
        property = (!property) ? "" : property;

        var url = this.host + '/sport/widgets/futurespartnerwidget?'
            + "league=" + league
            + "&eventId=" + oddsEventId
            + "&header=" + header
            + "&cta=" + cta
            + "&url=" + linkUrl
            + "&limit=" + limit
            + "&included=" + included
            + "&favLimit=" + favLimit
            + "&property=" + property;

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                text.replace();
                if (tabOne) { text = text.replace(">Favorites<", ">" + tabOne + "<"); }
                if (tabTwo) { text = text.replace(">Contenders<", ">" + tabTwo + "<"); }
                if (tabThree) { text = text.replace(">All Teams<", ">" + tabThree + "<"); }
                wrapper.innerHTML = text;

                var mobileNavText = shadowRoot.querySelector('#oddsComparisonTable-mobileNavText');
                var mobileNavButton = shadowRoot.querySelector('#covers-oddsComparisonTable-mobileNavButton');
                var mobileDropdown = shadowRoot.querySelector('#covers-oddsComparisonTable-mobileDropdownMenu');

                var favoritesLink = shadowRoot.querySelector('#favouritesLink');
                var contendersLink = shadowRoot.querySelector('#contendersLink');
                var allteamsLink = shadowRoot.querySelector('#allteamsLink');

                var favoritesLinkMobile = shadowRoot.querySelector('#favouritesLink-DD');
                var contendersLinkMobile = shadowRoot.querySelector('#contendersLink-DD');
                var allteamsLinkMobile = shadowRoot.querySelector('#allteamsLink-DD');

                var favoritesTable = shadowRoot.querySelector('#TP_favourites');
                var contendersTable = shadowRoot.querySelector('#TP_contenders');
                var allteamsTable = shadowRoot.querySelector('#TP_allteams');

                var favoritesTextClass = "oddsComparisonTable-favouritesText";
                var contendersTextClass = "oddsComparisonTable-contendersText";
                var allteamsTextClass = "oddsComparisonTable-allTeamsText";

                mobileNavText.classList.add('oddsComparisonTable-favouritesText');
                mobileDropdown.classList.add('oddsComparisonTable-hide');

                // Dropdown Menu OnClick
                mobileNavButton.addEventListener('click', function () {

                    // if the dropdown menu is hidden
                    if (mobileDropdown.classList.contains('oddsComparisonTable-hide')) {
                        // show the dropdown menu
                        mobileDropdown.classList.remove('oddsComparisonTable-hide');
                    }
                    // if the dropdown menu is shown
                    else {
                        // hide the dropdown menu
                        mobileDropdown.classList.add('oddsComparisonTable-hide');
                    }

                });

                function toggleViews(desktopLink, mobileLink, navTextClass, table) {
                    /* TABS */
                    // Remove active class from tabs
                    favoritesLink.classList.remove('active');
                    contendersLink.classList.remove('active');
                    allteamsLink.classList.remove('active');
                    // Add active class to tab
                    desktopLink.classList.add('active');

                    /* TABLES */
                    // Remove active class from tables
                    favoritesTable.classList.remove('active');
                    contendersTable.classList.remove('active');
                    allteamsTable.classList.remove('active');
                    // Add active class to table
                    table.classList.add('active');

                    // Changes for Mobile dropdown text
                    mobileNavText.classList.remove(favoritesTextClass);
                    mobileNavText.classList.remove(contendersTextClass);
                    mobileNavText.classList.remove(allteamsTextClass);
                    mobileNavText.classList.add(navTextClass);

                    mobileDropdown.classList.add('oddsComparisonTable-hide');

                    /* Mobile dropdown list */
                    // Remove active class from tabs
                    favoritesLinkMobile.classList.remove('active');
                    contendersLinkMobile.classList.remove('active');
                    allteamsLinkMobile.classList.remove('active');
                    // Add active class to tab
                    mobileLink.classList.add('active');
                }

                /*
                 FAVOURITES
                 */
                favoritesLink.addEventListener('click', function () {
                    toggleViews(favoritesLink, favoritesLinkMobile, favoritesTextClass, favoritesTable);
                });
                favoritesLinkMobile.addEventListener('click', function () {
                    toggleViews(favoritesLink, favoritesLinkMobile, favoritesTextClass, favoritesTable);
                });

                /*
                 CONTENDERS
                 */
                contendersLink.addEventListener('click', function () {
                    toggleViews(contendersLink, contendersLinkMobile, contendersTextClass, contendersTable);
                });
                contendersLinkMobile.addEventListener('click', function () {
                    toggleViews(contendersLink, contendersLinkMobile, contendersTextClass, contendersTable);
                });

                /*
                 ALL TEAMS
                 */
                allteamsLink.addEventListener('click', function () {
                    toggleViews(allteamsLink, allteamsLinkMobile, allteamsTextClass, allteamsTable);
                });
                allteamsLinkMobile.addEventListener('click', function () {
                    toggleViews(allteamsLink, allteamsLinkMobile, allteamsTextClass, allteamsTable);
                });

            });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversMultibookGolf extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import ' + this.host + '/Sports/Content/css/covers_line_widget.css;';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside

        var tournamentId = this.getAttribute('tournamentId');
        var league = this.getAttribute('odds-league');
        var header = this.getAttribute('header');
        var market = this.getAttribute('market');
        var property = this.getAttribute('property');
        var removeClickouts = this.getAttribute('removeClickouts');
        var cta = this.getAttribute('cta');
        var linkUrl = this.getAttribute('url');
        var cta2 = this.getAttribute('cta2');
        var linkUrl2 = this.getAttribute('url2');
        var tabOne = this.getAttribute('tabOne');
        var tabTwo = this.getAttribute('tabTwo');
        var tabThree = this.getAttribute('tabThree');
        var limit = this.getAttribute('limit');
        var favLimit = this.getAttribute('favLimit');
        var included = this.getAttribute('included');

        var url = this.host + '/sport/widgets/multibookgolf?'
            + "league=" + league
            + "&tournamentId=" + tournamentId
            + "&header=" + header
            + "&market=" + market
            + "&property=" + property
            + "&cta=" + cta
            + "&url=" + linkUrl
            + "&cta2=" + cta2
            + "&url2=" + linkUrl2
            + "&limit=" + limit
            + "&included=" + included
            + "&favLimit=" + favLimit
            + "&removeClickouts=" + removeClickouts;

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                text.replace();
                if (tabOne) { text = text.replace(">Favorites<", ">" + tabOne + "<"); }
                if (tabTwo) { text = text.replace(">Contenders<", ">" + tabTwo + "<"); }
                if (tabThree) { text = text.replace(">All Teams<", ">" + tabThree + "<"); }
                wrapper.innerHTML = text;

                var mobileNavText = shadowRoot.querySelector('#oddsComparisonTable-mobileNavText');
                var mobileNavButton = shadowRoot.querySelector('#covers-oddsComparisonTable-mobileNavButton');
                var mobileDropdown = shadowRoot.querySelector('#covers-oddsComparisonTable-mobileDropdownMenu');

                var favoritesLink = shadowRoot.querySelector('#favouritesLink');
                var contendersLink = shadowRoot.querySelector('#contendersLink');
                var allteamsLink = shadowRoot.querySelector('#allteamsLink');

                var favoritesLinkMobile = shadowRoot.querySelector('#favouritesLink-DD');
                var contendersLinkMobile = shadowRoot.querySelector('#contendersLink-DD');
                var allteamsLinkMobile = shadowRoot.querySelector('#allteamsLink-DD');

                var favoritesTable = shadowRoot.querySelector('#TP_favourites');
                var contendersTable = shadowRoot.querySelector('#TP_contenders');
                var allteamsTable = shadowRoot.querySelector('#TP_allteams');

                var favoritesTextClass = "oddsComparisonTable-favouritesText";
                var contendersTextClass = "oddsComparisonTable-contendersText";
                var allteamsTextClass = "oddsComparisonTable-allTeamsText";

                mobileNavText.classList.add('oddsComparisonTable-favouritesText');
                mobileDropdown.classList.add('oddsComparisonTable-hide');

                //Adding function to add and remove the open odds for all 
                var openOddsBoxFav = shadowRoot.querySelector('#TP_favourites #openodds');
                var tableContainerFav = shadowRoot.querySelector('#TP_favourites #contentContainer');

                var openOddsBoxCon = shadowRoot.querySelector('#TP_contenders #openodds');
                var tableContainerCon = shadowRoot.querySelector('#TP_contenders #contentContainer');

                var openOddsBoxAll = shadowRoot.querySelector('#TP_allteams #openodds');
                var tableContainerAll = shadowRoot.querySelector('#TP_allteams #contentContainer');

                function toggleOpenOdds(tableCont) {
                    //if container doesn't have class select add it otherwise remove it 
                    if (tableCont.classList.contains("select")) {
                        tableCont.classList.remove("select")
                    } else {
                        tableCont.classList.add("select")
                    }
                }

                openOddsBoxFav.addEventListener("click", function () {
                    toggleOpenOdds(tableContainerFav)
                })

                openOddsBoxCon.addEventListener("click", function () {
                    toggleOpenOdds(tableContainerCon)
                })

                openOddsBoxAll.addEventListener("click", function () {
                    toggleOpenOdds(tableContainerAll)
                })

                // Dropdown Menu OnClick
                mobileNavButton.addEventListener('click', function () {

                    // if the dropdown menu is hidden
                    if (mobileDropdown.classList.contains('oddsComparisonTable-hide')) {
                        // show the dropdown menu
                        mobileDropdown.classList.remove('oddsComparisonTable-hide');
                    }
                    // if the dropdown menu is shown
                    else {
                        // hide the dropdown menu
                        mobileDropdown.classList.add('oddsComparisonTable-hide');
                    }

                });

                function toggleViews(desktopLink, mobileLink, navTextClass, table) {
                    /* TABS */
                    // Remove active class from tabs
                    favoritesLink.classList.remove('active');
                    contendersLink.classList.remove('active');
                    allteamsLink.classList.remove('active');
                    // Add active class to tab
                    desktopLink.classList.add('active');

                    /* TABLES */
                    // Remove active class from tables
                    favoritesTable.classList.remove('active');
                    contendersTable.classList.remove('active');
                    allteamsTable.classList.remove('active');
                    // Add active class to table
                    table.classList.add('active');

                    // Changes for Mobile dropdown text
                    mobileNavText.classList.remove(favoritesTextClass);
                    mobileNavText.classList.remove(contendersTextClass);
                    mobileNavText.classList.remove(allteamsTextClass);
                    mobileNavText.classList.add(navTextClass);

                    mobileDropdown.classList.add('oddsComparisonTable-hide');

                    /* Mobile dropdown list */
                    // Remove active class from tabs
                    favoritesLinkMobile.classList.remove('active');
                    contendersLinkMobile.classList.remove('active');
                    allteamsLinkMobile.classList.remove('active');
                    // Add active class to tab
                    mobileLink.classList.add('active');
                }

                /*
                 FAVOURITES
                 */
                favoritesLink.addEventListener('click', function () {
                    toggleViews(favoritesLink, favoritesLinkMobile, favoritesTextClass, favoritesTable);
                });
                favoritesLinkMobile.addEventListener('click', function () {
                    toggleViews(favoritesLink, favoritesLinkMobile, favoritesTextClass, favoritesTable);
                });

                /*
                 CONTENDERS
                 */
                contendersLink.addEventListener('click', function () {
                    toggleViews(contendersLink, contendersLinkMobile, contendersTextClass, contendersTable);
                });
                contendersLinkMobile.addEventListener('click', function () {
                    toggleViews(contendersLink, contendersLinkMobile, contendersTextClass, contendersTable);
                });

                /*
                 ALL TEAMS
                 */
                allteamsLink.addEventListener('click', function () {
                    toggleViews(allteamsLink, allteamsLinkMobile, allteamsTextClass, allteamsTable);
                });
                allteamsLinkMobile.addEventListener('click', function () {
                    toggleViews(allteamsLink, allteamsLinkMobile, allteamsTextClass, allteamsTable);
                });

            });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}


class CoversLineGolf extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Sports/Content/css/covers_line_widget.css?v=1';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var tournamentId = this.getAttribute('tournamentid');
        var sportsBook = this.getAttribute('odds-provider');
        var numberOfPlayers = this.getAttribute('players');
        var removeBranding = this.getAttribute('removeBranding');
        var callToAction = this.getAttribute('cta');

        var url = this.host + '/sport/widgets/golftournamentwidget?'
            + "tournamentId=" + tournamentId
            + "&sportsBook=" + sportsBook
            + "&numberOfPlayers=" + numberOfPlayers
            + "&removeBranding=" + removeBranding
            + "&callToAction=" + callToAction;


        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversGolfBestLine extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Bootstrap CSS for modal
        var bootstrap = document.createElement('style');
        bootstrap.textContent = '@import "' + this.host + '/sport/lib/bootstrap/dist/css/bootstrap.min.css"';

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/sport/css/best_odds_widgets.css"';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var tournamentId = this.getAttribute('tournamentid');
        var market = this.getAttribute('tournamentid');
        var numberOfPlayers = this.getAttribute('players');
        var headingText = this.getAttribute('headingText');
        var removeHeading = this.getAttribute('removeHeading');
        var subHeadingText = this.getAttribute('subHeadingText');
        var removeSubHeading = this.getAttribute('removeSubHeading');
        var market = this.getAttribute('market');
        var removeClickouts = this.getAttribute('removeClickouts');
        var playerList = this.getAttribute('playerList');


        if (!removeClickouts || removeClickouts == "") {
            removeClickouts = "false";
        }
        if (!removeHeading || removeHeading == "") {
            removeHeading = "false";
        }

        var url = this.host + '/sport/widgets/golfbestlinewidget?'
            + "tournamentId=" + tournamentId
            + "&numberOfPlayers=" + numberOfPlayers
            + "&market=" + market
            + "&headingText=" + headingText
            + "&removeHeading=" + removeHeading
            + "&subHeadingText=" + subHeadingText
            + "&removeSubHeading=" + removeSubHeading
            + "&removeClickouts=" + removeClickouts
            + "&playerList=" + playerList;


        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;

                var containers = $('.__widgets-mainContainer', wrapper);
                var infoBtn = $('button.covers-Widgets-infoModal-Btn', wrapper);

                $(infoBtn, wrapper).click(() => {
                    $('#GolfWidgetInfoModal', wrapper).modal('toggle');
                });

                $.each(containers, function (index, el) {
                    var team = $(el, wrapper).children().first();
                    var scrollCont = $(el, wrapper).find('div.__scrollCont');
                    var box = $(el, wrapper).children().last();
                    var table = $(scrollCont, wrapper).find('table').children().first();
                    var tableWidth = $(table, wrapper).width();
                    var scrollAreaWidth = $(scrollCont, wrapper).width();
                    if (tableWidth > scrollAreaWidth) {
                        $(box, wrapper).addClass('__boxshadow_for_right_element');
                    }
                    $(scrollCont, wrapper).scroll(function (event) {
                        var containerWidth = this.scrollWidth - this.clientWidth;
                        var position = this.scrollLeft;
                        if (position == 0) {
                            $(team, wrapper).removeClass('__boxshadow_for_left_element');
                            $(box, wrapper).addClass('__boxshadow_for_right_element');
                        }
                        if (position > 0) {
                            $(team, wrapper).addClass('__boxshadow_for_left_element');
                            $(box, wrapper).addClass('__boxshadow_for_right_element');
                        }
                        if (position < containerWidth) {
                            $(team, wrapper).addClass('__boxshadow_for_left_element');
                            $(box, wrapper).addClass('__boxshadow_for_right_element');
                            if (position == 0) {
                                $(team, wrapper).removeClass('__boxshadow_for_left_element');
                            }
                        }
                        if (position == containerWidth) {
                            $(team, wrapper).addClass('__boxshadow_for_left_element');
                            $(box, wrapper).removeClass('__boxshadow_for_right_element');
                        }
                    });
                });
            });

        shadowRoot.appendChild(bootstrap);
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversLineMmaCard extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Sports/Content/css/covers_line_widget.css?v=1';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var seasonId = this.getAttribute('seasonid');
        var numberOfFights = this.getAttribute('fights');
        var removeHeading = this.getAttribute('removeHeading');
        var removeClickouts = this.getAttribute('removeClickouts');

        if (!removeClickouts || removeClickouts == "") {
            removeClickouts = "false";
        }
        if (!removeHeading || removeHeading == "") {
            removeHeading = "false";
        }

        var url = this.host + '/sport/widgets/mmacardwidget?'
            + "seasonId=" + seasonId
            + "&numberOfFights=" + numberOfFights
            + "&removeHeading=" + removeHeading
            + "&removeClickouts=" + removeClickouts;


        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversLineMmaFight extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Sports/Content/css/covers_line_widget.css?v=1';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var eventId = this.getAttribute('eventid');
        var removeHeading = this.getAttribute('removeHeading');
        var removeClickouts = this.getAttribute('removeClickouts');

        if (!removeClickouts || removeClickouts == "") {
            removeClickouts = "false";
        }
        if (!removeHeading || removeHeading == "") {
            removeHeading = "false";
        }

        var url = this.host + '/sport/widgets/mmafightwidget?'
            + "eventId=" + eventId
            + "&removeHeading=" + removeHeading
            + "&removeClickouts=" + removeClickouts;


        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => { wrapper.innerHTML = text; });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversWeather extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });


    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var weatherStyle = document.createElement('style');
        weatherStyle.textContent = '@import "' + this.host + '/Sports/Content/WeatherBrick.css?v=2"';

        var headerStyle = document.createElement('style');
        headerStyle.textContent = '@import "https://headers.covers.com/content/css/headers.css?t=test"';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Takes attribute content to use inside
        var gameId = this.getAttribute('gameId');

        fetch(this.host + '/Sports/Weather/MatchupWeather?Id=' + gameId).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;

                $(".covers-coversweather-button", wrapper).click(function (e) {
                    e.preventDefault();
                    $('#hourlyForecast', wrapper).modal('show');
                });
            });

        shadowRoot.appendChild(headerStyle);
        shadowRoot.appendChild(weatherStyle);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversBetgraph extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();



        // Create a shadow root
        this.attachShadow({ mode: 'open' });


    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        //import { CMG_SPORTS } from 'https://local.covers.com/sports/scripts/app.js';

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style2 = document.createElement('style');
        style2.textContent = '@import "' + this.host + '/Sports/Content/GameBox.css';

        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Sports/Content/BetGraphWidget.css';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var league = this.getAttribute('league');
        var gameId = this.getAttribute('gameId');

        var url = this.host + '/sports/' + league + '/Matchups/SpreadBetGraphPopup/' + gameId;

        //	loadScript(this, 'https://www.covers.com/sports/scripts/app.js');

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;


                CMG_SPORTS.setupAccordion($("#cmg_spread_bet_graph_holder", wrapper));

                $('.cmg_graph_accordion', wrapper).accordion('option', 'active', 0);

                $('.cmg_graph_accordion', wrapper).accordion("option", "collapsible", false);

            });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(style2);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversPolls extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/forum/Content/css/poll_widget.css';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var threadId = this.getAttribute('threadId');

        var url = this.host + '/forum/pollwidget/' + threadId;

        fetch(url).then(
            (resp) => {
                return resp.text()
            }
        ).then(
            (text) => {
                wrapper.innerHTML = text;
                var pollId = wrapper.querySelector('div').dataset.pollId;
                var pollExperation = Date.parse(wrapper.querySelector('div').dataset.pollExperation);
                var pollExperationDate = new Date(pollExperation);
                var pollExpired = pollExperationDate < new Date();
                var cookieExperation = new Date();
                cookieExperation.setDate(pollExperationDate.getDate());
                cookieExperation.setMonth(pollExperationDate.getMonth())
                cookieExperation.setYear(pollExperationDate.getFullYear());
                cookieExperation.setTime(pollExperationDate.getTime());

                var userUrl = this.host + 'Forum/Poll/CurrentUserResponse/' + pollId;
                var voteUrl = this.host + 'Forum/vote'
                var callback = function (jsonValue) {
                    var hasVoted = false;
                    if (jsonValue) {
                        var data = JSON.parse(jsonValue);
                        hasVoted = data.hasVoted;
                    }

                    var cookieId = "hasVoted-" + pollId;
                    var hasVotedCookie = getCookie(cookieId);

                    hasVoted |= (hasVotedCookie == "true" ? true : false);

                    shadowRoot.querySelector('#cmg-poll-vote-button').style.display = "block";
                    shadowRoot.querySelector('#cmg-poll-login-button').style.display = "none";

                    if (hasVoted || pollExpired) {
                        shadowRoot.querySelector('#cmg-poll-results').style.display = "block";
                        shadowRoot.querySelector('#cmg-poll-question').style.display = "none";
                    }
                    else {
                        shadowRoot.querySelector('#cmg-poll-results').style.display = "hide";
                        shadowRoot.querySelector('#cmg-poll-question').style.display = "block";

                        var vote = function (event) {
                            event.preventDefault();

                            var options = shadowRoot.querySelectorAll('input.pollOption');
                            for (var key in options) {
                                if (options[key].checked) {
                                    var data = { "optionId": options[key].value };
                                    voteUrl = voteUrl + "?optionId=" + options[key].value;

                                    var voteCallback = function (jsonValue) {
                                        var voteCounter = shadowRoot.querySelector('#covers-CoversPolls-votesTime-count');
                                        var totalVotes = parseInt(voteCounter.innerHTML) + 1;
                                        voteCounter.innerHTML = totalVotes;

                                        for (var key in options) {
                                            if (options[key].value) {
                                                var optionVotePercentage = shadowRoot.querySelector('#votePercentage' + options[key].value);
                                                var optionVoteCounter = shadowRoot.querySelector('#voteCounter' + options[key].value);
                                                var optionNumberOfVotes = parseInt(optionVoteCounter.innerHTML);
                                                if (options[key].checked) {
                                                    optionNumberOfVotes += 1;
                                                    optionVoteCounter.innerHTML = optionNumberOfVotes;
                                                }
                                                var percentage = (optionNumberOfVotes * 1.0 / totalVotes) * 100;
                                                var percentageString = "" + Math.round(percentage) + "%";
                                                optionVotePercentage.dataset.percentage = percentageString;
                                                optionVotePercentage.style.width = percentageString;
                                                shadowRoot.querySelector('#votePercentage' + options[key].value + ' span').innerHTML = percentageString;
                                            }
                                        }

                                        shadowRoot.querySelector('#cmg-poll-results').style.display = "block";
                                        shadowRoot.querySelector('#cmg-poll-question').style.display = "none";

                                        setCookie(cookieId, true, cookieExperation);
                                    }

                                    ajax.send(voteUrl, voteCallback, 'POST', data)
                                }
                            }

                        }
                        shadowRoot.querySelector('#pollForm').addEventListener('submit', vote);

                    }
                }
                ajax.send(userUrl, callback, 'GET', {})
            }
        );

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversBestOddsMatchup extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        //import { CMG_SPORTS } from 'https://local.covers.com/sports/scripts/app.js';

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        //var style = document.createElement('style');
        //style.textContent = '@import "' + this.host + '/sport/css/best_odds_widgets.css';

        // Adobe js
        var adobeUrl = "https://headers.covers.com/AdobeScripts";
        fetch(adobeUrl).then(
            (resp) => { return resp.text() }).then(function (text) {
                // Convert the HTML string into a document object
                var parser = new DOMParser();
                var html = parser.parseFromString(text, 'text/html');
                var scripts = html.querySelectorAll('script');
                scripts.forEach(element => shadowRoot.appendChild(element));
            });

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        /*        var league = this.getAttribute('league');*/
        var soccer = false;
        var gameId = this.getAttribute('gameId');
        var location = this.getAttribute('location');
        var header = this.getAttribute('header');
        var market = this.getAttribute('market');
        var property = this.getAttribute('property');
        var removeClickouts = this.getAttribute('removeClickouts');
        var removeHeading = this.getAttribute('removeHeading');
        var removeCtas = this.getAttribute('removeCtas');
        var ctaText1 = this.getAttribute('ctaText1');
        var ctaText2 = this.getAttribute('ctaText2');
        var ctaLink1 = this.getAttribute('ctaLink1');
        var ctaLink2 = this.getAttribute('ctaLink2');
        // fallback for older embed codes
        var cta = this.getAttribute('cta');

        if (!cta) {
            cta = "";
        }
        if (!header && cta) {
            header = cta;
        }
        if (!market) {
            market = "all";
        }
        if (!removeClickouts || removeClickouts == "") {
            removeClickouts = "false";
        }
        if (!removeHeading || removeHeading == "") {
            removeHeading = "false";
        }
        if (!removeCtas || removeCtas == "") {
            removeCtas = "false";
        }
        if (!ctaText1) {
            ctaText1 = "";
        }
        if (!ctaText2) {
            ctaText2 = "";
        }
        if (!ctaLink1) {
            ctaLink1 = "";
        }
        if (!ctaLink2) {
            ctaLink2 = "";
        }
        property = (!property) ? "" : property;

        var url = this.host + '/sport/widgets/bestoddsmatchup?gameId=' + gameId + '&location=' + location + '&header=' + header
            + '&removeClickouts=' + removeClickouts + "&removeHeading=" + removeHeading + "&removeCtas=" + removeCtas + "&property=" + property
            + "&market=" + market + "&ctaText1=" + ctaText1 + "&ctaText2=" + ctaText2 + "&ctaLink1=" + ctaLink1 + "&ctaLink2=" + ctaLink2;

        //	loadScript(this, 'https://www.covers.com/sports/scripts/app.js');

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;

                function openCloseCompareOddsContainer(id = "", container = "", isMobile = false) {
                    var mobileClass = isMobile ? "mobile" : "";
                    var button = shadowRoot.querySelector(id);
                    if (button) {
                        button.addEventListener("click", () => {
                            if (shadowRoot.querySelector(`.${container}-toggle${mobileClass}`).classList.contains("open")) {
                                shadowRoot.querySelector(`.${container}-toggle${mobileClass}`).classList.remove("open");
                                shadowRoot.querySelector(id).classList.remove("open");
                            } else {
                                shadowRoot.querySelector(`.${container}-toggle${mobileClass}`).classList.add("open");
                                shadowRoot.querySelector(id).classList.add("open");
                            }
                        });
                    }
                }

                //Desktop JS
                openCloseCompareOddsContainer("#compare-odds-home-", "homeContainer");
                openCloseCompareOddsContainer("#compare-odds-away-", "awayContainer");
                openCloseCompareOddsContainer("#compare-odds-draw-", "drawContainer");

                // Mobile JS
                openCloseCompareOddsContainer("#compare-odds-home-mobile", "homeContainer", true);
                openCloseCompareOddsContainer("#compare-odds-away-mobile", "awayContainer", true);
                openCloseCompareOddsContainer("#compare-odds-draw-mobile", "drawContainer", true);

                var teamLogos = shadowRoot.querySelectorAll(".__teamLogo");
                for (var i = 0; i < teamLogos.length; i++) {
                    teamLogos[i].addEventListener("error", setFallbackImage);
                }

                function CalculatePayout(odds, betMoney) {
                    return ((odds > 0 ? ((odds / 100) * betMoney) : ((100 / odds) * (-1 * betMoney))) + betMoney).toFixed(2);
                }

                //payout js
                function addClickEvent(side, device) {
                    var elementListSelector = "";
                    var payoutSeledctor = "";
                    var containerSelector = "";
                    if (device == "mobile") {
                        elementListSelector = `.mobile-Display .dropdown-content.${side} a`;
                        payoutSeledctor = `#${side}FirstPayoutMobile`;
                        containerSelector = `.${side}Container-togglemobile`
                    } else {
                        elementListSelector = `.desktop-Display .dropdown-content.${side} a`;
                        payoutSeledctor = `#${side}FirstPayout`;
                        containerSelector = `.${side}Container-toggle`;
                    }
                    var elementList = shadowRoot.querySelectorAll(elementListSelector);
                    elementList.forEach(element => {
                        element.addEventListener('click', function (event) {
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            var text = event.target.textContent;
                            var parentId = this.parentElement.getAttribute("id");
                            var buttonId = "#dropdownMenuButton" + parentId;
                            shadowRoot.querySelector(`${buttonId} .amount`).textContent = text;

                            var childrenListBestOdd = parseInt(shadowRoot.querySelectorAll(`.${side} .upper-container.best-odd`)[0].dataset.line);
                            var betMoney = parseInt(text.slice(1));
                            var PayOut = CalculatePayout(childrenListBestOdd, betMoney);
                            shadowRoot.querySelector(payoutSeledctor).textContent = `$${PayOut}`;
                            var childrenList = shadowRoot.querySelectorAll(`${containerSelector} .upper-container`);
                            var childrenListComparison = shadowRoot.querySelectorAll(`${containerSelector} .comparison-odds`);
                            for (let i = 0; i < childrenList.length; i++) {
                                var oddsComparison = (parseInt(childrenList[i].dataset.line));
                                var payoutComparison = CalculatePayout(oddsComparison, betMoney);
                                childrenListComparison[i].nextElementSibling.innerHTML = `<span>$${payoutComparison}</span>`;
                                childrenListComparison[i].previousElementSibling.innerHTML = text;
                            }
                            shadowRoot.querySelector(`#${parentId}`).parentElement.classList.add("hide");
                            if (device == "mobile") {
                                var buttonCaret = shadowRoot.querySelector(`${buttonId} .caret`);
                                shadowRoot.querySelector(`${buttonId}`).addEventListener("click", function (event) {
                                    event.stopPropagation();
                                    event.stopImmediatePropagation();
                                    event.preventDefault();
                                    shadowRoot.querySelector(`#${parentId}`).parentElement.classList.remove("hide");
                                    buttonCaret.style.transform = "none";
                                })
                                buttonCaret.style.transform = "rotate(180deg)";
                            } else {
                                function delay() {
                                    shadowRoot.querySelector(`#${parentId}`).parentElement.classList.remove("hide");
                                }
                                setTimeout(delay, 1000)
                            }
                        })
                    });
                }
                function initialPayOut(side, sport) {
                    var childrenListBestOdd = parseInt(shadowRoot.querySelectorAll(`.upper-container.best-odd`)[0].dataset.line);
                    var betMoney = parseInt(5);
                    var PayOut = CalculatePayout(childrenListBestOdd, betMoney);
                                    
                    if ((sport.toLowerCase() !== "soccer" && side.toLowerCase() !== "draw") || (sport.toLowerCase() === "soccer" && side.toLowerCase() === "draw")) {
                        shadowRoot.querySelector(`#${side}FirstPayout`).textContent = `$${PayOut}`;
                        shadowRoot.querySelector(`#${side}FirstPayoutMobile`).textContent = `$${PayOut}`;
                    }
                    
                    var childrenList = shadowRoot.querySelectorAll(`.${side}Container-toggle .upper-container`);
                    var childrenListComparison = shadowRoot.querySelectorAll(`.${side}Container-toggle .comparison-odds`);
                    for (let i = 0; i < childrenList.length; i++) {
                        var oddsComparison = (parseInt(childrenList[i].dataset.line));
                        var payoutComparison = CalculatePayout(oddsComparison, betMoney);
                        childrenListComparison[i].nextElementSibling.innerHTML = `<span>$${payoutComparison}</span>`;
                        childrenListComparison[i].previousElementSibling.innerHTML = "$5";
                    }

                    var childrenListMobile = shadowRoot.querySelectorAll(`.${side}Container-togglemobile .upper-container`);
                    var childrenListComparisonMobile = shadowRoot.querySelectorAll(`.${side}Container-togglemobile .comparison-odds`);
                    for (let i = 0; i < childrenList.length; i++) {
                        var oddsComparisoMobile = (parseInt(childrenListMobile[i].dataset.line));
                        var payoutComparisonMobile = CalculatePayout(oddsComparisoMobile, betMoney);
                        childrenListComparisonMobile[i].nextElementSibling.innerHTML = `<span>$${payoutComparisonMobile}</span>`;
                        childrenListComparisonMobile[i].previousElementSibling.innerHTML = "$5";
                    }
                }
                //Compact Widget 
                function openLine(evt) {
                    var i, tabcontent, tablinks;
                    tabcontent = shadowRoot.querySelectorAll(".covers-BestOddsWidget-compact");
                    for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].className = tabcontent[i].className.replace("show", "");
                    }
                    tablinks = shadowRoot.querySelectorAll(".tablinks");
                    for (i = 0; i < tablinks.length; i++) {
                        tablinks[i].className = tablinks[i].className.replace("active", "");
                    }
                    var columnName = evt.target.innerText.replace(" ", "");
                    shadowRoot.querySelector(`#${columnName}`).classList.add("show");
                    evt.currentTarget.className += " active";
                }
                var tabLinksList = shadowRoot.querySelectorAll(".tablinks");
                tabLinksList.forEach(element => {
                    element.addEventListener("click", openLine)
                })

                function setupEventListeners() {
                    addClickEvent("away");
                    addClickEvent("away", "mobile");
                    addClickEvent("home");
                    addClickEvent("home", "mobile");
                    addClickEvent("draw");
                    addClickEvent("draw", "mobile");

                    if (market !== "all" && (gameId !== null || gameId !== "")) {
                        var leagueSelector = shadowRoot.querySelector("#sportSelect");
                        var sport = leagueSelector.getAttribute("data-sport");


                        initialPayOut("away", sport);
                        initialPayOut("home", sport);
                        initialPayOut("draw", sport);
                    }
                }

                // Set up event listeners
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', setupEventListeners());
                }
                else {
                    setupEventListeners();
                }

                //CMG_SPORTS.setupAccordion($("#cmg_spread_bet_graph_holder", wrapper));

                //$('.cmg_graph_accordion', wrapper).accordion('option', 'active', 0);

                //$('.cmg_graph_accordion', wrapper).accordion("option", "collapsible", false);

            });

        //shadowRoot.appendChild(style);
        //shadowRoot.appendChild(style2);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversMatchupInjury extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        //import { CMG_SPORTS } from 'https://local.covers.com/sports/scripts/app.js';

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        //var style = document.createElement('style');
        //style.textContent = '@import "' + this.host + '/sport/css/best_odds_widgets.css';

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var gameId = this.getAttribute('gameId');
        // League only used in the admin, when setting options from embed code
        //var league = this.getAttribute('league');
        var awayList = this.getAttribute('awayList');
        var homeList = this.getAttribute('homeList');
        var removedList = this.getAttribute('removedList');
        var cta = this.getAttribute('cta');
        var removeHeading = this.getAttribute('removeHeading');

        if (!awayList) {
            awayList = "";
        }
        if (!homeList) {
            homeList = "";
        }
        if (!removedList) {
            removedList = "";
        }
        if (!cta) {
            cta = "";
        }
        if (!removeHeading || removeHeading == "") {
            removeHeading = "false";
        }

        var url = this.host + '/sport/widgets/matchupinjuries?gameId=' + gameId + '&callToAction=' + cta + "&removeHeading=" + removeHeading
            + "&awayList=" + awayList + "&homeList=" + homeList + "&removedList=" + removedList;


        //	loadScript(this, 'https://www.covers.com/sports/scripts/app.js');

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;

                var teamLogos = shadowRoot.querySelectorAll(".covers-CoversIW-teamlogo");
                for (var i = 0; i < teamLogos.length; i++) {
                    teamLogos[i].addEventListener("error", setFallbackImage);
                }

                var buttonAway = shadowRoot.querySelector("#awaymoreinjuriesBtn");
                if (buttonAway) {
                    buttonAway.addEventListener('click', awayinjuriesToggle);
                    function awayinjuriesToggle() {

                        var awayInjuriesBtn = shadowRoot.querySelector("#awaymoreinjuriesBtn");
                        var awayInjuriesRow = shadowRoot.querySelector("#body-awayinjuries");
                        if (awayInjuriesBtn.className == "covers-CoversIW-button arrow-down") {
                            awayInjuriesBtn.classList.remove("arrow-down");
                            awayInjuriesBtn.classList.add("arrow-up");
                            awayInjuriesBtn.innerHTML = "Show Fewer Injuries";
                            awayInjuriesRow.classList.add("override");
                        }
                        else {
                            awayInjuriesBtn.classList.remove("arrow-up");
                            awayInjuriesBtn.classList.add("arrow-down");
                            awayInjuriesBtn.innerHTML = "Show More Injuries";
                            awayInjuriesRow.classList.remove("override");

                        }
                    }
                }
                var buttonHome = shadowRoot.querySelector("#homemoreinjuriesBtn");
                if (buttonHome) {
                    buttonHome.addEventListener('click', homeinjuriesToggle);
                    function homeinjuriesToggle() {
                        var homeInjuriesBtn = shadowRoot.querySelector("#homemoreinjuriesBtn");
                        var homeInjuriesRow = shadowRoot.querySelector("#body-homeinjuries");
                        if (homeInjuriesBtn.className == "covers-CoversIW-button arrow-down") {
                            homeInjuriesBtn.classList.remove("arrow-down");
                            homeInjuriesBtn.classList.add("arrow-up");
                            homeInjuriesBtn.innerHTML = "Show Fewer Injuries";
                            homeInjuriesRow.classList.add("override");
                        }
                        else {
                            homeInjuriesBtn.classList.remove("arrow-up");
                            homeInjuriesBtn.classList.add("arrow-down");
                            homeInjuriesBtn.innerHTML = "Show More Injuries";
                            homeInjuriesRow.classList.remove("override");
                        }
                    }
                }


                var buttonInfo = shadowRoot.querySelectorAll(".covers-CoversIW-status");
                for (let i = 0; i < buttonInfo.length; i++) {
                    var id = buttonInfo[i].id;
                    buttonInfo[i].addEventListener('click', toggleDisplay.bind(id));
                }
                function toggleDisplay(e) {
                    var statusBtnId = e.composedPath()[0].id;
                    var statusBtn = shadowRoot.querySelector(`#${statusBtnId}`);
                    var infoChildren = shadowRoot.querySelectorAll(".covers-CoversIW-info");
                    var arrowChildren = shadowRoot.querySelectorAll(".covers-CoversIW-status");
                    var infoId = "#bottom-" + statusBtnId;
                    var infoItem = shadowRoot.querySelector(infoId);
                    if (statusBtn.className == "covers-CoversIW-status arrow-downStatus") {
                        for (let i = 0; i < arrowChildren.length; i++) {
                            arrowChildren[i].classList.remove("arrow-upStatus");
                            arrowChildren[i].classList.add("arrow-downStatus");
                        }
                        statusBtn.classList.remove("arrow-downStatus");
                        statusBtn.classList.add("arrow-upStatus");
                        for (let i = 0; i < infoChildren.length; i++) {
                            infoChildren[i].classList.add("hide");
                        }
                        infoItem.classList.remove("hide");
                        infoItem.classList.add("display");
                    }
                    else {
                        statusBtn.classList.remove("arrow-upStatus");
                        statusBtn.classList.add("arrow-downStatus");
                        for (let i = 0; i < infoChildren.length; i++) {
                            infoChildren[i].classList.add("hide");
                        }
                    }
                }
            });

        //shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

class CoversArticleContainer extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/Editorial/Content/source/ExternalArticleEmbed.css"'; //Put style here

        var style2 = document.createElement('style');
        style2.textContent = '@import "' + 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css';

        var style3 = document.createElement('style');
        style3.textContent = '@import "' + 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css';

        //Load jquery js
        var script2 = document.createElement("script");
        script2.src = "https://headers.covers.com/scripts/src/external/jquery-3.5.1.min.js";
        shadowRoot.appendChild(script2);

        //Load slick js
        var script = document.createElement("script");
        script.src = "https://headers.covers.com/scripts/src/external/slick.min.js";
        shadowRoot.appendChild(script);

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        var containerSlug = this.getAttribute('slug');
        var header = this.getAttribute('header');

        if (header) {
            var headerTag = "<h3 id=\"covers-ArticleContainerWidget-h3\">";
            var headerReplacementTag = headerTag + header;
        }
        // Use this when going to prod
        var url = this.host + '/articlecontainerwidget/' + containerSlug;


        if (header == null) {
            header = "Articles";
        }

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                if (header) {
                    text = text.replace(headerTag, headerReplacementTag);
                }
                wrapper.innerHTML = text;
                $(document).ready(function () {
                    setTimeout(function () {
                        $('.covers-ArticleContainerWidget-listcont', wrapper).slick({
                            infinite: true,
                            draggable: true,
                            dots: true,
                            mobileFirst: true,
                            autoplay: false,
                            cssEase: 'ease-in-out',
                            responsive: [
                                {
                                    breakpoint: 1200,
                                    settings: "unslick"
                                },
                                {
                                    breakpoint: 992,
                                    settings: "unslick"
                                },
                                {
                                    breakpoint: 768,
                                    settings: "unslick"
                                },
                                {
                                    breakpoint: 550,
                                    settings: {
                                        slidesToShow: 2,
                                        slidesToScroll: 1
                                    }
                                },
                                {
                                    breakpoint: 480,
                                    settings: {
                                        slidesToShow: 1,
                                        slidesToScroll: 1
                                    }
                                }
                                // You can unslick at a given breakpoint now by adding:
                                // settings: "unslick"
                                // instead of a settings object
                            ]
                        });
                    }, 300);
                });
                shadowRoot.appendChild(style);
                shadowRoot.appendChild(style2);
                shadowRoot.appendChild(style3);
                shadowRoot.appendChild(wrapper);
                shadowRoot.appendChild(script);
                shadowRoot.appendChild(script2);
                shadowRoot.appendChild(Slide);
            }
            );
    }
}

class CoversPlayerProps extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {

        var shadowRoot = this.shadowRoot;

        //import { CMG_SPORTS } from 'https://local.covers.com/sports/scripts/app.js';

        this.host = this.getAttribute("host") ? this.getAttribute("host") : "https://www.covers.com";

        // Create some CSS to apply to the shadow dom
        var style = document.createElement('style');
        style.textContent = '@import "' + this.host + '/sport/css/best_odds_widgets.css';

        // FloatThead js
        var scriptFloatThead = document.createElement('script');
        scriptFloatThead.src = "https://cdnjs.cloudflare.com/ajax/libs/floatthead/2.2.1/jquery.floatThead.min.js";
        shadowRoot.appendChild(scriptFloatThead);

        // Best Odds js
        var scriptBestOdds = document.createElement('script');
        scriptBestOdds.src = this.host + "/sport/js/best_odds_widgets.js";
        shadowRoot.appendChild(scriptBestOdds);

        // Create spans
        var wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'wrapper');

        //Get attributes content to use inside
        //var league = this.getAttribute('league');
        var gameId = this.getAttribute('gameId');
        var propevent = this.getAttribute('propevent');
        var cta = this.getAttribute('cta');
        var defaultView = this.getAttribute('defaultView');
        var removeClickouts = this.getAttribute('removeClickouts');
        var removeHeading = this.getAttribute('removeHeading');
        var playerId = this.getAttribute('playerId');

        if (!playerId || playerId == "") {
            playerId = 0;
        }
        if (!cta) {
            cta = "";
        }
        if (!removeClickouts || removeClickouts == "") {
            removeClickouts = "false";
        }
        if (!removeHeading || removeHeading == "") {
            removeHeading = "false";
        }

        var url = this.host + '/sport/widgets/gamepropswidget?gameId=' + gameId + '&propevent=' + propevent
            + '&cta=' + cta + '&removeClickouts=' + removeClickouts + '&defaultView=' + defaultView
            + "&removeHeading=" + removeHeading + "&playerId=" + playerId;

        fetch(url).then(
            (resp) => { return resp.text() }).then((text) => {
                wrapper.innerHTML = text;

                var bothTeam = shadowRoot.querySelector('input[type=radio]#both');
                var awayTeam = shadowRoot.querySelector('input[type=radio]#__awayTeam');
                var homeTeam = shadowRoot.querySelector('input[type=radio]#__homeTeam');
                var containers = shadowRoot.querySelector('.__widgets-mainContainer');
                var teamTable = shadowRoot.querySelector('table.__covers-Covers-widgets-teamTable');
                var oddsTable = shadowRoot.querySelector('table.__covers-Covers-Best-OddsTable');
                var scrollContainers = shadowRoot.querySelectorAll('.covers-CoversWidgets-table-Container');

                function showHidePlayers(team, displayStatus) {
                    var teamPlayers = shadowRoot.querySelectorAll('table tr.' + team.getAttribute("data-team-name"));
                    teamPlayers.forEach((players) => {
                        players.style.display = displayStatus;
                    });
                }

                if (awayTeam) {
                    awayTeam.addEventListener('click', function () {
                        showHidePlayers(awayTeam, "table-row");
                        showHidePlayers(homeTeam, "none");
                    });
                }
                if (homeTeam) {
                    homeTeam.addEventListener('click', function () {
                        showHidePlayers(homeTeam, "table-row");
                        showHidePlayers(awayTeam, "none");
                    });
                }
                if (bothTeam) {
                    bothTeam.addEventListener('click', function () {
                        showHidePlayers(homeTeam, "table-row");
                        showHidePlayers(awayTeam, "table-row");
                    });
                }


                // Set default team filtering
                var teamSelected = shadowRoot.querySelector("input[name='team']:checked").value;

                if (teamSelected) {
                    if (teamSelected == "awayTeam") {
                        awayTeam.click();
                    } else if (teamSelected == "homeTeam") {
                        homeTeam.click();
                    } else {
                        bothTeam.click();
                    }
                }

                if (containers) {
                    for (var i = 0; i < containers.length; i++) {
                        var team = shadowRoot.querySelectorAll(containers[0]).children().first();
                        var scrollCont = shadowRoot.querySelectorAll(containers[0]).find('div.__scrollCont');
                        var box = shadowRoot.querySelectorAll(containers[0]).children().last();
                        var table = shadowRoot.querySelectorAll(scrollCont).find('table').children().first();
                        var tableWidth = shadowRoot.querySelector(table).width();
                        var scrollAreaWidth = shadowRoot.querySelector(scrollCont).width();

                        if (tableWidth > scrollAreaWidth) {
                            shadowRoot.querySelector(box).className += "__boxshadow_for_right_element";
                        }

                        shadowRoot.querySelector(scrollCont).scroll(function (event) {
                            var containerWidth = this.scrollWidth - this.clientWidth;
                            var position = this.scrollLeft;

                            if (position == 0) {
                                shadowRoot.querySelector(team).classList.remove("__boxshadow_for_left_element");
                                shadowRoot.querySelector(box).className += "__boxshadow_for_right_element";
                            }

                            if (position > 0) {
                                shadowRoot.querySelector(team).className += "__boxshadow_for_left_element";
                                shadowRoot.querySelector(box).className += "__boxshadow_for_right_element";
                            }

                            if (position < containerWidth) {
                                shadowRoot.querySelector(team).className += "__boxshadow_for_left_element";
                                shadowRoot.querySelector(box).className += "__boxshadow_for_right_element";

                                if (position == 0) {
                                    shadowRoot.querySelector(team).classList.remove("__boxshadow_for_left_element");
                                }
                            }

                            if (position == containerWidth) {
                                shadowRoot.querySelector(team).className += "__boxshadow_for_left_element";
                                shadowRoot.querySelector(box).classList.remove("__boxshadow_for_right_element");
                            }
                        });
                    }
                }

                document.addEventListener("DOMContentLoaded", function () {
                    if (shadowRoot.querySelector(window).width() < 767) {
                        if (teamTable) {
                            shadowRoot.querySelector(teamTable).floatThead({
                                top: 112,
                                zIndex: 1001,
                                autoReflow: true,
                            });
                        }
                        if (oddsTable) {
                            shadowRoot.querySelector(oddsTable).floatThead({
                                top: 112,
                                zIndex: 1001,
                                autoReflow: true,
                                responsiveContainer: function ($oddsTable) {
                                    return $oddsTable.closest('.__scrollCont', wrapper);
                                }
                            });
                        }
                    } else {
                        if (scrollContainers) {
                            for (var i = 0; i < scrollContainers.length; i++) {
                                var scrollCont = shadowRoot.querySelectorAll(scrollContainers[i]).children()[0];
                                var box = shadowRoot.querySelectorAll(scrollContainers[i]).children()[1];
                                var table = shadowRoot.querySelectorAll(scrollCont).children()[0];
                                var thead = shadowRoot.querySelectorAll(table).children()[0];
                                var th = shadowRoot.querySelector(thead).find('th');
                                var innerCont = shadowRoot.querySelectorAll(scrollCont).children()[1];
                                var innerTable = shadowRoot.querySelectorAll(innerCont).children()[0];
                                var innerThead = shadowRoot.querySelectorAll(innerTable).children()[0];
                                var innerTh = shadowRoot.querySelector(innerThead).find('th');

                                if (table.scrollHeight > scrollCont.offsetHeight) {
                                    shadowRoot.querySelector(box).className += "bottom-shadow";
                                }

                                shadowRoot.querySelector(scrollCont).scroll(function () {
                                    if (shadowRoot.querySelector(this).scrollTop() > 0) {
                                        shadowRoot.querySelector(th).className += "top-shadow";
                                        shadowRoot.querySelector(innerTh).className += "top-shadow";
                                    } else {
                                        shadowRoot.querySelector(th).classList.remove("top-shadow");
                                        shadowRoot.querySelector(innerTh).classList.remove("top-shadow");
                                    }

                                    if (shadowRoot.querySelector(this).scrollTop() + shadowRoot.querySelector(this).innerHeight() == scrollCont.scrollHeight) {
                                        shadowRoot.querySelector(box).classList.remove("bottom-shadow");
                                    } else {
                                        shadowRoot.querySelector(box).className += "bottom-shadow";
                                    }
                                })
                            }
                        }
                    }
                });
            });

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(wrapper);
    }
}

var lazyload = document.currentScript.getAttribute('data-lazy');

if (lazyload === "true") {
    document.addEventListener("DOMContentLoaded",
        function (event) {
            customElements.define('covers-article-minimal', CoversEditorialMinimal);
            customElements.define('covers-consensus', CoversTopConsensus);
            customElements.define('covers-league-consensus', CoversLeagueConsensus);
            customElements.define('covers-matchup-consensus', CoversMatchupConsensus);
            customElements.define('covers-experts-free-pick', ExpertsFreePick);

            customElements.define('covers-best-odds-matchup', CoversBestOddsMatchup);
            customElements.define('covers-lines-league', CoversLineLeague);
            customElements.define('covers-lines-matchup', CoversLineMatchup);
            customElements.define('covers-lines-futures', CoversLineFutures);
            customElements.define('covers-lines-multipartner-futures', CoversLineMultiPartnerFutures);
            customElements.define('covers-lines-golf', CoversLineGolf);
            customElements.define('covers-golf-best-line', CoversGolfBestLine);
            customElements.define('datawidget-multibook-golf', CoversMultibookGolf);
            customElements.define('covers-lines-mma-card', CoversLineMmaCard);
            customElements.define('covers-lines-mma-fight', CoversLineMmaFight);
            customElements.define('covers-player-props', CoversPlayerProps);

            customElements.define('covers-matchup-injury', CoversMatchupInjury);
            customElements.define('covers-matchup-weather', CoversWeather);
            customElements.define('covers-matchup-betgraph', CoversBetgraph);
            customElements.define('covers-polls', CoversPolls);
            customElements.define('covers-article-tags', CoversEditorialTag);
            customElements.define('covers-article-container', CoversArticleContainer);
        });
} else {
    customElements.define('covers-article-minimal', CoversEditorialMinimal);
    customElements.define('covers-consensus', CoversTopConsensus);
    customElements.define('covers-league-consensus', CoversLeagueConsensus);
    customElements.define('covers-matchup-consensus', CoversMatchupConsensus);
    customElements.define('covers-experts-free-pick', ExpertsFreePick);

    customElements.define('covers-best-odds-matchup', CoversBestOddsMatchup);
    customElements.define('covers-lines-league', CoversLineLeague);
    customElements.define('covers-lines-matchup', CoversLineMatchup);
    customElements.define('covers-lines-futures', CoversLineFutures);
    customElements.define('covers-lines-multipartner-futures', CoversLineMultiPartnerFutures);
    customElements.define('covers-lines-golf', CoversLineGolf);
    customElements.define('covers-golf-best-line', CoversGolfBestLine);
    customElements.define('datawidget-multibook-golf', CoversMultibookGolf);
    customElements.define('covers-lines-mma-card', CoversLineMmaCard);
    customElements.define('covers-lines-mma-fight', CoversLineMmaFight);
    customElements.define('covers-player-props', CoversPlayerProps);

    customElements.define('covers-matchup-injury', CoversMatchupInjury);
    customElements.define('covers-matchup-weather', CoversWeather);
    customElements.define('covers-matchup-betgraph', CoversBetgraph);
    customElements.define('covers-polls', CoversPolls);
    customElements.define('covers-article-tags', CoversEditorialTag);
    customElements.define('covers-article-container', CoversArticleContainer);
}