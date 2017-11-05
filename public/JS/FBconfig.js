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
                            //         question_0: {
                            //             text: "Do we have a String primitive data type in C++",
                            //             answers: [
                            //                 {answer: "Yes"},
                            //                 {answer: "No"}
                            //             ],
                            //             correct_answer: "No"
                            //         },
                            //         question_1: {
                            //             text: "Are there pointers in C++?",
                            //             answers:[
                            //                 {answer: "Yes"},
                            //                 {answer: "No"}
                            //             ],
                            //             correct_answer: "Yes"
                            //         },
                            //         question_2: {
                            //             text:  "What is the acronym that C++ uses for standard input?",
                            //             answers:[
                            //                 {answer: "cout"},
                            //                 {answer: "cin"},
                            //                 {answer: "stdin"},
                            //                 {answer: "console.log"}
                            //             ],
                            //             correct_answer: "stdin"
                            //         },
                            //         question_3: {
                            //             text: "What is cout?",
                            //             answers: [
                            //                 {answer: "Standard output"},
                            //                 {answer: "Output Device"}
                            //             ],
                            //             correct_answer: "Output Device"
                            //         },
                            //         question_4: {
                            //             text: "What is cin?",
                            //             answers: [
                            //                 {answer: "Standard Input"},
                            //                 {answer: "Input Device"}
                            //             ],
                            //             correct_answer: "Input Device"
                            //         }
                            //     },
                            //     JavaScript:  {
                            //         question_0: {
                            //             text: "Is JavaScript an Object-Orientated Programming Language?+",
                            //             answers: [
                            //                 {answer: "Yes"},
                            //                 {answer: "No"}
                            //             ],
                            //             correct_answer: "No"
                            //         },
                            //         question_1: {
                            //             text: "Are there any data types in Javascript?",
                            //             answers:[
                            //                 {answer: "Yes"},
                            //                 {answer: "No"}
                            //             ],
                            //             correct_answer: "No"
                            //         },
                            //         question_2: {
                            //             text:  "What is the Javascript method for printing to the console?",
                            //             answers:[
                            //                 {answer: "cout << Hello World;"},
                            //                 {answer: "print(Hello World)"},
                            //                 {answer: "System.out.println(Hello World)"},
                            //                 {answer: "console.log(Hello World)"}
                            //             ],
                            //             correct_answer: "console.log(Hello World)"
                            //         },
                            //         question_3: {
                            //             text: "Javascript does not have primitives.",
                            //             answers: [
                            //                 {answer: "True"},
                            //                 {answer: "False"}
                            //             ],
                            //             correct_answer: "False"
                            //         },
                            //         question_4: {
                            //             text: "Which method for emptying an array in Javascript is incorrect?",
                            //             answers: [
                            //                 {answer: "arrayList = []"},
                            //                 {answer: "arrayList.length = 0"},
                            //                 {answer: "arrayList.splice(0, arrayList.length)"},
                            //                 {answer: "arrayList = null"}
                            //             ],
                            //             correct_answer: "arrayList = null"
                            //         }
                            //     }
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


