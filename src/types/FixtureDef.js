export default class FixtureDef {
  constructor(def) {
    this.def = def;
  }

  update(def) {
    this.def = def;
  }

  setShape(shape) {
    this.shape = shape;
  }

  setInstance(instance) {
    this.instance = instance;
  }
}
