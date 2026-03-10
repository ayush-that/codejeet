---
title: "How to Solve Generate Parentheses — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Generate Parentheses. Medium difficulty, 78.3% acceptance rate. Topics: String, Dynamic Programming, Backtracking."
date: "2026-04-12"
category: "dsa-patterns"
tags: ["generate-parentheses", "string", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Generate Parentheses

Given `n` pairs of parentheses, we need to generate all possible combinations of well-formed parentheses. A well-formed parentheses string has every opening parenthesis `(` matched with a closing parenthesis `)` in the correct order. This problem is interesting because it requires generating _all_ valid sequences, not just counting them, and the constraints on validity (you can't close a parenthesis that hasn't been opened) make it a perfect candidate for backtracking.

## Visual Walkthrough

Let's trace through the problem with `n = 2`. We need to generate all valid sequences using exactly 2 opening and 2 closing parentheses.

We can think about building the string character by character. At each step, we have two choices: add an opening parenthesis `(` or add a closing parenthesis `)`. However, we can't just add parentheses arbitrarily - we need to respect two rules:

1. We can't use more than `n` opening parentheses total
2. We can't add a closing parenthesis unless we have more opening parentheses than closing parentheses so far

Let's build the sequences step by step:

**Step 1:** Start with empty string `""`

- We can add `(` (we have 0 opening, 0 closing, and n=2 available openings)
- We cannot add `)` because we have 0 opening and 0 closing (would be invalid)

**Step 2:** After adding `(`, we have `"("`

- We can add `(` (1 opening used, 1 more available)
- We can add `)` (1 opening > 0 closing, so valid)

**Step 3a:** If we added `((`, we have `"(("`

- We can add `)` (2 openings > 0 closing)
- We cannot add `(` (already used 2 openings, n=2)

**Step 4a:** If we added `(()`, we have `"(()"`

- We can only add `)` (2 openings > 1 closing)

**Result:** `"(())"`

**Step 3b:** If we added `()`, we have `"()"`

- We can add `(` (1 opening used, 1 more available)
- We cannot add `)` (1 opening = 1 closing, would be invalid)

**Step 4b:** If we added `()(`, we have `"()("`

- We can only add `)` (2 openings > 1 closing)

**Result:** `"()()"`

So for `n = 2`, the valid combinations are: `["(())", "()()"]`

## Brute Force Approach

The most straightforward brute force approach would be to generate _all_ possible sequences of length `2n` using only `(` and `)`, then filter out the invalid ones. There are `2^(2n)` possible sequences, and for each sequence we'd need to validate it using a stack or counter approach.

The validation would check:

1. At any point, the number of closing parentheses can't exceed the number of opening parentheses
2. At the end, the counts must be equal

While this approach would technically work, it's extremely inefficient. For `n = 3`, we'd generate `2^6 = 64` sequences, but only 5 are valid. For `n = 10`, we'd generate over 1 million sequences to find just 16796 valid ones. The time complexity would be `O(2^(2n) * 2n)` - exponential with a validation step for each sequence.

## Optimized Approach

The key insight is that we don't need to generate all sequences and then validate them. Instead, we can build sequences while ensuring they remain valid at every step. This is a classic **backtracking** problem.

We can track two important counts:

- `open_count`: number of opening parentheses used so far
- `close_count`: number of closing parentheses used so far

At each step, we have two possible moves:

1. Add an opening parenthesis if `open_count < n`
2. Add a closing parenthesis if `close_count < open_count`

This ensures we never create an invalid sequence. We stop when the string length reaches `2n`.

This approach is much more efficient because we only explore valid partial sequences, pruning invalid branches early. The number of valid sequences is given by the Catalan number `C_n = (1/(n+1)) * (2n choose n)`, which grows as `O(4^n / (n√n))`.

## Optimal Solution

Here's the backtracking solution with detailed comments:

<div class="code-group">

```python
# Time: O(4^n / √n) - Catalan number growth
# Space: O(n) for recursion stack and O(4^n / √n) for output
def generateParenthesis(n):
    """
    Generate all combinations of well-formed parentheses for n pairs.

    Args:
        n: Number of pairs of parentheses

    Returns:
        List of all valid parentheses strings
    """
    result = []

    def backtrack(current_str, open_count, close_count):
        """
        Recursive backtracking function to build valid parentheses strings.

        Args:
            current_str: The string being built
            open_count: Number of '(' used so far
            close_count: Number of ')' used so far
        """
        # Base case: if we've used all n pairs
        if len(current_str) == 2 * n:
            result.append(current_str)
            return

        # Option 1: Add an opening parenthesis if we haven't used all n
        if open_count < n:
            # Add '(' and recurse, incrementing open_count
            backtrack(current_str + '(', open_count + 1, close_count)

        # Option 2: Add a closing parenthesis if we have more opens than closes
        # This ensures we never close a parenthesis that wasn't opened
        if close_count < open_count:
            # Add ')' and recurse, incrementing close_count
            backtrack(current_str + ')', open_count, close_count + 1)

    # Start the backtracking with empty string and zero counts
    backtrack("", 0, 0)
    return result
```

```javascript
// Time: O(4^n / √n) - Catalan number growth
// Space: O(n) for recursion stack and O(4^n / √n) for output
function generateParenthesis(n) {
  /**
   * Generate all combinations of well-formed parentheses for n pairs.
   *
   * @param {number} n - Number of pairs of parentheses
   * @return {string[]} - Array of all valid parentheses strings
   */
  const result = [];

  /**
   * Recursive backtracking function to build valid parentheses strings.
   *
   * @param {string} currentStr - The string being built
   * @param {number} openCount - Number of '(' used so far
   * @param {number} closeCount - Number of ')' used so far
   */
  function backtrack(currentStr, openCount, closeCount) {
    // Base case: if we've used all n pairs
    if (currentStr.length === 2 * n) {
      result.push(currentStr);
      return;
    }

    // Option 1: Add an opening parenthesis if we haven't used all n
    if (openCount < n) {
      // Add '(' and recurse, incrementing openCount
      backtrack(currentStr + "(", openCount + 1, closeCount);
    }

    // Option 2: Add a closing parenthesis if we have more opens than closes
    // This ensures we never close a parenthesis that wasn't opened
    if (closeCount < openCount) {
      // Add ')' and recurse, incrementing closeCount
      backtrack(currentStr + ")", openCount, closeCount + 1);
    }
  }

  // Start the backtracking with empty string and zero counts
  backtrack("", 0, 0);
  return result;
}
```

```java
// Time: O(4^n / √n) - Catalan number growth
// Space: O(n) for recursion stack and O(4^n / √n) for output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> generateParenthesis(int n) {
        /**
         * Generate all combinations of well-formed parentheses for n pairs.
         *
         * @param n Number of pairs of parentheses
         * @return List of all valid parentheses strings
         */
        List<String> result = new ArrayList<>();
        backtrack(result, "", 0, 0, n);
        return result;
    }

    /**
     * Recursive backtracking function to build valid parentheses strings.
     *
     * @param result List to store valid combinations
     * @param currentStr The string being built
     * @param openCount Number of '(' used so far
     * @param closeCount Number of ')' used so far
     * @param n Total number of pairs needed
     */
    private void backtrack(List<String> result, String currentStr,
                          int openCount, int closeCount, int n) {
        // Base case: if we've used all n pairs
        if (currentStr.length() == 2 * n) {
            result.add(currentStr);
            return;
        }

        // Option 1: Add an opening parenthesis if we haven't used all n
        if (openCount < n) {
            // Add '(' and recurse, incrementing openCount
            backtrack(result, currentStr + "(", openCount + 1, closeCount, n);
        }

        // Option 2: Add a closing parenthesis if we have more opens than closes
        // This ensures we never close a parenthesis that wasn't opened
        if (closeCount < openCount) {
            // Add ')' and recurse, incrementing closeCount
            backtrack(result, currentStr + ")", openCount, closeCount + 1, n);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(4^n / √n)`  
This is the asymptotic growth rate of the Catalan numbers. The exact number of valid parentheses strings for `n` pairs is the nth Catalan number: `C_n = (1/(n+1)) * (2n choose n)`. Using Stirling's approximation, this simplifies to `O(4^n / (n√n))`. We generate each valid sequence exactly once, and building each sequence takes `O(2n) = O(n)` time, so the total is `O(n * 4^n / √n)`, which is still `O(4^n / √n)` asymptotically.

**Space Complexity:** `O(n)` for the recursion stack, plus `O(4^n / √n)` for storing the output.  
The recursion depth is at most `2n` (when we build the complete string), but more precisely it's `O(n)` since we stop at depth `2n`. The space needed to store all results is proportional to the number of results times their average length, which is `O(n * 4^n / √n)`.

## Common Mistakes

1. **Forgetting the second condition for adding closing parentheses:** Some candidates only check `close_count < n` instead of `close_count < open_count`. This would generate invalid sequences like `"))(("`. Remember: you can only close a parenthesis if there's an unmatched opening parenthesis.

2. **Using a global string and not backtracking properly:** If you modify a single string in place (using `list.append()` in Python or `StringBuilder` in Java), you must remember to undo your changes after the recursive call. The cleaner approach shown above creates new strings at each step, avoiding this issue entirely.

3. **Incorrect base case condition:** Using `open_count == n and close_count == n` instead of `len(current_str) == 2 * n`. While both work, the length check is more intuitive and less error-prone.

4. **Not understanding why we need both conditions:** Some candidates think "if I can add an opening, I should always add it first" or similar heuristic approaches. The backtracking explores both possibilities systematically, which is necessary to find all solutions.

## When You'll See This Pattern

The backtracking pattern used here appears in many combinatorial generation problems:

1. **Letter Combinations of a Phone Number (LeetCode 17):** Similar structure - at each step, you choose which letter to add for the current digit, building the string recursively.

2. **Permutations (LeetCode 46):** Generating all permutations uses backtracking where at each step you choose which unused element to add next.

3. **Subsets (LeetCode 78):** For each element, you have two choices: include it or exclude it, similar to our choice of adding `(` or `)` at each position.

4. **Combination Sum (LeetCode 39):** Another backtracking problem where you build combinations that sum to a target, choosing at each step whether to include more of a candidate.

The key signature is: "Generate all possible X" where X has constraints that can be checked incrementally as you build the solution.

## Key Takeaways

1. **Backtracking is ideal for combinatorial generation:** When you need to generate all valid configurations subject to constraints, backtracking lets you build solutions incrementally and prune invalid branches early.

2. **Track state to enforce constraints incrementally:** Instead of checking validity only at the end, track counts (like `open_count` and `close_count`) that let you know what moves are valid at each step.

3. **The Catalan number sequence appears in parentheses problems:** The number of valid parentheses strings for n pairs is the nth Catalan number. Recognizing this can help you estimate the output size and complexity.

**Related problems:** [Letter Combinations of a Phone Number](/problem/letter-combinations-of-a-phone-number), [Valid Parentheses](/problem/valid-parentheses), [Check if a Parentheses String Can Be Valid](/problem/check-if-a-parentheses-string-can-be-valid)
