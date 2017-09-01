package polyboolhx;

class GeoJSONNode {
	public var region: Region;
	public var children: Array<GeoJSONNode>;
	public inline function new(?region: Region) {
		this.region = region;
		this.children = [];
	}
}
