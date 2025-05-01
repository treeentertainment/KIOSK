const firebaseConfig = {
  apiKey: "AIzaSyBsUla3VNIn6wccJ43Ui5Dzw9mwIAHcdKE",
  authDomain: "auth.appwebsite.tech",
  databaseURL: "https://treeentertainment-default-rtdb.firebaseio.com",
  projectId: "treeentertainment",
  storageBucket: "treeentertainment.appspot.com",
  messagingSenderId: "302800551840",
  appId: "1:302800551840:web:1f7ff24b21ead43cc3eec5"
};

// Firebase 초기화
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const realtimeDb = firebase.database();
let clickCount = 0;

function googleProvider() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope(['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  googleSignInPopup(provider);
}

function googleSignInPopup(provider) {
  firebase.auth()
      .signInWithPopup(provider.setCustomParameters({ prompt: 'select_account' }))
      .then((result) => {
          var user = result.user;
          var originalEmail = user.email;
          var fixedemail = originalEmail.replace(".", "@");

          window.localStorage.setItem('email', JSON.stringify(fixedemail));

          firebase.database().ref('/people/admin/' + fixedemail).once('value').then((snapshot) => {
              const data = snapshot.val();
              if (data && data.enabled === true) {

                  firebase.database().ref('/people/data/' + data.store).once('value').then((snapshot) => {
                      const data = snapshot.val();
                      if (data && data.email === fixedemail) {
                          window.localStorage.setItem('name', JSON.stringify(data.name));
                          show("startface", "login-container");
                        } else {
                          alert("올바른 데이터가 아니거나 관리자가 아닙니다. 잠시후 로그아웃 됩니다.");
                          firebase.auth().signOut();
                          show("login-container", "startface");
                      }
                  });

              } else {
                  alert("관리자가 아닙니다. 잠시후 로그아웃 됩니다.");
                  firebase.auth().signOut();
                  show("login-container", "startface");
              }
            }).catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              alert(`에러 코드: ${errorCode} 에러 메시지: ${errorMessage}`);
              show("login-container", "startface");
          });
      }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(`에러 코드: ${errorCode} 에러 메시지: ${errorMessage}`);
          show("login-container", "startface");
      });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      var originalEmail = user.email;
      var fixedemail = originalEmail.replace(".", "@");

      window.localStorage.setItem('email', JSON.stringify(fixedemail));

      firebase.database().ref('/people/admin/' + fixedemail).once('value').then((snapshot) => {
          const data = snapshot.val();
          if (data && data.enabled === true) {
            window.localStorage.setItem('number', JSON.stringify(data.store));
              firebase.database().ref('/people/data/' + data.store).once('value').then((snapshot) => {
                  const data = snapshot.val();
                  if (data && data.email === fixedemail) {
                      window.localStorage.setItem('name', JSON.stringify(data.name));
                      show("startface", "login-container");
                    } else {
                      alert("관리자가 아닙니다. 잠시후 로그아웃 됩니다.");
                      firebase.auth().signOut();
                      show("login-container", "startface");
                  }
                });
          } else {
              alert("관리자가 아닙니다. 잠시후 로그아웃 됩니다.");
              firebase.auth().signOut();
              show("login-container", "startface");
          }
        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(`에러 코드: ${errorCode} 에러 메시지: ${errorMessage}`);
          show("login-container", "startface");
      });
      
  } else {
      show("login-container", "startface"); 
  }
});

function show(shown, hidden) {
    document.getElementById(shown).style.display='block';
    document.getElementById(hidden).style.display='none';
    return false;
  }

  async function logout() {
    try {
        await auth.signOut(); // Firebase 세션 로그아웃

       // 상태 초기화
        localStorage.clear();
        sessionStorage.clear();
        clickCount = 0;

        console.error('finish');
        window.location.reload();  // 강제로 새로고침하여 상태 초기화
    } catch (error) {
        console.error('Error during sign out:', error);
    }
}

  
document.getElementById('logout-link').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default link behavior
    clickCount++; // Increment click count

    if (clickCount === 5) { // Check if clicked 5 times
        try {
            await logout();
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    }
});
  
const loginpassword = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
      var user = result.user;
      var originalEmail = user.email;
      var fixedemail = originalEmail.replace(".", "@");

      window.localStorage.setItem('email', JSON.stringify(fixedemail));

      firebase.database().ref('/people/admin/' + fixedemail).once('value').then((snapshot) => {
          const data = snapshot.val();
          if (data && data.enabled === true) {

              firebase.database().ref('/people/data/' + data.store).once('value').then((snapshot) => {
                  const data = snapshot.val();
                  if (data && data.email === fixedemail) {
                      window.localStorage.setItem('name', JSON.stringify(data.name));
                      show("startface", "login-container");
                    } else {
                      alert("올바른 데이터가 아니거나 관리자가 아닙니다. 잠시후 로그아웃 됩니다.");
                      firebase.auth().signOut();
                      show("login-container", "startface");
                  }
              });

          } else {
              alert("관리자가 아닙니다. 잠시후 로그아웃 됩니다.");
              firebase.auth().signOut();
              show("login-container", "startface");
          }
        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(`에러 코드: ${errorCode} 에러 메시지: ${errorMessage}`);
          show("login-container", "startface");
      });
    })
    .catch((error) => {
      alert("Error: " + error.message);
      show("login-container", "startface");

    });
};

window.loginpassword = loginpassword;

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    loginpassword();
  }
});
