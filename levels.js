var defaultLevel = {
    levelSize: [],
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
	    [380, 320],
	    [680, 320],
	    [805, 320]
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
    carDefs: [
	
	{coordPath: [
	    [380,-50],	 
	    [380, 320],
	    [680, 320],
	    [805, 320]
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 fillColor: 0x9933FF,
	 height: 24,
	},
	
	{coordPath: [
	    [-5,330],
	    [420,330],
	    [420,-50]
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
    levelSize: [],
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

var sixCornersLevel = {
    description: "a classic chicago intersection. try different turns. try to get across through a red without waiting for green by crossing left with traffic, then left again.",
    levelSize: [1200,800],
    roadWidth: 142,
    roadDefs: [
	{xStart:-200,yStart:600, xFinish:480, yFinish:450, roadWidth:130, sidewalkWidth:17},
	{xStart:685,yStart:-50, xFinish:615, yFinish:280, roadWidth:130, sidewalkWidth:17},
	{xStart:560,yStart:525, xFinish:530, yFinish:850, roadWidth:130, sidewalkWidth:17},
	{xStart:700,yStart:370, xFinish:1250, yFinish:250, roadWidth:130, sidewalkWidth:17},
	{xStart:-100,yStart:-100, xFinish:500, yFinish:317, roadWidth:130, sidewalkWidth:17},
	{xStart:675,yStart:490, xFinish:1200, yFinish:900, roadWidth:110, sidewalkWidth:17},

    ],
    bikeCoords: [607, 674],
    bikeRotation: 355,
    intersectionDefs: {	
	1:
	[
	    [536,264],
	    [461,372],
	    [494,520],
	    [643,538],
	    [717,443],
	    [786,298],
	    [536,264],
	]
    },
    stopSigns: [
    ],
    carDefs: [
	{coordPath: [
	    [554,865],	 
	    [618,415],
	    [713,-5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},
	{coordPath: [
	    [570,895],	 
	    [618,415],
	    [713,-5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [551,830],	 
	    [584,461],
	    [497,419],
	    [-5,540],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 3,
	},
	{coordPath: [
	    [554,805],	 
	    [618,432],
	    [1205,315],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [-5,580],	 
	    [604,445],
	    [695,-5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [-25,590],	 
	    [511,452],
	    [530,313],
	    [70,-5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.5,
	 height: 30,
	 width: 10,
	},
	{coordPath: [
	    [628,-5],	 
	    [567,288],
	    [128,-15],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.9,
	},
	{coordPath: [
	    [628,-35],	 
	    [572,434],
	    [1035,805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.6,
	},
	{coordPath: [
	    [-5,600],	 
	    [519,495],
	    [480,805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.5,
	 height: 20,
	 width: 10,
	},
	{coordPath: [
	    [-35,610],	 
	    [580,473],
	    [1040,815],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [1205,210],	 
	    [685,328],
	    [507,402],
	    [-5,515],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 height: 24,
	 width: 12,
	},
	{coordPath: [
	    [1235,244],	 
	    [559,379],
	    [520,805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.6,
	},
	{coordPath: [
	    [1265,240],	 
	    [659,331],
	    [720,-5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	},
	{coordPath: [
	    [1140,805],	 
	    [682,450],
	    [542,299],
	    [125,-5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.7,
	},
	{coordPath: [
	    [1160,835],	 
	    [686,448],
	    [694,418],
	    [1210,315],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1.8,
	},
	{coordPath: [
	    [1105,805],	 
	    [633,442],
	    [553,451],
	    [521,805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 height: 18,
	 width: 8,
	},
	{coordPath: [
	    [-5,20],	 
	    [496,372],
	    [490,405],
	    [-5,515],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	 height: 10,
	 width: 6,
	},
	{coordPath: [
	    [15,-5],	 
	    [591,402],
	    [644,248],
	    [688,-5],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.9,
	},
	{coordPath: [
	    [0,-35],	 
	    [541,374],
	    [649,500],
	    [1050,805],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2.5,
	},
	{coordPath: [
	    [665,-95],	 
	    [538,396],
	    [-5,520],
	],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 1,
	 height: 24,
	 width: 12,
	},

    ],
    trafficLights: [
	{coords: [635,546], rotation: 5, intersection: 1, grouping: 1,
	greenVal:0, yellowVal:800, redVal:1000},
	{coords: [725,443], rotation: 308, intersection: 1, grouping: 2,
	greenVal:1000, yellowVal:1800, redVal:2000},
	{coords: [694,294], rotation: 260, intersection: 1, grouping: 3,
	greenVal:2000, yellowVal:2800, redVal:3000},
 	{coords: [545,257], rotation: 190, intersection: 1, grouping: 1,
	greenVal:0, yellowVal:800, redVal:1000},
 	{coords: [454,380], rotation: 128, intersection: 1, grouping: 2,
	greenVal:1000, yellowVal:1800, redVal:2000},
 	{coords: [485,528], rotation: 77, intersection: 1, grouping: 3,
	greenVal:2000, yellowVal:2800, redVal:3000},

    ],

};



