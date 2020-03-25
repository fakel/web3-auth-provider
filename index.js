const Web3 = require("web3");
const web3 = new Web3();
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const config = require("config.json");

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

admin.initializeApp();

function walletAuthProvider(signedMsg) {
  web3.eth.personal
    .ecRecover(config.msg, signedMsg)
    .then(wallet =>
      db
        .collection("wallets")
        .where("address", "==", wallet)
        .get()
    )
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
        return doc.id;
      });
    })
    .then(uid => admin.auth().createCustomToken(uid))
    .then(function(customToken) {
      // Send token back to client
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
}

//Client Side
/* firebase
  .auth()
  .signInWithCustomToken(token)
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  }); */
