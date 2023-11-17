/*!
* jQuery Cookie Plugin v1.4.1
* https://github.com/carhartl/jquery-cookie
*
* Copyright 2013 Klaus Hartl
* Released under the MIT license
*
* =============================================================================================
*  NOTE: Modified Jan.2020 by O.Vydykhan to handle samesite requirement for cookies (SPT-785)
* =============================================================================================
*/
!function (e) { "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? e(require("jquery")) : e(jQuery) }(function (v) { var n = /\+/g; function x(e) { return l.raw ? e : encodeURIComponent(e) } function k(e, o) { var i = l.raw ? e : function (e) { 0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")); try { return e = decodeURIComponent(e.replace(n, " ")), l.json ? JSON.parse(e) : e } catch (e) { } }(e); return v.isFunction(o) ? o(i) : i } var l = v.cookie = function (e, o, i) { if (void 0 !== o && !v.isFunction(o)) { if ("number" == typeof (i = v.extend({}, l.defaults, i)).expires) { var n = i.expires, t = i.expires = new Date; t.setTime(+t + 864e5 * n) } return document.cookie = [x(e), "=", (r = o, x(l.json ? JSON.stringify(r) : String(r))), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : "", i.samesite ? "; samesite=" + i.samesite : ""].join("") } for (var r, c, s = e ? void 0 : {}, a = document.cookie ? document.cookie.split("; ") : [], u = 0, d = a.length; u < d; u++) { var f = a[u].split("="), p = (c = f.shift(), l.raw ? c : decodeURIComponent(c)), m = f.join("="); if (e && e === p) { s = k(m, o); break } e || void 0 === (m = k(m)) || (s[p] = m) } return s }; l.defaults = {}, v.removeCookie = function (e, o) { return void 0 !== v.cookie(e) && (v.cookie(e, "", v.extend({}, o, { expires: -1 })), !v.cookie(e)) } });

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