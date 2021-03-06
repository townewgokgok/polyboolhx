// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// simple linked list implementation that allows you to traverse down nodes and save positions
//

package polyboolhx;

class LinkedList {

	var root: INode;

	public inline function new() {
		this.root = { root: true, next: null };
	}

	public inline function exists(node: INode) {
		if (node == null || node == this.root)
			return false;
		return true;
	}

	public inline function isEmpty(): Bool {
		return this.root.next == null;
	}

	public inline function getHead(): INode {
		return this.root.next;
	}

	public function insertBefore(node: INode, check: INode->Bool): Void {
		var last = this.root;
		var here = this.root.next;
		while (here != null) {
			if (check(here)) {
				node.prev = here.prev;
				node.next = here;
				here.prev.next = node;
				here.prev = node;
				return;
			}
			last = here;
			here = here.next;
		}
		last.next = node;
		node.prev = last;
		node.next = null;
	}

	public function findTransition(check: INode->Bool): ITransition {
		var prev = this.root;
		var here = this.root.next;
		while (here != null){
			if (check(here))
				break;
			prev = here;
			here = here.next;
		}
		return {
			before: prev == this.root ? null : prev,
			after: here,
			insert: function(node: INode): INode {
				node.prev = prev;
				node.next = here;
				prev.next = node;
				if (here != null)
					here.prev = node;
				return node;
			}
		};
	}

	public static function node(data: INode): INode {
		data.prev = null;
		data.next = null;
		data.remove = function() {
			data.prev.next = data.next;
			if (data.next != null)
				data.next.prev = data.prev;
			data.prev = null;
			data.next = null;
		};
		return data;
	}

}
