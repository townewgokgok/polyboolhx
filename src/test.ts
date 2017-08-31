interface IPolyCase {
	name: string;
	poly1: IRegionCollection;
	poly2: IRegionCollection;
}

var polyCases: IPolyCase[] = [{
	name: 'Assorted Polygons',
	poly1: {
		regions: [
			[ [500,60],[500,150],[320,150],[260,210],[200,150],[200,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [500,60],[500,150],[460,190],[460,110],[400,180],[160,90] ],
			[ [220,170],[260,30],[310,160],[310,210],[260,170],[240,190] ]
		],
		inverted: false
	}
}, {
	name: 'Simple Rectangles',
	poly1: {
		regions: [
			[ [200, 50], [600, 50], [600, 150], [200, 150] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [300, 150], [500, 150], [500, 200], [300, 200] ]
		],
		inverted: false
	}
}, {
	name: 'Shared Right Edge',
	poly1: {
		regions: [
			[ [500,60],[500,150],[200,150],[200,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [500,60],[500,150],[450,230],[400,180],[590,60] ]
		],
		inverted: false
	}
}, {
	name: 'Simple Boxes',
	poly1: {
		regions: [
			[ [500,60],[500,150],[200,150],[200,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [500,60],[500,150],[380,150],[380,60] ]
		],
		inverted: false
	}
}, {
	name: 'Simple Self-Overlap',
	poly1: {
		regions: [
			[ [200,50],[400,50],[400,150],[200,150] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [400,150],[500,150],[300,50],[400,50] ]
		],
		inverted: false
	}
}, {
	name: 'M Shape',
	poly1: {
		regions: [
			[ [570,60],[570,150],[60,150],[60,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [500,60],[500,130],[330,20],[180,130],[120,60] ]
		],
		inverted: false
	}
}, {
	name: 'Two Triangles With Common Edge',
	poly1: {
		regions: [
			[ [620,60],[620,150],[90,150],[90,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [350,60],[480,200],[180,60] ],
			[ [180,60],[500,60],[180,220] ]
		],
		inverted: false
	}
}, {
	name: 'Two Trianges With Common Edge, pt. 2',
	poly1: {
		regions: [
			[ [620,60],[620,150],[90,150],[90,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [400,60],[270,120],[210,60] ],
			[ [210,60],[530,60],[210,220] ]
		],
		inverted: false
	}
}, {
	name: 'Two Triangles With Common Edge, pt. 3',
	poly1: {
		regions: [
			[ [620,60],[620,150],[90,150],[90,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [370,60],[300,220],[560,60] ],
			[ [180,60],[500,60],[180,220] ]
		],
		inverted: false
	}
}, {
	name: 'Three Triangles',
	poly1: {
		regions: [
			[ [500,60],[500,150],[320,150] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [500,60],[500,150],[460,190] ],
			[ [220,170],[260,30],[310,160] ],
			[ [260,210],[200,150],[200,60] ]
		],
		inverted: false
	}
}, {
	name: 'Adjacent Edges in Status',
	poly1: {
		regions: [
			[ [620,60],[620,150],[90,150],[90,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [110,60],[420,230],[540,60] ],
			[ [180,60],[430,160],[190,200] ]
		],
		inverted: false
	}
}, {
	name: 'Coincident Self-Intersection',
	poly1: {
		regions: [
			[ [500,60],[500,150],[320,150],[260,210],[200,150],[200,60] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [500,60],[500,150],[460,190],[460,110],[400,180],[70,90] ],
			[ [220,170],[580,130],[310,160],[310,210],[260,170],[240,190] ]
		],
		inverted: false
	}
}, {
	name: 'Coincident Self-Intersection, pt. 2',
	poly1: {
		regions: [
			[ [100, 100], [200, 200], [300, 100] ],
			[ [200, 100], [300, 200], [400, 100] ]
		],
		inverted: false
	},
	poly2: {
		regions: [
			[ [50, 50], [200, 50], [300, 150] ]
		],
		inverted: false
	}
}, {
	name: 'Triple Overlap',
	poly1: {
		regions: [
			[ [500, 60], [500, 150], [320, 150], [260, 210], [200, 150], [200, 60] ]
		],
		inverted: false
	},
	poly2: {
		regions:[
			[ [500, 60], [500, 150], [370, 60], [310, 60], [400, 180], [230, 60] ],
			[ [260, 60], [410, 60], [310, 160], [310, 210], [260, 170], [240, 190] ]
		],
		inverted: false
	}
}];

interface IPolyBox {
	min: (false|number)[];
	max: (false|number)[];
}

function nextDemo(demoIndex: number): IRegionCollection[] {
	var demo: IPolyCase = polyCases[demoIndex];
	var caseName: string = (demoIndex + 1) + '. ' + demo.name;
	var poly1: IRegionCollection = demo.poly1;
	var poly2: IRegionCollection = demo.poly2;
	var polyBox: IPolyBox = { min: [false, false], max: [false, false] };
	function calcBox(regions: Region[]) {
		for (var r = 0; r < regions.length; r++){
			var region = regions[r];
			for (var p = 0; p < region.length; p++){
				var pt = region[p];
				if (polyBox.min[0] === false || pt[0] < polyBox.min[0])
					polyBox.min[0] = pt[0];
				if (polyBox.min[1] === false || pt[1] < polyBox.min[1])
					polyBox.min[1] = pt[1];
				if (polyBox.max[0] === false || pt[0] > polyBox.max[0])
					polyBox.max[0] = pt[0];
				if (polyBox.max[1] === false || pt[1] > polyBox.max[1])
					polyBox.max[1] = pt[1];
			}
		}
	}
	calcBox(poly1.regions);
	calcBox(poly2.regions);
	return [poly1, poly2];
}

type OperatorFunc = (poly1: IRegionCollection, poly2: IRegionCollection) => IRegionCollection;

function recalc(func: OperatorFunc, polys: IRegionCollection[]): IGeoJSON {
	var BL = PolyBool.buildLog(true);
	var clipResult = {
		result: func(polys[0], polys[1]),
		build_log: BL
	};

	// output GeoJSON

	var geojson = PolyBool.polygonToGeoJSON(clipResult.result);
	function scalePoly(p: Region[]) {
		// we need to scale the result because pixel coordinates are around 500, and that's not
		// valid long/lat coordinates... so we just divide everything by 10
		// (and out of pure luck this tends to place our polygons over Ethiopia...!)
		for (var i = 0; i < p.length; i++){
			for (var j = 0; j < p[i].length; j++)
				p[i][j] = [p[i][j][0] * 0.1, p[i][j][1] * 0.1];
		}
	}
	// I suppose we could just JSON.stringify(geojson, null, '  '), but that doesn't look so
	// pretty (imho), so this is a bit stupid but I format it myself so it looks better :-P
	var out = ['{', '"type":' + JSON.stringify(geojson.type) + ','];
	function outLine(line: Region, tail: boolean) {
		var o = '[';
		for (var i = 0; i < line.length; i++){
			o += '[' + line[i] + ']';
			if (i < line.length - 1)
				o += ',';
		}
		out.push(o + ']' + (tail ? '' : ','));
	}
	if (geojson.type == 'Polygon') {
		scalePoly(geojson.coordinates);
		out.push('"coordinates":[');
		for (var i = 0; i < geojson.coordinates.length; i++)
			outLine(geojson.coordinates[i], i === geojson.coordinates.length - 1);
		out.push(']');
	}
	else{
		for (var i = 0; i < geojson.coordinates.length; i++)
			scalePoly(geojson.coordinates[i]);
		out.push('"coordinates":[[');
		for (var i = 0; i < geojson.coordinates.length; i++){
			for (var j = 0; j < geojson.coordinates[i].length; j++)
				outLine(geojson.coordinates[i][j], j === geojson.coordinates[i].length - 1);
			if (i < geojson.coordinates.length - 1)
				out.push('],[');
		}
		out.push(']]');
	}
	out.push('}', '');
	return JSON.parse(out.join(''));
}

interface ITestCaseResult {
	poly1: IRegionCollection;
	poly2: IRegionCollection;
	tests: {
		operation: string;
		poly1Inverted: boolean;
		poly2Inverted: boolean;
		result: IGeoJSON;
	}[];
}

function init() {
	var funcs: {[name: string]: OperatorFunc} = {
		intersect: PolyBool.intersect.bind(PolyBool),
		union: PolyBool.union.bind(PolyBool),
		difference: PolyBool.difference.bind(PolyBool),
		differenceRev: PolyBool.differenceRev.bind(PolyBool),
		xor: PolyBool.xor.bind(PolyBool)
	};
	var testdata: ITestCaseResult[] = [];
	for (var demo = 0; demo < polyCases.length; demo++) {
		let polys = nextDemo(demo);
		let caseResult: ITestCaseResult = {
			poly1: JSON.parse(JSON.stringify(polys[0])),
			poly2: JSON.parse(JSON.stringify(polys[1])),
			tests: []
		};
		for (var operation of Object.keys(funcs)) {
			for (var j=0; j<4; j++) {
				polys[0].inverted = j % 2 == 1;
				polys[1].inverted = 2 <= j;
				caseResult.tests.push({
					operation: operation,
					poly1Inverted: polys[0].inverted,
					poly2Inverted: polys[1].inverted,
					result: recalc(funcs[operation], polys)
				});
			}
		}
		testdata.push(caseResult);
	}
	console.log(JSON.stringify(testdata));
}

setTimeout(init, 1);
