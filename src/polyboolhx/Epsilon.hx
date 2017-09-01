// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/polybooljs

//
// provides the raw computation functions that takes epsilon into account
//
// zero is defined to be between (-epsilon, epsilon) exclusive
//

package polyboolhx;

typedef IIntersection = {
	pt: IPoint,
	alongA: Float,
	alongB: Float
}

class Epsilon {

	private var eps: Float;

	public inline function new(eps: Float = 0.0000000001) {
		this.eps = eps;
	}

	public inline function epsilon(?v: Float): Float {
		if (Std.is(v, Float))
			this.eps = v;
		return this.eps;
	}

	public inline function pointAboveOrOnLine(pt: IPoint, left: IPoint, right: IPoint): Bool {
		var Ax = left.x;
		var Ay = left.y;
		var Bx = right.x;
		var By = right.y;
		var Cx = pt.x;
		var Cy = pt.y;
		return (Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax) >= -this.eps;
	}

	public function pointBetween(p: IPoint, left: IPoint, right: IPoint): Bool {
		// p must be collinear with left->right
		// returns false if p == left, p == right, or left == right
		var d_py_ly = p.y - left.y;
		var d_rx_lx = right.x - left.x;
		var d_px_lx = p.x - left.x;
		var d_ry_ly = right.y - left.y;

		var dot = d_px_lx * d_rx_lx + d_py_ly * d_ry_ly;
		// if `dot` is 0, then `p` == `left` or `left` == `right` (reject)
		// if `dot` is less than 0, then `p` is to the left of `left` (reject)
		if (dot < this.eps)
			return false;

		var sqlen = d_rx_lx * d_rx_lx + d_ry_ly * d_ry_ly;
		// if `dot` > `sqlen`, then `p` is to the right of `right` (reject)
		// therefore, if `dot - sqlen` is greater than 0, then `p` is to the right of `right` (reject)
		if (dot - sqlen > -this.eps)
			return false;

		return true;
	}

	public inline function pointsSameX(p1: IPoint, p2: IPoint): Bool {
		return Math.abs(p1.x - p2.x) < this.eps;
	}

	public inline function pointsSameY(p1: IPoint, p2: IPoint): Bool {
		return Math.abs(p1.y - p2.y) < this.eps;
	}

	public inline function pointsSame(p1: IPoint, p2: IPoint): Bool {
		return this.pointsSameX(p1, p2) && this.pointsSameY(p1, p2);
	}

	public inline function pointsCompare(p1: IPoint, p2: IPoint): Float {
		// returns -1 if p1 is smaller, 1 if p2 is smaller, 0 if equal
		if (this.pointsSameX(p1, p2))
			return this.pointsSameY(p1, p2) ? 0 : (p1.y < p2.y ? -1 : 1);
		return p1.x < p2.x ? -1 : 1;
	}

	public inline function pointsCollinear(pt1: IPoint, pt2: IPoint, pt3: IPoint): Bool {
		// does pt1->pt2->pt3 make a straight line?
		// essentially this is just checking to see if the slope(pt1->pt2) === slope(pt2->pt3)
		// if slopes are equal, then they must be collinear, because they share pt2
		var dx1 = pt1.x - pt2.x;
		var dy1 = pt1.y - pt2.y;
		var dx2 = pt2.x - pt3.x;
		var dy2 = pt2.y - pt3.y;
		return Math.abs(dx1 * dy2 - dx2 * dy1) < this.eps;
	}

	public function linesIntersect(a0: IPoint, a1: IPoint, b0: IPoint, b1: IPoint): IIntersection {
		// returns false if the lines are coincident (e.g., parallel or on top of each other)
		//
		// returns an object if the lines intersect:
		//   {
		//     pt: [x, y],    where the intersection point is at
		//     alongA: where intersection point is along A,
		//     alongB: where intersection point is along B
		//   }
		//
		//  alongA and alongB will each be one of: -2, -1, 0, 1, 2
		//
		//  with the following meaning:
		//
		//    -2   intersection point is before segment's first point
		//    -1   intersection point is directly on segment's first point
		//     0   intersection point is between segment's first and second points (exclusive)
		//     1   intersection point is directly on segment's second point
		//     2   intersection point is after segment's second point
		var adx = a1.x - a0.x;
		var ady = a1.y - a0.y;
		var bdx = b1.x - b0.x;
		var bdy = b1.y - b0.y;

		var axb = adx * bdy - ady * bdx;
		if (Math.abs(axb) < this.eps)
			return null; // lines are coincident

		var dx = a0.x - b0.x;
		var dy = a0.y - b0.y;

		var A = (bdx * dy - bdy * dx) / axb;
		var B = (adx * dy - ady * dx) / axb;

		var ret: IIntersection = {
			alongA: 0,
			alongB: 0,
			pt: {
				x: a0.x + A * adx,
				y: a0.y + A * ady
			}
		};

		// categorize where intersection point is along A and B

		if (A <= -this.eps)
			ret.alongA = -2;
		else if (A < this.eps)
			ret.alongA = -1;
		else if (A - 1 <= -this.eps)
			ret.alongA = 0;
		else if (A - 1 < this.eps)
			ret.alongA = 1;
		else
			ret.alongA = 2;

		if (B <= -this.eps)
			ret.alongB = -2;
		else if (B < this.eps)
			ret.alongB = -1;
		else if (B - 1 <= -this.eps)
			ret.alongB = 0;
		else if (B - 1 < this.eps)
			ret.alongB = 1;
		else
			ret.alongB = 2;

		return ret;
	}

	public function pointInsideRegion(pt: IPoint, region: Region): Bool {
		var x = pt.x;
		var y = pt.y;
		var last_x = region[region.length - 1].x;
		var last_y = region[region.length - 1].y;
		var inside = false;
		for (i in 0...region.length) {
			var curr_x = region[i].x;
			var curr_y = region[i].y;

			// if y is between curr_y and last_y, and
			// x is to the right of the boundary created by the line
			if ((curr_y - y > this.eps) != (last_y - y > this.eps) &&
				(last_x - curr_x) * (y - curr_y) / (last_y - curr_y) + curr_x - x > this.eps)
				inside = !inside;

			last_x = curr_x;
			last_y = curr_y;
		}
		return inside;
	}

}
