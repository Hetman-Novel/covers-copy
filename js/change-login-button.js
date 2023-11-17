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