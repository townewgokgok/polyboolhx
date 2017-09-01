// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// converts a list of segments into a list of regions, while also removing unnecessary verticies
//

typedef IMatch = {
	index: Int,
	matches_head: Bool,
	matches_pt1: Bool
}

class SegmentChainer {

	public static function segmentChainer(segments: Array<ISegment>, eps: Epsilon, ?buildLog: BuildLog): Array<Chain> {
		var chains: Array<Chain> = [];
		var regions: Array<Chain> = [];

		for (seg in segments) {
			var pt1: Point = seg.start;
			var pt2: Point = seg.end;
			if (eps.pointsSame(pt1, pt2)) {
				trace('PolyBool: Warning: Zero-length segment detected; your epsilon is ' +
					'probably too small or too large');
				continue;
			}

			if (buildLog != null)
				buildLog.chainStart(seg);

			// search for two chains that this segment matches
			var first_match: IMatch = {
				index: 0,
				matches_head: false,
				matches_pt1: false
			};
			var second_match: IMatch = {
				index: 0,
				matches_head: false,
				matches_pt1: false
			};
			var next_match: Dynamic = first_match;
			function setMatch(index: Float, matches_head: Bool, matches_pt1: Bool): Bool {
				// return true if we've matched twice
				next_match.index = index;
				next_match.matches_head = matches_head;
				next_match.matches_pt1 = matches_pt1;
				if (next_match == first_match){
					next_match = second_match;
					return false;
				}
				next_match = null;
				return true; // we've matched twice, we're done here
			}
			for (i in 0...chains.length) {
				var chain: Chain = chains[i];
				var head : Point = chain[0];
				var head2: Point = chain[1];
				var tail : Point = chain[chain.length - 1];
				var tail2: Point = chain[chain.length - 2];
				if (eps.pointsSame(head, pt1)){
					if (setMatch(i, true, true))
						break;
				}
				else if (eps.pointsSame(head, pt2)){
					if (setMatch(i, true, false))
						break;
				}
				else if (eps.pointsSame(tail, pt1)){
					if (setMatch(i, false, true))
						break;
				}
				else if (eps.pointsSame(tail, pt2)){
					if (setMatch(i, false, false))
						break;
				}
			}

			if (next_match == first_match) {
				// we didn't match anything, so create a new chain
				chains.push([ pt1, pt2 ]);
				if (buildLog != null)
					buildLog.chainNew(pt1, pt2);
				continue;
			}

			if (next_match == second_match){
				// we matched a single chain

				if (buildLog != null)
					buildLog.chainMatch(first_match.index);

				// add the other point to the apporpriate end, and check to see if we've closed the
				// chain into a loop

				var index: Int = first_match.index;
				var pt: Point = first_match.matches_pt1 ? pt2 : pt1; // if we matched pt1, then we add pt2, etc
				var addToHead = first_match.matches_head; // if we matched at head, then add to the head

				var chain: Chain = chains[index];
				var grow : Point = addToHead ? chain[0] : chain[chain.length - 1];
				var grow2: Point = addToHead ? chain[1] : chain[chain.length - 2];
				var oppo : Point = addToHead ? chain[chain.length - 1] : chain[0];
				var oppo2: Point = addToHead ? chain[chain.length - 2] : chain[1];

				if (eps.pointsCollinear(grow2, grow, pt)){
					// grow isn't needed because it's directly between grow2 and pt:
					// grow2 ---grow---> pt
					if (addToHead){
						if (buildLog != null)
							buildLog.chainRemoveHead(first_match.index, pt);
						chain.shift();
					}
					else{
						if (buildLog != null)
							buildLog.chainRemoveTail(first_match.index, pt);
						chain.pop();
					}
					grow = grow2; // old grow is gone... new grow is what grow2 was
				}

				if (eps.pointsSame(oppo, pt)){
					// we're closing the loop, so remove chain from chains
					chains.splice(index, 1);

					if (eps.pointsCollinear(oppo2, oppo, grow)){
						// oppo isn't needed because it's directly between oppo2 and grow:
						// oppo2 ---oppo--->grow
						if (addToHead){
							if (buildLog != null)
								buildLog.chainRemoveTail(first_match.index, grow);
							chain.pop();
						}
						else{
							if (buildLog != null)
								buildLog.chainRemoveHead(first_match.index, grow);
							chain.shift();
						}
					}

					if (buildLog != null)
						buildLog.chainClose(first_match.index);

					// we have a closed chain!
					regions.push(chain);
					continue;
				}

				// not closing a loop, so just add it to the apporpriate side
				if (addToHead){
					if (buildLog != null)
						buildLog.chainAddHead(first_match.index, pt);
					chain.unshift(pt);
				}
				else{
					if (buildLog != null)
						buildLog.chainAddTail(first_match.index, pt);
					chain.push(pt);
				}
				continue;
			}

			// otherwise, we matched two chains, so we need to combine those chains together

			function reverseChain(index: Int) {
				if (buildLog != null)
					buildLog.chainReverse(index);
				chains[index].reverse(); // gee, that's easy
			}

			function appendChain(index1: Int, index2: Int): Void {
				// index1 gets index2 appended to it, and index2 is removed
				var chain1: Chain = chains[index1];
				var chain2: Chain = chains[index2];
				var tail : Point = chain1[chain1.length - 1];
				var tail2: Point = chain1[chain1.length - 2];
				var head : Point = chain2[0];
				var head2: Point = chain2[1];

				if (eps.pointsCollinear(tail2, tail, head)){
					// tail isn't needed because it's directly between tail2 and head
					// tail2 ---tail---> head
					if (buildLog != null)
						buildLog.chainRemoveTail(index1, tail);
					chain1.pop();
					tail = tail2; // old tail is gone... new tail is what tail2 was
				}

				if (eps.pointsCollinear(tail, head, head2)){
					// head isn't needed because it's directly between tail and head2
					// tail ---head---> head2
					if (buildLog != null)
						buildLog.chainRemoveHead(index2, head);
					chain2.shift();
				}

				if (buildLog != null)
					buildLog.chainJoin(index1, index2);
				chains[index1] = chain1.concat(chain2);
				chains.splice(index2, 1);
			}

			var F = first_match.index;
			var S = second_match.index;

			if (buildLog != null)
				buildLog.chainConnect(F, S);

			var reverseF = chains[F].length < chains[S].length; // reverse the shorter chain, if needed
			if (first_match.matches_head){
				if (second_match.matches_head){
					if (reverseF){
						// <<<< F <<<< --- >>>> S >>>>
						reverseChain(F);
						// >>>> F >>>> --- >>>> S >>>>
						appendChain(F, S);
					}
					else{
						// <<<< F <<<< --- >>>> S >>>>
						reverseChain(S);
						// <<<< F <<<< --- <<<< S <<<<   logically same as:
						// >>>> S >>>> --- >>>> F >>>>
						appendChain(S, F);
					}
				}
				else{
					// <<<< F <<<< --- <<<< S <<<<   logically same as:
					// >>>> S >>>> --- >>>> F >>>>
					appendChain(S, F);
				}
			}
			else{
				if (second_match.matches_head){
					// >>>> F >>>> --- >>>> S >>>>
					appendChain(F, S);
				}
				else{
					if (reverseF){
						// >>>> F >>>> --- <<<< S <<<<
						reverseChain(F);
						// <<<< F <<<< --- <<<< S <<<<   logically same as:
						// >>>> S >>>> --- >>>> F >>>>
						appendChain(S, F);
					}
					else{
						// >>>> F >>>> --- <<<< S <<<<
						reverseChain(S);
						// >>>> F >>>> --- >>>> S >>>>
						appendChain(F, S);
					}
				}
			}
		}

		return regions;
	}

}
