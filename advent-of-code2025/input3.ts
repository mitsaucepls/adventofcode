import { getInput } from "./utils.ts"

const puzzle_input =  await getInput(3, 2025)

function one(puzzle_input: string): number {

  const banks = puzzle_input.trim().split("\n")
  let result = 0

  const jolts_map: string[][] = []
  for (let i = 0; i < banks.length; i++) {
    const bank = banks[i]
    jolts_map.push([])
    for (const jolt of bank) {
      jolts_map[i].push(jolt)
    }
  }

  const final_jolts: number[] = []
  // for (let i = 0; i < jolts_map.length; i++) {
  for (const jolts of jolts_map) {
    // get every combination
    const tmp_jolts: number[] = []
    for (let i = 0; i < jolts.length; i++) {
      for (let j = i + 1; j < jolts.length; j++) {
        tmp_jolts.push(Number.parseInt(jolts[i] + jolts[j]))
      }
    }
    console.log(jolts)
    console.log(tmp_jolts)
      final_jolts.push(tmp_jolts.sort().reverse()[0])
  }

  console.log(final_jolts)
  result = final_jolts.reduce((prev, curr) => prev + curr, 0)
  return result
}

function two(puzzle_input: string): number {

  const banks = puzzle_input.trim().split("\n")
  const length = 12
  let result = 0
  const final_jolts: number[] = []

  for (const bank of banks) {
    let drop = bank.length - length
    const stack: string[] = []

    for (const jolt of bank) {
      // if theres still numbers to drop, its not the first, its higher than the current rightest
      while (drop > 0 && stack.length > 0 && Number.parseInt(stack[stack.length - 1]) < Number.parseInt(jolt)) {
        stack.pop()
        drop--
      }
      stack.push(jolt)
    }

    final_jolts.push(Number.parseInt(stack.slice(0, length).join("")))
  }

  result = final_jolts.reduce((prev, curr) => prev + curr, 0)
  return result
}

console.log(one(puzzle_input))
console.log(two(puzzle_input))
