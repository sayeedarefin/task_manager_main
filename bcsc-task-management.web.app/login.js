// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyArIDzd27Wab7Rfjz_4VFSq4sAoThByxeQ",
//     authDomain: "bcsc-task-management.firebaseapp.com",
//     projectId: "bcsc-task-management",
//     storageBucket: "bcsc-task-management.appspot.com",
//     messagingSenderId: "397434642580",
//     appId: "1:397434642580:web:d5450207dcfa502eff1481",
//     measurementId: "G-VX1XK35QZ7"
//   };
  
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   const auth = firebase.auth();
  
//   document.getElementById('loginForm').addEventListener('submit', (e) => {
//     e.preventDefault();
  
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
  
//     auth.signInWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         const user = userCredential.user;
//         return user.getIdTokenResult();
//       })
//       .then((idTokenResult) => {
//         const claims = idTokenResult.claims;
  
//         if (claims.admin) {
//           window.location.href = 'task-manager.html?role=admin';
//         } else {
//           window.location.href = 'task-manager.html?role=user';
//         }
//       })
//       .catch((error) => {
//         document.getElementById('errorMessage').innerText = error.message;
//       });
//   });
  
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArIDzd27Wab7Rfjz_4VFSq4sAoThByxeQ",
    authDomain: "bcsc-task-management.firebaseapp.com",
    projectId: "bcsc-task-management",
    storageBucket: "bcsc-task-management.appspot.com",
    messagingSenderId: "397434642580",
    appId: "1:397434642580:web:d5450207dcfa502eff1481",
    measurementId: "G-VX1XK35QZ7"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // List of allowed emails
  const allowedEmails = [
            "cantonmentians.diary2020@gmail.com",
            "bcschrmd20@gmail.com",
            "bcscgraphicswing2020@gmail.com",
            "bcscmedia02@gmail.com",
            "bcscitwing20@gmail.com",
            "pr.dept.bccc@gmail.com",
            "bcscmktfrwing20@gmail.com",
            "bcscciawing2022@gmail.com",
            "bcscuawing20@gmail.com",
            "shakawatsajib348@gmail.com",
  ];
  
  // Handle form submission
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Optional: Add loading spinner here
    document.getElementById('errorMessage').innerText = "Logging in...";
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        // Check if the email is in the list of allowed emails
        if (allowedEmails.includes(user.email)) {
          // If the email is allowed, redirect the user
          return user.getIdTokenResult();
        } else {
          // If the email is not allowed, sign the user out and show error
          auth.signOut();
          throw new Error("You are not authorized to log in.");
        }
      })
      .then((idTokenResult) => {
        const claims = idTokenResult.claims;
  
        if (claims.admin) {
          window.location.href = 'https://bcsc-task-management.web.app/task-manager.html?role=user';
        } else {
          window.location.href = 'https://bcsc-task-management.web.app/task-manager.html?role=user';
        }
      })
      .catch((error) => {
        let errorMessage = error.message;
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is badly formatted.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
          case 'auth/unauthorized-domain':
            errorMessage = 'You are not authorized to log in.';
            break;
          default:
            errorMessage = 'An error occurred. Please try again.';
        }
        document.getElementById('errorMessage').innerText = errorMessage;
      });
  });
  