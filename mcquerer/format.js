function formatResponse(text) {
    let formattedText = "";
    let lines = text.split("\n").filter(line => line.trim() !== ""); // Remove empty lines
    let isAnswerSection = false;
    let isTable = false;
    let tableHTML = "";

    for (let line of lines) {
        if (line.includes("sebatiaA")) {
            isAnswerSection = true;
            line = line.replace("sebatiaA", ""); // Remove marker
        }

        let bgColorClass = isAnswerSection ? "green-bg" : "blue-bg";

        // Detect Markdown-style table headers
        if (line.match(/^\|.*\|$/) && !isTable) {
            isTable = true;
            tableHTML = `<table class="${bgColorClass}"><tr>`;
            let headers = line.split("|").filter(item => item.trim() !== "");
            headers.forEach(header => {
                tableHTML += `<th>${header.trim()}</th>`;
            });
            tableHTML += "</tr>";
            continue;
        }

        // Detect table row (Markdown-style)
        if (isTable && line.match(/^\|.*\|$/)) {
            tableHTML += "<tr>";
            let rowValues = line.split("|").filter(item => item.trim() !== "");
            rowValues.forEach(value => {
                tableHTML += `<td>${value.trim()}</td>`;
            });
            tableHTML += "</tr>";
            continue;
        }

        // End of table
        if (isTable && !line.match(/^\|.*\|$/)) {
            isTable = false;
            tableHTML += "</table>";
            formattedText += tableHTML;
        }

        // Detect Headings
        if (line.startsWith("**") && line.endsWith("**")) {
            formattedText += `<p class="heading ${bgColorClass}">${line.slice(2, -2)}</p>`;
        } else {
            formattedText += `<p class="${bgColorClass}">${line}</p>`;
        }
    }

    // In case table ends at last line
    if (isTable) {
        formattedText += "</table>";
    }

    setTimeout(() => {
        if (window.MathJax && MathJax.typesetPromise) {
            MathJax.typesetPromise();
        }
    }, 50);

    return formattedText;
}

window.formatResponse = formatResponse;
