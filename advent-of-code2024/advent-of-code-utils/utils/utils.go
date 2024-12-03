package utils

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
)

func GetInput(day uint, year uint) (string, error) {
	client := &http.Client{}

	url := fmt.Sprintf("https://adventofcode.com/%d/day/%d/input", year, day)
	envVar := fmt.Sprintf("SESSION_COOKIE_%d", year)
	sessionCookie, exists := os.LookupEnv(envVar)
	if !exists {
		return "", fmt.Errorf("no session cookie found with var: %s", envVar)
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}

	req.Header.Set("cookie", sessionCookie)

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %w", err)
	}

	return string(body), nil
}

func ParseStrSlice2IntSlice(strSlice []string) ([]int, error) {
    intSlice := make([]int, len(strSlice))

    for i, str := range strSlice {
        parsedStr, err := strconv.Atoi(str)
        if err != nil {
            return nil, err
        }

        intSlice[i] = parsedStr

    }

    return intSlice, nil
}

