import { getInput } from "./utils.ts"

const puzzle_input =  await getInput(1, 2025)

function one(puzzle_input: string): number {
  const length = 100
  let start_number = 50
  let dial_points = 0

  const input_lines = puzzle_input.split("\n")
  console.log(input_lines)

  for (const line of input_lines) {
    const direction = line.charAt(0)
    const number = Number.parseInt(line.slice(1))
    // L is -
    // R is +
    if (direction === 'R') {
      start_number = (start_number + number) % length
    } else if (direction === 'L') {
      start_number = ((start_number - number) % length + length) % length
    }

    if (start_number === 0) {
      dial_points++
    }
  }
  return dial_points
}

function two(puzzle_input: string): number {
  const length = 100
  let start_number = 50
  let dial_points = 0

  const input_lines = puzzle_input.split("\n")
  console.log(input_lines)

  for (const line of input_lines) {
    const direction = line.charAt(0)
    const number = Number.parseInt(line.slice(1))
    // L is -
    // R is +
    if (direction === 'R') {
      const tmp_result = start_number + number
      const modulo_count = Math.abs(Math.floor(tmp_result / length))
      dial_points = dial_points + modulo_count

      console.log(start_number + " + " + number + " % " + length)
      start_number = (start_number + number) % length
      console.log(start_number)

      console.log("tmp: " + tmp_result)
      console.log(tmp_result / length)
      console.log("After floor: " + Math.floor(tmp_result / length))
      console.log("moduloc: " + modulo_count)

    } else if (direction === 'L') {
      const tmp_result = start_number - number
      let modulo_count = Math.floor(Math.abs(tmp_result / length))
      if (tmp_result <= 0 && start_number != 0) modulo_count++
      dial_points = dial_points + modulo_count

      console.log(start_number + " - " + number + " % " + length)
      start_number = ((start_number - number) % length + length) % length
      console.log(start_number)

      console.log("tmp: " + tmp_result)
      console.log(tmp_result / length)
      console.log("After floor: " + Math.floor(tmp_result / length))
      console.log("moduloc: " + modulo_count)
    }

    // if (start_number === 0) {
    //   dial_points++
    // }
  }
  return dial_points
}

console.log(one(puzzle_input))
console.log(two(puzzle_input))
