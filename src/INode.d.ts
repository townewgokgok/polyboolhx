interface INode {
	root?: boolean,
	prev?: INode,
	next?: INode,
	ev?: any

	remove?: any;

	isStart?: boolean;
	pt?: Point;
	seg?: ISegment;
	primary?: boolean;
	other?: INode;
	status?: any;
}
