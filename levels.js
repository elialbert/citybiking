var defaultLevel = {
    roadDefs: [
	{xStart:400,yStart:0, xFinish:400, yFinish:250, roadWidth:100, sidewalkWidth:17},
	{xStart:400,yStart:350, xFinish:400, yFinish:600, roadWidth:100, sidewalkWidth:17},
	{xStart:0,yStart:300, xFinish:350, yFinish:300, roadWidth:100, sidewalkWidth:17},
	{xStart:450,yStart:300, xFinish:800, yFinish:300, roadWidth:100, sidewalkWidth:17},
    ],
    bikeCoords: [438, 550],
    intersectionDefs: {1: // intersection coords should form a counterclockwise polygon
		       [
			   [350,250],
			   [350,350],
			   [450,350],
			   [450,250],
			   [350,250],
		       ]
		      },
    stopSigns: [
	{coords: [460,360], rotation: 0, intersection: 1},
	{coords: [460,240], rotation: 270, intersection: 1},
	{coords: [340,240], rotation: 180, intersection: 1},
	{coords: [340,360], rotation: 90, intersection: 1},
    ],
    carDefs: [
	
	{coordPath: [
	    [380,-50],	 
	    [380, 330],
	    [680, 330],
	    [805, 330]
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 fillColor: 0x9933FF,
	 height: 24,
	},
	
	{coordPath: [
	    [-5,330],
	    [412,330],
	    [412,-50]
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	 fillColor: 0x4D4DFF,
	},
	
	
	{coordPath: [
	    [420,605],
	    [420, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	 fillColor: 0x4D4DFF,
	},	
	
    ],
};

var nostopsignsLevel = {
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
    carDefs: [
	
	{coordPath: [
	    [380,-50],	 
	    [380, 330],
	    [680, 330],
	    [805, 330]
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 fillColor: 0x9933FF,
	 height: 24,
	},
	
	{coordPath: [
	    [-5,330],
	    [410,330],
	    [410,-50]
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	 fillColor: 0x4D4DFF,
	},
	
	
	{coordPath: [
	    [420,605],
	    [420, -5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	 fillColor: 0x4D4DFF,
	},	
	
    ],
};

var trafficLightsLevel = {
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
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [340,240], rotation: 180, intersection: 1, grouping: 2,
	greenVal:0, yellowVal:1200, redVal:1500},
	{coords: [460,240], rotation: 270, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},
	{coords: [340,360], rotation: 90, intersection: 1, grouping: 1,
	greenVal:1500, yellowVal:2700, redVal:0},
    ],
    carDefs: [
	
	{coordPath: [
	    [380,-50],
	    [380, 100, 'pause',50],
	    [380, 330],
	    [800, 320],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 fillColor: 0x9933FF,
	 height: 24,
	},
	
	{coordPath: [
	    [-5,330],
	    [410,330],
	    [410,-50]
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	 fillColor: 0x4D4DFF,
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
	    [442,70, 'pause',50],
	    [442,60, 'left door',10000],
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

    ],
};

var diagonalLevel = {
    roadDefs: [
	{xStart:0,yStart:0, xFinish:266, yFinish:266, roadWidth:100, sidewalkWidth:17},
	{xStart:0,yStart:600, xFinish:266, yFinish:334, roadWidth:100, sidewalkWidth:17},
	{xStart:334,yStart:266, xFinish:700, yFinish:-100, roadWidth:100, sidewalkWidth:17},
	{xStart:334,yStart:334, xFinish:700, yFinish:700, roadWidth:100, sidewalkWidth:17},
    ],
    bikeCoords: [10, 570],
    bikeRotation: 290,
    intersectionDefs: {1:
		       [
			   [300,220],
			   [220,300],
			   [300,380],
			   [380,300],
			   [300,220]
		       ]
		      },
    stopSigns: [
    ],
    carDefs: [
	
	{coordPath: [
	    [-30,-5],	 
	    [297, 308],
	    [705, -55],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	 fillColor: 0x9933FF,
	 height: 24,
	},
	
	{coordPath: [
	    [730,710],
	    [-5,-35],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	 fillColor: 0x4D4DFF,
	},
    ],
    trafficLights: [
	{coords: [386,301], rotation: 315, intersection: 1, grouping: 2,
	greenVal:600, yellowVal:2800, redVal:0},
	{coords: [300,218], rotation: 225, intersection: 1, grouping: 1,
	greenVal:0, yellowVal:500, redVal:600},
	{coords: [214,300], rotation: 135, intersection: 1, grouping: 2,
	greenVal:600, yellowVal:2800, redVal:0},
	{coords: [300,388], rotation: 45, intersection: 1, grouping: 1,
	greenVal:0, yellowVal:500, redVal:600},
	
    ],

};


allLevels = {'stopsigns':defaultLevel, 'crossroads':nostopsignsLevel, 'trafficlights':trafficLightsLevel, 'diagonal':diagonalLevel}
