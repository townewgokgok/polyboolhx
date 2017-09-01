class GeoJSONNode {
	public var region: Region;
	public var children: Array<GeoJSONNode>;
	public function new(?region: Region) {
		this.region = region;
		this.children = [];
	}
}
