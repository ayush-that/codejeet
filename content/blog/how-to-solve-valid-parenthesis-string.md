---
title: "How to Solve Valid Parenthesis String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Valid Parenthesis String. Medium difficulty, 39.8% acceptance rate. Topics: String, Dynamic Programming, Stack, Greedy."
date: "2027-03-24"
category: "dsa-patterns"
tags: ["valid-parenthesis-string", "string", "dynamic-programming", "stack", "medium"]
---

# How to Solve Valid Parenthesis String

This problem asks us to determine if a string containing parentheses `(` and `)` along with wildcard characters `*` forms a valid parentheses sequence. The twist is that each `*` can be treated as either `(`, `)`, or an empty string. This makes the problem significantly more challenging than standard valid parentheses checking because we have multiple possible interpretations for each wildcard.

What makes this problem interesting is that we can't simply use a single counter or stack—we need to track a _range_ of possible open parenthesis counts at each step. A string is valid if there exists at least one valid interpretation of the wildcards that results in balanced parentheses.

## Visual Walkthrough

Let's trace through an example: `s = "(*))"`

We need to track the possible number of unmatched open parentheses as we process each character. Instead of tracking a single count, we'll track the minimum and maximum possible open counts:

**Step 1:** Process `'('`

- Minimum open count: must increase by 1 → `min = 1`
- Maximum open count: must increase by 1 → `max = 1`

**Step 2:** Process `'*'` (can be `(`, `)`, or empty)

- If `*` is `(`: both min and max increase by 1
- If `*` is `)`: both decrease by 1
- If `*` is empty: both stay the same
- So min could be `1-1=0` and max could be `1+1=2`
- But min can't be negative (can't have negative open parens) → `min = max(0, 0) = 0`
- `max = 2`

**Step 3:** Process `')'`

- If we had min open parens, one gets matched → `min = 0-1 = -1`
- But min can't be negative → `min = max(0, -1) = 0`
- Max decreases by 1 → `max = 2-1 = 1`

**Step 4:** Process `')'`

- `min = max(0, 0-1) = 0`
- `max = 1-1 = 0`

At the end: `min = 0`, meaning we can have exactly 0 open parentheses (balanced string). The string is valid.

## Brute Force Approach

The most straightforward approach is to try all possible interpretations of the wildcards. For each `*`, we have 3 choices: `(`, `)`, or empty string. With `k` stars in the string, we have `3^k` possibilities to check.

We could implement this using recursion or backtracking:

1. Replace each `*` with one of the three possibilities
2. Check if the resulting string has valid parentheses
3. Return true if any interpretation is valid

The problem with this approach is its exponential time complexity. For a string with just 10 stars, we'd need to check `3^10 = 59,049` possibilities. For longer strings, this becomes completely impractical.

## Optimized Approach

The key insight is that we don't need to track every possible interpretation separately. Instead, we can track the _range_ of possible unmatched open parenthesis counts at each position in the string.

We maintain two values:

- `low`: The minimum possible number of unmatched `(` we could have
- `high`: The maximum possible number of unmatched `(` we could have

For each character:

- If we see `(`: both `low` and `high` increase by 1
- If we see `)`: both `low` and `high` decrease by 1
- If we see `*`: `low` decreases by 1 (treat as `)`), `high` increases by 1 (treat as `(`)

Crucially, `low` can never be negative (we can't have negative unmatched parentheses). If `high` becomes negative at any point, the string is definitely invalid (even treating all stars as `(` can't save it).

At the end, the string is valid if `low == 0`, meaning we can achieve exactly 0 unmatched parentheses.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkValidString(s: str) -> bool:
    """
    Check if a string with parentheses and wildcards (*) can form valid parentheses.
    The * can be treated as '(', ')', or empty string.

    Approach: Track the range of possible open parenthesis counts.
    low: minimum possible open count
    high: maximum possible open count
    """
    low = 0  # Minimum possible unmatched '('
    high = 0  # Maximum possible unmatched '('

    for char in s:
        if char == '(':
            # '(' always increases both counts
            low += 1
            high += 1
        elif char == ')':
            # ')' always decreases both counts
            low -= 1
            high -= 1
        else:  # char == '*'
            # '*' could be ')', decreasing low
            # or '(', increasing high
            # or empty, leaving counts unchanged
            low -= 1
            high += 1

        # If high < 0, even treating all stars as '(' can't save us
        if high < 0:
            return False

        # low can't be negative (can't have negative open parens)
        # If low < 0, reset it to 0
        low = max(low, 0)

    # Valid if we can achieve exactly 0 unmatched '('
    return low == 0
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if a string with parentheses and wildcards (*) can form valid parentheses.
 * The * can be treated as '(', ')', or empty string.
 *
 * Approach: Track the range of possible open parenthesis counts.
 * low: minimum possible open count
 * high: maximum possible open count
 */
function checkValidString(s) {
  let low = 0; // Minimum possible unmatched '('
  let high = 0; // Maximum possible unmatched '('

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "(") {
      // '(' always increases both counts
      low++;
      high++;
    } else if (char === ")") {
      // ')' always decreases both counts
      low--;
      high--;
    } else {
      // char === '*'
      // '*' could be ')', decreasing low
      // or '(', increasing high
      // or empty, leaving counts unchanged
      low--;
      high++;
    }

    // If high < 0, even treating all stars as '(' can't save us
    if (high < 0) {
      return false;
    }

    // low can't be negative (can't have negative open parens)
    // If low < 0, reset it to 0
    low = Math.max(low, 0);
  }

  // Valid if we can achieve exactly 0 unmatched '('
  return low === 0;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Check if a string with parentheses and wildcards (*) can form valid parentheses.
     * The * can be treated as '(', ')', or empty string.
     *
     * Approach: Track the range of possible open parenthesis counts.
     * low: minimum possible open count
     * high: maximum possible open count
     */
    public boolean checkValidString(String s) {
        int low = 0;   // Minimum possible unmatched '('
        int high = 0;  // Maximum possible unmatched '('

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (c == '(') {
                // '(' always increases both counts
                low++;
                high++;
            } else if (c == ')') {
                // ')' always decreases both counts
                low--;
                high--;
            } else { // c == '*'
                // '*' could be ')', decreasing low
                // or '(', increasing high
                // or empty, leaving counts unchanged
                low--;
                high++;
            }

            // If high < 0, even treating all stars as '(' can't save us
            if (high < 0) {
                return false;
            }

            // low can't be negative (can't have negative open parens)
            // If low < 0, reset it to 0
            low = Math.max(low, 0);
        }

        // Valid if we can achieve exactly 0 unmatched '('
        return low == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the string of length n
- Each character requires only constant-time operations (addition, subtraction, comparison)

**Space Complexity:** O(1)

- We only use two integer variables (`low` and `high`) regardless of input size
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting to reset `low` when it becomes negative**: When `low` goes below 0, we must reset it to 0 because we can't have negative unmatched parentheses. This represents choosing a different interpretation of previous stars.

2. **Checking if `high == 0` at the end instead of `low == 0`**: We need to check if we can achieve _exactly_ 0 unmatched parentheses, not just if it's possible to have 0 or more. The condition `low == 0` ensures there exists at least one interpretation with exactly balanced parentheses.

3. **Not checking `high < 0` during iteration**: If `high` becomes negative at any point, the string is definitely invalid—even treating all remaining stars as `(` can't fix it. This early exit is crucial for efficiency and correctness.

4. **Using a single counter instead of a range**: Some candidates try to track just one count, but this fails because stars have multiple possible interpretations. We need to track the minimum and maximum possible counts.

## When You'll See This Pattern

This "range tracking" or "interval tracking" pattern appears in problems where we need to check feasibility within constraints:

1. **Check if a Parentheses String Can Be Valid (LeetCode 2116)**: Similar problem but with locked parentheses—some characters can't be changed. The same range tracking approach works.

2. **Special Binary String (LeetCode 761)**: While different on the surface, it involves balancing and reordering substrings, requiring similar feasibility checks.

3. **Minimum Add to Make Parentheses Valid (LeetCode 921)**: A simpler version without wildcards, but understanding the open count tracking helps with this problem.

4. **Score of Parentheses (LeetCode 856)**: Uses stack-based evaluation similar to parentheses validation.

## Key Takeaways

1. **When dealing with multiple possibilities or wildcards, track ranges instead of single values**: This transforms exponential possibilities into linear-time checking by tracking only the minimum and maximum feasible states.

2. **Parentheses validation often involves counting unmatched opens**: The core invariant is that we can't have negative unmatched opens at any point, and must end with exactly 0.

3. **Early termination is possible**: If even the most optimistic scenario (treating all stars as `(`) can't satisfy a constraint, we can return false immediately.

Related problems: [Special Binary String](/problem/special-binary-string), [Check if a Parentheses String Can Be Valid](/problem/check-if-a-parentheses-string-can-be-valid)
