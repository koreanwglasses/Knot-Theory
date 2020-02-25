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
function arcsAtCrossing(knot, crossing) {
    const adjacentArcs = knot.arcs.filter(arc => arc.end.crossing == crossing || arc.begin.crossing == crossing);
    if (adjacentArcs.length != 4) {
        throw new Error("invalid knot: each crossing must have exactly four arcs connected to it");
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
 * A crossing with references to anchors
 */
class Crossing {
    constructor() {
        const lower = {
            strand: "lower",
            crossing: this
        };
        const upper = {
            strand: "upper",
            crossing: this
        };
        this.lower = lower;
        this.upper = upper;
    }
}
exports.Crossing = Crossing;


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
}
exports.Crossing = Crossing;
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
const lin_1 = __webpack_require__(/*! ./utils/lin */ "./src/utils/lin.ts");
const knot = planar_poly_knot_1.trefoil();
const m = lin_1.dot(lin_1.translate([200, 200]), lin_1.scale(100));
planar_poly_knot_2.transform(knot, m);
ReactDOM.render(React.createElement(poly_knot_diagram_canvas_1.PolyKnotDiagramCanvas, { knot: knot, width: 400, height: 400 }), document.getElementById("react-root"));


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
function drawKnot(ctx, knot, opts) {
    const { gap } = Object.assign({ gap: 20 }, (opts || {}));
    knot.arcs.forEach(arc => {
        const fullPath = [
            arc.begin.crossing.location,
            ...arc.path.filter(
            // filter out points in path that are too close to the endpoints
            v => (arc.begin.strand == "upper" ||
                lin_1.dist(v, arc.begin.crossing.location) >= gap) &&
                (arc.end.strand == "upper" ||
                    lin_1.dist(v, arc.end.crossing.location) >= gap)),
            arc.end.crossing.location
        ];
        const startPoint = arc.begin.strand == "lower"
            ? lin_1.shiftToward(fullPath[0], fullPath[1], gap)
            : fullPath[0];
        const endPoint = arc.end.strand == "lower"
            ? lin_1.shiftToward(fullPath[fullPath.length - 1], fullPath[fullPath.length - 2], gap)
            : fullPath[fullPath.length - 1];
        ctx.beginPath();
        ctx.moveTo(...startPoint);
        fullPath.slice(1, -1).forEach(v => ctx.lineTo(...v));
        ctx.lineTo(...endPoint);
        ctx.stroke();
    });
}
exports.drawKnot = drawKnot;


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