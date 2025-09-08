# Question Generator

A simple browser-based tool that lets you pick coding problems from JSON and run your Python solutions directly in the browser using **Pyodide**.

* Problems are loaded from `problems.json` which is described in **problemtypes.md**
* Choose a topic number (1–4), then a problem number (1–5)
* Write Python code in the editor and click **Run Python** to execute (output is shown below)

---

## Table of Contents

* Project Structure
* Requirements
* Quick Start
* Usage
* Data Format (`problems.json`)
* Limitations & Notes
* Troubleshooting
* Customization Ideas
* License

---

## Project Structure

```
ice-breaking/
├─ index.html        # Main UI(HTML,CSS,JS)
├─ problems.json     # Problem dataset (topics/problems/test cases)
├─ problems.md    　 # list of problems
└─ README.md         # This file

```

> `docs/problems.md` is optional (provided as `#md` sample).
> It can be used as a catalog of problems for reference.

---

## Requirements

* A modern browser (such as latest Chrome)

## Quick Start with VS code

1. Place the files as shown in the Project Structure
2. Go Live(local hosting)
3. Enter a topic number (1–4), then a problem number (1–5)
4. Write Python code and click **Run Python**

---

## Usage

1. **Pick a topic (1–4)**

   * 1: 'Algorithm problems'
   * 2: 'For-loop problems'
   * 3: 'If-else problems'
   * 4: 'Recursion problems'

2. **Pick a problem (1–5)**

   * Displays the problem description and the first test case.

3. **Write Python code**

   * Use `print()` to see your output.
   * Example:

     ```python
     print("hello")  # hello
     ```

---

## Data Format (`problems.json`)

`index.html` maps topic numbers to internal keys:

| Input | Key                  |
| ----- | -------------------- |
| 1     | `algo_problems`      |
| 2     | `for_loop_problems`  |
| 3     | `if_else_problems`   |
| 4     | `recursion_problems` |

### JSON schema

```jsonc
{
  "<topic_key>": {
    "1": {
      [
      "description": "Problem statement",
      "test_cases": 
        { "input": <value>, "output": <value> }
      ]
    },
    "2": { ... },
    ...
    "5": { ... }
  },
  "... other topics ..."
}
```

* `<topic_key>`: must match one of the 4 keys above
* Problem numbers are string keys `"1"–"5"`
* `input` / `output` can be numbers, strings, arrays, objects, or `null`

---

## Limitations & Notes

* **Available packages**: only Python standard library by default.
* **Performance**: heavy loops or infinite loops may freeze the browser.

---

## Troubleshooting

**Q. “Pick topic first pls.”**

* You need to pick a topic before choosing a problem.

**Q. Output is empty**

* Did you use `print()`? Expression values aren’t shown automatically.

**Q. Pyodide doesn’t load**

* Check network connection. If CDN is blocked, download Pyodide and host locally.

---

## Customization Ideas (we will add later maybe)

* **Improve UI**: add CSS for panels, buttons, or code blocks.
* **Multiple test cases**: loop through `p.test_cases` and display all.
* **Auto-grading**: wrap user code into a function, run against all test cases, and compare outputs.
* **Internationalization**: move messages into a dictionary for easy translation.

---

## License

Free to use for learning and internal projects.

---
