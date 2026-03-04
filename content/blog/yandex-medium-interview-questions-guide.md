---
title: "Medium Yandex Interview Questions: Strategy Guide"
description: "How to tackle 72 medium difficulty questions from Yandex — patterns, time targets, and practice tips."
date: "2032-04-13"
category: "tips"
tags: ["yandex", "medium", "interview prep"]
---

Medium questions at Yandex typically test a solid grasp of core data structures and algorithms, requiring you to implement efficient solutions with clean, correct code. They often involve a twist on classic problems or require combining multiple concepts. Success here means moving beyond brute force to optimal approaches, demonstrating both problem-solving skill and coding precision.

## Common Patterns

Yandex's Medium problems frequently center on a few key areas. Recognizing these patterns is crucial for quick identification and solution mapping.

**Array/String Manipulation with Two Pointers or Sliding Windows:** Many problems involve searching, comparing, or computing something within a sequence under specific constraints.

<div class="code-group">

```python
# Example: Find max sum of subarray of size k
def max_subarray_sum(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
```

```javascript
// Example: Find max sum of subarray of size k
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
// Example: Find max sum of subarray of size k
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

**Graph Traversal (BFS/DFS):** Questions often involve navigating grids, trees, or adjacency lists to find paths, connected components, or validate conditions.

**Hash Maps for Frequency/Caching:** Using a dictionary to track counts or previously seen elements is common for reducing time complexity from O(n²) to O(n).

**Binary Search on Answer:** For problems involving minimization or maximization under constraints, you may need to apply binary search beyond a sorted array—testing feasible answers within a range.

## Time Targets

In a typical 45-60 minute interview slot, you should aim to solve a Medium problem within **25-30 minutes**. This includes:

- **3-5 minutes:** Understanding the problem, asking clarifying questions, and considering edge cases.
- **5-10 minutes:** Discussing your approach, including time/space complexity, and getting interviewer buy-in.
- **10-15 minutes:** Writing clean, syntactically correct code in your chosen language.
- **3-5 minutes:** Walking through a test case and verifying correctness.

If you exceed 30 minutes without a working solution, you risk not having time to fix bugs or discuss follow-ups. Practice under timed conditions to build this pace.

## Practice Strategy

Don't just solve problems; simulate the interview. For each Yandex Medium question:

1. **Set a 25-minute timer.** Solve it as if you're live.
2. **Explain your approach out loud.** Practice verbalizing your thought process, trade-offs, and complexity analysis.
3. **Write production-ready code.** Include meaningful variable names, consistent formatting, and handle edge cases explicitly.
4. **Analyze failures.** If you miss the time target or get a wrong answer, identify the gap—was it pattern recognition, implementation speed, or a logical flaw?
5. **Group problems by pattern.** After solving, categorize it (e.g., "Sliding Window"). This reinforces pattern matching for future questions.

Focus on depth over breadth. Mastering 20-30 problems across the common patterns is more effective than skimming all 72.

[Practice Medium Yandex questions](/company/yandex/medium)
