// ═══════════════════════════════════════════════════════
// Firebase Device Lock Module
// இரண்டு projects-க்கும் பயன்படுத்தலாம்
// PROJECT_PREFIX மட்டும் மாற்றவும்
// ═══════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCtbz8pKglviupPOwQvlioqsLELuQqtHhA",
  authDomain: "greenpen-device-lock.firebaseapp.com",
  projectId: "greenpen-device-lock",
  storageBucket: "greenpen-device-lock.firebasestorage.app",
  messagingSenderId: "270447669595",
  appId: "1:270447669595:web:954d2aa2c38fc53b982a7e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Device ID உருவாக்கு ──────────────────────────────
export function getDeviceId() {
  let deviceId = localStorage.getItem('a1_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('a1_device_id', deviceId);
  }
  return deviceId;
}

// ── Device Check ─────────────────────────────────────
// projectPrefix: 'p1' for mygreenpen.com, 'p2' for tet1.mygreenpen.com
export async function checkDeviceLock(phone, deviceId, projectPrefix) {
  try {
    const docRef = doc(db, 'device_sessions', `${projectPrefix}_${phone}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // புதிய user — allow
      return { allowed: true };
    }

    const data = docSnap.data();
    if (data.deviceId === deviceId) {
      // Same device — allow
      return { allowed: true };
    }

    // வேற device — block
    return { 
      allowed: false, 
      message: 'இந்த account வேறு device-ல் பயன்படுத்தப்படுகிறது! உங்கள் நிர்வாகியை தொடர்பு கொள்ளவும்.' 
    };
  } catch (e) {
    console.log('Device check error:', e);
    return { allowed: true }; // Error ஆனால் allow
  }
}

// ── Device Register ───────────────────────────────────
export async function registerDevice(phone, deviceId, projectPrefix) {
  try {
    const docRef = doc(db, 'device_sessions', `${projectPrefix}_${phone}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.deviceId !== deviceId) {
        // வேற device ஏற்கனவே registered — block!
        return { 
          success: false, 
          blocked: true,
          message: 'இந்த account வேறு device-ல் பயன்படுத்தப்படுகிறது!' 
        };
      }
      return { success: true };
    }

    // புதிய device — register செய்
    await setDoc(docRef, {
      phone,
      deviceId,
      project: projectPrefix,
      browser: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    });

    return { success: true };
  } catch (e) {
    console.log('Device register error:', e);
    return { success: true };
  }
}

// ── Admin: எல்லா devices பார்க்க ─────────────────────
export async function getAllDeviceSessions() {
  try {
    const querySnapshot = await getDocs(collection(db, 'device_sessions'));
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    return sessions;
  } catch (e) {
    console.log('Get sessions error:', e);
    return [];
  }
}

// ── Admin: Device Reset ───────────────────────────────
export async function resetDevice(phone, projectPrefix) {
  try {
    const docRef = doc(db, 'device_sessions', `${projectPrefix}_${phone}`);
    await setDoc(docRef, { deleted: true }, { merge: false });
    // Actually delete
    const { deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
    await deleteDoc(docRef);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
