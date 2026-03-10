---
title: "How to Solve Count Asterisks — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Asterisks. Easy difficulty, 83.3% acceptance rate. Topics: String."
date: "2027-07-16"
category: "dsa-patterns"
tags: ["count-asterisks", "string", "easy"]
---

# How to Solve Count Asterisks

This problem asks us to count asterisks (`'*'`) in a string, but with a twist: we must exclude any asterisks that appear between pairs of vertical bars (`'|'`). The bars come in pairs (1st and 2nd form a pair, 3rd and 4th form a pair, etc.), and asterisks between these pairs don't count. What makes this interesting is that we need to track whether we're currently "inside" a bar pair while scanning the string—a simple counting approach won't work without this state tracking.

## Visual Walkthrough

Let's trace through an example: `s = "l|*e*et|c**o|*de|"`

We'll process each character while tracking whether we're inside a bar pair:

- Start: `inside = false`, `count = 0`
- `'l'`: not `'*'` or `'|'`, `inside = false` → ignore
- `'|'`: toggle `inside = true` (entering first pair)
- `'*'`: asterisk but `inside = true` → don't count
- `'e'`: not `'*'` or `'|'`, `inside = true` → ignore
- `'*'`: asterisk but `inside = true` → don't count
- `'e'`: not `'*'` or `'|'`, `inside = true` → ignore
- `'t'`: not `'*'` or `'|'`, `inside = true` → ignore
- `'|'`: toggle `inside = false` (exiting first pair)
- `'c'`: not `'*'` or `'|'`, `inside = false` → ignore
- `'*'`: asterisk and `inside = false` → `count = 1`
- `'*'`: asterisk and `inside = false` → `count = 2`
- `'o'`: not `'*'` or `'|'`, `inside = false` → ignore
- `'|'`: toggle `inside = true` (entering second pair)
- `'*'`: asterisk but `inside = true` → don't count
- `'d'`: not `'*'` or `'|'`, `inside = true` → ignore
- `'e'`: not `'*'` or `'|'`, `inside = true` → ignore
- `'|'`: toggle `inside = false` (exiting second pair)

Final count: 2 asterisks (the two between `"c"` and `"o"`).

## Brute Force Approach

A naive approach might try to first identify all bar pairs, then count asterisks outside them. One could:

1. Find all indices of `'|'` in the string
2. Group them into pairs (indices 0-1, 2-3, etc.)
3. For each asterisk, check if it falls between any pair
4. Count only those asterisks not between any pair

This approach is inefficient because:

- Finding all bar indices takes O(n) time
- For each asterisk (potentially O(n) of them), we might check against O(n/2) pairs
- This gives O(n²) worst-case time complexity
- The space complexity is O(n) to store bar indices

More importantly, this overcomplicates the problem. The key insight is that we don't need to track specific pairs—we just need to know whether we're currently inside _any_ pair. When we see a `'|'`, we toggle our "inside" state. When we see a `'*'`, we only count it if we're not inside.

## Optimal Solution

The optimal solution uses a single pass through the string with a boolean flag to track whether we're inside a bar pair. Each `'|'` toggles the flag, and we only count `'*'` when the flag is false.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) - we only use a few variables
def countAsterisks(s: str) -> int:
    # Initialize count of asterisks and flag for tracking inside/outside bar pairs
    count = 0
    inside = False  # False means we're outside a bar pair, True means inside

    # Iterate through each character in the string
    for char in s:
        if char == '|':
            # Toggle the inside flag when we encounter a bar
            # This works because bars always come in pairs
            inside = not inside
        elif char == '*' and not inside:
            # Only count asterisks when we're NOT inside a bar pair
            count += 1

    return count
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
function countAsterisks(s) {
  // Initialize count of asterisks and flag for tracking inside/outside bar pairs
  let count = 0;
  let inside = false; // false means we're outside a bar pair, true means inside

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === "|") {
      // Toggle the inside flag when we encounter a bar
      // This works because bars always come in pairs
      inside = !inside;
    } else if (char === "*" && !inside) {
      // Only count asterisks when we're NOT inside a bar pair
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
public int countAsterisks(String s) {
    // Initialize count of asterisks and flag for tracking inside/outside bar pairs
    int count = 0;
    boolean inside = false;  // false means we're outside a bar pair, true means inside

    // Iterate through each character in the string
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '|') {
            // Toggle the inside flag when we encounter a bar
            // This works because bars always come in pairs
            inside = !inside;
        } else if (c == '*' && !inside) {
            // Only count asterisks when we're NOT inside a bar pair
            count++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string of length `n`
- Each character is examined exactly once
- The operations per character (comparison, toggling boolean, incrementing count) are all O(1)

**Space Complexity: O(1)**

- We use only a constant amount of extra space:
  - `count` (integer)
  - `inside` (boolean)
  - Loop index variable
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle nested or overlapping bars**: The problem states bars come in pairs (1st with 2nd, 3rd with 4th), so they can't be nested. Some candidates overcomplicate by trying to handle nesting. Remember: each `'|'` simply toggles the state.

2. **Incorrect toggling logic**: Using `inside = True` instead of `inside = not inside` when seeing a `'|'`. This fails because after the second bar, we need to exit the "inside" state, not stay inside.

3. **Counting asterisks at wrong time**: Counting asterisks when `inside = True` instead of `inside = False`. Double-check the condition: we exclude asterisks _between_ bars, so we only count when outside.

4. **Not initializing the `inside` flag to `false`**: Starting inside a pair would cause us to miss counting asterisks before the first bar. We begin outside any pair, so `inside` should start as `false`.

## When You'll See This Pattern

This "state tracking with toggle" pattern appears in several string processing problems:

1. **Valid Parentheses (LeetCode 20)**: Similar toggle concept but with stack to handle different bracket types and nesting.

2. **Maximum Nesting Depth of Parentheses (LeetCode 1614)**: Uses a counter that increments on `'('` and decrements on `')'`, tracking "depth" similar to our `inside` flag.

3. **Number of Students Unable to Eat Lunch (LeetCode 1700)**: While not identical, it involves tracking state (students' preferences) and making decisions based on current conditions.

The core pattern is: **maintain a state variable that changes based on specific characters, then make decisions based on that state**. This is more efficient than storing all positions and checking ranges.

## Key Takeaways

1. **State tracking simplifies range exclusion**: Instead of tracking all pairs and checking if each asterisk falls within them, a simple boolean flag tells us whether we're currently "inside" a region to exclude.

2. **Toggle on delimiter pattern**: When delimiters come in balanced pairs and you need to track "inside/outside" status, toggling a boolean on each delimiter is often the cleanest solution.

3. **Single-pass solutions are optimal for counting with conditions**: For problems requiring counting elements with certain positional conditions, a single pass with state tracking usually achieves O(n) time and O(1) space.

[Practice this problem on CodeJeet](/problem/count-asterisks)
