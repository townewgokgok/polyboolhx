package polyboolhx;

typedef IFill = {
	above: Bool,
	below: Bool
}

typedef ISegment = {
	id: Float,
	start: IPoint,
	end: IPoint,
	myFill: IFill,
	?otherFill: IFill
}
