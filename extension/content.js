function extractTerms() {
    let candidates = [];

    document.querySelectorAll("p, li").forEach(el => {
        let text = el.innerText.toLowerCase();

        if (
            text.includes("terms") ||
            text.includes("conditions") ||
            text.includes("agreement") ||
            text.includes("privacy") ||
            text.includes("liability")
        ) {
            candidates.push(el.innerText);
        }
    });

    return candidates.join("\n");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_TERMS") {
        sendResponse(extractTerms());
    }
});
