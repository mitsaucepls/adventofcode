import { getInput } from "./utils.ts"

const puzzle_input = await getInput(10, 2025)

type ManualPage = {
  desiredState: boolean[],
  buttons: boolean[][],
  joltages: number[]
  steps: number
}

function states_equal(state1: boolean[], state2: boolean[]) {
  return state1.length === state2.length && state1.every((bool, i) => {
    return bool === state2[i]
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

function contains_state(buttons: boolean[][], state: boolean[]): boolean {
  for (const button of buttons) {
    if (states_equal(button, state)) return true
  }
  return false
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

// function two(puzzle_input: string): number {
// }


console.log(one(puzzle_input))
// console.log(two(puzzle_input))
