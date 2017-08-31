interface IFindTransitionResult {
	before: INode;
	after: INode;
	insert: (here: INode)=>INode;
}
