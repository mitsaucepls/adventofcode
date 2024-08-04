use core::fmt;

#[tokio::main]
async fn main() {
    let resp_input = get_input(3).await;
    match resp_input {
        Ok(input) => {
            let matrix = convert_to_2d_array(input);
            println!("{}, {}", matrix.len(), matrix.get(0).unwrap().len());
            let indexes = find_special_character_indexes(&matrix);
            let numbers = find_sequential_numbers(&matrix);
            numbers.iter().for_each(|num| println!("{}", num.0));
            let result = compare_indexes_with_numbers(&indexes, &numbers).iter().sum::<usize>();
            println!("result {}", result);
        }
        Err(e) => println!("Input failed: {}", e),
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

fn convert_to_2d_array(input: String) -> Vec<Vec<char>> {
    let mut char_matrix: Vec<Vec<char>> = Vec::new();

    let input_lines = input.lines();
    input_lines.for_each(|line| char_matrix.push(line.chars().collect()));

    char_matrix
}

fn is_special_character(c: &char) -> bool {
    match c {
        '0'..='9' | '.' => false,
        _ => !c.is_alphanumeric(),
    }
}

#[derive(PartialEq, Eq, Clone)]
pub struct Index {
    y: usize,
    x: usize,
}

impl Index {
    fn new(y: usize, x: usize) -> Self {
        Index { y, x, }
    }
}

impl fmt::Display for Index {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Index: y{}, x{}", self.y, self.x)
    }

}

pub struct IndexField {
    source: Index,
    top_left: Index,
    top_mid: Index,
    top_right: Index,
    mid_right: Index,
    bot_right: Index,
    bot_mid: Index,
    bot_left: Index,
    mid_left: Index,
}

impl IndexField {
    fn new(y: usize, x: usize) -> Self {
        IndexField {
            source: Index::new(y, x),
            top_left: Index::new(y - 1, x - 1), // 1.
            top_mid: Index::new(y - 1, x), // 2.
            top_right: Index::new(y - 1, x + 1), // 3.
            mid_right: Index::new(y, x + 1), // 4.
            bot_right: Index::new(y + 1, x + 1), // 5.
            bot_mid: Index::new(y + 1, x), // 6.
            bot_left: Index::new(y + 1, x - 1), // 7.
            mid_left: Index::new(y, x - 1), // 8.
        }
    }

    fn has(self: &Self, index: &Index) -> bool {
        let index = index.clone();
        if index == self.top_left {
            true
        } else if index == self.top_mid {
            true
        } else if index == self.top_right {
            true
        } else if index == self.mid_right {
            true
        } else if index == self.bot_right {
            true
        } else if index == self.bot_mid {
            true
        } else if index == self.bot_left {
            true
        } else if index == self.mid_left {
            true
        } else {
            false
        }
    }
}

fn find_sequential_numbers(matrix: &Vec<Vec<char>>) -> Vec<(usize, Vec<Index>)> {
    let mut numbers: Vec<(usize, Vec<Index>)> = Vec::new();

    for (i, row) in matrix.iter().enumerate() {
        numbers.append(&mut filter_and_map_chars(i, row));
    }

    numbers
}

fn filter_and_map_chars(i: usize, chars: &Vec<char>) -> Vec<(usize, Vec<Index>)> {
    let mut numbers: Vec<(usize, Vec<Index>)> = Vec::new();
    let mut current_indexes: Vec<Index> = Vec::new();
    let mut current_number: String = String::new();

    for (j, &char) in chars.iter().enumerate() {
        if char.is_numeric() {
            current_number.push(char);
            current_indexes.push(Index::new(i, j));
        } else {
            if !current_number.is_empty(){
                if let Ok(number) = current_number.parse::<usize>() {
                    numbers.push((number, current_indexes.to_vec()));
                }
                current_number.clear();
                current_indexes.clear();
            }
        }
    }

    if !current_number.is_empty(){
        if let Ok(number) = current_number.parse::<usize>() {
            numbers.push((number, current_indexes.to_vec()));
        }
    }

    numbers
}

fn find_special_character_indexes(matrix: &Vec<Vec<char>>) -> Vec<IndexField> {
    let mut special_character_indexes: Vec<IndexField> = Vec::new();

    for (i, row) in matrix.iter().enumerate() {
        for (j, char) in row.iter().enumerate() {
            if !is_special_character(char) {
                continue;
            }
            special_character_indexes.push(IndexField::new(i, j));
        }
    }

    special_character_indexes
}

fn compare_indexes_with_numbers(indexes: &Vec<IndexField>, numbers: &Vec<(usize, Vec<Index>)>) -> Vec<usize> {
    let mut matching_numbers: Vec<usize> = Vec::new();

    for index_field in indexes {
        for number in numbers {
            for number_index in number.1.clone() {
                if index_field.has(&number_index) {
                    matching_numbers.push(number.0);
                    break
                }
            }
        }
    }

    matching_numbers
}
