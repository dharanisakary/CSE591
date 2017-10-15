$(document).ready(function(){

    firebase.auth().signOut().then(function() {
        console.log("all users signed out");
    }).catch(function(error) {
        console.log(error);
    });

    $('#fb-login-button').on('click', function(){
       FBlogin();
    });

    $('#gg-login-button').on('click', function(){
       GoogleLogin();
    });

    function FBlogin() {
        var provider = new firebase.auth.FacebookAuthProvider();

        provider.addScope('public_profile, email, user_friends');

        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    $.cookie("user", user.displayName);
                    $.cookie("uuid", user.uid);

                    window.location.href = "/WebApp/public/home.html";
                }
            });
        }).catch(function(error) {
            console.log(error);
            var errorCode = error.code;
            var email = error.email;
            var credential = error.credential;
            var errorMessage = error.message;

            if (errorCode === 'auth/account-exists-with-different-credential') {
                $('#welcome-introduction').text('Sorry but the email, "'+ email + '" is already in use by a different account!');
            }
        });
    }

    function GoogleLogin() {
        var provider = new firebase.auth.GoogleAuthProvider();

        provider.addScope('profile, email');

        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user;

            window.location.href = "/public/home.html";

        }).catch(function(error) {
            console.log(error);
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;

            if (errorCode === 'auth/account-exists-with-different-credential') {
                $('#welcome-introduction').text('Sorry but the email, "'+ email + '" is already in use by a different account!');
            }
        });

    }
});


