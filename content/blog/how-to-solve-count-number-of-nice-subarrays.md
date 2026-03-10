---
title: "How to Solve Count Number of Nice Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Number of Nice Subarrays. Medium difficulty, 74.8% acceptance rate. Topics: Array, Hash Table, Math, Sliding Window, Prefix Sum."
date: "2027-05-31"
category: "dsa-patterns"
tags: ["count-number-of-nice-subarrays", "array", "hash-table", "math", "medium"]
---

# How to Solve Count Number of Nice Subarrays

This problem asks us to count all continuous subarrays (contiguous segments) of an array where exactly `k` odd numbers appear. What makes this problem interesting is that it looks like a standard sliding window problem at first glance, but the presence of even numbers (which don't affect the "niceness" condition) means we need a more nuanced approach. The key challenge is efficiently counting subarrays with exactly `k` odd numbers without having to check every possible subarray.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 1, 2, 1, 1]` with `k = 3`.

We want to find all subarrays with exactly 3 odd numbers. The odd numbers are at indices 0, 1, 3, and 4. Let's think about what makes a subarray "nice":

1. **Subarray [0, 3]**: Contains indices 0, 1, 2, 3 → odds at 0, 1, 3 → exactly 3 odds ✓
2. **Subarray [0, 4]**: Contains all indices → odds at 0, 1, 3, 4 → 4 odds ✗
3. **Subarray [1, 4]**: Contains indices 1, 2, 3, 4 → odds at 1, 3, 4 → exactly 3 odds ✓
4. **Subarray [0, 2]**: Contains indices 0, 1, 2 → odds at 0, 1 → 2 odds ✗

But wait, there are more! What about subarrays that start before index 0? Actually, let's think systematically. For a subarray to have exactly 3 odds, it must start somewhere and end somewhere such that the number of odds between those points is exactly 3.

A better way to think about this: Convert the array to a binary representation where odd numbers become 1 and even numbers become 0. Our example becomes `[1, 1, 0, 1, 1]`. Now we're looking for subarrays with sum exactly `k = 3`.

The insight: If we track prefix sums (cumulative sums from the start), then the sum of any subarray from `i` to `j` equals `prefix[j] - prefix[i-1]`. We want this difference to equal `k`.

So for `prefix[j] - prefix[i-1] = k`, we need `prefix[i-1] = prefix[j] - k`. This means for each position `j`, we can count how many previous positions `i-1` had prefix sum equal to `prefix[j] - k`.

Let's calculate prefix sums for our example:

- Index -1: prefix = 0 (conceptual starting point)
- Index 0: prefix = 1
- Index 1: prefix = 2
- Index 2: prefix = 2
- Index 3: prefix = 3
- Index 4: prefix = 4

Now for each `j`, count how many `i-1` positions have `prefix = prefix[j] - 3`:

- j=0: prefix[0]=1, need prefix=1-3=-2 → count=0
- j=1: prefix[1]=2, need prefix=2-3=-1 → count=0
- j=2: prefix[2]=2, need prefix=2-3=-1 → count=0
- j=3: prefix[3]=3, need prefix=3-3=0 → count=1 (at index -1)
- j=4: prefix[4]=4, need prefix=4-3=1 → count=1 (at index 0)

Total = 2 nice subarrays, which matches our manual count above.

## Brute Force Approach

The most straightforward approach is to check every possible subarray. For each starting index `i`, we expand `j` from `i` to the end, counting odd numbers as we go. When we reach exactly `k` odds, we increment our count. If we exceed `k`, we break and move to the next starting position.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numberOfSubarrays_brute(nums, k):
    n = len(nums)
    count = 0

    # Try every possible starting point
    for i in range(n):
        odd_count = 0

        # Expand from i to find subarrays with exactly k odds
        for j in range(i, n):
            if nums[j] % 2 == 1:  # Check if odd
                odd_count += 1

            # If we have exactly k odds, count this subarray
            if odd_count == k:
                count += 1
            # If we exceed k, no point continuing with this start
            elif odd_count > k:
                break

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numberOfSubarraysBrute(nums, k) {
  const n = nums.length;
  let count = 0;

  // Try every possible starting point
  for (let i = 0; i < n; i++) {
    let oddCount = 0;

    // Expand from i to find subarrays with exactly k odds
    for (let j = i; j < n; j++) {
      if (nums[j] % 2 === 1) {
        // Check if odd
        oddCount++;
      }

      // If we have exactly k odds, count this subarray
      if (oddCount === k) {
        count++;
      }
      // If we exceed k, no point continuing with this start
      else if (oddCount > k) {
        break;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numberOfSubarraysBrute(int[] nums, int k) {
    int n = nums.length;
    int count = 0;

    // Try every possible starting point
    for (int i = 0; i < n; i++) {
        int oddCount = 0;

        // Expand from i to find subarrays with exactly k odds
        for (int j = i; j < n; j++) {
            if (nums[j] % 2 == 1) {  // Check if odd
                oddCount++;
            }

            // If we have exactly k odds, count this subarray
            if (oddCount == k) {
                count++;
            }
            // If we exceed k, no point continuing with this start
            else if (oddCount > k) {
                break;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** For an array of length `n`, there are `n(n+1)/2` possible subarrays, so checking each one leads to O(n²) time complexity. This is too slow for the typical constraints where `n` can be up to 50,000 (50,000² = 2.5 billion operations).

## Optimized Approach

The key insight is to transform the problem into a prefix sum problem. As we saw in the visual walkthrough:

1. Convert each number to 1 if odd, 0 if even
2. Calculate prefix sums (cumulative sums from the start)
3. For each position `j`, we want to count how many previous positions `i-1` have prefix sum equal to `prefix[j] - k`

This works because:

- Subarray from `i` to `j` has sum = `prefix[j] - prefix[i-1]`
- We want this sum to equal `k`
- So `prefix[i-1] = prefix[j] - k`

We can use a hash map (dictionary) to store how many times each prefix sum has occurred so far. As we iterate through the array, for each current prefix sum, we check how many times `current_prefix - k` has appeared before.

One subtlety: We need to initialize the hash map with `{0: 1}` because when the prefix sum equals `k`, we need to count the subarray starting from the beginning (which corresponds to `prefix[i-1] = 0` at the conceptual index -1).

## Optimal Solution

Here's the complete implementation using the prefix sum with hash map approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numberOfSubarrays(nums, k):
    """
    Counts the number of subarrays with exactly k odd numbers.

    Approach: Convert to prefix sum problem where odd=1, even=0.
    For each position j, count how many previous positions i-1
    have prefix sum = prefix[j] - k.
    """
    # Dictionary to store frequency of prefix sums encountered so far
    # Initialize with prefix sum 0 occurring once (before the array starts)
    prefix_count = {0: 1}

    current_prefix = 0  # Running prefix sum
    result = 0

    for num in nums:
        # Add 1 to prefix if number is odd, 0 if even
        current_prefix += 1 if num % 2 == 1 else 0

        # If (current_prefix - k) exists in our map, those represent
        # starting points i-1 where subarray i..current has exactly k odds
        if current_prefix - k in prefix_count:
            result += prefix_count[current_prefix - k]

        # Update the frequency of current prefix sum
        prefix_count[current_prefix] = prefix_count.get(current_prefix, 0) + 1

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function numberOfSubarrays(nums, k) {
  /**
   * Counts the number of subarrays with exactly k odd numbers.
   *
   * Approach: Convert to prefix sum problem where odd=1, even=0.
   * For each position j, count how many previous positions i-1
   * have prefix sum = prefix[j] - k.
   */
  // Map to store frequency of prefix sums encountered so far
  // Initialize with prefix sum 0 occurring once (before the array starts)
  const prefixCount = new Map();
  prefixCount.set(0, 1);

  let currentPrefix = 0; // Running prefix sum
  let result = 0;

  for (const num of nums) {
    // Add 1 to prefix if number is odd, 0 if even
    currentPrefix += num % 2 === 1 ? 1 : 0;

    // If (currentPrefix - k) exists in our map, those represent
    // starting points i-1 where subarray i..current has exactly k odds
    if (prefixCount.has(currentPrefix - k)) {
      result += prefixCount.get(currentPrefix - k);
    }

    // Update the frequency of current prefix sum
    prefixCount.set(currentPrefix, (prefixCount.get(currentPrefix) || 0) + 1);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int numberOfSubarrays(int[] nums, int k) {
    /**
     * Counts the number of subarrays with exactly k odd numbers.
     *
     * Approach: Convert to prefix sum problem where odd=1, even=0.
     * For each position j, count how many previous positions i-1
     * have prefix sum = prefix[j] - k.
     */
    // HashMap to store frequency of prefix sums encountered so far
    // Initialize with prefix sum 0 occurring once (before the array starts)
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1);

    int currentPrefix = 0;  // Running prefix sum
    int result = 0;

    for (int num : nums) {
        // Add 1 to prefix if number is odd, 0 if even
        currentPrefix += num % 2 == 1 ? 1 : 0;

        // If (currentPrefix - k) exists in our map, those represent
        // starting points i-1 where subarray i..current has exactly k odds
        if (prefixCount.containsKey(currentPrefix - k)) {
            result += prefixCount.get(currentPrefix - k);
        }

        // Update the frequency of current prefix sum
        prefixCount.put(currentPrefix, prefixCount.getOrDefault(currentPrefix, 0) + 1);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of length `n`
- Each iteration does O(1) dictionary operations (insert and lookup)
- Total operations scale linearly with input size

**Space Complexity: O(n)**

- In the worst case, we might store `n+1` different prefix sums in our hash map
- This occurs when all numbers are odd (prefix sums range from 0 to n)
- On average, space usage is proportional to the number of distinct prefix sums

## Common Mistakes

1. **Forgetting to initialize with prefix sum 0**: Many candidates start with an empty hash map and miss subarrays that begin at index 0. Remember: when the entire prefix equals `k`, we need `prefix[i-1] = 0`, which corresponds to starting at the beginning.

2. **Using sliding window for exactly k instead of at most k**: This is a subtle but critical distinction. Standard sliding window works well for "at most k" or "at least k" problems, but for "exactly k", we need the prefix sum approach. If you try to adapt sliding window for "exactly k", you'll likely end up with O(n²) complexity or incorrect counts.

3. **Not handling large k values**: When `k = 0`, we're looking for subarrays with no odd numbers. Our solution handles this correctly because we're looking for `current_prefix - 0 = current_prefix`, and we count how many times the current prefix has appeared before (excluding the current position itself).

4. **Integer overflow in other languages**: In languages like C++ or Java, be careful with large arrays where the count of nice subarrays might exceed 32-bit integer limits. Use long integers if necessary.

## When You'll See This Pattern

This prefix sum with hash map pattern appears in many "subarray sum" problems:

1. **Subarray Sum Equals K (LeetCode 560)**: The exact same pattern - count subarrays with sum equal to k. Our problem is just a special case where we convert odds to 1s and evens to 0s.

2. **Binary Subarrays With Sum (LeetCode 930)**: Another variation where the array contains only 0s and 1s, and we want subarrays with a specific sum.

3. **Continuous Subarray Sum (LeetCode 523)**: A modulo version where we look for subarrays with sum divisible by k, using prefix sums with modulo arithmetic.

The core pattern is: when you need to count subarrays satisfying a sum condition, think about converting to prefix sums and using a hash map to track frequencies of previous prefix sums that would make the current subarray valid.

## Key Takeaways

1. **Convert complex conditions to binary/sum problems**: When dealing with "count of elements satisfying property" in subarrays, consider converting each element to 1 (if it satisfies) or 0 (if it doesn't), then it becomes a subarray sum problem.

2. **Prefix sum + hash map = powerful combination**: For counting subarrays with exact sums, the formula `prefix[j] - prefix[i-1] = target` leads to `prefix[i-1] = prefix[j] - target`. A hash map lets us efficiently count how many previous positions satisfy this.

3. **Initialize with prefix sum 0**: Always remember to account for subarrays starting at index 0 by initializing your frequency map with `{0: 1}`.

Related problems: [K Divisible Elements Subarrays](/problem/k-divisible-elements-subarrays), [Count Subarrays With Fixed Bounds](/problem/count-subarrays-with-fixed-bounds), [Ways to Split Array Into Good Subarrays](/problem/ways-to-split-array-into-good-subarrays)
