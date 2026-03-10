---
title: "Dynamic Programming Questions at Airbnb: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2028-12-24"
category: "dsa-patterns"
tags: ["airbnb", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Airbnb isn't just another algorithm topic to check off your list—it's a critical filter. With 10 out of their 64 tagged LeetCode problems being DP, that's over 15% of their technical question bank dedicated to this single paradigm. In real interviews, you're statistically more likely to encounter a DP problem at Airbnb than at many other FAANG-adjacent companies. Why? Because DP tests a specific, valuable engineering mindset: the ability to recognize that a complex, seemingly intractable problem can be broken down into simpler overlapping subproblems, and to then design an efficient, optimal solution. This mirrors the kind of systems thinking needed to optimize booking algorithms, pricing models, or resource allocation in their real-world platform.

## Specific Patterns Airbnb Favors

Airbnb's DP questions tend to cluster around **practical optimization problems** rather than abstract mathematical puzzles. You'll see a heavy emphasis on:

1.  **String/Sequence DP:** Problems involving operations on strings (edit distance, matching, partitioning) or sequences (like the classic "House Robber" series). These model real scenarios like validating user input, parsing search queries, or optimizing schedules.
2.  **Knapsack-style DP:** Problems about making optimal choices with constraints (e.g., maximum value without exceeding a limit). This directly relates to resource allocation.
3.  **2D Grid/Matrix DP:** Often framed as pathfinding or minimum cost problems on a grid.

They strongly prefer **iterative, bottom-up DP** solutions. While understanding the recursive top-down memoization approach is essential for problem-solving, interviewers will expect you to optimize to the bottom-up tabulation method, as it typically offers better constant factors and avoids recursion overhead. You'll rarely see esoteric DP on trees or advanced graph DP; the focus is on foundational, pattern-applicable problems.

Key representative problems from their list include:

- **Edit Distance (#72):** The quintessential 2D string DP problem.
- **House Robber (#198) & House Robber II (#213):** Classic 1D linear DP for optimization.
- **Word Break (#139):** A perfect example of a sequence DP problem that feels very practical.
- **Coin Change (#322):** The canonical unbounded knapsack problem.
- **Minimum Path Sum (#64):** Straightforward 2D grid DP.

## How to Prepare

The most common mistake is memorizing solutions. Instead, internalize the pattern. For Airbnb, mastering the **"DP State Transition"** for sequences is key. Let's look at a pattern that covers "House Robber" and "Word Break": defining `dp[i]` as the optimal answer or feasibility **considering the first i elements**.

<div class="code-group">

```python
# Pattern: Linear Sequence DP (e.g., House Robber)
# dp[i] represents the maximum loot achievable considering the first i houses.
# Time: O(n) | Space: O(n) -> can be optimized to O(1)
def rob(nums):
    if not nums:
        return 0
    n = len(nums)
    if n == 1:
        return nums[0]

    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])

    for i in range(2, n):
        # The recurrence relation: rob current house + loot from i-2,
        # or skip current house and keep loot from i-1.
        dp[i] = max(dp[i-1], nums[i] + dp[i-2])

    return dp[-1]

# Optimized Space: O(1)
def rob_optimized(nums):
    prev_max = 0  # dp[i-2]
    curr_max = 0  # dp[i-1]
    for num in nums:
        # Calculate the new maximum for this position.
        new_max = max(curr_max, num + prev_max)
        prev_max = curr_max
        curr_max = new_max
    return curr_max
```

```javascript
// Pattern: Linear Sequence DP
// Time: O(n) | Space: O(n) -> can be optimized to O(1)
function rob(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];

  const dp = new Array(nums.length);
  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
  }
  return dp[nums.length - 1];
}

// Optimized Space: O(1)
function robOptimized(nums) {
  let prevMax = 0;
  let currMax = 0;
  for (const num of nums) {
    const newMax = Math.max(currMax, num + prevMax);
    prevMax = currMax;
    currMax = newMax;
  }
  return currMax;
}
```

```java
// Pattern: Linear Sequence DP
// Time: O(n) | Space: O(n) -> can be optimized to O(1)
public int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];

    int[] dp = new int[nums.length];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (int i = 2; i < nums.length; i++) {
        dp[i] = Math.max(dp[i-1], nums[i] + dp[i-2]);
    }
    return dp[nums.length - 1];
}

// Optimized Space: O(1)
public int robOptimized(int[] nums) {
    int prevMax = 0;
    int currMax = 0;
    for (int num : nums) {
        int newMax = Math.max(currMax, num + prevMax);
        prevMax = currMax;
        currMax = newMax;
    }
    return currMax;
}
```

</div>

For 2D problems like Edit Distance, the pattern shifts to `dp[i][j]` representing the state for prefixes of the two input strings.

<div class="code-group">

```python
# Pattern: 2D String DP (e.g., Edit Distance)
# dp[i][j] = min operations to convert word1[:i] to word2[:j]
# Time: O(m*n) | Space: O(m*n) -> can be optimized to O(min(m, n))
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string.
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # Characters match, no cost.
            else:
                # Minimum of insert, delete, or replace.
                dp[i][j] = 1 + min(dp[i][j-1],    # Insert into word1
                                   dp[i-1][j],    # Delete from word1
                                   dp[i-1][j-1])  # Replace
    return dp[m][n]
```

```javascript
// Pattern: 2D String DP
// Time: O(m*n) | Space: O(m*n)
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i][j - 1], // Insert
            dp[i - 1][j], // Delete
            dp[i - 1][j - 1] // Replace
          );
      }
    }
  }
  return dp[m][n];
}
```

```java
// Pattern: 2D String DP
// Time: O(m*n) | Space: O(m*n)
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i][j-1],        // Insert
                    Math.min(
                        dp[i-1][j],    // Delete
                        dp[i-1][j-1]   // Replace
                    )
                );
            }
        }
    }
    return dp[m][n];
}
```

</div>

## How Airbnb Tests Dynamic Programming vs Other Companies

At companies like Google or Meta, a DP problem might be one layer of a multi-part question or involve a more obscure optimization. At Airbnb, the DP question is often **the main event**. They test for clarity of thought and communication under the DP framework. What's unique is their tendency to wrap the DP core in a **slightly novel or story-driven context** (e.g., "painting houses with certain costs" instead of just "minimum path sum"). However, the underlying pattern is almost always standard. The difficulty is typically in the **Medium** range, with a few Hards. They want to see if you can strip away the narrative, identify the known pattern, implement it flawlessly, and then discuss optimization (like space complexity). The expectation is clean, production-ready code with a thorough explanation of the state definition and recurrence relation.

## Study Order

Tackle DP in this logical progression to build intuition:

1.  **1D Linear DP (Fibonacci-style):** Start with the simplest recurrence (`dp[i] = dp[i-1] + dp[i-2]`). Problems: Climbing Stairs (#70), House Robber (#198). This teaches state definition.
2.  **1D Sequence DP with Choices:** Introduce the "take or skip" decision. Problems: House Robber II (#213), Word Break (#139). This teaches recurrence relation design.
3.  **Unbounded Knapsack DP:** Learn to handle items that can be reused. Problems: Coin Change (#322). This teaches looping order nuances in DP.
4.  **2D Grid DP:** Move to two states, often representing coordinates. Problems: Unique Paths (#62), Minimum Path Sum (#64). This builds comfort with 2D tables.
5.  **2D String DP:** The most common hard pattern at Airbnb. Problems: Edit Distance (#72), Longest Common Subsequence (#1143). This teaches handling two sequences.
6.  **Partition DP (Advanced):** If you have time, tackle problems like Palindrome Partitioning II (#132). This is less frequent but good for mastery.

## Recommended Practice Order

Solve these Airbnb-relevant problems in sequence:

1.  Climbing Stairs (#70) - Warm-up
2.  House Robber (#198) - Core 1D pattern
3.  House Robber II (#213) - Variation on core pattern
4.  Coin Change (#322) - Unbounded knapsack
5.  Word Break (#139) - Sequence DP with a set lookup
6.  Minimum Path Sum (#64) - 2D grid DP
7.  Edit Distance (#72) - Must-know 2D string DP
8.  (If aiming for a harder round) Decode Ways II (#639) - A challenging 1D DP with many edge cases.

Remember, the goal isn't to solve all 10 problems, but to solve enough of each pattern that you can reconstruct the solution in an interview. Always talk through your thought process: "This looks like an optimization problem on a sequence, so I'm considering DP. The state could be `dp[i]` representing... The recurrence might be..."

[Practice Dynamic Programming at Airbnb](/company/airbnb/dynamic-programming)
