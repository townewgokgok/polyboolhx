// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// used strictly for logging the processing of the algorithm... only useful if you intend on
// looking under the covers (for pretty UI's or debugging)
//

package polyboolhx;

import haxe.Json;

class BuildLog {

	public var list: Array<ILog>;
	private var nextSegmentId: Float;
	private var curVert: Float;

	public inline function new() {
		this.list = [];
		this.nextSegmentId = 0;
		this.curVert = null;
	}

	private static function deepcopy(o: Dynamic): Dynamic {
		#if lua
			var r: Dynamic = o;
			untyped __lua__('
				if type(o) == "table" then
					r = {}
					for k, v in next, o, nil do
						r[k] = BuildLog.deepcopy(v)
					end
				end
			');
			return r;
		#else
			return Json.parse(Json.stringify(v));
		#end
	}

	private function push(type: String, ?data: Dynamic): BuildLog {
		this.list.push({ type: type, data: deepcopy(data) });
		return this;
	}

	public inline function segmentId(): Float {
		return this.nextSegmentId++;
	}

	public inline function checkIntersection(seg1: ISegment, seg2: ISegment): BuildLog {
		return this.push('check', { seg1: seg1, seg2: seg2 });
	}

	public inline function segmentChop(seg: ISegment, end: IPoint): BuildLog {
		this.push('div_seg', { seg: seg, pt: end });
		return this.push('chop', { seg: seg, pt: end });
	}

	public inline function statusRemove(seg: ISegment): BuildLog {
		return this.push('pop_seg', { seg: seg });
	}

	public inline function segmentUpdate(seg: ISegment): BuildLog {
		return this.push('seg_update', { seg: seg });
	}

	public inline function segmentNew(seg: ISegment, primary: Bool): BuildLog {
		return this.push('new_seg', { seg: seg, primary: primary });
	}

	public inline function segmentRemove(seg: ISegment): BuildLog {
		return this.push('rem_seg', { seg: seg });
	}

	public inline function tempStatus(seg: ISegment, above: Bool, below: Bool): BuildLog {
		return this.push('temp_status', { seg: seg, above: above, below: below });
	}

	public inline function rewind(seg: ISegment): BuildLog {
		return this.push('rewind', { seg: seg });
	}

	public inline function status(seg: ISegment, above: Bool, below: Bool): BuildLog {
		return this.push('status', { seg: seg, above: above, below: below });
	}

	public inline function vert(x: Float): BuildLog {
		if (x == this.curVert)
			return this;
		this.curVert = x;
		return this.push('vert', { x: x });
	}

	public inline function log(data: Dynamic): BuildLog {
		if (Std.is(data, String))
			data = Json.stringify(data, null, '  ');
		return this.push('log', { txt: data });
	}

	public inline function reset(): BuildLog {
		return this.push('reset');
	}

	public inline function selected(segs: Array<ISegment>): BuildLog {
		return this.push('selected', { segs: segs });
	}

	public inline function chainStart(seg: ISegment): BuildLog {
		return this.push('chain_start', { seg: seg });
	}

	public inline function chainRemoveHead(index: Float, pt: IPoint): BuildLog {
		return this.push('chain_rem_head', { index: index, pt: pt });
	}

	public inline function chainRemoveTail(index: Float, pt: IPoint): BuildLog {
		return this.push('chain_rem_tail', { index: index, pt: pt });
	}

	public inline function chainNew(pt1: IPoint, pt2: IPoint): BuildLog {
		return this.push('chain_new', { pt1: pt1, pt2: pt2 });
	}

	public inline function chainMatch(index: Float): BuildLog {
		return this.push('chain_match', { index: index });
	}

	public inline function chainClose(index: Float): BuildLog {
		return this.push('chain_close', { index: index });
	}

	public inline function chainAddHead(index: Float, pt: IPoint): BuildLog {
		return this.push('chain_add_head', { index: index, pt: pt });
	}

	public inline function chainAddTail(index: Float, pt: IPoint): BuildLog {
		return this.push('chain_add_tail', { index: index, pt: pt, });
	}

	public inline function chainConnect(index1: Float, index2: Float): BuildLog {
		return this.push('chain_con', { index1: index1, index2: index2 });
	}

	public inline function chainReverse(index: Float): BuildLog {
		return this.push('chain_rev', { index: index });
	}

	public inline function chainJoin(index1: Float, index2: Float): BuildLog {
		return this.push('chain_join', { index1: index1, index2: index2 });
	}

	public inline function done(): BuildLog {
		return this.push('done');
	}

}
