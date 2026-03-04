---
title: "Yandex vs Morgan Stanley: Interview Question Comparison"
description: "Compare coding interview questions at Yandex and Morgan Stanley — difficulty levels, topic focus, and preparation strategy."
date: "2026-09-10"
category: "tips"
tags: ["yandex", "morgan-stanley", "comparison"]
---

When preparing for technical interviews at top tech companies and financial institutions, understanding their specific question patterns is crucial for efficient study. Yandex and Morgan Stanley represent two distinct but demanding interview environments: one a major Russian tech giant, the other a global investment bank. While both assess core algorithmic proficiency, their approach, volume, and focus differ significantly. This comparison breaks down their question banks to help you tailor your preparation.

## Question Volume and Difficulty

The most immediate difference is scale. Yandex's tagged question bank is substantially larger, with **134 questions** compared to Morgan Stanley's **53**. This suggests Yandex has a broader, more established public repository of problems, which can be both an advantage (more practice material) and a challenge (more to potentially cover).

The difficulty distribution also reveals priorities:

- **Yandex:** 52 Easy (39%), 72 Medium (54%), 10 Hard (7%). The emphasis is clearly on **Medium**-difficulty problems, which typically involve combining 2-3 core concepts. The low percentage of Hard questions suggests their on-site interviews may focus more on robust implementation and problem-solving under pressure on standard mediums, rather than on highly obscure algorithms.
- **Morgan Stanley:** 13 Easy (25%), 34 Medium (64%), 6 Hard (11%). Here, the skew toward **Medium** is even more pronounced. The slightly higher proportion of Hard questions (11% vs 7%) might indicate a niche for more complex scenarios, potentially in later interview rounds.

The takeaway: For both, mastering Medium problems is non-negotiable. Yandex requires stamina across a wider set, while Morgan Stanley demands high precision on a more concentrated set.

## Topic Overlap

Both companies heavily test foundational data structures. The top topics are nearly identical:

1.  **Array**
2.  **String**
3.  **Hash Table**

These are the bedrock of most coding interviews. Proficiency here means you can handle a majority of questions from either company. The key divergence is the fourth most frequent topic.

- **Yandex** lists **Two Pointers** as a top-4 topic. This aligns with a strong focus on in-place array/string manipulation, sliding window problems, and optimization of solutions to use O(1) extra space.
  <div class="code-group">

  ```python
  # Two Pointers: Removing duplicates from sorted array in-place.
  def removeDuplicates(nums):
      if not nums:
          return 0
      write = 1
      for read in range(1, len(nums)):
          if nums[read] != nums[read-1]:
              nums[write] = nums[read]
              write += 1
      return write
  ```

  ```javascript
  // Two Pointers: Removing duplicates from sorted array in-place.
  function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    let write = 1;
    for (let read = 1; read < nums.length; read++) {
      if (nums[read] !== nums[read - 1]) {
        nums[write] = nums[read];
        write++;
      }
    }
    return write;
  }
  ```

  ```java
  // Two Pointers: Removing duplicates from sorted array in-place.
  public int removeDuplicates(int[] nums) {
      if (nums.length == 0) return 0;
      int write = 1;
      for (int read = 1; read < nums.length; read++) {
          if (nums[read] != nums[read - 1]) {
              nums[write] = nums[read];
              write++;
          }
      }
      return write;
  }
  ```

  </div>

- **Morgan Stanley** lists **Dynamic Programming** as a top-4 topic. This signals an expectation to solve optimization problems involving overlapping subproblems, which is common in finance for scenarios like maximizing profit or minimizing cost.
  <div class="code-group">

  ```python
  # DP: Classic 0/1 Knapsack value maximization.
  def knapSack(max_weight, weights, values):
      n = len(values)
      dp = [0] * (max_weight + 1)
      for i in range(n):
          for w in range(max_weight, weights[i] - 1, -1):
              dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
      return dp[max_weight]
  ```

  ```javascript
  // DP: Classic 0/1 Knapsack value maximization.
  function knapSack(maxWeight, weights, values) {
    const n = values.length;
    const dp = new Array(maxWeight + 1).fill(0);
    for (let i = 0; i < n; i++) {
      for (let w = maxWeight; w >= weights[i]; w--) {
        dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
      }
    }
    return dp[maxWeight];
  }
  ```

  ```java
  // DP: Classic 0/1 Knapsack value maximization.
  public int knapSack(int maxWeight, int[] weights, int[] values) {
      int n = values.length;
      int[] dp = new int[maxWeight + 1];
      for (int i = 0; i < n; i++) {
          for (int w = maxWeight; w >= weights[i]; w--) {
              dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
          }
      }
      return dp[maxWeight];
  }
  ```

  </div>

Thus, Yandex preparation should emphasize efficient traversal and manipulation, while Morgan Stanley prep must include dedicated DP drill.

## Which to Prepare for First

If you are interviewing at both, start with **Morgan Stanley's question bank**. Its smaller, more concentrated set (53 questions) with a high density of Medium problems allows you to build a strong, focused foundation in the universal topics (Array, String, Hash Table) and the critical topic of DP. This creates a efficient core competency.

Once that core is solid, expand to **Yandex's larger bank**. Use it to build stamina, speed, and to deepen your skills in Two Pointers and other patterns that may appear. The Yandex problems will reinforce the fundamentals you learned from the Morgan Stanley set while exposing you to greater variety. This "focused first, then broad" approach prevents being overwhelmed and ensures you cover the essential, company-specific nuances for each.

For targeted practice, visit the Yandex question list at [/company/yandex](/company/yandex) and the Morgan Stanley list at [/company/morgan-stanley](/company/morgan-stanley).
