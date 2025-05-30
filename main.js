// Get elements from the DOM
const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const shiftKeyInput = document.getElementById("shift-input"); // Changed to shiftKeyInput
const modulo = document.getElementById("mod-input");
const alphabet = document.getElementById("alphabet-input");
const letterCase = document.getElementById("letter-case");
const foreignChars = document.getElementById("foreign-chars");

// Change headings and clear fields based on encoding or decoding
selectEncodeOrDecode.forEach((option) => {
    option.addEventListener("click", () => {
        const isEncode = option.value === "encode";
        hInput.textContent = isEncode ? "Plaintext" : "Ciphertext";
        hOutput.textContent = isEncode ? "Ciphertext" : "Plaintext";
        inputText.value = "";
        outputText.textContent = "";

        // Auto-change shift value to negative when switching to decode
        if (!isEncode) {
            const currentShiftValue = parseInt(shiftKeyInput.value, 10) || 0;
            shiftKeyInput.value = -currentShiftValue;
        } else {
            const currentShiftValue = parseInt(shiftKeyInput.value, 10) || 0;
            if (currentShiftValue < 0)
                shiftKeyInput.value = -currentShiftValue;
        }
    });
});

// Perform Caesar Cipher on form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Retrieve input values
    const inputTextValue = inputText.value;
    const selectedOption = Array.from(selectEncodeOrDecode).find((option) => option.checked)?.value;
    const shiftValue = parseInt(shiftKeyInput.value, 10) || 0; // Use shiftKeyInput
    const moduloValue = parseInt(modulo.value, 10) || 26; // Default to 26 (English alphabet)
    const alphabetValue = alphabet.value || "abcdefghijklmnopqrstuvwxyz0123456789";
    const letterCaseValue = parseInt(letterCase.value, 10);
    const shouldRemoveForeignChars = foreignChars.checked; // Assuming foreignChars is a checkbox

    console.log("Input Values:", {
        mode: selectedOption,
        text: inputTextValue,
        shift: shiftValue,
        modulo: moduloValue,
        alphabet: alphabetValue,
        removeForeign: shouldRemoveForeignChars,
        letterCase: letterCaseValue,
    });

    // Validate input
    if (!inputTextValue || isNaN(shiftValue) || isNaN(moduloValue)) {
        alert("Please provide valid input text, shift value, and modulus.");
        return;
    }

    /**
     * Caesar Cipher Implementation
     * @param {string} mode - Either "encode" or "decode".
     * @param {string} text - Input text to process.
     * @param {number} shift - Shift value for the cipher.
     * @param {number} mod - Modulus value for wrapping around.
     * @param {string} charset - Character set to use.
     * @param {boolean} removeForeign - Whether to remove non-alphanumeric characters.
     * @returns {string} Processed text.
     */
    function caesarCipher(mode, text, shift, mod, charset, removeForeign) {
        if (mode === "decode") {
            shift = -shift;
            console.log("Decoding, new shift:", shift); // Log the shift value during decoding
        }
        if (removeForeign) text = text.replace(/[^a-zA-Z0-9 ]/g, "");
        const lowerCharset = charset.toLowerCase();
        return Array.from(text).map((char) => {
            const index = lowerCharset.indexOf(char.toLowerCase());
            if (index === -1) return char; // Skip characters not in the charset
            let newIndex = (index + shift) % mod;
            if (newIndex < 0) newIndex += mod;
            const newChar = lowerCharset[newIndex];
            return char === char.toLowerCase() ? newChar : newChar.toUpperCase();
        }).join("");
    }

    // Generate cipher output
    let cipherOutput = caesarCipher(
        selectedOption,
        inputTextValue,
        shiftValue,
        moduloValue,
        alphabetValue,
        shouldRemoveForeignChars
    );

    console.log("Cipher Output before case:", cipherOutput);

    // Apply letter casing if specified
    if (letterCaseValue === 2) cipherOutput = cipherOutput.toLowerCase();
    else if (letterCaseValue === 3) cipherOutput = cipherOutput.toUpperCase();

    console.log("Final Cipher Output:", cipherOutput);

    // Display the output
    outputText.textContent = cipherOutput;
});
