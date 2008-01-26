
var Asteroid = HostObject.extend({

   size: 10,
   
   speed: 0.3,
   
   pBox: null,

   constructor: function(pWidth, pHeight) {
      this.base("Asteroid");
      
      // Add components to move and draw the asteroid
      this.add(new Mover2DComponent("move"));
      this.add(new Vector2DComponent("draw"));
   
      this.pBox = new Rectangle2D(0, 0, pWidth, pHeight);
   
      this.setup(pWidth, pHeight);
   },

   preUpdate: function(renderContext, time) {
      renderContext.pushTransform();   
   },

   postUpdate: function(renderContext, time) {
      renderContext.popTransform();
      var c_draw = this.getComponent("draw");
      var c_mover = this.getComponent("move");
      
      // Get XY radius and set new collision box
      var rX = Math.floor(c_draw.getBoundingBox().len_x() / 2);
      var rY = Math.floor(c_draw.getBoundingBox().len_y() / 2);
      var c = c_mover.getPosition();

      // Wrap if it's off the playing field
      var p = new Point2D(c);
      if (c.x < this.pBox.x || c.x > this.pBox.x + this.pBox.width ||
          c.y < this.pBox.y || c.y > this.pBox.y + this.pBox.height)
      {
         if (c.x > this.pBox.x + this.pBox.width + rX)
         {
            p.x = (this.pBox.x - (rX - 10));
         }
         if (c.y > this.pBox.y + this.pBox.height + rY)
         {
            p.y = (this.pBox.y - (rY - 10));
         }
         if (c.x < this.pBox.x - rX)
         {
            p.x = (this.pBox.x + this.pBox.width + (rX - 10));
         }
         if (c.y < this.pBox.y - rY)
         {
            p.y = (this.pBox.y + this.pBox.height + (rX - 10));
         }
         
         c_mover.setPosition(p);
      }
      
   },
    
   setup: function(playfieldWidth, playfieldHeight) {
      
      // Randomize the position and velocity
      var c_mover = this.getComponent("move");
      var c_draw = this.getComponent("draw");

      // Pick one of the three shapes
      var tmp = [];
      tmp = Asteroid.shapes[Math.floor(Math.random() * 3)];

      // Scale the shape
      var s = [];
      for (var p = 0; p < tmp.length; p++)
      {
         var pt = new Point2D(tmp[p][0], tmp[p][1]);
         pt.mul(this.size);
         s.push(pt);
      }

      // Assign the shape to the vector component
      c_draw.setPoints(s);
      c_draw.setLineStyle("silver");
      c_draw.setFillStyle("blue");

      // Pick a random rotation and spin speed
      c_mover.setRotation( Math.floor(Math.random() * 360));
      c_mover.setAngularVelocity( Math.floor(Math.random() * 10) > 5 ? 0.005 : -0.005);

      // Set the position
      var pos = new Point2D( Math.floor(Math.random() * playfieldWidth),
                             Math.floor(Math.random() * playfieldHeight));
      c_mover.setPosition( pos );

      
      // Set a random motion vector
      var vec = new Vector2D( Math.floor(Math.random() * 10) > 5 ? this.speed : -this.speed,
                              Math.floor(Math.random() * 10) > 5 ? this.speed : -this.speed);
      c_mover.setVelocity(vec);
   }
   
}, { // Static Only

   /** 
    * The different asteroid vector lists
    */
   shapes: [[ [-4, -2], [-2, -3], [ 0, -5], [ 4, -4], [ 5,  0], [ 3,  4], [-2,  5], [-3,  2], [-5,  1] ],
            [ [-3, -3], [-1, -5], [ 3, -4], [ 2, -2], [ 5, -3], [ 5,  2], [ 1,  5], [-4,  5], [-3,  0] ],
            [ [-2, -3], [ 2, -5], [ 5, -1], [ 3,  2], [ 4,  4], [ 0,  5], [-3,  2] ]]
   
});