Varies the escort formations used by pirates, traders, and police.

Formations are divided into offensive formations (for a coordinated
attack) and defensive formations (for improved scanner coverage)

The world script will only assign formations to ships with the core
primary roles "trader", "pirate", "hunter" and "police", and the
common OXP roles "liner" and "bigTrader".

To explicitly exclude a ship from the new escort formations, set the
variable this.$efr_pattern to "none" in its ship script. Ships with
their own coordinatesForEscortPosition function in their ship script
will also be left alone.

To assign a random offensive formation to a different ship
worldScripts["Escort Formations Randomiser"].$setupOffensiveEscorts(ship);

To assign a random defensive formation to a different ship
worldScripts["Escort Formations Randomiser"].$setupDefensiveEscorts(ship);

You must call the above two functions after the ship's escorts have
been placed, which happens on the first update *after* the ship itself
appears.

To assign a specific formation to a ship
worldScripts["Escort Formations Randomiser"].$setupEscortFormation(ship,formation);

Available formations:

arrowhead
bulge
combat-spread
convoy
echelon
flank
helix
near-far
octahedron
opencolumn
planebox
pyramid
scouting-spread
screen
trail
twistbox
vform
vwide
wave



CHANGELOG:
1.0: initial release
1.1: include Liners and BigTrader roles. Add 'bulge', 'screen',
     'flank', 'helix', 'near-far', 'opencolumn' and 'vwide' formations
