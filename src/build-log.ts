// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// used strictly for logging the processing of the algorithm... only useful if you intend on
// looking under the covers (for pretty UI's or debugging)
//

interface ILog {
	type: string;
	data?: any;
}

class BuildLog {

	list: ILog[];
	private nextSegmentId: number;
	private curVert: false|number;

	constructor() {
		this.list = [];
		this.nextSegmentId = 0;
		this.curVert = false;
	}

	private push(type: string, data?: any): BuildLog {
		this.list.push({
			type: type,
			data: data ? JSON.parse(JSON.stringify(data)) : null
		});
		return this;
	}

	segmentId(): number {
		return this.nextSegmentId++;
	}

	checkIntersection(seg1: ISegment, seg2: ISegment): BuildLog {
		return this.push('check', { seg1: seg1, seg2: seg2 });
	}

	segmentChop(seg: ISegment, end: Point): BuildLog {
		this.push('div_seg', { seg: seg, pt: end });
		return this.push('chop', { seg: seg, pt: end });
	}

	statusRemove(seg: ISegment): BuildLog {
		return this.push('pop_seg', { seg: seg });
	}

	segmentUpdate(seg: ISegment): BuildLog {
		return this.push('seg_update', { seg: seg });
	}

	segmentNew(seg: ISegment, primary: boolean): BuildLog {
		return this.push('new_seg', { seg: seg, primary: primary });
	}

	segmentRemove(seg: ISegment): BuildLog {
		return this.push('rem_seg', { seg: seg });
	}

	tempStatus(seg: ISegment, above: boolean, below: boolean): BuildLog {
		return this.push('temp_status', { seg: seg, above: above, below: below });
	}

	rewind(seg: ISegment): BuildLog {
		return this.push('rewind', { seg: seg });
	}

	status(seg: ISegment, above: boolean, below: boolean): BuildLog {
		return this.push('status', { seg: seg, above: above, below: below });
	}

	vert(x: number): BuildLog {
		if (x === this.curVert)
			return this;
		this.curVert = x;
		return this.push('vert', { x: x });
	}

	log(data: any): BuildLog {
		if (typeof data !== 'string')
			data = JSON.stringify(data, null, '  ');
		return this.push('log', { txt: data });
	}

	reset(): BuildLog {
		return this.push('reset');
	}

	selected(segs: ISegment[]): BuildLog {
		return this.push('selected', { segs: segs });
	}

	chainStart(seg: ISegment): BuildLog {
		return this.push('chain_start', { seg: seg });
	}

	chainRemoveHead(index: number, pt: Point): BuildLog {
		return this.push('chain_rem_head', { index: index, pt: pt });
	}

	chainRemoveTail(index: number, pt: Point): BuildLog {
		return this.push('chain_rem_tail', { index: index, pt: pt });
	}

	chainNew(pt1: Point, pt2: Point): BuildLog {
		return this.push('chain_new', { pt1: pt1, pt2: pt2 });
	}

	chainMatch(index: number): BuildLog {
		return this.push('chain_match', { index: index });
	}

	chainClose(index: number): BuildLog {
		return this.push('chain_close', { index: index });
	}

	chainAddHead(index: number, pt: Point): BuildLog {
		return this.push('chain_add_head', { index: index, pt: pt });
	}

	chainAddTail(index: number, pt: Point): BuildLog {
		return this.push('chain_add_tail', { index: index, pt: pt, });
	}

	chainConnect(index1: number, index2: number): BuildLog {
		return this.push('chain_con', { index1: index1, index2: index2 });
	}

	chainReverse(index: number): BuildLog {
		return this.push('chain_rev', { index: index });
	}

	chainJoin(index1: number, index2: number): BuildLog {
		return this.push('chain_join', { index1: index1, index2: index2 });
	}

	done(): BuildLog {
		return this.push('done');
	}

}
