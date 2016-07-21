
$("#login").submit(function (e){
    console.log($("#loginName").val())
    console.log($("#password").val())
    firebase.auth().signInWithEmailAndPassword($("#loginName").val(),$("#password").val()).then(function(){
        location.href = ("http://localhost:3000");
    }).catch(function(error){
        console.log(error.message);
    })
    e.preventDefault();
})

$("#signup").submit(function(e) {
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
                firebase.database().ref("users/"+$("#usernamesignup").val()).set({
                "gender": "N/A",
                "Email": $('#emailsignup').val()
                })
            }).catch(function(error) {
                console.log(error.console);
            });
        }

    })
    e.preventDefault();
    return false;
})