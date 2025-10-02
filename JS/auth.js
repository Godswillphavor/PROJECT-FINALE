// Initialize Firebase (replace with your project config)
const firebaseConfig = {
    apiKey: "AIzaSyCmKT0Vna1X0SNHYgHoh4PZImtV3T9Taug",
      authDomain: "techxpert-d1b2f.firebaseapp.com",
      projectId: "techxpert-d1b2f",
      storageBucket: "techxpert-d1b2f.firebasestorage.app",
      messagingSenderId: "481719472745",
      appId: "1:481719472745:web:e3edec761212d5e58508f8",
      measurementId: "G-FVCEE58D05"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById("Register-Form").addEventListener("submit", function (e) {
  e.preventDefault(); // Stop the form from reloading the page

  // Get values from form
  const name = this.querySelector('input[placeholder="Name"]').value.trim();
  const email = this.querySelector('input[placeholder="Email"]').value.trim();
  const password = this.querySelector('input[placeholder="Password"]').value;

  // Firebase: Create user with email/password
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save extra user data to Firestore
      return db.collection("users").doc(user.uid).set({
        name: name,
        email: email,
        createdAt: new Date()
      });
    })
    .then(() => {
      alert("Signup successful! You can now sign in.");
      document.getElementById("Register-Form").reset();
    })
    .catch((error) => {
      alert("Signup Error: " + error.message);
    });
});




document.getElementById("Login-Form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = this.querySelector('#login-email').value.trim();
  const password = this.querySelector('#login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Get user info from Firestore
      return db.collection("users").doc(user.uid).get();
    })
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        alert(`Welcome back, ${userData.name}!`);
        // You can display this info in the UI instead of an alert
      } else {
        alert("No user data found.");
      }
    })
    .catch((error) => {
      alert("Login Error: " + error.message);
    });
});


// password reset logic
document.getElementById("forgot-password-link").addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();

  if (!email) {
    alert("Please enter your email address first.");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent! Check your inbox.");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});


// Google signin/signup

const googleProvider = new firebase.auth.GoogleAuthProvider();

document.getElementById("google-signin-btn").addEventListener("click", () => {
  auth.signInWithPopup(googleProvider)
    .then((result) => {
      const user = result.user;

      // Optional: Save user info to Firestore if first time login
      db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        provider: "google",
        createdAt: new Date()
      }, { merge: true }); // 'merge: true' keeps existing data

      alert(`Welcome, ${user.displayName}!`);
    })
    .catch((error) => {
      alert("Google Sign-In Error: " + error.message);
    });
});
