/*
 * @copyright 2016 Sean Connelly (@voidqk), http://syntheti.cc
 * @license MIT
 * @preserve Project Home: https://github.com/voidqk/polybooljs
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BuildLog_1 = require("./BuildLog");
const Epsilon_1 = require("./Epsilon");
const Intersecter_1 = require("./Intersecter");
const SegmentSelector_1 = require("./SegmentSelector");
const SegmentChainer_1 = require("./SegmentChainer");
const GeoJSON_1 = require("./GeoJSON");
class PolyBoolStatic {
    constructor() {
        this._epsilon = new Epsilon_1.Epsilon();
    }
    // getter/setter for buildLog
    buildLog(bl) {
        if (bl)
            this._buildLog = new BuildLog_1.BuildLog();
        else
            this._buildLog = null;
        return !this._buildLog ? null : this._buildLog.list;
    }
    // getter/setter for epsilon
    epsilon(v) {
        return this._epsilon.epsilon(v);
    }
    // core API
    segments(poly) {
        var i = Intersecter_1.Intersecter(true, this._epsilon, this._buildLog);
        poly.regions.forEach(i.addRegion);
        return {
            segments: i.calculate(poly.inverted),
            inverted: poly.inverted
        };
    }
    combine(segments1, segments2) {
        var i3 = Intersecter_1.Intersecter(false, this._epsilon, this._buildLog);
        return {
            combined: i3.calculate(segments1.segments, segments1.inverted, segments2.segments, segments2.inverted),
            inverted1: segments1.inverted,
            inverted2: segments2.inverted
        };
    }
    selectUnion(combined) {
        return {
            segments: SegmentSelector_1.SegmentSelector.union(combined.combined, this._buildLog),
            inverted: combined.inverted1 || combined.inverted2
        };
    }
    selectIntersect(combined) {
        return {
            segments: SegmentSelector_1.SegmentSelector.intersect(combined.combined, this._buildLog),
            inverted: combined.inverted1 && combined.inverted2
        };
    }
    selectDifference(combined) {
        return {
            segments: SegmentSelector_1.SegmentSelector.difference(combined.combined, this._buildLog),
            inverted: combined.inverted1 && !combined.inverted2
        };
    }
    selectDifferenceRev(combined) {
        return {
            segments: SegmentSelector_1.SegmentSelector.differenceRev(combined.combined, this._buildLog),
            inverted: !combined.inverted1 && combined.inverted2
        };
    }
    selectXor(combined) {
        return {
            segments: SegmentSelector_1.SegmentSelector.xor(combined.combined, this._buildLog),
            inverted: combined.inverted1 !== combined.inverted2
        };
    }
    polygon(segments) {
        return {
            regions: SegmentChainer_1.SegmentChainer(segments.segments, this._epsilon, this._buildLog),
            inverted: segments.inverted
        };
    }
    // GeoJSON converters
    polygonFromGeoJSON(geojson) {
        return GeoJSON_1.GeoJSON.toPolygon(this, geojson);
    }
    polygonToGeoJSON(poly) {
        return GeoJSON_1.GeoJSON.fromPolygon(this, this._epsilon, poly);
    }
    // helper functions for common operations
    union(poly1, poly2) {
        return this.operate(poly1, poly2, this.selectUnion.bind(this));
    }
    intersect(poly1, poly2) {
        return this.operate(poly1, poly2, this.selectIntersect.bind(this));
    }
    difference(poly1, poly2) {
        return this.operate(poly1, poly2, this.selectDifference.bind(this));
    }
    differenceRev(poly1, poly2) {
        return this.operate(poly1, poly2, this.selectDifferenceRev.bind(this));
    }
    xor(poly1, poly2) {
        return this.operate(poly1, poly2, this.selectXor.bind(this));
    }
    operate(poly1, poly2, selector) {
        var seg1 = this.segments(poly1);
        var seg2 = this.segments(poly2);
        var comb = this.combine(seg1, seg2);
        var seg3 = selector(comb);
        return this.polygon(seg3);
    }
}
exports.PolyBoolStatic = PolyBoolStatic;
//# sourceMappingURL=PolyBoolStatic.js.map