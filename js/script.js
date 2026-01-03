// Selecting elements
const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

// Function to search word
function searchWord() {
    const word = wordInput.value.trim();

    // Empty input check
    if (word === "") {
        alert("Please enter a word");
        return;
    }

    resultDiv.innerHTML = "Loading...";

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            // Word not found
            if (data.title === "No Definitions Found") {
                resultDiv.innerHTML = 
                    "<p>Word not found. Please try another word.</p>";
                return;
            }

            // Extracting data
            const meaningData = data[0].meanings[0];
            const definitionData = meaningData.definitions[0];

            const meaning = definitionData.definition;
            const example = definitionData.example || "Example not available";
            const partOfSpeech = meaningData.partOfSpeech;

            // Synonyms & Antonyms
            const synonyms = definitionData.synonyms.length > 0
                ? definitionData.synonyms.join(", ")
                : "Not available";

            const antonyms = definitionData.antonyms.length > 0
                ? definitionData.antonyms.join(", ")
                : "Not available";

            // Phonetic
            const phonetic = data[0].phonetic || "Not available";

            // Audio pronunciation
            let audioButton = "";
            if (data[0].phonetics[0] && data[0].phonetics[0].audio) {
                audioButton = `
                    <audio controls>
                        <source src="${data[0].phonetics[0].audio}">
                    </audio>
                `;
            }

            // Display result
            resultDiv.innerHTML = `
                <p><strong>Word:</strong> ${word}</p>
                <p><strong>Meaning:</strong> ${meaning}</p>
                <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
                <p><strong>Example:</strong> ${example}</p>
                <p><strong>Phonetic:</strong> ${phonetic}</p>
                <p><strong>Synonyms:</strong> ${synonyms}</p>
                <p><strong>Antonyms:</strong> ${antonyms}</p>
                ${audioButton}
            `;
        })
        .catch(error => {
            resultDiv.innerHTML =
                "<p>Something went wrong. Please try again.</p>";
            console.error(error);
        });
}

// Button click
searchBtn.addEventListener("click", searchWord);

// Enter key press
wordInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});
