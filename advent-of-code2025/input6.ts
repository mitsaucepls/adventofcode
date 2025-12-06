import { getInput } from "./utils.ts"

const puzzle_input = await getInput(6, 2025)

type Worksheet = {
  nums: number[]
  operator: "+" | "*" | undefined
}

function calculate_worksheet(worksheet: Worksheet): number {
  switch (worksheet.operator) {
    case '+':
      return worksheet.nums.reduce((prev, curr) => { return prev + curr }, 0)
    case "*":
      return worksheet.nums.reduce((prev, curr) => { return prev * curr }, 1)
    case undefined:
      throw new Error("Not initialized yet")
  }
}

function one(puzzle_input: string): number {

  // there are 5 rows
  const rows = puzzle_input.trim().split("\n")
  let result = 0

  const worksheets: Worksheet[] = []

  for (let i = 0; i < rows.length; i++) {
    const split_row = rows[i].split(/ +/)
    for (let j = 0; j < split_row.length; j++) {
      if (!worksheets[j]) {
        worksheets[j] = { nums: [], operator: undefined }
      }
      if (split_row[0] === '+' || split_row[0] === '*') {
        worksheets[j].operator = split_row[j] as "+" | "*"
      } else {
        worksheets[j].nums.push(Number(split_row[j]))
      }
    }
  }

  for (const worksheet of worksheets) {
    console.log(worksheet)
    const tmpResult = calculate_worksheet(worksheet)
    console.log(tmpResult)
    result += tmpResult
  }

  return result
}

function two(puzzle_input: string): number {

  // there are 5 rows
  const rows = puzzle_input.split("\n")
  let result = 0

  const worksheets: Worksheet[] = []

  const rowl = rows[0].length

  let tmpArr: string[][] = []

  for (let ci = rowl - 1; ci >= 0; ci--) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowch = row[ci]

      // anchor end of number
      if (rowch === '+' || rowch === '*') {

        // manifest tmpArr to worksheet
        // here is a number like this:
        let nums: number[] = []
        for (let ti = 0; ti < tmpArr.length; ti++) {

          // whitespaces69whitespaces
          let tmpDigitArray = tmpArr[ti]
          if (tmpDigitArray) {
            tmpDigitArray = tmpDigitArray
              .filter((value) => {
                return typeof value === "string"
              })
            if (tmpDigitArray.length > 0) {
              const num = Number(tmpDigitArray
                .reduce((prev, curr) => {
                  return prev + curr
                }))
              if (num > 0) {
                nums.push(num)
              }
            }
          }
        }

        worksheets.push({ nums, operator: rowch })
        console.log(nums)
        console.log(rowch)
        tmpArr = []

      } else {

        if (!tmpArr[ci]) {
          tmpArr[ci] = []
        }

        tmpArr[ci].push(rowch)
      }

    }
  }

  for (const worksheet of worksheets) {
    const tmpResult = calculate_worksheet(worksheet)
    result += tmpResult
  }

  return result
}

console.log(one(puzzle_input))
console.log(two(puzzle_input))
