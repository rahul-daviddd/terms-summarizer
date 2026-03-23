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

document.getElementById("summarize").onclick = async () => {

    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.tabs.sendMessage(tab.id, {type: "GET_TERMS"}, async (text) => {
        if (!text || text.trim().length === 0) {
            document.getElementById("summary").innerText = "No terms text found.";
            document.getElementById("warnings").innerText = "";
            document.getElementById("risk").innerText = "";
            return;
        }

        let response = await fetch("http://localhost:8080/api/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: text
        });

        let summary = await response.text();

        document.getElementById("summary").innerText = summary;

        let warnings = buildWarnings(text);
        document.getElementById("warnings").innerText = warnings.length > 0
            ? warnings.join(", ")
            : "None";

        let riskLevel = extractRiskLevel(summary);
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
    });
};
