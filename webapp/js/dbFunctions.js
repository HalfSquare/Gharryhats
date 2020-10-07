const e = require("express");

exports.showHats = function(hats){
    let htmlString = "<div id=shopBlock> ";
    let hatArray = JSON.parse(JSON.stringify(hats));

    hatArray.forEach(hat => {
        htmlString += "<div id=item> ";
        //console.log(hat);
        //console.log(hat._id);
        htmlString += '<a href="/hat?hatid=' + hat._id + '">';
        htmlString += '<img src="' + hat.imageUrl + '" alt="Dog Hat" height="100" width="100"></img>';
        htmlString += '</a>';
        htmlString += "<p>" + hat.name + " for " + hat.animal + "</p>";
        htmlString += "<p>" + "$" + hat.price + "</p>";
        htmlString += " </div>";
    });

    htmlString += "<p> Length: " + hatArray.length + "</p>";

    htmlString += " </div>";
    return htmlString;
}

exports.showHat = function(hatString){
    let htmlString = "<div id=shopBlock> ";
    //let hatArray = JSON.parse(JSON.stringify(hat));
    let hatArray = JSON.parse(JSON.stringify(hatString));

    if (hatArray.length == 0){
        return "<p> " + '<iframe width="560" height="315" src="https://www.youtube.com/embed/SzfX9DUzwGg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' + " </p>" ;
    }

    let hat = hatArray[0];

    htmlString += "<div id=item> ";
    htmlString += '<a href="/hat?hatid=' + hat._id + '">';
    htmlString += '<img src="' + hat.imageUrl + '" alt="Dog Hat" height="100" width="100"></img>';
    htmlString += '</a>';
    htmlString += "<p>" + hat.name + " for " + hat.animal + "</p>";
    htmlString += "<p>" + "$" + hat.price + "</p>";
    htmlString += " </div>";

    //htmlString += "<p> Length: " + hatArray.length + "</p>";
    htmlString += " </div>";
    return htmlString;
}