---
title: "Medium Google Interview Questions: Strategy Guide"
description: "How to tackle 1153 medium difficulty questions from Google — patterns, time targets, and practice tips."
date: "2031-12-15"
category: "tips"
tags: ["google", "medium", "interview prep"]
---

Medium questions at Google typically represent the core of their technical interviews. These problems require more than just recalling a solution—they demand recognizing patterns, making trade-offs, and communicating your reasoning clearly. A Medium problem here often involves a twist on a known concept or combining two fundamental ideas, testing your adaptability and depth of understanding.

## Common Patterns

Google’s Medium problems frequently test specific algorithmic patterns. Mastering these will help you decode many interview questions.

**Two Pointers / Sliding Window:** Used for array or string problems involving subarrays, subsequences, or paired comparisons.

<div class="code-group">

```python
def max_subarray_sum(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

```javascript
function maxSubarraySum(nums, k) {
  let windowSum = nums.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
```

```java
public int maxSubarraySum(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int maxSum = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
```

</div>

**Graph Traversal (BFS/DFS):** Common for problems involving grids, relationships, or hierarchical data.
**Hash Maps for Frequency/Caching:** Essential for optimization and reducing time complexity.
**Tree/Recursion:** Often used for problems about binary trees, serialization, or recursive decision-making.
**Interval Merging/Overlap:** Frequent in scheduling or range-based problems.

## Time Targets

In a 45-minute interview, you should aim to solve a Medium problem within **25-30 minutes**. This includes:

- **2-5 minutes:** Clarifying the problem, asking edge cases, and restating your understanding.
- **10-15 minutes:** Designing the approach, discussing trade-offs, and writing pseudocode.
- **10-15 minutes:** Writing clean, correct code in your chosen language.
- **Remaining time:** Testing with examples, discussing optimizations, and analyzing complexity.

If you finish early, be prepared for a follow-up (e.g., a variation, optimization, or a second simpler question). Practice under timed conditions to build this pace.

## Practice Strategy

Don’t just solve problems—practice deliberately.

1. **Pattern-First Learning:** Group problems by pattern (e.g., all “sliding window” questions). Solve until you recognize the pattern instantly.
2. **Simulate the Interview:** Use a timer. Verbalize your thinking as you solve. Write code on a whiteboard or in a plain text editor without autocomplete.
3. **Review and Refactor:** After solving, review the optimal solution. If your code was messy, rewrite it for clarity and efficiency.
4. **Focus on Weaknesses:** If you struggle with graphs, double your practice on BFS/DFS problems. Use Google’s tagged Medium questions to target specific areas.

Consistent, focused practice on these Medium problems builds the speed and pattern recognition needed to pass Google’s technical screens.

[Practice Medium Google questions](/company/google/medium)
