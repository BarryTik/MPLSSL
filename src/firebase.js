import { initializeApp } from "firebase/app";
import { computed, onMounted, onUnmounted, ref } from "vue";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyBVJiMPTx1QD27k2u9TIY87zom4U9ulqqM",
  authDomain: "mpl-9f5c9.firebaseapp.com",
  databaseURL: "https://mpl-9f5c9-default-rtdb.firebaseio.com",
  projectId: "mpl-9f5c9",
  storageBucket: "mpl-9f5c9.appspot.com",
  messagingSenderId: "373456348732",
  appId: "1:373456348732:web:ba6c3e32212ce603ef0539",
  measurementId: "G-HV0JG0EDPT"
});

export const useAuthState = () => {
  const user = ref(null);
  const error = ref(null);
  const auth = getAuth();
  let unsubscribe;
  onMounted(() => {
    unsubscribe = onAuthStateChanged(
      auth,
      u => (user.value = u),
      e => (error.value = e)
    );
  });
  onUnmounted(() => unsubscribe());

  const isAuthenticated = computed(() => user.value != null);
  return { user, error, isAuthenticated };
};

export const useSignOut = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (e) {
    alert(e.message);
  }
};

export const getUserState = () =>
  new Promise((resolve, reject) =>
    onAuthStateChanged(getAuth(), resolve, reject)
  );

export const db = getDatabase(firebaseApp);
