this.name = "Escort Formations Randomiser";
this.description = "Randomise escort formations for traders and pirates";

"use strict";

this.startUp = function() {
		this.$escortPatterns = new Object;
		this.$escortPatterns["combat-spread"] = [new Vector3D(1,0,0), 
																							new Vector3D(-1,0,0)];
		this.$escortPatterns["echelon"] = [new Vector3D(1,0,-1)];
		this.$escortPatterns["trail"] = [new Vector3D(1,0,-5),
																		 new Vector3D(-1,0,-6)];
		this.$escortPatterns["vform"] = [new Vector3D(1,0,-1), 
																			new Vector3D(-1,0,-1)];
		this.$escortPatterns["arrowhead"] = [new Vector3D(1,0,-1),
																					new Vector3D(-1,0,-1),
																					new Vector3D(0,1,-1),
																					new Vector3D(0,-1,-1)];
		this.$escortPatterns["convoy"] = [new Vector3D(0,1,7),
																			new Vector3D(0,-1,-7),
																			new Vector3D(1,1,6),
																			new Vector3D(-1,-1,-6),
																			new Vector3D(1,-1,-6),
																			new Vector3D(-1,1,6)];
		this.$escortPatterns["scouting-spread"] = [new Vector3D(5,0,-4),
																							 new Vector3D(-5,0,4)];
		this.$escortPatterns["planebox"] = [new Vector3D(2,0,2),
																				new Vector3D(-2,0,-2),
																				new Vector3D(-2,0,2),
																				new Vector3D(2,0,-2)];
		this.$escortPatterns["twistbox"] = [new Vector3D(2,0,2),
																				new Vector3D(0,2,-2),
																				new Vector3D(0,-2,-2),
																				new Vector3D(-2,0,2)];
		this.$escortPatterns["octahedron"] = [new Vector3D(4,0,0),
																					new Vector3D(-4,0,0),
																					new Vector3D(0,4,0),
																					new Vector3D(0,-4,0),
																					new Vector3D(0,1,4),
																					new Vector3D(0,-1,-4)];
		this.$escortPatterns["pyramid"] = [new Vector3D(0,1,4.5),
																			 new Vector3D(3,3,-3),
																			 new Vector3D(-3,-3,-3),
																			 new Vector3D(-3,3,-3),
																			 new Vector3D(3,-3,-3)];
		this.$escortPatterns["wave"] = [new Vector3D(1,0,-0.5),
																		new Vector3D(-1,0,-0.5),
																		new Vector3D(1,0,-5.5),
																		new Vector3D(-1,0,-5.5),
																		new Vector3D(2,0,-6.5),
																		new Vector3D(-2,0,-6.5)];
		this.$escortPatterns["screen"] = [new Vector3D(1,0,3),
																			 new Vector3D(-1,0,3),
																			 new Vector3D(4,0,2.5),
																			 new Vector3D(-4,0,2.5)];
		this.$escortPatterns["opencolumn"] = [new Vector3D(-0.5,0,-2),
																					new Vector3D(0.5,0,-2),
																					new Vector3D(-0.5,0,-4),
																					new Vector3D(0.5,0,-4),
																					new Vector3D(-0.5,0,-6),
																					new Vector3D(0.5,0,-6)];
		this.$escortPatterns["stack"] = [new Vector3D(0.5,1,0),
																		 new Vector3D(-0.5,-1,0)];
		this.$escortPatterns["flank"] = [new Vector3D(1,0,-1),
																		 new Vector3D(-1,0,-1),
																		 new Vector3D(7,0,-1),
																		 new Vector3D(-7,0,-1)];
		this.$escortPatterns["bulge"] = [new Vector3D(-1,0,-1),
																			new Vector3D(1,0,-1),
																			new Vector3D(0,0.5,7),
																			new Vector3D(0,-0.5,-7)];
		this.$escortPatterns["near-far"] = [new Vector3D(-1,0,-1),
																				new Vector3D(7,0,-1),
																				new Vector3D(1,0,-1),
																				new Vector3D(6,0,-2)];
		this.$escortPatterns["helix"] = [new Vector3D(-3,0,-1),
																		 new Vector3D(0,3,-2),
																		 new Vector3D(3,0,-3),
																		 new Vector3D(0,-3,-4),
																		 new Vector3D(-4,0,-5),
																		 new Vector3D(0,4,-6),
																		 new Vector3D(4,0,-7),
																		 new Vector3D(0,-4,-8)
																		];
		this.$escortPatterns["vwide"] = [new Vector3D(4,0,-4), 
																			new Vector3D(-4,0,-4)];


}

this.shipSpawned = function(ship) {
		if (!ship.script) return; // odd, but seems to happen occasionally
		if (ship.script.coordinatesForEscortPosition != Script.prototype.coordinatesForEscortPosition) { 
				this.$debug(ship.displayName+" has escort coordinates already");
				return; 
		} // already has some custom coordinates
		if (ship.script.$efr_pattern) { 
				this.$debug(ship.displayName+" has $efr_pattern already");
				return; 
		} // variable name conflict
		if (ship.script.$efr_timer) { 
				this.$debug(ship.displayName+" has $efr_pattern already");
				return; 
		} // variable name conflict
		var offensiveChance = 0;
		if (ship.primaryRole == "trader") {
				offensiveChance = 0.15;
		} else if (ship.primaryRole == "bigTrader" && ship.name != "Super Bulk Hauler") {
				offensiveChance = 0.15;
		} else if (ship.primaryRole == "liner" || ship.primaryRole == "coachwhip" || ship.primaryRole == "fuelship") { // from Transports OXP
				offensiveChance = 0.05;
		} else if (ship.primaryRole == "pirate") {
				offensiveChance = 0.75;
		} else if (ship.primaryRole == "police" || ship.primaryRole == "hunter") {
				offensiveChance = 0.9;
		} else {
				this.$debug(ship.displayName+" has no included role");
				return; // stock ships only
		}
		if (Math.random() < 0.10) { 
				this.$debug("No escort change for "+ship.displayName);
				return; 
		} // keep default formation
		
// timer to allow escorts to be set up too
		if (Math.random() < offensiveChance) {
				ship.script.$efr_timer = new Timer(ship,function() { worldScripts["Escort Formations Randomiser"].$setupOffensiveEscorts(ship); },0.25);
		} else {
				ship.script.$efr_timer = new Timer(ship,function() { worldScripts["Escort Formations Randomiser"].$setupDefensiveEscorts(ship); },0.25);
		}
}

this.$setupOffensiveEscorts = function(ship) {
		var formations = new Array();
		if (!ship.escorts) {
				return; // no escorts
		} else if (ship.escorts.length <= 2) {
				formations.push("combat-spread","echelon","vform","trail","near-far","vwide");
		} else if (ship.escorts.length <= 4) {
				formations.push("combat-spread","echelon","arrowhead","vform","wave","stack","flank","near-far","helix","vwide");
		} else {
				formations.push("arrowhead","vform","wave","stack","flank","helix");
		}
		this.$setupEscortFormation(ship,formations[Math.floor(Math.random()*formations.length)]);
}

this.$setupDefensiveEscorts = function(ship) {
		var formations = new Array();
		if (!ship.escorts) {
				return; // no escorts
		} else if (ship.escorts.length <= 2) {
				formations.push("convoy","vform","scouting-spread","screen","near-far","vwide");
		} else if (ship.escorts.length <= 4) {
				formations.push("planebox","twistbox","vform","convoy","screen","opencolumn","bulge","near-far","vwide");
		} else {
				formations.push("octahedron","pyramid","vform","convoy","bulge");
		}
		this.$setupEscortFormation(ship,formations[Math.floor(Math.random()*formations.length)]);
}

this.$setupEscortFormation = function(ship,formation) {
		ship.script.$efr_pattern = formation;
		ship.script.coordinatesForEscortPosition = function(index) {
				var positions = worldScripts["Escort Formations Randomiser"].$getEscortPositions(this.$efr_pattern);
				var layer = 1+Math.floor(index/positions.length);
				var component = index % positions.length;
				
				return positions[component].multiply(this.ship.collisionRadius * 5 * layer).add([0,0,7.5*this.ship.collisionRadius]);
		}
		this.$debug(ship.displayName+" assigned formation: "+formation);
		ship.updateEscortFormation();
}

this.$getEscortPositions = function(pattern) {
		if (this.$escortPatterns[pattern]) {
				return this.$escortPatterns[pattern];
		} else {
				return this.$escortPatterns["vform"];
		}
}

this.$debug = function(msg) {
//		log(this.name,msg);
}