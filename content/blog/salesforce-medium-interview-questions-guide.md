---
title: "Medium Salesforce Interview Questions: Strategy Guide"
description: "How to tackle 113 medium difficulty questions from Salesforce — patterns, time targets, and practice tips."
date: "2032-02-17"
category: "tips"
tags: ["salesforce", "medium", "interview prep"]
---

Medium Salesforce interview questions occupy a unique space. With 113 Medium questions out of 189 total, they represent the core battleground for most technical screens and on-site rounds. While Easy questions often test basic syntax and single-concept application, and Hard questions demand deep algorithmic insight or complex optimization, Medium questions at Salesforce are designed to assess your _engineering judgment_. They are less about raw algorithmic genius and more about cleanly implementing a practical solution to a business-logic-adjacent problem. You'll frequently encounter scenarios involving data transformation, state management, and operations on common data structures like strings, arrays, and hash maps, often with a twist that requires careful edge-case consideration.

## Common Patterns and Templates

Salesforce's Medium problems heavily favor **simulation**, **array/string manipulation**, and **hash map indexing**. A recurring theme is taking a set of rules or a process (like updating records, parsing a log, or calculating a running metric) and implementing it faithfully. The most common pattern is the **"Stateful Iteration with Lookup"** template. You iterate through your data (e.g., a list of strings, a sequence of operations), maintain some state (counts, a stack, a current value), and use a hash map for O(1) lookups to decide the next state or to validate conditions.

Here is a generalized template for this pattern:

<div class="code-group">

```python
# Template: Stateful Iteration with Lookup
# Common in problems like #1701 Average Waiting Time, #1890 The Latest Login in 2020
def stateful_solution(data):
    """
    Processes a sequence, maintaining state and using a lookup for efficiency.
    """
    # 1. Initialize state and lookup structure
    state = initial_value  # e.g., 0, [], or a custom object
    lookup = {}  # or defaultdict, Counter, Set

    # 2. Iterate through the input data
    for item in data:
        # 3. Use lookup to check conditions or update state
        if item in lookup:
            # React to a seen item (e.g., update, skip, calculate)
            state = update_state(state, lookup[item])
        else:
            # Handle first-time occurrence
            state = handle_new(state, item)

        # 4. CRITICAL: Update the lookup with new information from this step
        lookup[item] = new_value  # or update a count/timestamp

    # 5. Process final state to produce the required output
    return calculate_result(state)

# Time: Typically O(n) for the single pass | Space: O(n) for the lookup structure
```

```javascript
// Template: Stateful Iteration with Lookup
function statefulSolution(data) {
  // 1. Initialize state and lookup structure
  let state = initialValue;
  const lookup = new Map(); // or {} for plain objects

  // 2. Iterate through the input data
  for (const item of data) {
    // 3. Use lookup to check conditions or update state
    if (lookup.has(item)) {
      // React to a seen item
      state = updateState(state, lookup.get(item));
    } else {
      // Handle first-time occurrence
      state = handleNew(state, item);
    }

    // 4. Update the lookup with new information
    lookup.set(item, newValue);
  }

  // 5. Process final state
  return calculateResult(state);
}
// Time: O(n) | Space: O(n)
```

```java
// Template: Stateful Iteration with Lookup
public ResultType statefulSolution(List<DataType> data) {
    // 1. Initialize state and lookup structure
    StateType state = new StateType();
    Map<KeyType, ValueType> lookup = new HashMap<>();

    // 2. Iterate through the input data
    for (DataType item : data) {
        // 3. Use lookup to check conditions or update state
        if (lookup.containsKey(item.key)) {
            // React to a seen item
            state.update(lookup.get(item.key));
        } else {
            // Handle first-time occurrence
            state.handleNew(item);
        }

        // 4. Update the lookup with new information
        lookup.put(item.key, item.value);
    }

    // 5. Process final state
    return state.calculateResult();
}
// Time: O(n) | Space: O(n)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a single Medium problem in a 45-minute interview, you should aim to have a working, optimal solution within **25-30 minutes**. This leaves crucial time for discussion, testing, and a potential follow-up. The interviewer isn't just watching for a green checkmark. They are evaluating:

- **Code Quality First:** Is your code readable, with sensible variable names and a logical flow? Do you extract complex logic into helper functions? At Salesforce, maintainable code is a huge signal.
- **Edge Case Hunting:** Do you proactively identify and handle edge cases? For example, empty input, single-element lists, duplicate values, integer overflow (rare in Python/JS, but critical in Java), or negative numbers. Verbally walking through these _before_ you start coding is a strong move.
- **Communication of Trade-offs:** Can you explain _why_ you chose a hash map over a list for lookups? Can you articulate the time/space complexity of your solution and mention potential alternatives, even if you don't implement them?

## Key Differences from Easy Problems

The jump from Easy to Medium at Salesforce is defined by two key shifts:

1.  **From Single-Step to Multi-Step Logic:** Easy problems are often "apply this one function" or "one loop with a condition." Medium problems require you to chain steps. For example, you might need to first preprocess data into a map, then iterate through another list, using the map to make decisions and update a result. The mental model has more moving parts.
2.  **From Obvious to Non-Trivial Edge Cases:** In an Easy problem, edge cases might be "what if the list is empty?" In a Medium problem, the edge cases are often woven into the core logic. For instance, in a problem like **#1773 Count Items Matching a Rule**, the edge case isn't just an empty list—it's ensuring your index lookup for the ruleKey doesn't go out of bounds and that you correctly handle different data types in the items list. You must now _design_ your solution to be robust.

## Specific Patterns for Medium

Beyond the general template, watch for these patterns:

**1. Index Mapping for Categorization:** Problems like **#1480 Running Sum of 1d Array** or **#1431 Kids With the Greatest Number of Candies** are about calculating a running property. The pattern involves a single pass where you track a "current best" or "running total" and build a result array based on comparisons to it.

**2. String/Array Simulation with a Stack:** For problems involving parsing, validation, or step-by-step construction (e.g., **#1544 Make The String Great**), a stack is your best friend. You simulate processing each character, pushing and popping based on conditions, to arrive at the final, valid state.

<div class="code-group">

```python
# Pattern: Simulation with a Stack (e.g., #1544 Make The String Great)
def makeGood(s: str) -> str:
    stack = []
    for ch in s:
        # If stack is not empty and current char is the "bad" pair of the top
        if stack and abs(ord(ch) - ord(stack[-1])) == 32:
            stack.pop()  # Remove the matching pair
        else:
            stack.append(ch)
    return ''.join(stack)
# Time: O(n) | Space: O(n) for the stack/output
```

```javascript
function makeGood(s) {
  const stack = [];
  for (const ch of s) {
    if (
      stack.length > 0 &&
      Math.abs(ch.charCodeAt(0) - stack[stack.length - 1].charCodeAt(0)) === 32
    ) {
      stack.pop();
    } else {
      stack.push(ch);
    }
  }
  return stack.join("");
}
// Time: O(n) | Space: O(n)
```

```java
public String makeGood(String s) {
    Stack<Character> stack = new Stack<>();
    for (char ch : s.toCharArray()) {
        if (!stack.isEmpty() && Math.abs(ch - stack.peek()) == 32) {
            stack.pop();
        } else {
            stack.push(ch);
        }
    }
    StringBuilder sb = new StringBuilder();
    for (char ch : stack) sb.append(ch);
    return sb.toString();
}
// Time: O(n) | Space: O(n)
```

</div>

## Practice Strategy

Don't just solve all 113 questions randomly. Practice with intent:

1.  **Pattern-First Approach:** Group problems by the patterns above. Solve 3-5 "Stateful Iteration" problems in a row (e.g., #1701, #1890, #511). Then switch to "Simulation with Stack" problems. This builds muscle memory.
2.  **Daily Target:** Aim for **2-3 high-quality Medium solutions per day**. "High-quality" means: you code it from scratch, you analyze time/space complexity, you test edge cases, and you can explain it clearly to an imaginary interviewer.
3.  **Recommended Order:** Start with the most frequent patterns: Array manipulation and Hash Map problems. Then move to String/Stack simulations. Finally, tackle the less common but still important topics like basic tree traversal or matrix problems.
4.  **Simulate the Clock:** Once a week, do a full 45-minute mock interview on a _new_ Salesforce Medium problem. Stick to the 30-minute coding deadline.

The goal for Salesforce Medium questions isn't to be clever; it's to be **reliably competent**. Demonstrate you can translate a slightly complex specification into clean, efficient, and robust code. That's the engineer they want to hire.

[Practice Medium Salesforce questions](/company/salesforce/medium)
