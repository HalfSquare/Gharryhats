const e = require("express");

exports.showHats = function(hats){
    let htmlString = "<div id=shopBlock> ";
    let hatArray = JSON.parse(JSON.stringify(hats));

    hatArray.forEach(hat => {
        htmlString += '<div id=shopItem style="height:220px;width:400px;"> ';
        //console.log(hat);
        //console.log(hat._id);
        htmlString += '<a href="/hat/' + hat._id + '">';
        htmlString += '<p style="float: left;"> <img src="img/' + hat.imageUrl + '" alt="' + hat.name + '" height="200" width="200"></img> </p>';
        htmlString += '</a>';
        htmlString += "<p>" + hat.name + " for " + hat.animal + "</p>";
        htmlString += "<p>" + "$" + hat.price + "</p>";
        htmlString += '<button type="submit">Add to Cart</button>';
        htmlString += " </div>";
    });

    //htmlString += "<p> Length: " + hatArray.length + "</p>";

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
    htmlString += '<img src="/img/' + hat.imageUrl + '" alt="' + hat.name + '" height="300" width="300"></img>';
    htmlString += "<p>" + hat.name + " for " + hat.animal + "</p>";
    htmlString += "<p>" + "$" + hat.price + "</p>";
    htmlString += '<button type="button">Add to Cart</button>';
    htmlString += " </div> </div>";
    return htmlString;
}

exports.showRelated = function(related){
    if (related.length <= 0){
        return "";
    }
    let relatedArray = JSON.parse(JSON.stringify(related));
    let htmlString = '<br><div class="relatedBlock"> <p> We see you\'re looking at ' + related[0].animal + ' hats - here\'s some related products you might enjoy! </p>';
    let counter = 0;
    htmlString += '<div class="row">';

    relatedArray.forEach(rel => {
        if (counter == 5){
            htmlString += '<div class="row">';
        }
        htmlString += '<div id=relatedItem style="height:120px;width:120px;padding:10px"> ';
        htmlString += '<div class="col">';
        //console.log(hat);
        //console.log(hat._id);
        htmlString += '<a href="/hat/' + rel._id + '">';
        htmlString += '<p style="float: left;"> <img src="/img/' + rel.imageUrl + '" alt="' + rel.name + '" height="100" width="100"></img> </p>';
        htmlString += '</a>';
        htmlString += " </div></div>";
        if (counter == 5){
            htmlString += '</div>';
            counter = 0;
        }
        else {
            counter++;
        }
    });

    //htmlString += "<p> Length: " + hatArray.length + "</p>";

    htmlString += " </div></div>";
    return htmlString;
}