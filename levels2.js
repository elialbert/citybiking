var rushHourLevel = {
    description: "see if you can navigate across the road without getting into trouble. watch out for doors! bonus: take a right, pull a u-turn, then take a left.",
    levelSize: [],
    roadDefs: [
	{xStart:400,yStart:0, xFinish:400, yFinish:250, roadWidth:100, sidewalkWidth:17},
	{xStart:400,yStart:350, xFinish:400, yFinish:600, roadWidth:100, sidewalkWidth:17},
	{xStart:0,yStart:300, xFinish:350, yFinish:300, roadWidth:100, sidewalkWidth:17},
	{xStart:450,yStart:300, xFinish:800, yFinish:300, roadWidth:100, sidewalkWidth:17},
    ],
    bikeCoords: [438, 550],
    intersectionDefs: {1:
		       [
			   [350,250],
			   [350,350],
			   [450,350],
			   [450,250],
			   [350,250],
		       ]
		      },
    stopSigns: [
    ],
    trafficLights: [
	
	{coords: [460,360], rotation: 0, intersection: 1, grouping: 2,
	greenVal:1500, yellowVal:2700, redVal:0},
	{coords: [340,240], rotation: 180, intersection: 1, grouping: 2,
	greenVal:1500, yellowVal:2700, redVal:0},
	{coords: [460,240], rotation: 270, intersection: 1, grouping: 1,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [340,360], rotation: 90, intersection: 1, grouping: 1,
	greenVal:0, yellowVal:1200, redVal:1500},
	/*
	{coords: [460,360], rotation: 0, intersection: 1, grouping: 2,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [340,240], rotation: 180, intersection: 1, grouping: 2,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [460,240], rotation: 270, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},
	{coords: [340,360], rotation: 90, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},
	*/
    ],
    carDefs: [
	
	{coordPath: [
	    [380,-70],
	    [380, 100],
	    [380, 320],
	    [800, 320],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 height: 24,
	 },

	{coordPath: [
	    [375,-100],
	    [375, 100],
	    [375, 320],
	    [500, 320, 'pause',30],
	    [800, 320],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.3,
	 height: 16,
	},	

	{coordPath: [
	    [380,-20],
	    [380, 100, 'pause',50],
	    [380, 320],
	    [800, 320],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.1,
	 fillColor: 0x9933FF,
	 height: 24,
	},
	
	{coordPath: [
	    [-5,320],
	    [384,320],
	    [405,-50],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	 fillColor: 0x4D4DFF,
	},
	
	{coordPath: [
	    [-35,326],
	    [801,326],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [-70,326],
	    [801,326],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},
	{coordPath: [
	    [410,605],
	    [410, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	 fillColor: 0x4D4DFF,
	},
	{coordPath: [
	    [410,645],
	    [410,322],
	    [805,322],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.5,
	},
	{coordPath: [
	    [805,280],
	    [-10,280],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.5,
	},
	{coordPath: [
	    [855,280],
	    [-10,280],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [885,280],
	    [380,280],
	    [380,650],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	},

	
	{coordPath: [
	    [442,70, 'pause',50],
	    [442,60, 'left door',3000],
	    [442,50, 'pause',50000],
	],
	 type: 'parked',
	 sceneIncrementRestart: 3,
	 speed: 0,
	 fillColor: 0xFFFFFF,
	},
	
	{coordPath: [
	    [360,50, 'pause',50],
	    [360,60, 'left door',200],
	    [360,70, 'pause',50000],
	],
	 type: 'parked',
	 sceneIncrementRestart: 3,
	 speed: 0,
	 fillColor: 0xFFFFFF,
	},

    ],
    parkedCars: [
	{
	    coords: [442,430],
	    rotation: 180,
	    color: 'random',
	},
	{
	    coords: [442,180],
	    rotation: 180,
	    color: 'random',
	},
	{
	    coords: [442,158],
	    rotation: 180,
	    color: 'random',
	},
	{
	    coords: [442,452],
	    rotation: 180,
	    color: 'random',
	},
	{
	    coords: [442,136],
	    rotation: 180,
	    color: 'random',
	},
	{
	    coords: [442,110],
	    rotation: 180,
	    color: 'random',
	},
	{
	    coords: [520,345],
	    rotation: 90,
	    color: 'random',
	},
	{
	    coords: [542,345],
	    rotation: 90,
	    color: 'random',
	},
	{
	    coords: [564,345],
	    rotation: 90,
	    color: 'random',
	},

    ],
};



var busyIntersectionsLevel = {
    description: 'practice going from the starting point to each exit on the level. watch out for that bus.',
    levelSize: [1200,800],
    roadWidth: 142,
    roadDefs: [
	// intersection 1
	{xStart:0,yStart:400, xFinish:250, yFinish:400, roadWidth:130, sidewalkWidth:17},
	{xStart:315,yStart:0, xFinish:315, yFinish:335, roadWidth:130, sidewalkWidth:17},
	{xStart:315,yStart:465, xFinish:315, yFinish:800, roadWidth:130, sidewalkWidth:17},
	{xStart:380,yStart:400, xFinish:700, yFinish:400, roadWidth:130, sidewalkWidth:17},
	// intersection 2
	{xStart:765,yStart:0, xFinish:765, yFinish:335, roadWidth:130, sidewalkWidth:17},
	{xStart:765,yStart:465, xFinish:765, yFinish:800, roadWidth:130, sidewalkWidth:17},
	{xStart:830,yStart:400, xFinish:1200, yFinish:400, roadWidth:130, sidewalkWidth:17},

    ],
    bikeCoords: [821, 782],
    //bikeCoords: [341,74],
    //bikeRotation: 180,
    intersectionDefs: 
    {
	1:
	[
	    [248,333],
	    [248,470],
	    [384,470],
	    [384,333],
	    [248,333],
	]
	,
	2:
	[
	    [698,333],
	    [698,470],
	    [834,470],
	    [834,333],
	    [698,333],
	]
    },
    stopSigns: [
	{coords: [841,477], rotation: 0, intersection: 2},
	{coords: [691,326], rotation: 180, intersection: 2},
	{coords: [841,326], rotation: 270, intersection: 2},
	{coords: [691,477], rotation: 90, intersection: 2},

    ],
    trafficLights: [
	{coords: [391,477], rotation: 0, intersection: 1, grouping: 2,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [241,326], rotation: 180, intersection: 1, grouping: 2,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [391,326], rotation: 270, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},
	{coords: [241,477], rotation: 90, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},

    ],
    carDefs: [
	
	{coordPath: [
	    [-5,427],	 
	    [1205, 427],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	},
	{coordPath: [
	    [-35,451],	 
	    [1205, 451],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 height: 20,
	 width: 10,
	},
	{coordPath: [
	    [-95,451],	 
	    [719, 450],
	    [719, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},

	{coordPath: [
	    [-10,451],	 
	    [285, 451], 
	    [285, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},

	{coordPath: [
	    [285,-5],	 
	    [285, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 3,
	},	
	{coordPath: [
	    [285,-35],	 
	    [285, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [300,-65],	 
	    [300, 420],
	    [780, 420],
	    [780, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [354,805],	 
	    [354, 450],
	    [736, 450],
	    [736, 805], 
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [1205,351],	 
	    [803, 351],
	    [803, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1,
	 height: 22,
	 width: 10,
	},	
	{coordPath: [
	    [1235,351],	 
	    [600,351, 'pause',50],	 
	    [-20, 351],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2.5,
	},	
	{coordPath: [
	    [751,-5],	 
	    [751,424],	 
	    [1205, 424],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [751,-65],	 
	    [751,805],	 
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1,
	 height: 24,
	 width: 10,
	},	
	{coordPath: [
	    [730,-95],	 
	    [730,384],	 
	    [310,384],	 
	    [310,805],	 
	],
	 type: 'normal', //#12
	 sceneIncrementRestart: 2, 
	 speed: 2,
	 height: 12,
	},	
	{coordPath: [
	    [728,-35],	 
	    [728,353],	 
	    [353, 350],
	    [357, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [778,875],	 
	    [778,372],	 
	    [351, 365],
	    [351, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1,
	 height: 28,
	 width: 12,
	},	
	{coordPath: [
	    [346,835],	 
	    [346,438],	 
	    [520,438],	 
	    [549, 444, 'pause', 200],
	    [600,444],	 
	    [1205,442],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1.2,
	 height: 28,
	 width: 12,
	 fillColor: 0xE6E600,
	},	
	{coordPath: [
	    [798,915],	 
	    [802,561],	 
	    [821, 540],
	    [821, 536, 'pause', 1000],
	    [821, 520],
	    [800, 390],
	    [800, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	

    ],
    parkedCars: [
	// right intersection right side
	{
	    coords: [821,714],
	    rotation: 180,
	},
	{
	    coords: [821,690],
	    rotation: 180,
	},
	{
	    coords: [821,666],
	    rotation: 180,
	},
	{
	    coords: [821,642],
	    rotation: 180,
	},
	{
	    coords: [821,618],
	    rotation: 180,
	},
	{
	    coords: [821,257],
	    rotation: 180,
	},
	{
	    coords: [821,233],
	    rotation: 180,
	},
	{
	    coords: [821,209],
	    rotation: 180,
	},
	{
	    coords: [821,185],
	    rotation: 180,
	},
	{
	    coords: [821,161],
	    rotation: 180,
	},
	// left side
	{
	    coords: [710,714],
	    rotation: 180,
	},
	{
	    coords: [710,690],
	    rotation: 180,
	},
	{
	    coords: [710,666],
	    rotation: 180,
	},
	{
	    coords: [710,642],
	    rotation: 180,
	},
	{
	    coords: [710,618],
	    rotation: 180,
	},
	{
	    coords: [710,594],
	    rotation: 180,
	},
	{
	    coords: [710,257],
	    rotation: 180,
	},
	{
	    coords: [710,233],
	    rotation: 180,
	},
	{
	    coords: [710,209],
	    rotation: 180,
	},
	{
	    coords: [710,185],
	    rotation: 180,
	},
	{
	    coords: [710,161],
	    rotation: 180,
	},

	// left intersection right side
	{
	    coords: [371,714],
	    rotation: 180,
	},
	{
	    coords: [371,690],
	    rotation: 180,
	},
	{
	    coords: [371,666],
	    rotation: 180,
	},
	{
	    coords: [371,642],
	    rotation: 180,
	},
	{
	    coords: [371,618],
	    rotation: 180,
	},
	{
	    coords: [371,594],
	    rotation: 180,
	},
	{
	    coords: [371,257],
	    rotation: 180,
	},
	{
	    coords: [371,233],
	    rotation: 180,
	},
	{
	    coords: [371,209],
	    rotation: 180,
	},
	{
	    coords: [371,185],
	    rotation: 180,
	},
	{
	    coords: [371,161],
	    rotation: 180,
	},
	// left side
	{
	    coords: [260,714],
	    rotation: 180,
	},
	{
	    coords: [260,690],
	    rotation: 180,
	},
	{
	    coords: [260,666],
	    rotation: 180,
	},
	{
	    coords: [260,642],
	    rotation: 180,
	},
	{
	    coords: [260,618],
	    rotation: 180,
	},
	{
	    coords: [260,594],
	    rotation: 180,
	},
	{
	    coords: [260,257],
	    rotation: 180,
	},
	{
	    coords: [260,233],
	    rotation: 180,
	},
	{
	    coords: [260,209],
	    rotation: 180,
	},
	{
	    coords: [260,185],
	    rotation: 180,
	},
	{
	    coords: [260,161],
	    rotation: 180,
	},
    ],
};

var trafficJamLevel = {
    description: 'really too many cars here for safe biking.',
    levelSize: [1200,800],
    roadWidth: 142,
    roadDefs: [
	// intersection 1
	{xStart:0,yStart:400, xFinish:250, yFinish:400, roadWidth:130, sidewalkWidth:17},
	{xStart:315,yStart:0, xFinish:315, yFinish:335, roadWidth:130, sidewalkWidth:17},
	{xStart:315,yStart:465, xFinish:315, yFinish:800, roadWidth:130, sidewalkWidth:17},
	{xStart:380,yStart:400, xFinish:700, yFinish:400, roadWidth:130, sidewalkWidth:17},
	// intersection 2
	{xStart:765,yStart:0, xFinish:765, yFinish:335, roadWidth:130, sidewalkWidth:17},
	{xStart:765,yStart:465, xFinish:765, yFinish:800, roadWidth:130, sidewalkWidth:17},
	{xStart:830,yStart:400, xFinish:1200, yFinish:400, roadWidth:130, sidewalkWidth:17},

    ],
    bikeCoords: [821, 782],
    intersectionDefs: 
    {
	1:
	[
	    [248,333],
	    [248,470],
	    [384,470],
	    [384,333],
	    [248,333],
	]
	,
	2:
	[
	    [698,333],
	    [698,470],
	    [834,470],
	    [834,333],
	    [698,333],
	]
    },
    stopSigns: [
	{coords: [841,477], rotation: 0, intersection: 2},
	{coords: [691,326], rotation: 180, intersection: 2},
	{coords: [841,326], rotation: 270, intersection: 2},
	{coords: [691,477], rotation: 90, intersection: 2},

    ],
    trafficLights: [
	{coords: [391,477], rotation: 0, intersection: 1, grouping: 2,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [241,326], rotation: 180, intersection: 1, grouping: 2,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [391,326], rotation: 270, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},
	{coords: [241,477], rotation: 90, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},

    ],
    carDefs: [
	{coordPath: [
	    [-5,427],	 
	    [1205, 427],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	},
	{coordPath: [
	    [-35,451],	 
	    [1205, 451],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 height: 20,
	 width: 10,
	},
	{coordPath: [
	    [-95,451],	 
	    [719, 450],
	    [719, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},

	{coordPath: [
	    [-10,451],	 
	    [285, 451], 
	    [285, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},

	{coordPath: [
	    [285,-5],	 
	    [285, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 3,
	},	
	{coordPath: [
	    [285,-35],	 
	    [285, 805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [300,-65],	 
	    [300, 420],
	    [780, 420],
	    [780, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [354,805],	 
	    [354, 450],
	    [736, 450],
	    [736, 805], 
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [1205,351],	 
	    [803, 351],
	    [803, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1,
	 height: 22,
	 width: 10,
	},	
	{coordPath: [
	    [1235,351],	 
	    [600,351, 'pause',50],	 
	    [-20, 351],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2.5,
	},	
	{coordPath: [
	    [751,-5],	 
	    [751,424],	 
	    [1205, 424],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [751,-65],	 
	    [751,805],	 
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1,
	 height: 24,
	 width: 10,
	},	
	{coordPath: [
	    [730,-95],	 
	    [730,384],	 
	    [310,384],	 
	    [310,805],	 
	],
	 type: 'normal', //#12
	 sceneIncrementRestart: 2, 
	 speed: 2,
	 height: 12,
	},	
	{coordPath: [
	    [728,-35],	 
	    [728,353],	 
	    [353, 350],
	    [357, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	{coordPath: [
	    [778,875],	 
	    [778,372],	 
	    [351, 365],
	    [351, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1,
	 height: 28,
	 width: 12,
	},	
	{coordPath: [
	    [346,835],	 
	    [346,438],	 
	    [520,438],	 
	    [549, 444, 'pause', 200],
	    [600,444],	 
	    [1205,442],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 1.2,
	 height: 28,
	 width: 12,
	 fillColor: 0xE6E600,
	},	
	{coordPath: [
	    [798,915],	 
	    [802,561],	 
	    [818, 540],
	    [818, 536, 'pause', 1000],
	    [818, 520],
	    [800, 390],
	    [800, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2, 
	 speed: 2,
	},	
	// new horizontal speedy traffic action
	{coordPath: [
	    [-135,451],	 
	    [1205, 451],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},
	{coordPath: [
	    [-165,448],	 
	    [1205, 451],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.3,
	},
	{coordPath: [
	    [-195,451],	 
	    [1205, 448],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.7,
	},
	{coordPath: [
	    [-195,438],	 
	    [1205, 438],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.6,
	},
	{coordPath: [
	    [-135,438],	 
	    [1205, 438],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.7,
	},
	{coordPath: [
	    [-135,438],	 
	    [1205, 438],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.1,
	 height: 18,
	 width: 9,
	},
	{coordPath: [
	    [1300,382],	 
	    [-5, 382],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [1330,382],	 
	    [-5, 382],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	},
	{coordPath: [
	    [1360,382],	 
	    [-5, 382],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},
	{coordPath: [
	    [1360,354],	 
	    [-5, 350],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [1330,352],	 
	    [-5, 354],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},
	{coordPath: [
	    [1410,352],	 
	    [-5, 352],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.5,
	},


    ],
    parkedCars: [
	// right intersection right side
	{
	    coords: [821,714],
	    rotation: 180,
	},
	{
	    coords: [821,690],
	    rotation: 180,
	},
	{
	    coords: [821,642],
	    rotation: 180,
	},
	{
	    coords: [821,618],
	    rotation: 180,
	},
	{
	    coords: [821,257],
	    rotation: 180,
	},
	{
	    coords: [821,233],
	    rotation: 180,
	},
	{
	    coords: [821,209],
	    rotation: 180,
	},
	{
	    coords: [821,185],
	    rotation: 180,
	},
	{
	    coords: [821,161],
	    rotation: 180,
	},
	// left side
	{
	    coords: [710,690],
	    rotation: 180,
	},
	{
	    coords: [710,666],
	    rotation: 180,
	},
	{
	    coords: [710,642],
	    rotation: 180,
	},
	{
	    coords: [710,618],
	    rotation: 180,
	},
	{
	    coords: [710,594],
	    rotation: 180,
	},
	{
	    coords: [710,257],
	    rotation: 180,
	},
	{
	    coords: [710,233],
	    rotation: 180,
	},
	{
	    coords: [710,185],
	    rotation: 180,
	},
	{
	    coords: [710,161],
	    rotation: 180,
	},

	// left intersection right side
	{
	    coords: [371,714],
	    rotation: 180,
	},
	{
	    coords: [371,642],
	    rotation: 180,
	},
	{
	    coords: [371,618],
	    rotation: 180,
	},
	{
	    coords: [371,594],
	    rotation: 180,
	},
	{
	    coords: [371,257],
	    rotation: 180,
	},
	{
	    coords: [371,233],
	    rotation: 180,
	},
	{
	    coords: [371,185],
	    rotation: 180,
	},
	{
	    coords: [371,161],
	    rotation: 180,
	},
	// left side
	{
	    coords: [260,642],
	    rotation: 180,
	},
	{
	    coords: [260,618],
	    rotation: 180,
	},
	{
	    coords: [260,594],
	    rotation: 180,
	},
	{
	    coords: [260,257],
	    rotation: 180,
	},
	{
	    coords: [260,233],
	    rotation: 180,
	},
	{
	    coords: [260,209],
	    rotation: 180,
	},

    ],
};

var straightRoadLevel = {
    description: "just practice staying on the right, watch out for doors. you will get honked at - don't let it get to you.",
    levelSize: [1200,800],
    roadDefs: [
	{xStart:0,yStart:400, xFinish:1200, yFinish:400, roadWidth:140, sidewalkWidth:17},
    ],
    bikeCoords: [25, 460],
    bikeRotation: 270,
    intersectionDefs: {},
    stopSigns: [
    ],
    carDefs: [	
	
	{coordPath: [
	    [-35,442],	 
	    [1205, 442],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 height: 30,
	 width: 10,
	},
	{coordPath: [
	    [-5,415],	 
	    [1205, 415],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},
	{coordPath: [
	    [-55,415],	 
	    [1205, 415],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.6,
	},
	{coordPath: [
	    [-105,415],	 
	    [1205, 415],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [-5,440],	 
	    [1205, 440],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [-85,442],	
	    [300, 440], 
	    [360, 416], 
	    [660, 416], 
	    [1205, 420],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.8,
	 height: 20,
	},
	{coordPath: [
	    [-205,440],
	    [500,440],
	    [650,460],
	    [661,460,'left door',16],
	    [760,455],
	    [810,440],
	    [1205, 440],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	 width: 6,
	},
	{coordPath: [
	    [920,460],
	    [1000,460,'pause',799,],
	    [1102,459,'left door',799],
	    [1200,458],
	    [1205,440],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	 width: 6,
	},

	// right to left
	{coordPath: [
	    [1205,387],	 
	    [-5, 387],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	},
	{coordPath: [
	    [1265,387],	 
	    [-5, 387],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.3,
	},
	{coordPath: [
	    [1385,387],	 
	    [-5, 387],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.5,
	 height: 30,
	 width: 12,
	},
	{coordPath: [
	    [1205,359],	 
	    [-5, 359],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.9,
	},
	{coordPath: [
	    [1235,359],	 
	    [-5, 359],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.9,
	},
	{coordPath: [
	    [1285,361],	 
	    [-5, 361],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.3,
	 width: 9,
	 height: 20,
	},
	{coordPath: [
	    [1400, 359],
	    [1100, 359],
	    [852,339,'pause',1000],	 
	    [830, 339],
	    [800, 359],
	    [508, 359],
	    [408, 339],
	    [400, 339, 'pause',2000],
	    [380, 339],
	    [200, 359],
	    [-5, 359],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.3,
	},
	// reparker

	
    ],
    parkedCars: [
	{
	    coords: [405,462],
	    rotation: 90,
	},
	{
	    coords: [430,462],
	    rotation: 90,
	},
	{
	    coords: [455,462],
	    rotation: 90,
	},
	{
	    coords: [480,462],
	    rotation: 90,
	},
	{
	    coords: [505,462],
	    rotation: 90,
	},
	{
	    coords: [805,462],
	    rotation: 90,
	},
	{
	    coords: [830,462],
	    rotation: 90,
	},
	{
	    coords: [855,462],
	    rotation: 90,
	},
	{
	    coords: [880,462],
	    rotation: 90,
	},
	// top side
	{
	    coords: [700,339],
	    rotation: 90,
	},
	{
	    coords: [675,339],
	    rotation: 90,
	},
	{
	    coords: [650,339],
	    rotation: 90,
	},
	{
	    coords: [625,339],
	    rotation: 90,
	},
	{
	    coords: [600,339],
	    rotation: 90,
	},

    ],
};


allLevels = {'busyIntersections':busyIntersectionsLevel,  'rushHour':rushHourLevel, 'trafficJam':trafficJamLevel, 'sixCorners':sixCornersLevel, 'straightRoad':straightRoadLevel}
