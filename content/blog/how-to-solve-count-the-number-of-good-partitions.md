---
title: "How to Solve Count the Number of Good Partitions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count the Number of Good Partitions. Hard difficulty, 49.0% acceptance rate. Topics: Array, Hash Table, Math, Combinatorics."
date: "2030-02-26"
category: "dsa-patterns"
tags: ["count-the-number-of-good-partitions", "array", "hash-table", "math", "hard"]
---

# How to Solve Count the Number of Good Partitions

This problem asks us to count how many ways we can split an array into contiguous subarrays where **no two subarrays contain the same number**. The challenge is that we need to find all valid partitions efficiently — a brute force approach would be exponential. The key insight is that this is actually a **partitioning problem** where we need to ensure that each number's occurrences are completely contained within a single subarray.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 1, 3]`

We need to partition this array so that no two subarrays contain the same number. Let's think about what this means:

1. The number `1` appears at indices 0 and 2
2. For `1` to appear in only one subarray, all occurrences of `1` must be in the same subarray
3. This means our partition **must** include indices 0 through 2 in the same subarray (since 0 and 2 are the boundaries where 1 appears)

Let's visualize the constraints:

- Number `1`: first appears at index 0, last appears at index 2 → must be in subarray covering [0, 2]
- Number `2`: only appears at index 1 → can be anywhere
- Number `3`: only appears at index 3 → can be anywhere

The minimum subarray that contains all `1`s is from index 0 to 2. So our first subarray must be at least [0, 2]. But we could extend it further if needed.

Actually, let's think differently: For each number, we find its **last occurrence index**. Any partition point before this last occurrence would split that number across two subarrays, which is invalid.

So for our example:

- Last occurrence of `1`: index 2
- Last occurrence of `2`: index 1
- Last occurrence of `3`: index 3

Now, as we scan from left to right:

- At index 0: max last occurrence so far is 2 (from number 1)
- At index 1: max last occurrence is still 2
- At index 2: we've reached index 2, which was our max last occurrence
  - This means we can make a valid partition ending at index 2
  - Everything before index 2 must be in one subarray to avoid splitting any number

So one valid partition is: `[1, 2, 1]` and `[3]`

But wait — could we have more partitions? Let's check:

- We could also extend the first subarray to include index 3: `[1, 2, 1, 3]`
- But that's just one partition (the whole array)

Actually, the number of valid partitions equals the number of positions where we **can** split. Each time we reach a point where the current index equals the maximum last occurrence seen so far, we have a potential split point.

For `[1, 2, 1, 3]`:

- Potential splits at indices: 2 (after processing index 2)
- That gives us 2 segments: [0-2] and [3-3]
- Number of partitions = 2^(number of split points) = 2^1 = 2

Let's verify:

1. Partition 1: `[1, 2, 1]` and `[3]` ✓
2. Partition 2: `[1, 2, 1, 3]` (no split) ✓

## Brute Force Approach

A naive approach would be to try all possible partition points. For an array of length n, there are n-1 possible positions to cut (between elements). We could generate all 2^(n-1) possible partitions and check each one:

1. Generate all binary strings of length n-1 (0 = don't cut, 1 = cut)
2. For each binary string, create the corresponding partitions
3. Check if any number appears in more than one partition
4. Count the valid ones

This approach has exponential time complexity O(2^n × n), which is far too slow for n up to 10^5. Even for n=20, we'd have over 1 million possibilities to check.

The problem with brute force is it doesn't leverage the key constraint: if a number appears multiple times, all its occurrences must be in the same subarray. This creates dependencies between partition decisions that we can use to dramatically reduce the search space.

## Optimized Approach

The key insight is: **For each number, all its occurrences must be in the same subarray.** This means:

1. If a number appears at indices i and j (with i < j), then we cannot place a partition between i and j
2. The partition must happen either before i or after j
3. More precisely: For each number, find its first and last occurrence. Any valid partition must have all occurrences of that number within a single segment

This leads to an efficient algorithm:

**Step 1: Find last occurrences**

- Create a hash map/dictionary storing the last index where each number appears
- This tells us the rightmost boundary for each number

**Step 2: Scan and find segments**

- As we scan from left to right, track the maximum last occurrence seen so far
- When we reach an index `i` that equals the maximum last occurrence, we've found a valid segment ending point
- Everything from the start of the current segment to `i` must be in one subarray

**Step 3: Count partitions**

- Each segment we identify is a "must-be-together" group
- Between segments, we can choose to merge or not
- If we have `k` segments, we have `k-1` gaps between them
- For each gap, we can either merge (no cut) or not merge (cut)
- This gives us 2^(k-1) possible partitions

Wait, let's clarify with an example: `nums = [1, 2, 1, 3, 2]`

- Last occurrences: 1→2, 2→4, 3→3
- Scanning:
  - i=0: max_last = 2
  - i=1: max_last = 2
  - i=2: reached max_last = 2 → segment 1: [0-2]
  - i=3: max_last = max(2, 3) = 3
  - i=4: reached max_last = 4 → segment 2: [3-4]
- We have 2 segments
- Between segments, we can either merge or not: 2^(2-1) = 2^1 = 2 partitions

Actually, there's a simpler way: Each time we complete a segment (when i == max_last), that's one independent segment. The number of ways to partition is 2^(number_of_segments - 1).

## Optimal Solution

The algorithm:

1. Create a dictionary to store the last occurrence index of each number
2. Initialize `max_last = 0` and `segments = 0`
3. Iterate through the array from i = 0 to n-2 (we stop at n-2 because the last element always ends a segment)
4. Update `max_last` to be the maximum of current `max_last` and `last_occurrence[nums[i]]`
5. If `i == max_last`, we've found a segment boundary, increment `segments`
6. The answer is 2^(segments) modulo 10^9+7

Wait, let me correct that. When we find a segment ending at index i, that means indices from the start of the segment to i must be together. The number of segments is actually the number of these "must-be-together" groups. If we have m segments, we have m-1 gaps between them where we can choose to cut or not, giving us 2^(m-1) partitions.

But actually, think of it this way: Each time we complete a segment at index i (where i < n-1), we have a decision point: cut after i or not. For the last segment, we have no choice. So if we have k decision points, we have 2^k partitions.

Let's implement this correctly:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numberOfGoodPartitions(nums):
    """
    Counts the number of ways to partition the array into contiguous subarrays
    such that no two subarrays contain the same number.

    Approach:
    1. First, find the last occurrence index of each unique number
    2. Scan through the array, tracking the maximum last occurrence seen so far
    3. When we reach an index that equals the current max last occurrence,
       we've found a valid "cut point" - everything up to this point must be
       in the current segment
    4. Each valid cut point (except the last one) gives us a binary choice:
       cut or don't cut
    5. Number of partitions = 2^(number of cut points) mod (10^9+7)
    """
    MOD = 10**9 + 7
    n = len(nums)

    # Step 1: Store the last occurrence index of each number
    last_occurrence = {}
    for i, num in enumerate(nums):
        last_occurrence[num] = i

    # Step 2: Scan through the array to find valid cut points
    max_last = 0  # Maximum last occurrence index seen so far
    cut_points = 0  # Count of valid cut points

    # We only need to check up to n-2 because we can't cut after the last element
    for i in range(n - 1):
        # Update the maximum last occurrence for the current number
        max_last = max(max_last, last_occurrence[nums[i]])

        # If we've reached the max last occurrence, this is a valid cut point
        # Everything from the start of the current segment to i must stay together
        if i == max_last:
            cut_points += 1

    # Step 3: Calculate the result
    # Each cut point gives us a binary choice: cut or don't cut
    # So total partitions = 2^(cut_points) mod MOD
    result = 1
    for _ in range(cut_points):
        result = (result * 2) % MOD

    return result
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Counts the number of ways to partition the array into contiguous subarrays
 * such that no two subarrays contain the same number.
 *
 * Approach:
 * 1. First, find the last occurrence index of each unique number
 * 2. Scan through the array, tracking the maximum last occurrence seen so far
 * 3. When we reach an index that equals the current max last occurrence,
 *    we've found a valid "cut point" - everything up to this point must be
 *    in the current segment
 * 4. Each valid cut point (except the last one) gives us a binary choice:
 *    cut or don't cut
 * 5. Number of partitions = 2^(number of cut points) mod (10^9+7)
 */
function numberOfGoodPartitions(nums) {
  const MOD = 10 ** 9 + 7;
  const n = nums.length;

  // Step 1: Store the last occurrence index of each number
  const lastOccurrence = new Map();
  for (let i = 0; i < n; i++) {
    lastOccurrence.set(nums[i], i);
  }

  // Step 2: Scan through the array to find valid cut points
  let maxLast = 0; // Maximum last occurrence index seen so far
  let cutPoints = 0; // Count of valid cut points

  // We only need to check up to n-2 because we can't cut after the last element
  for (let i = 0; i < n - 1; i++) {
    // Update the maximum last occurrence for the current number
    maxLast = Math.max(maxLast, lastOccurrence.get(nums[i]));

    // If we've reached the max last occurrence, this is a valid cut point
    // Everything from the start of the current segment to i must stay together
    if (i === maxLast) {
      cutPoints++;
    }
  }

  // Step 3: Calculate the result
  // Each cut point gives us a binary choice: cut or don't cut
  // So total partitions = 2^(cutPoints) mod MOD
  let result = 1;
  for (let i = 0; i < cutPoints; i++) {
    result = (result * 2) % MOD;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Counts the number of ways to partition the array into contiguous subarrays
     * such that no two subarrays contain the same number.
     *
     * Approach:
     * 1. First, find the last occurrence index of each unique number
     * 2. Scan through the array, tracking the maximum last occurrence seen so far
     * 3. When we reach an index that equals the current max last occurrence,
     *    we've found a valid "cut point" - everything up to this point must be
     *    in the current segment
     * 4. Each valid cut point (except the last one) gives us a binary choice:
     *    cut or don't cut
     * 5. Number of partitions = 2^(number of cut points) mod (10^9+7)
     */
    public int numberOfGoodPartitions(int[] nums) {
        final int MOD = 1_000_000_007;
        int n = nums.length;

        // Step 1: Store the last occurrence index of each number
        Map<Integer, Integer> lastOccurrence = new HashMap<>();
        for (int i = 0; i < n; i++) {
            lastOccurrence.put(nums[i], i);
        }

        // Step 2: Scan through the array to find valid cut points
        int maxLast = 0;  // Maximum last occurrence index seen so far
        int cutPoints = 0;  // Count of valid cut points

        // We only need to check up to n-2 because we can't cut after the last element
        for (int i = 0; i < n - 1; i++) {
            // Update the maximum last occurrence for the current number
            maxLast = Math.max(maxLast, lastOccurrence.get(nums[i]));

            // If we've reached the max last occurrence, this is a valid cut point
            // Everything from the start of the current segment to i must stay together
            if (i == maxLast) {
                cutPoints++;
            }
        }

        // Step 3: Calculate the result
        // Each cut point gives us a binary choice: cut or don't cut
        // So total partitions = 2^(cutPoints) mod MOD
        long result = 1;
        for (int i = 0; i < cutPoints; i++) {
            result = (result * 2) % MOD;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array
- First pass: O(n) to build the last occurrence map
- Second pass: O(n) to scan and find cut points
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store the last occurrence index for each unique number in a hash map
- In the worst case, all numbers are unique, so we need O(n) space
- The rest of the algorithm uses O(1) additional space

## Common Mistakes

1. **Not handling modulo correctly**: The result can be huge (2^(n-1) in worst case), so we need to apply modulo 10^9+7 at each multiplication, not just at the end. Otherwise, we'll get integer overflow.

2. **Incorrect cut point counting**: A common error is to count segments instead of cut points. Remember: if we have m segments, we have m-1 cut points between them. Each cut point gives us a binary choice.

3. **Off-by-one errors in the loop**: We only iterate up to n-2 (not n-1) because we can't cut after the last element. Cutting after the last element doesn't create a new partition.

4. **Forgetting to update maxLast correctly**: We need to take the maximum of the current maxLast and the last occurrence of the current element. If we only check the last occurrence of the current element, we might miss cases where a number that appeared earlier has a later last occurrence.

## When You'll See This Pattern

This problem uses the **"last occurrence tracking"** pattern combined with **segment partitioning**. You'll see similar patterns in:

1. **Partition Labels (LeetCode 763)**: Almost identical concept — partition a string into as many parts as possible so that each letter appears in at most one part. The solution involves finding last occurrences and creating segments.

2. **Merge Intervals (LeetCode 56)**: While not identical, the concept of merging overlapping intervals is similar to merging segments that must stay together.

3. **Check if There is a Valid Partition For The Array (LeetCode 2369)**: This problem also deals with partitioning arrays according to specific rules, though the rules are different.

The core pattern is: when you need to ensure all occurrences of something are in the same group, find the boundaries (first and last occurrence) and use those to determine mandatory groupings.

## Key Takeaways

1. **When a problem requires grouping all occurrences of elements together**, think about tracking first and last occurrences. The span from first to last occurrence defines a "must-be-together" interval.

2. **Segment partitioning problems often reduce to counting cut points**: Once you identify mandatory segments, the number of valid partitions is 2^(number of gaps between segments).

3. **Scanning with a running maximum is powerful**: By tracking the maximum last occurrence as we scan left to right, we can identify when we've completed a mandatory segment in O(n) time.

Related problems: [Check if There is a Valid Partition For The Array](/problem/check-if-there-is-a-valid-partition-for-the-array)
