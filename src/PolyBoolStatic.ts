/*
 * @copyright 2016 Sean Connelly (@voidqk), http://syntheti.cc
 * @license MIT
 * @preserve Project Home: https://github.com/voidqk/polybooljs
 */

import {BuildLog} from './BuildLog';
import {Epsilon} from './Epsilon';
import {Intersecter} from './Intersecter';
import {SegmentSelector} from './SegmentSelector';
import {SegmentChainer} from './SegmentChainer';
import {GeoJSON} from './GeoJSON';

export class PolyBoolStatic {

	private _buildLog: BuildLog;
	private _epsilon: Epsilon;

	constructor() {
		this._epsilon = new Epsilon();
	}

	// getter/setter for buildLog
	buildLog(bl: boolean): ILog[] {
		if (bl)
			this._buildLog = new BuildLog();
		else
			this._buildLog = null;
		return !this._buildLog ? null : this._buildLog.list;
	}

	// getter/setter for epsilon
	epsilon(v?: number): number {
		return this._epsilon.epsilon(v);
	}

	// core API
	segments(poly: IRegionCollection): ISegmentCollection {
		var i = Intersecter(true, this._epsilon, this._buildLog);
		poly.regions.forEach(i.addRegion);
		return {
			segments: (<SelfIntersectionCalculator>i.calculate)(poly.inverted),
			inverted: poly.inverted
		};
	}

	combine(segments1: ISegmentCollection, segments2: ISegmentCollection): ICombined {
		var i3 = Intersecter(false, this._epsilon, this._buildLog);
		return {
			combined: (<NonSelfIntersectionCalculator>i3.calculate)(
				segments1.segments, segments1.inverted,
				segments2.segments, segments2.inverted
			),
			inverted1: segments1.inverted,
			inverted2: segments2.inverted
		};
	}

	selectUnion(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.union(combined.combined, this._buildLog),
			inverted: combined.inverted1 || combined.inverted2
		}
	}

	selectIntersect(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.intersect(combined.combined, this._buildLog),
			inverted: combined.inverted1 && combined.inverted2
		}
	}

	selectDifference(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.difference(combined.combined, this._buildLog),
			inverted: combined.inverted1 && !combined.inverted2
		}
	}

	selectDifferenceRev(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.differenceRev(combined.combined, this._buildLog),
			inverted: !combined.inverted1 && combined.inverted2
		}
	}

	selectXor(combined: ICombined): ISegmentCollection {
		return {
			segments: SegmentSelector.xor(combined.combined, this._buildLog),
			inverted: combined.inverted1 !== combined.inverted2
		}
	}

	polygon(segments: ISegmentCollection): IRegionCollection {
		return {
			regions: SegmentChainer(segments.segments, this._epsilon, this._buildLog),
			inverted: segments.inverted
		};
	}

	// GeoJSON converters

	polygonFromGeoJSON(geojson: IGeoJSON) {
		return GeoJSON.toPolygon(this, geojson);
	}

	polygonToGeoJSON(poly: IRegionCollection) {
		return GeoJSON.fromPolygon(this, this._epsilon, poly);
	}

	// helper functions for common operations

	union(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectUnion.bind(this));
	}

	intersect(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectIntersect.bind(this));
	}

	difference(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectDifference.bind(this));
	}

	differenceRev(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectDifferenceRev.bind(this));
	}

	xor(poly1: IRegionCollection, poly2: IRegionCollection): IRegionCollection {
		return this.operate(poly1, poly2, this.selectXor.bind(this));
	}

	private operate(poly1: IRegionCollection, poly2: IRegionCollection, selector: (combined: ICombined)=>ISegmentCollection): IRegionCollection {
		var seg1 = this.segments(poly1);
		var seg2 = this.segments(poly2);
		var comb = this.combine(seg1, seg2);
		var seg3 = selector(comb);
		return this.polygon(seg3);
	}

}
