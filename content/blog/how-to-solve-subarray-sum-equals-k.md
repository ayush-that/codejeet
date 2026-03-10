---
title: "How to Solve Subarray Sum Equals K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Subarray Sum Equals K. Medium difficulty, 46.8% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2026-05-10"
category: "dsa-patterns"
tags: ["subarray-sum-equals-k", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Subarray Sum Equals K

This problem asks us to count all contiguous subarrays within an integer array whose elements sum to exactly `k`. What makes this problem interesting is that subarrays can start and end at any position, leading to O(n²) possible subarrays. The challenge is finding an efficient way to count them without checking every single one.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 3]` with `k = 3`.

**Brute force thinking:** We could check all subarrays:

- [1] = 1 (not 3)
- [1, 2] = 3 ✓
- [1, 2, 3] = 6 (not 3)
- [2] = 2 (not 3)
- [2, 3] = 5 (not 3)
- [3] = 3 ✓

That gives us 2 subarrays: [1, 2] and [3].

Now let's build intuition for the optimal approach. The key insight comes from prefix sums. A prefix sum is the cumulative sum up to a certain index:

- Index 0: prefix = 1
- Index 1: prefix = 1 + 2 = 3
- Index 2: prefix = 1 + 2 + 3 = 6

Notice that when prefix sum at index 1 equals 3, we found a subarray from start to index 1 that sums to k. But what about subarrays that don't start at the beginning?

Here's the crucial observation: If we want a subarray ending at index `j` to sum to `k`, we need:

```
sum(nums[i...j]) = prefix[j] - prefix[i-1] = k
```

Rearranging:

```
prefix[i-1] = prefix[j] - k
```

So for each position `j`, we're looking for how many previous positions `i-1` had prefix sum equal to `(current_prefix - k)`. This transforms our problem into a frequency counting problem.

## Brute Force Approach

The most straightforward solution is to check every possible subarray:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def subarraySumBrute(nums, k):
    count = 0
    n = len(nums)

    # Try every starting point
    for start in range(n):
        # Try every ending point from start onward
        for end in range(start, n):
            # Calculate sum from start to end
            current_sum = 0
            for i in range(start, end + 1):
                current_sum += nums[i]

            # Check if sum equals k
            if current_sum == k:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function subarraySumBrute(nums, k) {
  let count = 0;
  const n = nums.length;

  // Try every starting point
  for (let start = 0; start < n; start++) {
    // Try every ending point from start onward
    for (let end = start; end < n; end++) {
      // Calculate sum from start to end
      let currentSum = 0;
      for (let i = start; i <= end; i++) {
        currentSum += nums[i];
      }

      // Check if sum equals k
      if (currentSum === k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int subarraySumBrute(int[] nums, int k) {
    int count = 0;
    int n = nums.length;

    // Try every starting point
    for (int start = 0; start < n; start++) {
        // Try every ending point from start onward
        for (int end = start; end < n; end++) {
            // Calculate sum from start to end
            int currentSum = 0;
            for (int i = start; i <= end; i++) {
                currentSum += nums[i];
            }

            // Check if sum equals k
            if (currentSum == k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With O(n³) time complexity, this solution times out for arrays with just a few hundred elements. Even with optimization to O(n²) by precomputing sums, we'd still be too slow for the typical LeetCode constraints (n up to 20,000).

## Optimized Approach

The optimal solution uses a **hash map to store prefix sum frequencies**, building on the insight from our visual walkthrough. Here's the step-by-step reasoning:

1. **Prefix Sum Concept**: Instead of calculating subarray sums from scratch each time, we maintain a running total (prefix sum) as we iterate through the array.

2. **Key Mathematical Insight**: For any subarray `nums[i...j]`:

   ```
   sum(nums[i...j]) = prefix[j] - prefix[i-1]
   ```

   We want this to equal `k`, so:

   ```
   prefix[j] - prefix[i-1] = k
   prefix[i-1] = prefix[j] - k
   ```

3. **Transformation to Frequency Problem**: At position `j`, we want to know: how many previous positions `i-1` had prefix sum equal to `(current_prefix - k)`? This is exactly what a hash map can tell us efficiently.

4. **Handling Subarrays Starting at Index 0**: When a subarray starts at index 0, `prefix[i-1]` would be `prefix[-1]`, which we define as 0. That's why we initialize our hash map with `{0: 1}`.

5. **Incremental Counting**: As we process each element, we:
   - Update the current prefix sum
   - Check how many previous positions had prefix sum `(current - k)`
   - Add that count to our answer
   - Update the frequency of the current prefix sum

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def subarraySum(nums, k):
    """
    Counts the number of contiguous subarrays whose sum equals k.

    The key insight: For any subarray nums[i...j],
    sum(nums[i...j]) = prefix[j] - prefix[i-1] = k
    => prefix[i-1] = prefix[j] - k

    So at each position j, we count how many previous positions i-1
    had prefix sum equal to (current_prefix - k).
    """
    count = 0
    prefix_sum = 0

    # Hash map to store frequency of prefix sums encountered so far
    # Initialize with {0: 1} to handle subarrays starting at index 0
    prefix_freq = {0: 1}

    for num in nums:
        # Update the running prefix sum
        prefix_sum += num

        # Check if (prefix_sum - k) exists in our frequency map
        # If it does, each occurrence represents a valid subarray ending at current position
        if (prefix_sum - k) in prefix_freq:
            count += prefix_freq[prefix_sum - k]

        # Update the frequency of the current prefix sum
        # Use get() with default 0 to handle first occurrence
        prefix_freq[prefix_sum] = prefix_freq.get(prefix_sum, 0) + 1

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function subarraySum(nums, k) {
  /**
   * Counts the number of contiguous subarrays whose sum equals k.
   *
   * The key insight: For any subarray nums[i...j],
   * sum(nums[i...j]) = prefix[j] - prefix[i-1] = k
   * => prefix[i-1] = prefix[j] - k
   *
   * So at each position j, we count how many previous positions i-1
   * had prefix sum equal to (current_prefix - k).
   */
  let count = 0;
  let prefixSum = 0;

  // Hash map to store frequency of prefix sums encountered so far
  // Initialize with {0: 1} to handle subarrays starting at index 0
  const prefixFreq = new Map();
  prefixFreq.set(0, 1);

  for (const num of nums) {
    // Update the running prefix sum
    prefixSum += num;

    // Check if (prefixSum - k) exists in our frequency map
    // If it does, each occurrence represents a valid subarray ending at current position
    const target = prefixSum - k;
    if (prefixFreq.has(target)) {
      count += prefixFreq.get(target);
    }

    // Update the frequency of the current prefix sum
    const currentFreq = prefixFreq.get(prefixSum) || 0;
    prefixFreq.set(prefixSum, currentFreq + 1);
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int subarraySum(int[] nums, int k) {
    /**
     * Counts the number of contiguous subarrays whose sum equals k.
     *
     * The key insight: For any subarray nums[i...j],
     * sum(nums[i...j]) = prefix[j] - prefix[i-1] = k
     * => prefix[i-1] = prefix[j] - k
     *
     * So at each position j, we count how many previous positions i-1
     * had prefix sum equal to (current_prefix - k).
     */
    int count = 0;
    int prefixSum = 0;

    // Hash map to store frequency of prefix sums encountered so far
    // Initialize with {0: 1} to handle subarrays starting at index 0
    Map<Integer, Integer> prefixFreq = new HashMap<>();
    prefixFreq.put(0, 1);

    for (int num : nums) {
        // Update the running prefix sum
        prefixSum += num;

        // Check if (prefixSum - k) exists in our frequency map
        // If it does, each occurrence represents a valid subarray ending at current position
        int target = prefixSum - k;
        if (prefixFreq.containsKey(target)) {
            count += prefixFreq.get(target);
        }

        // Update the frequency of the current prefix sum
        prefixFreq.put(prefixSum, prefixFreq.getOrDefault(prefixSum, 0) + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations (hash map lookups and inserts) for each element.
- Hash map operations (get, put, contains) are O(1) on average.

**Space Complexity: O(n)**

- In the worst case, all prefix sums could be distinct, requiring us to store n+1 entries in the hash map (including the initial 0).
- The space grows linearly with input size.

## Common Mistakes

1. **Forgetting to initialize with `{0: 1}`**: This handles the case where a subarray starts at index 0. Without this, you'll miss all subarrays that begin at the first element. Remember: when `prefix_sum == k`, we need to count the "empty" prefix sum 0 that came before index 0.

2. **Updating the hash map before checking for `(prefix_sum - k)`**: If you add the current prefix sum to the map first, you might incorrectly count subarrays of length 0 (when `k == 0`). Always check for the target before updating the frequency of the current prefix sum.

3. **Using an array instead of a hash map**: Some candidates try to use an array indexed by prefix sum values, but prefix sums can be negative or very large. A hash map handles arbitrary integer values correctly.

4. **Not considering negative numbers**: The problem allows negative numbers in the array, which means prefix sums can decrease. This doesn't break our solution, but candidates sometimes assume monotonic increasing prefix sums and get confused.

## When You'll See This Pattern

The "prefix sum + hash map" pattern appears in several related problems:

1. **Two Sum (Easy)**: The classic problem that introduces the "complement in hash map" pattern. Subarray Sum Equals K extends this to contiguous subarrays.

2. **Continuous Subarray Sum (Medium)**: Instead of looking for exact sum `k`, we look for sums that are multiples of `k`. The approach is similar but uses modulo arithmetic and checks for remainders instead of exact differences.

3. **Subarray Product Less Than K (Medium)**: While this uses a sliding window instead of prefix sums, it's another subarray counting problem. The difference is that products grow/decay differently than sums.

4. **Find All Anagrams in a String (Medium)**: Uses a similar frequency counting approach but with character counts instead of sums.

## Key Takeaways

1. **Transform subarray problems into prefix difference problems**: When you need to find subarrays with a certain property (sum, average, etc.), consider using prefix sums and looking for differences that satisfy your condition.

2. **Hash maps turn O(n²) problems into O(n)**: By storing frequencies of previously seen values, you can answer "how many previous positions had value X?" in constant time instead of linear time.

3. **Initialize with base case**: For prefix sum problems, always consider what value represents "before the array starts" (usually 0) and initialize your data structure accordingly.

Related problems: [Two Sum](/problem/two-sum), [Continuous Subarray Sum](/problem/continuous-subarray-sum), [Subarray Product Less Than K](/problem/subarray-product-less-than-k)
