let dbOp = require("./dbOperations.js");
let hats = dbOp.getAll();

function displayItems() {
    dbOp.connect();
    let p = document.getElementById("item").innerText = hats;
}