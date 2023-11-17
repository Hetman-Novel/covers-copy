function sendAdobeEvent(filterCategory, componentValue) {
    var componentEvent = new CustomEvent('componentInteraction', {bubbles: true, detail: { componentName: "Toplist Filter", componentOption: "Filter by " + filterCategory, componentValue: componentValue, componentType: "Checkbox", interactionType: "Select", componentLocation: "Not Applicable"}});
    window.dispatchEvent(componentEvent);
}