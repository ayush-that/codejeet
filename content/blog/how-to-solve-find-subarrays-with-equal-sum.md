---
title: "How to Solve Find Subarrays With Equal Sum — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Subarrays With Equal Sum. Easy difficulty, 66.9% acceptance rate. Topics: Array, Hash Table."
date: "2028-01-17"
category: "dsa-patterns"
tags: ["find-subarrays-with-equal-sum", "array", "hash-table", "easy"]
---

# How to Solve Find Subarrays With Equal Sum

This problem asks us to determine whether there exist two length-2 subarrays with equal sums starting at different indices in a given array. While the problem seems straightforward, the key insight is recognizing that we're essentially looking for duplicate sums of adjacent pairs—a pattern that maps perfectly to hash table techniques used in problems like Two Sum.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1, 2, 3, 4, 2, 3]`:

1. **First pair (indices 0-1)**: `nums[0] + nums[1] = 1 + 2 = 3`
2. **Second pair (indices 1-2)**: `nums[1] + nums[2] = 2 + 3 = 5`
3. **Third pair (indices 2-3)**: `nums[2] + nums[3] = 3 + 4 = 7`
4. **Fourth pair (indices 3-4)**: `nums[3] + nums[4] = 4 + 2 = 6`
5. **Fifth pair (indices 4-5)**: `nums[4] + nums[5] = 2 + 3 = 5`

Notice that the sum `5` appears twice: at indices 1-2 and indices 4-5. These subarrays start at different indices (1 and 4), so we return `true`.

The pattern becomes clear: we need to track sums of adjacent pairs as we iterate through the array. If we encounter a sum we've seen before, we've found our answer.

## Brute Force Approach

A naive solution would compare every possible pair of length-2 subarrays:

1. Calculate all length-2 subarray sums
2. Compare each sum with every other sum
3. Check if they're equal AND the subarrays start at different indices

This approach has O(n²) time complexity since we're comparing each sum with every other sum. For an array of length n, there are n-1 length-2 subarrays, leading to (n-1)² comparisons. While this works for small inputs, it's inefficient for larger arrays.

Here's what the brute force might look like:

```python
def brute_force(nums):
    n = len(nums)
    # Not enough elements for two length-2 subarrays
    if n < 3:
        return False

    # Calculate all sums
    sums = []
    for i in range(n - 1):
        sums.append(nums[i] + nums[i + 1])

    # Compare all pairs
    for i in range(len(sums)):
        for j in range(i + 1, len(sums)):
            if sums[i] == sums[j]:
                return True
    return False
```

The problem with this approach is the nested loop structure. When n=1000, we're doing roughly 1 million comparisons. We can do much better.

## Optimal Solution

The optimal solution uses a hash set to track sums we've seen. As we iterate through adjacent pairs, we check if the current sum exists in our set. If it does, we've found two subarrays with equal sums starting at different indices. If not, we add the sum to our set and continue.

Why does this work? Because we only care about whether a sum has appeared before—not how many times or where exactly. The hash set gives us O(1) lookup time, making the entire algorithm O(n).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
# We iterate through n-1 adjacent pairs and use a set to store sums
def findSubarrays(nums):
    """
    Determine if there exist two length-2 subarrays with equal sums.

    Args:
        nums: List of integers

    Returns:
        True if two such subarrays exist, False otherwise
    """
    # Edge case: Need at least 4 elements for two non-overlapping length-2 subarrays
    # Actually, we need at least 3 elements for two length-2 subarrays (they can overlap)
    # But the problem says they must begin at different indices, not that they can't overlap
    if len(nums) < 3:
        return False

    seen_sums = set()  # Track sums we've encountered

    # Iterate through all adjacent pairs
    for i in range(len(nums) - 1):
        current_sum = nums[i] + nums[i + 1]

        # Check if we've seen this sum before
        if current_sum in seen_sums:
            return True  # Found two subarrays with equal sum

        # Add current sum to our set for future comparisons
        seen_sums.add(current_sum)

    # If we finish the loop without finding equal sums
    return False
```

```javascript
// Time: O(n) | Space: O(n)
// We iterate through n-1 adjacent pairs and use a Set to store sums
/**
 * Determine if there exist two length-2 subarrays with equal sums.
 * @param {number[]} nums - Array of integers
 * @return {boolean} True if two such subarrays exist, False otherwise
 */
function findSubarrays(nums) {
  // Edge case: Need at least 3 elements for two length-2 subarrays
  // (they can overlap but must start at different indices)
  if (nums.length < 3) {
    return false;
  }

  const seenSums = new Set(); // Track sums we've encountered

  // Iterate through all adjacent pairs
  for (let i = 0; i < nums.length - 1; i++) {
    const currentSum = nums[i] + nums[i + 1];

    // Check if we've seen this sum before
    if (seenSums.has(currentSum)) {
      return true; // Found two subarrays with equal sum
    }

    // Add current sum to our set for future comparisons
    seenSums.add(currentSum);
  }

  // If we finish the loop without finding equal sums
  return false;
}
```

```java
// Time: O(n) | Space: O(n)
// We iterate through n-1 adjacent pairs and use a HashSet to store sums
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Determine if there exist two length-2 subarrays with equal sums.
     * @param nums Array of integers
     * @return True if two such subarrays exist, False otherwise
     */
    public boolean findSubarrays(int[] nums) {
        // Edge case: Need at least 3 elements for two length-2 subarrays
        // (they can overlap but must start at different indices)
        if (nums.length < 3) {
            return false;
        }

        Set<Integer> seenSums = new HashSet<>();  // Track sums we've encountered

        // Iterate through all adjacent pairs
        for (int i = 0; i < nums.length - 1; i++) {
            int currentSum = nums[i] + nums[i + 1];

            // Check if we've seen this sum before
            if (seenSums.contains(currentSum)) {
                return true;  // Found two subarrays with equal sum
            }

            // Add current sum to our set for future comparisons
            seenSums.add(currentSum);
        }

        // If we finish the loop without finding equal sums
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, calculating n-1 sums
- Each set operation (add and contains) takes O(1) average time
- Total operations: approximately 2(n-1) = O(n)

**Space Complexity: O(n)**

- In the worst case, all sums are unique, so we store n-1 sums in the set
- Even with overlapping elements, we might store up to n-1 unique sums
- Therefore, worst-case space is O(n)

The hash set approach is optimal because we must examine each adjacent pair at least once to know all sums, giving us a lower bound of Ω(n). Our solution achieves this linear bound.

## Common Mistakes

1. **Off-by-one errors in the loop condition**: Writing `i < len(nums)` instead of `i < len(nums) - 1` will cause an index out of bounds error when accessing `nums[i + 1]`. Always test with small arrays like `[1,2]` to catch this.

2. **Incorrect edge case handling**: Some candidates return `false` for arrays with fewer than 4 elements, thinking the subarrays must be non-overlapping. The problem only requires different starting indices—they can overlap! `[1,2,3]` has two length-2 subarrays starting at indices 0 and 1, both with sum 3, so should return `true`.

3. **Using a list instead of a set for tracking sums**: Checking if an element exists in a list takes O(n) time, making the overall algorithm O(n²). Always use a hash-based structure (set in Python/JavaScript, HashSet in Java) for O(1) membership testing.

4. **Forgetting that subarrays must start at different indices**: The algorithm naturally handles this because we check for duplicates before adding the current sum to our set. If we added first and then checked, we might incorrectly match a sum with itself.

## When You'll See This Pattern

This problem uses the **"seen before" pattern** with hash sets, which appears in many coding interview problems:

1. **Two Sum (Easy)**: Find two numbers that add up to a target. Instead of checking all pairs, store numbers in a hash map as you iterate, checking if `target - current` exists.

2. **Contains Duplicate (Easy)**: Check if an array has duplicate values. Use a hash set to track seen elements—exactly our pattern but with individual elements instead of sums.

3. **Longest Substring Without Repeating Characters (Medium)**: While more complex, it uses a hash set to track characters in the current window, removing them as the window slides.

The core insight is recognizing when you need to check if something has appeared before, and that a hash set provides the optimal lookup time for this operation.

## Key Takeaways

1. **Hash sets are perfect for duplicate detection**: When you need to know if you've seen a value before, reach for a hash set first. It gives you O(1) lookup and insertion on average.

2. **Adjacent pairs pattern**: Problems involving adjacent elements often use `nums[i] + nums[i + 1]` or similar patterns. The loop should run until `i < len(nums) - 1` to avoid index errors.

3. **Read constraints carefully**: The subarrays must begin at different indices, but they can overlap. Don't assume non-overlapping unless explicitly stated. This affects edge case handling.

This problem beautifully demonstrates how a simple insight—using a hash set to track seen sums—can transform an O(n²) brute force into an O(n) optimal solution. It's a perfect example of the trade-off between time and space complexity that's so common in algorithm design.

Related problems: [Two Sum](/problem/two-sum), [Partition Equal Subset Sum](/problem/partition-equal-subset-sum), [Find Two Non-overlapping Sub-arrays Each With Target Sum](/problem/find-two-non-overlapping-sub-arrays-each-with-target-sum)
