import { getInput } from "./utils.ts"

const puzzle_input =  await getInput(4, 2025)

function one(puzzle_input: string): number {

  const rows = puzzle_input.trim().split("\n")
  let result = 0

  const shelf_map: string[][] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    shelf_map.push([])
    for (const roll_slot of row) {
      shelf_map[i].push(roll_slot)
    }
  }

  for (let i = 0; i < shelf_map.length; i++) {
    for (let j = 0; j < shelf_map[i].length; j++) {
      if (shelf_map[i][j] === '@') {
        if (check_adjacent_slots(shelf_map, {y: i, x: j} as Coordinate) < 4) {
          result++
        }
      }
    }
  }


  return result
}

function two(puzzle_input: string): number {

  const rows = puzzle_input.trim().split("\n")
  let result = 0

  const shelf_map: string[][] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    shelf_map.push([])
    for (const roll_slot of row) {
      shelf_map[i].push(roll_slot)
    }
  }

  let result_growth = -1

  while (result_growth != 0) {
    result_growth = 0
    const tmp_result = result
    for (let i = 0; i < shelf_map.length; i++) {
      for (let j = 0; j < shelf_map[i].length; j++) {
        if (shelf_map[i][j] === '@') {
          if (check_adjacent_slots(shelf_map, {y: i, x: j} as Coordinate) < 4) {
            shelf_map[i][j] = '.'
            result++
          }
        }
      }
    }
    result_growth = result - tmp_result
  }


  return result
}

type Coordinate = {
  y: number,
  x: number
}

const top_left: Coordinate = {y: -1, x: -1}
const top_top: Coordinate = {y: -1, x: 0}
const top_right: Coordinate = {y: -1, x: 1}
const mid_left: Coordinate = {y: 0, x: -1}
const mid_right: Coordinate = {y: 0, x: 1}
const bot_left: Coordinate = {y: 1, x: -1}
const bot_bot: Coordinate = {y: 1, x: 0}
const bot_right: Coordinate = {y: 1, x: 1}

const adjacent_edges: Coordinate[] = [top_left, top_top, top_right, mid_left, mid_right, bot_left, bot_bot, bot_right]

function check_adjacent_slots(shelf_map: string[][], coordinate: Coordinate): number {
  let hit: number = 0
  for (const adjacent_edge of adjacent_edges) {
    const coordinate_to_check_y = coordinate.y + adjacent_edge.y
    const coordinate_to_check_x = coordinate.x + adjacent_edge.x
    if (coordinate_to_check_y < 0 || coordinate_to_check_y >= shelf_map.length) {
      continue
    }

    if (coordinate_to_check_x < 0 || coordinate_to_check_x > shelf_map[0].length) {
      continue
    }

    if (shelf_map[coordinate_to_check_y][coordinate_to_check_x] === '@') {
      hit++
    }
  }

  return hit
}

console.log(one(puzzle_input))
console.log(two(puzzle_input))
