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
    carDefs: [
	{startingCoords: [382,-50],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: 2,
	 fillColor: 0x9933FF,
	},
	{startingCoords: [420,605],
	 type: 'normal',
	 sceneIncrementRestart: 2,
	 speed: -4,
	 fillColor: 0x4D4DFF,
	},
    ],
};
