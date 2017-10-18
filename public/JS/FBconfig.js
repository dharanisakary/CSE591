$(document).ready(function(){

    logout();

    $('#fb-login-button').on('click', function(){
       FBlogin();
    });

    $('#gg-login-button').on('click', function(){
       GoogleLogin();
    });

    $('#user-sign-out').on('click', function(){
       logout();
       window.location.href = "/WebApp/public/index.html";
    });

    function FBlogin() {
        var provider = new firebase.auth.FacebookAuthProvider();

        provider.addScope('public_profile, email, user_friends');

        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            var user = result.user

            console.log(result);

            firebase.auth().onAuthStateChanged(function(user) {
                firebase.database().ref('users/' + user.displayName).once('value', function(snapshot) {
                    var exists = (snapshot.val() !== null);
                    if (user) {
                        $.cookie("user", user.displayName);
                        $.cookie("uuid", user.uid);
                        if(exists){
                            console.log("user exists");
                            window.location.href = "/WebApp/public/home.html";
                        }
                        else{
                            console.log("creating user");
                            firebase.database().ref('users/' + user.displayName).set({
                                name: user.displayName,
                                hometown: "",
                                email: result.user.email,
                                age: "",
                                university: "",
                                highest_education: "",
                                job_title: ""
                            });

                            // firebase.database().ref('pre_screening/').set({
                            //     C_plus_plus: {
                            //         questions: [
                            //             "Do we have a String primitive data type in C++",
                            //             "Are there pointers in C++?",
                            //             "What is the acronym that C++ uses for standard input?",
                            //             "What is cout?",
                            //             "What is cin?"
                            //         ],
                            //         answers: {
                            //             question_1: [
                            //                 "Yes",
                            //                 "No",
                            //                 "1"
                            //             ],
                            //             question_2: [
                            //                 "Yes",
                            //                 "No",
                            //                 "0"
                            //             ],
                            //             question_3: [
                            //                 "cout",
                            //                 "cin",
                            //                 "stdin",
                            //                 "console.log",
                            //                 "2"
                            //             ],
                            //             question_4: [
                            //                 "Standard output",
                            //                 "Output Device",
                            //                 "1"
                            //             ],
                            //             question_5: [
                            //                 "Standard Input",
                            //                 "Input Device",
                            //                 "1"
                            //             ]
                            //         }
                            //     },
                            //     JavaScript:  {
                            //         questions: [
                            //             "Is JavaScript an Object-Orientated Programming Language?+",
                            //             "Are there any data types in Javascript?",
                            //             "What is the Javascript method for printing to the console?",
                            //             "Javascript does not have primitives.",
                            //             "Which method for emptying an array in Javascript is incorrect?"
                            //         ],
                            //         answers: {
                            //             question_1: [
                            //                 "Yes",
                            //                 "No",
                            //                 "1"
                            //             ],
                            //             question_2: [
                            //                 "Yes",
                            //                 "No",
                            //                 "1"
                            //             ],
                            //             question_3: [
                            //                 "cout << Hello World;",
                            //                 "print(Hello World)",
                            //                 "System.out.println(Hello World)",
                            //                 "console.log(Hello World)",
                            //                 "3"
                            //             ],
                            //             question_4: [
                            //                 "True",
                            //                 "False",
                            //                 "1"
                            //             ],
                            //             question_5: [
                            //                 "arrayList = []",
                            //                 "arrayList.length = 0",
                            //                 "arrayList.splice(0, arrayList.length)",
                            //                 "arrayList = null",
                            //                 "3"
                            //             ]
                            //         }
                            //     },
                            // });


                            window.location.href = "/WebApp/public/home.html";
                        }
                    }
                });
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

    function logout(){
        firebase.auth().signOut().then(function() {
            console.log("all users signed out");
        }).catch(function(error) {
            console.log(error);
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


