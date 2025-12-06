import axios from "axios";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { env } from "process";

export async function getInput(day: number, year: number): Promise<string> {

  const dir = "inputs"
  const file_path = `./${ dir }/input${ day }.txt`
  if (existsSync(file_path)) {
    return readFileSync(file_path, "utf8")
  }

  const url = `https://adventofcode.com/${ year }/day/${ day }/input`
  const sessionCookie = env.SESSION_COOKIE_2025
  if (!sessionCookie) throw new Error("No cookie set")
  const response = await axios({
    url,
    method: "GET",
    headers: {
      Cookie: `session=${ sessionCookie }`
    }
  })


  writeFileSync(file_path, response.data)

  return response.data as string
}
