---
title: "Easy Atlassian Interview Questions: Strategy Guide"
description: "How to tackle 7 easy difficulty questions from Atlassian — patterns, time targets, and practice tips."
date: "2032-07-26"
category: "tips"
tags: ["atlassian", "easy", "interview prep"]
---

Atlassian’s “Easy” problems are a bit of a misnomer. While they are the simplest of the 62 questions on their tagged list, they are not throwaway warm-ups. They are carefully chosen to test foundational correctness, clean code, and the ability to translate simple requirements into bug-free software. What separates an Atlassian Easy from a Medium is not raw algorithmic complexity—you won’t find dynamic programming or complex graph traversals here. Instead, the difficulty lies in meticulous implementation, handling edge cases that mirror real-world data quirks (like empty Jira tickets or Confluence pages), and writing code that is immediately readable and maintainable. These questions are your first and most critical filter: solving them flawlessly signals you can handle the basic building blocks of their products.

## Common Patterns and Templates

Atlassian’s Easy problems heavily favor **array/string manipulation** and **basic data structure operations**. You’ll see a lot of tasks involving iteration, counting, and conditional logic. The most common pattern by far is the **linear scan with state tracking**. This involves traversing an input once while maintaining a variable or a simple data structure (like a hash map or set) to make decisions. The core challenge is to get the loop boundaries and state updates exactly right.

Here’s a template for this pattern, which can be adapted to problems like checking conditions, finding duplicates, or validating sequences:

<div class="code-group">

```python
# Template: Linear Scan with State Tracking
# Time: O(n) | Space: O(1) or O(k) where k is a fixed set of states
def linear_scan_template(input_data):
    # 1. Initialize state (counter, hash map, previous value, flag)
    state = {}
    # or prev = None
    # or count = 0

    # 2. Iterate through each element
    for i, value in enumerate(input_data):
        # 3. Update state based on current value and possibly previous state
        # Example: Count occurrences
        state[value] = state.get(value, 0) + 1

        # 4. Often, check a condition and potentially return early
        # if some_condition(state):
        #     return True or False

    # 5. After the loop, compute and return the final result
    return result_based_on(state)
```

```javascript
// Template: Linear Scan with State Tracking
// Time: O(n) | Space: O(1) or O(k)
function linearScanTemplate(inputData) {
  // 1. Initialize state
  const state = new Map();
  // let prev = null;
  // let count = 0;

  // 2. Iterate
  for (let i = 0; i < inputData.length; i++) {
    const value = inputData[i];
    // 3. Update state
    state.set(value, (state.get(value) || 0) + 1);

    // 4. Optional early return condition
    // if (condition) return result;
  }

  // 5. Final computation
  return computeResult(state);
}
```

```java
// Template: Linear Scan with State Tracking
// Time: O(n) | Space: O(1) or O(k)
public ResultType linearScanTemplate(List<DataType> inputData) {
    // 1. Initialize state
    Map<DataType, Integer> state = new HashMap<>();
    // DataType prev = null;
    // int count = 0;

    // 2. Iterate
    for (DataType value : inputData) {
        // 3. Update state
        state.put(value, state.getOrDefault(value, 0) + 1);

        // 4. Optional early return
        // if (condition) return result;
    }

    // 5. Final computation
    return computeResult(state);
}
```

</div>

## Time Benchmarks and What Interviewers Look For

You should aim to solve an Atlassian Easy problem within **15-20 minutes** total. This includes understanding the problem, asking clarifying questions, writing the code, and walking through test cases. The interviewer isn’t just watching for a green checkmark. They are evaluating:

1.  **Code Quality First:** Is your code clean, with sensible variable names and a clear structure? Do you avoid clever one-liners that sacrifice readability? Atlassian values maintainable code highly.
2.  **Edge Case Hunting:** Do you immediately consider empty inputs, single-element inputs, or maximum/minimum values? Mentioning these _before_ writing code is a strong signal.
3.  **Communication of Trade-offs:** Even for an Easy problem, be prepared to justify your choice of a hash map over a set, or why you used an integer array of size 26 for a lowercase string problem. It shows you think about memory and performance even for simple tasks.
4.  **Testing Verbally:** Don’t just say “it works.” Walk through a small, non-trivial example with your code, including an edge case. This proves you understand your own algorithm.

## Building a Foundation for Medium Problems

The jump from Easy to Medium at Atlassian is primarily about **managing complexity in state and transitions**. An Easy problem might ask you to find if a character appears twice. A Medium problem (like **56. Merge Intervals** or **438. Find All Anagrams in a String**) asks you to manage multiple interacting states or sliding windows.

The new techniques required are:

- **Multi-step State Logic:** Instead of one counter, you might need two pointers or a deque that change based on complex conditions.
- **Preprocessing:** You’ll often need to sort the input or build a frequency map as a preliminary step before the main logic.
- **Algorithmic Patterns:** Sliding window, two pointers, and basic BFS/DFS on trees become essential.

The mindset shift is from **"Does this work for my example?"** to **"What is the invariant my algorithm must maintain, and how do I prove it holds on each step?"** Start practicing this on Easy problems by formally stating your loop invariant.

## Specific Patterns for Easy

1.  **Frequency Counting with Early Exit:** Problems like checking for duplicates or validating anagram conditions.
    - **Example (Python):** `return len(set(s)) != len(s)` for a duplicate check. But the interview-worthy version uses a hash set for an early exit: `seen = set(); for char in s: if char in seen: return True; seen.add(char); return False`

2.  **Direct Simulation / String Building:** Implementing a straightforward rule, often seen in formatting or validation tasks.
    - **Example (JavaScript):** Building a new string by iterating and applying a rule, like adding characters or replacing spaces. Key is to use an array (`result.push()`) for O(n) time, not string concatenation in a loop.

3.  **Basic Math with Bounds Checking:** Arithmetic on integers while watching for overflow or negative numbers. Atlassian problems often have constraints that make a brute-force math solution acceptable.
    - **Example (Java):** Reversing an integer with `while (x != 0) { int pop = x % 10; ... }` and checking at each step if the reversal would cause integer overflow before actually doing it.

## Practice Strategy

Don’t just solve the 7 Easy problems once. Use them efficiently:

1.  **First Pass (Day 1-2):** Solve all 7 without time pressure. Focus on writing the cleanest, most readable version you can. Comment your code as if for a new hire.
2.  **Second Pass (Day 3):** Solve them again, but time yourself. Aim for under 20 minutes per problem, including verbal walkthrough. Record yourself explaining your solution.
3.  **Pattern Drill (Day 4):** Group problems by the patterns above. Write the generic template (like the one provided) and then adapt it to each specific problem. This builds muscle memory.
4.  **Daily Maintenance:** Once comfortable, do one random Easy problem as a warm-up before tackling Medium/Hard practice. This keeps your fundamentals sharp and your coding speed high.

The goal is to make solving these problems automatic, freeing your mental energy for the more complex challenges that follow. Mastery here builds the confidence and rhythm you need for the rest of the interview.

[Practice Easy Atlassian questions](/company/atlassian/easy)
