let dbOp = require(dbOperations.js);
let hats = dbOp.getAll();

function displayItems() {
    let p = document.getElementById("item").innerText = hats;
}