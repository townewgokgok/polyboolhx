typedef INode = {
	?root: Bool,
	?prev: INode,
	?next: INode,
	?ev: Dynamic,

	?remove: Dynamic,

	?isStart: Bool,
	?pt: Point,
	?seg: ISegment,
	?primary: Bool,
	?other: INode,
	?status: Dynamic
}
