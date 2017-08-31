// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
// used strictly for logging the processing of the algorithm... only useful if you intend on
// looking under the covers (for pretty UI's or debugging)
//
class BuildLog {
    constructor() {
        this.list = [];
        this.nextSegmentId = 0;
        this.curVert = false;
    }
    push(type, data) {
        this.list.push({
            type: type,
            data: data ? JSON.parse(JSON.stringify(data)) : null
        });
        return this;
    }
    segmentId() {
        return this.nextSegmentId++;
    }
    checkIntersection(seg1, seg2) {
        return this.push('check', { seg1: seg1, seg2: seg2 });
    }
    segmentChop(seg, end) {
        this.push('div_seg', { seg: seg, pt: end });
        return this.push('chop', { seg: seg, pt: end });
    }
    statusRemove(seg) {
        return this.push('pop_seg', { seg: seg });
    }
    segmentUpdate(seg) {
        return this.push('seg_update', { seg: seg });
    }
    segmentNew(seg, primary) {
        return this.push('new_seg', { seg: seg, primary: primary });
    }
    segmentRemove(seg) {
        return this.push('rem_seg', { seg: seg });
    }
    tempStatus(seg, above, below) {
        return this.push('temp_status', { seg: seg, above: above, below: below });
    }
    rewind(seg) {
        return this.push('rewind', { seg: seg });
    }
    status(seg, above, below) {
        return this.push('status', { seg: seg, above: above, below: below });
    }
    vert(x) {
        if (x === this.curVert)
            return this;
        this.curVert = x;
        return this.push('vert', { x: x });
    }
    log(data) {
        if (typeof data !== 'string')
            data = JSON.stringify(data, null, '  ');
        return this.push('log', { txt: data });
    }
    reset() {
        return this.push('reset');
    }
    selected(segs) {
        return this.push('selected', { segs: segs });
    }
    chainStart(seg) {
        return this.push('chain_start', { seg: seg });
    }
    chainRemoveHead(index, pt) {
        return this.push('chain_rem_head', { index: index, pt: pt });
    }
    chainRemoveTail(index, pt) {
        return this.push('chain_rem_tail', { index: index, pt: pt });
    }
    chainNew(pt1, pt2) {
        return this.push('chain_new', { pt1: pt1, pt2: pt2 });
    }
    chainMatch(index) {
        return this.push('chain_match', { index: index });
    }
    chainClose(index) {
        return this.push('chain_close', { index: index });
    }
    chainAddHead(index, pt) {
        return this.push('chain_add_head', { index: index, pt: pt });
    }
    chainAddTail(index, pt) {
        return this.push('chain_add_tail', { index: index, pt: pt, });
    }
    chainConnect(index1, index2) {
        return this.push('chain_con', { index1: index1, index2: index2 });
    }
    chainReverse(index) {
        return this.push('chain_rev', { index: index });
    }
    chainJoin(index1, index2) {
        return this.push('chain_join', { index1: index1, index2: index2 });
    }
    done() {
        return this.push('done');
    }
}
exports.BuildLog = BuildLog;
//# sourceMappingURL=BuildLog.js.map