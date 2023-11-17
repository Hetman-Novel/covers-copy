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
            } else {
                display.innerHTML = "Tap to copy";
            }
        });
    }, 1200);
}