---
title: "How to Solve Contiguous Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Contiguous Array. Medium difficulty, 50.8% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2027-02-09"
category: "dsa-patterns"
tags: ["contiguous-array", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Contiguous Array

Given a binary array containing only 0s and 1s, we need to find the longest contiguous subarray that has an equal number of 0s and 1s. What makes this problem interesting is that we can't simply count zeros and ones as we go—we need an efficient way to track when we've seen equal numbers before. The brute force approach would check every possible subarray, but that's O(n²), which is too slow for large arrays. The optimal solution uses a clever transformation and hash map to solve it in O(n) time.

## Visual Walkthrough

Let's trace through the example `nums = [0, 1, 0, 1, 1, 0, 0]` step by step.

The key insight is to transform 0s to -1 and 1s to +1. This way, when the sum of a subarray is 0, we know it has equal numbers of 0s and 1s.

**Transformed array:** `[-1, 1, -1, 1, 1, -1, -1]`

Now let's track the running sum and when we first see each sum value:

1. Start with sum = 0 at index -1 (before the array begins)
2. Index 0: value = -1, sum = -1 (first time seeing -1)
3. Index 1: value = 1, sum = 0 (we've seen 0 before at index -1, so length = 1 - (-1) = 2)
4. Index 2: value = -1, sum = -1 (we've seen -1 before at index 0, so length = 2 - 0 = 2)
5. Index 3: value = 1, sum = 0 (we've seen 0 before at index -1, so length = 3 - (-1) = 4)
6. Index 4: value = 1, sum = 1 (first time seeing 1)
7. Index 5: value = -1, sum = 0 (we've seen 0 before at index -1, so length = 5 - (-1) = 6)
8. Index 6: value = -1, sum = -1 (we've seen -1 before at index 0, so length = 6 - 0 = 6)

The maximum length we found is 6, which corresponds to the subarray from index 1 to 6: `[1, 0, 1, 1, 0, 0]` (3 zeros and 3 ones).

## Brute Force Approach

The most straightforward approach is to check every possible subarray. For each starting index `i`, we iterate through all ending indices `j ≥ i`, counting zeros and ones in that subarray. When we find equal numbers, we update our maximum length.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def findMaxLength(nums):
    max_len = 0
    n = len(nums)

    for i in range(n):
        zeros = 0
        ones = 0
        for j in range(i, n):
            if nums[j] == 0:
                zeros += 1
            else:
                ones += 1

            if zeros == ones:
                max_len = max(max_len, j - i + 1)

    return max_len
```

```javascript
// Time: O(n²) | Space: O(1)
function findMaxLength(nums) {
  let maxLen = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    let zeros = 0;
    let ones = 0;

    for (let j = i; j < n; j++) {
      if (nums[j] === 0) {
        zeros++;
      } else {
        ones++;
      }

      if (zeros === ones) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n²) | Space: O(1)
public int findMaxLength(int[] nums) {
    int maxLen = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        int zeros = 0;
        int ones = 0;

        for (int j = i; j < n; j++) {
            if (nums[j] == 0) {
                zeros++;
            } else {
                ones++;
            }

            if (zeros == ones) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

</div>

**Why this is insufficient:** For an array of length n, there are n(n+1)/2 possible subarrays, making this O(n²) in time complexity. For n = 10⁵ (a common constraint), this would require about 5 billion operations, which is far too slow.

## Optimized Approach

The key insight is to transform the problem into finding the longest subarray with sum 0. Here's the step-by-step reasoning:

1. **Transformation:** Replace all 0s with -1. Now, a subarray with equal numbers of 0s and 1s will have sum 0.
2. **Prefix Sum:** Calculate the running sum as we iterate through the array.
3. **Hash Map Tracking:** Store the first index where each sum value appears.
4. **Length Calculation:** If we see a sum we've seen before at index `i`, then the subarray from `i+1` to current index has sum 0.

Why does this work? If the running sum at index `j` equals the running sum at some earlier index `i`, then the sum of elements between `i+1` and `j` must be 0. This is because:

```
sum[0...j] = sum[0...i] + sum[i+1...j]
If sum[0...j] = sum[0...i], then sum[i+1...j] = 0
```

The critical initialization: we start with sum 0 at "index -1" (before the array begins) because an empty subarray has sum 0.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findMaxLength(nums):
    """
    Find the maximum length of a contiguous subarray with equal number of 0 and 1.

    Approach:
    1. Transform 0 to -1, so equal 0s and 1s means sum = 0
    2. Use hash map to store first occurrence of each running sum
    3. When same sum appears again, calculate subarray length

    Args:
        nums: List[int] - Binary array containing only 0s and 1s

    Returns:
        int - Maximum length of subarray with equal 0s and 1s
    """
    # Dictionary to store first occurrence index of each running sum
    # Initialize with sum 0 at index -1 (before array starts)
    sum_index_map = {0: -1}

    max_len = 0
    running_sum = 0

    for i, num in enumerate(nums):
        # Transform: 0 -> -1, 1 -> 1
        # This way, equal numbers of 0 and 1 gives sum 0
        running_sum += 1 if num == 1 else -1

        # Check if we've seen this running sum before
        if running_sum in sum_index_map:
            # If yes, calculate length from first occurrence to current index
            # The subarray from (first_index + 1) to i has sum 0
            first_index = sum_index_map[running_sum]
            current_len = i - first_index
            max_len = max(max_len, current_len)
        else:
            # Store first occurrence of this running sum
            sum_index_map[running_sum] = i

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
function findMaxLength(nums) {
  /**
   * Find the maximum length of a contiguous subarray with equal number of 0 and 1.
   *
   * Approach:
   * 1. Transform 0 to -1, so equal 0s and 1s means sum = 0
   * 2. Use hash map to store first occurrence of each running sum
   * 3. When same sum appears again, calculate subarray length
   *
   * @param {number[]} nums - Binary array containing only 0s and 1s
   * @return {number} - Maximum length of subarray with equal 0s and 1s
   */

  // Map to store first occurrence index of each running sum
  // Initialize with sum 0 at index -1 (before array starts)
  const sumIndexMap = new Map();
  sumIndexMap.set(0, -1);

  let maxLen = 0;
  let runningSum = 0;

  for (let i = 0; i < nums.length; i++) {
    // Transform: 0 -> -1, 1 -> 1
    // This way, equal numbers of 0 and 1 gives sum 0
    runningSum += nums[i] === 1 ? 1 : -1;

    // Check if we've seen this running sum before
    if (sumIndexMap.has(runningSum)) {
      // If yes, calculate length from first occurrence to current index
      // The subarray from (firstIndex + 1) to i has sum 0
      const firstIndex = sumIndexMap.get(runningSum);
      const currentLen = i - firstIndex;
      maxLen = Math.max(maxLen, currentLen);
    } else {
      // Store first occurrence of this running sum
      sumIndexMap.set(runningSum, i);
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
public int findMaxLength(int[] nums) {
    /**
     * Find the maximum length of a contiguous subarray with equal number of 0 and 1.
     *
     * Approach:
     * 1. Transform 0 to -1, so equal 0s and 1s means sum = 0
     * 2. Use hash map to store first occurrence of each running sum
     * 3. When same sum appears again, calculate subarray length
     *
     * @param nums - Binary array containing only 0s and 1s
     * @return Maximum length of subarray with equal 0s and 1s
     */

    // HashMap to store first occurrence index of each running sum
    // Initialize with sum 0 at index -1 (before array starts)
    Map<Integer, Integer> sumIndexMap = new HashMap<>();
    sumIndexMap.put(0, -1);

    int maxLen = 0;
    int runningSum = 0;

    for (int i = 0; i < nums.length; i++) {
        // Transform: 0 -> -1, 1 -> 1
        // This way, equal numbers of 0 and 1 gives sum 0
        runningSum += nums[i] == 1 ? 1 : -1;

        // Check if we've seen this running sum before
        if (sumIndexMap.containsKey(runningSum)) {
            // If yes, calculate length from first occurrence to current index
            // The subarray from (firstIndex + 1) to i has sum 0
            int firstIndex = sumIndexMap.get(runningSum);
            int currentLen = i - firstIndex;
            maxLen = Math.max(maxLen, currentLen);
        } else {
            // Store first occurrence of this running sum
            sumIndexMap.put(runningSum, i);
        }
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input array. We make a single pass through the array, performing O(1) operations (hash map lookups and inserts) at each step.

**Space Complexity:** O(n) in the worst case. The hash map can store up to n+1 different sum values (from -n to n). In practice, it stores at most O(n) entries since each unique running sum gets stored once.

## Common Mistakes

1. **Forgetting to initialize with sum 0 at index -1:** This is crucial because a subarray starting at index 0 with sum 0 should be detectable. Without this initialization, you'll miss valid subarrays that start at the beginning of the array.

2. **Updating the hash map for every occurrence instead of first occurrence:** If you update the map with the latest index, you'll get shorter subarrays. We want the first occurrence to maximize the length.

3. **Incorrect transformation:** Some candidates try to track the difference between zeros and ones directly without the -1/+1 transformation. This makes the sum calculation messy and error-prone.

4. **Off-by-one errors in length calculation:** Remember that if sum at index j equals sum at index i, the subarray from i+1 to j has sum 0. The length is j - i, not j - i + 1.

## When You'll See This Pattern

This "prefix sum with hash map" pattern appears in several other problems:

1. **Maximum Size Subarray Sum Equals k:** Exactly the same pattern—track running sums in a hash map and look for `current_sum - k` in the map. This problem is a special case where k = 0 after transformation.

2. **Subarray Sum Equals K:** Count all subarrays with sum k using similar logic but keeping count of occurrences rather than just first index.

3. **Find the Longest Subarray With Absolute Diff Less Than or Equal to Limit:** While not identical, it uses a similar sliding window with data structures to track min/max.

The core pattern: when you need to find subarrays with some property related to sums (equal numbers, specific sum, etc.), consider transforming the problem and using prefix sums with a hash map for O(n) solutions.

## Key Takeaways

1. **Transformation is key:** Converting 0s to -1 transforms "equal numbers of 0s and 1s" into "sum equals 0," which is easier to work with mathematically.

2. **Prefix sum + hash map = powerful combination:** This pattern lets you find subarrays with specific sums in O(n) time by remembering where sums occurred previously.

3. **Initialize properly:** Always consider whether you need to initialize your data structure with a base case (like sum 0 at index -1) to handle edge cases correctly.

Recognize this pattern when you need to find contiguous subarrays with specific properties, especially when the property can be expressed as a sum or difference constraint.

Related problems: [Maximum Size Subarray Sum Equals k](/problem/maximum-size-subarray-sum-equals-k), [Find All Possible Stable Binary Arrays I](/problem/find-all-possible-stable-binary-arrays-i), [Find All Possible Stable Binary Arrays II](/problem/find-all-possible-stable-binary-arrays-ii)
