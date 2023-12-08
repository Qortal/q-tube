export function convertQortalLinks(inputHtml) {
    // Regular expression to match 'qortal://...' URLs. 
    // This will stop at the first whitespace, comma, or HTML tag
    var regex = /(qortal:\/\/[^\s,<]+)/g;

    // Replace matches in inputHtml with formatted anchor tag
    var outputHtml = inputHtml.replace(regex, function (match) {
        return `<a href="${match}" className="qortal-link">${match}</a>`;
    });

    return outputHtml;
}

export function extractTextFromHTML(htmlString: any, length = 150) {
    // Create a temporary DOM element
    const tempDiv = document.createElement("div");
    // Replace br tags and block-level tags with a space before setting the HTML content
    const htmlWithSpaces = htmlString.replace(/<\/?(br|p|div|h[1-6]|ul|ol|li|blockquote)[^>]*>/gi, ' ');
    tempDiv.innerHTML = htmlWithSpaces;
    // Extract the text content
    let text = tempDiv.textContent || tempDiv.innerText || "";
    // Replace multiple spaces with a single space and trim
    text = text.replace(/\s+/g, ' ').trim();
    // Slice the text to the desired length
    return text.slice(0, length);
  }