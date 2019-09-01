import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
}

class Firebase {
    constructor() {
        firebase.initializeApp(config)
        this.auth = firebase.auth()
        this.db = firebase.database()
    }

    logout() {
        return this.auth.signOut()
    }

    login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password)
    }

    async signup(displayName, email, password) {
        const user = await this.auth.createUserWithEmailAndPassword(
            email,
            password,
        )

        await user.user.updateProfile({
            displayName,
        })
    }
}

export default Firebase