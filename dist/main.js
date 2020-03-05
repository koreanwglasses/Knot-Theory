/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/planar-knot.ts":
/*!*********************************!*\
  !*** ./src/core/planar-knot.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function map(knot, crossingFn, anchorFn, arcFn, knotFn) {
    const crossings = knot.crossings.map(crossingFn);
    const cloneAnchor = (() => {
        const anchors = {};
        return (anchor) => {
            if (anchor == null)
                return null;
            const i = knot.crossings.indexOf(anchor.crossing);
            const key = `${i},${anchor.strand}`;
            if (!(key in anchors))
                anchors[key] = anchorFn(anchor, crossings[i]);
            return anchors[key];
        };
    })();
    const arcs = knot.arcs.map(arc => arcFn(arc, cloneAnchor(arc.begin), cloneAnchor(arc.end)));
    return knotFn(knot, crossings, arcs);
}
exports.map = map;
function anchorEquals(anchor1, anchor2) {
    return (anchor1.crossing == anchor2.crossing && anchor1.strand == anchor2.strand);
}
exports.anchorEquals = anchorEquals;
/**
 * Returns arcs in the order [upper-out, upper-in, lower-out, lower in]
 * @param knot Knot
 * @param crossing Crossing within the knot
 */
function arcsAtCrossing(knot, crossing) {
    const adjacentArcs = knot.arcs.filter(arc => (arc.end && arc.end.crossing == crossing) ||
        (arc.begin && arc.begin.crossing == crossing));
    if (adjacentArcs.length > 4) {
        throw new Error("invalid knot: each crossing must have at most four arcs connected to it");
    }
    const upperOut = adjacentArcs.filter(arc => arc.begin.strand == "upper" && arc.begin.crossing == crossing);
    if (upperOut.length == 0) {
        throw new Error("invalid knot: no upper-out arc at crossing");
    }
    if (upperOut.length > 1) {
        throw new Error("invalid knot: multiple upper-out arcs at crossing");
    }
    const upperIn = adjacentArcs.filter(arc => arc.end.strand == "upper" && arc.end.crossing == crossing);
    if (upperIn.length == 0) {
        throw new Error("invalid knot: no upper-in arc at crossing");
    }
    if (upperIn.length > 1) {
        throw new Error("invalid knot: multiple upper-in arcs at crossing");
    }
    const lowerOut = adjacentArcs.filter(arc => arc.begin.strand == "lower" && arc.begin.crossing == crossing);
    if (lowerOut.length == 0) {
        throw new Error("invalid knot: no lower-out arc at crossing");
    }
    if (lowerOut.length > 1) {
        throw new Error("invalid knot: multiple lower-out arcs at crossing");
    }
    const lowerIn = adjacentArcs.filter(arc => arc.end.strand == "lower" && arc.end.crossing == crossing);
    if (lowerIn.length == 0) {
        throw new Error("invalid knot: no lower-in arc at crossing");
    }
    if (lowerIn.length > 1) {
        throw new Error("invalid knot: multiple lower-in arcs at crossing");
    }
    return [upperOut[0], upperIn[0], lowerOut[0], lowerIn[0]];
}
exports.arcsAtCrossing = arcsAtCrossing;
function prevArc(knot, arc) {
    const matches = knot.arcs.filter(prev => anchorEquals(arc.begin, prev.end));
    if (matches.length == 0) {
        throw new Error("invalid knot: knot is not a closed, well oriented loop");
    }
    if (matches.length > 1) {
        throw new Error("invalid knot: knot has branches i.e. is not a simple loop");
    }
    return matches[0];
}
exports.prevArc = prevArc;
function nextArc(knot, arc) {
    const matches = knot.arcs.filter(next => anchorEquals(arc.end, next.begin));
    if (matches.length == 0) {
        throw new Error("invalid knot: knot is not a closed, well oriented loop");
    }
    if (matches.length > 1) {
        throw new Error("invalid knot: knot has branches i.e. is not a simple loop");
    }
    return matches[0];
}
exports.nextArc = nextArc;
/**
 * Convert a crossing to an uncrossing.
 * orientation consistency: reorient is required.
 * @param knot Knot to operate on
 * @param crossing Crossing to uncross
 * @param sign Which arcs to merge
 * @param callbackFns Knot mutation strategies
 */
function uncross(knot, crossing, sign, callbackFns) {
    const { mergeArcs, addArc, removeArc, removeCrossing } = callbackFns;
    const [upperOut, upperIn, lowerOut, lowerIn] = arcsAtCrossing(knot, crossing);
    const arc1 = sign == "positive"
        ? mergeArcs(lowerIn, upperOut, crossing)
        : mergeArcs(lowerIn, upperIn, crossing);
    const arc2 = sign == "positive"
        ? mergeArcs(upperIn, lowerOut, crossing)
        : mergeArcs(upperOut, lowerOut, crossing);
    [upperOut, upperIn, lowerOut, lowerIn].forEach(arc => removeArc(arc));
    [arc1, arc2].forEach(arc => addArc(arc));
    removeCrossing(crossing);
}
exports.uncross = uncross;
function reorient(knot, seed, callbackFns) {
    const { flipArc, addArc, removeArc } = callbackFns;
    const arcsToRemove = [];
    const arcsToAdd = [];
    let currentArc = seed;
    let flipped = false;
    do {
        if (currentArc.end == null)
            break;
        const nextArcs = knot.arcs.filter(arc => arc !== currentArc &&
            [arc.begin, arc.end].indexOf(flipped ? currentArc.begin : currentArc.end) != -1);
        if (nextArcs.length == 0) {
            throw new Error("invalid knot: not enough (1) arcs on upper strand of crossing");
        }
        if (nextArcs.length > 1) {
            throw new Error("invalid knot: too many (3+) arcs on upper strand of crossing");
        }
        const nextArc = nextArcs[0];
        if (nextArc.end == (flipped ? currentArc.begin : currentArc.end)) {
            arcsToRemove.push(nextArc);
            arcsToAdd.push(flipArc(nextArc));
            flipped = true;
        }
        else {
            flipped = false;
        }
        currentArc = nextArc;
    } while (currentArc !== seed);
    arcsToRemove.forEach(removeArc);
    arcsToAdd.forEach(addArc);
}
exports.reorient = reorient;
class Anchor {
    constructor(crossing, strand) {
        this.crossing = crossing;
        this.strand = strand;
    }
    copy(crossing) {
        return crossing[this.strand];
    }
}
exports.Anchor = Anchor;
/**
 * A crossing with references to anchors
 */
class Crossing {
    constructor() {
        this.lower = new Anchor(this, "lower");
        this.upper = new Anchor(this, "upper");
    }
    copy() {
        return new Crossing();
    }
}
exports.Crossing = Crossing;
class Arc {
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }
    copy(begin, end) {
        return new Arc(begin, end);
    }
}
exports.Arc = Arc;
class Knot {
    constructor(crossings, arcs) {
        this.crossings = crossings;
        this.arcs = arcs;
        this.mergeArcs = this.mergeArcs.bind(this);
        this.flipArc = this.flipArc.bind(this);
        this.removeCrossing = this.removeCrossing.bind(this);
        this.addArc = this.addArc.bind(this);
        this.removeArc = this.removeArc.bind(this);
    }
    copy(crossings, arcs) {
        return new Knot(crossings, arcs);
    }
    clone() {
        return map(this, crossing => crossing.copy(), (anchor, crossing) => anchor.copy(crossing), (arc, begin, end) => arc.copy(begin, end), (knot, crossings, arcs) => knot.copy(crossings, arcs));
    }
    mergeArcs(arc1, arc2, crossing) {
        if (arc1 == arc2) {
            return new Arc(null, null); // used to denote an unlink component
        }
        if (arc1.end.crossing == crossing && arc2.begin.crossing == crossing) {
            return new Arc(arc1.begin, arc2.end);
        }
        if (arc1.begin.crossing == crossing && arc2.end.crossing == crossing) {
            return new Arc(arc1.end, arc2.begin);
        }
        if (arc1.end.crossing == crossing && arc2.end.crossing == crossing) {
            return new Arc(arc1.begin, arc2.begin);
        }
        if (arc1.begin.crossing == crossing && arc2.begin.crossing == crossing) {
            return new Arc(arc1.end, arc2.end);
        }
        throw new Error("incompatible arcs");
    }
    flipArc(arc) {
        return new Arc(arc.end, arc.begin);
    }
    removeCrossing(crossing) {
        if (this.crossings.indexOf(crossing) != -1)
            this.crossings.splice(this.crossings.indexOf(crossing), 1);
    }
    addArc(arc) {
        this.arcs.push(arc);
    }
    removeArc(arc) {
        if (this.arcs.indexOf(arc) != -1)
            this.arcs.splice(this.arcs.indexOf(arc), 1);
    }
    uncross(crossing, sign) {
        uncross(this, crossing, sign, this);
    }
    reorient(seed) {
        reorient(this, seed || this.arcs[0], this);
    }
}
exports.Knot = Knot;


/***/ }),

/***/ "./src/core/planar-poly-knot.ts":
/*!**************************************!*\
  !*** ./src/core/planar-poly-knot.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const PlanarKnot = __webpack_require__(/*! ./planar-knot */ "./src/core/planar-knot.ts");
const lin_1 = __webpack_require__(/*! ../utils/lin */ "./src/utils/lin.ts");
/**
 * Transform the points of a knot in place by a matrix m
 * @param knot Knot to transform
 * @param m Transformation as an affine matrix
 */
function transform(knot, m) {
    return PlanarKnot.map(knot, crossing => {
        crossing.location = lin_1.dot(m, crossing.location);
        return crossing;
    }, anchor => anchor, arc => {
        arc.path = arc.path.map(v => lin_1.dot(m, v));
        return arc;
    }, knot => knot);
}
exports.transform = transform;
class Crossing extends PlanarKnot.Crossing {
    constructor(location) {
        super();
        this.location = location;
    }
    copy() {
        return new Crossing(this.location);
    }
}
exports.Crossing = Crossing;
class Anchor extends PlanarKnot.Anchor {
    constructor(crossing, strand) {
        super(crossing, strand);
        this.crossing = crossing;
        this.strand = strand;
    }
    copy(crossing) {
        return super.copy(crossing);
    }
}
exports.Anchor = Anchor;
class Arc extends PlanarKnot.Arc {
    constructor(begin, end, path) {
        super(begin, end);
        this.begin = begin;
        this.end = end;
        this.path = path;
    }
    copy(begin, end) {
        return new Arc(begin, end, this.path.slice());
    }
}
exports.Arc = Arc;
class Knot extends PlanarKnot.Knot {
    constructor(crossings, arcs) {
        super(crossings, arcs);
        this.crossings = crossings;
        this.arcs = arcs;
    }
    copy(crossings, arcs) {
        return new Knot(crossings, arcs);
    }
    clone() {
        return super.clone();
    }
    mergeArcs(arc1, arc2, crossing) {
        const arc3 = super.mergeArcs(arc1, arc2, crossing);
        const newPath = arc1 == arc2
            ? [...arc1.path, crossing.location, arc1.path[0]]
            : [
                ...(arc1.end.crossing === crossing
                    ? arc1.path
                    : arc1.path.slice().reverse()),
                crossing.location,
                ...(arc2.begin.crossing === crossing
                    ? arc2.path
                    : arc2.path.slice().reverse())
            ];
        return new Arc(arc3.begin, arc3.end, newPath);
    }
    flipArc(arc) {
        return new Arc(arc.end, arc.begin, arc.path.slice().reverse());
    }
    static fromPlanarPolyKnot(knot) {
        return PlanarKnot.map(knot, crossing => new Crossing(crossing.location), (anchor, crossing) => crossing[anchor.strand], (arc, begin, end) => new Arc(begin, end, arc.path), (knot, crossings, arcs) => new Knot(crossings, arcs));
    }
}
exports.Knot = Knot;
exports.trefoil = () => {
    const crossings = [
        new Crossing([0, 1]),
        new Crossing([-Math.sqrt(3) / 2, -1 / 2]),
        new Crossing([Math.sqrt(3) / 2, -1 / 2])
    ];
    const arcs = [
        {
            begin: crossings[0].lower,
            end: crossings[1].upper,
            path: [[-Math.sqrt(3) / 2, 1 / 2]]
        },
        { begin: crossings[1].upper, end: crossings[2].lower, path: [] },
        {
            begin: crossings[2].lower,
            end: crossings[0].upper,
            path: [[Math.sqrt(3) / 2, 1 / 2]]
        },
        { begin: crossings[0].upper, end: crossings[1].lower, path: [] },
        { begin: crossings[1].lower, end: crossings[2].upper, path: [[0, -1]] },
        { begin: crossings[2].upper, end: crossings[0].lower, path: [] }
    ];
    return { crossings, arcs };
};


/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const ReactDOM = __webpack_require__(/*! react-dom */ "react-dom");
const poly_knot_diagram_canvas_1 = __webpack_require__(/*! ./renderers/react/poly-knot-diagram-canvas */ "./src/renderers/react/poly-knot-diagram-canvas.tsx");
const planar_poly_knot_1 = __webpack_require__(/*! ./core/planar-poly-knot */ "./src/core/planar-poly-knot.ts");
const planar_poly_knot_2 = __webpack_require__(/*! ./core/planar-poly-knot */ "./src/core/planar-poly-knot.ts");
const planar_spring_knot_1 = __webpack_require__(/*! ./layout/planar-spring-knot */ "./src/layout/planar-spring-knot.ts");
const poly_knot_diagram_1 = __webpack_require__(/*! ./renderers/canvas/poly-knot-diagram */ "./src/renderers/canvas/poly-knot-diagram.ts");
const lin_1 = __webpack_require__(/*! ./utils/lin */ "./src/utils/lin.ts");
const planar_poly_knot_3 = __webpack_require__(/*! ./core/planar-poly-knot */ "./src/core/planar-poly-knot.ts");
const planar_knot_1 = __webpack_require__(/*! ./core/planar-knot */ "./src/core/planar-knot.ts");
const knot = planar_poly_knot_1.trefoil();
const m = lin_1.dot(lin_1.translate([200, 200]), lin_1.scale(100));
planar_poly_knot_2.transform(knot, m);
ReactDOM.render(React.createElement(poly_knot_diagram_canvas_1.PolyKnotDiagramCanvas, { knot: knot, width: 400, height: 400 }), document.getElementById("react-root"));
const springKnot = planar_spring_knot_1.PlanarSpringKnot.fromPlanarPolyKnot(knot, 5);
console.log(springKnot);
// springKnot.initialize();
const canvas = document.getElementById("test-canvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = "#000";
ctx.lineWidth = 5;
ctx.lineCap = "round";
springKnot.localOptimize();
poly_knot_diagram_1.drawKnot(ctx, springKnot);
// const interval = setInterval(() => {
//   const energy = springKnot.energy();
//   springKnot.pushState();
//   springKnot.perturb(10);
//   springKnot.localOptimize();
//   const newEnergy = springKnot.energy();
//   if (newEnergy > energy) springKnot.popState();
//   else {
//     springKnot.discardState();
//     console.log(energy);
//   }
//   ctx.clearRect(0, 0, 400, 400);
//   drawKnot(ctx, springKnot);
// }, 100);
const nextArcFn = planar_knot_1.nextArc;
const knot2 = planar_poly_knot_3.Knot.fromPlanarPolyKnot(springKnot);
knot2.uncross(knot2.crossings[0], "negative");
knot2.reorient();
knot2.uncross(knot2.crossings[0], "positive");
knot2.reorient();
// knot2.uncross(knot2.crossings[0], "positive");
// knot2.reorient();
const canvas2 = document.getElementById("test-canvas2");
const ctx2 = canvas2.getContext("2d");
ctx.strokeStyle = "#000";
ctx.lineWidth = 5;
ctx.lineCap = "round";
poly_knot_diagram_1.drawKnot(ctx2, knot2);


/***/ }),

/***/ "./src/layout/planar-spring-knot.ts":
/*!******************************************!*\
  !*** ./src/layout/planar-spring-knot.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lin_1 = __webpack_require__(/*! ../utils/lin */ "./src/utils/lin.ts");
const planar_knot_1 = __webpack_require__(/*! ../core/planar-knot */ "./src/core/planar-knot.ts");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
class Node {
    constructor(parent) {
        this.parent = parent;
        this.location = [0, 0];
        this.springs = [];
        this.force = [0, 0];
        this.states = [];
    }
    computeForce() {
        this.force = [0, 0];
        this.springs.forEach(spring => {
            // f = k(|d|-l)(d/|d|)
            const d = lin_1.sub(spring.target.location, this.location);
            const f = lin_1.scl(spring.k * (lin_1.norm(d) - spring.restLength), lin_1.normalize(d));
            this.force = lin_1.add(this.force, f);
        });
    }
    // velocity: Vector2 = [0, 0];
    // tick(dt: number): void {
    //   const f = add(this.force, scl(-1, this.velocity));
    //   this.velocity = add(this.velocity, scl(dt, f));
    //   this.location = add(this.location, scl(dt, this.velocity));
    // }
    step(stepSize) {
        this.location = lin_1.add(this.location, lin_1.scl(stepSize, this.force));
    }
    energy() {
        let energy = 0;
        this.springs.forEach(spring => {
            // e = 1/2 k (|d| - l0)^2
            const d = lin_1.dist(spring.target.location, this.location);
            energy += 0.5 * spring.k * Math.pow((d - spring.restLength), 2);
        });
        return energy;
    }
    /**
     * Used in optimization
     */
    pushState() {
        this.states.push({ location: this.location });
    }
    popState() {
        const { location } = this.states.pop();
        this.location = location;
    }
    discardState() {
        this.states.pop();
    }
}
class Spring {
    constructor(target, restLength, k) {
        this.target = target;
        this.restLength = restLength;
        this.k = k;
    }
}
class Crossing {
    constructor() {
        this.node = new Node(this);
    }
    get location() {
        return this.node.location;
    }
    set location(v) {
        this.node.location = v;
    }
}
exports.Crossing = Crossing;
class Arc {
    constructor(begin, end, subdivisions) {
        this.begin = begin;
        this.end = end;
        this.subdivisions = subdivisions;
        this.nodes = new Array(subdivisions).fill(null).map(() => new Node(this));
    }
    get path() {
        return this.nodes.map(node => node.location);
    }
}
exports.Arc = Arc;
/**
 * Gets the nodes on this arc and one from each adjacent arc
 * @param knot Knot
 * @param arc Arc
 */
function getSegment(knot, arc) {
    const prev = planar_knot_1.prevArc(knot, arc).nodes;
    const next = planar_knot_1.nextArc(knot, arc).nodes;
    return [
        prev[prev.length - 1],
        arc.begin.crossing.node,
        ...arc.nodes,
        arc.end.crossing.node,
        next[0]
    ];
}
/**
 * Connect springs between the appropriate nodes
 * @param knot
 * @param nodes
 */
function createSprings(knot, nodes) {
    const restLength = 25;
    const structuralK = 1;
    const flexionK = 4;
    const shearK = 4;
    nodes.forEach(node => {
        if (node.parent instanceof Arc) {
            const segment = getSegment(knot, node.parent);
            const i = segment.indexOf(node);
            utils_1.assert(2 <= i && i <= segment.length - 3);
            // Connect structural springs
            node.springs.push(new Spring(segment[i - 1], restLength, structuralK));
            node.springs.push(new Spring(segment[i + 1], restLength, structuralK));
            // connect back from crossing nodes
            if (i == 2) {
                segment[1].springs.push(new Spring(node, restLength, structuralK));
            }
            else if (i == segment.length - 3) {
                segment[segment.length - 2].springs.push(new Spring(node, restLength, structuralK));
            }
            // Connect flexion springs
            node.springs.push(new Spring(segment[i - 2], 2 * restLength, flexionK));
            node.springs.push(new Spring(segment[i + 2], 2 * restLength, flexionK));
            // connect back from crossing nodes
            if (i == 3) {
                segment[1].springs.push(new Spring(node, restLength, flexionK));
            }
            else if (i == segment.length - 4) {
                segment[segment.length - 2].springs.push(new Spring(node, restLength, flexionK));
            }
        }
        else {
            const [upperOut, upperIn, lowerOut, lowerIn] = planar_knot_1.arcsAtCrossing(knot, node.parent);
            const uon = upperOut.nodes[0];
            const uin = upperIn.nodes[upperIn.nodes.length - 1];
            const lon = lowerOut.nodes[0];
            const lin = lowerIn.nodes[lowerIn.nodes.length - 1];
            // connect shear springs
            uon.springs.push(new Spring(lon, Math.SQRT1_2 * restLength, shearK));
            uon.springs.push(new Spring(lin, Math.SQRT1_2 * restLength, shearK));
            uin.springs.push(new Spring(lon, Math.SQRT1_2 * restLength, shearK));
            uin.springs.push(new Spring(lin, Math.SQRT1_2 * restLength, shearK));
            lon.springs.push(new Spring(uon, Math.SQRT1_2 * restLength, shearK));
            lon.springs.push(new Spring(uin, Math.SQRT1_2 * restLength, shearK));
            lin.springs.push(new Spring(uon, Math.SQRT1_2 * restLength, shearK));
            lin.springs.push(new Spring(uin, Math.SQRT1_2 * restLength, shearK));
        }
    });
}
class PlanarSpringKnot {
    constructor(crossings, arcs) {
        this.crossings = crossings;
        this.arcs = arcs;
        const crossingNodes = crossings.map(crossing => crossing.node);
        this.nodes = [...crossingNodes];
        arcs.forEach(arc => this.nodes.push(...arc.nodes));
        createSprings(this, this.nodes);
    }
    /**
     * Initialize nodes to random locations
     */
    initialize() {
        this.nodes.forEach(node => (node.location = [Math.random() * 400, Math.random() * 400]));
    }
    perturb(amplitude) {
        const random = () => {
            let x, y;
            do {
                x = 2 * Math.random() - 1;
                y = 2 * Math.random() - 1;
            } while (Math.pow(x, 2) + Math.pow(y, 2) > 1);
            return [x, y];
        };
        this.nodes.forEach(node => (node.location = lin_1.add(node.location, lin_1.scl(amplitude, random()))));
    }
    recenter(nodes, center) {
        let centroid = [0, 0];
        nodes.forEach(node => (centroid = lin_1.add(centroid, lin_1.scl(1 / nodes.length, node.location))));
        nodes.forEach(node => (node.location = lin_1.add(lin_1.sub(node.location, centroid), center)));
    }
    // tick(dt: number): void {
    //   this.nodes.forEach(node => node.computeForce());
    //   this.nodes.forEach(node => node.tick(dt));
    //   recenter(this.nodes, [200, 200]);
    // }
    energy() {
        return this.nodes.map(node => node.energy()).reduce((a, b) => a + b, 0);
    }
    step(stepSize) {
        this.nodes.forEach(node => node.computeForce());
        this.nodes.forEach(node => node.step(stepSize));
    }
    pushState() {
        this.nodes.forEach(node => node.pushState());
    }
    popState() {
        this.nodes.forEach(node => node.popState());
    }
    discardState() {
        this.nodes.forEach(node => node.discardState());
    }
    localOptimize(maxIterations = 1000, minStepSize = 1e-3) {
        let iterations = 0;
        let stepSize = 1;
        while (iterations < maxIterations) {
            let newEnergy;
            let energy;
            do {
                if (stepSize < minStepSize) {
                    return;
                }
                energy = this.energy();
                this.pushState();
                this.step(stepSize);
                newEnergy = this.energy();
                if (newEnergy > energy)
                    this.popState();
                else
                    this.discardState();
                stepSize = stepSize * (newEnergy < energy ? 1.2 : 0.8);
                iterations++;
            } while (newEnergy > energy);
        }
    }
    static fromPlanarKnot(knot, subdivisions) {
        return planar_knot_1.map(knot, () => new Crossing(), (anchor, crossing) => (Object.assign(Object.assign({}, anchor), { crossing })), (arc, begin, end) => new Arc(begin, end, subdivisions), (knot, crossings, arcs) => new PlanarSpringKnot(crossings, arcs));
    }
    static fromPlanarPolyKnot(knot, subdivisions) {
        return planar_knot_1.map(knot, crossing => {
            const newCrossing = new Crossing();
            newCrossing.location = crossing.location;
            return newCrossing;
        }, (anchor, crossing) => (Object.assign(Object.assign({}, anchor), { crossing })), (arc, begin, end) => {
            const newArc = new Arc(begin, end, subdivisions * (arc.path.length + 1) - 1);
            const fullPath = [
                arc.begin.crossing.location,
                ...arc.path,
                arc.end.crossing.location
            ];
            // interpolate the nodes along the existing path
            for (let i = 0; i < fullPath.length - 1; i++) {
                for (let j = 0; j < subdivisions; j++) {
                    if (i * subdivisions + j < newArc.nodes.length) {
                        newArc.nodes[i * subdivisions + j].location = lin_1.lerp(fullPath[i], fullPath[i + 1], (j + 1) / subdivisions);
                    }
                }
            }
            return newArc;
        }, (knot, crossings, arcs) => new PlanarSpringKnot(crossings, arcs));
    }
}
exports.PlanarSpringKnot = PlanarSpringKnot;


/***/ }),

/***/ "./src/renderers/canvas/poly-knot-diagram.ts":
/*!***************************************************!*\
  !*** ./src/renderers/canvas/poly-knot-diagram.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lin_1 = __webpack_require__(/*! ../../utils/lin */ "./src/utils/lin.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/renderers/canvas/utils.ts");
function drawKnot(ctx, knot, opts) {
    const { gap } = Object.assign({ gap: 20 }, (opts || {}));
    knot.arcs.forEach(arc => {
        const fullPath = [
            ...(arc.begin ? [arc.begin.crossing.location] : []),
            ...arc.path.filter(
            // filter out points in path that are too close to the endpoints
            v => !arc.begin ||
                !arc.end ||
                ((arc.begin.strand == "upper" ||
                    lin_1.dist(v, arc.begin.crossing.location) >= gap) &&
                    (arc.end.strand == "upper" ||
                        lin_1.dist(v, arc.end.crossing.location) >= gap))),
            ...(arc.end ? [arc.end.crossing.location] : [])
        ];
        const startPoint = arc.begin && arc.begin.strand == "lower"
            ? lin_1.shiftToward(fullPath[0], fullPath[1], gap)
            : fullPath[0];
        const endPoint = arc.end && arc.end.strand == "lower"
            ? lin_1.shiftToward(fullPath[fullPath.length - 1], fullPath[fullPath.length - 2], gap)
            : fullPath[fullPath.length - 1];
        const gapPath = [startPoint, ...fullPath.slice(1, -1), endPoint];
        ctx.beginPath();
        utils_1.quadraticBSpline(ctx, gapPath);
        // polyline(ctx, gapPath);
        // ctx.arc(endPoint[0], endPoint[1], 5, 0, 2 * Math.PI);
        ctx.stroke();
    });
}
exports.drawKnot = drawKnot;


/***/ }),

/***/ "./src/renderers/canvas/utils.ts":
/*!***************************************!*\
  !*** ./src/renderers/canvas/utils.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const lin_1 = __webpack_require__(/*! ../../utils/lin */ "./src/utils/lin.ts");
function quadraticSegment(ctx, p1, p2, p3) {
    ctx.moveTo(...p1);
    ctx.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]);
}
exports.quadraticSegment = quadraticSegment;
function quadraticBSplineSegment(ctx, p1, p2, p3, p4, p5) {
    const q1 = lin_1.lerp(p1, p2, 0.5);
    const q2 = lin_1.lerp(p2, p3, 0.5);
    const q3 = lin_1.lerp(p3, p4, 0.5);
    const q4 = lin_1.lerp(p4, p5, 0.5);
    const r1 = lin_1.lerp(q1, q2, 0.5);
    const r2 = lin_1.lerp(q2, q3, 0.5);
    const r3 = lin_1.lerp(q3, q4, 0.5);
    const s1 = lin_1.lerp(r1, r2, 0.5);
    const s2 = lin_1.lerp(r2, r3, 0.5);
    quadraticSegment(ctx, s1, r2, s2);
}
exports.quadraticBSplineSegment = quadraticBSplineSegment;
function quadraticBSpline(ctx, path) {
    const augPath = [
        path[0],
        path[0],
        path[0],
        ...path,
        path[path.length - 1],
        path[path.length - 1],
        path[path.length - 1]
    ];
    for (let i = 0; i + 4 < augPath.length; i++) {
        quadraticBSplineSegment(ctx, augPath[i], augPath[i + 1], augPath[i + 2], augPath[i + 3], augPath[i + 4]);
    }
}
exports.quadraticBSpline = quadraticBSpline;
function polyline(ctx, path) {
    ctx.moveTo(...path[0]);
    path.slice(1).forEach(v => ctx.lineTo(...v));
}
exports.polyline = polyline;


/***/ }),

/***/ "./src/renderers/react/poly-knot-diagram-canvas.tsx":
/*!**********************************************************!*\
  !*** ./src/renderers/react/poly-knot-diagram-canvas.tsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const poly_knot_diagram_1 = __webpack_require__(/*! ../canvas/poly-knot-diagram */ "./src/renderers/canvas/poly-knot-diagram.ts");
class PolyKnotDiagramCanvas extends React.Component {
    constructor() {
        super(...arguments);
        this.canvas = React.createRef();
    }
    componentDidMount() {
        const { knot, gap } = this.props;
        const ctx = this.canvas.current.getContext("2d");
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        poly_knot_diagram_1.drawKnot(ctx, knot, { gap });
    }
    render() {
        const { width, height } = this.props;
        return React.createElement("canvas", { ref: this.canvas, width: width, height: height });
    }
}
exports.PolyKnotDiagramCanvas = PolyKnotDiagramCanvas;
PolyKnotDiagramCanvas.defaultProps = {
    gap: 20
};


/***/ }),

/***/ "./src/utils/lin.ts":
/*!**************************!*\
  !*** ./src/utils/lin.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isVector2(v) {
    return (Array.isArray(v) &&
        v.length == 2 &&
        typeof v[0] === "number" &&
        typeof v[1] === "number");
}
exports.isVector2 = isVector2;
function scl(s, [x, y]) {
    return [s * x, s * y];
}
exports.scl = scl;
function add([x1, y1], [x2, y2]) {
    return [x1 + x2, y1 + y2];
}
exports.add = add;
function sub([x1, y1], [x2, y2]) {
    return [x1 - x2, y1 - y2];
}
exports.sub = sub;
function norm([x, y]) {
    return Math.sqrt(x * x + y * y);
}
exports.norm = norm;
function normalize(v) {
    return scl(1 / norm(v), v);
}
exports.normalize = normalize;
function dist(a, b) {
    return norm(sub(a, b));
}
exports.dist = dist;
function shiftToward(v, target, r) {
    return add(v, scl(r, normalize(sub(target, v))));
}
exports.shiftToward = shiftToward;
function lerp(a, b, t) {
    return add(scl(1 - t, a), scl(t, b));
}
exports.lerp = lerp;
function matrix(array) {
    return {
        m11: array[0][0],
        m12: array[0][1],
        m13: array[0][2],
        m21: array[1][0],
        m22: array[1][1],
        m23: array[1][2],
        m31: array[2][0],
        m32: array[2][1],
        m33: array[2][2]
    };
}
exports.matrix = matrix;
exports.id = () => matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);
exports.scale = (s) => matrix([
    [s, 0, 0],
    [0, s, 0],
    [0, 0, 1]
]);
exports.translate = ([x, y]) => matrix([
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1]
]);
function dot(a, b) {
    if (isVector2(b)) {
        const m = a;
        const v = b;
        const w = [
            m.m11 * v[0] + m.m12 * v[1] + m.m13,
            m.m21 * v[0] + m.m22 * v[1] + m.m23,
            m.m31 * v[0] + m.m32 * v[1] + m.m33
        ];
        return [w[0] / w[2], w[1] / w[2]];
    }
    else {
        return {
            m11: a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31,
            m12: a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32,
            m13: a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33,
            m21: a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31,
            m22: a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32,
            m23: a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33,
            m31: a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31,
            m32: a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32,
            m33: a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33
        };
    }
}
exports.dot = dot;


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function assert(clause) {
    if (!clause)
        throw new Error("Assertion failed");
}
exports.assert = assert;


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ })

/******/ });
//# sourceMappingURL=main.js.map