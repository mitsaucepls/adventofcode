package main

import (
	"fmt"
	"regexp"
	"structs"

	// "github.com/mitsaucepls/advent-of-code-utils/utils"
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

	result := printerRules(input)
	fmt.Println(result)
}

func getAndParseInput() ([]Rule, []int, error) {
	// input, err := utils.GetInput(5, 2024)
	// if err != nil {
	// 	return nil, nil, err
	// }
	input := `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`

    rule := regexp.MustCompile(`(\d+)`)
    splitStr := strings.Split(input, "\n\n")
    findgrps(splitStr[0])
    findgrps(splitStr[1])
    profit

	return parsedInput, nil, nil
}

type Rule struct {
    big int
    smoll int
}

func printerRules() []int {
    meows = []
    for update in updates:
        for rule in rules:
            getIndex(update, rule[0])
            getIndex(update, rule[1])
            if ! index1 > index2
                break

        meow = update.get(update.len / 2 + 1)

    return meows
}
