---
title: "Sorting Questions at Turing: What to Expect"
description: "Prepare for Sorting interview questions at Turing — patterns, difficulty breakdown, and study tips."
date: "2030-03-13"
category: "dsa-patterns"
tags: ["turing", "sorting", "interview prep"]
---

Sorting questions appear in about 10% of Turing's technical assessments (4 out of 40 questions). While this may seem like a small portion, these problems are foundational. They test your ability to manipulate data efficiently, understand algorithmic trade-offs, and apply core sorting logic to more complex scenarios. Success here demonstrates strong fundamentals, which is critical for Turing's evaluations of developer skill.

## What to Expect — Types of Problems

You will not be asked to implement a basic sorting algorithm like Quicksort from scratch. Instead, Turing's sorting questions focus on applying sorting as a tool to solve a larger problem. Expect these categories:

1.  **Sorting with Custom Comparators:** The core of most questions. You'll be given objects or arrays with multiple properties (e.g., `[name, score, id]`) and asked to sort them based on specific, often multi-level, rules (e.g., sort by score descending, then by name ascending).
2.  **Two-Pointer Techniques on Sorted Data:** A problem will present an array. The efficient solution often involves sorting it first, then using two pointers to find pairs, triplets, or remove duplicates in linear time.
3.  **Interval Merging:** Given a collection of intervals `[start, end]`, you'll typically sort them by their start time first. This ordered state is essential to then efficiently merge overlapping intervals in a single pass.
4.  **Greedy Problems Involving Order:** Problems where the optimal arrangement requires processing items in a specific order (e.g., scheduling for minimum wait time, maximum number of non-overlapping tasks). Sorting is the first step to revealing that order.

## How to Prepare — Study Tips with One Code Example

Master the pattern of writing custom sort functions or comparator logic. This is the single most important skill for these questions.

- **Internalize the "compare" function:** Understand that a comparator returns a negative number, zero, or a positive number to indicate whether the first element should come before, be equal to, or come after the second.
- **Practice Multi-level Sorting:** Get comfortable with sorting by one key, and if those keys are equal, sorting by a second key.
- **Know Your Language's Syntax:** The syntax for a custom sort differs by language. Drill it.

**Key Pattern Example: Custom Comparator for Multi-Level Sort**
Problem: Sort players by score (descending). If scores are equal, sort by name (ascending).

<div class="code-group">

```python
players = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 85}
]

# Key idea: Sort by negative score for descending, then name.
players.sort(key=lambda p: (-p["score"], p["name"]))

# Or using a comparator function:
# from functools import cmp_to_key
# def compare(a, b):
#     if a["score"] != b["score"]:
#         return b["score"] - a["score"]  # Descending score
#     return (a["name"] > b["name"]) - (a["name"] < b["name"]) # Ascending name
# players.sort(key=cmp_to_key(compare))
```

```javascript
let players = [
  { name: "Alice", score: 85 },
  { name: "Bob", score: 92 },
  { name: "Charlie", score: 85 },
];

// The comparator function returns negative, zero, or positive.
players.sort((a, b) => {
  if (a.score !== b.score) {
    return b.score - a.score; // Descending score
  }
  return a.name.localeCompare(b.name); // Ascending name
});
```

```java
import java.util.*;

class Player {
    String name;
    int score;
    // ... constructor and getters
}

List<Player> players = new ArrayList<>();
// ... add players

players.sort((a, b) -> {
    if (a.score != b.score) {
        return b.score - a.score; // Descending score
    }
    return a.name.compareTo(b.name); // Ascending name
});

// Or using Comparator chaining:
// players.sort(Comparator
//     .comparingInt(Player::getScore).reversed()
//     .thenComparing(Player::getName));
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  Start with basic **custom comparator** problems (sort objects by one property, then two).
2.  Move to **two-pointer** problems that require sorting first (like Two Sum on a sorted array, removing duplicates).
3.  Tackle **interval merging**—it directly applies the sorting step.
4.  Finally, solve **greedy** problems where sorting is the key preprocessing step.

Focus on clarity and correctness first, then discuss time complexity. For Turing, explicitly stating that you're sorting (`O(n log n)`) and why it enables your efficient solution is often part of a good answer.

[Practice Sorting at Turing](/company/turing/sorting)
