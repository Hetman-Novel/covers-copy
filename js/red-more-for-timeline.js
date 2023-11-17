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