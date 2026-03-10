---
title: "How to Solve Partition Array Into K-Distinct Groups — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Array Into K-Distinct Groups. Medium difficulty, 47.0% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-06-12"
category: "dsa-patterns"
tags: ["partition-array-into-k-distinct-groups", "array", "hash-table", "counting", "medium"]
---

## How to Solve Partition Array Into K-Distinct Groups

You're given an array of integers and need to determine if you can split all elements into groups of exactly `k` elements where each group contains only distinct values. The challenge lies in balancing two constraints: each group must have exactly `k` elements, and no duplicates can appear together. This becomes a counting problem where you need to track element frequencies and understand how they distribute across groups.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `nums = [1, 2, 2, 3, 3, 4]` and `k = 3`.

We need to form groups of exactly 3 distinct elements each. First, let's count element frequencies:

- 1 appears 1 time
- 2 appears 2 times
- 3 appears 2 times
- 4 appears 1 time

Now think about forming groups. Each group needs 3 distinct elements. The element with the highest frequency (2 and 3, each appearing twice) determines how many groups we can potentially form.

If we try to form groups:

- Group 1: {1, 2, 3} - uses one copy of 1, 2, and 3
- Group 2: {2, 3, 4} - uses one copy of 2, 3, and 4

We've used all elements! This works because:

1. Total elements (6) is divisible by k (3): 6 ÷ 3 = 2 groups
2. No element appears more times than the number of groups (2)

The second point is crucial. If any element appeared 3 times in this example, we couldn't form valid groups because we'd need to put that element in 3 different groups, but we only have 2 groups total.

## Brute Force Approach

A naive approach would try to actually form the groups through backtracking or combinatorial search. You could:

1. Generate all possible ways to partition the array into groups of size k
2. For each partition, check if all groups have distinct elements
3. Return true if any valid partition exists

The problem with this approach is the combinatorial explosion. With n elements and groups of size k, the number of possible partitions grows factorially. Even for moderate n (like 20), this becomes computationally infeasible.

What makes this approach particularly bad is that we're doing unnecessary work. We don't actually need to know which specific elements go together in each group—we only need to know if such an arrangement is possible. The actual grouping is an implementation detail, not a requirement.

## Optimized Approach

The key insight is that this is purely a counting problem. We don't need to actually form the groups—we just need to check if it's mathematically possible.

Here's the step-by-step reasoning:

1. **Check basic divisibility**: If the total number of elements isn't divisible by k, we can't form complete groups. So `n % k == 0` must be true.

2. **Count element frequencies**: Use a hash map to count how many times each element appears.

3. **Determine number of groups**: Since each group has k elements, total groups = `n / k`.

4. **Check frequency constraint**: The most important insight: **No element can appear more times than the total number of groups**. Why? Because if an element appears x times, we need to put it in x different groups (since duplicates can't be in the same group). If x > number of groups, we don't have enough groups to separate all copies of that element.

5. **That's it!** If all frequencies ≤ (n/k), then a valid partition exists. We don't need to actually construct the groups because we can always arrange them. Think of it like scheduling: we have "jobs" (element copies) that need to be assigned to "time slots" (groups) without conflict, and as long as no job type exceeds the number of time slots, we can always find a schedule.

Let's test this logic on a failing case: `nums = [1, 1, 1, 2, 2, 2]`, `k = 3`

- Total elements: 6, divisible by 3 ✓
- Number of groups: 6/3 = 2
- Frequencies: 1 appears 3 times, 2 appears 3 times
- Problem: Both elements appear 3 times, but we only have 2 groups. 3 > 2, so impossible.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - we iterate through nums once to count frequencies
# Space: O(n) - in worst case, all elements are distinct, hash map stores n entries
def canPartitionKDistinct(nums, k):
    """
    Determines if nums can be partitioned into groups of size k with distinct elements.

    Args:
        nums: List of integers
        k: Size of each group

    Returns:
        bool: True if partition is possible, False otherwise
    """
    n = len(nums)

    # Step 1: Check basic divisibility condition
    # If total elements not divisible by k, we can't form complete groups
    if n % k != 0:
        return False

    # Step 2: Count frequency of each element
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 3: Calculate number of groups needed
    num_groups = n // k

    # Step 4: Check if any element appears too many times
    # If an element appears more times than number of groups,
    # we can't put all copies in different groups
    for count in freq.values():
        if count > num_groups:
            return False

    # All conditions satisfied
    return True
```

```javascript
// Time: O(n) - single pass through array
// Space: O(n) - hash map stores up to n distinct elements
/**
 * Determines if nums can be partitioned into groups of size k with distinct elements.
 * @param {number[]} nums - Array of integers
 * @param {number} k - Size of each group
 * @return {boolean} - True if partition is possible, False otherwise
 */
function canPartitionKDistinct(nums, k) {
  const n = nums.length;

  // Step 1: Check if total elements divisible by k
  // If not, we can't form complete groups of size k
  if (n % k !== 0) {
    return false;
  }

  // Step 2: Count frequency of each element
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 3: Calculate number of groups needed
  const numGroups = Math.floor(n / k);

  // Step 4: Check frequency constraint
  // No element can appear more times than number of groups
  for (const count of freq.values()) {
    if (count > numGroups) {
      return false;
    }
  }

  // All conditions satisfied
  return true;
}
```

```java
// Time: O(n) - iterate through array once
// Space: O(n) - HashMap stores up to n entries
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Determines if nums can be partitioned into groups of size k with distinct elements.
     * @param nums Array of integers
     * @param k Size of each group
     * @return True if partition is possible, False otherwise
     */
    public boolean canPartitionKDistinct(int[] nums, int k) {
        int n = nums.length;

        // Step 1: Check basic divisibility
        // If total elements not divisible by k, impossible to form complete groups
        if (n % k != 0) {
            return false;
        }

        // Step 2: Count frequency of each element
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Step 3: Calculate number of groups needed
        int numGroups = n / k;

        // Step 4: Check if any element appears too frequently
        // Each element can appear at most once per group
        for (int count : freq.values()) {
            if (count > numGroups) {
                return false;
            }
        }

        // All conditions satisfied
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array to count frequencies: O(n)
- We then iterate through the frequency map: O(u) where u is the number of unique elements
- In worst case, all elements are distinct, so u = n, giving O(n + n) = O(n)
- In best case, all elements are the same, so u = 1, but we still have O(n) for the initial pass

**Space Complexity: O(n)**

- We store a hash map of frequencies
- In worst case (all elements distinct), we store n entries
- In best case (all elements identical), we store 1 entry
- Average case depends on the distribution of elements

## Common Mistakes

1. **Forgetting the divisibility check**: Candidates often jump straight to frequency counting without checking if `n % k == 0`. This is a necessary precondition—if you have 7 elements and k=3, you can't form complete groups no matter what the elements are.

2. **Overcomplicating with actual grouping**: Many candidates try to actually form the groups using backtracking or complex algorithms. This misses the key insight that we only need to check mathematical constraints, not construct actual groupings.

3. **Misunderstanding the frequency constraint**: Some think they need to check if any frequency > k (group size), but the correct check is frequency > (n/k) (number of groups). An element appearing k+1 times might be fine if you have enough groups to separate them.

4. **Not handling edge cases**:
   - Empty array with k=0 (check problem constraints—k is usually positive)
   - k > n (impossible to form any group)
   - k = 1 (always possible since each element is its own group)
   - All elements identical with k > 1 (impossible since duplicates can't be in same group)

## When You'll See This Pattern

This counting/frequency pattern appears in many scheduling and resource allocation problems:

1. **Task Scheduler (LeetCode 621)**: Similar concept—you have tasks with cooldowns, and you need to determine minimum time to schedule them. The frequency of the most common task determines the lower bound.

2. **Divide Array in Sets of K Consecutive Numbers (LeetCode 1296)**: While that problem requires consecutive numbers, it also uses frequency counting to determine if grouping is possible.

3. **Hand of Straights (LeetCode 846)**: Almost identical to the consecutive numbers problem—checking if you can group cards into straight hands.

The core pattern is: when you need to partition elements subject to constraints, often you can determine feasibility just by analyzing frequencies and mathematical constraints without actually constructing the partitions.

## Key Takeaways

1. **Think mathematically before algorithmically**: Many partition problems have simple mathematical necessary and sufficient conditions. Always check for these before implementing complex algorithms.

2. **Frequency counting is powerful**: When dealing with grouping constraints, counting element occurrences often reveals the critical constraints. The maximum frequency frequently determines feasibility.

3. **Separate feasibility from construction**: Just because a problem asks if something is possible doesn't mean you need to actually construct it. Often, checking conditions is much easier than building the actual solution.

[Practice this problem on CodeJeet](/problem/partition-array-into-k-distinct-groups)
