// =====================================================
// ELEMENTS
// =====================================================

const ideaInput = document.getElementById("ideaInput");

const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const uploadContent = document.getElementById("uploadContent");
const uploadBtn = document.getElementById("uploadBtn");

const filePreview = document.getElementById("filePreview");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const removeFile = document.getElementById("removeFile");

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
// FILE STATE
// =====================================================

let selectedFile = null;


// =====================================================
// FILE UPLOAD
// =====================================================

uploadBtn.addEventListener("click", () => {

    fileInput.click();

});


fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    selectedFile = file;

    fileName.textContent = file.name;

    fileSize.textContent = formatFileSize(file.size);

    uploadContent.style.display = "none";

    filePreview.style.display = "flex";

    updateButtonStates();

});


// =====================================================
// FILE SIZE
// =====================================================

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.floor(
            Math.log(bytes) / Math.log(1024)
        );

    const size =
        bytes /
        Math.pow(1024, index);

    return (
        size.toFixed(
            index === 0 ? 0 : 1
        ) +
        " " +
        units[index]
    );
}


// =====================================================
// REMOVE FILE
// =====================================================

removeFile.addEventListener("click", () => {

    clearFile();

});


// =====================================================
// CLEAR FILE
// =====================================================

function clearFile() {

    selectedFile = null;

    fileInput.value = "";

    fileName.textContent = "file.pdf";

    fileSize.textContent = "0 KB";

    filePreview.style.display = "none";

    uploadContent.style.display = "block";

    updateButtonStates();

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

    updateButtonStates();

}


ideaInput.addEventListener(
    "input",
    updateWordCount
);


// =====================================================
// BUTTON STATE
// =====================================================

function updateButtonStates() {

    const hasText =
        ideaInput.value.trim().length > 0;

    generateBtn.disabled =
        !hasText;

    const hasSomethingToClear =
        hasText ||
        selectedFile !== null ||
        promptText.textContent.trim().length > 0 ||
        errorBox.style.display === "block";

    clearBtn.style.display =
        hasSomethingToClear
            ? "block"
            : "none";
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
            document.createElement("div");

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

                languageSearch.value = "";

                renderLanguages();

            }
        );


        languageList.appendChild(option);

    });

}


// =====================================================
// LANGUAGE DROPDOWN
// =====================================================

languageSelected.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        formatMenu.classList.remove(
            "open"
        );

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

    "Original Prompt",
    "Detailed Prompt",
    "Structured Prompt",
    "Short Prompt"

];


// =====================================================
// RENDER FORMATS
// =====================================================

function renderFormats() {

    formatList.innerHTML = "";

    formats.forEach(format => {

        const option =
            document.createElement("div");

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


        formatList.appendChild(option);

    });

}


// =====================================================
// FORMAT DROPDOWN
// =====================================================

formatSelected.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        languageMenu.classList.remove(
            "open"
        );

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
// GENERATE FILE PROMPT
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
            "Original Prompt";


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


            // File is optional

            if (selectedFile) {

                formData.append(
                    "file",
                    selectedFile
                );

            }


            // -----------------------------------------
            // SEND TO SERVER
            // -----------------------------------------

            const response =
                await fetch(
                    "/api/file-prompt",
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
                "File prompt error:",
                error
            );


            errorBox.textContent =
                error.message ||
                "Couldn't generate a prompt right now. Try again.";

            errorBox.style.display =
                "block";


        } finally {

            generateBtn.disabled =
                ideaInput.value.trim().length === 0;

            generateBtn.innerHTML =
                "Generate prompt →";

            updateButtonStates();

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
        // CLEAR FILE
        // -----------------------------------------

        clearFile();


        // -----------------------------------------
        // CLEAR OUTPUT
        // -----------------------------------------

        promptText.textContent = "";

        outputPanel.style.display =
            "none";


        // -----------------------------------------
        // CLEAR ERROR
        // -----------------------------------------

        errorBox.style.display =
            "none";


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
            "Original Prompt";

        outputFormat.value =
            "Original Prompt";


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

        languageSearch.value = "";


        // -----------------------------------------
        // UPDATE UI
        // -----------------------------------------

        updateWordCount();

        updateButtonStates();

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

            updateButtonStates();

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

renderLanguages();

renderFormats();

updateWordCount();

updateButtonStates();
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
// HAMBURGER / PROFILE ELEMENTS
// =====================================================

const hamburgerBtn =
    document.getElementById("hamburgerBtn");

const hamburgerMenu =
    document.getElementById("hamburgerMenu");

const profileBtn =
    document.getElementById("profileBtn");

const profileDropdown =
    document.getElementById("profileDropdown");


// =====================================================
// PROFILE ELEMENTS
// =====================================================

const profileNameEl =
    document.getElementById("profileName");

const profileDropdownNameEl =
    document.getElementById("profileDropdownName");

const profileDropdownEmailEl =
    document.getElementById("profileEmail");

const profileAvatarEls =
    document.querySelectorAll(".profile-avatar");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// AUTHENTICATION
// =====================================================

async function checkAuthentication() {

    try {

        const response = await fetch(
            "/api/me",
            {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            redirectToLogin();
            return false;
        }

        const data =
            await response.json();

        if (
            data.loggedIn === true &&
            data.user
        ) {

            populateUserProfile(data.user);

            document.body.classList.add(
                "user-logged-in"
            );

            return true;
        }

        redirectToLogin();

        return false;

    } catch (error) {

        console.error(
            "Authentication check failed:",
            error
        );

        redirectToLogin();

        return false;
    }
}


// =====================================================
// POPULATE USER PROFILE
// =====================================================

function populateUserProfile(user) {

    const displayName =
        user.name ||
        user.username ||
        "User";

    const email =
        user.email || "";

    const initial =
        displayName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    if (profileNameEl) {

        profileNameEl.textContent =
            displayName;

    }


    if (profileDropdownNameEl) {

        profileDropdownNameEl.textContent =
            displayName;

    }


    if (profileDropdownEmailEl) {

        profileDropdownEmailEl.textContent =
            email;

    }


    profileAvatarEls.forEach(
        avatar => {

            avatar.textContent =
                initial;

        }
    );
}


// =====================================================
// REDIRECT TO LOGIN
// =====================================================

function redirectToLogin() {

    const currentPage =
        window.location.pathname +
        window.location.search +
        window.location.hash;

    window.location.replace(
        "/login.html?redirect=" +
        encodeURIComponent(currentPage)
    );
}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                await fetch(
                    "/api/logout",
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );

            } catch (error) {

                console.error(
                    "Logout request error:",
                    error
                );

            } finally {

                window.location.href =
                    "/login.html";
            }
        }
    );
}


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