class PostType {
    constructor(postType) {
      this.name = postType.name;
      this.description = postType.description;
      this.price = postType.price;
      this.color = postType.color;
      this.background = postType.background;
    }
    present(this) {
      console.log(this);
    }
  }