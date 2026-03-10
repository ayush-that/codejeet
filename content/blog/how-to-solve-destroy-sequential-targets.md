---
title: "How to Solve Destroy Sequential Targets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Destroy Sequential Targets. Medium difficulty, 41.7% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2029-09-20"
category: "dsa-patterns"
tags: ["destroy-sequential-targets", "array", "hash-table", "counting", "medium"]
---

# How to Solve Destroy Sequential Targets

This problem asks us to find which starting target value (from a given list) would allow us to destroy the maximum number of targets when using a machine that destroys all targets forming an arithmetic sequence with a given spacing. The tricky part is recognizing that we're not looking for consecutive targets in the array, but rather targets that share the same remainder when divided by the space value, which creates a mathematical pattern we can exploit.

## Visual Walkthrough

Let's walk through an example: `nums = [3,7,8,1,4]`, `space = 2`

We need to find which `nums[i]` as a seed destroys the most targets. The machine destroys all targets where `target = seed + k * space` for integer `k`.

**Step 1: Understanding the destruction pattern**

- If we seed with 3: destroys 3, 5, 7, 9, 11... (but only 3 and 7 exist in nums)
- If we seed with 7: destroys 7, 9, 11, 13... (only 7 exists)
- If we seed with 8: destroys 8, 10, 12... (only 8 exists)
- If we seed with 1: destroys 1, 3, 5, 7, 9... (1, 3, 7 exist)
- If we seed with 4: destroys 4, 6, 8, 10... (4, 8 exist)

**Step 2: The remainder insight**
Notice that all numbers destroyed by the same seed have the same remainder when divided by `space`:

- 3 ÷ 2 = 1 remainder 1
- 7 ÷ 2 = 3 remainder 1
- So both 3 and 7 have remainder 1

**Step 3: Counting by remainders**
Let's group numbers by their remainder:

- Remainder 0: [8, 4] (8÷2=4 remainder 0, 4÷2=2 remainder 0)
- Remainder 1: [3, 7, 1] (3÷2=1 remainder 1, 7÷2=3 remainder 1, 1÷2=0 remainder 1)

**Step 4: Finding the best seed**
For remainder 0 group: smallest number is 4, count is 2
For remainder 1 group: smallest number is 1, count is 3

The remainder 1 group has more targets (3 > 2), so we should use the smallest number with remainder 1 as our seed: **1**

This gives us the key insight: targets with the same remainder form sequences that can be destroyed together, and the smallest number in each remainder group is the optimal seed for that group.

## Brute Force Approach

A naive approach would be to try each number as a seed and count how many other numbers are in its arithmetic sequence:

1. For each number `nums[i]` as seed
2. Check every other number `nums[j]` to see if `(nums[j] - nums[i]) % space == 0`
3. Track which seed gives the maximum count

**Why this fails:**

- Time complexity: O(n²) where n is the length of nums
- For n up to 10⁵ (typical constraint), O(n²) is 10¹⁰ operations - far too slow
- We're doing redundant work by checking the same mathematical relationships repeatedly

## Optimized Approach

The key insight is that two numbers `a` and `b` can be destroyed by the same seed if and only if `a % space == b % space`. This is because:

- If `a % space == b % space`, then `(b - a) % space == 0`
- This means `b = a + k * space` for some integer `k`
- Therefore, they're in the same arithmetic sequence

**Step-by-step reasoning:**

1. All numbers with the same remainder modulo `space` form sequences that can be destroyed together
2. The smallest number in each remainder group is the optimal seed for that group (since we need to return the smallest seed in case of ties)
3. We need to:
   - Group numbers by their remainder `num % space`
   - Count how many numbers are in each remainder group
   - For each remainder group, track the smallest number
   - Find the remainder group with the maximum count
   - Return the smallest number from that group

**Why this works:**

- Mathematical property: `(b - a) % space == 0` iff `a % space == b % space`
- By grouping by remainder, we efficiently find all numbers in the same sequence
- Time complexity reduces from O(n²) to O(n)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def destroyTargets(nums, space):
    """
    Find the seed that destroys the maximum number of targets.

    Args:
        nums: List of target values
        space: The spacing between destroyed targets

    Returns:
        The smallest seed that destroys the maximum number of targets
    """
    # Dictionary to store remainder groups
    # Key: remainder value (num % space)
    # Value: [count of numbers with this remainder, smallest number with this remainder]
    remainder_groups = {}

    # First pass: count numbers by remainder and track smallest number for each remainder
    for num in nums:
        remainder = num % space

        if remainder not in remainder_groups:
            # Initialize for new remainder: count = 1, smallest = current num
            remainder_groups[remainder] = [1, num]
        else:
            # Update count and track smallest number
            remainder_groups[remainder][0] += 1  # Increment count
            remainder_groups[remainder][1] = min(remainder_groups[remainder][1], num)  # Update smallest

    # Variables to track the best result
    max_count = 0
    best_seed = float('inf')

    # Second pass: find the remainder with maximum count
    # In case of tie, choose the smallest seed
    for count, smallest in remainder_groups.values():
        if count > max_count:
            # Found a remainder group with higher count
            max_count = count
            best_seed = smallest
        elif count == max_count and smallest < best_seed:
            # Tie in count, choose smaller seed
            best_seed = smallest

    return best_seed
```

```javascript
// Time: O(n) | Space: O(n)
function destroyTargets(nums, space) {
  /**
   * Find the seed that destroys the maximum number of targets.
   *
   * @param {number[]} nums - Array of target values
   * @param {number} space - The spacing between destroyed targets
   * @return {number} The smallest seed that destroys the maximum number of targets
   */

  // Map to store remainder groups
  // Key: remainder value (num % space)
  // Value: {count: number, smallest: number}
  const remainderGroups = new Map();

  // First pass: count numbers by remainder and track smallest number for each remainder
  for (const num of nums) {
    const remainder = num % space;

    if (!remainderGroups.has(remainder)) {
      // Initialize for new remainder
      remainderGroups.set(remainder, {
        count: 1,
        smallest: num,
      });
    } else {
      // Update existing remainder group
      const group = remainderGroups.get(remainder);
      group.count += 1; // Increment count
      group.smallest = Math.min(group.smallest, num); // Update smallest
    }
  }

  // Variables to track the best result
  let maxCount = 0;
  let bestSeed = Infinity;

  // Second pass: find the remainder with maximum count
  // In case of tie, choose the smallest seed
  for (const { count, smallest } of remainderGroups.values()) {
    if (count > maxCount) {
      // Found a remainder group with higher count
      maxCount = count;
      bestSeed = smallest;
    } else if (count === maxCount && smallest < bestSeed) {
      // Tie in count, choose smaller seed
      bestSeed = smallest;
    }
  }

  return bestSeed;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int destroyTargets(int[] nums, int space) {
        /**
         * Find the seed that destroys the maximum number of targets.
         *
         * @param nums Array of target values
         * @param space The spacing between destroyed targets
         * @return The smallest seed that destroys the maximum number of targets
         */

        // HashMap to store remainder groups
        // Key: remainder value (num % space)
        // Value: int array where [0] = count, [1] = smallest number
        Map<Integer, int[]> remainderGroups = new HashMap<>();

        // First pass: count numbers by remainder and track smallest number for each remainder
        for (int num : nums) {
            int remainder = num % space;

            if (!remainderGroups.containsKey(remainder)) {
                // Initialize for new remainder: count = 1, smallest = current num
                remainderGroups.put(remainder, new int[]{1, num});
            } else {
                // Update existing remainder group
                int[] group = remainderGroups.get(remainder);
                group[0] += 1;  // Increment count
                group[1] = Math.min(group[1], num);  // Update smallest
            }
        }

        // Variables to track the best result
        int maxCount = 0;
        int bestSeed = Integer.MAX_VALUE;

        // Second pass: find the remainder with maximum count
        // In case of tie, choose the smallest seed
        for (int[] group : remainderGroups.values()) {
            int count = group[0];
            int smallest = group[1];

            if (count > maxCount) {
                // Found a remainder group with higher count
                maxCount = count;
                bestSeed = smallest;
            } else if (count == maxCount && smallest < bestSeed) {
                // Tie in count, choose smaller seed
                bestSeed = smallest;
            }
        }

        return bestSeed;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: O(n) for grouping by remainder, O(k) for finding the maximum (where k ≤ n is the number of distinct remainders)
- Each operation (modulo, hash map lookup/update, min comparison) is O(1)
- Total: O(n) + O(k) = O(n)

**Space Complexity: O(n)**

- In the worst case, every number has a different remainder, so we store n entries in the hash map
- Each entry stores a count and smallest value (constant space per entry)
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle negative remainders**: In some languages, `-1 % 3` might give `-1` instead of `2`. However, the problem states `nums` consists of positive integers, so we don't need to worry about this edge case.

2. **Not tracking the smallest number per remainder group**: When multiple seeds destroy the same number of targets, we need to return the smallest one. Candidates often track only the count and forget to track which number is smallest in each group.

3. **Using the wrong seed for a remainder group**: The optimal seed for a remainder group is the smallest number in that group, not any arbitrary number. Some candidates try to use the first number they encounter or the largest number, which is incorrect.

4. **Confusing the problem with finding consecutive sequences**: This is not about finding consecutive numbers in the array, but about numbers that form an arithmetic sequence with the given spacing. The modulo operation is key here.

## When You'll See This Pattern

This problem uses the **"group by modulo"** pattern, which appears in problems involving:

1. **Arithmetic sequences or divisibility** - When you need to find elements that differ by multiples of a fixed value
2. **Pair finding with modular arithmetic** - When pairs need to satisfy `(a + b) % k == 0` or similar conditions
3. **Frequency counting with transformation** - When you need to transform data before counting frequencies

**Related problems:**

- **Pairs of Songs With Total Durations Divisible by 60**: Group songs by `time % 60` to find pairs where `(time[i] + time[j]) % 60 == 0`
- **Arithmetic Slices II - Subsequence**: Uses similar arithmetic progression logic but with dynamic programming
- **Longest Arithmetic Subsequence**: Finds the longest sequence where consecutive elements have the same difference

## Key Takeaways

1. **Modulo grouping is powerful for arithmetic sequences**: When dealing with problems about numbers differing by multiples of a fixed value, consider grouping by `num % k` where `k` is the spacing or divisor.

2. **Track both count and representative value**: When grouping, often you need to track not just how many items are in a group, but also some property (like the smallest value) to answer the final question.

3. **Mathematical reformulation simplifies problems**: The insight that `(b - a) % space == 0` iff `a % space == b % space` transforms an O(n²) pairwise comparison problem into an O(n) grouping problem.

Related problems: [Arithmetic Slices II - Subsequence](/problem/arithmetic-slices-ii-subsequence), [Pairs of Songs With Total Durations Divisible by 60](/problem/pairs-of-songs-with-total-durations-divisible-by-60), [Longest Arithmetic Subsequence](/problem/longest-arithmetic-subsequence)
