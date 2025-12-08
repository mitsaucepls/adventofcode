import { getInput } from "./utils.ts"

const puzzle_input = await getInput(8, 2025)

type Point = {
  a: number,
  b: number,
  c: number,
}

type PointDistanceMap = {
  pointA: Point,
  pointB: Point,
  distance: number
}

function euclidean_distance(pointA: Point, pointB: Point): number {
  return Math.sqrt(Math.pow(pointA.a - pointB.a, 2) + Math.pow(pointA.b - pointB.b, 2) + Math.pow(pointA.c - pointB.c, 2))
}

function print_point(point: Point): string {
  return `{ ${point.a}, ${point.b}, ${point.c} }`
}

function addToCircuits(circuits: Point[][], pointA: Point, pointB: Point) {
  let pointAIndex: number = -1
  let pointBIndex: number = -1
  for (let i = 0; i < circuits.length; i++) {
    if (circuits[i].includes(pointA) && circuits[i].includes(pointB)) {
      console.log("pointA and pointB are already assigned")
      return
    }
    if (circuits[i].includes(pointA)) {
      pointAIndex = i
      console.log("Point A is now: " + i)
    }
    if (circuits[i].includes(pointB)) {
      pointBIndex = i
      console.log("Point B is now: " + i)
    }
  }

  if (pointAIndex !== -1 && pointBIndex !== -1) {
    console.log("both already have a circuit, lets merge")
    const keep = Math.min(pointAIndex, pointBIndex)
    const toDelete = Math.max(pointAIndex, pointBIndex)
    circuits[keep] = [...circuits[pointAIndex], ...circuits[pointBIndex]]
    circuits.splice(toDelete, 1)
  } else if (pointAIndex !== -1 && pointBIndex === -1) {
    console.log("pointA is assigned and pointB is not")
    circuits[pointAIndex].push(pointB)
  } else if (pointBIndex !== -1 && pointAIndex === -1) {
    console.log("pointB is assigned and pointA is not")
    circuits[pointBIndex].push(pointA)
  } else {
    console.log("pointA and pointB are not assigned yet")
    circuits[circuits.length] = []
    circuits[circuits.length - 1].push(pointA)
    circuits[circuits.length - 1].push(pointB)
  }
}

function one(puzzle_input: string): number {
  const rows = puzzle_input.trim().split("\n")
  const points: Point[] = []
  for (const row of rows) {
    const nums = row.split(",")
    points.push({ a: Number(nums[0]), b: Number(nums[1]), c: Number(nums[2]) })
  }

  const pointDistanceMapCache: PointDistanceMap[] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      // console.log("Difference between: " + print_point(points[i]) + " " + print_point(points[j]))
      const distance = euclidean_distance(points[i], points[j])
      // console.log(distance)
      pointDistanceMapCache.push({pointA: points[i], pointB: points[j], distance})
    }
  }

  pointDistanceMapCache.sort((a, b) => {
    return a.distance - b.distance
  })

  // console.log(pointDistanceMapCache)

  // const lpd = pointDistanceMapCache.reduce((prev, curr) => {
  //   if (curr.distance < prev.distance) {
  //     return curr
  //   }
  //   return prev
  // })

  const circuits: Point[][] = []
  for (let i = 0; i < 1000; i++) {
    console.log(circuits)
    console.log("Trying to add: " + print_point(pointDistanceMapCache[i].pointA) + " and " + print_point(pointDistanceMapCache[i].pointB) + " | " + pointDistanceMapCache[i].distance)
    addToCircuits(circuits, pointDistanceMapCache[i].pointA, pointDistanceMapCache[i].pointB)
  }


  circuits.sort((a, b) => {
    return a.length - b.length
  }).reverse()

  console.log(circuits)

  return circuits[0].length * circuits[1].length * circuits[2].length
}

function two(puzzle_input: string): number {
  const rows = puzzle_input.trim().split("\n")
  const points: Point[] = []
  for (const row of rows) {
    const nums = row.split(",")
    points.push({ a: Number(nums[0]), b: Number(nums[1]), c: Number(nums[2]) })
  }

  const pointDistanceMapCache: PointDistanceMap[] = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      // console.log("Difference between: " + print_point(points[i]) + " " + print_point(points[j]))
      const distance = euclidean_distance(points[i], points[j])
      // console.log(distance)
      pointDistanceMapCache.push({pointA: points[i], pointB: points[j], distance})
    }
  }

  pointDistanceMapCache.sort((a, b) => {
    return a.distance - b.distance
  })

  // console.log(pointDistanceMapCache)

  // const lpd = pointDistanceMapCache.reduce((prev, curr) => {
  //   if (curr.distance < prev.distance) {
  //     return curr
  //   }
  //   return prev
  // })

  const circuits: Point[][] = []
  for (let i = 0; i < pointDistanceMapCache.length; i++) {
    console.log(circuits)
    console.log("Trying to add: " + print_point(pointDistanceMapCache[i].pointA) + " and " + print_point(pointDistanceMapCache[i].pointB) + " | " + pointDistanceMapCache[i].distance)
    addToCircuits(circuits, pointDistanceMapCache[i].pointA, pointDistanceMapCache[i].pointB)

    if (circuits.length === 1) {
      let combined_length = 0
      for (const circuit of circuits) {
        combined_length += circuit.length
      }
      if (combined_length === points.length) {
        console.log(circuits)
        return pointDistanceMapCache[i].pointA.a * pointDistanceMapCache[i].pointB.a
      }
    }
  }


  circuits.sort((a, b) => {
    return a.length - b.length
  }).reverse()

  console.log(circuits)

  return circuits[0].length * circuits[1].length * circuits[2].length
}


// console.log(one(puzzle_input))
console.log(two(puzzle_input))
