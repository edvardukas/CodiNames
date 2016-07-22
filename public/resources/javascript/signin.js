define(['jquery', 'firebase', 'auth'], function($, firebase) {
    var wait;
    firebase.auth().onAuthStateChanged(function(User) {
        console.log(User)
        if (!wait && User) location.href="http://localhost:3000";
    })
    $("form").submit(function(e) {
        if ($('[name="go"]').val() === "Log in") {
            firebase.auth().signInWithEmailAndPassword($("[name='email']").val(), $("[name='password']").val()).catch(function(error) {
                console.log(error)
            });
            e.preventDefault();
            return false;
        } else {
            wait = "please";
            firebase.auth().createUserWithEmailAndPassword($("[name='email']").val(), $("[name='password']").val()).then(function(user) {
                firebase.database().ref("users/" + user.uid).set({
                    name: $("[name='user']").val()
                })
                // location.href = "http://localhost:3000";
            }).catch(function(error) {
                console.log(error)
            });
            e.preventDefault();
            return false;
        }
    })
    $("#sw").click(function() {
        if ($(this).html() === "Sign Up") {
            $(this).html("Log In");
            $('[name="go"]').val("Sign Up");
            $('label[for="passcom"],label[for="user"]').css({
                height: "20px",
                opacity: "1"
            })
            $('input[name="passcom"],input[name="user"]').css({
                height: "40px",
                margin: "7px 0px",
                opacity: "1"
            })
        } else {
            $(this).html("Sign Up");
            $('[name="go"]').val("Log In");
            $('label[for="passcom"],label[for="user"]').css({
                height: "0px",
                opacity: "0"
            })
            $('input[name="passcom"],input[name="user"]').css({
                height: "0px",
                margin: "0px",
                opacity: "0"
            })
        }
    })
})