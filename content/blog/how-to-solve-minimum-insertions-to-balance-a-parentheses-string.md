---
title: "How to Solve Minimum Insertions to Balance a Parentheses String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Insertions to Balance a Parentheses String. Medium difficulty, 53.5% acceptance rate. Topics: String, Stack, Greedy."
date: "2027-10-27"
category: "dsa-patterns"
tags: ["minimum-insertions-to-balance-a-parentheses-string", "string", "stack", "greedy", "medium"]
---

# How to Solve Minimum Insertions to Balance a Parentheses String

This problem asks us to find the minimum number of insertions needed to balance a parentheses string where each `'('` requires **two consecutive `')'`** to be balanced. The twist that makes this interesting is that we're not dealing with the typical 1:1 matching of parentheses, but rather a 1:2 ratio where each opening parenthesis needs two closing ones in a row. This changes the counting logic significantly from standard parentheses balancing problems.

## Visual Walkthrough

Let's trace through the example `s = "(()))"` step by step to build intuition:

**Step-by-step process:**

1. Initialize: `insertions_needed = 0`, `open_needed = 0`
2. Process `'('` at index 0:
   - We need 2 closing parentheses for this opening
   - `open_needed = 2` (we need 2 more `')'`)
3. Process `'('` at index 1:
   - Another opening parenthesis
   - `open_needed = 4` (2 for each opening)
4. Process `')'` at index 2:
   - This could be the first of a pair `'))'`
   - Check if next character is also `')'`
   - Next character at index 3 is `')'`, so we have a valid pair
   - `open_needed = 2` (we used 2 closing parentheses)
5. Process `')'` at index 3:
   - We already counted this as part of the pair at step 4
   - Skip it (we'll handle this in the algorithm)
6. Process `')'` at index 4:
   - This is a single `')'` without a partner
   - We need to insert one more `')'` to make a pair
   - `insertions_needed = 1`
   - `open_needed = 0` (we used up one opening's requirement)

Final result: We need 1 insertion. The balanced string would be `"(())))"`.

## Brute Force Approach

A naive approach might try to generate all possible insertions and check which ones result in a balanced string. For a string of length `n`, we could:

1. Try inserting `'('` or `')'` at every position
2. Check if the resulting string is balanced
3. Track the minimum number of insertions

However, this approach is extremely inefficient. With `n` positions and 2 possible characters to insert, we'd have to check `O(2^n)` possibilities. Even with memoization, this would be too slow for the constraints (strings up to length 10^5).

Another naive approach might try to use a stack in the traditional way, but we'd need to adapt it for the "two consecutive closing parentheses" requirement. Without careful handling, we might end up with incorrect counts or miss edge cases.

## Optimized Approach

The key insight is that we can solve this with a **single pass** using a greedy counting approach. We don't actually need a stack - we just need to track how many closing parentheses we're expecting.

**Core idea:** Maintain two counters:

1. `insertions_needed`: Total insertions required
2. `open_needed`: How many closing parentheses we still need for the currently open parentheses

**Algorithm logic:**

- When we see `'('`:
  - If `open_needed` is odd, we need to insert one `')'` to complete a pair
  - Then add 2 to `open_needed` (this opening needs 2 closing parentheses)
- When we see `')'`:
  - Decrease `open_needed` by 1 (we got one closing)
  - If `open_needed` becomes negative, we have an extra `')'` without an opening
  - Insert one `'('` and reset `open_needed` to 1

At the end, add any remaining `open_needed` to `insertions_needed`.

This greedy approach works because we always make the minimal correction at each step, and local optimal choices lead to a global optimum.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minInsertions(s: str) -> int:
    """
    Calculate minimum insertions to balance parentheses string.
    Each '(' needs two consecutive ')' to be balanced.

    Args:
        s: Input string containing only '(' and ')'

    Returns:
        Minimum number of insertions needed
    """
    insertions_needed = 0  # Total insertions required
    open_needed = 0        # How many closing parentheses we still need

    i = 0
    n = len(s)

    while i < n:
        if s[i] == '(':
            # If open_needed is odd, we need to insert one ')'
            # to complete a pair before starting a new '('
            if open_needed % 2 == 1:
                insertions_needed += 1  # Insert one ')'
                open_needed -= 1        # We've satisfied one closing

            # Each '(' needs 2 closing parentheses
            open_needed += 2
            i += 1
        else:  # s[i] == ')'
            # Check if we have two consecutive ')'
            if i + 1 < n and s[i + 1] == ')':
                # We have a valid pair '))'
                open_needed -= 2
                i += 2  # Skip both ')'
            else:
                # We have a single ')', need to insert another ')'
                insertions_needed += 1  # Insert one ')'
                open_needed -= 1        # Count this as one closing
                i += 1

            # If open_needed is negative, we have more ')' than needed
            # This means we need to insert a '('
            if open_needed < 0:
                insertions_needed += 1  # Insert one '('
                open_needed += 2        # Reset open_needed for the inserted '('

    # Add any remaining closing parentheses needed
    insertions_needed += open_needed

    return insertions_needed
```

```javascript
// Time: O(n) | Space: O(1)
function minInsertions(s) {
  /**
   * Calculate minimum insertions to balance parentheses string.
   * Each '(' needs two consecutive ')' to be balanced.
   *
   * @param {string} s - Input string containing only '(' and ')'
   * @return {number} Minimum number of insertions needed
   */
  let insertionsNeeded = 0; // Total insertions required
  let openNeeded = 0; // How many closing parentheses we still need

  let i = 0;
  const n = s.length;

  while (i < n) {
    if (s[i] === "(") {
      // If openNeeded is odd, we need to insert one ')'
      // to complete a pair before starting a new '('
      if (openNeeded % 2 === 1) {
        insertionsNeeded++; // Insert one ')'
        openNeeded--; // We've satisfied one closing
      }

      // Each '(' needs 2 closing parentheses
      openNeeded += 2;
      i++;
    } else {
      // s[i] === ')'
      // Check if we have two consecutive ')'
      if (i + 1 < n && s[i + 1] === ")") {
        // We have a valid pair '))'
        openNeeded -= 2;
        i += 2; // Skip both ')'
      } else {
        // We have a single ')', need to insert another ')'
        insertionsNeeded++; // Insert one ')'
        openNeeded--; // Count this as one closing
        i++;
      }

      // If openNeeded is negative, we have more ')' than needed
      // This means we need to insert a '('
      if (openNeeded < 0) {
        insertionsNeeded++; // Insert one '('
        openNeeded += 2; // Reset openNeeded for the inserted '('
      }
    }
  }

  // Add any remaining closing parentheses needed
  insertionsNeeded += openNeeded;

  return insertionsNeeded;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minInsertions(String s) {
        /**
         * Calculate minimum insertions to balance parentheses string.
         * Each '(' needs two consecutive ')' to be balanced.
         *
         * @param s Input string containing only '(' and ')'
         * @return Minimum number of insertions needed
         */
        int insertionsNeeded = 0;  // Total insertions required
        int openNeeded = 0;        // How many closing parentheses we still need

        int i = 0;
        int n = s.length();

        while (i < n) {
            if (s.charAt(i) == '(') {
                // If openNeeded is odd, we need to insert one ')'
                // to complete a pair before starting a new '('
                if (openNeeded % 2 == 1) {
                    insertionsNeeded++;  // Insert one ')'
                    openNeeded--;        // We've satisfied one closing
                }

                // Each '(' needs 2 closing parentheses
                openNeeded += 2;
                i++;
            } else {  // s.charAt(i) == ')'
                // Check if we have two consecutive ')'
                if (i + 1 < n && s.charAt(i + 1) == ')') {
                    // We have a valid pair '))'
                    openNeeded -= 2;
                    i += 2;  // Skip both ')'
                } else {
                    // We have a single ')', need to insert another ')'
                    insertionsNeeded++;  // Insert one ')'
                    openNeeded--;        // Count this as one closing
                    i++;
                }

                // If openNeeded is negative, we have more ')' than needed
                // This means we need to insert a '('
                if (openNeeded < 0) {
                    insertionsNeeded++;  // Insert one '('
                    openNeeded += 2;     // Reset openNeeded for the inserted '('
                }
            }
        }

        // Add any remaining closing parentheses needed
        insertionsNeeded += openNeeded;

        return insertionsNeeded;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the string of length `n`
- Each character is processed at most once (we skip ahead when we find `'))'`)
- All operations inside the loop are O(1)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for counters
- No additional data structures that grow with input size
- The algorithm modifies no data, only reads the input

## Common Mistakes

1. **Forgetting to handle odd `open_needed` before processing `'('`:**
   - When `open_needed` is odd (e.g., 1), it means we have a dangling single `')'`
   - We need to insert another `')'` before starting a new `'('`
   - Fix: Check `open_needed % 2 == 1` before processing `'('`

2. **Not checking for two consecutive `')'` properly:**
   - The problem requires **consecutive** `'))'`, not just two `')'` anywhere
   - Candidates might try to match any two `')'` regardless of position
   - Fix: Check `s[i + 1] == ')'` when you see `')'` at position `i`

3. **Incorrectly resetting `open_needed` when it becomes negative:**
   - When `open_needed < 0`, it means we have more `')'` than expected
   - We need to insert a `'('` and adjust `open_needed` to 1 (not 0 or 2)
   - Fix: Insert `'('`, then set `open_needed += 2` (since the new `'('` needs 2 `')'`)

4. **Missing the final addition of remaining `open_needed`:**
   - After processing all characters, we might still need closing parentheses
   - These need to be added to the total insertions
   - Fix: Add `open_needed` to `insertions_needed` at the end

## When You'll See This Pattern

This problem uses a **greedy counting approach** for parentheses balancing, which appears in several related problems:

1. **Minimum Add to Make Parentheses Valid (LeetCode 921):**
   - Similar counting logic but with 1:1 matching instead of 1:2
   - Uses `balance` counter that tracks net opening parentheses

2. **Minimum Number of Swaps to Make the String Balanced (LeetCode 1963):**
   - Also uses a balance counter approach
   - Tracks imbalance and calculates minimum swaps needed

3. **Valid Parenthesis String (LeetCode 678):**
   - More complex with wildcard `'*'` characters
   - Uses range tracking (min and max possible balance)

The pattern to recognize: when you need to validate or fix parentheses strings, consider whether you can use a counter instead of a stack. If the problem allows greedy corrections (local fixes lead to global optimum), a single-pass counting solution is often optimal.

## Key Takeaways

1. **Greedy counting beats stack for certain parentheses problems:** When you only need to track the net balance (not which specific parentheses match), a simple counter is more efficient than a stack.

2. **Look for the matching pattern:** This problem's twist is the 1:2 matching requirement. Always identify the exact matching rules before designing your algorithm.

3. **Handle edge cases incrementally:** The algorithm fixes imbalances as it goes - inserting missing characters immediately when an imbalance is detected. This incremental approach often leads to optimal solutions for parentheses problems.

Related problems: [Minimum Number of Swaps to Make the String Balanced](/problem/minimum-number-of-swaps-to-make-the-string-balanced)
