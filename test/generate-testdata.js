var PolyBool = require('./polybool-org');

function convert(poly) {
	for (var region of poly.regions) {
		for (var i=0; i<region.length; i++) {
			region[i] = {
				x: region[i][0],
				y: region[i][1]
			};
		}
	}
}

var polyCases = [{
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

function recalc(func, polys) {
	var BL = PolyBool.buildLog(true);
	var clipResult = {
		result: func(polys[0], polys[1]),
		build_log: BL
	};

	// output GeoJSON

	var geojson = PolyBool.polygonToGeoJSON(clipResult.result);
	function scalePoly(p) {
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
	function outLine(line, tail) {
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

function init() {
	var funcs = {
		intersect: PolyBool.intersect.bind(PolyBool),
		union: PolyBool.union.bind(PolyBool),
		difference: PolyBool.difference.bind(PolyBool),
		differenceRev: PolyBool.differenceRev.bind(PolyBool),
		xor: PolyBool.xor.bind(PolyBool)
	};
	var testdata = [];
	for (var demoIndex = 0; demoIndex < polyCases.length; demoIndex++) {
		var demo = polyCases[demoIndex];
		let polys = [demo.poly1, demo.poly2];
		let caseResult = {
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
		convert(caseResult.poly1);
		convert(caseResult.poly2);
		testdata.push(caseResult);
	}
	console.log(JSON.stringify(testdata));
}

setTimeout(init, 1);
