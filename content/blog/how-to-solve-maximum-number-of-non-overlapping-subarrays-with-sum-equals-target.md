---
title: "How to Solve Maximum Number of Non-Overlapping Subarrays With Sum Equals Target — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Non-Overlapping Subarrays With Sum Equals Target. Medium difficulty, 48.8% acceptance rate. Topics: Array, Hash Table, Greedy, Prefix Sum."
date: "2029-02-08"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-non-overlapping-subarrays-with-sum-equals-target",
    "array",
    "hash-table",
    "greedy",
    "medium",
  ]
---

# How to Solve Maximum Number of Non-Overlapping Subarrays With Sum Equals Target

You're given an array of integers `nums` and a target integer `target`. Your task is to find the maximum number of non-overlapping subarrays where each subarray's sum equals `target`. The challenge here is balancing two competing goals: finding as many subarrays as possible while ensuring they don't overlap. This problem is interesting because it combines prefix sums (for efficient sum calculation) with greedy selection (for maximizing count without overlaps).

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 3, 4, 2, 1, 3]` with `target = 5`.

**Step 1: Track prefix sums**
We'll keep a running total and look for subarrays that sum to target:

- Prefix sum at index i = sum of nums[0] through nums[i]
- A subarray from j+1 to i has sum = prefix[i] - prefix[j]

**Step 2: Process each element**
Initialize: prefix_sum = 0, count = 0, last_end = -1

1. i=0, num=1: prefix_sum = 1. No target found.
2. i=1, num=2: prefix_sum = 3. No target found.
3. i=2, num=3: prefix_sum = 6. Check if (6 - 5) = 1 exists in seen sums? No.
4. i=3, num=4: prefix_sum = 10. Check if (10 - 5) = 5 exists? No.
5. i=4, num=2: prefix_sum = 12. Check if (12 - 5) = 7 exists? No.
6. i=5, num=1: prefix_sum = 13. Check if (13 - 5) = 8 exists? No.
7. i=6, num=3: prefix_sum = 16. Check if (16 - 5) = 11 exists? No.

Wait, this approach isn't working because we're not tracking all prefix sums properly. Let me correct:

**Better approach with hash map:**
We track prefix sums and use the fact that if prefix_sum - target exists in our map, we found a valid subarray ending at current index.

Initialize: prefix_sum = 0, count = 0, last_end = -1, seen = {0: -1}

1. i=0, num=1: prefix_sum = 1. Check if (1 - 5) = -4 in seen? No. seen[1] = 0
2. i=1, num=2: prefix_sum = 3. Check if (3 - 5) = -2 in seen? No. seen[3] = 1
3. i=2, num=3: prefix_sum = 6. Check if (6 - 5) = 1 in seen? Yes! seen[1] = 0.
   This means subarray from index 1 to 2 sums to 5: nums[1:3] = [2, 3] = 5.
   Since last_end = -1 < 0 (start of subarray), we can take it. count = 1, last_end = 2.
   Reset seen to {0: -1} to avoid overlaps? Actually, we should only track prefix sums after last_end.
4. i=3, num=4: prefix_sum = 4 (starting fresh after reset). Check if (4 - 5) = -1 in seen? No. seen[4] = 3
5. i=4, num=2: prefix_sum = 6. Check if (6 - 5) = 1 in seen? No. seen[6] = 4
6. i=5, num=1: prefix_sum = 7. Check if (7 - 5) = 2 in seen? No. seen[7] = 5
7. i=6, num=3: prefix_sum = 10. Check if (10 - 5) = 5 in seen? No.

We only found 1 subarray, but let's check manually:

- [2, 3] = 5 (indices 1-2)
- [4, 1] = 5? No, 4+1=5 but they're not consecutive (index 3 and 5)
- [3, 2] = 5? No, 3+2=5 but indices 2 and 4
- [1, 4] = 5? No, 1+4=5 but indices 0 and 3
- [1, 2, 2] = 5? No, 1+2+2=5 but indices 0, 1, 4

Actually, there's only 1 valid contiguous subarray summing to 5: [2, 3]. So answer is 1.

The key insight: when we find a valid subarray, we should reset our tracking to avoid overlaps, and we want to take the earliest ending subarray to leave room for more.

## Brute Force Approach

A naive solution would try all possible subarrays and then select a non-overlapping set. Here's how it would work:

1. Find ALL subarrays that sum to target (O(n²) to generate all subarrays, O(n) to check each)
2. Try to select maximum number of non-overlapping ones (this becomes a combinatorial optimization problem)

The brute force approach has several issues:

- Finding all subarrays takes O(n²) time
- Selecting the maximum non-overlapping set is essentially an interval scheduling problem, which could take exponential time if we try all combinations
- Even with dynamic programming, we'd need O(n²) time and space

Here's what the brute force might look like (finding just the subarrays):

<div class="code-group">

```python
# Brute force - too slow for large inputs
def maxNonOverlapping(nums, target):
    n = len(nums)
    valid_subarrays = []

    # Find all subarrays summing to target: O(n²)
    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += nums[j]
            if current_sum == target:
                valid_subarrays.append((i, j))

    # Now we need to select maximum non-overlapping intervals
    # This is the "maximum non-overlapping intervals" problem
    # But we already have O(n²) just to find the intervals!

    # Sort by end time for greedy selection
    valid_subarrays.sort(key=lambda x: x[1])

    count = 0
    last_end = -1
    for start, end in valid_subarrays:
        if start > last_end:
            count += 1
            last_end = end

    return count
```

```javascript
// Brute force - too slow for large inputs
function maxNonOverlapping(nums, target) {
  const n = nums.length;
  const validSubarrays = [];

  // Find all subarrays summing to target: O(n²)
  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    for (let j = i; j < n; j++) {
      currentSum += nums[j];
      if (currentSum === target) {
        validSubarrays.push([i, j]);
      }
    }
  }

  // Sort by end time for greedy selection
  validSubarrays.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = -1;
  for (const [start, end] of validSubarrays) {
    if (start > lastEnd) {
      count++;
      lastEnd = end;
    }
  }

  return count;
}
```

```java
// Brute force - too slow for large inputs
public int maxNonOverlapping(int[] nums, int target) {
    int n = nums.length;
    List<int[]> validSubarrays = new ArrayList<>();

    // Find all subarrays summing to target: O(n²)
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        for (int j = i; j < n; j++) {
            currentSum += nums[j];
            if (currentSum == target) {
                validSubarrays.add(new int[]{i, j});
            }
        }
    }

    // Sort by end time for greedy selection
    validSubarrays.sort((a, b) -> a[1] - b[1]);

    int count = 0;
    int lastEnd = -1;
    for (int[] interval : validSubarrays) {
        if (interval[0] > lastEnd) {
            count++;
            lastEnd = interval[1];
        }
    }

    return count;
}
```

</div>

This approach is O(n²) time and O(n²) space in worst case (when many subarrays sum to target). For n=10⁵, this is completely infeasible.

## Optimized Approach

The key insight is combining **prefix sums** with **greedy selection**:

1. **Prefix Sums**: We can compute the sum of any subarray in O(1) time if we have prefix sums. If `prefix[i]` is sum of first i elements, then sum from j to i is `prefix[i] - prefix[j-1]`.

2. **Hash Map for O(1) lookup**: We store prefix sums we've seen so far in a hash map. If `current_prefix_sum - target` exists in our map, we found a subarray summing to target.

3. **Greedy Selection**: When we find a valid subarray, we should take it immediately (greedy choice) and reset our tracking. Why greedy works? Taking the earliest-ending valid subarray leaves maximum room for additional subarrays.

4. **Reset on Success**: When we find a valid subarray, we reset the hash map to only track prefix sums from after this subarray. This ensures no overlaps.

The algorithm:

- Initialize `prefix_sum = 0`, `count = 0`, and a hash map `seen` with `{0: -1}` (empty prefix)
- Iterate through nums:
  - Add current number to `prefix_sum`
  - Check if `prefix_sum - target` exists in `seen`
  - If yes, we found a valid subarray: increment count, reset `prefix_sum = 0`, clear `seen`, add `{0: -1}` to `seen`
  - If no, add `prefix_sum` to `seen` with current index
- Return `count`

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxNonOverlapping(nums, target):
    """
    Find maximum number of non-overlapping subarrays with sum equal to target.

    Approach: Use prefix sums with greedy selection.
    When we find a valid subarray, we take it immediately and reset
    our tracking to avoid overlaps.
    """
    # Track prefix sums we've seen
    seen = set()
    # Initialize with 0 to handle subarrays starting from index 0
    seen.add(0)

    prefix_sum = 0
    count = 0

    for num in nums:
        # Update running prefix sum
        prefix_sum += num

        # Check if we've seen (prefix_sum - target) before
        # If yes, we found a subarray summing to target
        if (prefix_sum - target) in seen:
            # Increment count since we found a valid subarray
            count += 1
            # Reset tracking to avoid overlaps
            # Clear all seen prefix sums
            seen = set()
            # Reset prefix_sum for next subarrays
            prefix_sum = 0
            # Add 0 back for next iteration
            seen.add(0)
        else:
            # Add current prefix_sum to seen set for future checks
            seen.add(prefix_sum)

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function maxNonOverlapping(nums, target) {
  /**
   * Find maximum number of non-overlapping subarrays with sum equal to target.
   *
   * Approach: Use prefix sums with greedy selection.
   * When we find a valid subarray, we take it immediately and reset
   * our tracking to avoid overlaps.
   */
  // Track prefix sums we've seen
  let seen = new Set();
  // Initialize with 0 to handle subarrays starting from index 0
  seen.add(0);

  let prefixSum = 0;
  let count = 0;

  for (const num of nums) {
    // Update running prefix sum
    prefixSum += num;

    // Check if we've seen (prefixSum - target) before
    // If yes, we found a subarray summing to target
    if (seen.has(prefixSum - target)) {
      // Increment count since we found a valid subarray
      count++;
      // Reset tracking to avoid overlaps
      // Clear all seen prefix sums
      seen = new Set();
      // Reset prefixSum for next subarrays
      prefixSum = 0;
      // Add 0 back for next iteration
      seen.add(0);
    } else {
      // Add current prefixSum to seen set for future checks
      seen.add(prefixSum);
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int maxNonOverlapping(int[] nums, int target) {
    /**
     * Find maximum number of non-overlapping subarrays with sum equal to target.
     *
     * Approach: Use prefix sums with greedy selection.
     * When we find a valid subarray, we take it immediately and reset
     * our tracking to avoid overlaps.
     */
    // Track prefix sums we've seen
    Set<Integer> seen = new HashSet<>();
    // Initialize with 0 to handle subarrays starting from index 0
    seen.add(0);

    int prefixSum = 0;
    int count = 0;

    for (int num : nums) {
        // Update running prefix sum
        prefixSum += num;

        // Check if we've seen (prefixSum - target) before
        // If yes, we found a subarray summing to target
        if (seen.contains(prefixSum - target)) {
            // Increment count since we found a valid subarray
            count++;
            // Reset tracking to avoid overlaps
            // Clear all seen prefix sums
            seen = new HashSet<>();
            // Reset prefixSum for next subarrays
            prefixSum = 0;
            // Add 0 back for next iteration
            seen.add(0);
        } else {
            // Add current prefixSum to seen set for future checks
            seen.add(prefixSum);
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array (n iterations)
- Each iteration does O(1) operations: hash set lookups and insertions
- Even though we create new hash sets when resetting, each element is added to a set at most once, so total operations are O(n)

**Space Complexity: O(n)**

- In the worst case, we might store all prefix sums in the hash set before finding a valid subarray
- Example: nums = [1, 1, 1, ...], target = n (we won't find any subarray until the end)
- The hash set can grow to size n in worst case

## Common Mistakes

1. **Not resetting the hash map after finding a subarray**: If you keep all prefix sums in the map, you might count overlapping subarrays. For example, with nums = [1, 1, 1, 1] and target = 2, you could find [1,1] at indices 0-1 and [1,1] at indices 1-2, but they overlap at index 1.

2. **Forgetting to initialize with prefix sum 0**: Subarrays starting at index 0 need special handling. If the first k elements sum to target, we need to recognize that prefix_sum - target = 0, so we must have 0 in our set initially.

3. **Using a list instead of a hash set for O(1) lookups**: Some candidates try to store prefix sums in a list and search linearly, making the solution O(n²) instead of O(n).

4. **Incorrect greedy strategy**: Trying to find the "best" subarray instead of taking the first valid one. The greedy approach works because taking the earliest-ending valid subarray maximizes remaining space for more subarrays.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Prefix Sum + Hash Map for Subarray Sum Problems**: Whenever you need to find subarrays with a specific sum, think prefix sums with hash map for O(1) lookups.
   - Related: [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) - Count all subarrays summing to k
   - Related: [325. Maximum Size Subarray Sum Equals k](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/) - Find longest subarray summing to k

2. **Greedy Interval Selection**: When you need to select maximum non-overlapping intervals, sorting by end time and taking earliest-ending valid intervals is optimal.
   - Related: [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) - Minimum intervals to remove to make all non-overlapping
   - Related: [452. Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) - Similar interval scheduling problem

## Key Takeaways

1. **Prefix sums + hash map is the go-to technique for subarray sum problems**. If you need to find subarrays with a specific sum efficiently, compute prefix sums and use a hash map to check if `prefix_sum - target` exists.

2. **Greedy selection works for maximizing non-overlapping intervals**. When you find a valid subarray, take it immediately and reset your tracking to avoid overlaps. This greedy choice is optimal because it leaves maximum room for additional subarrays.

3. **Reset state on success**. When dealing with non-overlapping constraints, clearing your tracking data structures after finding a valid match ensures you don't create overlaps in future matches.

[Practice this problem on CodeJeet](/problem/maximum-number-of-non-overlapping-subarrays-with-sum-equals-target)
