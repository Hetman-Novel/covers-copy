var CMG_ArticleCarousel = function (elementId) {

    var percent = 0,
        interval = 30,          // 30 = 6 seconds, 20 = 4 seconds
        $crsl = $(elementId),   // Carousel element
        $bar = $('.transition-timer-carousel-progress-bar');

    // When prev/next arrows are clicked on carousel, progress bar shrinks to 0.5%.
    // Width can be set to 0 to hide the bar
    $('.carousel-indicators li, .carousel-control').click(function () { $bar.css({ width: 0.5 + '%' }); });

    // Initialize the carousel if container exists
    if ($crsl.length !== 0) {
        $crsl.carousel({
            interval: false,
            pause: true
        }).on('slide.bs.carousel', function () { percent = 0; });       // Fires when the bootstrap slide instance method is invoked.
    }


    function progressBarCarousel() {
        $bar.css({ width: percent + '%' });
        percent = percent + 0.5;
        if (percent >= 100) {
            percent = 0;
            $crsl.carousel('next');
        }
    }

    var barInterval = setInterval(progressBarCarousel, interval);   // Set interval for progressBarCarousel()

    // Hover event for desktop browser
    if (!(/Mobi/.test(navigator.userAgent))) {
        $crsl.hover(
            function () {
                clearInterval(barInterval);
            },
            function () {
                barInterval = setInterval(progressBarCarousel, interval);
            }
        );
    }
};

var CMG_ArticleBar_LoadMoreArticles = function (url, buttonElement, headerElement, articleBlockElement) {
    buttonElement.css("display", "none");
    headerElement.append("<div class='covers-LoadingCircleAnimation'></div>")
    setTimeout(function () {
        $.ajax({
            url: url, success: function (result) {
                if (result !== "\r\n<div>\r\n</div>") {
                    articleBlockElement.append(result);
                    buttonElement.css("display", "block");
                }
            },
            statusCode: {
                204: function () {
                    $(".covers-CoversArchivePagination").remove();
                }
            },
            complete: function (result) {
                $(".covers-LoadingCircleAnimation").remove();
            }
        });
    }, 1000);
};
