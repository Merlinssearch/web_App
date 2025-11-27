// ==============================
// IMPORTS & INITIAL SETUP
// ==============================
const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// ==============================
// DATABASE CONFIGURATION
// ==============================
const dbpath = path.join(__dirname, "../db.json");
// ==============================
// HELPER FUNCTIONS
// ==============================
function loadDB() {
  return JSON.parse(fs.readFileSync(dbpath, "utf8"));
}
function saveDB(data) {
  fs.writeFileSync(dbpath, JSON.stringify(data, null, 2), "utf8");
}
function generatePostId(title) {
  const now = new Date().toISOString();
  const hash = crypto.createHash("sha256");
  hash.update(title + now);
  return hash.digest("hex").slice(0, 16); // 16 Zeichen reichen für ID
}
async function generateHashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 11);
    return hashedPassword;
  } catch (error) {
    console.error("Password hashing error:", error);
    throw error; // Throw the error to be handled by the caller
  }
}

function generatePostId(title) {
  const now = new Date().toISOString();
  const hash = crypto.createHash("sha256");
  hash.update(title + now);
  return hash.digest("hex").slice(0, 16); // 16 Zeichen reichen für ID
}
// ==============================
// ROUTES - GET
// ==============================
router.get("/", (req, res) => {
  res.render("index", { title: "Express" });
});

router.get("/Anmeldung", (req, res) => {
  res.render("Anmeldung", { title: "Express" });
});

router.get("/Register", (req, res) => {
  res.render("Register", { title: "Express" });
});

router.get("/Blog", (req, res) => {
  const db = loadDB();
  const posts = Array.isArray(db.posts) ? db.posts : [];
  res.render("Blog", { title: "Express", posts });
});

//// Todo : Single Blog rengering ?
router.get("/single_Blog", (req, res) => {
  res.render("single_Blog", { title: "Express" });
});

router.get("/createblog", (req, res) => {
  res.render("createblog", { title: "Express" });
});
// Muss ich API route nichtt definieren oder kommt dann einfach nur ein api.js ? ß?? !? ?!? !
router.get("/api/posts", (req, res) => {
  const db = loadDB();
  res.json(db.posts || []);
});
// ==========================================
// ROUTES - POST - Register / Anmeldung etc
// =========================================
router.post("/Register", async (req, res) => {
  // Make the route handler async
  try {
    const { username, email, password, confirmPassword, terms } = req.body;
    const db = loadDB();

    if (db.users.some((user) => user.email === email)) {
      return res.render("Register", {
        title: "Registrieren",
        error: "Email bereits vorhanden",
      });
    }

    if (db.users.some((user) => user.username === username)) {
      return res.render("Register", {
        title: "Registrieren",
        error: "Username bereits vorhanden",
      });
    }

    if (password !== confirmPassword) {
      return res.render("Register", {
        title: "Registrieren",
        error: "Passwörter stimmen nicht überein",
      });
    }

    if (!terms) {
      return res.render("Register", {
        title: "Registrieren",
        error: "AGB müssen akzeptiert werden",
      });
    }

    const hashedPassword = await generateHashPassword(password); // Add const and await
    const newUser = { username, email, password: hashedPassword }; // Add const
    db.users.push(newUser);
    saveDB(db);
    res.redirect("/");
  } catch (error) {
    console.error("Registration error:", error);
    return res.render("Register", {
      title: "Registrierungsfehler",
      error: "Ein Fehler beim Registrieren ist aufgetreten",
    });
  }
});
//================================================
//            Create a new Blog
//================================================
router.post("/createblog", (req, res) => {
  const db = loadDB();
  const { content, title, description } = req.body;

  if (!(content && title && description)) {
    return res.render("createblog", {
      title: "Alle felder müssen ausgefüllt sein",
      error: "Alle felder müssen ausgefüllt sein",
    });
  }

  const newPost = { id: generatePostId(title), content, title, description };
  db.posts.push(newPost);
  saveDB(db);
  res.redirect("/Blog");
});

// ==============================
// Delete Stuff
// TODO : USER , BLOG ?
// ==============================
router.delete("/blog/:id", (req, res) => {
  const db = loadDB();
  const id = req.params.id;
  db.posts = db.posts.filter((post) => post.id != id);
  saveDB(db);
  res.json({ success: true });
});

// ==============================
// ERROR HANDLING - 404
// ==============================

router.get("*", (req, res) => {
  res.status(404).render("404", {
    title: "404 - Page Not Found",
    url: req.originalUrl,
    message: "Die gesuchte Seite existiert nicht.",
  });
});

// ==============================
// EXPORT ROUTER
// ==============================
module.exports = router;
