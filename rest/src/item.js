const keys = ["name", "price", "animal", "color", "design", "imageUrl"];

exports.Item = class Item { 
  constructor(_id, name, price, animal, color, design, imageUrl) {
    this._id = _id;
    this.name = name;
    this.price = price;
    this.color = color;
    this.animal = animal;
    this.design = design;
    this.imageUrl = imageUrl;
  }
}

/**
 * Returns an array of keys that are missing from the object
 * that would qualify it as an Item
 * 
 * @param {Object} obj the object to test
 */
exports.validateItem = function (obj) {
  return keys.filter(key => !obj[key]);
}