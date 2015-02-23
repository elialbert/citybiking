var defaultLevel = {
    roadDefs: [
	{xStart:400,yStart:0, xFinish:400, yFinish:250, roadWidth:100, sidewalkWidth:17},
	{xStart:400,yStart:350, xFinish:400, yFinish:600, roadWidth:100, sidewalkWidth:17},
	{xStart:0,yStart:300, xFinish:350, yFinish:300, roadWidth:100, sidewalkWidth:17},
	{xStart:450,yStart:300, xFinish:800, yFinish:300, roadWidth:100, sidewalkWidth:17},
    ],
    bikeCoords: [438, 550],
    intersectionList: [
	[
	    [350,250],
	    [450,250],
	    [450,350],
	    [250,350],
	    [350,250]
	]
    ],
    stopSigns: [
	{coords: [460,360], rotation: 0},
	{coords: [460,240], rotation: 270},
	{coords: [340,240], rotation: 180},
	{coords: [340,360], rotation: 90},
    ],
    carDefs: [
	{startingCoords: [382,-50],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: [0,2],
	 fillColor: 0x9933FF,
	 height: 24,
	},
	{startingCoords: [420,605],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: [0,-4],
	 fillColor: 0x4D4DFF,
	},
    ],
};
