---
title: "Array Questions at Goldman Sachs: What to Expect"
description: "Prepare for Array interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-07-27"
category: "dsa-patterns"
tags: ["goldman-sachs", "array", "interview prep"]
---

Array questions make up over half of Goldman Sachs’ technical interview problem set—154 out of 270 total questions. This isn’t a coincidence. Arrays are the fundamental data structure for representing ordered data, financial time series, transaction logs, and portfolio holdings. At a firm built on quantitative analysis and high-volume data processing, your ability to manipulate arrays efficiently is a direct proxy for your ability to handle real-world financial data streams. Expect array questions in every stage, from initial coding screens to on-site system design discussions where array-based data models are foundational.

## What to Expect — Types of Problems

Goldman Sachs array problems tend to focus on practical application over abstract puzzle-solving. You’ll encounter three primary categories:

1.  **Subarray & Prefix Sum Problems:** Calculating maximum profit from a time series (like stock prices), finding contiguous segments that meet a condition (e.g., sum or average targets), or analyzing rolling windows of data. These test your ability to think in terms of cumulative data and sliding windows.
2.  **Sorting & Searching Variations:** Problems often involve sorting an array of financial instruments or transactions by multiple criteria, or searching for specific entries in sorted financial records. You might merge sorted lists (like combining trade feeds) or find missing/duplicate entries in sequenced data.
3.  **In-Place Array Manipulation:** Tasks like removing duplicates from a sorted transaction log, moving zeros (or invalid entries) to the end, or rotating arrays. These assess your skill at efficient memory management, crucial for high-performance systems.

Less frequent but still important are problems involving hash maps (for fast lookups) and two-pointer techniques, often used in combination with the categories above.

## How to Prepare — Study Tips with One Code Example

Focus on mastering patterns, not memorizing problems. Understand the underlying technique for each category so you can adapt. For example, **prefix sum** is a key pattern for any problem involving contiguous subarrays. It allows you to calculate the sum of any subarray in constant time after a linear pre-processing step.

Here is a classic example: finding a contiguous subarray that sums to a target value. The brute-force approach is O(n²). Using a hash map with a prefix sum reduces it to O(n).

<div class="code-group">

```python
def subarray_sum(nums, target):
    prefix_sum = {0: -1}  # sum: index
    current_sum = 0
    for i, num in enumerate(nums):
        current_sum += num
        if current_sum - target in prefix_sum:
            return [prefix_sum[current_sum - target] + 1, i]
        prefix_sum[current_sum] = i
    return []
```

```javascript
function subarraySum(nums, target) {
  const prefixSum = new Map();
  prefixSum.set(0, -1);
  let currentSum = 0;
  for (let i = 0; i < nums.length; i++) {
    currentSum += nums[i];
    if (prefixSum.has(currentSum - target)) {
      return [prefixSum.get(currentSum - target) + 1, i];
    }
    prefixSum.set(currentSum, i);
  }
  return [];
}
```

```java
public int[] subarraySum(int[] nums, int target) {
    Map<Integer, Integer> prefixSum = new HashMap<>();
    prefixSum.put(0, -1);
    int currentSum = 0;
    for (int i = 0; i < nums.length; i++) {
        currentSum += nums[i];
        if (prefixSum.containsKey(currentSum - target)) {
            return new int[]{prefixSum.get(currentSum - target) + 1, i};
        }
        prefixSum.put(currentSum, i);
    }
    return new int[]{};
}
```

</div>

## Recommended Practice Order

Start with core manipulation and sorting problems to build fluency. Then move to prefix sum and sliding window patterns, as these are highly frequent. Finally, tackle hybrid problems that combine arrays with hash maps or heaps. Always analyze time and space complexity aloud during practice to build interview habits.

[Practice Array at Goldman Sachs](/company/goldman-sachs/array)
