"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PolyBool_1 = require("./PolyBool");
const fs = require("fs");
function nextDemo(poly1, poly2) {
    var polyBox = { min: [false, false], max: [false, false] };
    function calcBox(regions) {
        for (var r = 0; r < regions.length; r++) {
            var region = regions[r];
            for (var p = 0; p < region.length; p++) {
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
function recalc(func, polys) {
    var BL = PolyBool_1.PolyBool.buildLog(true);
    var clipResult = {
        result: func(polys[0], polys[1]),
        build_log: BL
    };
    // output GeoJSON
    var geojson = PolyBool_1.PolyBool.polygonToGeoJSON(clipResult.result);
    function scalePoly(p) {
        // we need to scale the result because pixel coordinates are around 500, and that's not
        // valid long/lat coordinates... so we just divide everything by 10
        // (and out of pure luck this tends to place our polygons over Ethiopia...!)
        for (var i = 0; i < p.length; i++) {
            for (var j = 0; j < p[i].length; j++)
                p[i][j] = [p[i][j][0] * 0.1, p[i][j][1] * 0.1];
        }
    }
    // I suppose we could just JSON.stringify(geojson, null, '  '), but that doesn't look so
    // pretty (imho), so this is a bit stupid but I format it myself so it looks better :-P
    var out = ['{', '"type":' + JSON.stringify(geojson.type) + ','];
    function outLine(line, tail) {
        var o = '[';
        for (var i = 0; i < line.length; i++) {
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
    else {
        for (var i = 0; i < geojson.coordinates.length; i++)
            scalePoly(geojson.coordinates[i]);
        out.push('"coordinates":[[');
        for (var i = 0; i < geojson.coordinates.length; i++) {
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
var expectedCases = JSON.parse(fs.readFileSync(__dirname + '/../test/testdata.json', 'utf-8'));
function init() {
    var funcs = {
        intersect: PolyBool_1.PolyBool.intersect.bind(PolyBool_1.PolyBool),
        union: PolyBool_1.PolyBool.union.bind(PolyBool_1.PolyBool),
        difference: PolyBool_1.PolyBool.difference.bind(PolyBool_1.PolyBool),
        differenceRev: PolyBool_1.PolyBool.differenceRev.bind(PolyBool_1.PolyBool),
        xor: PolyBool_1.PolyBool.xor.bind(PolyBool_1.PolyBool)
    };
    let oks = 0;
    let ngs = 0;
    for (var expectedCase of expectedCases) {
        let polys = nextDemo(expectedCase.poly1, expectedCase.poly2);
        for (var expectedTest of expectedCase.tests) {
            polys[0].inverted = expectedTest.poly1Inverted;
            polys[1].inverted = expectedTest.poly2Inverted;
            var actual = recalc(funcs[expectedTest.operation], polys);
            var expected = expectedTest.result;
            if (JSON.stringify(actual) == JSON.stringify(expected)) {
                oks++;
            }
            else {
                ngs++;
                console.log(`NG: ${expectedTest.operation}`);
            }
        }
    }
    console.log(`===========================`);
    console.log(`OK: ${oks}`);
    console.log(`NG: ${ngs}`);
}
setTimeout(init, 1);
//# sourceMappingURL=Test.js.map