package ;

import polyboolhx.IPoint;
import polyboolhx.PolyBool;
import polyboolhx.Region;
import polyboolhx.IGeoJSON;
import polyboolhx.IRegionCollection;
import lua.Lua;
import sys.io.File;
import haxe.Json;

typedef IPolyCase = {
	name: String,
	poly1: IRegionCollection,
	poly2: IRegionCollection
};

typedef IPolyBox = {
	min: Array<Float>,
	max: Array<Float>
};

typedef OperatorFunc = IRegionCollection -> IRegionCollection -> IRegionCollection;

typedef ITestCaseResult = {
	poly1: IRegionCollection,
	poly2: IRegionCollection,
	tests: Array<{
		operation: String,
		poly1Inverted: Bool,
		poly2Inverted: Bool,
		result: IGeoJSON
	}>
}

class Main {

	static function recalc(func: OperatorFunc, polys: Array<IRegionCollection>): IGeoJSON {
		var BL = PolyBool.instance.buildLog(true);
		var clipResult = {
			result: func(polys[0], polys[1]),
			build_log: BL
		};

		// output GeoJSON

		var geojson: IGeoJSON = PolyBool.instance.polygonToGeoJSON(clipResult.result);
		function scalePoly(p: Array<Region>) {
			// we need to scale the result because pixel coordinates are around 500, and that's not
			// valid long/lat coordinates... so we just divide everything by 10
			// (and out of pure luck this tends to place our polygons over Ethiopia...!)
			for (i in 0...p.length) {
				for (j in 0...p[i].length)
					p[i][j] = {x:p[i][j].x * 0.1, y:p[i][j].y * 0.1};
			}
		}
		// I suppose we could just Json.stringify(geojson, null, '  '), but that doesn't look so
		// pretty (imho), so this is a bit stupid but I format it myself so it looks better :-P
		var out = ['{', '"type":' + Json.stringify(geojson.type) + ','];
		function outLine(line: Region, tail: Bool) {
			var o = '[';
			for (i in 0...line.length) {
				var p: IPoint = line[i];
				o += '[' + p.x + ',' + p.y + ']';
				if (i < line.length - 1)
					o += ',';
			}
			out.push(o + ']' + (tail ? '' : ','));
		}
		if (geojson.type == 'Polygon') {
			var coordinates: Array<Region> = cast geojson.coordinates;
			scalePoly(coordinates);
			out.push('"coordinates":[');
			for (i in 0...coordinates.length) {
				outLine(coordinates[i], i == coordinates.length - 1);
			}
			out.push(']');
		}
		else{
			var coordinates: Array<Array<Region>> = cast geojson.coordinates;
			for (i in 0...coordinates.length) {
				scalePoly(coordinates[i]);
			}
			out.push('"coordinates":[[');
			for (i in 0...coordinates.length) {
				for (j in 0...coordinates[i].length) {
					outLine(coordinates[i][j], j == coordinates[i].length - 1);
				}
				if (i < coordinates.length - 1) {
					out.push('],[');
				}
			}
			out.push(']]');
		}
		out.push('}');
		return Json.parse(out.join(''));
	}

	public static function main() {
		var dir = Lua.arg[0];
		untyped __lua__("dir = string.gsub(dir, '/[^/]+$', '')");
		var expectedCases: Array<ITestCaseResult> = Json.parse(File.getContent(dir+"/testdata.json"));

		var funcs: Map<String, OperatorFunc> = [
			"intersect" => PolyBool.instance.intersect,
			"union" => PolyBool.instance.union,
			"difference" => PolyBool.instance.difference,
			"differenceRev" => PolyBool.instance.differenceRev,
			"xor" => PolyBool.instance.xor
		];
		var oks = 0;
		var ngs = 0;
		for (expectedCase in expectedCases) {
			for (expectedTest in expectedCase.tests) {
				var polys = [expectedCase.poly1, expectedCase.poly2];
				polys[0].inverted = expectedTest.poly1Inverted;
				polys[1].inverted = expectedTest.poly2Inverted;
				var actual = recalc(funcs[expectedTest.operation], polys);
				var expected = expectedTest.result;
				var actualJson = Json.stringify(actual);
				var expectedJson = Json.stringify(expected);
				if (actualJson == expectedJson) {
					oks++;
				} else {
					ngs++;
					trace('NG: ${expectedTest.operation}');
					trace('actual  : ${actualJson}');
					trace('expected: ${expectedJson}');
				}
			}
		}
		trace('===========================');
		trace('OK: ${oks}');
		trace('NG: ${ngs}');
	}

}
