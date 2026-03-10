---
title: "Prefix Sum Questions at Expedia: What to Expect"
description: "Prepare for Prefix Sum interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-06-10"
category: "dsa-patterns"
tags: ["expedia", "prefix-sum", "interview prep"]
---

# Prefix Sum Questions at Expedia: What to Expect

If you're preparing for Expedia interviews, you might have noticed they have 4 Prefix Sum questions out of 54 total in their tagged problems. That's about 7.4% — not a dominant category, but one that appears consistently enough that you can't afford to ignore it. In real interviews, I've seen candidates encounter prefix sum variations at Expedia more often than at companies with purely theoretical focuses, because Expedia's problems often involve practical data processing scenarios: calculating running totals for metrics, analyzing time-series booking data, or processing aggregated user activity logs.

The key insight is that Expedia uses prefix sum not as an academic exercise, but as a tool for solving efficiency problems with real-world analogs. When you're dealing with millions of booking records or analyzing continuous metrics, the difference between O(n²) and O(n) isn't theoretical — it's the difference between a feature that works and one that times out. Interviewers here care that you recognize when prefix sum applies and can implement it cleanly under pressure.

## Specific Patterns Expedia Favors

Expedia's prefix sum problems tend to cluster around two practical patterns:

1. **Subarray sum problems with constraints** — These aren't just "find any subarray with sum K." Expedia variations often include additional constraints like handling negative numbers, finding the longest subarray, or working with circular arrays. For example, problems similar to **Maximum Sum Circular Subarray (#918)** appear because they model cyclical data patterns (like weekly booking cycles).

2. **Prefix sum as a building block for more complex algorithms** — You'll often see prefix sum combined with hash maps for efficiency (like in **Subarray Sum Equals K (#560)**) or used to precompute data for range queries (similar to **Range Sum Query - Immutable (#303)**). The twist is that Expedia problems might frame these as "calculate rolling 7-day booking totals" or "find periods with above-average conversion rates."

What you won't see much of are purely mathematical prefix sum puzzles. Expedia's problems are grounded in scenarios their engineers might actually encounter: processing time-series data, aggregating metrics, or optimizing repeated calculations on large datasets.

## How to Prepare

The most common pattern you need to master is the **prefix sum + hash map** combination for finding subarrays with a target sum. Here's the core template:

<div class="code-group">

```python
def subarray_sum_equals_k(nums, k):
    """
    Returns the total number of contiguous subarrays whose sum equals k.
    Pattern: prefix_sum + hash_map
    """
    count = 0
    prefix_sum = 0
    # Map: prefix_sum_value -> frequency_of_that_value
    prefix_map = {0: 1}  # Base case: empty subarray has sum 0

    for num in nums:
        prefix_sum += num

        # If (prefix_sum - k) exists in map, we found subarrays ending here
        if (prefix_sum - k) in prefix_map:
            count += prefix_map[prefix_sum - k]

        # Update frequency of current prefix sum
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1

    return count

# Time: O(n) | Space: O(n)
# We iterate once through the array (O(n)) and store at most n prefix sums in the hash map (O(n))
```

```javascript
function subarraySumEqualsK(nums, k) {
  let count = 0;
  let prefixSum = 0;
  const prefixMap = new Map();
  prefixMap.set(0, 1); // Base case: empty subarray

  for (const num of nums) {
    prefixSum += num;

    // Check if (prefixSum - k) exists
    if (prefixMap.has(prefixSum - k)) {
      count += prefixMap.get(prefixSum - k);
    }

    // Update frequency
    prefixMap.set(prefixSum, (prefixMap.get(prefixSum) || 0) + 1);
  }

  return count;
}

// Time: O(n) | Space: O(n)
```

```java
public int subarraySumEqualsK(int[] nums, int k) {
    int count = 0;
    int prefixSum = 0;
    Map<Integer, Integer> prefixMap = new HashMap<>();
    prefixMap.put(0, 1); // Base case

    for (int num : nums) {
        prefixSum += num;

        // Check if (prefixSum - k) exists
        if (prefixMap.containsKey(prefixSum - k)) {
            count += prefixMap.get(prefixSum - k);
        }

        // Update frequency
        prefixMap.put(prefixSum, prefixMap.getOrDefault(prefixSum, 0) + 1);
    }

    return count;
}

// Time: O(n) | Space: O(n)
```

</div>

The second pattern to practice is **prefix sum for range queries**. Expedia might frame this as "quickly answer multiple queries about booking totals between dates":

<div class="code-group">

```python
class RangeSumQuery:
    def __init__(self, nums):
        # Build prefix sum array where prefix[i] = sum(nums[0..i-1])
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def query(self, left, right):
        # Sum from index left to right inclusive
        return self.prefix[right + 1] - self.prefix[left]

# Time for construction: O(n) | Space: O(n)
# Time per query: O(1) | Space: O(1)
```

```javascript
class RangeSumQuery {
  constructor(nums) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  query(left, right) {
    return this.prefix[right + 1] - this.prefix[left];
  }
}

// Time for construction: O(n) | Space: O(n)
// Time per query: O(1) | Space: O(1)
```

```java
class RangeSumQuery {
    private int[] prefix;

    public RangeSumQuery(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public int query(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}

// Time for construction: O(n) | Space: O(n)
// Time per query: O(1) | Space: O(1)
```

</div>

## How Expedia Tests Prefix Sum vs Other Companies

Expedia's prefix sum questions differ from other companies in three noticeable ways:

1. **Context matters more** — At Google or Facebook, you might get a purely algorithmic prefix sum problem. At Expedia, the problem statement often includes business context: "Calculate rolling weekly revenue" or "Find periods where error rates exceeded thresholds." They want to see if you can translate business requirements into efficient code.

2. **Difficulty is moderate, not extreme** — Expedia rarely uses prefix sum as the main challenge in their hardest problems. Instead, it's often part of a medium-difficulty question where the real test is recognizing which tool to use. At companies like Amazon, prefix sum might be buried in a complex DP problem; at Expedia, it's more likely to be the primary technique.

3. **Follow-up questions test practical thinking** — After you solve the core algorithm, Expedia interviewers might ask: "How would this scale with 10 million daily records?" or "What if we needed to query these sums from a database?" They're evaluating your ability to think about systems, not just algorithms.

## Study Order

1. **Basic prefix sum construction and queries** — Start with the absolute fundamentals. Understand how to build a prefix sum array and why `sum(arr[i..j]) = prefix[j+1] - prefix[i]`. This is non-negotiable foundation.

2. **Subarray sum problems with hash maps** — Learn the pattern shown above. This is where prefix sum becomes powerful for optimization problems. Practice until you can derive the logic without memorization.

3. **Prefix sum with sliding window** — Some problems combine prefix sum with sliding window techniques, especially when dealing with positive numbers only. This is a natural extension.

4. **Circular array variations** — Expedia likes these because real-world data often cycles (daily, weekly, seasonal). Learn to handle arrays where the subarray can wrap around.

5. **Multi-dimensional prefix sum** — While less common at Expedia, understanding 2D prefix sum (for matrix problems) completes your knowledge and prepares you for any variation.

This order works because each step builds on the previous one. You can't effectively use prefix sum with hash maps if you don't understand what prefix sum represents. Circular arrays become much easier once you're comfortable with standard subarray problems.

## Recommended Practice Order

1. **Range Sum Query - Immutable (#303)** — The perfect starting point. No tricks, just learning the pattern.
2. **Subarray Sum Equals K (#560)** — Master this before your interview. This is the single most important prefix sum problem for Expedia.
3. **Maximum Subarray (#53)** — Can be solved with prefix sum (though Kadane's algorithm is better). Good for understanding different approaches.
4. **Continuous Subarray Sum (#523)** — Adds the modulo twist, which appears in some Expedia variations.
5. **Maximum Sum Circular Subarray (#918)** — The circular array pattern that Expedia favors.
6. **Product of Array Except Self (#238)** — Not strictly prefix sum, but uses similar cumulative computation thinking.

Work through these in sequence, and make sure you can explain both the algorithm and its complexity analysis for each. Time yourself — Expedia interviews move quickly, and you need to recognize these patterns within minutes.

[Practice Prefix Sum at Expedia](/company/expedia/prefix-sum)
