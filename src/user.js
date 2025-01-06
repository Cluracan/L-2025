export class User {
  constructor(callback, game) {
    this.queue = [];
    this.ready = true;
    this.callback = (userInput) => callback(userInput, game);
    this.inventory = [];
    this.height = 1;
  }

  handleInput(userInput) {
    if (this.ready) {
      this.actionInput(userInput);
    } else {
      this.queue.push(userInput);
    }
  }

  async actionInput(userInput) {
    this.ready = false;
    await this.callback(userInput);
    this.readyUp();
  }

  readyUp() {
    this.ready = true;
    if (this.queue.length > 0) {
      this.actionInput(this.queue.shift());
    }
  }

  hasItem(searchItem) {
    return this.inventory.some((item) => item.name === searchItem);
  }

  findItem(searchItem) {
    return this.inventory.find((item) => item.name === searchItem);
  }

  removeItem(searchItem) {
    const itemIndex = this.inventory.findIndex(
      (item) => item.name === searchItem
    );
    console.log(`removing ${searchItem} index ${itemIndex}`);
    return this.inventory.splice(itemIndex, 1)[0];
  }

  addItem(item) {
    this.inventory.push(item);
  }

  removeInventory() {
    let inventoryHolder = [];
    while (this.inventory.length > 0) {
      inventoryHolder.push(this.inventory.pop());
    }
    return inventoryHolder;
  }

  // countItems() {
  //   return this.inventory.length;
  // }
  //TODO: If putting back in, make inventory private, then make an 'inventory' method that returns a hsallow copy of the private #inventory?  need to declare #inventory above constructor I tihnk (google private variables (?) in class)

  changeHeight(multiplier) {
    this.height = this.height * multiplier;
  }

  getHeight() {
    return this.height;
  }

  // Only save the queue for refresh, if saving for file it can be dropped.
  generateSaveData(forFile) {
    return {
      queue: forFile ? [] : this.queue,
      inventory: this.inventory,
    };
  }

  loadFromSaveData(saveData) {
    this.queue = saveData.queue;
    this.inventory = saveData.inventory;
    this.readyUp();
  }
}
