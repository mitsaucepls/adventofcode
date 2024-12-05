package main

import (
	"fmt"
	"regexp"

	"github.com/mitsaucepls/advent-of-code-utils/utils"
	"strings"
)

func main() {
	rules, updates, err := getAndParseInput()
	if err != nil {
		panic(err)
	}
    for _, rule := range rules {
        fmt.Println(rule)
    }
    fmt.Println("Updates:")
    for _, update := range updates {
        fmt.Println(update)
    }

	results := printerRules(rules, updates)
    fmt.Printf("Result is: %v\n", results)
    result := 0
    for _, resultAttr := range results {
        result += resultAttr
    }
    fmt.Println(result)

}

func getAndParseInput() ([][]int, [][]int, error) {
	input, err := utils.GetInput(5, 2024)
	if err != nil {
		return nil, nil, err
	}
	// input := `47|53
// 97|13
// 97|61
// 97|47
// 75|29
// 61|13
// 75|53
// 29|13
// 97|29
// 53|29
// 61|53
// 97|53
// 61|29
// 47|13
// 75|47
// 97|75
// 47|61
// 75|61
// 47|29
// 75|13
// 53|13

// 75,47,61,53,29
// 97,61,53,29,13
// 75,29,13
// 75,97,47,61,53
// 61,13,29
// 97,13,75,29,47`

    // this form of parsing should go to hell
    re := regexp.MustCompile(`(\d+)`)
    splitStr := strings.Split(input, "\n\n")
    lines0 := strings.Split(splitStr[0], "\n")
    var rules [][]int
    for _, line := range lines0 {
        matches := re.FindAllStringSubmatch(line, -1)
        var rule []int
        for _, match := range matches {
            groups, err := utils.ParseStrSlice2IntSlice(match[1:])
            if err != nil {
                panic(err)
            }
            rule = append(rule, groups[0])
        }
        rules = append(rules, rule)
    }
    lines1 := strings.Split(splitStr[1], "\n")
    var updates [][]int
    for _, line := range lines1 {
        if line == "" {
            continue
        }
        matches := re.FindAllStringSubmatch(line, -1)
        var update []int
        for _, match := range matches {
            groups, err := utils.ParseStrSlice2IntSlice(match[1:])
            if err != nil {
                panic(err)
            }
            update = append(update, groups[0])
        }
        updates = append(updates, update)
    }

	return rules, updates, nil
}

func printerRules(rules [][]int, updates [][]int) []int {
    var results []int
    for _, update := range updates {
        isCorrect := true
        fmt.Printf("Update: %v\n", update)
        for _, rule := range rules {
            index1 := getIndex(update, rule[0])
            index2 := getIndex(update, rule[1])
            if index1 == -1 || index2 == -1 {
                continue
            }
            if !(index1 < index2) {
                isCorrect = false
            }
            // fmt.Printf("Rule: %v is: %t with those indicies: %d   %d\n", rule, isCorrect, index1, index2)
        }
        if isCorrect {
            // results = append(results, update[len(update) / 2])
        } else {
            for !isCorrect {
                for _, rule := range rules {
                    index1 := getIndex(update, rule[0])
                    index2 := getIndex(update, rule[1])
                    if index1 == -1 || index2 == -1 {
                        continue
                    }
                    moveElementToIndex(update, index2, index1)
                }
                isCorrect = true
                for _, rule := range rules {
                    index1 := getIndex(update, rule[0])
                    index2 := getIndex(update, rule[1])
                    if index1 == -1 || index2 == -1 {
                        continue
                    }
                    if !(index1 < index2) {
                        isCorrect = false
                    }
                }
                if isCorrect {
                    break
                }
            }
            fmt.Printf("Incorrect update is now: %v\n", update)
            results = append(results, update[len(update) / 2])
        }
    }
    return results
}

func moveElementToIndex(array []int, from int, to int) {
    for i := from; i < to; i++ {
        swapElements(array, i, i+1)
    }
}

func swapElements(array []int, from int, to int) {
    tmp := array[to]
    array[to] = array[from]
    array[from] = tmp
}

func getIndex(array []int, toSearch int) int {
    for i, element := range array {
        if element == toSearch {
            return i
        }
    }
    return -1
}
