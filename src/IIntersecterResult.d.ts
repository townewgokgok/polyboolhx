interface IIntersecterResult {
	addRegion?: (region: Chain)=>void;
	calculate: NonSelfIntersectionCalculator|SelfIntersectionCalculator;
}
