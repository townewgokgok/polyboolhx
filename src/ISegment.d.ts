interface ISegment {
	id: number;
	start: Point;
	end: Point;
	myFill: IFill;
	otherFill?: IFill;
}
