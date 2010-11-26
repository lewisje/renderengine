Engine.include("/components/component.transform2d.js");
Engine.include("/components/component.domrender.js");
Engine.include("/engine.object2d.js");
Engine.include("/engine.timers.js");

Engine.initObject("Player", "Object2D", function() {
	
	var Player = Object2D.extend({
		
		constructor: function() {
			this.base("box");
			
			this.add(Transform2DComponent.create("move"));
			this.setPosition(Math2D.randomPoint(HTMLContextTest.getFieldBox()));

			this.add(DOMRenderComponent.create("draw"));
			
			// The representation of this object in an HTML context
			this.setElement($("<div>").css({
				width: 100,
				height: 100,
				border: "1px solid white",
				position: "absolute"
			}));
			
			this.setBoundingBox(Rectangle2D.create(0,0,100,100));
			this.setOrigin(50,50);
		},
		
		update: function(renderContext, time) {
			renderContext.pushTransform();
			
			this.setRotation(this.getRotation() + 1);
			
			this.base(renderContext, time);
			renderContext.popTransform();
		},
		
		setPosition: function(point) {
			this.getComponent("move").setPosition(point);
		},
		
		setRotation: function(angle) {
			this.getComponent("move").setRotation(angle);
		},
		
		getRotation: function() {
			return this.getComponent("move").getRotation();
		}
		
	}, {
		getClassName: function() {
			return "Player";
		}
	});
	
	return Player;
});
