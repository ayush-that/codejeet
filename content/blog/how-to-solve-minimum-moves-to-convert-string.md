---
title: "How to Solve Minimum Moves to Convert String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Moves to Convert String. Easy difficulty, 57.7% acceptance rate. Topics: String, Greedy."
date: "2028-04-29"
category: "dsa-patterns"
tags: ["minimum-moves-to-convert-string", "string", "greedy", "easy"]
---

# How to Solve Minimum Moves to Convert String

This problem asks us to find the minimum number of operations needed to convert all characters in a binary string to 'O', where each operation converts three consecutive characters to 'O' (though 'O's remain unchanged). What makes this problem interesting is that it appears to require complex planning, but actually has a simple greedy solution once you recognize the optimal pattern.

## Visual Walkthrough

Let's trace through an example step-by-step to build intuition. Consider the string `"XXOXOXXX"`.

**Step 1:** Start scanning from left to right

- Index 0: 'X' found → we need to convert it
- Best move: Convert positions 0, 1, 2 (all become 'O')
- String becomes `"OOO OXOXXX"` (space added for clarity)
- Moves: 1

**Step 2:** Continue scanning from where we left off

- Index 3: Already 'O' → skip
- Index 4: 'X' found → need to convert it
- Best move: Convert positions 4, 5, 6 (positions 4, 5, 6 become 'O')
- String becomes `"OOO OOOOOX"` (space added for clarity)
- Moves: 2

**Step 3:** Continue scanning

- Index 7: 'X' found → need to convert it
- But we're at the end! We can convert positions 5, 6, 7 (all become 'O')
- String becomes `"OOO OOOOOO"` (space added for clarity)
- Moves: 3

**Key insight:** Whenever we encounter an 'X', the optimal strategy is to convert it immediately by flipping it and the next two characters. This works because:

1. Delaying the conversion doesn't help - we'll still need to convert that 'X' eventually
2. Converting immediately might help with future 'X's in the same window
3. There's no downside to converting early since 'O's remain unchanged

## Brute Force Approach

A naive approach might try to consider all possible sequences of moves, but that would be exponential in complexity. Another brute force approach would be to repeatedly scan the string looking for 'X's and convert them, but this would be O(n²) in the worst case.

However, the problem's constraints (n ≤ 1000) and the nature of the operation suggest we need something more efficient. The key observation is that we don't need to backtrack or reconsider decisions - a greedy left-to-right approach works perfectly.

## Optimal Solution

The optimal solution uses a greedy approach: scan from left to right, and whenever you find an 'X', increment the move counter and "skip ahead" 3 positions (since you just converted this position and the next two). This works because converting an 'X' immediately is always optimal - delaying it doesn't provide any benefit.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumMoves(s: str) -> int:
    """
    Calculate minimum moves to convert all 'X' to 'O' in string s.
    Each move converts three consecutive characters to 'O'.

    Approach: Greedy scan from left to right.
    Whenever we encounter an 'X', we must convert it.
    The optimal move is to convert it immediately along with
    the next two characters, then skip ahead 3 positions.
    """
    n = len(s)
    moves = 0
    i = 0

    # Scan through the string
    while i < n:
        # If current character is 'X', we need to convert it
        if s[i] == 'X':
            # Make a move that converts this position and next two
            moves += 1
            # Skip ahead 3 positions since we just converted
            # positions i, i+1, and i+2 (or to end of string)
            i += 3
        else:
            # Current character is already 'O', just move to next
            i += 1

    return moves
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Calculate minimum moves to convert all 'X' to 'O' in string s.
 * Each move converts three consecutive characters to 'O'.
 *
 * Approach: Greedy scan from left to right.
 * Whenever we encounter an 'X', we must convert it.
 * The optimal move is to convert it immediately along with
 * the next two characters, then skip ahead 3 positions.
 */
function minimumMoves(s) {
  const n = s.length;
  let moves = 0;
  let i = 0;

  // Scan through the string
  while (i < n) {
    // If current character is 'X', we need to convert it
    if (s[i] === "X") {
      // Make a move that converts this position and next two
      moves++;
      // Skip ahead 3 positions since we just converted
      // positions i, i+1, and i+2 (or to end of string)
      i += 3;
    } else {
      // Current character is already 'O', just move to next
      i++;
    }
  }

  return moves;
}
```

```java
// Time: O(n) | Space: O(1)
/**
 * Calculate minimum moves to convert all 'X' to 'O' in string s.
 * Each move converts three consecutive characters to 'O'.
 *
 * Approach: Greedy scan from left to right.
 * Whenever we encounter an 'X', we must convert it.
 * The optimal move is to convert it immediately along with
 * the next two characters, then skip ahead 3 positions.
 */
public int minimumMoves(String s) {
    int n = s.length();
    int moves = 0;
    int i = 0;

    // Scan through the string
    while (i < n) {
        // If current character is 'X', we need to convert it
        if (s.charAt(i) == 'X') {
            // Make a move that converts this position and next two
            moves++;
            // Skip ahead 3 positions since we just converted
            // positions i, i+1, and i+2 (or to end of string)
            i += 3;
        } else {
            // Current character is already 'O', just move to next
            i++;
        }
    }

    return moves;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the string exactly once from left to right
- Each character is examined at most once
- The `i += 3` skip ensures we don't revisit characters unnecessarily

**Space Complexity: O(1)**

- We only use a constant amount of extra space (variables for moves, index, and length)
- No additional data structures are needed
- The input string is not modified

## Common Mistakes

1. **Overthinking with dynamic programming**: Some candidates try to use DP to track all possible move sequences, which is unnecessary and inefficient. The greedy approach is provably optimal because there's never a benefit to delaying conversion of an 'X'.

2. **Incorrect index handling near the end**: When encountering an 'X' in the last 1-2 positions, you still need to convert it. The solution handles this correctly because we still increment moves and skip ahead 3, even if it goes past the string length.

3. **Forgetting that 'O's remain unchanged**: Some candidates think they need to avoid converting 'O's, but the problem states that converting an 'O' leaves it unchanged, so there's no downside to including 'O's in our conversion window.

4. **Using a for loop with manual index adjustment**: Attempting to use `for (int i = 0; i < n; i++)` and then manually adjusting `i` inside the loop can lead to off-by-one errors. Using a `while` loop with explicit index control is cleaner.

## When You'll See This Pattern

This greedy left-to-right scanning pattern appears in many string manipulation problems:

1. **Minimum Number of K-Consecutive Bit Flips** (LeetCode 995): Similar concept but with bit flipping and circular reasoning about optimal strategy.

2. **Minimum Swaps to Make Strings Equal** (LeetCode 1247): Another greedy string problem where you make optimal local decisions.

3. **Candy** (LeetCode 135): While more complex, it also uses a greedy left-to-right then right-to-left scan to make optimal decisions.

The core pattern is: when you can make a local decision that doesn't negatively impact future decisions, a greedy approach often works. Look for problems where actions have "forward-only" effects or where delaying an action provides no benefit.

## Key Takeaways

- **Greedy can be optimal**: When actions don't have negative consequences for future decisions, greedy algorithms often provide optimal solutions. The key insight here is that converting an 'X' immediately is always at least as good as delaying it.

- **Left-to-right scanning**: Many string problems can be solved by processing characters sequentially and making decisions based on what you've seen so far. This pattern appears in problems involving conversions, validations, and transformations.

- **Skip optimization**: When an action affects multiple positions, you can often skip ahead in your scan to avoid redundant work. This is more efficient than examining every character multiple times.

**Related problems:** [Minimum Cost to Convert String I](/problem/minimum-cost-to-convert-string-i), [Minimum Cost to Convert String II](/problem/minimum-cost-to-convert-string-ii)
