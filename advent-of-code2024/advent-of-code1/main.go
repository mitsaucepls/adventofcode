package main

import (
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/mitsaucepls/advent-of-code-utils/utils"
)

func main() {
    left, right, err := getAndParseInput()
    if err != nil {
        fmt.Println(err)
    }

    sort.Slice(left, func(i, j int) bool {
        return left[i] < left[j]
    })
    sort.Slice(right, func(i, j int) bool {
        return right[i] < right[j]
    })

    result := calculateDifference(left, right)
    fmt.Println(result)

    // fmt.Println(left)
    // fmt.Println(right)
}

func getAndParseInput() ([]uint, []uint, error) {
    input, err := utils.GetInput(1, 2024)
    if err != nil {
        return nil, nil, err
    }

    var left []uint
    var right []uint
    lines := strings.Split(input, "\n")
    re := regexp.MustCompile(`(\d+)\W+(\d+)`)

    for _, line := range lines {
        if line == "" {
            continue
        }

        matches := re.FindStringSubmatch(line)

        leftNum, err := strconv.Atoi(matches[1])
        if err != nil {
            return nil, nil, err
        }

        rightNum, err := strconv.Atoi(matches[2])
        if err != nil {
            return nil, nil, err
        }

        left = append(left, uint(leftNum))
        right = append(right, uint(rightNum))
    }

    return left, right, nil
}

func calculateDifference(left []uint, right []uint) uint {
    var result uint
    for i := 0; i < len(left); i++{
        leftNum := left[i]
        rightNum := right[i]
        var diff uint
        if leftNum > rightNum {
            diff = leftNum - rightNum
        } else {
            diff = rightNum - leftNum
        }
        // fmt.Printf("%d - %d = %d\n", leftNum, rightNum, diff)
        result += diff
    }
    return result
}
