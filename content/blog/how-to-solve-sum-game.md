---
title: "How to Solve Sum Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sum Game. Medium difficulty, 49.6% acceptance rate. Topics: Math, String, Greedy, Game Theory."
date: "2030-01-31"
category: "dsa-patterns"
tags: ["sum-game", "math", "string", "greedy", "medium"]
---

# How to Solve Sum Game

This problem presents a game theory challenge where Alice and Bob alternate replacing '?' characters with digits to influence the sum of two halves of a string. The tricky part is determining who wins given optimal play, without simulating every possible move sequence. The key insight is that the game reduces to analyzing the difference between the sums of known digits and the number of question marks in each half.

## Visual Walkthrough

Let's trace through an example: `num = "25?3?0"`

**Step 1: Split the string into halves**

- First half: "25?" (indices 0-2)
- Second half: "3?0" (indices 3-5)

**Step 2: Calculate known sums**

- First half known sum: 2 + 5 = 7
- Second half known sum: 3 + 0 = 3
- Difference: 7 - 3 = 4 (first half leads by 4)

**Step 3: Count question marks**

- First half: 1 question mark
- Second half: 1 question mark
- Difference: 1 - 1 = 0 (equal number of question marks)

**Step 4: Analyze the situation**
With equal question marks in both halves, Alice (who goes first) will try to maximize the difference, while Bob will try to minimize it. Since Alice moves first on a question mark, she'll choose the highest digit (9) for her half, increasing the difference. Bob will then choose the lowest digit (0) for his half, decreasing the difference.

**Step 5: Simulate optimal play**

- Alice picks first half '?' → replaces with 9 → difference becomes 4 + 9 = 13
- Bob picks second half '?' → replaces with 0 → difference becomes 13 - 0 = 13
- Final difference: 13 (not zero)

Since the final difference is not zero, Alice wins. This example shows that with equal question marks, the player who moves first on the remaining question marks has an advantage.

## Brute Force Approach

A naive approach would simulate all possible sequences of moves using recursion or backtracking. At each turn, the current player would try all possible digits (0-9) for each available '?' position, recursively exploring the game tree to determine if they can force a win.

**Why this fails:**

1. **Exponential complexity**: With up to 10⁵ characters and 10 possible digits for each '?', the search space is astronomical.
2. **Redundant calculations**: Many move sequences lead to identical game states (same sum difference and question mark counts).
3. **Time limit exceeded**: Even for moderate inputs, this approach would be far too slow.

The brute force approach is impractical, so we need a mathematical insight to solve this efficiently.

## Optimized Approach

The key insight is that we don't need to simulate individual moves. Instead, we can analyze the game mathematically:

1. **Calculate the current sum difference**: `diff = sum(first_half_known) - sum(second_half_known)`
2. **Count question marks in each half**: `left_q = count('?' in first half)`, `right_q = count('?' in second half)`
3. **Total question marks**: `total_q = left_q + right_q`

**Critical observations:**

- When a player fills a '?' in the first half, they add to `diff` (0-9)
- When a player fills a '?' in the second half, they subtract from `diff` (0-9)
- Alice wants `diff ≠ 0` at the end, Bob wants `diff = 0`

**The optimal strategy:**

- Alice will always choose 9 for her moves in the first half and 0 for her moves in the second half
- Bob will always choose 0 for his moves in the first half and 9 for his moves in the second half
- This creates a "tug of war" where Alice tries to maximize |diff| and Bob tries to minimize it

**Winning conditions:**

1. If `left_q == right_q`: The player who moves last determines the outcome
   - If `diff == 0`: Bob wins (he can maintain balance)
   - If `diff != 0`: Alice wins (she can prevent balance)
2. If `left_q > right_q`: Alice has more moves in the first half
   - She can add up to 9 × extra moves to `diff`
   - Bob can subtract up to 9 × his moves from `diff`
   - Alice wins if she can create an imbalance Bob can't fix
3. If `left_q < right_q`: Symmetric to case 2

The mathematical formula simplifies to: Alice wins if `diff + 4.5 × (left_q - right_q) ≠ 0`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def sumGame(num: str) -> bool:
    """
    Determines if Alice wins the sum game with optimal play.

    Args:
        num: String of digits and '?' of even length

    Returns:
        True if Alice wins, False if Bob wins
    """
    n = len(num)
    half = n // 2

    # Step 1: Calculate sum difference and count question marks
    sum_diff = 0  # sum(first_half) - sum(second_half)
    left_q = 0    # question marks in first half
    right_q = 0   # question marks in second half

    # Process first half
    for i in range(half):
        if num[i] == '?':
            left_q += 1
        else:
            sum_diff += int(num[i])

    # Process second half
    for i in range(half, n):
        if num[i] == '?':
            right_q += 1
        else:
            sum_diff -= int(num[i])

    # Step 2: Apply the winning condition formula
    # Alice wins if the adjusted difference is not zero
    # The formula accounts for optimal play where:
    # - Alice adds 9 for her ? in first half, subtracts 0 for her ? in second half
    # - Bob adds 0 for his ? in first half, subtracts 9 for his ? in second half
    total_q_diff = left_q - right_q

    # If total question marks is odd, Alice wins (she gets the last move)
    if (left_q + right_q) % 2 == 1:
        return True

    # The critical formula: Alice wins if sum_diff != 4.5 * total_q_diff
    # Multiply by 2 to avoid floating point: check if 2*sum_diff != 9*total_q_diff
    return 2 * sum_diff != 9 * total_q_diff
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Determines if Alice wins the sum game with optimal play.
 * @param {string} num - String of digits and '?' of even length
 * @return {boolean} True if Alice wins, False if Bob wins
 */
function sumGame(num) {
  const n = num.length;
  const half = Math.floor(n / 2);

  // Step 1: Calculate sum difference and count question marks
  let sumDiff = 0; // sum(first_half) - sum(second_half)
  let leftQ = 0; // question marks in first half
  let rightQ = 0; // question marks in second half

  // Process first half
  for (let i = 0; i < half; i++) {
    if (num[i] === "?") {
      leftQ++;
    } else {
      sumDiff += parseInt(num[i], 10);
    }
  }

  // Process second half
  for (let i = half; i < n; i++) {
    if (num[i] === "?") {
      rightQ++;
    } else {
      sumDiff -= parseInt(num[i], 10);
    }
  }

  // Step 2: Apply the winning condition formula
  const totalQDiff = leftQ - rightQ;

  // If total question marks is odd, Alice wins (she gets the last move)
  if ((leftQ + rightQ) % 2 === 1) {
    return true;
  }

  // Alice wins if 2*sumDiff != 9*totalQDiff
  // This avoids floating point comparison of sumDiff != 4.5*totalQDiff
  return 2 * sumDiff !== 9 * totalQDiff;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Determines if Alice wins the sum game with optimal play.
     * @param num String of digits and '?' of even length
     * @return true if Alice wins, false if Bob wins
     */
    public boolean sumGame(String num) {
        int n = num.length();
        int half = n / 2;

        // Step 1: Calculate sum difference and count question marks
        int sumDiff = 0;  // sum(first_half) - sum(second_half)
        int leftQ = 0;    // question marks in first half
        int rightQ = 0;   // question marks in second half

        // Process first half
        for (int i = 0; i < half; i++) {
            char c = num.charAt(i);
            if (c == '?') {
                leftQ++;
            } else {
                sumDiff += c - '0';  // Convert char to int
            }
        }

        // Process second half
        for (int i = half; i < n; i++) {
            char c = num.charAt(i);
            if (c == '?') {
                rightQ++;
            } else {
                sumDiff -= c - '0';  // Convert char to int
            }
        }

        // Step 2: Apply the winning condition formula
        int totalQDiff = leftQ - rightQ;

        // If total question marks is odd, Alice wins (she gets the last move)
        if ((leftQ + rightQ) % 2 == 1) {
            return true;
        }

        // Alice wins if 2*sumDiff != 9*totalQDiff
        // This avoids floating point comparison of sumDiff != 4.5*totalQDiff
        return 2 * sumDiff != 9 * totalQDiff;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the string to calculate the sum difference and count question marks
- Each character is processed exactly once
- The mathematical check at the end is O(1)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables (sumDiff, leftQ, rightQ, etc.)
- No additional data structures are needed

## Common Mistakes

1. **Simulating the game move by move**: Attempting to simulate optimal play with recursion or iteration. This leads to exponential time complexity and will timeout on large inputs.

2. **Incorrect handling of the 4.5 multiplier**: Using floating-point arithmetic for the comparison `sumDiff != 4.5 * totalQDiff` can lead to precision errors. Always multiply by 2 and compare integers: `2 * sumDiff != 9 * totalQDiff`.

3. **Forgetting about the odd total question marks case**: When the total number of '?' is odd, Alice always wins because she gets the last move. This is a special case that must be handled separately.

4. **Miscalculating the sum difference direction**: Remember that adding to the first half increases the difference, while adding to the second half decreases it. Getting this backward will flip the result.

## When You'll See This Pattern

This problem uses **game theory with mathematical simplification**, a pattern seen in several LeetCode problems:

1. **Nim Game (LeetCode 292)**: Another game theory problem that reduces to a simple mathematical condition (win if n % 4 != 0).

2. **Can I Win (LeetCode 464)**: A more complex game theory problem that requires memoization and bitmasking, but shares the concept of optimal play analysis.

3. **Stone Game (LeetCode 877)**: A game theory problem where the first player can always win, similar to how Alice often has an advantage in this sum game.

The common thread is analyzing games mathematically rather than simulating them, looking for invariants or simplified winning conditions.

## Key Takeaways

1. **Game theory problems often have mathematical solutions**: Instead of simulating all moves, look for patterns, invariants, or simplified winning conditions that can be computed directly.

2. **Consider extreme strategies in optimal play**: In this problem, Alice always picks 9 for first half and 0 for second half, while Bob does the opposite. Analyzing these extreme cases reveals the mathematical structure.

3. **Watch for parity and symmetry arguments**: The odd/even count of moves often determines who has the advantage, as seen in the special case when total '?' is odd.

[Practice this problem on CodeJeet](/problem/sum-game)
