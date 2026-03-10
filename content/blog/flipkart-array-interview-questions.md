---
title: "Array Questions at Flipkart: What to Expect"
description: "Prepare for Array interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-04-12"
category: "dsa-patterns"
tags: ["flipkart", "array", "interview prep"]
---

# Array Questions at Flipkart: What to Expect

If you're preparing for a Flipkart interview, you've probably noticed the overwhelming presence of array problems in their question bank — 79 out of 117 total questions. This isn't a coincidence. Arrays are the fundamental data structure for representing real-world data in e-commerce systems: product listings, user carts, transaction logs, inventory levels, and pricing matrices. At Flipkart, array questions aren't just an academic exercise; they're a direct test of your ability to manipulate the kind of data their systems process billions of times daily.

In real interviews, array problems appear in nearly every technical round, from initial screening to final bar-raiser sessions. They serve as the perfect filter: a well-designed array problem can test your grasp of time-space tradeoffs, edge case handling, and clean code practices in just 30-45 minutes. While other topics like graphs and DP matter, array proficiency is non-negotiable.

## Specific Patterns Flipkart Favors

Flipkart's array problems tend to cluster around three practical domains: **subarray manipulations**, **sorting-based transformations**, and **two-pointer applications**. You'll notice a distinct preference for problems that model real e-commerce scenarios.

**Subarray problems** are particularly common because they mirror operations on transactional data — think "find the maximum revenue in a contiguous time period" or "identify the longest period of consistent user engagement." Problems like **Maximum Subarray (#53)** and **Subarray Sum Equals K (#560)** appear frequently in variations.

**Sorting-based problems** often involve custom comparators or clever rearrangements. Flipkart loves problems where you need to arrange data to meet business constraints, like **Meeting Rooms II (#253)** (modeling resource allocation) or **Task Scheduler (#621)** (optimizing warehouse workflows).

**Two-pointer techniques** show up in optimization scenarios: merging sorted lists (inventory updates), removing duplicates (data cleansing), or finding pairs (matching products to deals). **Container With Most Water (#11)** and **3Sum (#15)** are classic examples.

What you won't see much of: purely mathematical array puzzles or overly abstract problems. Flipkart's questions almost always have a tangible connection to their business domains.

## How to Prepare

Master the patterns, not just the problems. Here's the key insight: most Flipkart array problems combine **sorting** with **two-pointer traversal** or **hash map lookups**. Let's examine the most common variation — finding pairs or subarrays that satisfy constraints.

<div class="code-group">

```python
# Pattern: Two-pointer with sorted array
# Problem type: Find all unique pairs summing to target
# Time: O(n log n) for sort + O(n) for two-pointer = O(n log n)
# Space: O(1) if we ignore output storage, O(n) if we count it

def find_pairs(nums, target):
    """Return all unique pairs in nums that sum to target."""
    nums.sort()  # Critical first step
    left, right = 0, len(nums) - 1
    result = []

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target:
            result.append([nums[left], nums[right]])
            # Skip duplicates
            while left < right and nums[left] == nums[left + 1]:
                left += 1
            while left < right and nums[right] == nums[right - 1]:
                right -= 1
            left += 1
            right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return result
```

```javascript
// Pattern: Two-pointer with sorted array
// Problem type: Find all unique pairs summing to target
// Time: O(n log n) for sort + O(n) for two-pointer = O(n log n)
// Space: O(1) if we ignore output storage, O(n) if we count it

function findPairs(nums, target) {
  nums.sort((a, b) => a - b); // Critical first step
  let left = 0;
  let right = nums.length - 1;
  const result = [];

  while (left < right) {
    const currentSum = nums[left] + nums[right];

    if (currentSum === target) {
      result.push([nums[left], nums[right]]);
      // Skip duplicates
      while (left < right && nums[left] === nums[left + 1]) left++;
      while (left < right && nums[right] === nums[right - 1]) right--;
      left++;
      right--;
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }

  return result;
}
```

```java
// Pattern: Two-pointer with sorted array
// Problem type: Find all unique pairs summing to target
// Time: O(n log n) for sort + O(n) for two-pointer = O(n log n)
// Space: O(1) if we ignore output storage, O(n) if we count it

import java.util.*;

public List<List<Integer>> findPairs(int[] nums, int target) {
    Arrays.sort(nums);  // Critical first step
    int left = 0, right = nums.length - 1;
    List<List<Integer>> result = new ArrayList<>();

    while (left < right) {
        int currentSum = nums[left] + nums[right];

        if (currentSum == target) {
            result.add(Arrays.asList(nums[left], nums[right]));
            // Skip duplicates
            while (left < right && nums[left] == nums[left + 1]) left++;
            while (left < right && nums[right] == nums[right - 1]) right--;
            left++;
            right--;
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }

    return result;
}
```

</div>

The second critical pattern is **prefix sum with hash map** for subarray problems. This is essential for Flipkart-style problems involving cumulative metrics.

<div class="code-group">

```python
# Pattern: Prefix sum with hash map
# Problem type: Count subarrays with sum equal to k
# Time: O(n) single pass
# Space: O(n) for the hash map

def subarray_sum(nums, k):
    """Return count of subarrays summing to exactly k."""
    prefix_sum = 0
    count = 0
    sum_count = {0: 1}  # Base case: empty subarray has sum 0

    for num in nums:
        prefix_sum += num

        # If (prefix_sum - k) exists in map, we found subarrays
        if (prefix_sum - k) in sum_count:
            count += sum_count[prefix_sum - k]

        # Update the frequency of current prefix sum
        sum_count[prefix_sum] = sum_count.get(prefix_sum, 0) + 1

    return count
```

```javascript
// Pattern: Prefix sum with hash map
// Problem type: Count subarrays with sum equal to k
// Time: O(n) single pass
// Space: O(n) for the hash map

function subarraySum(nums, k) {
  let prefixSum = 0;
  let count = 0;
  const sumCount = new Map();
  sumCount.set(0, 1); // Base case: empty subarray has sum 0

  for (const num of nums) {
    prefixSum += num;

    // If (prefixSum - k) exists in map, we found subarrays
    if (sumCount.has(prefixSum - k)) {
      count += sumCount.get(prefixSum - k);
    }

    // Update the frequency of current prefix sum
    sumCount.set(prefixSum, (sumCount.get(prefixSum) || 0) + 1);
  }

  return count;
}
```

```java
// Pattern: Prefix sum with hash map
// Problem type: Count subarrays with sum equal to k
// Time: O(n) single pass
// Space: O(n) for the hash map

import java.util.*;

public int subarraySum(int[] nums, int k) {
    int prefixSum = 0;
    int count = 0;
    Map<Integer, Integer> sumCount = new HashMap<>();
    sumCount.put(0, 1);  // Base case: empty subarray has sum 0

    for (int num : nums) {
        prefixSum += num;

        // If (prefixSum - k) exists in map, we found subarrays
        if (sumCount.containsKey(prefixSum - k)) {
            count += sumCount.get(prefixSum - k);
        }

        // Update the frequency of current prefix sum
        sumCount.put(prefixSum, sumCount.getOrDefault(prefixSum, 0) + 1);
    }

    return count;
}
```

</div>

## How Flipkart Tests Array vs Other Companies

Compared to FAANG companies, Flipkart's array problems have distinct characteristics:

1. **Business context matters more** — While Google might ask abstract array rotations, Flipkart will frame it as "rotating featured product displays." The underlying algorithm is the same, but they expect you to recognize the business implication.

2. **Optimal solutions are mandatory** — At some companies, a brute-force solution with good explanation might get partial credit. At Flipkart, you need the optimal solution. Their interviewers are particularly strict about time complexity justification.

3. **Edge cases reflect real data** — Instead of generic edge cases, expect ones that mirror production scenarios: empty carts, single-item orders, duplicate products, negative pricing (refunds), and large datasets.

4. **Follow-up questions drill deeper** — A typical progression: solve the basic problem, then handle duplicates, then optimize for streaming data, then discuss how you'd scale it horizontally. Each step tests a different layer of understanding.

## Study Order

Follow this progression to build competence systematically:

1. **Basic operations and traversals** — Start with simple iterations, swaps, and reversals. This builds muscle memory for array manipulation.
2. **Two-pointer techniques** — Master opposite-direction and same-direction pointers. This is the most frequently used pattern.
3. **Sliding window** — Learn fixed-size and variable-size windows. Essential for subarray problems.
4. **Prefix sums** — Understand cumulative sums and their applications in range queries.
5. **Sorting and searching** — Not just built-in sorts, but custom comparators and search variations.
6. **In-place operations** — Practice modifying arrays without extra space — crucial for memory-constrained scenarios.
7. **Matrix operations** — Since 2D arrays are just arrays of arrays, apply 1D techniques to matrix problems.

This order works because each topic builds on the previous one. Two-pointer requires comfort with basic traversal. Sliding window extends two-pointer concepts. Prefix sums combine with hash maps for advanced subarray problems.

## Recommended Practice Order

Solve these problems in sequence to build Flipkart-specific competency:

1. **Two Sum (#1)** — The foundational hash map problem
2. **Best Time to Buy and Sell Stock (#121)** — Simple one-pass logic
3. **Merge Intervals (#56)** — Custom sorting and merging
4. **3Sum (#15)** — Two-pointer with sorting and duplicate handling
5. **Container With Most Water (#11)** — Opposite-direction two-pointer
6. **Subarray Sum Equals K (#560)** — Prefix sum with hash map (critical)
7. **Maximum Subarray (#53)** — Kadane's algorithm
8. **Find All Duplicates in an Array (#442)** — In-place marking technique
9. **Meeting Rooms II (#253)** — Sorting with min-heap
10. **Task Scheduler (#621)** — Greedy with frequency counting

After completing these, move to Flipkart's tagged problems, focusing on the patterns you've learned rather than memorizing solutions.

[Practice Array at Flipkart](/company/flipkart/array)
