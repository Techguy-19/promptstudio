// =====================================================
// ELEMENTS
// =====================================================

const ideaInput =
    document.getElementById("ideaInput");

const voiceInput =
    document.getElementById("voiceInput");

const uploadBtn =
    document.getElementById("uploadBtn");

const uploadContent =
    document.getElementById("uploadContent");

const audioPreview =
    document.getElementById("audioPreview");

const previewAudio =
    document.getElementById("previewAudio");

const voiceName =
    document.getElementById("voiceName");

const removeVoice =
    document.getElementById("removeVoice");

const generateBtn =
    document.getElementById("generateBtn");

const clearBtn =
    document.getElementById("clearBtn");

const wordCount =
    document.getElementById("wordCount");

const errorBox =
    document.getElementById("errorBox");

const outputPanel =
    document.getElementById("outputPanel");

const promptText =
    document.getElementById("promptText");

const copyBtn =
    document.getElementById("copyBtn");

const outputLanguage =
    document.getElementById("outputLanguage");

const outputFormat =
    document.getElementById("outputFormat");


// =====================================================
// VOICE STATE
// =====================================================

let selectedVoice = null;


// =====================================================
// VOICE UPLOAD
// =====================================================

uploadBtn.addEventListener("click", () => {

    voiceInput.click();

});


voiceInput.addEventListener("change", () => {

    const file =
        voiceInput.files[0];

    if (!file) {
        return;
    }


    selectedVoice = file;


    const audioURL =
        URL.createObjectURL(file);


    previewAudio.src =
        audioURL;


    voiceName.textContent =
        file.name;


    uploadContent.style.display =
        "none";


    audioPreview.style.display =
        "block";


    updateButtonState();

});


// =====================================================
// REMOVE VOICE
// =====================================================

removeVoice.addEventListener("click", () => {

    clearVoice();

});


// =====================================================
// CLEAR VOICE
// =====================================================

function clearVoice() {

    selectedVoice = null;

    voiceInput.value = "";


    previewAudio.pause();

    previewAudio.removeAttribute("src");

    previewAudio.load();


    audioPreview.style.display =
        "none";


    uploadContent.style.display =
        "block";


    updateButtonState();

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


    updateButtonState();

}


ideaInput.addEventListener(
    "input",
    updateWordCount
);


// =====================================================
// BUTTON STATE
// =====================================================

function updateButtonState() {

    const hasText =
        ideaInput.value.trim().length > 0;


    const hasVoice =
        selectedVoice !== null;


    // Description is required
    generateBtn.disabled =
        !hasText;


    // Clear appears when anything exists
    if (hasText || hasVoice) {

        clearBtn.style.display =
            "block";

    } else {

        clearBtn.style.display =
            "none";

    }

}


// =====================================================
// LANGUAGE
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
// FORMAT
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
    "Voice Generation Prompt",
    "Detailed Voice Description",
    "ElevenLabs Style Prompt"

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
// INITIAL RENDER
// =====================================================

renderLanguages();

renderFormats();


// =====================================================
// GENERATE VOICE PROMPT
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

        generateBtn.disabled =
            true;


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


            // Voice is optional
            if (selectedVoice) {

                formData.append(
                    "voice",
                    selectedVoice
                );

            }


            // -----------------------------------------
            // SEND TO SERVER
            // -----------------------------------------

            const response =
                await fetch(
                    "/api/voice-prompt",
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
                "Voice prompt error:",
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


            updateButtonState();

        }

    }
);


// =====================================================
// CLEAR EVERYTHING
// =====================================================

clearBtn.addEventListener(
    "click",
    () => {

        // Clear description
        ideaInput.value = "";


        // Clear voice
        clearVoice();


        // Clear generated output
        promptText.textContent = "";

        outputPanel.style.display =
            "none";


        // Clear error
        errorBox.style.display =
            "none";


        // Reset word count
        wordCount.textContent =
            "0 words";


        // Reset language
        selectedLanguage.textContent =
            "English";

        outputLanguage.value =
            "English";


        // Reset format
        selectedFormat.textContent =
            "Original Prompt";

        outputFormat.value =
            "Original Prompt";


        // Close dropdowns
        languageMenu.classList.remove(
            "open"
        );

        formatMenu.classList.remove(
            "open"
        );


        // Clear search
        languageSearch.value =
            "";


        // Reset copy button
        copyBtn.textContent =
            "Copy prompt";


        // Update state
        updateWordCount();

        updateButtonState();

    }
);


// =====================================================
// COPY PROMPT
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

updateButtonState();
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