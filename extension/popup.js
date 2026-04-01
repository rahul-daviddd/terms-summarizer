function extractRiskLevel(summary) {
    let match = summary.match(/risk level:\s*(low|medium|high)/i);
    if (!match) {
        match = summary.match(/\b(low|medium|high)\b/i);
    }
    return match ? match[1].toUpperCase() : "";
}

function buildWarnings(text) {
    let warnings = [];
    let lower = text.toLowerCase();

    if (lower.includes("automatically renew") || lower.includes("auto renewal")) {
        warnings.push("Auto renewal");
    }

    if (lower.includes("third party") || lower.includes("third-party")) {
        warnings.push("Data sharing");
    }

    return warnings;
}

function displayResults(summary, warningsText, riskLevel) {
    document.getElementById("summary").innerText = summary;
    document.getElementById("warnings").innerText = warningsText;

    let riskEl = document.getElementById("risk");
    riskEl.innerText = riskLevel ? riskLevel : "UNKNOWN";

    if (riskLevel === "HIGH") {
        riskEl.style.color = "red";
    } else if (riskLevel === "MEDIUM") {
        riskEl.style.color = "orange";
    } else if (riskLevel === "LOW") {
        riskEl.style.color = "green";
    } else {
        riskEl.style.color = "black";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, {type: "GET_ANALYSIS"}, (response) => {
        if (chrome.runtime.lastError) return;
        if (response && response.summary) {
            displayResults(response.summary, response.warningsText, response.riskLevel);
        }
    });
});

document.getElementById("summarize").onclick = async () => {
    const btn = document.getElementById("summarize");
    const loading = document.getElementById("loading");

    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.tabs.sendMessage(tab.id, {type: "GET_TERMS"}, async (text) => {
        if (!text || text.trim().length === 0) {
            document.getElementById("summary").innerText = "No terms text found.";
            document.getElementById("warnings").innerText = "";
            document.getElementById("risk").innerText = "";
            return;
        }

        // Show loading, disable button
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";
        loading.style.display = "flex";

        try {
            let response = await fetch("http://localhost:8080/api/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: text
            });

            let rawSummary = await response.text();

            let riskLevel = extractRiskLevel(rawSummary);
            let summary = rawSummary.replace(/risk:?\s*(low|medium|high)/i, "").trim();

            // Add the flag emoji
            summary = summary.replace(/Red flags:/gi, "🚩 Red flags:");

            let warnings = buildWarnings(text);
            let warningsText = warnings.length > 0 ? warnings.join(", ") : "None";

            displayResults(summary, warningsText, riskLevel);

            chrome.tabs.sendMessage(tab.id, {
                type: "SAVE_ANALYSIS",
                data: { summary, warningsText, riskLevel }
            });
        } catch (error) {
            console.error("Fetch failed:", error);
            document.getElementById("summary").innerText = "Error: Could not reach the server.";
        } finally {
            // Hide loading, enable button
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            loading.style.display = "none";
        }
    });
};
