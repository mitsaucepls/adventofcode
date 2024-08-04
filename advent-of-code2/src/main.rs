fn main() {

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
