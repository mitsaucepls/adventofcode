package main

import (
	"fmt"
	"github.com/mitsaucepls/advent-of-code-utils/utils"
	"strings"
)

func main() {
	input, err := getAndParseInput()
	if err != nil {
		panic(err)
	}

	// for _, row := range input {
	//     fmt.Println(string(row))
	// }

	result := solveCrossPuzzle(input)
	fmt.Println(result)
}

func getAndParseInput() ([][]rune, error) {
	input, err := utils.GetInput(4, 2024)
	if err != nil {
		return nil, err
	}
	// input := `MMMSXXMASM
	// MSAMXMSMSA
	// AMXSXMAAMM
	// MSAMASMSMX
	// XMASAMXAMM
	// XXAMMXXAMA
	// SMSMSASXSS
	// SAXAMASAAA
	// MAMMMXMMMM
	// MXMXAXMASX`

	var parsedInput [][]rune

	for i, line := range strings.Split(input, "\n") {
		if line == "" {
			continue
		}
		parsedInput = append(parsedInput, make([]rune, len(line)))
		for j, rune := range line {
			parsedInput[i][j] = rune
		}
	}

	return parsedInput, nil
}

func solvePuzzle(input [][]rune, toFind string) int {
	result := 0
	directions := []struct {
		directionx int
		directiony int
	}{
		{0, 1}, {1, 0}, {0, -1}, {-1, 0}, // right up left down
		{1, 1}, {-1, -1}, {-1, 1}, {1, -1}, // upright downleft downright upleft
	}
	// Why are there no cool iterators like in rust
	// Is that what is called a pyramid scheme
	for y, row := range input {
		// fmt.Println(row)
		for x := range row {
			for _, direction := range directions {
				// fmt.Println(direction)
				passed := true
				for i, char := range toFind {
					flexY := y + direction.directiony*i
					flexX := x + direction.directionx*i
					// fmt.Printf("flexY: %d   flexX: %d\n", flexY, flexX)
					if flexY >= 0 && flexY < len(input) && flexX >= 0 && flexX < len(input[0]) {
						if input[flexY][flexX] == rune(char) {
							fmt.Printf("Was true for flexY: %d   flexX: %d\n with input %c in comparison to %c\n", flexY, flexX, input[flexY][flexX], rune(char))
							continue
						} else {
							passed = false
							break
						}
					} else {
						passed = false
						break
					}
				}
				if passed {
					result++
				}
			}
		}
	}

	return result
}

func solveCrossPuzzle(input [][]rune) int {
	result := 0

	for y := 0; y < len(input); y++ {
		for x := 0; x < len(input[0]); x++ {
			// downleft to upright
			if (y+2 < len(input) && x+2 < len(input[0])) &&
				((input[y][x] == rune('M') && input[y+1][x+1] == rune('A') && input[y+2][x+2] == rune('S')) ||
					(input[y][x] == rune('S') && input[y+1][x+1] == rune('A') && input[y+2][x+2] == rune('M'))) {

				// downright to upleft
				if (x+2 < len(input[0]) && y+2 < len(input)) &&
					((input[y][x+2] == rune('M') && input[y+1][x+1] == rune('A') && input[y+2][x] == rune('S')) ||
						(input[y][x+2] == rune('S') && input[y+1][x+1] == rune('A') && input[y+2][x] == rune('M'))) {
					result++
				}
			}
		}
	}

	return result
}
