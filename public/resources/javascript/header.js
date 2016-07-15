define(['jquery', 'firebase'], function($, firebase){
    header = document.createElement("header");
    $(header).prepend('<button id="rulesButton">?</button> CODINAMES <div id="usr"> </div>');
    $("body").prepend(header);
})