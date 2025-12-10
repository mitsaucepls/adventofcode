import { getInput } from "./utils.ts"

const puzzle_input = await getInput(9, 2025)

type Point = {
  x: number,
  y: number,
}

function area_calculation(pointA: Point, pointB: Point): number {
  return (Math.abs(pointA.x - pointB.x) + 1) * (Math.abs(pointA.y - pointB.y) + 1)
}

function getOtherEdges(pointA: Point, pointB: Point): { pointC: Point, pointD: Point } {
  const pointC: Point = { x: pointA.x, y: pointB.y }
  const pointD: Point = { x: pointB.x, y: pointA.y }

  // const pointC: Point = { x: Math.min(pointA.x, pointB.x), y: Math.min(pointA.y, pointB.y) }
  // const pointD: Point = { x: Math.max(pointA.x, pointB.x), y: Math.max(pointA.y, pointB.y) }

  return { pointC, pointD }
}

type PointAreaMap = {
  pointA: Point,
  pointB: Point,
  area: number,
}

function one(puzzle_input: string): number {
  const rows = puzzle_input.trim().split("\n")
  const points: Point[] = []
  for (const row of rows) {
    const nums = row.split(",")
    points.push({ x: Number(nums[0]), y: Number(nums[1]) })
  }

  const pointAreaMapCache: PointAreaMap[] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      // console.log("Difference between: " + print_point(points[i]) + " " + print_point(points[j]))
      const area = area_calculation(points[i], points[j])
      // console.log(distance)
      pointAreaMapCache.push({ pointA: points[i], pointB: points[j], area })
    }
  }

  pointAreaMapCache.sort((a, b) => {
    return a.area - b.area
  })


  return pointAreaMapCache[pointAreaMapCache.length - 1].area
}

function calculate_polygon_edges(points: Point[]): Point[] {
  // console.log("=== calculate_polygon_edges ===")
  // console.log("Input corners (order):", points)
  const green_edges: Point[] = []
  let j = points.length - 1
  for (let i = 0; i < points.length; i++) {
    const current = points[i]
    const previous = points[j]
    const ix = current.x
    const jx = previous.x
    const iy = current.y
    const jy = previous.y

    // console.log(`Edge ${j} -> ${i}`, {
    //   from: previous,
    //   to: current,
    // })

    green_edges.push(previous)

    if (ix === jx) {
      if (jy < iy) {
        // console.log("  Vertical edge, filling between y:", jy + 1, "and", iy - 1)
        for (let k = jy + 1; k < iy; k++) {
          const point = { x: ix, y: k }
          green_edges.push(point)
          // console.log("    added edge point:", point)
        }
      } else {
        // console.log("  Vertical edge, filling between y:", iy + 1, "and", jy - 1)
        for (let k = jy - 1; k > iy; k--) {
          const point = { x: ix, y: k }
          green_edges.push(point)
          // console.log("    added edge point:", point)
        }
      }
    } else if (iy === jy) {
      if (jx < ix) {
        // console.log("  Vertical edge, filling between y:", jx + 1, "and", ix - 1)
        for (let k = jx + 1; k < ix; k++) {
          const point = { x: k, y: iy }
          green_edges.push(point)
          // console.log("    added edge point:", point)
        }
      } else {
        // console.log("  Vertical edge, filling between y:", ix + 1, "and", jx - 1)
        for (let k = jx - 1; k > ix; k--) {
          const point = { x: k, y: iy }
          green_edges.push(point)
          // console.log("    added edge point:", point)
        }
      }
    }
    j = i
  }

  // console.log("All calculated edge points (excluding corners):", green_edges)
  // console.log("=== end calculate_polygon_edges ===")
  return green_edges
}

const INTERSECT_CACHE_LIMIT = 16_000_000
const intersect_cache: Map<string, boolean> = new Map()

function cacheKey(point: Point): string {
  return `${point.x},${point.y}`
}

function setCacheWithLimit(key: string, value: boolean) {
  if (intersect_cache.size >= INTERSECT_CACHE_LIMIT) {
    // Simple eviction to stop the Map from growing without bound.
    intersect_cache.clear()
  }
  intersect_cache.set(key, value)
}

function point_in_polygon(point: Point, polygon: Point[]): boolean {
  // console.log("=== point_in_polygon debug ===")
  // console.log("Test point:", point)
  // if (polygon.includes(point)) {
  const key = cacheKey(point)
  const hit = intersect_cache.get(key)
  if (hit !== undefined) return hit
  const { x, y } = point;
  let inside = false
  let j = polygon.length - 1


  // shoot a shot to the right
  // if the ray crosses an odd number of edges its inside
  // if the ray crosses an even number of edges its outside
  for (let i = 0; i < polygon.length; i++) {
    const { x: x1, y: y1 } = polygon[i]
    const { x: x2, y: y2 } = polygon[j]

    // console.log(`\nEdge ${j} -> ${i}`, { x1, y1, x2, y2 })

    const horizontal_fit = (y1 > y) !== (y2 > y)
    // console.log("  horizontal_fit:", horizontal_fit, "for y =", y)

    const t = (y - y1) / (y2 - y1)
    // console.log("  t:", `(${y} - ${y1}) / (${y2} - ${y1})`, "=", t)

    // X(t) = x1 + t * (x2 - x1)
    const xt = x1 + t * (x2 - x1)
    // console.log("  xt:", `${x1} + ${t} * (${x2} - ${x1})`, "=", xt)
    const intersect = horizontal_fit && x < xt

    // console.log("  intersect:", intersect, "for x =", x)

    if (intersect) {
      inside = !inside
      // console.log("  -> toggling inside, now:", inside)
    } else {
      // console.log("  -> no toggle, inside stays:", inside)
    }

    j = i
  }
  // console.log("Final inside:", inside)
  // console.log("=== end point_in_polygon debug ===")

  setCacheWithLimit(key, inside)
  return inside
}


function two(puzzle_input: string): number {
  const rows = puzzle_input.trim().split("\n")
  const points: Point[] = []

  for (const row of rows) {
    const nums = row.split(",")
    points.push({ x: Number(nums[0]), y: Number(nums[1]) })
  }
  const new_points = calculate_polygon_edges(points)
  for (const point of new_points) {
    setCacheWithLimit(cacheKey(point), true)
  }

  const pointAreaMapCache: PointAreaMap[] = []
  for (let i = 0; i < points.length; i++) {
    console.log("i:", points.length - i - 1)
    console.log("cache size:", intersect_cache.size)
    for (let j = i + 1; j < points.length; j++) {
      const pointA = points[i]
      const pointB = points[j]
      const { pointC, pointD } = getOtherEdges(pointA, pointB)
      const corners = [pointA, pointC, pointB, pointD]
      const edges = calculate_polygon_edges(corners)
      if (edges.every((point) => {
        // console.log(point)
        // console.log(point_in_polygon(point, new_points))
        return point_in_polygon(point, points)
      })) {
        const area = area_calculation(pointA, pointB)
        pointAreaMapCache.push({ pointA, pointB, area })
      }
    }
  }

  pointAreaMapCache.sort((a, b) => {
    return a.area - b.area
  })


  // const {pointA, pointB} = pointAreaMapCache[pointAreaMapCache.length - 1]
  // const { pointC, pointD } = getOtherEdges(pointA, pointB)
  // const corners = [pointA, pointC, pointB, pointD]
  // console.log(corners)
  // const edges = calculate_polygon_edges(corners)
  // console.log(edges)

  // edges.every((point) => {
  //   // console.log(point)
  //   // console.log(point_in_polygon(point, new_points))
  //   return point_in_polygon(point, new_points)
  // })
  console.log(pointAreaMapCache[pointAreaMapCache.length - 1])
  return pointAreaMapCache[pointAreaMapCache.length - 1].area
}

console.log(one(puzzle_input))
console.log(two(puzzle_input))
