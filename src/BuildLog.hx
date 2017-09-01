// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// used strictly for logging the processing of the algorithm... only useful if you intend on
// looking under the covers (for pretty UI's or debugging)
//

import haxe.Json;

class BuildLog {

	public var list: Array<ILog>;
	private var nextSegmentId: Float;
	private var curVert: Float;

	public function new() {
		this.list = [];
		this.nextSegmentId = 0;
		this.curVert = null;
	}

	private function push(type: String, ?data: Dynamic): BuildLog {
		this.list.push({
			type: type,
			data: data ? Json.parse(Json.stringify(data)) : null
		});
		return this;
	}

	public function segmentId(): Float {
		return this.nextSegmentId++;
	}

	public function checkIntersection(seg1: ISegment, seg2: ISegment): BuildLog {
		return this.push('check', { seg1: seg1, seg2: seg2 });
	}

	public function segmentChop(seg: ISegment, end: Point): BuildLog {
		this.push('div_seg', { seg: seg, pt: end });
		return this.push('chop', { seg: seg, pt: end });
	}

	public function statusRemove(seg: ISegment): BuildLog {
		return this.push('pop_seg', { seg: seg });
	}

	public function segmentUpdate(seg: ISegment): BuildLog {
		return this.push('seg_update', { seg: seg });
	}

	public function segmentNew(seg: ISegment, primary: Bool): BuildLog {
		return this.push('new_seg', { seg: seg, primary: primary });
	}

	public function segmentRemove(seg: ISegment): BuildLog {
		return this.push('rem_seg', { seg: seg });
	}

	public function tempStatus(seg: ISegment, above: Bool, below: Bool): BuildLog {
		return this.push('temp_status', { seg: seg, above: above, below: below });
	}

	public function rewind(seg: ISegment): BuildLog {
		return this.push('rewind', { seg: seg });
	}

	public function status(seg: ISegment, above: Bool, below: Bool): BuildLog {
		return this.push('status', { seg: seg, above: above, below: below });
	}

	public function vert(x: Float): BuildLog {
		if (x == this.curVert)
			return this;
		this.curVert = x;
		return this.push('vert', { x: x });
	}

	public function log(data: Dynamic): BuildLog {
		if (Std.is(data, String))
			data = Json.stringify(data, null, '  ');
		return this.push('log', { txt: data });
	}

	public function reset(): BuildLog {
		return this.push('reset');
	}

	public function selected(segs: Array<ISegment>): BuildLog {
		return this.push('selected', { segs: segs });
	}

	public function chainStart(seg: ISegment): BuildLog {
		return this.push('chain_start', { seg: seg });
	}

	public function chainRemoveHead(index: Float, pt: Point): BuildLog {
		return this.push('chain_rem_head', { index: index, pt: pt });
	}

	public function chainRemoveTail(index: Float, pt: Point): BuildLog {
		return this.push('chain_rem_tail', { index: index, pt: pt });
	}

	public function chainNew(pt1: Point, pt2: Point): BuildLog {
		return this.push('chain_new', { pt1: pt1, pt2: pt2 });
	}

	public function chainMatch(index: Float): BuildLog {
		return this.push('chain_match', { index: index });
	}

	public function chainClose(index: Float): BuildLog {
		return this.push('chain_close', { index: index });
	}

	public function chainAddHead(index: Float, pt: Point): BuildLog {
		return this.push('chain_add_head', { index: index, pt: pt });
	}

	public function chainAddTail(index: Float, pt: Point): BuildLog {
		return this.push('chain_add_tail', { index: index, pt: pt, });
	}

	public function chainConnect(index1: Float, index2: Float): BuildLog {
		return this.push('chain_con', { index1: index1, index2: index2 });
	}

	public function chainReverse(index: Float): BuildLog {
		return this.push('chain_rev', { index: index });
	}

	public function chainJoin(index1: Float, index2: Float): BuildLog {
		return this.push('chain_join', { index1: index1, index2: index2 });
	}

	public function done(): BuildLog {
		return this.push('done');
	}

}
