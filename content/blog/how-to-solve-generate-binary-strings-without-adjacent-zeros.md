---
title: "How to Solve Generate Binary Strings Without Adjacent Zeros — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Generate Binary Strings Without Adjacent Zeros. Medium difficulty, 88.2% acceptance rate. Topics: String, Backtracking, Bit Manipulation."
date: "2027-11-19"
category: "dsa-patterns"
tags:
  [
    "generate-binary-strings-without-adjacent-zeros",
    "string",
    "backtracking",
    "bit-manipulation",
    "medium",
  ]
---

# How to Solve Generate Binary Strings Without Adjacent Zeros

This problem asks us to generate all binary strings of length `n` where no two zeros appear consecutively. The condition "all substrings of length 2 contain at least one '1'" is equivalent to saying "no '00' substring exists." This constraint makes the problem interesting because we can't simply generate all 2ⁿ binary strings—we need to filter or construct only valid ones efficiently.

## Visual Walkthrough

Let's trace through `n = 3` to build intuition:

We need to build strings of length 3 where no two zeros are adjacent.

**Step 1:** Start with an empty string `""`

**Step 2:** First character can be either '0' or '1':

- If we choose '0', next character cannot be '0' (must be '1')
- If we choose '1', next character can be either '0' or '1'

**Step 3:** Build recursively:

1. Start with '0':
   - Next must be '1' → '01'
   - Last character: after '1', can be '0' or '1'
     - '010' ✓ valid
     - '011' ✓ valid

2. Start with '1':
   - Next can be '0' or '1'
     - '10': next can be '0' or '1'
       - '100' ✗ invalid (has '00')
       - '101' ✓ valid
     - '11': next can be '0' or '1'
       - '110' ✓ valid
       - '111' ✓ valid

**Valid strings for n=3:** `["010", "011", "101", "110", "111"]`

Notice the pattern: whenever we place a '0', the next character is forced to be '1'. This observation is key to an efficient solution.

## Brute Force Approach

A naive approach would generate all 2ⁿ binary strings and filter out those containing "00":

1. Generate all binary strings from `"0"*n` to `"1"*n`
2. Check each string for the substring "00"
3. Keep only those without "00"

**Why this fails:**

- Time complexity: O(n × 2ⁿ) — generating 2ⁿ strings, each of length n, and checking each for "00"
- For n=20, that's ~20 million operations, which is too slow
- We're wasting time generating invalid strings only to discard them

The brute force teaches us that we need to construct only valid strings from the start, not generate all and filter.

## Optimized Approach

The key insight is **backtracking with constraint propagation**:

1. **Decision at each position:** Choose '0' or '1'
2. **Constraint:** If we choose '0', the next position must be '1'
3. **State tracking:** We need to know if the last character was '0' to enforce the constraint

We can think of this as a depth-first search through the decision tree:

- At each step, if last character wasn't '0', we can choose '0' or '1'
- If last character was '0', we must choose '1'
- We build the string character by character until length n is reached

This approach only explores valid paths, avoiding the exponential blowup of generating all strings.

## Optimal Solution

We implement backtracking with a recursive function that builds valid strings incrementally.

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack + O(n × 2^n) for output
def generateBinaryStrings(n):
    """
    Generate all binary strings of length n without consecutive zeros.

    Args:
        n: Length of binary strings to generate

    Returns:
        List of valid binary strings
    """
    result = []

    def backtrack(current, last_was_zero):
        """
        Recursively build valid binary strings.

        Args:
            current: The string built so far
            last_was_zero: Boolean indicating if last character was '0'
        """
        # Base case: if we've reached length n, add to results
        if len(current) == n:
            result.append(current)
            return

        # If last character was '0', we must add '1'
        if last_was_zero:
            backtrack(current + '1', False)
        else:
            # Last character wasn't '0', so we have two choices:
            # 1. Add '0' (and mark that last character is now zero)
            backtrack(current + '0', True)
            # 2. Add '1' (last character is not zero)
            backtrack(current + '1', False)

    # Start with empty string, last character wasn't zero
    backtrack("", False)
    return result
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack + O(n × 2^n) for output
function generateBinaryStrings(n) {
  /**
   * Generate all binary strings of length n without consecutive zeros.
   *
   * @param {number} n - Length of binary strings to generate
   * @return {string[]} - Array of valid binary strings
   */
  const result = [];

  /**
   * Recursively build valid binary strings.
   *
   * @param {string} current - The string built so far
   * @param {boolean} lastWasZero - Whether last character was '0'
   */
  function backtrack(current, lastWasZero) {
    // Base case: if we've reached length n, add to results
    if (current.length === n) {
      result.push(current);
      return;
    }

    // If last character was '0', we must add '1'
    if (lastWasZero) {
      backtrack(current + "1", false);
    } else {
      // Last character wasn't '0', so we have two choices:
      // 1. Add '0' (and mark that last character is now zero)
      backtrack(current + "0", true);
      // 2. Add '1' (last character is not zero)
      backtrack(current + "1", false);
    }
  }

  // Start with empty string, last character wasn't zero
  backtrack("", false);
  return result;
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack + O(n × 2^n) for output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> generateBinaryStrings(int n) {
        /**
         * Generate all binary strings of length n without consecutive zeros.
         *
         * @param n Length of binary strings to generate
         * @return List of valid binary strings
         */
        List<String> result = new ArrayList<>();

        // Start backtracking with empty string
        backtrack(result, new StringBuilder(), false, n);
        return result;
    }

    /**
     * Recursively build valid binary strings.
     *
     * @param result List to store valid strings
     * @param current StringBuilder for current string being built
     * @param lastWasZero Boolean indicating if last character was '0'
     * @param n Target length of strings
     */
    private void backtrack(List<String> result, StringBuilder current,
                          boolean lastWasZero, int n) {
        // Base case: if we've reached length n, add to results
        if (current.length() == n) {
            result.add(current.toString());
            return;
        }

        // If last character was '0', we must add '1'
        if (lastWasZero) {
            current.append('1');
            backtrack(result, current, false, n);
            current.deleteCharAt(current.length() - 1); // backtrack
        } else {
            // Last character wasn't '0', so we have two choices:

            // 1. Add '0' (and mark that last character is now zero)
            current.append('0');
            backtrack(result, current, true, n);
            current.deleteCharAt(current.length() - 1); // backtrack

            // 2. Add '1' (last character is not zero)
            current.append('1');
            backtrack(result, current, false, n);
            current.deleteCharAt(current.length() - 1); // backtrack
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(2ⁿ)**

- In the worst case (when n is large), we generate approximately F(n+2) strings, where F is the Fibonacci sequence
- This grows exponentially but is much better than brute force O(n × 2ⁿ)
- Each valid string takes O(n) to build, but the number of recursive calls dominates

**Space Complexity: O(n × 2ⁿ) for output + O(n) for recursion stack**

- Output storage: We store all valid strings, each of length n. The number of valid strings is approximately φⁿ/√5 where φ ≈ 1.618 (golden ratio)
- Recursion stack: Depth is n, each frame stores current string and boolean flag

## Common Mistakes

1. **Forgetting to backtrack properly in Java:** When using StringBuilder or similar mutable structures, candidates often forget to remove the last character after recursive calls, leading to incorrect strings accumulating.

2. **Incorrect base case handling:** Some candidates check `if len(current) > n:` instead of `== n`, which can cause infinite recursion or incorrect strings.

3. **Misunderstanding the constraint:** The problem says "all substrings of length 2 contain at least one '1'", which some misinterpret as "every pair must have exactly one '1'". Actually, "11" is valid because it contains a '1' in both positions of the substring.

4. **Inefficient string concatenation:** In Python/JavaScript, using `current + '0'` creates a new string each time, which is fine. But trying to optimize with mutable arrays and forgetting to copy can lead to shared reference bugs.

## When You'll See This Pattern

This **constrained backtracking** pattern appears in many combinatorial generation problems:

1. **Generate Parentheses (LeetCode 22):** Similar constraint—number of closing parentheses cannot exceed opening ones at any prefix.

2. **Letter Combinations of a Phone Number (LeetCode 17):** Building strings from digit mappings, though without the adjacency constraint.

3. **Permutations (LeetCode 46):** Building permutations with the constraint of using each element exactly once.

The core pattern: make choices at each step, enforce constraints immediately (prune invalid branches early), and backtrack to explore all valid possibilities.

## Key Takeaways

1. **Constraint propagation is key:** When a choice restricts future choices (like '0' forces next to be '1'), enforce it immediately during construction rather than checking at the end.

2. **Backtracking template:** This problem follows the classic backtracking pattern—choose, recurse, unchoose. Memorize this pattern for combinatorial problems.

3. **State tracking matters:** Sometimes you need to pass additional information (like `last_was_zero`) to make correct decisions at each step.

Related problems: [Non-negative Integers without Consecutive Ones](/problem/non-negative-integers-without-consecutive-ones)
