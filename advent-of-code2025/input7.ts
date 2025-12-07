import { getInput } from "./utils.ts"

const puzzle_input =  await getInput(7, 2025)

function one(puzzle_input: string): number {

  const rows = puzzle_input.trim().split("\n")
  let result = 0

  const row_map: string[][] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    for (let j = 0; j < row.length; j++) {
      if (!row_map[i]) {
        row_map[i] = []
      }

      row_map[i].push(row[j])
    }
  }

  // Horizontal Important Indicies of the previous row
  let hii: number[] = []

  for (let i = 0; i < row_map.length; i++) {
  // Horizontal Important Indicies of the current row
    let hiic: number[] = []

    if (i === 1 && !(hii.length > 0)) {
      throw new Error("No starting point")
    }

    const row = row_map[i]

    if (i === 0) {
      for (let j = 0; j < row.length; j++) {
        const char = row[j]
        if (char === 'S') {
          hiic.push(j)
        }
      }
    }


    if (i > 0) {
      for (let j = 0; j < hii.length; j++) {
        const current_important_char = row[hii[j]]
        if (current_important_char === '.') {
          row[hii[j]] = "|"
          hiic.push(hii[j])
        }

        if (current_important_char === '^') {
          result++
          hiic.push(hii[j] - 1)
          hiic.push(hii[j] + 1)
        }
      }
    }

    hii = hiic
  }

  return result
}

type Coordinate = {
  y: number,
  x: number
}

type Cache = {
  coordinate: Coordinate
  value: number
}

function cacheLookup(cache: Cache[], coordinate: Coordinate): number {
  for (const kv of cache) {
    if (kv.coordinate.x === coordinate.x && kv.coordinate.y === coordinate.y) {
      return kv.value
    }
  }

  return -1
}

function two(puzzle_input: string): number {
  // mathmatically not solvable for me
  // so I have to do it recursively

  const rows = puzzle_input.trim().split("\n")
  const row_map: string[][] = []
  let cache: Cache[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    for (let j = 0; j < row.length; j++) {
      if (!row_map[i]) {
        row_map[i] = []
      }

      row_map[i].push(row[j])
    }
  }

  return kawaii_kaiwai_efficient(row_map, [], 0, cache)
}

function kawaii_kaiwai_efficient(row_map: string[][], hii: number[], row_index: number, cache: Cache[]): number {
  let left = 0
  let right = 0
  for (row_index; row_index < row_map.length; row_index++) {
    // Horizontal Important Indicies of the current row
    let hiic: number[] = []

    if (row_index === 1 && !(hii.length > 0)) {
      throw new Error("No starting point")
    }

    const row = row_map[row_index]

    if (row_index === 0) {
      for (let j = 0; j < row.length; j++) {
        const char = row[j]
        if (char === 'S') {
          hiic.push(j)
        }
      }
    }


    if (row_index > 0) {
      for (let j = 0; j < hii.length; j++) {
        const current_important_char = row[hii[j]]
        if (current_important_char === '.') {
          row[hii[j]] = "|"
          hiic.push(hii[j])
        }

        if (current_important_char === '^') {
          const hiicl = [...hiic]
          const hiicr = [...hiic]
          const hiiL = hii[j] - 1
          const hiiR = hii[j] + 1
          const next_index = row_index + 1
          const coordL = {y: next_index, x: hiiL}
          const coordR = {y: next_index, x: hiiR}

          hiicl.push(hiiL)

          left = cacheLookup(cache, coordL)
          // print_row_map(row_map)
          if (left === -1) {
            const row_mapL = row_map.map(row => [...row]);
            left = kawaii_kaiwai_efficient(row_mapL, hiicl, next_index, cache)
            cache.push({coordinate: coordL, value: left})
          } else {
            console.log("HIT")
          }

          hiicr.push(hiiR)
          right = cacheLookup(cache, coordR)
          if (right === -1) {
            const row_mapR = row_map.map(row => [...row]);
            right = kawaii_kaiwai_efficient(row_mapR, hiicr, next_index, cache)
            cache.push({coordinate: coordR, value: right})
          } else {
            console.log("HIT")
          }
        }
      }
    }

    hii = hiic
  }

  if (row_map[row_map.length - 1].includes("|")) {
    return 1
  }

  return left + right
}

function print_row_map(row_map: string[][]) {
  let map: string = ""
  for (let i = 0; i < row_map.length; i++) {
    map += row_map[i].join("") + '\n'
  }

  console.log(map)
}


console.log(one(puzzle_input))
console.log(two(puzzle_input))
