/*
 * @copyright 2016 Sean Connelly (@voidqk), http://syntheti.cc
 * @license MIT
 * @preserve Project Home: https://github.com/voidqk/polybooljs
 */

class PolyBool {

	public static var instance(get, never): PolyBool;
	private static var _instance: PolyBool;
	static function get_instance(): PolyBool {
		if (_instance == null) {
			_instance = new PolyBool();
		}
		return _instance;
	}

	private var _buildLog: BuildLog;
	private var _epsilon: Epsilon = new Epsilon();

	public function new() {
	}

	// getter/setter for buildLog
	public function buildLog(bl: Bool): Array<ILog> {
		if (bl)
			this._buildLog = new BuildLog();
		else
			this._buildLog = null;
		return this._buildLog == null ? null : this._buildLog.list;
	}

	// getter/setter for epsilon
	public function epsilon(?v: Float): Float {
		return this._epsilon.epsilon(v);
	}

	// core API
	public function segments(poly: IRegionCollection): ISegmentCollection {
		var i = Intersecter.intersecter(true, this._epsilon, this._buildLog);
		for (region in poly.regions) {
			i.addRegion(region);
		}
		return {
			segments: i.calculateSI(poly.inverted),
			inverted: poly.inverted
		};
	}

	public function combine(segments1: ISegmentCollection, segments2: ISegmentCollection): ICombined {
		var i3 = Intersecter.intersecter(false, this._epsilon, this._buildLog);
		return {
			combined: i3.calculateNSI(
				segments1.segments, segments1.inverted,
				segments2.segments, segments2.inverted
			),
			inverted1: segments1.inverted,
			inverted2: segments2.inverted
		};
	}

	public function selectUnion(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.union(combined.combined, this._buildLog),
			inverted: combined.inverted1 || combined.inverted2
		}
	}

	public function selectIntersect(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.intersect(combined.combined, this._buildLog),
			inverted: combined.inverted1 && combined.inverted2
		}
	}

	public function selectDifference(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.difference(combined.combined, this._buildLog),
			inverted: combined.inverted1 && !combined.inverted2
		}
	}

	public function selectDifferenceRev(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.differenceRev(combined.combined, this._buildLog),
			inverted: !combined.inverted1 && combined.inverted2
		}
	}

	public function selectXor(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.xor(combined.combined, this._buildLog),
			inverted: combined.inverted1 != combined.inverted2
		}
	}

	public function polygon(segments: ISegmentCollection): IRegionCollection {
		return {
			regions: SegmentChainer.segmentChainer(segments.segments, this._epsilon, this._buildLog),
			inverted: segments.inverted
		};
	}

	// GeoJSON converters

	public function polygonFromGeoJSON(geojson: IGeoJSON): IRegionCollection {
		return GeoJSON.toPolygon(PolyBool.instance, geojson);
	}

	public function polygonToGeoJSON(poly: IRegionCollection): IGeoJSON {
		return GeoJSON.fromPolygon(PolyBool.instance, this._epsilon, poly);
	}

	// helper functions for common operations

	public function union(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectUnion);
	}

	public function intersect(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectIntersect);
	}

	public function difference(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectDifference);
	}

	public function differenceRev(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectDifferenceRev);
	}

	public function xor(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectXor);
	}

	private function operate(poly1: IRegionCollection, poly2: IRegionCollection, selector: ICombined->ISegmentCollection): IRegionCollection {
		var seg1 = this.segments(poly1);
		var seg2 = this.segments(poly2);
		var comb = this.combine(seg1, seg2);
		var seg3 = selector(comb);
		return this.polygon(seg3);
	}

}
