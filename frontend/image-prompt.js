// =====================================================
// PROMPT STUDIO - IMAGE PROMPT TOOL
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const imageInput = document.getElementById("imageInput");
const uploadBox = document.getElementById("uploadBox");
const uploadBtn = document.getElementById("uploadBtn");
const uploadContent = document.getElementById("uploadContent");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");
const imageName = document.getElementById("imageName");
const removeImageBtn = document.getElementById("removeImageBtn");

const ideaInput = document.getElementById("ideaInput");
const outputLanguage = document.getElementById("outputLanguage");
const outputFormat = document.getElementById("outputFormat");
const imageStyle = document.getElementById("imageStyle");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const wordCount = document.getElementById("wordCount");

const errorBox = document.getElementById("errorBox");
const outputPanel = document.getElementById("outputPanel");
const promptText = document.getElementById("promptText");
const copyBtn = document.getElementById("copyBtn");


// =====================================================
// PROFILE / AUTH ELEMENTS
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
// DROPDOWN ELEMENTS
// =====================================================

// Language

const languageSelected =
    document.getElementById("languageSelected");

const languageMenu =
    document.getElementById("languageMenu");

const languageSearch =
    document.getElementById("languageSearch");

const languageList =
    document.getElementById("languageList");

const selectedLanguage =
    document.getElementById("selectedLanguage");


// Format

const formatSelected =
    document.getElementById("formatSelected");

const formatMenu =
    document.getElementById("formatMenu");

const formatList =
    document.getElementById("formatList");

const selectedFormat =
    document.getElementById("selectedFormat");


// Style

const styleSelected =
    document.getElementById("styleSelected");

const styleMenu =
    document.getElementById("styleMenu");

const styleList =
    document.getElementById("styleList");

const selectedStyle =
    document.getElementById("selectedStyle");


// =====================================================
// HAMBURGER / PROFILE
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
// TOOL NAVIGATION
// =====================================================

const currentPathPage =
    window.location.pathname
        .split("/")
        .pop() || "index.html";

const toolButtons =
    document.querySelectorAll(".tool-btn");

const toolSlider =
    document.querySelector(".tool-slider");


// =====================================================
// DATA
// =====================================================

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

const formats = [
    "Original Script",
    "English Letters",
    "Mixed Language"
];

const styles = [
    "Original / Realistic",
    "Cinematic",
    "Anime",
    "Cartoon",
    "3D",
    "Ghibli-inspired",
    "Illustration",
    "Watercolor",
    "Cyberpunk",
    "Fantasy",
    "Minimalist",
    "Photorealistic"
];


// =====================================================
// IMAGE STATE
// =====================================================

let selectedImage = null;


// =====================================================
// AUTHENTICATION
// =====================================================

async function checkAuthentication() {

    try {

        const response = await fetch("/api/me", {
            method: "GET",
            credentials: "include",
            cache: "no-store"
        });

        if (!response.ok) {
            redirectToLogin();
            return false;
        }

        const data = await response.json();

        if (data.loggedIn === true && data.user) {

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
// IMAGE UPLOAD
// =====================================================

function handleImage(file) {

    if (!file.type.startsWith("image/")) {

        showError(
            "Please select a valid image file."
        );

        return;
    }

    selectedImage = file;

    const reader =
        new FileReader();

    reader.onload =
        function (event) {

            if (previewImage) {
                previewImage.src =
                    event.target.result;
            }

            if (imageName) {
                imageName.textContent =
                    file.name;
            }

            if (uploadContent) {
                uploadContent.style.display =
                    "none";
            }

            if (imagePreview) {
                imagePreview.style.display =
                    "block";
            }

            updateWordCount();
        };

    reader.readAsDataURL(file);
}


// Open file picker

if (uploadBtn && imageInput) {

    uploadBtn.addEventListener(
        "click",
        function () {
            imageInput.click();
        }
    );
}


// Upload box

if (uploadBox && imageInput) {

    uploadBox.addEventListener(
        "click",
        function (event) {

            if (
                event.target === uploadBox ||
                event.target.closest(".upload-content")
            ) {
                imageInput.click();
            }
        }
    );


    uploadBox.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            uploadBox.classList.add(
                "dragging"
            );
        }
    );


    uploadBox.addEventListener(
        "dragleave",
        function () {

            uploadBox.classList.remove(
                "dragging"
            );
        }
    );


    uploadBox.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            uploadBox.classList.remove(
                "dragging"
            );

            const file =
                event.dataTransfer.files[0];

            if (file) {
                handleImage(file);
            }
        }
    );
}


// File input

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                imageInput.files[0];

            if (file) {
                handleImage(file);
            }
        }
    );
}


// =====================================================
// REMOVE IMAGE
// =====================================================

if (removeImageBtn) {

    removeImageBtn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            selectedImage = null;

            if (imageInput) {
                imageInput.value = "";
            }

            if (previewImage) {
                previewImage.src = "";
            }

            if (imagePreview) {
                imagePreview.style.display =
                    "none";
            }

            if (uploadContent) {
                uploadContent.style.display =
                    "block";
            }

            updateWordCount();
        }
    );
}


// =====================================================
// GENERATE BUTTON STATE
// =====================================================

function updateGenerateButton() {

    if (!generateBtn || !ideaInput) {
        return;
    }

    const hasDescription =
        ideaInput.value.trim().length > 0;

    generateBtn.disabled =
        !hasDescription;
}


// =====================================================
// WORD COUNT
// =====================================================

function updateWordCount() {

    if (!ideaInput) {
        return;
    }

    const text =
        ideaInput.value.trim();

    const count =
        text
            ? text.split(/\s+/).length
            : 0;

    if (wordCount) {

        wordCount.textContent =
            count.toLocaleString() +
            " words";
    }

    updateGenerateButton();

    if (clearBtn) {

        clearBtn.style.display =
            (
                ideaInput.value ||
                selectedImage ||
                (promptText &&
                    promptText.textContent)
            )
                ? "block"
                : "none";
    }
}


if (ideaInput) {

    ideaInput.addEventListener(
        "input",
        updateWordCount
    );
}


// =====================================================
// CLEAR
// =====================================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            if (ideaInput) {
                ideaInput.value = "";
            }

            if (imageInput) {
                imageInput.value = "";
            }

            selectedImage = null;

            if (previewImage) {
                previewImage.src = "";
            }

            if (imagePreview) {
                imagePreview.style.display =
                    "none";
            }

            if (uploadContent) {
                uploadContent.style.display =
                    "block";
            }

            if (promptText) {
                promptText.textContent = "";
            }

            if (outputPanel) {
                outputPanel.style.display =
                    "none";
            }

            if (errorBox) {
                errorBox.style.display =
                    "none";
            }

            updateWordCount();
        }
    );
}


// =====================================================
// GENERIC DROPDOWN CLOSE
// =====================================================

function closeAllDropdowns() {

    if (languageMenu) {
        languageMenu.classList.remove("open");
    }

    if (formatMenu) {
        formatMenu.classList.remove("open");
    }

    if (styleMenu) {
        styleMenu.classList.remove("open");
    }
}


// =====================================================
// LANGUAGE DROPDOWN
// =====================================================

function renderLanguages(searchText = "") {

    if (!languageList) {
        return;
    }

    languageList.innerHTML = "";

    const search =
        searchText
            .toLowerCase()
            .trim();

    const filteredLanguages =
        languages.filter(
            language =>
                language
                    .toLowerCase()
                    .includes(search)
        );


    if (!filteredLanguages.length) {

        languageList.innerHTML = `
            <div class="language-empty">
                No language found
            </div>
        `;

        return;
    }


    filteredLanguages.forEach(
        function (language) {

            const option =
                document.createElement("div");

            option.className =
                "language-option";

            option.textContent =
                language;


            option.addEventListener(
                "click",
                function () {

                    if (selectedLanguage) {
                        selectedLanguage.textContent =
                            language;
                    }

                    if (outputLanguage) {
                        outputLanguage.value =
                            language;
                    }

                    closeAllDropdowns();

                    if (languageSearch) {
                        languageSearch.value = "";
                    }

                    renderLanguages();
                }
            );


            languageList.appendChild(option);
        }
    );
}


if (languageSelected) {

    languageSelected.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (
                languageMenu &&
                languageMenu.classList.contains("open")
            ) {

                closeAllDropdowns();

                return;
            }

            closeAllDropdowns();

            if (languageMenu) {

                languageMenu.classList.add("open");

                renderLanguages();

                if (languageSearch) {
                    languageSearch.focus();
                }
            }
        }
    );
}


if (languageSearch) {

    languageSearch.addEventListener(
        "input",
        function () {

            renderLanguages(
                languageSearch.value
            );
        }
    );
}


if (languageMenu) {

    languageMenu.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();
        }
    );
}


// =====================================================
// FORMAT DROPDOWN
// =====================================================

function renderFormats() {

    if (!formatList) {
        return;
    }

    formatList.innerHTML = "";

    formats.forEach(
        function (format) {

            const option =
                document.createElement("div");

            option.className =
                "language-option";

            option.textContent =
                format;


            option.addEventListener(
                "click",
                function () {

                    if (selectedFormat) {
                        selectedFormat.textContent =
                            format;
                    }

                    if (outputFormat) {
                        outputFormat.value =
                            format;
                    }

                    closeAllDropdowns();
                }
            );


            formatList.appendChild(option);
        }
    );
}


if (formatSelected) {

    formatSelected.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (
                formatMenu &&
                formatMenu.classList.contains("open")
            ) {

                closeAllDropdowns();

                return;
            }

            closeAllDropdowns();

            if (formatMenu) {

                formatMenu.classList.add("open");

                renderFormats();
            }
        }
    );
}


if (formatMenu) {

    formatMenu.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();
        }
    );
}


renderFormats();


// =====================================================
// IMAGE STYLE DROPDOWN
// =====================================================

function renderStyles() {

    if (!styleList) {
        return;
    }

    styleList.innerHTML = "";

    styles.forEach(
        function (style) {

            const option =
                document.createElement("div");

            option.className =
                "language-option";

            option.textContent =
                style;


            option.addEventListener(
                "click",
                function () {

                    if (selectedStyle) {
                        selectedStyle.textContent =
                            style;
                    }

                    if (imageStyle) {
                        imageStyle.value =
                            style;
                    }

                    closeAllDropdowns();
                }
            );


            styleList.appendChild(option);
        }
    );
}


if (styleSelected) {

    styleSelected.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (
                styleMenu &&
                styleMenu.classList.contains("open")
            ) {

                closeAllDropdowns();

                return;
            }

            closeAllDropdowns();

            if (styleMenu) {

                styleMenu.classList.add("open");

                renderStyles();
            }
        }
    );
}


if (styleMenu) {

    styleMenu.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();
        }
    );
}


renderStyles();


// =====================================================
// CLOSE DROPDOWNS OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function () {

        closeAllDropdowns();
    }
);


// =====================================================
// COPY
// =====================================================

function fallbackCopy(text) {

    const textarea =
        document.createElement("textarea");

    textarea.value = text;

    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";

    document.body.appendChild(
        textarea
    );

    textarea.focus();
    textarea.select();

    let success = false;

    try {

        success =
            document.execCommand("copy");

    } catch (error) {

        success = false;
    }

    document.body.removeChild(
        textarea
    );

    return success;
}


function showCopied() {

    if (!copyBtn) {
        return;
    }

    copyBtn.textContent =
        "Copied ✓";

    copyBtn.classList.add(
        "copied"
    );

    setTimeout(
        function () {

            copyBtn.textContent =
                "Copy prompt";

            copyBtn.classList.remove(
                "copied"
            );

        },
        1800
    );
}


if (copyBtn) {

    copyBtn.addEventListener(
        "click",
        async function () {

            const text =
                promptText
                    ? promptText.textContent
                    : "";

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

                    showCopied();

                    return;
                }

                if (fallbackCopy(text)) {

                    showCopied();

                    return;
                }

                throw new Error(
                    "Copy failed"
                );

            } catch (error) {

                if (fallbackCopy(text)) {

                    showCopied();

                } else {

                    showError(
                        "Couldn't copy automatically. Select the text above and copy it manually."
                    );
                }
            }
        }
    );
}


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    if (!errorBox) {
        return;
    }

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";
}


// =====================================================
// GENERATE IMAGE PROMPT
// =====================================================

if (generateBtn) {

    generateBtn.addEventListener(
        "click",
        async function () {

            const idea =
                ideaInput
                    ? ideaInput.value.trim()
                    : "";

            if (!idea) {
                return;
            }


            const selectedLanguageValue =
                outputLanguage?.value ||
                "English";

            const selectedFormatValue =
                outputFormat?.value ||
                "Original Script";

            const selectedStyleValue =
                imageStyle?.value ||
                "Original / Realistic";


            // Loading

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


            if (errorBox) {
                errorBox.style.display =
                    "none";
            }

            if (outputPanel) {
                outputPanel.style.display =
                    "none";
            }


            try {

                const formData =
                    new FormData();

                formData.append(
                    "idea",
                    idea
                );

                formData.append(
                    "outputLanguage",
                    selectedLanguageValue
                );

                formData.append(
                    "outputFormat",
                    selectedFormatValue
                );

                formData.append(
                    "imageStyle",
                    selectedStyleValue
                );


                if (selectedImage) {

                    formData.append(
                        "referenceImage",
                        selectedImage
                    );
                }


                const response =
                    await fetch(
                        "/api/generate",
                        {
                            method: "POST",
                            credentials: "include",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Request failed"
                    );
                }


                const text =
                    data.prompt?.trim();


                if (!text) {

                    throw new Error(
                        "AI returned an empty response."
                    );
                }


                if (promptText) {

                    promptText.textContent =
                        text;
                }


                if (outputPanel) {

                    outputPanel.style.display =
                        "block";
                }


                if (outputPanel) {

                    outputPanel.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }


            } catch (error) {

                console.error(
                    "Image prompt generation error:",
                    error
                );

                showError(
                    error.message ||
                    "Couldn't generate a prompt right now. Try again."
                );


            } finally {

                generateBtn.disabled =
                    !ideaInput ||
                    ideaInput.value.trim().length === 0;

                generateBtn.innerHTML =
                    "Generate prompt →";

                updateWordCount();
            }
        }
    );
}


// =====================================================
// TOOL NAVIGATION
// =====================================================

toolButtons.forEach(
    function (btn, index) {

        const href =
            btn.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPage =
            href
                .split("/")
                .pop()
                .split("#")[0];


        if (
            linkPage ===
            currentPathPage
        ) {

            btn.classList.add(
                "active"
            );


            if (toolSlider) {

                toolSlider.style.transform =
                    `translateX(${index * 100}%)`;
            }
        }
    }
);


// =====================================================
// HAMBURGER + PROFILE MENU
// =====================================================

if (hamburgerBtn && hamburgerMenu) {

    hamburgerBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        // Close profile dropdown
        if (profileDropdown) {
            profileDropdown.classList.remove("open");
        }

        // Toggle hamburger menu
        hamburgerMenu.classList.toggle("open");
    });

    // Keep menu open when clicking inside it
    hamburgerMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });
}


// =====================================================
// PROFILE DROPDOWN
// =====================================================

if (profileBtn && profileDropdown) {

    profileBtn.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        // IMPORTANT:
        // Do NOT close hamburger menu here.
        // Profile dropdown is inside hamburger menu.

        const isOpen =
            profileDropdown.classList.contains("open");

        // Close profile dropdown first
        profileDropdown.classList.remove("open");

        // Open if it was previously closed
        if (!isOpen) {
            profileDropdown.classList.add("open");
        }

    });


    // Keep profile dropdown open when clicking inside it
    profileDropdown.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();
        }
    );
}

// =====================================================
// CLOSE MENUS WHEN CLICKING OUTSIDE
// =====================================================

document.addEventListener("click", function () {

    if (hamburgerMenu) {
        hamburgerMenu.classList.remove("open");
    }

    if (profileDropdown) {
        profileDropdown.classList.remove("open");
    }

});


// =====================================================
// INITIALIZATION
// =====================================================

async function initializeImageTool() {

    const authenticated =
        await checkAuthentication();

    if (!authenticated) {
        return;
    }

    updateWordCount();
}

initializeImageTool();