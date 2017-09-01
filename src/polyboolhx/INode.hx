package polyboolhx;

typedef INode = {
	?root: Bool,
	?prev: INode,
	?next: INode,
	?ev: Dynamic,

	?remove: Dynamic,

	?isStart: Bool,
	?pt: IPoint,
	?seg: ISegment,
	?primary: Bool,
	?other: INode,
	?status: Dynamic
}
