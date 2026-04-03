// A1 Coaching - Authentication Module
// No database lookups needed for deterministic login

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const STORAGE_KEY = 'A1_COACHING_PAPER_1_SESSION_FINAL_2026';

// Deterministic hash: SHA-256 (Identical to keygen.html)
async function generateDeterministicKey(phone) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error("SECURE_CONTEXT_REQUIRED");
    }
    const encoder = new TextEncoder();
    const data = encoder.encode('SECURE_A1_PRO_KEY_007_#99' + phone + '_priority');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray  = new Uint8Array(hashBuffer);

    let password = '';
    for (let i = 0; i < 6; i++) {
        password += CHARSET[hashArray[i] % CHARSET.length];
    }
    return password;
}

// Logic for Login Page
function initLoginPage() {
    const phoneForm = document.getElementById('phoneForm');
    const pinForm = document.getElementById('pinForm');

    if (!phoneForm || !pinForm) return;

    let currentPhoneNumber = "";

    phoneForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const numStr = document.getElementById('phoneNumber').value;
        const phoneError = document.getElementById('phoneError');
        phoneError.style.display = 'none';
        
        if (numStr.length !== 10) {
            phoneError.innerText = "சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்!";
            phoneError.style.display = 'block';
            return;
        }

        currentPhoneNumber = numStr;
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        // Push state for back button handling on mobile
        window.history.pushState({ loginStep: 2 }, '', '');
    });

    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.loginStep === 2) {
             document.getElementById('step1').style.display = 'none';
             document.getElementById('step2').style.display = 'block';
        } else {
             document.getElementById('step2').style.display = 'none';
             document.getElementById('step1').style.display = 'block';
        }
    });

    pinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const enteredPin = document.getElementById('pinCode').value.toUpperCase();
        const pinError = document.getElementById('pinError');
        
        // Final length check before processing
        if (enteredPin.length !== 6) {
            pinError.style.display = 'block';
            pinError.innerText = "பாஸ்வேர்டு 6 இலக்கங்களாக இருக்க வேண்டும்! (Requires 6 Characters)";
            return;
        }

        const loginBtn = document.getElementById('loginBtn');
        
        pinError.style.display = 'none';
        loginBtn.disabled = true;
        loginBtn.innerText = "சரிபார்க்கப்படுகிறது... (Verifying)";

        try {
            const correctKey = await generateDeterministicKey(currentPhoneNumber);
            
            if (enteredPin === correctKey) {
                // Success - Deterministic Key Matches
                const userData = {
                    phoneNumber: currentPhoneNumber,
                    name: "மாணவர்", // Since we are in local-only deterministic mode
                    loggedInAt: Date.now()
                };
                // Cleanup all old legacy sessions
                ['a1_user_session', 'a1_user_session_v2', 'a1_user_session_v3'].forEach(k => localStorage.removeItem(k));
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                window.location.href = "index.html";
            } else {
                pinError.innerText = "தவறான பாஸ்வேர்டு! (Invalid Password)";
                pinError.style.display = 'block';
                loginBtn.disabled = false;
                loginBtn.innerText = "உள்நுழைய (Login)";
            }
        } catch (error) {
            console.error("Login Error:", error);
            if (error.message === "SECURE_CONTEXT_REQUIRED") {
                pinError.innerText = "பாதுகாப்பு பிழை: localhost அல்லது HTTPS பயன்படுத்தவும்.";
            } else {
                pinError.innerText = "பிழை! மீண்டும் முயலவும்.";
            }
            pinError.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.innerText = "உள்நுழைய (Login)";
        }
    });

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step1').style.display = 'block';
        });
    }
}

// Global Auth State Checker
export function checkAuth() {
    try {
        const path = window.location.pathname.toLowerCase();
        
        // Is this a public page? (Check for common extensions and root paths)
        const isPublicPage = 
            path.includes('login.html') || path.endsWith('/login') || 
            path.includes('keygen.html') || path.endsWith('/keygen');

        const session = localStorage.getItem(STORAGE_KEY);
        const user = session ? JSON.parse(session) : null;
        
        const isProtected = !isPublicPage;

        if (isProtected && !user) {
            // Force redirect to login for protected pages
            window.location.replace("login.html");
            return null;
        }

        // If on login page but already logged in, go to dashboard
        if ((path.includes('login.html') || path.endsWith('/login')) && user) {
            window.location.replace("index.html");
            return user;
        }

        // Apply student name to UI if logged in
        if (user) {
            const userNameEls = document.querySelectorAll('#studentName, #studentNameDisplay');
            userNameEls.forEach(el => {
                el.innerText = user.name || "மாணவர்";
            });
        }

        // Ensure page is visible
        document.documentElement.style.visibility = 'visible';
        return user;
    } catch (e) {
        console.error("Auth Exception:", e);
        document.documentElement.style.visibility = 'visible';
        return null;
    }
}

export function waitForAuth() {
    const session = localStorage.getItem(STORAGE_KEY);
    const user = session ? JSON.parse(session) : null;
    return Promise.resolve(user);
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "login.html"; // Redirect to login after logout
}

// Global exposure for legacy scripts
window.logout = logout;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkAuth();
        initLoginPage();
    });
} else {
    checkAuth();
    initLoginPage();
}

