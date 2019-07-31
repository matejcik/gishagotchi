{
  function fill(w, h) {
    return new (me.Renderable.extend({
      init() {
        this._super(me.Renderable, "init", [0, 0, w, h]);
      },
      destroy() {},
      draw(renderer) {
        let color = renderer.getColor();
        renderer.setColor("#5EFF7E");
        renderer.fillRect(0, 0, this.width, this.height);
        renderer.setColor(color);
      }
    }))();
  }
  
  game.fillfn = fill

  game.Wall = me.Entity.extend({
    init(x, y) {
      this._super(me.Entity, "init", [
        x,
        y,
        { width: 1, height: me.game.viewport.height }
      ]);
      this.z = -1;
      this.body.collisionType = me.collision.types.WORLD_SHAPE;
      this.renderable = fill(this.width, this.height);
    }
  });

  game.Floor = me.Entity.extend({
    init(x, y) {
      this._super(me.Entity, "init", [
        x,
        y,
        { height: 1000, width: me.game.viewport.width }
      ]);
      this.z = -1;
      this.body.collisionType = me.collision.types.WORLD_SHAPE;
      this.renderable = fill(this.width, this.height);
    }
  });
}
