var rushHourLevel = {
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
	    [415,320],
	    [420,-50]
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
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

allLevels = {'stopsigns':defaultLevel, 'crossroads':nostopsignsLevel, 'trafficlights':trafficLightsLevel, 'diagonal':diagonalLevel, 'rushhour':rushHourLevel}
