import { getInput } from "./utils.ts"

const puzzle_input =  await getInput(2, 2025)

function one(puzzle_input: string): number {

  const ranges = puzzle_input.split(",")
  let result = 0

  for (const range of ranges) {
    const split_range = range.split("-") // splits in 2

    const first = Number.parseInt(split_range[0])
    const second = Number.parseInt(split_range[1])

    for (let i = first; i <= second; i++) {
      const i_string = i.toString()
      if (i_string.length % 2 === 0) {
        const half_len = i_string.length / 2
        const first_i_string_slice = i_string.slice(0, half_len)
        const second_i_string_slice = i_string.slice(half_len)
        if (first_i_string_slice === second_i_string_slice) {
          console.log(i_string)
          console.log("first: " + first_i_string_slice)
          console.log("second: " + second_i_string_slice)
          result += Number.parseInt(first_i_string_slice + second_i_string_slice)
        }
      }
    }
  }
  return result
}

function two(puzzle_input: string): number {

  const ranges = puzzle_input.split(",")
  let result = 0

  for (const range of ranges) {
    const split_range = range.split("-") // splits in 2

    const first = Number.parseInt(split_range[0])
    const second = Number.parseInt(split_range[1])

    for (let i = first; i <= second; i++) {
      const i_string = i.toString()
      for (let j = i_string.length; j > 1; j--) {
        const i_even = even_split(i_string, j)
        if (i_even === null) continue

        if (i_even.every(element => element === i_even[0])) {
          console.log(j)
          console.log(i_even)
          console.log("hit")
          result += Number.parseInt(i_string)
          break
        }
      }
    }
  }
  return result
}

function even_split(str: string, parts: number): string[] | null {
  if (str.length % parts !== 0) return null
  const size = str.length / parts
  const out: string[] = []
  for (let i = 0; i < str.length; i += size) {
    out.push(str.slice(i, i + size))
  }
  return out;
}

console.log(one(puzzle_input))
console.log(two(puzzle_input))
