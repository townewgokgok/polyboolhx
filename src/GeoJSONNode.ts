export class GeoJSONNode {
	region: Region;
	children: GeoJSONNode[];
	constructor(region?: Region) {
		this.region = region;
		this.children = [];
	}
}
