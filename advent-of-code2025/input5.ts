import { getInput } from "./utils.ts"

const puzzle_input =  await getInput(5, 2025)

type Range = {
  from: number,
  to: number
}

function one(puzzle_input: string): number {

  const rows = puzzle_input.trim().split("\n")
  let result = 0

  let rangeRowers: Range[] = []

  let secondHalf: boolean = false
  for (const row of rows) {
    if (row === "") {
      secondHalf = true
    }

    if (!secondHalf) {
      const range = row.split("-")
      rangeRowers.push({from: Number(range[0]), to: Number(range[1])})
    } else {
      for (const rangeRower of rangeRowers) {
        if (isInRange(rangeRower, Number(row))) {
          result++
          break
        }
      }
    }
  }

  return result
}

function two(puzzle_input: string): number {

  const rows = puzzle_input.trim().split("\n")

  let result: number = 0
  let rangeRowers: Range[] = []

  for (const row of rows) {
    if (row === "") {
      break
    }

    const range = row.split("-")
    rangeRowers.push({from: Number(range[0]), to: Number(range[1])})

  }
  // sort by start
  rangeRowers.sort((a, b) => a.from - b.from)

  let start_from = rangeRowers[0].from
  let start_to = rangeRowers[0].to

  // we have to seperate overlap and no overlap
  for (let i = 0; i < rangeRowers.length; i++) {
    let {from, to} = rangeRowers[i]
    console.log("start range: { " + start_from + ", " + start_to + " }")
    console.log("next range: { " + from + ", " + to + " }")
    const overlaps = overlap({from: start_from, to: start_to}, {from, to})
    if(overlaps) {
      // if it overlaps we have to extend the range to the new end
      start_to = Math.max(start_to, to)
      console.log("overlaps! New end point is: " + start_to)
    } else {
      // otherwise they dont overlap and we can save the range to the result
      // and set the new starting range
      const range_to_save = start_to - start_from + 1
      result += range_to_save
      start_from = from
      start_to = to
      console.log("Does not overlap. Write current range into the result: +" + range_to_save)
    }

    if (i + 1 === rangeRowers.length && overlaps) {
      // if the last overlaps save it to the result aswell
      const range_to_save = start_to - start_from + 1
      console.log("Write current range into the result: +" + range_to_save)
      result += range_to_save
    }
  }


  return result
}

function overlap(rangeA: Range, rangeB: Range): boolean {
  // e.g.
  // 12-18
  // 16-20
  // 16 <= 18
  // This assumes that rangeA and rangeB are sorted by from
  //
  // Edge Case:
  // 10-14
  // 14-16
  // 14 <= 14

  return rangeB.from <= rangeA.to
}

function isInRange(range: Range, rower: number): boolean {
  return rower >= range.from && rower <= range.to
}



console.log(one(puzzle_input))
console.log(two(puzzle_input))
