// =====================================================
// ELEMENTS
// =====================================================

const ideaInput =
    document.getElementById("ideaInput");

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


const loginPopup =
    document.getElementById("loginPopup");

const loginPopupClose =
    document.getElementById("loginPopupClose");

const popupLoginBtn =
    document.getElementById("popupLoginBtn");

const popupContinueBtn =
    document.getElementById("popupContinueBtn");


// =====================================================
// OUTPUT LANGUAGE ELEMENTS
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


// =====================================================
// LANGUAGES
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


// =====================================================
// RENDER LANGUAGES
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

    filtered.forEach(
        language => {

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

                    if (selectedLanguage) {

                        selectedLanguage.textContent =
                            language;

                    }

                    if (outputLanguage) {

                        outputLanguage.value =
                            language;

                    }

                    if (languageMenu) {

                        languageMenu.classList.remove(
                            "open"
                        );

                    }

                    if (languageSearch) {

                        languageSearch.value =
                            "";

                    }

                    renderLanguages();

                }
            );

            languageList.appendChild(
                option
            );

        }
    );

}


// =====================================================
// OUTPUT FORMAT ELEMENTS
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


// =====================================================
// FORMATS
// =====================================================

const formats = [

    "Original Script",
    "English Letters",
    "Mixed Language"

];


// =====================================================
// RENDER FORMATS
// =====================================================

function renderFormats() {

    if (!formatList) {
        return;
    }

    formatList.innerHTML = "";

    formats.forEach(
        format => {

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

                    if (selectedFormat) {

                        selectedFormat.textContent =
                            format;

                    }

                    if (outputFormat) {

                        outputFormat.value =
                            format;

                    }

                    if (formatMenu) {

                        formatMenu.classList.remove(
                            "open"
                        );

                    }

                }
            );

            formatList.appendChild(
                option
            );

        }
    );

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
            count + " words";

    }

    updateGenerateButton();

}


if (ideaInput) {

    ideaInput.addEventListener(
        "input",
        updateWordCount
    );

}


// =====================================================
// GENERATE BUTTON STATE
// =====================================================

function updateGenerateButton() {

    if (!ideaInput) {
        return;
    }

    const hasText =
        ideaInput.value.trim().length > 0;

    if (generateBtn) {

        generateBtn.disabled =
            !hasText;

    }

    if (clearBtn) {

        if (hasText) {

            clearBtn.style.display =
                "block";

        } else {

            clearBtn.style.display =
                "none";

        }

    }

}


// =====================================================
// LANGUAGE DROPDOWN
// =====================================================

if (
    languageSelected &&
    languageMenu
) {

    languageSelected.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (formatMenu) {

                formatMenu.classList.remove(
                    "open"
                );

            }

            languageMenu.classList.toggle(
                "open"
            );

            if (
                languageMenu.classList.contains(
                    "open"
                )
            ) {

                renderLanguages();

                if (languageSearch) {

                    languageSearch.focus();

                }

            }

        }
    );

}


// =====================================================
// LANGUAGE SEARCH
// =====================================================

if (languageSearch) {

    languageSearch.addEventListener(
        "input",
        () => {

            renderLanguages(
                languageSearch.value
            );

        }
    );

}


// =====================================================
// FORMAT DROPDOWN
// =====================================================

if (
    formatSelected &&
    formatMenu
) {

    formatSelected.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            if (languageMenu) {

                languageMenu.classList.remove(
                    "open"
                );

            }

            formatMenu.classList.toggle(
                "open"
            );

            renderFormats();

        }
    );

}


// =====================================================
// CLOSE DROPDOWNS
// =====================================================

document.addEventListener(
    "click",
    () => {

        if (languageMenu) {

            languageMenu.classList.remove(
                "open"
            );

        }

        if (formatMenu) {

            formatMenu.classList.remove(
                "open"
            );

        }

    }
);


// =====================================================
// KEEP LANGUAGE MENU OPEN
// =====================================================

if (languageMenu) {

    languageMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );

}


// =====================================================
// KEEP FORMAT MENU OPEN
// =====================================================

if (formatMenu) {

    formatMenu.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );

}


// =====================================================
// INITIAL RENDER
// =====================================================

renderLanguages();

renderFormats();


// =====================================================
// GENERATE TEXT PROMPT
// =====================================================


if (generateBtn) {

    generateBtn.addEventListener(
        "click",
        async () => {

            if (!ideaInput) {
                return;
            }

            const idea =
                ideaInput.value.trim();

            if (!idea) {
                return;
            }


            const language =
                outputLanguage?.value ||
                "English";

            const format =
                outputFormat?.value ||
                "Original Script";


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


            if (errorBox) {

                errorBox.style.display =
                    "none";

            }


            if (outputPanel) {

                outputPanel.style.display =
                    "none";

            }


            try {

                // -----------------------------------------
                // SEND TO SERVER
                // -----------------------------------------

                const response =
                    await fetch(
                        "/api/generate",
                        {
                            method: "POST",

                            credentials: "include",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                idea: idea,

                                outputLanguage:
                                    language,

                                outputFormat:
                                    format

                            })

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

                if (promptText) {

                    promptText.textContent =
                        result;

                }


                if (outputPanel) {

                    outputPanel.style.display =
                        "block";

                    outputPanel.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });

                }


            } catch (error) {

                console.error(
                    "Text prompt error:",
                    error
                );


                if (errorBox) {

                    errorBox.textContent =
                        error.message ||
                        "Couldn't generate a prompt right now. Try again.";

                    errorBox.style.display =
                        "block";

                }


            } finally {

                // -----------------------------------------
                // RESTORE GENERATE BUTTON
                // -----------------------------------------

                generateBtn.innerHTML =
                    "Generate prompt →";


                // Update button state
                updateGenerateButton();

            }

        }
    );

}



// =====================================================
// CLEAR EVERYTHING
// =====================================================

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        () => {

            // -----------------------------------------
            // CLEAR DESCRIPTION
            // -----------------------------------------

            if (ideaInput) {

                ideaInput.value =
                    "";

            }


            // -----------------------------------------
            // CLEAR GENERATED PROMPT
            // -----------------------------------------

            if (promptText) {

                promptText.textContent =
                    "";

            }


            if (outputPanel) {

                outputPanel.style.display =
                    "none";

            }


            // -----------------------------------------
            // CLEAR ERROR
            // -----------------------------------------

            if (errorBox) {

                errorBox.style.display =
                    "none";

                errorBox.textContent =
                    "Couldn't generate a prompt right now. Try again.";

            }


            // -----------------------------------------
            // RESET WORD COUNT
            // -----------------------------------------

            if (wordCount) {

                wordCount.textContent =
                    "0 words";

            }


            // -----------------------------------------
            // RESET LANGUAGE
            // -----------------------------------------

            if (selectedLanguage) {

                selectedLanguage.textContent =
                    "English";

            }


            if (outputLanguage) {

                outputLanguage.value =
                    "English";

            }


            // -----------------------------------------
            // RESET FORMAT
            // -----------------------------------------

            if (selectedFormat) {

                selectedFormat.textContent =
                    "Original Script";

            }


            if (outputFormat) {

                outputFormat.value =
                    "Original Script";

            }


            // -----------------------------------------
            // RESET DROPDOWNS
            // -----------------------------------------

            if (languageMenu) {

                languageMenu.classList.remove(
                    "open"
                );

            }


            if (formatMenu) {

                formatMenu.classList.remove(
                    "open"
                );

            }


            // -----------------------------------------
            // RESET SEARCH
            // -----------------------------------------

            if (languageSearch) {

                languageSearch.value =
                    "";

            }


            // -----------------------------------------
            // RESET COPY BUTTON
            // -----------------------------------------

            if (copyBtn) {

                copyBtn.textContent =
                    "Copy prompt";

            }


            // -----------------------------------------
            // UPDATE BUTTONS
            // -----------------------------------------

            updateWordCount();

            updateGenerateButton();

        }
    );

}


// =====================================================
// COPY GENERATED PROMPT
// =====================================================

if (copyBtn) {

    copyBtn.addEventListener(
        "click",
        async () => {

            if (!promptText) {
                return;
            }


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


                setTimeout(
                    () => {

                        copyBtn.textContent =
                            "Copy prompt";

                    },
                    1800
                );


            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );


                if (errorBox) {

                    errorBox.textContent =
                        "Couldn't copy automatically. Please copy the prompt manually.";

                    errorBox.style.display =
                        "block";

                }

            }

        }
    );

}


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
// TOOL NAVIGATION
// ACTIVE + SLIDING INDICATOR
// =====================================================

const currentPage =
    window.location.pathname
        .split("/")
        .pop() ||
    "index.html";


const toolButtons =
    document.querySelectorAll(
        ".tool-btn"
    );


const toolSlider =
    document.querySelector(
        ".tool-slider, .nav-indicator"
    );


toolButtons.forEach(
    (btn, index) => {

        const href =
            btn.getAttribute(
                "href"
            );


        if (!href) {
            return;
        }


        const linkPage =
            href
                .split("/")
                .pop();


        if (
            linkPage ===
            currentPage
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
// HAMBURGER / PROFILE ELEMENTS
// =====================================================

const hamburgerBtn =
    document.getElementById(
        "hamburgerBtn"
    );


const hamburgerMenu =
    document.getElementById(
        "hamburgerMenu"
    );


const profileBtn =
    document.getElementById(
        "profileBtn"
    );


const profileDropdown =
    document.getElementById(
        "profileDropdown"
    );


const profileMenu =
    document.getElementById(
        "profileMenu"
    );


const mobileAuthBtn =
    document.getElementById(
        "mobileAuthBtn"
    );


// =====================================================
// PROFILE ELEMENTS
// =====================================================

const profileNameEl =
    document.getElementById(
        "profileName"
    );


const profileDropdownNameEl =
    document.getElementById(
        "profileDropdownName"
    );


const profileDropdownEmailEl =
    document.getElementById(
        "profileEmail"
    );


const profileAvatarEls =
    document.querySelectorAll(
        ".profile-avatar"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// =====================================================
// PROTECTED LINKS
// =====================================================

const protectedLinks =
    document.querySelectorAll(
        ".protected-link[data-protected='true']"
    );


protectedLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                const target =
                    link.dataset.target ||
                    link.getAttribute(
                        "href"
                    );


                const isLoggedIn =
                    await checkAuthentication();


                if (isLoggedIn) {

                    window.location.href =
                        target;

                    return;

                }


                const currentPage =
                    window.location.pathname +
                    window.location.search +
                    window.location.hash;


                window.location.href =
                    "/login.html?redirect=" +
                    encodeURIComponent(
                        target
                    );

            }
        );

    }
);


// =====================================================
// POPULATE USER PROFILE
// =====================================================

function populateUserProfile(user) {

    const displayName =
        user.name ||
        user.username ||
        "User";


    const email =
        user.email ||
        "";


    const initial =
        displayName
            .trim()
            .charAt(0)
            .toUpperCase() ||
        "U";


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
        encodeURIComponent(
            currentPage
        )
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
                    "/index.html";

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


            if (profileDropdown) {

                profileDropdown.classList.remove(
                    "open"
                );

            }


            hamburgerMenu.classList.toggle(
                "open"
            );

        }
    );


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


            const isOpen =
                profileDropdown.classList.contains(
                    "open"
                );


            profileDropdown.classList.remove(
                "open"
            );


            if (!isOpen) {

                profileDropdown.classList.add(
                    "open"
                );

            }

        }
    );


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
// INITIALIZE
// =====================================================

updateWordCount();

updateGenerateButton();


// =====================================================
// AUTHENTICATION
// =====================================================

async function checkAuthentication() {

    // -----------------------------------------
    // DEFAULT: LOGGED OUT
    // -----------------------------------------

    if (mobileAuthBtn) {

        mobileAuthBtn.style.display =
            "block";

    }


    if (profileMenu) {

        profileMenu.style.display =
            "none";

    }


    document.body.classList.remove(
        "user-logged-in"
    );


    try {

        const response =
            await fetch(
                "/api/me",
                {
                    method: "GET",

                    credentials: "include",

                    cache: "no-store"
                }
            );


        if (!response.ok) {

            return false;

        }


        const data =
            await response.json();


        // -----------------------------------------
        // LOGGED IN
        // -----------------------------------------

        if (
            data.loggedIn === true &&
            data.user
        ) {

            populateUserProfile(
                data.user
            );


            document.body.classList.add(
                "user-logged-in"
            );


            if (mobileAuthBtn) {

                mobileAuthBtn.style.display =
                    "none";

            }


            if (profileMenu) {

                profileMenu.style.display =
                    "block";

            }


            return true;

        }


        // -----------------------------------------
        // LOGGED OUT
        // -----------------------------------------

        if (mobileAuthBtn) {

            mobileAuthBtn.style.display =
                "block";

        }


        if (profileMenu) {

            profileMenu.style.display =
                "none";

        }


        document.body.classList.remove(
            "user-logged-in"
        );


        return false;


    } catch (error) {

        console.error(
            "Authentication check failed:",
            error
        );


        if (mobileAuthBtn) {

            mobileAuthBtn.style.display =
                "block";

        }


        if (profileMenu) {

            profileMenu.style.display =
                "none";

        }


        document.body.classList.remove(
            "user-logged-in"
        );


        return false;

    }

}


// =====================================================
// LOGIN / SIGN UP BUTTON
// =====================================================

if (mobileAuthBtn) {

    mobileAuthBtn.addEventListener(
        "click",
        () => {

            const currentPage =
                window.location.pathname +
                window.location.search +
                window.location.hash;


            window.location.href =
                "/login.html?redirect=" +
                encodeURIComponent(
                    currentPage
                );

        }
    );

}


// =====================================================
// INITIALIZE AUTHENTICATION
// =====================================================

checkAuthentication();