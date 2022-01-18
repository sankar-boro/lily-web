import { Result, Ok} from "ts-results";

export const Hello = (): Result<string, string> => {
    return Ok("Hello")
}