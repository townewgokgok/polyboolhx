package polyboolhx;

typedef ITransition = {
	before: INode,
	after: INode,
	insert: INode->INode
}
