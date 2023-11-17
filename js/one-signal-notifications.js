//SUBNAV HIGHLIGHT
function subNavHighlight() {
    var currentUrl = window.location.pathname;
    currentUrl = currentUrl.replace(/\/$/, "");
    currentUrl = decodeURIComponent(currentUrl);
    var found = false;

    var currentUrlArray = currentUrl.split('/');

    while (currentUrlArray.length != 0) {
        if (!found) {
            //check for exact match
            $("nav.covers-CoversSubNav2 li a").each(function () {
                var menuHref = $(this).attr('href');
                if (currentUrlArray.join('/').toLowerCase().trim() === menuHref.toLowerCase().trim()) {
                    $(this).closest('li').addClass('covers-CoversSubNav-highlight');
                    found = true;
                }
            });
        }
        currentUrlArray.pop();
    };
}
subNavHighlight();

/*
* Light YouTube Embeds by labnol
* Credit: https://www.labnol.org/
*/
function labnolIframe(div) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute(
        'src',
        'https://www.youtube.com/embed/' + div.dataset.id + '?autoplay=1&rel=0'
    );
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '1');
    iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    );
    div.parentNode.replaceChild(iframe, div);
}