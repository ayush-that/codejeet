---
title: "How to Solve Minimum Cost Good Caption — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost Good Caption. Hard difficulty, 20.5% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-09-21"
category: "dsa-patterns"
tags: ["minimum-cost-good-caption", "string", "dynamic-programming", "hard"]
---

# How to Solve Minimum Cost Good Caption

This problem asks us to transform a string into a "good caption" where every character appears in groups of at least 3 consecutive identical characters, with the minimum possible cost. The cost is calculated as the sum of absolute differences between the original and transformed characters' ASCII values. What makes this problem challenging is that we need to consider overlapping decisions about which characters to change and how to group them, which naturally points toward dynamic programming.

## Visual Walkthrough

Let's trace through a small example: `caption = "aaab"` with target groups of at least 3.

Our goal is to transform this into a good caption with minimum cost. Let's think about the possibilities:

1. **Current state**: `"aaab"`
   - The first three 'a's already form a valid group (length 3)
   - The 'b' at the end is alone (length 1), which is invalid

2. **Options for the 'b'**:
   - **Option A**: Change 'b' to 'a' to extend the existing 'a' group
     - Result: `"aaaa"` (cost = |'b' - 'a'| = 1)
     - This creates a single group of 4 'a's, which is valid
   - **Option B**: Change 'b' to some other character and add two more of that character
     - But we only have one position, so we'd need to change existing characters
     - This would be more expensive

3. **Let's try a more complex example**: `caption = "abbbc"`
   - We have a 'b' group of length 3 (valid)
   - We have single 'a' and 'c' characters (both invalid)

   Possible transformations:
   - Change 'a' to 'b': `"bbbbc"` (cost = 1)
   - Now we have 'b' group of length 4 (valid) and 'c' alone (invalid)
   - Change 'c' to 'b': `"bbbbb"` (total cost = 1 + 1 = 2)

   Alternative:
   - Change 'a' to 'c': `"cbbbc"` (cost = 2)
   - Change 'b's to 'c': `"ccccc"` (additional cost = 3 × 1 = 3, total = 5) - worse

The key insight is that we need to consider all possible groupings and character choices, which leads us to dynamic programming.

## Brute Force Approach

A naive approach would be to try all possible transformations:

1. For each position, try keeping the character or changing it to any of 26 letters
2. Check if the resulting string has all groups of at least 3
3. Track the minimum cost

However, this is astronomically expensive:

- For a string of length `n`, there are `26^n` possible transformed strings
- Checking each one takes `O(n)` time
- Total: `O(26^n × n)`, completely infeasible even for small `n`

Even a slightly better brute force would try to identify invalid groups and fix them, but this gets complicated because fixing one group might break another or create new opportunities. The overlapping subproblems (decisions about one group affect neighboring groups) suggest dynamic programming is the right approach.

## Optimized Approach

The key insight is that we can use dynamic programming where our state tracks:

1. Current position in the string
2. Current character we're using
3. How many consecutive occurrences of this character we have so far

**DP State Definition**:
Let `dp[i][c][k]` = minimum cost to process the first `i` characters, ending with character `c`, with exactly `k` consecutive `c` characters at the end.

**State Transitions**:
For position `i` and character `c`:

1. **Continue the same character**: If we choose the same character as at position `i-1`
   - `k` increases by 1 (but can't exceed 3, since groups longer than 3 can be treated as exactly 3 for DP purposes)
   - Cost: `abs(ord(caption[i]) - ord(c))`
2. **Start a new character**: If we choose a different character from the previous one
   - We must have completed a valid group (k ≥ 3) before starting a new one
   - New `k` starts at 1
   - Cost: `abs(ord(caption[i]) - ord(new_c))`

**Why k only needs to go up to 3**:
Once we have 3 consecutive identical characters, the group is valid. Having more than 3 doesn't change the validity, so we can cap `k` at 3 to reduce state space.

**Base Case**:
At position 0 (first character), we can choose any character with `k = 1`.

**Answer**:
After processing all characters, we need all groups to be valid, so we look for states with `k ≥ 3`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n × 26 × 3) = O(n) | Space: O(n × 26 × 3) = O(n)
def minCostGoodCaption(caption: str) -> int:
    """
    Returns the minimum cost to transform the caption into a good caption
    where every character appears in groups of at least 3 consecutive occurrences.
    """
    n = len(caption)
    if n == 0:
        return 0

    # dp[i][c][k] = min cost for first i chars, ending with char c, with k consecutive c's
    # We only need k from 1 to 3 (since k >= 3 means valid group)
    # Initialize with infinity
    INF = float('inf')
    dp = [[[INF] * 4 for _ in range(26)] for _ in range(n)]

    # Base case: first character
    for c in range(26):
        char_cost = abs(ord(caption[0]) - (ord('a') + c))
        dp[0][c][1] = char_cost

    # Fill DP table
    for i in range(1, n):
        for c in range(26):
            current_char = chr(ord('a') + c)
            cost_to_change = abs(ord(caption[i]) - ord(current_char))

            # Case 1: Continue with same character as previous
            for k in range(1, 4):
                if dp[i-1][c][k] < INF:
                    # Can continue the streak, but cap at 3
                    new_k = min(k + 1, 3)
                    dp[i][c][new_k] = min(dp[i][c][new_k],
                                         dp[i-1][c][k] + cost_to_change)

            # Case 2: Start new character (previous group must be valid: k >= 3)
            for prev_c in range(26):
                if prev_c == c:
                    continue  # Same character handled above

                # Check if previous character ended with valid group (k >= 3)
                for k in range(3, 4):  # Only k = 3 is valid for ending a group
                    if dp[i-1][prev_c][k] < INF:
                        # Start new character with streak 1
                        dp[i][c][1] = min(dp[i][c][1],
                                         dp[i-1][prev_c][k] + cost_to_change)

    # Find minimum cost among valid endings (k >= 3)
    min_cost = INF
    for c in range(26):
        for k in range(3, 4):
            min_cost = min(min_cost, dp[n-1][c][k])

    return min_cost
```

```javascript
// Time: O(n × 26 × 3) = O(n) | Space: O(n × 26 × 3) = O(n)
function minCostGoodCaption(caption) {
  /**
   * Returns the minimum cost to transform the caption into a good caption
   * where every character appears in groups of at least 3 consecutive occurrences.
   */
  const n = caption.length;
  if (n === 0) return 0;

  // dp[i][c][k] = min cost for first i chars, ending with char c, with k consecutive c's
  // We only need k from 1 to 3 (since k >= 3 means valid group)
  const INF = Number.MAX_SAFE_INTEGER;

  // Initialize 3D DP array
  const dp = Array(n)
    .fill()
    .map(() =>
      Array(26)
        .fill()
        .map(() => Array(4).fill(INF))
    );

  // Base case: first character
  for (let c = 0; c < 26; c++) {
    const charCost = Math.abs(caption.charCodeAt(0) - ("a".charCodeAt(0) + c));
    dp[0][c][1] = charCost;
  }

  // Fill DP table
  for (let i = 1; i < n; i++) {
    for (let c = 0; c < 26; c++) {
      const currentChar = String.fromCharCode("a".charCodeAt(0) + c);
      const costToChange = Math.abs(caption.charCodeAt(i) - currentChar.charCodeAt(0));

      // Case 1: Continue with same character as previous
      for (let k = 1; k <= 3; k++) {
        if (dp[i - 1][c][k] < INF) {
          // Can continue the streak, but cap at 3
          const newK = Math.min(k + 1, 3);
          dp[i][c][newK] = Math.min(dp[i][c][newK], dp[i - 1][c][k] + costToChange);
        }
      }

      // Case 2: Start new character (previous group must be valid: k >= 3)
      for (let prevC = 0; prevC < 26; prevC++) {
        if (prevC === c) continue; // Same character handled above

        // Check if previous character ended with valid group (k >= 3)
        for (let k = 3; k <= 3; k++) {
          // Only k = 3 is valid for ending a group
          if (dp[i - 1][prevC][k] < INF) {
            // Start new character with streak 1
            dp[i][c][1] = Math.min(dp[i][c][1], dp[i - 1][prevC][k] + costToChange);
          }
        }
      }
    }
  }

  // Find minimum cost among valid endings (k >= 3)
  let minCost = INF;
  for (let c = 0; c < 26; c++) {
    for (let k = 3; k <= 3; k++) {
      minCost = Math.min(minCost, dp[n - 1][c][k]);
    }
  }

  return minCost;
}
```

```java
// Time: O(n × 26 × 3) = O(n) | Space: O(n × 26 × 3) = O(n)
class Solution {
    public int minCostGoodCaption(String caption) {
        /**
         * Returns the minimum cost to transform the caption into a good caption
         * where every character appears in groups of at least 3 consecutive occurrences.
         */
        int n = caption.length();
        if (n == 0) return 0;

        // dp[i][c][k] = min cost for first i chars, ending with char c, with k consecutive c's
        // We only need k from 1 to 3 (since k >= 3 means valid group)
        final int INF = Integer.MAX_VALUE / 2;  // Avoid overflow
        int[][][] dp = new int[n][26][4];

        // Initialize with infinity
        for (int i = 0; i < n; i++) {
            for (int c = 0; c < 26; c++) {
                for (int k = 0; k <= 3; k++) {
                    dp[i][c][k] = INF;
                }
            }
        }

        // Base case: first character
        for (int c = 0; c < 26; c++) {
            int charCost = Math.abs(caption.charAt(0) - ('a' + c));
            dp[0][c][1] = charCost;
        }

        // Fill DP table
        for (int i = 1; i < n; i++) {
            for (int c = 0; c < 26; c++) {
                char currentChar = (char) ('a' + c);
                int costToChange = Math.abs(caption.charAt(i) - currentChar);

                // Case 1: Continue with same character as previous
                for (int k = 1; k <= 3; k++) {
                    if (dp[i-1][c][k] < INF) {
                        // Can continue the streak, but cap at 3
                        int newK = Math.min(k + 1, 3);
                        dp[i][c][newK] = Math.min(dp[i][c][newK],
                                                dp[i-1][c][k] + costToChange);
                    }
                }

                // Case 2: Start new character (previous group must be valid: k >= 3)
                for (int prevC = 0; prevC < 26; prevC++) {
                    if (prevC == c) continue;  // Same character handled above

                    // Check if previous character ended with valid group (k >= 3)
                    for (int k = 3; k <= 3; k++) {  // Only k = 3 is valid for ending a group
                        if (dp[i-1][prevC][k] < INF) {
                            // Start new character with streak 1
                            dp[i][c][1] = Math.min(dp[i][c][1],
                                                 dp[i-1][prevC][k] + costToChange);
                        }
                    }
                }
            }
        }

        // Find minimum cost among valid endings (k >= 3)
        int minCost = INF;
        for (int c = 0; c < 26; c++) {
            for (int k = 3; k <= 3; k++) {
                minCost = Math.min(minCost, dp[n-1][c][k]);
            }
        }

        return minCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × 26 × 3) = O(78n) = O(n)

- We have `n` positions to process
- For each position, we consider 26 possible characters
- For each character, we consider up to 3 possible streak lengths
- The constant factors (26 × 3 = 78) are manageable

**Space Complexity**: O(n × 26 × 3) = O(n)

- We store a 3D DP table of size `n × 26 × 4`
- We can optimize to O(26 × 3) = O(1) space by only storing the previous row, but the O(n) space is acceptable for most constraints

**Why this is efficient**:

- The brute force had exponential complexity
- By recognizing the three key dimensions (position, character, streak length), we reduce the problem to polynomial time
- Capping streak length at 3 is the crucial optimization that makes this feasible

## Common Mistakes

1. **Not capping streak length at 3**: Some candidates try to track streak length up to `n`, which gives O(n²) states and makes the solution too slow. Remember: once you have 3 consecutive characters, the group is valid. More than 3 doesn't help.

2. **Forgetting to require valid groups when switching characters**: When starting a new character, you must ensure the previous group was valid (had at least 3 consecutive characters). Missing this check allows invalid intermediate states.

3. **Incorrect cost calculation**: The cost is the absolute difference in ASCII values, not just 0 or 1. Some candidates mistakenly think it's a binary "change or don't change" problem.

4. **Not handling empty string or very short strings**: For n < 3, it's impossible to form any valid groups unless you change characters to form groups. The base cases need careful handling.

## When You'll See This Pattern

This type of "grouping with constraints" dynamic programming appears in several problems:

1. **Minimum Difficulty of a Job Schedule (LeetCode 1335)**: Similar state definition with days and job difficulty, where you track the maximum difficulty per day.

2. **Paint House II (LeetCode 265)**: Choosing colors for houses with adjacency constraints, though simpler since it only forbids consecutive same colors.

3. **Strange Printer (LeetCode 664)**: Another grouping problem where you print consecutive identical characters together, with a similar DP state tracking character and position.

The common pattern is: when you need to make sequence decisions with constraints on consecutive elements, and decisions overlap, consider DP with state tracking the current "streak" or "group status".

## Key Takeaways

1. **DP state design is crucial**: When dealing with consecutive element constraints, include the current streak length as part of your DP state. This transforms an exponential search into polynomial time.

2. **Cap unnecessary state dimensions**: If a parameter (like streak length) only matters up to a certain value, cap it there to reduce state space. Here, streaks longer than 3 don't provide additional benefit.

3. **Transition logic must enforce constraints**: When designing state transitions, explicitly encode the problem constraints (like requiring valid groups before switching characters).

[Practice this problem on CodeJeet](/problem/minimum-cost-good-caption)
