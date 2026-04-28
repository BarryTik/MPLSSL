import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import './style.css'
import App from './App.vue'
import router from './router'

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUgOwFxMNWGcyP8Ci06CXWZJZnPEBY1KA",
    authDomain: "mpls-sl.firebaseapp.com",
    projectId: "mpls-sl",
    storageBucket: "mpls-sl.firebasestorage.app",
    messagingSenderId: "619345125699",
    appId: "1:619345125699:web:657cbab8d751ee1b430ff6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(firebaseApp)

// Initialize Auth
const auth = getAuth(firebaseApp)

// Create and setup Vue app
const app = createApp(App)

// Use VueFire plugin
app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth()
    ]
})

// Use Vue Router
app.use(router)

// Provide Firestore and Auth to all components
app.provide('db', db)
app.provide('auth', auth)

app.mount('#app')
