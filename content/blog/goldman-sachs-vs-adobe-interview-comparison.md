---
title: "Goldman Sachs vs Adobe: Interview Question Comparison"
description: "Compare coding interview questions at Goldman Sachs and Adobe — difficulty levels, topic focus, and preparation strategy."
date: "2028-01-01"
category: "tips"
tags: ["goldman-sachs", "adobe", "comparison"]
---

When preparing for technical interviews at top tech and finance companies, understanding the specific patterns and expectations of each employer is crucial. Both Goldman Sachs and Adobe are prestigious, but their technical interviews reflect their distinct industry focuses: financial engineering versus software product development. A direct comparison of their question banks reveals key differences in volume, difficulty distribution, and core topics, allowing you to tailor your preparation strategy effectively.

## Question Volume and Difficulty

Goldman Sachs presents a larger overall question bank with **270 questions**, compared to Adobe's **227 questions**. The difficulty distribution, however, tells a more nuanced story.

Goldman Sachs (270q: E51/M171/H48) has a significant emphasis on **Medium-difficulty questions**, which constitute nearly two-thirds (171) of its catalog. The number of Hard questions (48) is also notably higher than Adobe's. This reflects the quantitative and problem-solving intensity expected in a financial engineering context, where robust, efficient algorithms underpin trading systems and risk models.

Adobe (227q: E68/M129/H30) has a higher count of **Easy questions** (68) and a lower proportion of Hard questions (30). The bulk of questions are still Medium (129). This distribution aligns with a product-focused software company, where clean, maintainable, and correct solutions for well-defined problems—like feature implementation or UI logic—are often prioritized over extreme algorithmic optimization.

**Key Takeaway:** Goldman Sachs interviews will likely push you harder on complex problem-solving, while Adobe's process may involve more foundational questions to assess coding clarity and correctness.

## Topic Overlap

Both companies heavily test **Array, String, and Hash Table** problems. These are fundamental data structures applicable across all software domains, from processing financial data streams to manipulating document models.

The primary divergence is in the fourth most frequent topic:

- **Goldman Sachs** prominently features **Dynamic Programming (DP)**. DP is essential for optimization problems, recursive reasoning, and financial calculations (e.g., maximizing profit, minimizing risk, pathfinding). Expect questions on knapsack variants, subsequences, and string edit distances.
- **Adobe** frequently uses **Two Pointers**. This pattern is ubiquitous in array/string manipulation for tasks like searching, partitioning, or comparing sequences—common in developing tools for creative software (e.g., image processing, document comparison, UI event handling).

<div class="code-group">

```python
# Example: Two Pointers (common at Adobe) - Remove Duplicates from Sorted Array
def removeDuplicates(nums):
    if not nums:
        return 0
    insert_pos = 1
    for i in range(1, len(nums)):
        if nums[i] != nums[i-1]:
            nums[insert_pos] = nums[i]
            insert_pos += 1
    return insert_pos

# Example: Dynamic Programming (common at Goldman Sachs) - Climbing Stairs
def climbStairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

```javascript
// Example: Two Pointers (common at Adobe) - Remove Duplicates from Sorted Array
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let insertPos = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }
  return insertPos;
}

// Example: Dynamic Programming (common at Goldman Sachs) - Climbing Stairs
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}
```

```java
// Example: Two Pointers (common at Adobe) - Remove Duplicates from Sorted Array
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int insertPos = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] != nums[i - 1]) {
            nums[insertPos] = nums[i];
            insertPos++;
        }
    }
    return insertPos;
}

// Example: Dynamic Programming (common at Goldman Sachs) - Climbing Stairs
public int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

</div>

## Which to Prepare for First

Start with **Adobe's question bank**. Its slightly lower volume and higher proportion of Easy questions make it an excellent foundation. Mastering the core Array, String, Hash Table, and Two Pointers patterns will build your coding fluency and problem-solving speed. This foundation is 100% transferable.

Once comfortable, pivot to **Goldman Sachs preparation**. This requires layering on the additional, more challenging topic of **Dynamic Programming**. You will also need to condition yourself for a higher density of Medium and Hard problems, which often demand deeper optimization and more complex state management. Practicing Goldman Sachs questions will effectively stress-test the fundamentals you built while studying for Adobe.

In short, Adobe's list provides the core toolkit; Goldman Sachs's list adds the heavy-duty power tools. By preparing for Adobe first, you create a scalable knowledge base that makes tackling Goldman Sachs's more difficult problems manageable.

For targeted practice, visit the company-specific pages: [Goldman Sachs](/company/goldman-sachs) and [Adobe](/company/adobe).
