define(['jquery', 'firebase'], function($, firebase){
    $("head").append('<style>#rulesbutton,#usr{position:absolute;top:0;bottom:0;height:30px;line-height:30px}header{z-index:1;text-align:center;position:fixed;left:0;right:0;height:70px;top:0!important;background:#444;line-height:70px;font-family:thick;font-size:32px}#usr,#usr:before{font-size:18px;display:inline-block}#usr{right:30px;float:right;margin:auto}#rulesbutton{left:30px;width:30px;margin:auto 0;border-radius:50%;background:#000;font-size:18px}header>a{text-decoration:none;font-family:thick;}#ls {position: absolute; top: 0px;left:80px;font-size: 18;height: 100%;font-family:light}</style>');
    var header = document.createElement("header"),
        ls = document.createElement("div");
    $(header).prepend('<button id="rulesButton">?</button><a href="http://localhost:3000">CODINAMES</a> <div id="usr"> </div>');
    $("body").prepend(header);
    if (!document.location.href.match(/[^\/]+$/) || document.location.href.match(/[^\/]+$/)[0] !== "sign-in.html") {
    ls.id = "ls";
    $(ls).html("Sign Up | Log in");
    $(ls).on("click", function(){
        location.href="http://localhost:3000/sign-in.html"
    })
    $(header).append(ls);
    firebase.auth().onAuthStateChanged(function(User) {
        firebase.database().ref("users/"+User.uid).once('value', function(data){
            $("#usr").html(data.val().name || "guest");
            $(ls).html("Sign out");
            $(ls).off("click")
            $(ls).on("click", function(){
                firebase.auth().signOut();
            })
        })} else {
            $("#usr").html("Guest");
            $(ls).html("Sign up | Log in");
            $(ls).off("click")
            $(ls).on("click", function(){
                location.href="http://localhost:3000/sign-in.html"
            })
        }
    })
    }
})