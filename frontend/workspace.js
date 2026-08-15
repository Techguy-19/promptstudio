// =====================================================
// PROMPT STUDIO - WORKSPACE JS
// Firebase / Backend Connected Version
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const navItems = document.querySelectorAll(
    ".nav-item[data-section], .mobile-nav-item[data-section]"
);

const sections = document.querySelectorAll(
    ".workspace-section"
);

const pageTitle = document.getElementById(
    "pageTitle"
);

const userName = document.getElementById(
    "userName"
);

const userAvatar = document.getElementById(
    "userAvatar"
);

const profileAvatar = document.getElementById(
    "profileAvatar"
);

const profileName = document.getElementById(
    "profileName"
);

const profileEmail = document.getElementById(
    "profileEmail"
);

const generatedCount = document.getElementById(
    "generatedCount"
);

const savedCount = document.getElementById(
    "savedCount"
);

const historyCount = document.getElementById(
    "historyCount"
);

const recentPrompts = document.getElementById(
    "recentPrompts"
);

const historyList = document.getElementById(
    "historyList"
);

const savedList = document.getElementById(
    "savedList"
);

const historySearch = document.getElementById(
    "historySearch"
);

const clearHistoryBtn = document.getElementById(
    "clearHistoryBtn"
);

const logoutBtn = document.getElementById(
    "logoutBtn"
);


// =====================================================
// USER DATA
// =====================================================

let currentUser = null;

let promptHistory = [];

let savedPrompts = [];


// =====================================================
// API HELPER
// =====================================================

async function apiRequest(
    url,
    options = {}
) {

    const defaultOptions = {
        credentials: "include",
        cache: "no-store"
    };

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...(options.headers || {})
        }
    };

    try {

        const response = await fetch(
            url,
            finalOptions
        );

        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {

            const errorMessage =
                data.error ||
                `Request failed with status ${response.status}`;

            const error =
                new Error(errorMessage);

            error.status =
                response.status;

            error.data =
                data;

            throw error;
        }

        return data;

    } catch (error) {

        console.error(
            `API Error: ${url}`,
            error
        );

        throw error;
    }
}


// =====================================================
// GET USER / LOGIN STATUS
// =====================================================

async function loadUser() {

    try {

        const data = await apiRequest(
            "/api/me",
            {
                method: "GET"
            }
        );

        console.log(
            "API /api/me:",
            data
        );

        if (
            data.loggedIn === true &&
            data.user
        ) {

            currentUser =
                data.user;

            // Display cache only.
            // Authentication itself is controlled
            // by the backend session.

            localStorage.setItem(
                "promptStudioUser",
                JSON.stringify(
                    currentUser
                )
            );

            displayUser();

            return true;
        }


        // -------------------------------------------------
        // NOT LOGGED IN
        // -------------------------------------------------

        localStorage.removeItem(
            "promptStudioUser"
        );

        redirectToLogin();

        return false;

    } catch (error) {

        console.error(
            "Unable to check login status:",
            error
        );

        localStorage.removeItem(
            "promptStudioUser"
        );

        redirectToLogin();

        return false;
    }
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
// DISPLAY USER
// =====================================================

function displayUser() {

    if (!currentUser) {
        return;
    }

    const name =
        currentUser.name ||
        currentUser.username ||
        "User";

    const email =
        currentUser.email ||
        "user@example.com";

    const firstLetter =
        name
            .charAt(0)
            .toUpperCase();


    if (userName) {

        userName.textContent =
            name;
    }


    if (userAvatar) {

        userAvatar.textContent =
            firstLetter;
    }


    if (profileName) {

        profileName.textContent =
            name;
    }


    if (profileEmail) {

        profileEmail.textContent =
            email;
    }


    if (profileAvatar) {

        profileAvatar.textContent =
            firstLetter;
    }
}


// =====================================================
// NAVIGATION
// =====================================================

function switchSection(
    sectionId,
    updateHistory = true
) {

    if (!sectionId) {
        return;
    }

    const validSections = [
        "overview",
        "history",
        "saved",
        "tools",
        "profile"
    ];

    if (
        !validSections.includes(
            sectionId
        )
    ) {

        sectionId =
            "overview";
    }


    // -------------------------------------------------
    // ACTIVE NAV
    // -------------------------------------------------

    navItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.section ===
                sectionId
            );
        }
    );


    // -------------------------------------------------
    // ACTIVE SECTION
    // -------------------------------------------------

    sections.forEach(
        section => {

            section.classList.toggle(
                "active",
                section.id ===
                sectionId
            );
        }
    );


    // -------------------------------------------------
    // PAGE TITLE
    // -------------------------------------------------

    const titles = {

        overview: "Overview",

        history: "History",

        saved: "Saved",

        tools: "AI Tools",

        profile: "Profile"
    };


    if (pageTitle) {

        pageTitle.textContent =
            titles[sectionId] ||
            "Workspace";
    }


    // -------------------------------------------------
    // URL HASH
    // -------------------------------------------------

    if (updateHistory) {

        const newUrl =
            window.location.pathname +
            "#" +
            sectionId;

        if (
            window.location.hash !==
            "#" + sectionId
        ) {

            history.pushState(
                {
                    section:
                        sectionId
                },
                "",
                newUrl
            );
        }
    }
}


// =====================================================
// NAVIGATION CLICK
// =====================================================

navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                const section =
                    item.dataset.section;

                switchSection(
                    section
                );
            }
        );
    }
);


// =====================================================
// DATA SECTION TARGET BUTTONS
// =====================================================

document
    .querySelectorAll(
        "[data-section-target]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset
                            .sectionTarget;

                    switchSection(
                        target
                    );
                }
            );
        }
    );


// =====================================================
// LOAD SECTION FROM URL
// =====================================================

function loadInitialSection() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim()
            .toLowerCase();


    const validSections = [

        "overview",

        "history",

        "saved",

        "tools",

        "profile"
    ];


    const section =
        validSections.includes(
            hash
        )
            ? hash
            : "overview";


    switchSection(
        section,
        false
    );
}


// =====================================================
// LOAD WORKSPACE DATA FROM BACKEND
// =====================================================

async function loadWorkspaceData() {

    try {

        console.log(
            "Loading workspace data..."
        );


        // -------------------------------------------------
        // LOAD WORKSPACE OVERVIEW
        // -------------------------------------------------

        const workspaceData =
            await apiRequest(
                "/api/workspace",
                {
                    method: "GET"
                }
            );


        console.log(
            "API /api/workspace:",
            workspaceData
        );


        if (
            workspaceData.success !== true
        ) {

            throw new Error(
                workspaceData.error ||
                "Unable to load workspace."
            );
        }


        // -------------------------------------------------
        // UPDATE USER
        // -------------------------------------------------

        if (
            workspaceData.user
        ) {

            currentUser =
                workspaceData.user;

            displayUser();
        }


        // -------------------------------------------------
        // COUNTS
        // -------------------------------------------------

        if (
            workspaceData.counts
        ) {

            updateStatistics(
                workspaceData.counts
            );
        }


        // -------------------------------------------------
        // RECENT PROMPTS
        // -------------------------------------------------

        if (
            Array.isArray(
                workspaceData.recentPrompts
            )
        ) {

            promptHistory =
                workspaceData.recentPrompts;
        }


        // -------------------------------------------------
        // RECENT SAVED
        // -------------------------------------------------

        if (
            Array.isArray(
                workspaceData.recentSaved
            )
        ) {

            savedPrompts =
                workspaceData.recentSaved;
        }


        // -------------------------------------------------
        // LOAD COMPLETE HISTORY
        // -------------------------------------------------

        await loadHistory();


        // -------------------------------------------------
        // LOAD COMPLETE SAVED
        // -------------------------------------------------

        await loadSaved();


        // -------------------------------------------------
        // RENDER
        // -------------------------------------------------

        renderRecent();

        renderHistory();

        renderSaved();


        return true;

    } catch (error) {

        console.error(
            "Workspace loading error:",
            error
        );


        if (
            error.status === 401
        ) {

            redirectToLogin();

            return false;
        }


        showWorkspaceError(
            error.message ||
            "Couldn't load workspace."
        );

        return false;
    }
}


// =====================================================
// LOAD COMPLETE HISTORY
// =====================================================

async function loadHistory() {

    try {

        const data =
            await apiRequest(
                "/api/history",
                {
                    method: "GET"
                }
            );


        console.log(
            "API /api/history:",
            data
        );


        if (
            data.success === true &&
            Array.isArray(
                data.history
            )
        ) {

            promptHistory =
                data.history;
        } else {

            promptHistory = [];
        }


        updateStatistics();


        return promptHistory;

    } catch (error) {

        console.error(
            "History loading error:",
            error
        );


        if (
            error.status === 401
        ) {

            redirectToLogin();

            return [];
        }


        promptHistory = [];

        updateStatistics();

        return [];
    }
}


// =====================================================
// LOAD COMPLETE SAVED PROMPTS
// =====================================================

async function loadSaved() {

    try {

        const data =
            await apiRequest(
                "/api/saved",
                {
                    method: "GET"
                }
            );


        console.log(
            "API /api/saved:",
            data
        );


        if (
            data.success === true &&
            Array.isArray(
                data.saved
            )
        ) {

            savedPrompts =
                data.saved;
        } else {

            savedPrompts = [];
        }


        updateStatistics();


        return savedPrompts;

    } catch (error) {

        console.error(
            "Saved prompts loading error:",
            error
        );


        if (
            error.status === 401
        ) {

            redirectToLogin();

            return [];
        }


        savedPrompts = [];

        updateStatistics();

        return [];
    }
}


// =====================================================
// UPDATE STATISTICS
// =====================================================

function updateStatistics(
    counts = null
) {

    // -------------------------------------------------
    // GENERATED
    // -------------------------------------------------

    if (generatedCount) {

        if (
            counts &&
            counts.generated !== undefined
        ) {

            generatedCount.textContent =
                Number(
                    counts.generated
                );
        }
    }


    // -------------------------------------------------
    // HISTORY
    // -------------------------------------------------

    if (historyCount) {

        if (
            counts &&
            counts.history !== undefined
        ) {

            historyCount.textContent =
                Number(
                    counts.history
                );

        } else {

            historyCount.textContent =
                promptHistory.length;
        }
    }


    // -------------------------------------------------
    // SAVED
    // -------------------------------------------------

    if (savedCount) {

        if (
            counts &&
            counts.saved !== undefined
        ) {

            savedCount.textContent =
                Number(
                    counts.saved
                );

        } else {

            savedCount.textContent =
                savedPrompts.length;
        }
    }
}


// =====================================================
// FORMAT DATE
// =====================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "";
    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";
    }


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


// =====================================================
// GET PROMPT TEXT
// =====================================================

function getPromptText(
    prompt
) {

    if (
        typeof prompt ===
        "string"
    ) {

        return prompt;
    }


    if (
        prompt &&
        typeof prompt ===
        "object"
    ) {

        return prompt.prompt ||
            "";
    }


    return "";
}


// =====================================================
// CREATE PROMPT CARD
// =====================================================

function createPromptCard(
    prompt,
    options = {}
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "prompt-card";


    const promptText =
        getPromptText(
            prompt
        );


    const id =
        typeof prompt ===
            "object"
            ? prompt.id
            : null;


    const createdAt =
        typeof prompt ===
            "object"
            ? prompt.createdAt
            : null;


    card.dataset.promptId =
        id || "";


    // -------------------------------------------------
    // CARD HTML
    // -------------------------------------------------

    card.innerHTML = `

        <div class="prompt-card-content">

            <p class="prompt-card-text"></p>

            ${createdAt
            ? `
                        <span class="prompt-card-date">
                            ${formatDate(
                createdAt
            )}
                        </span>
                    `
            : ""
        }

        </div>


        <div class="prompt-card-actions">

            <button
                type="button"
                class="copy-prompt-btn"
                title="Copy prompt"
            >
                Copy
            </button>


            ${options.showSave
            ? `
                        <button
                            type="button"
                            class="save-prompt-btn"
                            title="Save prompt"
                        >
                            ☆
                        </button>
                    `
            : ""
        }


            ${options.showDelete
            ? `
                        <button
                            type="button"
                            class="delete-prompt-btn"
                            title="Delete prompt"
                        >
                            ×
                        </button>
                    `
            : ""
        }

        </div>
    `;


    // -------------------------------------------------
    // PROMPT TEXT
    // -------------------------------------------------

    const textElement =
        card.querySelector(
            ".prompt-card-text"
        );


    if (textElement) {

        textElement.textContent =
            promptText;
    }


    // -------------------------------------------------
    // COPY
    // -------------------------------------------------

    const copyButton =
        card.querySelector(
            ".copy-prompt-btn"
        );


    if (copyButton) {

        copyButton.addEventListener(
            "click",
            async () => {

                const success =
                    await copyText(
                        promptText
                    );


                if (success) {

                    const oldText =
                        copyButton.textContent;


                    copyButton.textContent =
                        "Copied ✓";


                    setTimeout(
                        () => {

                            copyButton.textContent =
                                oldText;

                        },
                        1500
                    );
                }
            }
        );
    }


    // -------------------------------------------------
    // SAVE
    // -------------------------------------------------

    const saveButton =
        card.querySelector(
            ".save-prompt-btn"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            () => {

                savePrompt(
                    prompt
                );
            }
        );
    }


    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    const deleteButton =
        card.querySelector(
            ".delete-prompt-btn"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                deletePrompt(
                    prompt,
                    options.source ||
                    "history"
                );
            }
        );
    }


    return card;
}


// =====================================================
// CUSTOM WORKSPACE ALERT / CONFIRM MODAL
// =====================================================

let workspaceDialogResolve = null;

function createWorkspaceDialog() {

    if (document.getElementById("workspaceDialog")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "workspaceDialogStyles";

    style.textContent = `
        /* =================================================
           WORKSPACE DIALOG
        ================================================= */

        .workspace-dialog {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition:
                opacity 0.2s ease,
                visibility 0.2s ease;
        }

        .workspace-dialog.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
        }

        .workspace-dialog-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.68);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .workspace-dialog-box {
            position: relative;
            width: min(420px, calc(100vw - 40px));
            padding: 26px;
            border: 1px solid rgba(255, 255, 255, 0.10);
            border-radius: 18px;
            background: #101116;
            box-shadow:
                0 25px 70px rgba(0, 0, 0, 0.55),
                0 0 0 1px rgba(255, 255, 255, 0.025);
            transform: translateY(12px) scale(0.97);
            transition: transform 0.22s ease;
        }

        .workspace-dialog.active .workspace-dialog-box {
            transform: translateY(0) scale(1);
        }

        .workspace-dialog-icon {
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 17px;
            border-radius: 13px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 20px;
        }

        .workspace-dialog-icon.success {
            color: #7ee787;
        }

        .workspace-dialog-icon.danger {
            color: #ff7070;
        }

        .workspace-dialog-icon.warning {
            color: #f5c451;
        }

        .workspace-dialog-icon.info {
            color: #8ab4ff;
        }

        .workspace-dialog-title {
            margin: 0 0 8px;
            color: #ffffff;
            font-family: "Space Grotesk", sans-serif;
            font-size: 19px;
            font-weight: 600;
            line-height: 1.3;
        }

        .workspace-dialog-message {
            margin: 0;
            color: rgba(255, 255, 255, 0.62);
            font-family: "DM Sans", sans-serif;
            font-size: 14px;
            line-height: 1.6;
            word-break: break-word;
        }

        .workspace-dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 24px;
        }

        .workspace-dialog-btn {
            min-width: 88px;
            height: 40px;
            padding: 0 16px;
            border-radius: 9px;
            border: 1px solid rgba(255, 255, 255, 0.10);
            font-family: "DM Sans", sans-serif;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition:
                background 0.18s ease,
                border-color 0.18s ease,
                transform 0.18s ease;
        }

        .workspace-dialog-btn:hover {
            transform: translateY(-1px);
        }

        .workspace-dialog-cancel {
            color: rgba(255, 255, 255, 0.72);
            background: rgba(255, 255, 255, 0.055);
        }

        .workspace-dialog-cancel:hover {
            background: rgba(255, 255, 255, 0.09);
        }

        .workspace-dialog-confirm {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.12);
        }

        .workspace-dialog-confirm:hover {
            background: rgba(255, 255, 255, 0.17);
        }

        .workspace-dialog-confirm.danger {
            background: rgba(255, 82, 82, 0.14);
            border-color: rgba(255, 82, 82, 0.24);
            color: #ff8585;
        }

        .workspace-dialog-confirm.danger:hover {
            background: rgba(255, 82, 82, 0.21);
        }

        @media (max-width: 480px) {

            .workspace-dialog-box {
                padding: 22px;
                border-radius: 16px;
            }

            .workspace-dialog-actions {
                flex-direction: column-reverse;
            }

            .workspace-dialog-btn {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(style);


    const dialog = document.createElement("div");

    dialog.id = "workspaceDialog";
    dialog.className = "workspace-dialog";

    dialog.innerHTML = `
        <div class="workspace-dialog-overlay"></div>

        <div
            class="workspace-dialog-box"
            role="dialog"
            aria-modal="true"
        >

            <div
                class="workspace-dialog-icon info"
                id="workspaceDialogIcon"
            >
                !
            </div>

            <h3
                class="workspace-dialog-title"
                id="workspaceDialogTitle"
            >
                Notice
            </h3>

            <p
                class="workspace-dialog-message"
                id="workspaceDialogMessage"
            ></p>

            <div
                class="workspace-dialog-actions"
                id="workspaceDialogActions"
            >

                <button
                    type="button"
                    class="workspace-dialog-btn workspace-dialog-cancel"
                    id="workspaceDialogCancel"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="workspace-dialog-btn workspace-dialog-confirm"
                    id="workspaceDialogConfirm"
                >
                    OK
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(dialog);


    const overlay =
        dialog.querySelector(
            ".workspace-dialog-overlay"
        );

    const cancelButton =
        document.getElementById(
            "workspaceDialogCancel"
        );

    const confirmButton =
        document.getElementById(
            "workspaceDialogConfirm"
        );


    overlay.addEventListener(
        "click",
        () => {

            if (workspaceDialogResolve) {
                workspaceDialogResolve(false);
            }

            closeWorkspaceDialog();
        }
    );


    cancelButton.addEventListener(
        "click",
        () => {

            if (workspaceDialogResolve) {
                workspaceDialogResolve(false);
            }

            closeWorkspaceDialog();
        }
    );


    confirmButton.addEventListener(
        "click",
        () => {

            if (workspaceDialogResolve) {
                workspaceDialogResolve(true);
            }

            closeWorkspaceDialog();
        }
    );
}


// =====================================================
// CLOSE CUSTOM DIALOG
// =====================================================

function closeWorkspaceDialog() {

    const dialog =
        document.getElementById(
            "workspaceDialog"
        );

    if (!dialog) {
        return;
    }

    dialog.classList.remove("active");

    workspaceDialogResolve = null;
}


// =====================================================
// SHOW CUSTOM ALERT
// =====================================================

function showWorkspaceAlert(
    message,
    options = {}
) {

    createWorkspaceDialog();

    const dialog =
        document.getElementById(
            "workspaceDialog"
        );

    const title =
        document.getElementById(
            "workspaceDialogTitle"
        );

    const messageElement =
        document.getElementById(
            "workspaceDialogMessage"
        );

    const icon =
        document.getElementById(
            "workspaceDialogIcon"
        );

    const cancelButton =
        document.getElementById(
            "workspaceDialogCancel"
        );

    const confirmButton =
        document.getElementById(
            "workspaceDialogConfirm"
        );


    title.textContent =
        options.title ||
        "Notice";


    messageElement.textContent =
        message || "";


    const type =
        options.type ||
        "info";


    const icons = {

        success: "✓",

        danger: "×",

        warning: "!",

        info: "i"
    };


    icon.className =
        "workspace-dialog-icon " +
        type;

    icon.textContent =
        icons[type] ||
        icons.info;


    cancelButton.style.display =
        "none";


    confirmButton.textContent =
        options.confirmText ||
        "OK";


    confirmButton.className =
        "workspace-dialog-btn workspace-dialog-confirm";


    if (type === "danger") {

        confirmButton.classList.add(
            "danger"
        );
    }


    dialog.classList.add(
        "active"
    );


    setTimeout(
        () => {
            confirmButton.focus();
        },
        50
    );
}


// =====================================================
// SHOW CUSTOM CONFIRM
// =====================================================

function showWorkspaceConfirm(
    message,
    options = {}
) {

    createWorkspaceDialog();

    const dialog =
        document.getElementById(
            "workspaceDialog"
        );

    const title =
        document.getElementById(
            "workspaceDialogTitle"
        );

    const messageElement =
        document.getElementById(
            "workspaceDialogMessage"
        );

    const icon =
        document.getElementById(
            "workspaceDialogIcon"
        );

    const cancelButton =
        document.getElementById(
            "workspaceDialogCancel"
        );

    const confirmButton =
        document.getElementById(
            "workspaceDialogConfirm"
        );


    title.textContent =
        options.title ||
        "Are you sure?";


    messageElement.textContent =
        message || "";


    const type =
        options.type ||
        "warning";


    const icons = {

        success: "✓",

        danger: "×",

        warning: "!",

        info: "i"
    };


    icon.className =
        "workspace-dialog-icon " +
        type;

    icon.textContent =
        icons[type] ||
        icons.warning;


    cancelButton.style.display =
        "";


    cancelButton.textContent =
        options.cancelText ||
        "Cancel";


    confirmButton.textContent =
        options.confirmText ||
        "Confirm";


    confirmButton.className =
        "workspace-dialog-btn workspace-dialog-confirm";


    if (type === "danger") {

        confirmButton.classList.add(
            "danger"
        );
    }


    dialog.classList.add(
        "active"
    );


    setTimeout(
        () => {
            confirmButton.focus();
        },
        50
    );


    return new Promise(
        resolve => {

            workspaceDialogResolve =
                resolve;
        }
    );
}



// =====================================================
// EMPTY STATE
// =====================================================

function createEmptyState(
    icon,
    title,
    message
) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "empty-state";


    div.innerHTML = `

        <div class="empty-icon">
            ${icon}
        </div>

        <h3>
            ${title}
        </h3>

        <p>
            ${message}
        </p>
    `;


    return div;
}


// =====================================================
// WORKSPACE ERROR
// =====================================================

function showWorkspaceError(
    message
) {

    console.error(
        "Workspace:",
        message
    );


    if (
        recentPrompts &&
        promptHistory.length === 0
    ) {

        recentPrompts.innerHTML = "";

        recentPrompts.appendChild(
            createEmptyState(
                "!",
                "Unable to load workspace",
                message
            )
        );
    }
}


// =====================================================
// RENDER HISTORY
// =====================================================

function renderHistory(
    searchTerm = ""
) {

    if (!historyList) {
        return;
    }


    historyList.innerHTML =
        "";


    const search =
        String(
            searchTerm
        )
            .toLowerCase()
            .trim();


    const filtered =
        promptHistory.filter(
            item => {

                const text =
                    getPromptText(
                        item
                    );


                return text
                    .toLowerCase()
                    .includes(
                        search
                    );
            }
        );


    if (
        filtered.length === 0
    ) {

        historyList.appendChild(
            createEmptyState(
                "◷",
                search
                    ? "No prompts found"
                    : "No history yet",
                search
                    ? "Try a different search."
                    : "Generated prompts will be stored here."
            )
        );


        return;
    }


    filtered.forEach(
        prompt => {

            const card =
                createPromptCard(
                    prompt,
                    {
                        showSave: true,
                        showDelete: true,
                        source:
                            "history"
                    }
                );


            historyList.appendChild(
                card
            );
        }
    );
}


// =====================================================
// RENDER SAVED
// =====================================================

function renderSaved() {

    if (!savedList) {
        return;
    }


    savedList.innerHTML =
        "";


    if (
        savedPrompts.length === 0
    ) {

        savedList.appendChild(
            createEmptyState(
                "☆",
                "No saved prompts",
                "Save your favorite prompts to find them quickly."
            )
        );


        return;
    }


    savedPrompts.forEach(
        prompt => {

            const card =
                createPromptCard(
                    prompt,
                    {
                        showDelete: true,
                        source:
                            "saved"
                    }
                );


            savedList.appendChild(
                card
            );
        }
    );
}


// =====================================================
// RENDER RECENT
// =====================================================

function renderRecent() {

    if (!recentPrompts) {
        return;
    }


    recentPrompts.innerHTML =
        "";


    if (
        promptHistory.length === 0
    ) {

        recentPrompts.appendChild(
            createEmptyState(
                "✦",
                "No prompts yet",
                "Your generated prompts will appear here."
            )
        );


        return;
    }


    const recent =
        promptHistory.slice(
            0,
            5
        );


    recent.forEach(
        prompt => {

            const card =
                createPromptCard(
                    prompt,
                    {
                        showSave: true,
                        source:
                            "history"
                    }
                );


            recentPrompts.appendChild(
                card
            );
        }
    );
}


// =====================================================
// SAVE PROMPT TO FIREBASE
// =====================================================

async function savePrompt(
    prompt
) {

    const promptText =
        getPromptText(
            prompt
        );


    if (
        !promptText.trim()
    ) {

        return;
    }


    // -------------------------------------------------
    // CHECK DUPLICATE
    // -------------------------------------------------

    const alreadySaved =
        savedPrompts.some(
            item =>
                getPromptText(
                    item
                ) === promptText
        );


    if (
        alreadySaved
    ) {

        showWorkspaceAlert(
            "This prompt is already saved.",
            {
                title: "Already Saved",
                type: "warning"
            }
        );
        return;
    }


    // -------------------------------------------------
    // DISABLE SAVE BUTTONS
    // -------------------------------------------------

    const buttons =
        document.querySelectorAll(
            ".save-prompt-btn"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;
        }
    );


    try {

        const data =
            await apiRequest(
                "/api/saved",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            prompt:
                                promptText,

                            title:
                                prompt.title ||
                                "Saved Prompt",

                            type:
                                prompt.type ||
                                "prompt",

                            idea:
                                prompt.idea ||
                                "",

                            outputLanguage:
                                prompt.outputLanguage ||
                                "English",

                            outputFormat:
                                prompt.outputFormat ||
                                "Original Script"
                        })
                }
            );


        console.log(
            "Saved prompt response:",
            data
        );


        if (
            data.success !== true
        ) {

            throw new Error(
                data.error ||
                "Couldn't save prompt."
            );
        }


        // -------------------------------------------------
        // ADD FIREBASE RESULT
        // -------------------------------------------------

        if (
            data.saved
        ) {

            savedPrompts.unshift(
                data.saved
            );

        } else {

            await loadSaved();
        }


        updateStatistics();

        renderSaved();


        showWorkspaceAlert(
            "Prompt saved successfully!",
            {
                title: "Prompt Saved",
                type: "success"
            }
        );

    } catch (error) {

        console.error(
            "Save prompt error:",
            error
        );


        if (
            error.status === 401
        ) {

            showWorkspaceAlert(
                "Please login first.",
                {
                    title: "Login Required",
                    type: "warning"
                }
            );

            redirectToLogin();

            return;
        }


        showWorkspaceAlert(
            error.message || "Couldn't save prompt.",
            {
                title: "Something Went Wrong",
                type: "danger"
            }
        );

    } finally {

        buttons.forEach(
            button => {

                button.disabled =
                    false;
            }
        );
    }
}


// =====================================================
// DELETE PROMPT
// =====================================================

async function deletePrompt(
    prompt,
    source
) {

    const promptText =
        getPromptText(
            prompt
        );


    if (
        !promptText.trim()
    ) {

        return;
    }


    const message =
        source === "saved"
            ? "Remove this saved prompt?"
            : "Delete this prompt from history?";


    const confirmed =
        await showWorkspaceConfirm(
            message,
            {
                title:
                    source === "saved"
                        ? "Remove Saved Prompt?"
                        : "Delete Prompt?",
                confirmText:
                    source === "saved"
                        ? "Remove"
                        : "Delete",
                cancelText: "Cancel",
                type: "danger"
            }
        );

    if (!confirmed) {
        return;
    }


    const promptId =
        typeof prompt ===
            "object"
            ? prompt.id
            : null;


    if (!promptId) {

        showWorkspaceAlert(
            "This prompt does not have a valid backend ID.",
            {
                title: "Invalid Prompt",
                type: "error"
            }
        );

        return;
    }


    try {

        // -------------------------------------------------
        // DELETE HISTORY
        // -------------------------------------------------

        if (
            source ===
            "history"
        ) {

            await apiRequest(
                `/api/history/${encodeURIComponent(
                    promptId
                )}`,
                {
                    method:
                        "DELETE"
                }
            );


            promptHistory =
                promptHistory.filter(
                    item =>
                        item.id !==
                        promptId
                );
        }


        // -------------------------------------------------
        // DELETE SAVED
        // -------------------------------------------------

        else if (
            source ===
            "saved"
        ) {

            await apiRequest(
                `/api/saved/${encodeURIComponent(
                    promptId
                )}`,
                {
                    method:
                        "DELETE"
                }
            );


            savedPrompts =
                savedPrompts.filter(
                    item =>
                        item.id !==
                        promptId
                );
        }


        // -------------------------------------------------
        // UPDATE UI
        // -------------------------------------------------

        updateStatistics();

        renderHistory(
            historySearch
                ? historySearch.value
                : ""
        );

        renderSaved();

        renderRecent();


    } catch (error) {

        console.error(
            "Delete prompt error:",
            error
        );


        if (
            error.status === 401
        ) {

            showWorkspaceAlert(
                "Please login first.",
                {
                    title: "Login Required",
                    type: "warning"
                }
            );

            redirectToLogin();

            return;
        }


        showWorkspaceAlert(
            error.message || "Couldn't delete prompt.",
            {
                title: "Delete Failed",
                type: "error"
            }
        );
    }
}


// =====================================================
// CLEAR ALL HISTORY
// =====================================================

if (
    clearHistoryBtn
) {

    clearHistoryBtn.addEventListener(
        "click",
        async () => {

            if (
                promptHistory.length ===
                0
            ) {

                showWorkspaceAlert(
                    "Your history is already empty.",
                    {
                        title: "History Empty",
                        type: "warning"
                    }
                );

                return;
            }


            const confirmed =
                await showWorkspaceConfirm(
                    "Are you sure you want to clear your entire prompt history?",
                    {
                        title: "Clear History?",
                        confirmText: "Clear History",
                        cancelText: "Cancel",
                        type: "danger"
                    }
                );

            if (!confirmed) {
                return;
            }


            clearHistoryBtn.disabled =
                true;


            const originalText =
                clearHistoryBtn.textContent;


            clearHistoryBtn.textContent =
                "Clearing...";


            try {

                await apiRequest(
                    "/api/history",
                    {
                        method:
                            "DELETE"
                    }
                );


                promptHistory =
                    [];


                // Reload workspace so the
                // generated lifetime count
                // remains correct.

                await loadWorkspaceData();


            } catch (error) {

                console.error(
                    "Clear history error:",
                    error
                );


                if (
                    error.status === 401
                ) {

                    showWorkspaceAlert(
                        "Please login first.",
                        {
                            title: "Login Required",
                            type: "warning"
                        }
                    );

                    redirectToLogin();

                    return;
                }


                showWorkspaceAlert(
                    error.message || "Couldn't clear history.",
                    {
                        title: "Clear History Failed",
                        type: "error"
                    }
                );

            } finally {

                clearHistoryBtn.disabled =
                    false;

                clearHistoryBtn.textContent =
                    originalText;
            }
        }
    );
}


// =====================================================
// SEARCH HISTORY
// =====================================================

if (
    historySearch
) {

    historySearch.addEventListener(
        "input",
        () => {

            renderHistory(
                historySearch.value
            );
        }
    );
}


// =====================================================
// COPY TEXT
// =====================================================

async function copyText(
    text
) {

    if (!text) {
        return false;
    }


    // -------------------------------------------------
    // MODERN CLIPBOARD
    // -------------------------------------------------

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator
                .clipboard
                .writeText(
                    text
                );

            return true;
        }

    } catch (error) {

        console.error(
            "Clipboard API failed:",
            error
        );
    }


    // -------------------------------------------------
    // FALLBACK
    // -------------------------------------------------

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

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    let success =
        false;


    try {

        success =
            document.execCommand(
                "copy"
            );

    } catch (error) {

        console.error(
            "Fallback copy failed:",
            error
        );
    }


    document.body.removeChild(
        textarea
    );


    return success;
}


// =====================================================
// LOGOUT MODAL
// =====================================================

const logoutModal =
    document.getElementById(
        "logoutModal"
    );

const logoutCancelBtn =
    document.getElementById(
        "logoutCancelBtn"
    );

const logoutConfirmBtn =
    document.getElementById(
        "logoutConfirmBtn"
    );

const logoutModalOverlay =
    document.querySelector(
        ".logout-modal-overlay"
    );


// =====================================================
// OPEN LOGOUT MODAL
// =====================================================

if (
    logoutBtn
) {

    logoutBtn.addEventListener(
        "click",
        () => {

            if (
                logoutModal
            ) {

                logoutModal.classList.add(
                    "active"
                );
            }
        }
    );
}


// =====================================================
// CLOSE LOGOUT MODAL
// =====================================================

function closeLogoutModal() {

    if (
        logoutModal
    ) {

        logoutModal.classList.remove(
            "active"
        );
    }
}


if (
    logoutCancelBtn
) {

    logoutCancelBtn.addEventListener(
        "click",
        closeLogoutModal
    );
}


if (
    logoutModalOverlay
) {

    logoutModalOverlay.addEventListener(
        "click",
        closeLogoutModal
    );
}


// =====================================================
// ESC KEY
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        const workspaceDialog =
            document.getElementById(
                "workspaceDialog"
            );

        if (
            workspaceDialog &&
            workspaceDialog.classList.contains(
                "active"
            )
        ) {

            if (workspaceDialogResolve) {
                workspaceDialogResolve(false);
            }

            closeWorkspaceDialog();

            return;
        }

        closeLogoutModal();
    }
);


// =====================================================
// CONFIRM LOGOUT
// =====================================================

if (
    logoutConfirmBtn
) {

    logoutConfirmBtn.addEventListener(
        "click",
        async () => {

            const originalText =
                logoutConfirmBtn.textContent;


            logoutConfirmBtn.textContent =
                "Logging out...";


            logoutConfirmBtn.disabled =
                true;


            try {

                const data =
                    await apiRequest(
                        "/api/logout",
                        {
                            method:
                                "POST"
                        }
                    );


                console.log(
                    "Logout response:",
                    data
                );

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            } finally {

                localStorage.removeItem(
                    "promptStudioUser"
                );


                window.location.replace(
                    "/login.html"
                );
            }
        }
    );
}


// =====================================================
// LAST NON-PROFILE SECTION
// =====================================================

let lastNonProfileSection =
    "overview";


// =====================================================
// TOP AVATAR CLICK
// =====================================================

if (
    userAvatar
) {

    userAvatar.addEventListener(
        "click",
        () => {

            const profileSection =
                document.getElementById(
                    "profile"
                );


            const isProfileOpen =
                profileSection &&
                profileSection.classList.contains(
                    "active"
                );


            if (
                isProfileOpen
            ) {

                switchSection(
                    lastNonProfileSection
                );

                return;
            }


            const currentSection =
                document.querySelector(
                    ".workspace-section.active"
                );


            if (
                currentSection &&
                currentSection.id !==
                "profile"
            ) {

                lastNonProfileSection =
                    currentSection.id;
            }


            switchSection(
                "profile"
            );
        }
    );
}


// =====================================================
// BROWSER BACK / FORWARD
// =====================================================

window.addEventListener(
    "popstate",
    () => {

        loadInitialSection();
    }
);


// =====================================================
// INITIALIZE BROWSER HISTORY
// =====================================================

function initializeBrowserHistory() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim()
            .toLowerCase();


    const validSections = [

        "overview",

        "history",

        "saved",

        "tools",

        "profile"
    ];


    const section =
        validSections.includes(
            hash
        )
            ? hash
            : "overview";


    const currentUrl =
        window.location.pathname +
        "#" +
        section;


    history.replaceState(
        {
            section:
                section
        },
        "",
        currentUrl
    );
}


// =====================================================
// INITIALIZE WORKSPACE
// =====================================================

async function initializeWorkspace() {

    // -------------------------------------------------
    // 1. VERIFY REAL BACKEND SESSION
    // -------------------------------------------------

    const isLoggedIn =
        await loadUser();


    if (!isLoggedIn) {
        return;
    }


    // -------------------------------------------------
    // 2. BROWSER HISTORY
    // -------------------------------------------------

    initializeBrowserHistory();


    // -------------------------------------------------
    // 3. LOAD FIREBASE DATA
    // -------------------------------------------------

    await loadWorkspaceData();


    // -------------------------------------------------
    // 4. LOAD CURRENT SECTION
    // -------------------------------------------------

    loadInitialSection();
}


// =====================================================
// START
// =====================================================

initializeWorkspace();