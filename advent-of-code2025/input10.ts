import { isNumberObject } from "util/types"
import { getInput } from "./utils.ts"

const puzzle_input = await getInput(10, 2025)

type ManualPage = {
  desiredState: boolean[],
  buttons: boolean[][],
  joltages: number[]
  steps: number
}

type Button = {
  button: number[],
  size: number
}

type ManualPage2 = {
  desiredState: boolean[],
  buttons: Button[],
  joltages: number[]
  steps: number
}

function states_equal(state1: boolean[], state2: boolean[]) {
  return state1.length === state2.length && state1.every((bool, i) => {
    return bool === state2[i]
  })
}

function states_equal2(state1: number[], state2: number[]) {
  return state1.length === state2.length && state1.every((num, i) => {
    return num === state2[i]
  })
}

function apply_button(state: boolean[], button: boolean[]): boolean[] {
  if (state.length !== button.length) {
    throw new Error("Cannot get applied")
  }

  const state_clone = [...state]

  for (let i = 0; i < state.length; i++) {
    if (button[i]) {
      state_clone[i] = !state[i]
    }
  }

  return state_clone
}

function apply_button2(state: number[], button: number[]): number[] {
  if (state.length !== button.length) {
    throw new Error("Cannot get applied")
  }

  const state_clone = [...state]

  for (let i = 0; i < state.length; i++) {
    if (button[i]) {
      state_clone[i] -= button[i]
    }
  }

  return state_clone
}

function encodeNumState(state: number[]): string {
  return state.join(",")
}

function contains_state(buttons: boolean[][], state: boolean[]): boolean {
  for (const button of buttons) {
    if (states_equal(button, state)) return true
  }
  return false
}

function get_largest_buttons(buttons: Button[]): Button[] {
  const maxSize = Math.max(...buttons.map(b => b.size))
  return buttons.filter(b => b.size === maxSize)
}


function one(puzzle_input: string): number {
  const rows = puzzle_input.trim().split("\n")
  const manualPages: ManualPage[] = []
  for (const row of rows) {
    const desiredState: boolean[] = []
    const desiredStates = row.match(/\[(.*)\]/)
    if (desiredStates) {
      for (const state of desiredStates[0]) {
        if (state === '.') {
          desiredState.push(false)
        } else if (state === '#') {
          desiredState.push(true)
        }
      }
    }
    const buttons: boolean[][] = []
    const buttonMatches = row.matchAll(/\(([\d,]+)\)/gm)
    for (const buttonMatch of buttonMatches) {
      const button_values = buttonMatch[1].split(",").map((num) => {
        return Number(num)
      })
      const button: boolean[] = Array(desiredState.length).fill(false)
      for (const button_value of button_values) {
        button[button_value] = true
      }
      buttons.push(button)
    }
    manualPages.push({ desiredState, buttons, joltages: [], steps: -1 })
  }

  for (const page of manualPages) {
    solve_manual_page(page)
  }

  // const state: boolean[] = Array(manualPages[0].desiredState.length).fill(false)
  // apply_button(state, manualPages[0].buttons[0])
  // console.log(state)

  let result = 0
  for (const man of manualPages) {
    result += man.steps
  }

  return result
}

function two(puzzle_input: string): number {
  const rows = puzzle_input.trim().split("\n")
  const manualPages: ManualPage2[] = []
  for (const row of rows) {
    const desiredState: boolean[] = []
    const desiredStates = row.match(/\[(.*)\]/)
    if (desiredStates) {
      for (const state of desiredStates[0]) {
        if (state === '.') {
          desiredState.push(false)
        } else if (state === '#') {
          desiredState.push(true)
        }
      }
    }
    const buttons: Button[] = []
    const buttonMatches = row.matchAll(/\(([\d,]+)\)/gm)
    for (const buttonMatch of buttonMatches) {
      const button_values = buttonMatch[1].split(",").map((num) => {
        return Number(num)
      })
      const button: number[] = Array(desiredState.length).fill(0)
      for (const button_value of button_values) {
        button[button_value] = 1
      }
      buttons.push({ button, size: button_values.length })
    }
    let joltages: number[] = []
    const joltageMatches = row.matchAll(/{([\d,]+)}/gm)
    for (const joltageMatch of joltageMatches) {
      joltages = joltageMatch[1].split(",").map((num) => {
        return Number(num)
      })
    }
    manualPages.push({ desiredState, buttons, joltages, steps: -1 })
  }

  let result = 0
  for (let i = 0; i < manualPages.length; i++) {
    console.log(manualPages.length - i)
    result += solve_manual_page_jol(manualPages[i])
  }

  // const state: boolean[] = Array(manualPages[0].desiredState.length).fill(false)
  // apply_button(state, manualPages[0].buttons[0])
  // console.log(state)

  return result
}

function solve_manual_page(man: ManualPage) {
  const start: boolean[] = Array(man.desiredState.length).fill(false)
  // list of states for this loop
  let frontier: boolean[][] = [start]
  const visited: boolean[][] = [start]

  let steps: number = -1

  while (true) {
    steps++
    // list of states for the next loop
    const next_frontier: boolean[][] = []

    for (const state of frontier) {

      if (states_equal(state, man.desiredState)) {
        man.steps = steps
        return
      }

      for (const button of man.buttons) {
        const next = apply_button(state, button)
        if (!contains_state(visited, next)) {
          visited.push(next)
          next_frontier.push(next)
        }
      }
    }

    frontier = next_frontier
  }
}

// {3,5,4,7}
// 5 (1,3) | 4 (2,3) | 3 (0,2) | 3 (0,1) || (1,3)
// {3,0,4,2}
// 2 (2,3) | 3 (0,2) || (0,2)
// {0,0,1,2}
// 1 (2,3)
// {0,0,0,1}
// 1 (3)
function solve_manual_page_jol(man: ManualPage2) {
  let state: number[] = [...man.joltages]
  // // list of states for this loop
  // let frontier: number[][] = [start]
  // const visitedHashes = new Set<string>([encodeNumState(start)])
  let buttons = [...man.buttons]
  let steps: number = 0

  while (true) {
    const largest_buttons = get_largest_buttons(buttons)

    const { button, count } = find_best_button(largest_buttons, state)

    remove_button_from_buttons(button, buttons)

    console.log("button:", button, "Count:", count)

    // (1,2,3,4) (0,2,3,4) (1,2) (3,4) (0,4) (0,1) {27,23,36,29,31}
    //

    if (typeof button === 'undefined') {
      break
    }

    steps += count
    for (let i = 0; i < count; i++) {
      state = apply_button2(state, button.button)
      console.log(state)
    }

    if (state.reduce((prev, curr) => prev + curr) === 0) {
      break
    }
  }

  return steps
}

function remove_button_from_buttons(button: Button, buttons: Button[]) {
  const index_to_remove = buttons.findIndex(b => states_equal2(b.button, button.button))
  if (index_to_remove !== -1) {
    buttons.splice(index_to_remove, 1)
  }
}

function find_best_button(buttons: Button[], joltages: number[]): { button: Button, count: number } {
  const button_scores: number[] = []
  // console.log(buttons)

  for (const button of buttons) {
    const joltages_in_question: number[] = []
    for (let i = 0; i < joltages.length; i++) {
      if (button.button[i] === 1) {
        joltages_in_question.push(joltages[i])
      }
    }
    // console.log("Joltages:", joltages_in_question)
    // console.log("Button:", button)
    const min_joltage = joltages_in_question.length > 0 ? Math.min(...joltages_in_question) : -Infinity
    button_scores.push(min_joltage)
    // console.log("Button Scores:", button_scores)
  }

  let maxIndex = 0

  for (let i = 1; i < button_scores.length; i++) {
    if (button_scores[i] > button_scores[maxIndex]) {
      maxIndex = i
    }
  }
  return { button: buttons[maxIndex], count: button_scores[maxIndex] }
}

function contains_indicies(button: number[], indicies: number[]): boolean {
  const tmp_button = [...button]

  for (const index of indicies) {
    if (tmp_button[index] === 1) {
      tmp_button[index] = 0
    }
  }

  const does_not_overfit = !(tmp_button.reduce((prev, curr) => { return prev + curr }) > 0)
  // console.log("Button:", button, "does not overfit:", does_not_overfit)
  return does_not_overfit
}

function get_required_indicies(desired: number[], state: number[]): number[] {
  if (state.length !== desired.length) {
    throw new Error("Cannot get applied")
  }
  const required_indicies: number[] = []
  for (let i = 0; i < desired.length; i++) {
    if (state[i] < desired[i]) {
      required_indicies.push(i)
    }
  }

  return required_indicies
}

// console.log(one(puzzle_input))
console.log(two(puzzle_input))
