const multer = require("multer");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const session = require("cookie-session");
const { GoogleGenAI } = require("@google/genai");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const {getFirestore,FieldValue} = require("firebase-admin/firestore");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// =====================================================
// FIREBASE ADMIN
// =====================================================

const serviceAccount = JSON.parse(
    Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT,
        "base64"
    ).toString("utf8")
);

initializeApp({
    credential: cert(serviceAccount)
});
const firebaseAuth = getAuth();
const db = getFirestore();

const usersCollection = db.collection("users");
const historyCollection = db.collection("history");
const savedCollection = db.collection("saved");


// =====================================================
// GEMINI AI
// =====================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

app.set("trust proxy", 1);

app.use(
    session({
        name: "promptstudio.sid",
        keys: [
            process.env.SESSION_SECRET
        ],
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })
);

const upload = multer({
    storage: multer.memoryStorage()
});

// =====================================================
// SERVE FRONTEND FILES
// =====================================================

const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get("/login", (req, res) => {
    res.sendFile(path.join(frontendPath, "login.html"));
});

// =====================================================
// GOOGLE AUTHENTICATION
// =====================================================

app.post(
    "/api/google-login",
    async (req, res) => {

        try {

            const {
                idToken,
                mode
            } = req.body;

            // =================================================
            // VALIDATION
            // =================================================

            if (
                typeof idToken !== "string" ||
                !idToken.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Invalid Google authentication token."

                });

            }

            // mode must be either login or signup
            if (
                mode !== "login" &&
                mode !== "signup"
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Invalid authentication mode."

                });

            }

            // =================================================
            // VERIFY GOOGLE TOKEN WITH FIREBASE
            // =================================================

            const decodedToken =
                await firebaseAuth.verifyIdToken(
                    idToken.trim()
                );

            const uid =
                decodedToken.uid;

            const cleanEmail =
                (decodedToken.email || "")
                    .trim()
                    .toLowerCase();

            const cleanName =
                typeof decodedToken.name === "string" &&
                    decodedToken.name.trim()
                    ? decodedToken.name.trim()
                    : "Google User";

            const photo =
                typeof decodedToken.picture === "string"
                    ? decodedToken.picture
                    : "";

            // =================================================
            // CHECK EMAIL
            // =================================================

            if (!cleanEmail) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Google account email could not be verified."

                });

            }

            // =================================================
            // FIND USER BY EMAIL
            // =================================================

            const userSnapshot =
                await usersCollection
                    .where(
                        "email",
                        "==",
                        cleanEmail
                    )
                    .limit(1)
                    .get();

            // =================================================
            // GOOGLE SIGNUP
            // =================================================

            if (mode === "signup") {

                // ---------------------------------------------
                // USER ALREADY EXISTS
                // ---------------------------------------------

                if (!userSnapshot.empty) {

                    return res.status(409).json({

                        success: false,

                        error:
                            "An account with this Google email already exists. Please login instead."

                    });

                }

                // ---------------------------------------------
                // CREATE NEW GOOGLE USER
                // ---------------------------------------------

                const newUser = {

                    id:
                        uid,

                    name:
                        cleanName,

                    email:
                        cleanEmail,

                    photo:
                        photo,

                    provider:
                        "google",

                    generatedCount:
                        0,

                    createdAt:
                        new Date().toISOString()

                };

                await usersCollection
                    .doc(newUser.id)
                    .set(newUser);

                console.log(
                    "New Google user created:",
                    newUser.id
                );

                // ---------------------------------------------
                // CREATE SESSION
                // ---------------------------------------------

                req.session.userId =
                    newUser.id;

                req.session.userName =
                    newUser.name;

                req.session.userEmail =
                    newUser.email;

              
                // ---------------------------------------------
                // SIGNUP RESPONSE
                // ---------------------------------------------

                return res.json({

                    success: true,

                    message:
                        "Google signup successful.",

                    user: {

                        id:
                            newUser.id,

                        name:
                            newUser.name,

                        email:
                            newUser.email,

                        photo:
                            newUser.photo || ""

                    }

                });

            }

            // =================================================
            // GOOGLE LOGIN
            // =================================================

            if (mode === "login") {

                // ---------------------------------------------
                // USER DOES NOT EXIST
                // ---------------------------------------------

                if (userSnapshot.empty) {

                    return res.status(404).json({

                        success: false,

                        error:
                            "No account found with this Google account. Please sign up first."

                    });

                }

                // ---------------------------------------------
                // EXISTING USER
                // ---------------------------------------------

                const userDoc =
                    userSnapshot.docs[0];

                const user = {

                    id:
                        userDoc.id,

                    ...userDoc.data()

                };

                // ---------------------------------------------
                // CREATE SESSION
                // ---------------------------------------------

                req.session.userId =
                    user.id;

                req.session.userName =
                    user.name;

                req.session.userEmail =
                    user.email;

                

                // ---------------------------------------------
                // LOGIN RESPONSE
                // ---------------------------------------------

                return res.json({

                    success: true,

                    message:
                        "Google login successful.",

                    user: {

                        id:
                            user.id,

                        name:
                            user.name,

                        email:
                            user.email,

                        photo:
                            user.photo || ""

                    }

                });

            }

        }

        catch (error) {

            console.error(
                "Google Authentication Error:",
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    "Couldn't authenticate with Google right now."

            });

        }

    }
);

console.log("Firebase connected successfully.");


// =====================================================
// PROTECTED FRONTEND PAGES
// =====================================================

const protectedPages = [
    "/image-prompt.html",
    "/video-prompt.html",
    "/voice-prompt.html",
    "/file-prompt.html",
    "/workspace.html"
];

protectedPages.forEach((page) => {

    app.get(page, (req, res) => {

        // User is NOT logged in
        if (!req.session.userId) {

            return res.redirect(
                `/login.html?redirect=${encodeURIComponent(page)}`
            );
        }

        // User is logged in
        res.sendFile(
    path.join(frontendPath, page.slice(1))
);
    });

});



// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

function requireLogin(req, res, next) {

    if (!req.session.userId) {

        return res.status(401).json({

            success: false,

            error:
                "Please login first."

        });
    }

    next();
}

// =====================================================
// SIGNUP
// =====================================================

app.post(
    "/api/signup",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;

            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (
                typeof name !== "string" ||
                !name.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter your name."

                });
            }

            if (
                typeof email !== "string" ||
                !email.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter your email."

                });
            }

            if (
                typeof password !== "string" ||
                password.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Password must be at least 6 characters."

                });
            }

            const cleanName =
                name.trim();

            const cleanEmail =
                email.trim().toLowerCase();

            


            // -----------------------------
            // CHECK EXISTING USER IN FIREBASE
            // -----------------------------

            const existingUserSnapshot = await usersCollection
                .where("email", "==", cleanEmail)
                .limit(1)
                .get();

            if (!existingUserSnapshot.empty) {

                return res.status(409).json({
                    success: false,
                    error:
                        "An account with this email already exists."
                });
            }
            // -----------------------------
            // HASH PASSWORD
            // -----------------------------

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );

            // -----------------------------
            // CREATE USER
            // -----------------------------

            const newUser = {

                id:
                    Date.now().toString() +
                    Math.random()
                        .toString(36)
                        .substring(2, 8),

                name:
                    cleanName,

                email:
                    cleanEmail,

                password:
                    hashedPassword,

                generatedCount: 0,

                createdAt:
                    new Date().toISOString()

            };

            await usersCollection
                .doc(newUser.id)
                .set(newUser);

            // -----------------------------
            // CREATE SESSION
            // -----------------------------

            req.session.userId =
                newUser.id;

            req.session.userName =
                newUser.name;

            req.session.userEmail =
                newUser.email;

           

            // -----------------------------
            // RESPONSE
            // -----------------------------

            res.json({

                success: true,

                message:
                    "Account created successfully.",

                user: {

                    id:
                        newUser.id,

                    name:
                        newUser.name,

                    email:
                        newUser.email

                }

            });

        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "Couldn't create your account right now."

            });
        }

    }
);

// =====================================================
// LOGIN
// =====================================================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;

            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (
                typeof email !== "string" ||
                !email.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter your email."

                });
            }

            if (
                typeof password !== "string" ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter your password."

                });
            }

            const cleanEmail =
                email.trim().toLowerCase();

            // -----------------------------
            // FIND USER
            // -----------------------------

            const userSnapshot = await usersCollection
                .where("email", "==", cleanEmail)
                .limit(1)
                .get();

            if (userSnapshot.empty) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid email or password."
                });
            }

            const userDoc = userSnapshot.docs[0];

            const user = {
                id: userDoc.id,
                ...userDoc.data()
            };
            // -----------------------------
            // CHECK PASSWORD
            // -----------------------------

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    error:
                        "Invalid email or password."

                });
            }

            // -----------------------------
            // CREATE SESSION
            // -----------------------------

            req.session.userId =
                user.id;

            req.session.userName =
                user.name;

            req.session.userEmail =
                user.email;

            

            // -----------------------------
            // RESPONSE
            // -----------------------------

            res.json({

                success: true,

                message:
                    "Login successful.",

                user: {

                    id:
                        user.id,

                    name:
                        user.name,

                    email:
                        user.email

                }

            });

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "Couldn't login right now."

            });
        }

    }
);

// =====================================================
// CURRENT USER
// =====================================================

app.get(
    "/api/me",
    (req, res) => {

        if (!req.session.userId) {

            return res.json({

                loggedIn: false

            });
        }

        res.json({

            loggedIn: true,

            user: {

                id:
                    req.session.userId,

                name:
                    req.session.userName,

                email:
                    req.session.userEmail

            }

        });

    }
);


// =====================================================
// LOGOUT
// =====================================================

app.post(
    "/api/logout",
    (req, res) => {

        try {

            // cookie-session does not use req.session.destroy()
            // Simply clear the session object.
            req.session = null;

            res.json({

                success: true,

                message:
                    "Logged out successfully."

            });

        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "Couldn't logout."

            });

        }

    }
);


// =====================================================
// GENERATE PROMPT
// =====================================================

app.post(
    "/api/generate",
    upload.single("referenceImage"),
    


    
    async (req, res) => {

        try {

            console.log("Uploaded file:", req.file);
            console.log("Idea:", req.body.idea);

            const {
                idea,
                outputLanguage,
                outputFormat,
                imageStyle
            } = req.body;

            // -----------------------------
            // CHECK IDEA
            // -----------------------------

            if (
                typeof idea !== "string" ||
                !idea.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter an idea."

                });
            }

            // -----------------------------
            // OUTPUT LANGUAGE
            // -----------------------------

            const language =
                outputLanguage &&
                    typeof outputLanguage === "string"

                    ? outputLanguage.trim()

                    : "English";

            // -----------------------------
            // OUTPUT FORMAT
            // -----------------------------

            const formats = [
                "Original Script",
                "English Letters",
                "Mixed Language"
            ];

            const format =
                outputFormat &&
                    typeof outputFormat === "string" &&
                    formats.includes(
                        outputFormat.trim()
                    )

                    ? outputFormat.trim()

                    : "Original Script";

            // -----------------------------
            // FORMAT INSTRUCTION
            // -----------------------------

            let formatInstruction = "";

            if (
                format ===
                "Original Script"
            ) {

                formatInstruction = `

Write the final prompt in ${language}
using the original writing script normally
used for that language.

Examples:

Hindi → हिंदी script
Marathi → मराठी script
Gujarati → ગુજરાતી script
Bengali → বাংলা script
Tamil → தமிழ் script
Japanese → 日本語 script
Arabic → العربية script

Do NOT convert the language into English / Latin letters.

`;

            }

            else if (
                format ===
                "English Letters"
            ) {

                formatInstruction = `

Write the final prompt in ${language},
but use English / Latin letters instead of
the original writing script.

For example:

Hindi:
"मुझे एक ऐप चाहिए"

should become:

"Mujhe ek app chahiye"

Marathi:
"मला एक अॅप पाहिजे"

should become:

"Mala ek app pahije"

Do NOT use the original script.

Use English / Latin letters for the entire
${language} text.

`;

            }

            else if (
                format ===
                "Mixed Language"
            ) {

                formatInstruction = `

Write the final prompt using a natural combination of
${language} and English.

IMPORTANT:

- The main language must remain ${language}.
- English words can be used naturally when they are common,
  useful, or appropriate.
- Do NOT translate everything into English.
- Do NOT make the output fully English.
- Do NOT simply transliterate every word into English letters.
- The result should feel natural and conversational.

Example for Hindi:

"Mujhe ek mobile app banana hai jo users ko daily paani
peene ke liye reminder bheje aur unka water intake track kare."

Another example:

"Ek simple aur user-friendly app design karo jisme users
apna daily water intake easily track kar sakein."

The output should be natural, clear, and conversational.

`;

            }

            // -----------------------------
            // GEMINI SYSTEM PROMPT
            // -----------------------------
             
            const systemPrompt = `

You are the AI engine behind Prompt Studio.

Your task is to transform the user's rough idea
into a high-quality, professional, ready-to-use prompt.

IMPORTANT INPUT RULES:

- The user can write their idea in ANY language.
- The user may mix multiple languages.
- The user may use slang, informal language,
  broken grammar, transliteration, or incomplete sentences.
- Understand the user's meaning and intent regardless
  of the input language.
- DO NOT translate word-for-word.
- Understand the idea first and then create a
  natural, professional prompt.

IMPORTANT OUTPUT LANGUAGE:

The final prompt MUST be written in:

${language}

IMPORTANT OUTPUT FORMAT:

The user selected:

${format}

${formatInstruction}

Do not change the selected output format.

IMAGE STYLE:

The user selected this image style:

${imageStyle || "Original / Realistic"}

Use this style when creating the image-generation prompt.

PROMPT QUALITY:

- Understand what the user wants to accomplish.
- Fix grammar, structure, and clarity.
- Make the prompt specific and useful.
- Add reasonable details when the idea is vague.
- Do not invent unrelated requirements.
- Preserve important details from the user's idea.
- Make the prompt practical and ready to use.
- Make the result clear enough that another AI
  can understand exactly what to do.

SUPPORTED USE CASES:

The prompt can be for:

- Image generation
- Video generation
- Writing
- Coding
- Software development
- Business
- Marketing
- Education
- Research
- Data analysis
- Design
- Storytelling
- Any other creative or professional task.

OUTPUT RULES:

- Output ONLY the finished prompt.
- No explanation.
- No preamble.
- No "Here is your prompt".
- No quotation marks around the prompt.
- No markdown headers.

`;

            // -----------------------------
            // SEND REQUEST TO GEMINI
            // -----------------------------

            const parts = [];

            // Add user's text
            parts.push({
                text: idea.trim()
            });

            // Add reference image if uploaded
            if (req.file) {

                parts.push({
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: req.file.buffer.toString("base64")
                    }
                });

            }

            // Send text + image to Gemini
            const response =
                await ai.models.generateContent({

                    model:
                        "gemini-3-flash-preview",

                    contents: [
                        {
                            role: "user",
                            parts: parts
                        }
                    ],

                    config: {

                        systemInstruction:
                            systemPrompt,

                        maxOutputTokens:
                            1500

                    }

                });

            // -----------------------------
            // GET GENERATED PROMPT
            // -----------------------------

            const generatedPrompt =
                response.text?.trim();

            if (!generatedPrompt) {

                throw new Error(
                    "Gemini returned an empty response."
                );
            }

            console.log("Gemini generated prompt successfully.");
            console.log("Generated prompt:", generatedPrompt);

            // -----------------------------
            // SAVE HISTORY
            // -----------------------------

            let historySaved = false;

            if (req.session.userId) {

                const historyId =
                    Date.now().toString() +
                    Math.random().toString(36).substring(2, 8);

                const historyItem = {
                    id: historyId,
                    userId: req.session.userId,
                    type: "prompt",
                    idea: idea.trim(),
                    prompt: generatedPrompt,
                    outputLanguage: language,
                    outputFormat: format,
                    createdAt: new Date().toISOString()
                };

                await historyCollection
                    .doc(historyId)
                    .set(historyItem);
                console.log("History saved to Firebase:", historyId);

                await usersCollection
                    .doc(req.session.userId)
                    .update({
                        generatedCount: FieldValue.increment(1)
                    });

                historySaved = true;}
            // -----------------------------
            // SEND RESULT
            // -----------------------------

            res.json({

                success: true,

                prompt:
                    generatedPrompt,

                outputLanguage:
                    language,

                outputFormat:
                    format,

                historySaved:
                    historySaved

            });

        } catch (error) {

            console.error(
                "Gemini API Error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "Couldn't generate a prompt right now. Please try again."

            });

        }

    }
);


// =====================================================
// GENERATE VIDEO PROMPT
// =====================================================

app.post(
    "/api/video-prompt",
    upload.single("video"),

    async (req, res) => {

        try {

            console.log("Uploaded video:", req.file);
            console.log("Idea:", req.body.idea);

            const {
                idea,
                outputLanguage,
                outputFormat
            } = req.body;


            // =================================================
            // CHECK IDEA
            // =================================================

            if (
                typeof idea !== "string" ||
                !idea.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter a video description."

                });

            }


            // =================================================
            // CHECK VIDEO
            // =================================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please upload a video."

                });

            }


            // =================================================
            // OUTPUT LANGUAGE
            // =================================================

            const language =
                outputLanguage &&
                    typeof outputLanguage === "string"

                    ? outputLanguage.trim()

                    : "English";


            // =================================================
            // OUTPUT FORMAT
            // =================================================

            const formats = [
                "Original Script",
                "English Letters",
                "Mixed Language"
            ];


            const format =
                outputFormat &&
                    typeof outputFormat === "string" &&
                    formats.includes(
                        outputFormat.trim()
                    )

                    ? outputFormat.trim()

                    : "Original Script";


            // =================================================
            // FORMAT INSTRUCTION
            // =================================================

            let formatInstruction = "";


            if (
                format ===
                "Original Script"
            ) {

                formatInstruction = `

Write the final prompt in ${language}
using the original writing script normally
used for that language.

Do NOT convert the language into English
or Latin letters.

`;

            }


            else if (
                format ===
                "English Letters"
            ) {

                formatInstruction = `

Write the final prompt in ${language},
but use English / Latin letters.

Do NOT use the original writing script.

`;

            }


            else if (
                format ===
                "Mixed Language"
            ) {

                formatInstruction = `

Write the final prompt using a natural
combination of ${language} and English.

The main language must remain ${language}.

Do not make the entire output English.

`;

            }


            // =================================================
            // VIDEO SYSTEM PROMPT
            // =================================================

            const systemPrompt = `

You are the AI engine behind Prompt Studio's
Video Prompt Generator.

Your task is to analyze the uploaded video
and the user's description, then create a
professional, detailed, ready-to-use prompt
for an AI video generation or video editing model.

IMPORTANT:

Analyze the uploaded video carefully.

Understand:

- Main subject
- Characters or objects
- Actions
- Movement
- Camera movement
- Camera angle
- Camera position
- Composition
- Environment
- Background
- Lighting
- Colors
- Visual style
- Mood
- Motion
- Transitions
- Timing
- Important visual details

Use the uploaded video as the visual reference.

The user's description is:

${idea.trim()}

Preserve the important intention from the
user's description.

If the description is vague, use reasonable
information from the uploaded video to make
the prompt more useful.

Do not invent unrelated details.

IMPORTANT OUTPUT LANGUAGE:

The final prompt MUST be written in:

${language}

IMPORTANT OUTPUT FORMAT:

The selected format is:

${format}

${formatInstruction}

PROMPT QUALITY:

- Make the prompt detailed and professional.
- Clearly describe the desired video.
- Preserve the important visual characteristics
  of the reference video.
- Describe camera movement when visible.
- Describe subject movement when visible.
- Describe lighting and atmosphere.
- Describe composition and framing.
- Describe realistic motion.
- Make the prompt ready to use with an AI
  video generation or editing model.

OUTPUT RULES:

- Output ONLY the finished prompt.
- No explanation.
- No preamble.
- No "Here is your prompt".
- No quotation marks around the prompt.
- No markdown headers.

`;


            // =================================================
            // SEND VIDEO + TEXT TO GEMINI
            // =================================================

            const parts = [];


            // User description

            parts.push({

                text:
                    idea.trim()

            });


            // Uploaded video

            parts.push({

                inlineData: {

                    mimeType:
                        req.file.mimetype,

                    data:
                        req.file.buffer.toString(
                            "base64"
                        )

                }

            });


            console.log(
                "Sending video to Gemini..."
            );


            // =================================================
            // GEMINI
            // =================================================

            const response =
                await ai.models.generateContent({

                    model:
                        "gemini-3-flash-preview",

                    contents: [

                        {

                            role: "user",

                            parts:
                                parts

                        }

                    ],

                    config: {

                        systemInstruction:
                            systemPrompt,

                        maxOutputTokens:
                            2000

                    }

                });


            // =================================================
            // GET RESULT
            // =================================================

            const generatedPrompt =
                response.text?.trim();


            if (!generatedPrompt) {

                throw new Error(
                    "Gemini returned an empty response."
                );

            }
            console.log("Gemini generated prompt successfully.");
            console.log("Generated prompt:", generatedPrompt);

            // =================================================
            // SAVE HISTORY
            // =================================================

            let historySaved = false;

            if (req.session.userId) {

                const historyId =
                    Date.now().toString() +
                    Math.random()
                        .toString(36)
                        .substring(2, 8);

                const historyItem = {

                    id:
                        historyId,

                    userId:
                        req.session.userId,

                    type:
                        "video",

                    idea:
                        idea.trim(),

                    prompt:
                        generatedPrompt,

                    outputLanguage:
                        language,

                    outputFormat:
                        format,

                    originalFileName:
                        req.file.originalname,

                    createdAt:
                        new Date().toISOString()

                };

                await historyCollection
                    .doc(historyId)
                    .set(historyItem);
                console.log("History saved to Firebase:", historyId);
                await usersCollection
                    .doc(req.session.userId)
                    .update({
                        generatedCount: FieldValue.increment(1)
                    });

                historySaved = true;
            }
            // =================================================
            // SEND RESULT TO FRONTEND
            // =================================================

            return res.json({

                success: true,

                prompt:
                    generatedPrompt,

                outputLanguage:
                    language,

                outputFormat:
                    format,

                historySaved:
                    historySaved

            });


        } catch (error) {

            console.error(
                "Video Gemini Error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    "Couldn't generate a video prompt right now. Please try again."

            });

        }

    }
);



// =====================================================
// GENERATE VOICE PROMPT
// =====================================================

app.post(
    "/api/voice-prompt",
    upload.single("voice"),

    async (req, res) => {

        try {

            console.log("Uploaded voice:", req.file);
            console.log("Idea:", req.body.idea);

            const {
                idea,
                outputLanguage,
                outputFormat
            } = req.body;


            // =================================================
            // CHECK IDEA
            // =================================================

            if (
                typeof idea !== "string" ||
                !idea.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter a voice description."

                });

            }


            // =================================================
            // CHECK VOICE
            // =================================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please upload an audio file."

                });

            }


            // =================================================
            // OUTPUT LANGUAGE
            // =================================================

            const language =
                outputLanguage &&
                    typeof outputLanguage === "string"

                    ? outputLanguage.trim()

                    : "English";


            // =================================================
            // OUTPUT FORMAT
            // =================================================

            const formats = [
                "Original Script",
                "English Letters",
                "Mixed Language",
                "Original Prompt"
            ];


            const format =
                outputFormat &&
                    typeof outputFormat === "string" &&
                    formats.includes(
                        outputFormat.trim()
                    )

                    ? outputFormat.trim()

                    : "Original Prompt";


            // =================================================
            // FORMAT INSTRUCTION
            // =================================================

            let formatInstruction = "";


            if (
                format ===
                "Original Script"
            ) {

                formatInstruction = `

Write the final prompt in ${language}
using the original writing script normally
used for that language.

Do NOT convert the language into English
or Latin letters.

`;

            }


            else if (
                format ===
                "English Letters"
            ) {

                formatInstruction = `

Write the final prompt in ${language},
but use English / Latin letters.

Do NOT use the original writing script.

`;

            }


            else if (
                format ===
                "Mixed Language"
            ) {

                formatInstruction = `

Write the final prompt using a natural
combination of ${language} and English.

The main language must remain ${language}.

Do not make the entire output English.

`;

            }


            // =================================================
            // VOICE SYSTEM PROMPT
            // =================================================

            const systemPrompt = `

You are the AI engine behind Prompt Studio's
Voice Prompt Generator.

Your task is to analyze the uploaded audio
and the user's description, then create a
professional, detailed, ready-to-use prompt
for an AI voice generation, voice cloning,
speech synthesis, or audio editing model.

IMPORTANT:

Analyze the uploaded audio carefully.

Understand:

- Voice characteristics
- Speaker characteristics
- Tone
- Pitch
- Speed
- Speaking style
- Emotion
- Energy
- Pronunciation
- Accent
- Pauses
- Rhythm
- Intonation
- Audio quality
- Background noise
- Overall atmosphere

Use the uploaded audio as the reference.

The user's description is:

${idea.trim()}

Preserve the important intention from the
user's description.

If the description is vague, use reasonable
information from the uploaded audio to make
the prompt more useful.

Do not invent unrelated details.

IMPORTANT OUTPUT LANGUAGE:

The final prompt MUST be written in:

${language}

IMPORTANT OUTPUT FORMAT:

The selected format is:

${format}

${formatInstruction}

PROMPT QUALITY:

- Make the prompt detailed and professional.
- Clearly describe the desired voice.
- Preserve important characteristics of the
  reference audio.
- Describe tone and emotion.
- Describe speaking speed and rhythm.
- Describe pitch and vocal characteristics.
- Describe pronunciation and accent when relevant.
- Make the prompt ready to use with an AI
  voice generation or editing model.

OUTPUT RULES:

- Output ONLY the finished prompt.
- No explanation.
- No preamble.
- No "Here is your prompt".
- No quotation marks around the prompt.
- No markdown headers.

`;


            // =================================================
            // SEND AUDIO + TEXT TO GEMINI
            // =================================================

            const parts = [];


            // User description

            parts.push({

                text:
                    idea.trim()

            });


            // Uploaded audio

            parts.push({

                inlineData: {

                    mimeType:
                        req.file.mimetype,

                    data:
                        req.file.buffer.toString(
                            "base64"
                        )

                }

            });


            console.log(
                "Sending voice to Gemini..."
            );


            // =================================================
            // GEMINI
            // =================================================

            const response =
                await ai.models.generateContent({

                    model:
                        "gemini-3-flash-preview",

                    contents: [

                        {

                            role: "user",

                            parts:
                                parts

                        }

                    ],

                    config: {

                        systemInstruction:
                            systemPrompt,

                        maxOutputTokens:
                            2000

                    }

                });


            // =================================================
            // GET RESULT
            // =================================================

            const generatedPrompt =
                response.text?.trim();


            if (!generatedPrompt) {

                throw new Error(
                    "Gemini returned an empty response."
                );

            }
            console.log("Gemini generated prompt successfully.");
            console.log("Generated prompt:", generatedPrompt);

            // =================================================
            // SAVE HISTORY
            // =================================================

            let historySaved = false;

            if (req.session.userId) {

                const historyId =
                    Date.now().toString() +
                    Math.random()
                        .toString(36)
                        .substring(2, 8);

                const historyItem = {

                    id:
                        historyId,

                    userId:
                        req.session.userId,

                    type:
                        "voice",

                    idea:
                        idea.trim(),

                    prompt:
                        generatedPrompt,

                    outputLanguage:
                        language,

                    outputFormat:
                        format,

                    originalFileName:
                        req.file.originalname,

                    createdAt:
                        new Date().toISOString()
                };

                await historyCollection
                    .doc(historyId)
                    .set(historyItem);
                console.log("History saved to Firebase:", historyId);
                await usersCollection
                    .doc(req.session.userId)
                    .update({
                        generatedCount: FieldValue.increment(1)
                    });

                historySaved = true;
            }

            // =================================================
            // SEND RESULT
            // =================================================

            return res.json({

                success: true,

                prompt:
                    generatedPrompt,

                outputLanguage:
                    language,

                outputFormat:
                    format,

                historySaved:
                    historySaved

            });


        } catch (error) {

            console.error(
                "Voice Gemini Error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    "Couldn't generate a voice prompt right now. Please try again."

            });

        }

    }
);

// =====================================================
// GENERATE FILE PROMPT
// =====================================================

app.post(
    "/api/file-prompt",
    upload.single("file"),

    async (req, res) => {

        try {

            console.log("Uploaded file:", req.file);
            console.log("Idea:", req.body.idea);

            const {
                idea,
                outputLanguage,
                outputFormat
            } = req.body;


            // =================================================
            // CHECK IDEA
            // =================================================

            if (
                typeof idea !== "string" ||
                !idea.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please enter a file description."

                });

            }


            // =================================================
            // CHECK FILE
            // =================================================

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please upload a file."

                });

            }


            // =================================================
            // OUTPUT LANGUAGE
            // =================================================

            const language =
                outputLanguage &&
                    typeof outputLanguage === "string"

                    ? outputLanguage.trim()

                    : "English";


            // =================================================
            // OUTPUT FORMAT
            // =================================================

            const formats = [
                "Original Script",
                "English Letters",
                "Mixed Language",
                "Original Prompt"
            ];


            const format =
                outputFormat &&
                    typeof outputFormat === "string" &&
                    formats.includes(
                        outputFormat.trim()
                    )

                    ? outputFormat.trim()

                    : "Original Prompt";


            // =================================================
            // FORMAT INSTRUCTION
            // =================================================

            let formatInstruction = "";


            if (
                format ===
                "Original Script"
            ) {

                formatInstruction = `

Write the final prompt in ${language}
using the original writing script normally
used for that language.

Do NOT convert the language into English
or Latin letters.

`;

            }


            else if (
                format ===
                "English Letters"
            ) {

                formatInstruction = `

Write the final prompt in ${language},
but use English / Latin letters.

Do NOT use the original writing script.

`;

            }


            else if (
                format ===
                "Mixed Language"
            ) {

                formatInstruction = `

Write the final prompt using a natural
combination of ${language} and English.

The main language must remain ${language}.

Do not make the entire output English.

`;

            }


            // =================================================
            // FILE SYSTEM PROMPT
            // =================================================

            const systemPrompt = `

You are the AI engine behind Prompt Studio's
File Prompt Generator.

Your task is to analyze the uploaded file
and the user's description, then create a
professional, detailed, ready-to-use prompt
for an AI model.

The uploaded file may contain:

- Text
- Documents
- Images
- PDFs
- Data
- Tables
- Other useful information

Analyze the uploaded file carefully.

Understand the important information,
structure, content, context, and details
contained in the file.

The user's description is:

${idea.trim()}

Use the uploaded file as the main reference.

Preserve the important intention from the
user's description.

If the description is vague, use reasonable
information from the uploaded file to make
the prompt more useful.

Do not invent unrelated details.

IMPORTANT OUTPUT LANGUAGE:

The final prompt MUST be written in:

${language}

IMPORTANT OUTPUT FORMAT:

The selected format is:

${format}

${formatInstruction}

PROMPT QUALITY:

- Make the prompt detailed and professional.
- Clearly describe what the AI should do.
- Use relevant information from the uploaded file.
- Preserve important details from the file.
- Organize the task clearly.
- Make the prompt practical and ready to use.
- Do not invent unrelated requirements.

OUTPUT RULES:

- Output ONLY the finished prompt.
- No explanation.
- No preamble.
- No "Here is your prompt".
- No quotation marks around the prompt.
- No markdown headers.

`;


            // =================================================
            // SEND FILE + TEXT TO GEMINI
            // =================================================

            const parts = [];


            // User description

            parts.push({

                text:
                    idea.trim()

            });


            // Uploaded file

            parts.push({

                inlineData: {

                    mimeType:
                        req.file.mimetype,

                    data:
                        req.file.buffer.toString(
                            "base64"
                        )

                }

            });


            console.log(
                "Sending file to Gemini..."
            );


            // =================================================
            // GEMINI
            // =================================================

            const response =
                await ai.models.generateContent({

                    model:
                        "gemini-3-flash-preview",

                    contents: [

                        {

                            role: "user",

                            parts:
                                parts

                        }

                    ],

                    config: {

                        systemInstruction:
                            systemPrompt,

                        maxOutputTokens:
                            2000

                    }

                });


            // =================================================
            // GET RESULT
            // =================================================

            const generatedPrompt =
                response.text?.trim();


            if (!generatedPrompt) {

                throw new Error(
                    "Gemini returned an empty response."
                );

            }
            console.log("Gemini generated prompt successfully.");
            console.log("Generated prompt:", generatedPrompt);

            // =================================================
            // SAVE HISTORY
            // =================================================

            let historySaved = false;

            if (req.session.userId) {

                const historyId =
                    Date.now().toString() +
                    Math.random()
                        .toString(36)
                        .substring(2, 8);

                const historyItem = {

                    id:
                        historyId,

                    userId:
                        req.session.userId,

                    type:
                        "file",

                    idea:
                        idea.trim(),

                    prompt:
                        generatedPrompt,

                    outputLanguage:
                        language,

                    outputFormat:
                        format,

                    originalFileName:
                        req.file.originalname,

                    createdAt:
                        new Date().toISOString()
                };

                await historyCollection
                    .doc(historyId)
                    .set(historyItem);
                console.log("History saved to Firebase:", historyId);
                await usersCollection
                    .doc(req.session.userId)
                    .update({
                        generatedCount: FieldValue.increment(1)
                    });

                historySaved = true;
            }

            // =================================================
            // SEND RESULT
            // =================================================

            return res.json({

                success: true,

                prompt:
                    generatedPrompt,

                outputLanguage:
                    language,

                outputFormat:
                    format,

                historySaved:
                    historySaved

            });


        } catch (error) {

            console.error(
                "File Gemini Error:",
                error
            );


            return res.status(500).json({

                success: false,

                error:
                    "Couldn't generate a file prompt right now. Please try again."

            });

        }

    }
);


// =====================================================
// SAVE PROMPT
// =====================================================

app.post(
    "/api/saved",
    requireLogin,
    async (req, res) => {

        try {

            const {
                prompt,
                title,
                type,
                idea,
                outputLanguage,
                outputFormat
            } = req.body;

            if (
                typeof prompt !== "string" ||
                !prompt.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Prompt is required."

                });

            }

            const savedId =
                Date.now().toString() +
                Math.random()
                    .toString(36)
                    .substring(2, 8);

            const savedItem = {

                id: savedId,

                userId:
                    req.session.userId,

                title:
                    typeof title === "string"
                        ? title.trim()
                        : "Saved Prompt",

                type:
                    typeof type === "string"
                        ? type.trim()
                        : "prompt",

                idea:
                    typeof idea === "string"
                        ? idea.trim()
                        : "",

                prompt:
                    prompt.trim(),

                outputLanguage:
                    typeof outputLanguage === "string"
                        ? outputLanguage.trim()
                        : "English",

                outputFormat:
                    typeof outputFormat === "string"
                        ? outputFormat.trim()
                        : "Original Script",

                createdAt:
                    new Date().toISOString()

            };

            await savedCollection
                .doc(savedId)
                .set(savedItem);

            console.log(
                "Prompt saved to Firebase:",
                savedId
            );

            res.json({

                success: true,

                message:
                    "Prompt saved successfully.",

                saved: savedItem

            });

        } catch (error) {

            console.error(
                "Save Prompt Error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "Couldn't save prompt."

            });

        }

    }
);

// =====================================================
// GET USER SAVED PROMPTS
// =====================================================

app.get(
    "/api/saved",
    requireLogin,
    async (req, res) => {

        try {

            const snapshot =
                await savedCollection
                    .where(
                        "userId",
                        "==",
                        req.session.userId
                    )
                    .get();

            const saved =
                snapshot.docs
                    .map(doc => doc.data())
                    .filter(item => item.deleted !== true)
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    );

            console.log(
                "Firebase saved prompts loaded:",
                saved.length
            );

            res.json({

                success: true,

                saved: saved

            });

        } catch (error) {

            console.error(
                "Get Saved Error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "Couldn't load saved prompts."

            });

        }

    }
);



// =====================================================
// DELETE ONE SAVED PROMPT
// =====================================================

app.delete(
    "/api/saved/:id",
    requireLogin,
    async (req, res) => {

        try {

            const savedRef =
                savedCollection.doc(req.params.id);

            const savedDoc =
                await savedRef.get();

            if (!savedDoc.exists) {

                return res.status(404).json({
                    success: false,
                    error: "Saved prompt not found."
                });

            }

            const savedData =
                savedDoc.data();

            // Make sure user owns this saved prompt
            if (
                savedData.userId !==
                req.session.userId
            ) {

                return res.status(403).json({
                    success: false,
                    error: "Not authorized."
                });

            }

            // Soft delete
            await savedRef.update({
                deleted: true,
                deletedAt: new Date().toISOString()
            });

            console.log(
                "Saved prompt marked as deleted:",
                req.params.id
            );

            res.json({
                success: true,
                message: "Saved prompt deleted."
            });

        } catch (error) {

            console.error(
                "Delete Saved Error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Couldn't delete saved prompt."
            });

        }

    }
);

// =====================================================
// DELETE ALL USER SAVED PROMPTS
// =====================================================

app.delete(
    "/api/saved",
    requireLogin,
    async (req, res) => {

        try {

            const snapshot =
                await savedCollection
                    .where(
                        "userId",
                        "==",
                        req.session.userId
                    )
                    .get();

            if (snapshot.empty) {

                return res.json({
                    success: true,
                    message: "No saved prompts to delete."
                });

            }

            const batch = db.batch();

            snapshot.docs.forEach((doc) => {

                batch.update(doc.ref, {
                    deleted: true,
                    deletedAt: new Date().toISOString()
                });

            });

            await batch.commit();

            console.log(
                "All saved prompts marked as deleted:",
                req.session.userId
            );

            res.json({
                success: true,
                message: "All saved prompts deleted."
            });

        } catch (error) {

            console.error(
                "Delete All Saved Error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Couldn't delete saved prompts."
            });

        }

    }
);


// =====================================================
// GET USER HISTORY
// =====================================================

app.get(
    "/api/history",
    requireLogin,
    async (req, res) => {

        try {

            const snapshot = await historyCollection
                .where("userId", "==", req.session.userId)
                .get();

            const userHistory = snapshot.docs
                .map(doc => doc.data())
                .filter(item => item.deleted !== true)
                .sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );

            console.log(
                "Firebase history loaded:",
                userHistory.length
            );

            res.json({
                success: true,
                history: userHistory
            });

        } catch (error) {

            console.error(
                "Firebase History Error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Couldn't load history."
            });
        }
    }
);
// =====================================================
// DELETE ONE HISTORY ITEM
// =====================================================

app.delete(
    "/api/history/:id",
    requireLogin,
    async (req, res) => {

        try {

            const historyRef =
                historyCollection.doc(req.params.id);

            const historyDoc =
                await historyRef.get();

            if (!historyDoc.exists) {

                return res.status(404).json({
                    success: false,
                    error: "History item not found."
                });

            }

            const historyData =
                historyDoc.data();

            // Make sure user owns this history item
            if (
                historyData.userId !==
                req.session.userId
            ) {

                return res.status(403).json({
                    success: false,
                    error: "Not authorized."
                });

            }

            // Soft delete
            await historyRef.update({
                deleted: true,
                deletedAt: new Date().toISOString()
            });

            console.log(
                "History item marked as deleted:",
                req.params.id
            );

            res.json({
                success: true,
                message: "History item deleted."
            });

        } catch (error) {

            console.error(
                "Delete History Error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Couldn't delete history item."
            });
        }
    }
);
// =====================================================
// DELETE ALL USER HISTORY
// =====================================================

app.delete(
    "/api/history",
    requireLogin,
    async (req, res) => {

        try {

            const snapshot = await historyCollection
                .where(
                    "userId",
                    "==",
                    req.session.userId
                )
                .get();

            if (snapshot.empty) {

                return res.json({
                    success: true,
                    message: "No history to delete."
                });

            }

            const batch = db.batch();

            snapshot.docs.forEach((doc) => {

                batch.update(doc.ref, {
                    deleted: true,
                    deletedAt: new Date().toISOString()
                });

            });

            await batch.commit();

            console.log(
                "All user history marked as deleted:",
                req.session.userId
            );

            res.json({
                success: true,
                message: "All history deleted."
            });

        } catch (error) {

            console.error(
                "Delete All History Error:",
                error
            );

            res.status(500).json({
                success: false,
                error: "Couldn't delete history."
            });
        }
    }
);
// =====================================================
// WORKSPACE OVERVIEW
// =====================================================

app.get(
    "/api/workspace",
    requireLogin,
    async (req, res) => {

        try {

            const userId =
                req.session.userId;


            // =================================================
            // GET USER
            // =================================================

            const userDoc =
                await usersCollection
                    .doc(userId)
                    .get();

            if (!userDoc.exists) {

                return res.status(404).json({

                    success: false,

                    error:
                        "User not found."

                });

            }

            const user =
                userDoc.data();


            // =================================================
            // GET HISTORY
            // =================================================

            const historySnapshot =
                await historyCollection
                    .where(
                        "userId",
                        "==",
                        userId
                    )
                    .get();

            const history =
                historySnapshot.docs
                    .map(doc => doc.data())
                    .filter(item => item.deleted !== true)
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    );


            // =================================================
            // GET SAVED
            // =================================================

            const savedSnapshot =
                await savedCollection
                    .where(
                        "userId",
                        "==",
                        userId
                    )
                    .get();

            const saved =
                savedSnapshot.docs
                    .map(doc => doc.data())
                    .filter(item => item.deleted !== true)
                    .sort(
                        (a, b) =>
                            new Date(b.createdAt) -
                            new Date(a.createdAt)
                    );

            // =================================================
            // COUNTS
            // =================================================

            const generatedCount =
                Number(user.generatedCount || 0);

            const historyCount =
                history.length;

            const savedCount =
                saved.length;


            // =================================================
            // RECENT PROMPTS
            // =================================================

            const recentPrompts =
                history.slice(0, 5);


            // =================================================
            // RECENT SAVED
            // =================================================

            const recentSaved =
                saved.slice(0, 5);


            // =================================================
            // RESPONSE
            // =================================================

            res.json({

                success: true,

                user: {

                    id: userId,

                    name:
                        user.name || "",

                    email:
                        user.email || ""

                },

                counts: {

                    generated:
                        generatedCount,

                    history:
                        historyCount,

                    saved:
                        savedCount

                },

                recentPrompts:
                    recentPrompts,

                recentSaved:
                    recentSaved

            });


        } catch (error) {

            console.error(
                "Workspace Error:",
                error
            );

            res.status(500).json({

                success: false,

                error:
                    "Couldn't load workspace."

            });

        }

    }
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            status: "ok",

            message:
                "Prompt Studio backend is running."

        });

    }
);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;