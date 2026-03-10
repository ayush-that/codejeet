---
title: "How to Solve Minimum Distance to Type a Word Using Two Fingers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Distance to Type a Word Using Two Fingers. Hard difficulty, 59.4% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-12-24"
category: "dsa-patterns"
tags: ["minimum-distance-to-type-a-word-using-two-fingers", "string", "dynamic-programming", "hard"]
---

# How to Solve Minimum Distance to Type a Word Using Two Fingers

This problem asks you to calculate the minimum total distance to type a word using two fingers on a keyboard where each letter has known coordinates. The tricky part is that at each step, you can choose which finger to move to the next letter, and you need to track both finger positions simultaneously to make optimal decisions. This creates an exponential decision tree that requires dynamic programming to solve efficiently.

## Visual Walkthrough

Let's trace through a small example: `word = "CAKE"` with the standard keyboard layout.

**Keyboard coordinates:**

- A = (0,0), B = (0,1), C = (0,2), D = (0,3), E = (0,4), F = (0,5)
- G = (1,0), H = (1,1), I = (1,2), J = (1,3), K = (1,4), L = (1,5)
- M = (2,0), N = (2,1), O = (2,2), P = (2,3), Q = (2,4), R = (2,5)
- S = (3,0), T = (3,1), U = (3,2), V = (3,3), W = (3,4), X = (3,5)
- Y = (4,0), Z = (4,1)

**Step-by-step reasoning:**

1. Start with both fingers free (positioned at "virtual" starting points)
2. First letter 'C': We must place a finger at C. Let's say Finger 1 goes to C (0,2). Distance = 0 (from starting position)
3. Second letter 'A': We have two choices:
   - Move Finger 1 from C to A: distance = |0-0| + |2-0| = 2
   - Move Finger 2 from start to A: distance = 0
     Optimal: Use Finger 2 at A (0,0)
4. Third letter 'K': Now Finger 1 at C (0,2), Finger 2 at A (0,0)
   - Move Finger 1 to K: distance = |0-1| + |2-4| = 1 + 2 = 3
   - Move Finger 2 to K: distance = |0-1| + |0-4| = 1 + 4 = 5
     Optimal: Move Finger 1 to K (1,4)
5. Fourth letter 'E': Finger 1 at K (1,4), Finger 2 at A (0,0)
   - Move Finger 1 to E: distance = |1-0| + |4-4| = 1 + 0 = 1
   - Move Finger 2 to E: distance = |0-0| + |0-4| = 0 + 4 = 4
     Optimal: Move Finger 1 to E (0,4)

Total minimum distance = 0 (C) + 0 (A) + 3 (K) + 1 (E) = 4

The challenge is that at each step, we need to consider all possible finger positions from the previous step to make the optimal choice.

## Brute Force Approach

A naive approach would try all possible assignments of which finger types each letter. For each letter in the word, we have two choices: use finger 1 or finger 2. For an n-letter word, this gives us 2^n possible sequences to evaluate.

The brute force algorithm would:

1. Generate all 2^n possible finger assignment sequences
2. For each sequence, calculate the total distance by summing Manhattan distances between consecutive positions for each finger
3. Track the minimum total distance

This approach is clearly exponential O(2^n) and would time out for even moderately long words (n > 20 would mean over 1 million possibilities).

What makes this approach infeasible is that it doesn't reuse computations. Many finger assignment sequences share common subproblems (e.g., reaching the same letter with the same finger positions but through different paths), which we can cache.

## Optimized Approach

The key insight is that we can use **dynamic programming** to avoid recomputing overlapping subproblems. At each step, we only care about:

1. Which letter we're about to type (the current index in the word)
2. Where finger 1 is currently positioned
3. Where finger 2 is currently positioned

However, tracking both finger positions explicitly would require O(n _ 26 _ 26) space, which is manageable but can be optimized further.

**Better insight:** When we type the i-th letter, one finger must be on the (i-1)-th letter (the letter we just typed). The other finger can be anywhere. So we can define our state as:

- `dp[i][j]` = minimum distance to type first i letters, with the "other" finger (not the one that typed the i-th letter) positioned at letter j

This reduces our state space to O(n \* 26) which is efficient.

**Transition logic:**

1. To type letter i with the same finger that typed letter i-1:
   - Distance = `dp[i-1][j] + dist(word[i-1], word[i])`
   - The "other" finger position j remains unchanged
2. To type letter i with the "other" finger that was at position j:
   - Distance = `dp[i-1][word[i-1]] + dist(j, word[i])`
   - The "other" finger becomes the finger that typed letter i-1

We take the minimum of these two possibilities at each step.

**Special cases:**

- When i = 0 (first letter), we can place either finger on it with 0 distance
- We need to handle the case where a finger hasn't been used yet (is "free")

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n * 26) = O(n) since 26 is constant | Space: O(n * 26) = O(n)
def minimumDistance(word: str) -> int:
    # Helper function to calculate Manhattan distance between two letters
    def distance(a: str, b: str) -> int:
        if a == 26 or b == 26:  # 26 represents a free finger (not on keyboard yet)
            return 0
        # Convert letters to coordinates
        x1, y1 = divmod(ord(a) - ord('A'), 6)
        x2, y2 = divmod(ord(b) - ord('A'), 6)
        return abs(x1 - x2) + abs(y1 - y2)

    n = len(word)
    if n <= 2:  # For 0, 1, or 2 letters, we can always use free fingers
        return 0

    # Convert letters to indices 0-25 for easier handling
    word_idx = [ord(c) - ord('A') for c in word]

    # dp[i][j] = min distance to type first i letters (0-indexed: letters 0..i-1)
    # with the "other" finger (not the one that typed the last letter) at position j
    # j = 26 represents a free finger (not placed on keyboard yet)
    dp = [[float('inf')] * 27 for _ in range(n)]

    # Base case: typing the first letter (index 0)
    # We can place either finger on the first letter with 0 cost
    # The other finger is free (position 26)
    dp[0][26] = 0  # Other finger is free

    # Fill the DP table
    for i in range(1, n):
        current = word_idx[i]
        prev = word_idx[i - 1]

        for j in range(27):  # j is position of the "other" finger
            if dp[i - 1][j] == float('inf'):
                continue  # Skip unreachable states

            # Option 1: Type current letter with the same finger that typed previous letter
            # The "other" finger (position j) stays where it is
            cost_same = dp[i - 1][j] + distance(prev, current)
            dp[i][j] = min(dp[i][j], cost_same)

            # Option 2: Type current letter with the "other" finger (position j)
            # Now the finger that typed previous letter becomes the "other" finger
            cost_other = dp[i - 1][j] + distance(j, current)
            dp[i][prev] = min(dp[i][prev], cost_other)

    # The answer is the minimum value in the last row
    return min(dp[n - 1])

# Alternative optimized version with O(26) space
def minimumDistance_optimized(word: str) -> int:
    def distance(a: int, b: int) -> int:
        if a == 26 or b == 26:
            return 0
        return abs(a // 6 - b // 6) + abs(a % 6 - b % 6)

    n = len(word)
    if n <= 2:
        return 0

    word_idx = [ord(c) - ord('A') for c in word]

    # dp[j] = min distance with other finger at position j after typing previous letter
    dp = [float('inf')] * 27
    dp[26] = 0  # Initial state: other finger is free

    for i in range(1, n):
        current = word_idx[i]
        prev = word_idx[i - 1]

        new_dp = [float('inf')] * 27
        for j in range(27):
            if dp[j] == float('inf'):
                continue

            # Same finger types current letter
            new_dp[j] = min(new_dp[j], dp[j] + distance(prev, current))

            # Other finger (position j) types current letter
            new_dp[prev] = min(new_dp[prev], dp[j] + distance(j, current))

        dp = new_dp

    return min(dp)
```

```javascript
// Time: O(n * 26) = O(n) | Space: O(n * 26) = O(n)
function minimumDistance(word) {
  // Helper function to calculate Manhattan distance between two letter indices
  const distance = (a, b) => {
    if (a === 26 || b === 26) return 0; // Free finger
    const x1 = Math.floor(a / 6),
      y1 = a % 6;
    const x2 = Math.floor(b / 6),
      y2 = b % 6;
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  };

  const n = word.length;
  if (n <= 2) return 0; // Can use free fingers for first 2 letters

  // Convert letters to indices 0-25
  const wordIdx = Array.from(word, (c) => c.charCodeAt(0) - 65);

  // dp[i][j] = min distance after typing first i letters (0..i-1)
  // with other finger at position j (26 = free finger)
  const dp = Array(n)
    .fill()
    .map(() => Array(27).fill(Infinity));

  // Base case: first letter
  dp[0][26] = 0; // Type first letter with one finger, other finger is free

  // Fill DP table
  for (let i = 1; i < n; i++) {
    const current = wordIdx[i];
    const prev = wordIdx[i - 1];

    for (let j = 0; j <= 26; j++) {
      if (dp[i - 1][j] === Infinity) continue;

      // Option 1: Same finger types current letter
      const costSame = dp[i - 1][j] + distance(prev, current);
      dp[i][j] = Math.min(dp[i][j], costSame);

      // Option 2: Other finger (position j) types current letter
      const costOther = dp[i - 1][j] + distance(j, current);
      dp[i][prev] = Math.min(dp[i][prev], costOther);
    }
  }

  // Find minimum in last row
  return Math.min(...dp[n - 1]);
}

// Space-optimized version O(26) space
function minimumDistanceOptimized(word) {
  const distance = (a, b) => {
    if (a === 26 || b === 26) return 0;
    return Math.abs(Math.floor(a / 6) - Math.floor(b / 6)) + Math.abs((a % 6) - (b % 6));
  };

  const n = word.length;
  if (n <= 2) return 0;

  const wordIdx = Array.from(word, (c) => c.charCodeAt(0) - 65);

  // dp[j] = min distance with other finger at position j
  let dp = Array(27).fill(Infinity);
  dp[26] = 0;

  for (let i = 1; i < n; i++) {
    const current = wordIdx[i];
    const prev = wordIdx[i - 1];
    const newDp = Array(27).fill(Infinity);

    for (let j = 0; j <= 26; j++) {
      if (dp[j] === Infinity) continue;

      // Same finger types current
      newDp[j] = Math.min(newDp[j], dp[j] + distance(prev, current));

      // Other finger types current
      newDp[prev] = Math.min(newDp[prev], dp[j] + distance(j, current));
    }

    dp = newDp;
  }

  return Math.min(...dp);
}
```

```java
// Time: O(n * 26) = O(n) | Space: O(n * 26) = O(n)
class Solution {
    public int minimumDistance(String word) {
        int n = word.length();
        if (n <= 2) return 0; // First two letters can use free fingers

        // Convert word to indices 0-25
        int[] wordIdx = new int[n];
        for (int i = 0; i < n; i++) {
            wordIdx[i] = word.charAt(i) - 'A';
        }

        // dp[i][j] = min distance after typing first i letters (0..i-1)
        // with other finger at position j (26 means free finger)
        int[][] dp = new int[n][27];
        for (int i = 0; i < n; i++) {
            Arrays.fill(dp[i], Integer.MAX_VALUE);
        }

        // Base case: first letter
        dp[0][26] = 0; // Type first letter, other finger is free

        // Fill DP table
        for (int i = 1; i < n; i++) {
            int current = wordIdx[i];
            int prev = wordIdx[i - 1];

            for (int j = 0; j <= 26; j++) {
                if (dp[i - 1][j] == Integer.MAX_VALUE) continue;

                // Option 1: Same finger types current letter
                int costSame = dp[i - 1][j] + distance(prev, current);
                dp[i][j] = Math.min(dp[i][j], costSame);

                // Option 2: Other finger (position j) types current letter
                int costOther = dp[i - 1][j] + distance(j, current);
                dp[i][prev] = Math.min(dp[i][prev], costOther);
            }
        }

        // Find minimum in last row
        int minDist = Integer.MAX_VALUE;
        for (int j = 0; j <= 26; j++) {
            minDist = Math.min(minDist, dp[n - 1][j]);
        }
        return minDist;
    }

    // Helper method to calculate Manhattan distance between two letter indices
    private int distance(int a, int b) {
        if (a == 26 || b == 26) return 0; // Free finger
        int x1 = a / 6, y1 = a % 6;
        int x2 = b / 6, y2 = b % 6;
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
}

// Space-optimized version O(26) space
class SolutionOptimized {
    public int minimumDistance(String word) {
        int n = word.length();
        if (n <= 2) return 0;

        int[] wordIdx = new int[n];
        for (int i = 0; i < n; i++) {
            wordIdx[i] = word.charAt(i) - 'A';
        }

        // dp[j] = min distance with other finger at position j
        int[] dp = new int[27];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[26] = 0; // Initial state: other finger is free

        for (int i = 1; i < n; i++) {
            int current = wordIdx[i];
            int prev = wordIdx[i - 1];
            int[] newDp = new int[27];
            Arrays.fill(newDp, Integer.MAX_VALUE);

            for (int j = 0; j <= 26; j++) {
                if (dp[j] == Integer.MAX_VALUE) continue;

                // Same finger types current
                newDp[j] = Math.min(newDp[j], dp[j] + distance(prev, current));

                // Other finger types current
                newDp[prev] = Math.min(newDp[prev], dp[j] + distance(j, current));
            }

            dp = newDp;
        }

        int minDist = Integer.MAX_VALUE;
        for (int dist : dp) {
            minDist = Math.min(minDist, dist);
        }
        return minDist;
    }

    private int distance(int a, int b) {
        if (a == 26 || b == 26) return 0;
        return Math.abs(a / 6 - b / 6) + Math.abs(a % 6 - b % 6);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* 26) = O(n)

- We have n letters to process
- For each letter, we iterate through 27 possible positions (26 letters + 1 free position)
- Since 26 is a constant, the time complexity is linear in n

**Space Complexity:**

- Basic DP solution: O(n \* 26) = O(n) for the DP table
- Optimized solution: O(26) = O(1) by only keeping the previous row
- The space for storing coordinates and intermediate calculations is constant

The linear time complexity makes this solution efficient even for long words (up to 300 letters as per typical constraints).

## Common Mistakes

1. **Not handling the "free finger" case properly:** Many candidates forget that fingers start off the keyboard and can be placed on the first letter with 0 cost. This requires a special value (like 26) to represent a finger that hasn't been placed yet.

2. **Incorrect state definition:** Some candidates try to track both finger positions explicitly with a 3D DP `dp[i][pos1][pos2]`, which creates O(n _ 26 _ 26) states. While this works, it's less efficient and more complex to implement than the optimized state definition.

3. **Wrong distance calculation:** The keyboard has 6 columns, not 5. A common error is using `divmod(letter, 5)` instead of `divmod(letter, 6)`. Remember: A-F are row 0, G-L are row 1, etc., with 6 letters per row.

4. **Missing the base case for short words:** For words of length 0, 1, or 2, the answer is always 0 because you can use free fingers. Candidates who miss this edge case get wrong answers for simple inputs.

## When You'll See This Pattern

This problem uses **dynamic programming with state optimization**, a pattern common in problems where you need to track multiple "agents" or make sequential decisions with memory.

Similar problems include:

1. **Best Time to Buy and Sell Stock with Cooldown (LeetCode 309)** - Tracks states (hold, sold, cooldown) to make optimal trading decisions
2. **Paint House II (LeetCode 265)** - Tracks minimum cost to paint houses while avoiding same colors for adjacent houses
3. **Minimum Cost to Merge Stones (LeetCode 1000)** - Uses DP to track optimal merging sequences
4. **Cherry Pickup (LeetCode 741)** - Tracks two paths simultaneously, similar to tracking two fingers

The key pattern is recognizing when you can reduce the state space by noticing that one part of the state is determined by the problem constraints (here, one finger must be on the last typed letter).

## Key Takeaways

1. **State reduction is crucial for DP efficiency:** When tracking multiple moving parts, look for dependencies that let you eliminate dimensions from your state space. Here, realizing that one finger must be on the previous letter reduced a 3D state to 2D.

2. **"Free" or "initial" states need special handling:** Many DP problems have initial states that don't fit the regular transition pattern. Always check if you need special values or initialization for starting conditions.

3. **Manhattan distance on grid problems:** When dealing with grid coordinates, remember that Manhattan distance = |x1-x2| + |y1-y2|. For letter-to-coordinate conversion, integer division and modulo are your friends.

Related problems: [Minimum Time to Type Word Using Special Typewriter](/problem/minimum-time-to-type-word-using-special-typewriter)
