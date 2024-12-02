package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"github.com/mitsaucepls/advent-of-code-utils/utils"
)

func main() {
	input, err := getAndParseInput()
	if err != nil {
		panic(err)
	}

	result := findSafeValues(input)

	fmt.Println(result)
}

func getAndParseInput() ([][]int, error) {
	input, err := utils.GetInput(2, 2024)
	if err != nil {
	    return nil, err
	}
	// input := `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9
// `

	var parsedInput [][]int
	lines := strings.Split(input, "\n")
	re := regexp.MustCompile(`(\d+)`)

	for _, line := range lines {
		if line == "" {
			continue
		}
		matches := re.FindAllString(line, -1)
		// wtf is this why is there no map function in go?
		var parsedMatches []int
		for i := 0; i < len(matches); i++ {
			parsedMatch, err := strconv.Atoi(matches[i])
			if err != nil {
				panic(err)
			}
			parsedMatches = append(parsedMatches, parsedMatch)
		}
		parsedInput = append(parsedInput, parsedMatches)
	}

	return parsedInput, nil
}

func findSafeValues(input [][]int) int {
	var result int
	for _, report := range input {
		fmt.Printf("Checking: %v\n", report)
		asc := checkAscDescWithTolerance(report, 0, 1)
		var desc int
		if asc == 1 {
			desc = 0
		} else {
			desc = checkAscDescWithTolerance(report, 1, 0)
		}
		fmt.Printf("asc: %d   desc: %d\n\n", asc, desc)
		if asc == 1 || desc == 1 {
			result += 1
		}
	}
	return result
}

func checkAscDesc(list []int, asc int, desc int) int {
	copySlice := make([]int, len(list))
	copy(copySlice, list)
	for i := 1; i < len(copySlice); i++ {
		leftNum := copySlice[i-desc]
		rightNum := copySlice[i-asc]
		var diff int
		// fmt.Printf("%d. try\n", i)
		if leftNum < rightNum {
			if leftNum > rightNum {
				diff = leftNum - rightNum
			} else {
				diff = rightNum - leftNum
			}
			if diff > 3 {
				fmt.Printf("too high diff: %d on leftNum: %d   rightNum: %d\n", diff, leftNum, rightNum)
				return 0
			}
		} else {
			fmt.Printf("not leftNum: %d < rightNum: %d\n", leftNum, rightNum)
			return 0
		}
	}
	return 1
}

func checkAscDescWithTolerance(list []int, asc int, desc int) int {
    for i := 0; i < len(list); i++ {
        copySlice := make([]int, len(list))
        copy(copySlice, list)
        copySlice = removeIndexFromSlice(copySlice, uint(i))
        result := checkAscDesc(copySlice, asc, desc)
        if result == 1 {
            return 1
        }
    }
    return 0
}

func removeIndexFromSlice(list []int, index uint) []int {
	firstHalf := list[:index]
	secondHalf := list[index+1:]
	fmt.Printf("First half: %v, Second half: %v\n", firstHalf, secondHalf)
	cleanList := append(firstHalf, secondHalf...)
	return cleanList
}
