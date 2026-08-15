// =====================================================
// ELEMENTS
// =====================================================

const ideaInput = document.getElementById("ideaInput");

const videoInput = document.getElementById("videoInput");
const uploadArea = document.getElementById("uploadArea");
const uploadContent = document.getElementById("uploadContent");
const uploadBtn = document.getElementById("uploadBtn");

const videoPreview = document.getElementById("videoPreview");
const previewVideo = document.getElementById("previewVideo");
const videoName = document.getElementById("videoName");
const removeVideo = document.getElementById("removeVideo");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");

const wordCount = document.getElementById("wordCount");

const errorBox = document.getElementById("errorBox");

const outputPanel = document.getElementById("outputPanel");
const promptText = document.getElementById("promptText");

const copyBtn = document.getElementById("copyBtn");

const outputLanguage =
    document.getElementById("outputLanguage");

const outputFormat =
    document.getElementById("outputFormat");


// =====================================================
// VIDEO STATE
// =====================================================

let selectedVideo = null;


// =====================================================
// VIDEO UPLOAD
// =====================================================

uploadBtn.addEventListener("click", () => {

    videoInput.click();

});


videoInput.addEventListener("change", () => {

    const file = videoInput.files[0];

    if (!file) {
        return;
    }


    // Store selected video
    selectedVideo = file;


    // Create preview URL
    const videoURL =
        URL.createObjectURL(file);

    previewVideo.src = videoURL;

    videoName.textContent =
        file.name;


    // Hide upload content
    uploadContent.style.display =
        "none";


    // Show video preview
    videoPreview.style.display =
        "block";


    updateGenerateButton();

});


// =====================================================
// REMOVE VIDEO
// =====================================================

removeVideo.addEventListener("click", () => {

    clearVideo();

});


// =====================================================
// CLEAR VIDEO FUNCTION
// =====================================================

function clearVideo() {

    selectedVideo = null;

    videoInput.value = "";


    // Stop video
    previewVideo.pause();

    previewVideo.removeAttribute("src");

    previewVideo.load();


    // Hide preview
    videoPreview.style.display =
        "none";


    // Show upload area
    uploadContent.style.display =
        "block";


    updateGenerateButton();

}


// =====================================================
// WORD COUNT
// =====================================================

function updateWordCount() {

    const text =
        ideaInput.value.trim();


    const count =
        text
            ? text.split(/\s+/).length
            : 0;


    wordCount.textContent =
        count + " words";


    updateGenerateButton();

}


ideaInput.addEventListener(
    "input",
    updateWordCount
);


// =====================================================
// GENERATE + CLEAR BUTTON STATE
// =====================================================

function updateGenerateButton() {

    const hasText =
        ideaInput.value.trim().length > 0;


    const hasVideo =
        selectedVideo !== null;


    // Generate requires description
    generateBtn.disabled = !(hasText && hasVideo);


    // -----------------------------------------
    // CLEAR BUTTON
    // -----------------------------------------

    if (hasText || hasVideo) {

        clearBtn.style.display =
            "block";

    } else {

        clearBtn.style.display =
            "none";

    }

}


// =====================================================
// OUTPUT LANGUAGE
// =====================================================

const languageSelected =
    document.getElementById(
        "languageSelected"
    );


const languageMenu =
    document.getElementById(
        "languageMenu"
    );


const languageSearch =
    document.getElementById(
        "languageSearch"
    );


const languageList =
    document.getElementById(
        "languageList"
    );


const selectedLanguage =
    document.getElementById(
        "selectedLanguage"
    );


const languages = [

    "English",
    "Hindi",
    "Marathi",
    "Gujarati",
    "Bengali",
    "Tamil",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Urdu",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Japanese",
    "Korean",
    "Chinese",
    "Arabic"

];


// =====================================================
// RENDER LANGUAGES
// =====================================================

function renderLanguages(searchText = "") {

    languageList.innerHTML = "";


    const search =
        searchText
            .toLowerCase()
            .trim();


    const filtered =
        languages.filter(
            language =>
                language
                    .toLowerCase()
                    .includes(search)
        );


    if (!filtered.length) {

        languageList.innerHTML = `
            <div class="language-empty">
                No language found
            </div>
        `;

        return;
    }


    filtered.forEach(language => {

        const option =
            document.createElement(
                "div"
            );


        option.className =
            "language-option";


        option.textContent =
            language;


        option.addEventListener(
            "click",
            () => {

                selectedLanguage.textContent =
                    language;


                outputLanguage.value =
                    language;


                languageMenu.classList.remove(
                    "open"
                );


                languageSearch.value =
                    "";


                renderLanguages();

            }
        );


        languageList.appendChild(
            option
        );

    });

}


// =====================================================
// LANGUAGE DROPDOWN
// =====================================================

languageSelected.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        // Close format menu
        formatMenu.classList.remove(
            "open"
        );


        // Toggle language menu
        languageMenu.classList.toggle(
            "open"
        );


        if (
            languageMenu.classList.contains(
                "open"
            )
        ) {

            renderLanguages();

            languageSearch.focus();

        }

    }
);


languageSearch.addEventListener(
    "input",
    () => {

        renderLanguages(
            languageSearch.value
        );

    }
);


// =====================================================
// OUTPUT FORMAT
// =====================================================

const formatSelected =
    document.getElementById(
        "formatSelected"
    );


const formatMenu =
    document.getElementById(
        "formatMenu"
    );


const formatList =
    document.getElementById(
        "formatList"
    );


const selectedFormat =
    document.getElementById(
        "selectedFormat"
    );


const formats = [

    "Original Script",
    "English Letters",
    "Mixed Language"

];


// =====================================================
// RENDER FORMATS
// =====================================================

function renderFormats() {

    formatList.innerHTML = "";


    formats.forEach(format => {

        const option =
            document.createElement(
                "div"
            );


        option.className =
            "language-option";


        option.textContent =
            format;


        option.addEventListener(
            "click",
            () => {

                selectedFormat.textContent =
                    format;


                outputFormat.value =
                    format;


                formatMenu.classList.remove(
                    "open"
                );

            }
        );


        formatList.appendChild(
            option
        );

    });

}


// =====================================================
// FORMAT DROPDOWN
// =====================================================

formatSelected.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        // Close language menu
        languageMenu.classList.remove(
            "open"
        );


        // Toggle format menu
        formatMenu.classList.toggle(
            "open"
        );


        renderFormats();

    }
);


// =====================================================
// CLOSE DROPDOWNS
// =====================================================

document.addEventListener(
    "click",
    () => {

        languageMenu.classList.remove(
            "open"
        );


        formatMenu.classList.remove(
            "open"
        );

    }
);


languageMenu.addEventListener(
    "click",
    event => {

        event.stopPropagation();

    }
);


formatMenu.addEventListener(
    "click",
    event => {

        event.stopPropagation();

    }
);


// =====================================================
// INITIAL RENDER
// =====================================================

renderLanguages();

renderFormats();


// =====================================================
// GENERATE VIDEO PROMPT
// =====================================================

generateBtn.addEventListener(
    "click",
    async () => {

        const idea =
            ideaInput.value.trim();


        if (!idea) {
            return;
        }


        const language =
            outputLanguage.value ||
            "English";


        const format =
            outputFormat.value ||
            "Original Script";


        // -----------------------------------------
        // LOADING
        // -----------------------------------------

        generateBtn.disabled = true;


        generateBtn.innerHTML = `
            <svg
                class="spinner"
                viewBox="0 0 16 16"
            >
                <circle
                    cx="8"
                    cy="8"
                    r="6"
                ></circle>
            </svg>

            Generating prompt
        `;


        errorBox.style.display =
            "none";


        outputPanel.style.display =
            "none";


        try {

            // -----------------------------------------
            // FORM DATA
            // -----------------------------------------

            const formData =
                new FormData();


            formData.append(
                "idea",
                idea
            );


            formData.append(
                "outputLanguage",
                language
            );


            formData.append(
                "outputFormat",
                format
            );


            // -----------------------------------------
            // VIDEO IS OPTIONAL
            // -----------------------------------------

            if (selectedVideo) {

                formData.append(
                    "video",
                    selectedVideo
                );

            }


            // -----------------------------------------
            // SEND TO SERVER
            // -----------------------------------------

            const response =
                await fetch(
                    "/api/video-prompt",
                    {
                        method: "POST",

                        credentials: "include",

                        body: formData
                    }
                );


            // -----------------------------------------
            // RESPONSE
            // -----------------------------------------

            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Request failed"
                );

            }


            const result =
                data.prompt?.trim();


            if (!result) {

                throw new Error(
                    "AI returned an empty response."
                );

            }


            // -----------------------------------------
            // SHOW RESULT
            // -----------------------------------------

            promptText.textContent =
                result;


            outputPanel.style.display =
                "block";


            outputPanel.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });


        } catch (error) {

            console.error(
                "Video prompt error:",
                error
            );


            errorBox.textContent =
                error.message ||
                "Couldn't generate a prompt right now. Try again.";


            errorBox.style.display =
                "block";


        } finally {

            // -----------------------------------------
            // RESTORE GENERATE BUTTON
            // -----------------------------------------

            generateBtn.disabled =
                ideaInput.value.trim().length === 0;


            generateBtn.innerHTML =
                "Generate prompt →";


            // Make sure clear button state is correct
            updateGenerateButton();

        }

    }
);


// =====================================================
// CLEAR EVERYTHING
// =====================================================

clearBtn.addEventListener(
    "click",
    () => {

        // -----------------------------------------
        // CLEAR DESCRIPTION
        // -----------------------------------------

        ideaInput.value = "";


        // -----------------------------------------
        // CLEAR VIDEO
        // -----------------------------------------

        clearVideo();


        // -----------------------------------------
        // CLEAR GENERATED PROMPT
        // -----------------------------------------

        promptText.textContent = "";


        outputPanel.style.display =
            "none";


        // -----------------------------------------
        // CLEAR ERROR
        // -----------------------------------------

        errorBox.style.display =
            "none";


        errorBox.textContent =
            "Couldn't generate a prompt right now. Try again.";


        // -----------------------------------------
        // RESET WORD COUNT
        // -----------------------------------------

        wordCount.textContent =
            "0 words";


        // -----------------------------------------
        // RESET LANGUAGE
        // -----------------------------------------

        selectedLanguage.textContent =
            "English";


        outputLanguage.value =
            "English";


        // -----------------------------------------
        // RESET FORMAT
        // -----------------------------------------

        selectedFormat.textContent =
            "Original Script";


        outputFormat.value =
            "Original Script";


        // -----------------------------------------
        // RESET DROPDOWNS
        // -----------------------------------------

        languageMenu.classList.remove(
            "open"
        );


        formatMenu.classList.remove(
            "open"
        );


        // -----------------------------------------
        // RESET SEARCH
        // -----------------------------------------

        languageSearch.value =
            "";


        // -----------------------------------------
        // RESET COPY BUTTON
        // -----------------------------------------

        copyBtn.textContent =
            "Copy prompt";


        // -----------------------------------------
        // UPDATE BUTTONS
        // -----------------------------------------

        updateWordCount();

        updateGenerateButton();

    }
);


// =====================================================
// COPY GENERATED PROMPT
// =====================================================

copyBtn.addEventListener(
    "click",
    async () => {

        const text =
            promptText.textContent.trim();


        if (!text) {
            return;
        }


        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    text
                );

            } else {

                fallbackCopy(text);

            }


            copyBtn.textContent =
                "Copied ✓";


            setTimeout(() => {

                copyBtn.textContent =
                    "Copy prompt";

            }, 1800);


        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );


            errorBox.textContent =
                "Couldn't copy automatically. Please copy the prompt manually.";


            errorBox.style.display =
                "block";

        }

    }
);


// =====================================================
// FALLBACK COPY
// =====================================================

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.left =
        "-9999px";


    textarea.style.top =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    const success =
        document.execCommand(
            "copy"
        );


    document.body.removeChild(
        textarea
    );


    if (!success) {

        throw new Error(
            "Copy failed"
        );

    }

}


// =====================================================
// INITIALIZE
// =====================================================

updateWordCount();

updateGenerateButton();
// =====================================================
// TOOL NAVIGATION - ACTIVE + SLIDING INDICATOR
// =====================================================

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

const toolButtons =
    document.querySelectorAll(".tool-btn");

const toolSlider =
    document.querySelector(".tool-slider");


toolButtons.forEach((btn, index) => {

    const linkPage =
        btn.getAttribute("href")
            .split("/")
            .pop();


    if (linkPage === currentPage) {

        btn.classList.add("active");

        if (toolSlider) {
            toolSlider.style.transform =
                `translateX(${index * 100}%)`;
        }

    }

});

// =====================================================
// HAMBURGER MENU
// =====================================================

if (
    hamburgerBtn &&
    hamburgerMenu
) {

    hamburgerBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            // Close profile dropdown
            if (profileDropdown) {

                profileDropdown.classList.remove(
                    "open"
                );

            }


            // Toggle hamburger menu
            hamburgerMenu.classList.toggle(
                "open"
            );

        }
    );


    // Keep hamburger open
    // when clicking inside menu

    hamburgerMenu.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );
}


// =====================================================
// PROFILE DROPDOWN
// =====================================================

if (
    profileBtn &&
    profileDropdown
) {

    profileBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            // IMPORTANT:
            // Do NOT close hamburger here.
            // Profile is inside hamburger.

            const isOpen =
                profileDropdown.classList.contains(
                    "open"
                );


            // Close first

            profileDropdown.classList.remove(
                "open"
            );


            // Open if previously closed

            if (!isOpen) {

                profileDropdown.classList.add(
                    "open"
                );

            }

        }
    );


    // Keep profile dropdown open
    // when clicking inside it

    profileDropdown.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );
}


// =====================================================
// CLOSE MENUS OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function () {

        if (hamburgerMenu) {

            hamburgerMenu.classList.remove(
                "open"
            );

        }

        if (profileDropdown) {

            profileDropdown.classList.remove(
                "open"
            );

        }

    }
);


// =====================================================
// INITIALIZE AUTHENTICATION
// =====================================================

checkAuthentication();