use std::usize;

#[tokio::main]
async fn main() {
    let input = get_input(4).await;
    match input {
        Ok(text) => {
            println!("{}", text);
            let formatted_cards = format_cards(text);
            let parsed_cards = parse_cards(formatted_cards);
            println!("{}", parsed_cards.get(0).unwrap().0.len());
            println!("{:?}", parsed_cards);
            let result = fold_cards(parsed_cards);
            println!("{}", result)
        }
        Err(e) => println!("fetching 4 gone wrong: {}", e),
    }
}

async fn get_input(index: u32) -> Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let url = format!("https://adventofcode.com/2023/day/{}/input", index);
    println!("{}", url);

    let response = client
        .get(url)
        .header("cookie", std::env::var("SESSION_COOKIE").unwrap())
        .send()
        .await?
        .text()
        .await?;

    Ok(response)
}

fn format_cards(input: String) -> Vec<(Vec<String>, Vec<String>)> {
    let input_lines = input.lines();

    let cards_stripped: Vec<String> = input_lines
        .map(|line| {
            let idk: Vec<String> = line
                .split(":")
                .map(|bodenlos| bodenlos.to_string())
                .collect::<Vec<String>>();
            idk.get(1).expect("could not split").to_owned()
        })
        .collect();

    let cards_split: Vec<(Vec<String>, Vec<String>)> = cards_stripped
        .iter()
        .map(|line| {
            let parts: Vec<_> = line.split("|").collect();
            if parts.len() == 2 {
                let winning_numbers = vec![parts[0].to_string()];
                let actual_numbers = vec![parts[1].to_string()];
                (winning_numbers, actual_numbers)
            } else {
                (vec![], vec![])
            }
        })
        .collect();
    cards_split
}

fn parse_cards(cards: Vec<(Vec<String>, Vec<String>)>) -> Vec<(Vec<usize>, Vec<usize>)> {
    cards
        .iter()
        .map(|card| {
            let winning_numbers = get_numbers_of_string(card.0.to_vec());
            let actual_numbers = get_numbers_of_string(card.1.to_vec());
            (winning_numbers, actual_numbers)
        })
        .collect()
}

fn get_numbers_of_string(strings: Vec<String>) -> Vec<usize> {
    let mut numbers: Vec<usize> = Vec::new();
    let mut current_string: String = String::new();
    strings.iter().for_each(|string| {
        string.chars().for_each(|char| {
            if char.is_digit(10) {
                current_string.push(char);
            } else if !current_string.is_empty() {
                numbers.push(
                    current_string
                        .parse::<usize>()
                        .expect("cannot parse this char"),
                );
                current_string.clear();
            }
        });
        if !current_string.is_empty() {
            numbers.push(
                current_string
                    .parse::<usize>()
                    .expect("cannot parse this char"),
            );
            current_string.clear();
        }
    });

    numbers
}

fn fold_cards(cards: Vec<(Vec<usize>, Vec<usize>)>) -> usize {
    const BASE: usize = 2;
    let mapped_cards: Vec<Vec<usize>> = cards
        .iter()
        .map(|card| compare_numbers(card.0.clone(), card.1.clone()))
        .collect();

    println!("{:?}", mapped_cards);

    mapped_cards.iter().fold(0, |acc, matching_numbers| {
        let mut matching_numbers_number: usize = 0;
        let matching_numbers_len = matching_numbers.len() as u32;
        if matching_numbers_len > 0 {
            matching_numbers_number = BASE.pow(matching_numbers_len - 1);
            println!("{} = {}", matching_numbers_len, matching_numbers_number);
        }
        acc + matching_numbers_number
    })
}

fn compare_numbers(winning_numbers: Vec<usize>, actual_numbers: Vec<usize>) -> Vec<usize> {
    winning_numbers
        .iter()
        .filter(|winning_number| actual_numbers.contains(winning_number))
        .cloned()
        .collect()
}
