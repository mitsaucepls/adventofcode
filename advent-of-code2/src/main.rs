use std::{iter::Sum, ops::Add};

use regex::Regex;

#[tokio::main]
async fn main() {
    let input = get_input(2).await;
    match input {
        Ok(text) => {
            let games = format_games(text);
            let game_sum = games.iter().fold(0, |acc, game| acc + game.index);
            println!("{}", game_sum);
        },
        Err(e) => println!("fetching data has failed: {}", e),

    }
}

async fn get_input(index: u32) -> Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let url = format!("https://adventofcode.com/2023/day/{}/input", index);
    println!("{}", url);

    let response = client.get(url)
        .header("cookie", std::env::var("SESSION_COOKIE").unwrap())
        .send()
        .await?
        .text()
        .await?;

    Ok(response)
}

#[derive(Clone)]
enum Color {
    Red,
    Green,
    Blue,
}

impl From<&str> for Color {
    fn from(value: &str) -> Self {
        if value == "red" {
            Self::Red
        } else if value == "green" {
            Self::Green
        } else if value == "blue" {
            Self::Blue
        } else {
            println!("ERROR");
            Self::Blue
        }
    }
}

#[derive(Clone)]
struct Pull {
    number: usize,
    color: Color,
}

impl Pull {
    fn new(number: usize, color: Color) -> Self {
        Pull { number, color }
    }
}

#[derive(Clone)]
struct Set {
    pulls: Vec<Pull>,
}

impl Set {
    fn new(pulls: Vec<Pull>) -> Self {
        Set { pulls }
    }
}

#[derive(Clone)]
struct Game {
    index: usize,
    sets: Vec<Set>,
}

impl Game {
    fn new(index: usize, sets: Vec<Set>) -> Self {
        Game { index, sets }
    }
}

impl Add for Game {
    type Output = Self;
    fn add(self, rhs: Self) -> Self::Output {
        let new_index = self.index + rhs.index;
        Game::new(new_index, self.sets)
    }
}

impl Sum for Game {
    fn sum<I: Iterator<Item = Self>>(iter: I) -> Self {
        iter.fold(Game::new(0, Vec::new()), Add::add)
    }
}

fn format_games(input: String) -> Vec<Game> {
    let games_str = input.lines();
    let regame = Regex::new(r"Game (\d+): ").unwrap();
    let repull = Regex::new(r"(?<number>\d+) (?<color>\w+)").unwrap();

    let mut games: Vec<Game> = Vec::new();

    'game_loop: for game in games_str {
        let (_, [game_index_str]) = regame.captures(game).unwrap().extract();
        let game_index = game_index_str.parse::<usize>().unwrap();
        let tmp_strip = regame.replace(game, "");
        let sets_str = tmp_strip.split(";");

        let mut sets: Vec<Set> = Vec::new();
        for set in sets_str {
            let mut pulls: Vec<Pull> = Vec::new();
            let pull_iter = repull.captures_iter(set);
            for pull in pull_iter {
                let number = &pull["number"];
                let pull_number = number.parse::<usize>().unwrap();
                let color = &pull["color"];
                let cool_pull = Pull::new(pull_number, color.into());
                if !filter_pull(&cool_pull) {
                    continue 'game_loop
                }
                pulls.push(cool_pull)
            }
            sets.push(Set::new(pulls));
        }
        games.push(Game::new(game_index, sets));
    }
    games
}

fn filter_pull(pull: &Pull) -> bool {
    const RED: usize = 12;
    const GREEN: usize = 13;
    const BLUE: usize = 14;

    match pull.color {
        Color::Red => pull.number <= RED,
        Color::Green => pull.number <= GREEN,
        Color::Blue => pull.number <= BLUE,
    }
}
