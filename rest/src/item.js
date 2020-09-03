class Item { 
  constructor(_id, name, price, animal, color, design, imageUrl) {
    this._id = _id;
    this.name = name;
    this.price = price;
    this.color = color;
    this.animal = animal;
    this.design = design;
    this.imageUrl = imageUrl;

    this.isMarked = false;
  }
  toggle() {
    this.isMarked = !this.isMarked;
  }
}
