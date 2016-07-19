define(['jquery', 'firebase'], function($, firebase){
    function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function login(){
             window.location.href = "sign-in.html";
         }
    header = document.createElement("header");
    $(header).prepend('<button id="rulesButton">?</button>  CODINAMES <a id="login" href="sign-in.html">Log In</a> <div id="usr"> </div>');
    $("body").prepend(header);
    $("head").append('<style>#rulesbutton,#usr #login{position:absolute;top:0;bottom:0;height:30px;line-height:30px}header{z-index:1;text-align:center;position:fixed;left:0;right:0;height:70px;top:0!important;background:#444;line-height:70px;font-family:thick;font-size:32px}#usr,#usr:before{font-size:18px;display:inline-block}#usr{right:30px;float:right;margin:auto}#rulesbutton{left:30px;width:30px;margin:auto 0;border-radius:50%;background:#000;font-family:thick;font-size:18px} </style>');
    firebase.database().ref("users/" + op.name).on('value', function(data) {
        $("#usr").html(cap(data.val() ? data.val().Name : "guest"));
    });

})