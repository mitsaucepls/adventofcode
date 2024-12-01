use std::{collections::HashMap, str::Lines};

use regex::Regex;

#[tokio::main]
async fn main() {
    // let response = get_input(1).await;
    // match response {
    //     Ok(input) => {
    //         println!("{}", input);
    //         println!("{}", get_result(input));
    //     }
    //     Err(e) => println!("could not get input {}", e),
    // }
    get_result(String::from("oneight"));
}

async fn get_input(index: u32) -> Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let url = format!("https://adventofcode.com/2023/day/{}/input", index);
    println!("{}", url);

    let response = client
        .get(url)
        .header(
            "cookie",
            std::env::var("SESSION_COOKIE").expect("no session cookie found"),
        )
        .send()
        .await?
        .text()
        .await?;

    Ok(response)
}

fn get_result(input: String) -> u32 {
    let mut numbers_str: Vec<String> = Vec::new();
    let mut numbers: Vec<u32> = Vec::new();
    let lines = input.lines();
    let lines_vec = lines.map(|line| line.to_string()).collect();

    // replace text with number for lvl2
    let lines_replaced = replace_text_with_number(&lines_vec);
    // println!("{:?}", lines_replaced);

    for (i, line) in lines_replaced.iter().enumerate() {
        // println!("line actual: {}", lines_vec.get(i).expect("haram"));
        // println!("line: {}", line);
        for char in line.chars() {
            if char.is_digit(10) {
                // println!("char: {}", char);
                numbers_str.push(char.to_string());
            }
        }
        let actual_number = format!(
            "{}{}",
            numbers_str.get(0).expect("there is nothing in the list"),
            numbers_str
                .get(numbers_str.len() - 1)
                .expect("there is nothingin the list")
        ).parse::<u32>().expect("could not be parsed");
        // println!("actual number: {}", actual_number);
        numbers.push(actual_number);
        numbers_str.clear();
    }
    // println!("{:?}", numbers);
    numbers.iter().sum()
}

fn replace_text_with_number(lines: &Vec<String>) -> Vec<String> {
    let replacements: HashMap<_, _> = [
        ("one", "1"), ("two", "2"), ("three", "3"),
        ("four", "4"), ("five", "5"), ("six", "6"),
        ("seven", "7"), ("eight", "8"), ("nine", "9")
    ].iter().cloned().collect();

    let regex = Regex::new(r"(one|two|three|four|five|six|seven|eight|nine)").unwrap();

    lines.iter().map(|line| {
        let replaced_line = regex.replace_all(line, |caps: &regex::Captures| {
            replacements.get(caps.get(0).unwrap().as_str()).unwrap().to_string()
        }).to_string();
        println!("Original: {}, Replaced: {}", line, replaced_line);
        replaced_line
    }).collect()
}

