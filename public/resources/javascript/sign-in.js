

$("form").submit(function(e) {
    var tuser;
    firebase.database().ref("users/" + $("#usernamesignup").val()).once("value", function(user) {
        tuser = user.val();
        console.log(user, user.val())
    }).then(function() {
        if (!$("#usernamesignup").val()) {
            console.log("enter username");
        } else if (tuser) {
            console.log("User already exists");
        } else if ($("#passwordsignup").val() !== $("#passwordsignup_confirm").val()) {
            console.log("Your passwords do not match");
        } else {
            firebase.auth().createUserWithEmailAndPassword($("#emailsignup").val(), $("#passwordsignup").val()).then(function(){
                firebase.database().ref("users/"+$("#usernamesignup").val()).set({"gender": "N/A"})
            }).catch(function(error) {
                console.log(error.console);
            });
        }

    })
    e.preventDefault();
    return false;
})

$(".fields").focus(function() {
    $(this).css({
        "outline": "1px solid black"
    });
    $(this).css({
        "outline-offset": "-1px"
    });
    $(this).css({
        "transition": "0s"
    });
})

$(".fields").focusout(function() {
    $(this).css({
        "outline": "0px solid black"
    });
    $(this).css({
        "outline-offset": "-0px"
    });
    $(this).css({
        "transition": "all 0.3s ease"
    });
})