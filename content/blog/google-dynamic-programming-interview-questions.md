---
title: "Dynamic Programming Questions at Google: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-01-28"
category: "dsa-patterns"
tags: ["google", "dynamic-programming", "interview prep"]
---

## Dynamic Programming Questions at Google: What to Expect

Let's start with a reality check. Google has 362 Dynamic Programming (DP) problems tagged on LeetCode out of 2217 total. That's roughly 16% of their catalog. But here's what that number doesn't tell you: in actual interviews, DP appears less frequently than that percentage suggests, but when it does appear, it's often a make-or-break question. Google doesn't use DP as a general screening tool—it's a specialist's weapon. You're more likely to encounter a DP problem in a later-round interview with a team working on optimization, systems, or algorithms-heavy products. The interviewer isn't just testing if you memorized the knapsack solution; they're evaluating your ability to decompose a complex problem, identify overlapping subproblems, and build an efficient solution from first principles.

### Specific Patterns Google Favors

Google's DP questions tend to cluster around a few practical domains rather than abstract mathematical puzzles. You'll notice a strong bias toward:

1. **String/Sequence DP**: Problems involving edit distance, longest common subsequence, or palindrome partitioning. These model real-world text processing, DNA sequence alignment, or diff algorithms.
2. **Grid/Matrix DP**: Unique paths, minimum path sum, and dungeon game problems. These often represent optimization in 2D spaces like robotics pathfinding or resource allocation.
3. **Partition/Subset DP**: Problems that ask "can we divide this set to meet certain constraints?" These model load balancing, task scheduling, or resource division.

What's notably absent? Pure "count ways" problems without practical analogs. Google prefers DP problems that feel like simplified versions of actual engineering challenges.

Here's the most common pattern you'll encounter: the **two-sequence DP** where you build a 2D table representing states of processing two inputs. Let's look at the classic edit distance problem (LeetCode #72):

<div class="code-group">

```python
# Time: O(m*n) | Space: O(m*n) where m,n are string lengths
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    # dp[i][j] = min edits to convert word1[:i] to word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i  # Delete all characters
    for j in range(n + 1):
        dp[0][j] = j  # Insert all characters

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]  # Characters match, no edit needed
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # Delete from word1
                    dp[i][j-1],    # Insert into word1
                    dp[i-1][j-1]   # Replace character
                )

    return dp[m][n]
```

```javascript
// Time: O(m*n) | Space: O(m*n) where m,n are string lengths
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  // dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Base cases
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
            dp[i - 1][j], // delete
            dp[i][j - 1], // insert
            dp[i - 1][j - 1] // replace
          );
      }
    }
  }

  return dp[m][n];
}
```

```java
// Time: O(m*n) | Space: O(m*n) where m,n are string lengths
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    // dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]
    int[][] dp = new int[m + 1][n + 1];

    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],      // delete
                    Math.min(
                        dp[i][j - 1],  // insert
                        dp[i - 1][j - 1] // replace
                    )
                );
            }
        }
    }

    return dp[m][n];
}
```

</div>

The second pattern worth mastering is **1D DP with optimization**, often used for problems like "House Robber" (LeetCode #198) or "Coin Change" (LeetCode #322). Notice how we can often reduce space complexity:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - House Robber optimized
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]

    # Only need to track two previous states
    prev2, prev1 = 0, nums[0]

    for i in range(1, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2, prev1 = prev1, current

    return prev1
```

```javascript
// Time: O(n) | Space: O(1) - House Robber optimized
function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  let prev2 = 0; // dp[i-2]
  let prev1 = nums[0]; // dp[i-1]

  for (let i = 1; i < nums.length; i++) {
    const current = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
```

```java
// Time: O(n) | Space: O(1) - House Robber optimized
public int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];

    int prev2 = 0;      // dp[i-2]
    int prev1 = nums[0]; // dp[i-1]

    for (int i = 1; i < nums.length; i++) {
        int current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}
```

</div>

### How Google Tests Dynamic Programming vs Other Companies

At Facebook/Meta, DP problems often relate to social graphs or content optimization. At Amazon, they might tie to logistics or inventory problems. Google's DP questions have a distinct flavor: they're often **cleaner abstractions** of computational geometry, string algorithms, or optimization problems.

What's unique about Google's approach? First, they expect you to **derive the recurrence relation** during the interview, not just implement a memorized solution. I've seen candidates who could perfectly code the "Edit Distance" solution but failed because they couldn't explain why the recurrence relation works. Second, Google interviewers frequently ask for **space optimization**—can you reduce O(n²) to O(n) or O(n) to O(1)? This tests whether you understand the underlying dependencies, not just the pattern.

### How to Prepare

Don't start by memorizing solutions. Instead, follow this process:

1. **Identify the DP category** within the first 2 minutes: Is this a sequence alignment problem? A knapsack variant? A grid traversal?
2. **Define the state** clearly: What does dp[i][j] represent? Write it in a comment before writing any code.
3. **Derive the recurrence relation** on the whiteboard or in comments before implementing.
4. **Determine base cases**—these are often the edges of your DP table.
5. **Implement bottom-up** (iterative) when possible—it's usually more efficient and easier to explain.
6. **Consider space optimization**—can you reduce dimensions by tracking only necessary previous states?

### Study Order

1. **1D DP (Fibonacci style)** - Start with "Climbing Stairs" (LeetCode #70) to understand the basic concept of building solutions from subproblems.
2. **2D Grid DP** - Move to "Unique Paths" (LeetCode #62) to learn 2D state representation.
3. **String/Sequence DP** - Tackle "Longest Common Subsequence" (LeetCode #1143) to master the two-sequence pattern.
4. **Partition/Subset DP** - Practice "Partition Equal Subset Sum" (LeetCode #416) to understand subset selection.
5. **State Machine DP** - Finally, attempt "Best Time to Buy and Sell Stock with Cooldown" (LeetCode #309) for more complex state transitions.

This order builds from simple state representations to more complex ones, ensuring you understand each dimension before adding complexity.

### Recommended Practice Order

1. Climbing Stairs (#70) - Basic 1D DP
2. House Robber (#198) - 1D DP with decision making
3. Unique Paths (#62) - Basic 2D grid DP
4. Minimum Path Sum (#64) - 2D DP with value optimization
5. Longest Common Subsequence (#1143) - Classic two-sequence DP
6. Edit Distance (#72) - Two-sequence DP with multiple operations
7. Coin Change (#322) - Unbounded knapsack style
8. Word Break (#139) - Partition DP with string matching
9. Decode Ways (#91) - 1D DP with constraints
10. Maximum Product Subarray (#152) - 1D DP tracking multiple states

Remember: at Google, the optimal solution often requires not just implementing DP correctly, but also explaining the tradeoffs between top-down (memoization) and bottom-up (tabulation) approaches, and discussing how you'd parallelize or distribute the computation if the input were massive.

[Practice Dynamic Programming at Google](/company/google/dynamic-programming)
