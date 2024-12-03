package main

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/dlclark/regexp2"
	"github.com/mitsaucepls/advent-of-code-utils/utils"
)


func main() {
    input := getAndParseInput()
    // for _, match := range matches {
    //     match = match[1:]
    //     match, err := utils.ParseStrSlice2IntSlice(match)
    //     if err != nil {
    //         panic(err)
    //     }
    //     result += uint(match[0]) * uint(match[1])
    // }
    result := iteratively(input)

    fmt.Println(result)
}

func getAndParseInput() string {
    input, err := utils.GetInput(3, 2024)
    if err != nil {
        panic(err)
    }

    cleanedInput := strings.ReplaceAll(input, "\r", "")
    cleanedInput = strings.ReplaceAll(cleanedInput, "\n", "")
    arsehole := "don't()"
    input = fmt.Sprintf("%s%s", cleanedInput, arsehole)
    fmt.Println(input)

    // input := "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5)don't())"

    // // fmt.Println(input)

    // re := regexp.MustCompile(`mul\((\d+),(\d+)\)`)
    // matches := re.FindAllStringSubmatch(input, -1)
    // // fmt.Println(matches)

    return input

}

func iteratively(input string) int {
    // dontIndex := strings.Index(input, "don't()")
    // doIndex := strings.Index(input, "do()")
    // re := regexp.MustCompile(`mul\((\d+),(\d+)\)`)
    // matchIndex := re.FindStringIndex(input)[0]

    // if dontIndex == -1 || doIndex == -1 || matchIndex == -1 {
    //     return matches
    // }

    // dontDiff := 0
    // doDiff := 0
    // if dontIndex < matchIndex {
    //     dontDiff = matchIndex - dontIndex
    // }

    // if doIndex < matchIndex {
    //     doDiff = matchIndex - doIndex
    // }

    // if dontDiff > doDiff {
    //     iteratively(inputwithout, matches)
    // } else {
    //     iteratively(inputaftermatch, matches.add(match))
    // }
    pattern := `(?<=do\(\))(.*?mul\(\d+,\d+\).*?)(?=don't\(\))`
    re2 := regexp2.MustCompile(pattern, regexp2.None)

	// Match all occurrences
	var matches []string
	match, _ := re2.FindStringMatch(input)
	for match != nil {
		matches = append(matches, match.String())
		match, _ = re2.FindNextMatch(match)
	}

    fmt.Println(matches)

    var result int
    re := regexp.MustCompile(`mul\((\d+),(\d+)\)`)
    fmt.Println(len(matches))
    for _, match := range matches {
        match_temp := re.FindAllStringSubmatch(match, -1)
        // fmt.Println(match_temp)
        for _, number := range match_temp {
            number = number[1:]
            fmt.Println(number)
            number, err := utils.ParseStrSlice2IntSlice(number)
            if err != nil {
                panic(err)
            }
            result += number[0] * number[1]
        }
    }

    return result
}

