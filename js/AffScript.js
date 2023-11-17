class AdblockDetector {
    constructor() {
        this.bannerIds = [
            'AdHeader',
            'AdContainer',
            'AD_Top',
            'homead',
            'ad-lead'
        ];
        this.init();
    }
    init() {
        const dataContainer = document.createElement('div');
        dataContainer.innerHTML = this.generatesBannersString();
        document.body.appendChild(dataContainer);
    }
    detect() {
        return !this.bannerIds.every(bannerId => this.checkVisibility(bannerId));
    }
    generatesBannersString() {
        return this
            .bannerIds
            .map(bannerId => `<div id="${bannerId}"></div>`)
            .join('');
    }
    checkVisibility(bannerId) {
        const el = document.querySelector(`#${bannerId}`);
        if (el)
            return el.offsetParent;
        return null;
    }
}

const detectorHandler = () => {
    const Detector = new AdblockDetector();
    const isAdBlockActive = Detector.detect();
    handleAdBlock(isAdBlockActive);
}

const handleAdBlock = (isAdBlockActive) => {
    if (isAdBlockActive) {
        Array.from(document.querySelectorAll('a[target="_blank"]'))
            .forEach(link => link.setAttribute('target', '_self'));
    }
}

window.addEventListener('load', function () {
    detectorHandler();
    setTimeout(detectorHandler, 2000);
})