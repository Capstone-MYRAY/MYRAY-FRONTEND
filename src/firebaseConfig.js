import firebase from 'firebase'
const firebaseConfig = {
    // Your Credentials
    apiKey: "AIzaSyDzBMT8LggFUk5FmPk32aNPeEOaMPh1cKs",
    authDomain: "unialumni-89c7d.firebaseapp.com",
    databaseURL: "https://unialumni-89c7d-default-rtdb.firebaseio.com",
    projectId: "unialumni-89c7d",
    storageBucket: "unialumni-89c7d.appspot.com",
    messagingSenderId: "565543647713",
    appId: "1:565543647713:web:649782cf052bd3c2043aa0",
    measurementId: "G-8W63WJ393P"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
