
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDruA1fSmRQqM-xDgJhgu9KKVGWj8GpuKQ",
        authDomain: "tree-kiosk-system-v2.firebaseapp.com",
        databaseURL: "https://tree-kiosk-system-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "tree-kiosk-system-v2",
        storageBucket: "tree-kiosk-system-v2.appspot.com",
        messagingSenderId: "719927565453",
        appId: "1:719927565453:web:caa088914a03dcb2e896c4"
    };
    
    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    // Google Sign-In
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    document.getElementById('googleLoginBtn').addEventListener('click', async () => {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            console.log('User is signed in:', result.user.email);
            show('front', 'login-container');
            setlocal( result.user.email);
                } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    });

    // GitHub Sign-In
    const githubProvider = new firebase.auth.GithubAuthProvider();
    document.getElementById('githubLoginBtn').addEventListener('click', async () => {
        try {

            const result = await auth.signInWithPopup(githubProvider);
            console.log('User is signed in:', result.user.email);
            show('front', 'login-container');   
            setlocal( result.user.email);    
         } catch (error) {
            console.error('Error during GitHub sign-in:', error);
        }
    });

    // Monitor Auth State
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('User is signed in:', user.email);
            localStorage.setItem('name', user.email);
            setlocal( user.email);
            show('front', 'login-container');
        } else {
            show('login-container', 'front');
        }
    });

    // Click counter and logout function
    let clickCount = 0;

    document.getElementById('logout-link').addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent the default link behavior
        clickCount++; // Increment click count

        if (clickCount === 5) { // Check if clicked 5 times
            try {
                await auth.signOut();
                console.log('User signed out after 5 clicks');
                show('login-container', 'front'); // Show the login container after sign out
                clickCount = 0; // Reset click count after logout
            } catch (error) {
                console.error('Error during sign out:', error);
            }
        }
    });

    function show(shown, hidden) {
        document.getElementById(shown).style.display = 'block';
        document.getElementById(hidden).style.display = 'none';
    }

    async function setlocal(email) {

        const docRef = db.collection("data").doc("owner").collection("email").doc(email);
    
        docRef.get().then((doc) => {
            if (doc.exists) {
                const name = doc.data().name;
                const isActive = doc.data().active;
    
                if (isActive !== false) {
                    localStorage.setItem("name", name);
                    localStorage.setItem("email", email);
                } else {
                    show('nouser', 'front');
                    show('nouser', 'login-container');
                }
            } else {
                show('nouser', 'front');
                show('nouser', 'login-container');
            }
        }).catch((error) => {
            show('nouser', 'front');
            show('nouser', 'login-container');
        });
    }
    
    
    async function logout() {
        try {
            await auth.signOut(); // Firebase 세션 로그아웃
    
            // Google 세션 로그아웃
            const googleLogoutUrl = 'https://accounts.google.com/Logout';
            const win = window.open(googleLogoutUrl, '_blank');
            if (win) {
                win.close();
            } else {
                console.error('Unable to open Google logout window.');
            }
    
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
