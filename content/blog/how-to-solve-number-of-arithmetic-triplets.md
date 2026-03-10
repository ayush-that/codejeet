---
title: "How to Solve Number of Arithmetic Triplets — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Arithmetic Triplets. Easy difficulty, 85.4% acceptance rate. Topics: Array, Hash Table, Two Pointers, Enumeration."
date: "2026-04-08"
category: "dsa-patterns"
tags: ["number-of-arithmetic-triplets", "array", "hash-table", "two-pointers", "easy"]
---

# How to Solve Number of Arithmetic Triplets

This problem asks us to count how many triplets `(i, j, k)` exist in a strictly increasing array where the differences between consecutive elements both equal a given `diff`. While the problem is labeled "Easy," it's interesting because it combines array traversal with efficient lookup techniques, testing whether you can recognize when to use a hash set versus brute force enumeration. The strictly increasing property of the array is crucial—it means all elements are unique and sorted, which opens up multiple solution approaches.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [0, 1, 4, 6, 7, 10]` with `diff = 3`.

We need to find triplets `(i, j, k)` where:

- `i < j < k` (indices in order)
- `nums[j] - nums[i] = 3`
- `nums[k] - nums[j] = 3`

Let's think step by step:

1. **Starting with the middle element approach**: For each potential `j`, we can check if `nums[j] - diff` exists in the array (that would be `i`) and if `nums[j] + diff` exists (that would be `k`).

2. **Walkthrough**:
   - `j = 0`, `nums[0] = 0`: Check for `0 - 3 = -3` (not in array) and `0 + 3 = 3` (not in array) → No triplet
   - `j = 1`, `nums[1] = 1`: Check for `1 - 3 = -2` (not in array) and `1 + 3 = 4` (exists at index 2) → Missing left element
   - `j = 2`, `nums[2] = 4`: Check for `4 - 3 = 1` (exists at index 1) and `4 + 3 = 7` (exists at index 4) → Found triplet `(1, 2, 4)`!
   - `j = 3`, `nums[3] = 6`: Check for `6 - 3 = 3` (not in array) and `6 + 3 = 9` (not in array) → No triplet
   - `j = 4`, `nums[4] = 7`: Check for `7 - 3 = 4` (exists at index 2) and `7 + 3 = 10` (exists at index 5) → Found triplet `(2, 4, 5)`!
   - `j = 5`, `nums[5] = 10`: Check for `10 - 3 = 7` (exists at index 4) and `10 + 3 = 13` (not in array) → Missing right element

3. **Result**: We found 2 triplets: `(1, 2, 4)` and `(2, 4, 5)`.

This walkthrough reveals the core insight: For each element as the middle of a potential triplet, we just need to check if its left neighbor (`element - diff`) and right neighbor (`element + diff`) exist in the array.

## Brute Force Approach

The most straightforward solution is to check all possible triplets `(i, j, k)` where `i < j < k`. For each combination, verify if both difference conditions hold.

**Why this is inefficient**: With three nested loops, we have O(n³) time complexity. For an array of length 200 (the problem's upper bound), that's 200³ = 8,000,000 operations—technically feasible but far from optimal. More importantly, it doesn't leverage the array's sorted nature or use efficient lookups.

**Brute force code structure**:

```python
count = 0
for i in range(n):
    for j in range(i+1, n):
        for k in range(j+1, n):
            if nums[j] - nums[i] == diff and nums[k] - nums[j] == diff:
                count += 1
```

While this works, it's like using a sledgehammer to crack a nut. Interviewers expect you to recognize better approaches.

## Optimal Solution

The optimal approach uses a hash set for O(1) lookups. Since the array is strictly increasing (all elements unique), we can store all elements in a set. Then, for each element `num` in the array, we check if both `num - diff` and `num + diff` exist in the set. If both exist, we've found a valid triplet where `num` is the middle element.

**Why this works**:

1. The strictly increasing property ensures all elements are unique, so sets work perfectly
2. Checking `num - diff` and `num + diff` is equivalent to finding `i` and `k` for a given `j`
3. The order `i < j < k` is automatically satisfied because if `num - diff` and `num + diff` exist in the array, and the array is sorted, their indices must be less than and greater than `num`'s index respectively

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def arithmeticTriplets(nums, diff):
    """
    Counts the number of arithmetic triplets in a strictly increasing array.

    Args:
        nums: List[int] - strictly increasing array
        diff: int - the required difference between consecutive elements

    Returns:
        int - number of valid triplets
    """
    # Step 1: Convert nums to a set for O(1) lookups
    # This allows us to quickly check if a number exists in the array
    num_set = set(nums)

    # Step 2: Initialize counter for valid triplets
    count = 0

    # Step 3: Iterate through each number in the array
    # Each number is a potential middle element (j) of a triplet
    for num in nums:
        # Step 4: Check if both left neighbor (num - diff) and
        # right neighbor (num + diff) exist in the set
        # If both exist, we have a valid triplet (i, j, k)
        if (num - diff) in num_set and (num + diff) in num_set:
            count += 1

    # Step 5: Return the total count of valid triplets
    return count
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Counts the number of arithmetic triplets in a strictly increasing array.
 *
 * @param {number[]} nums - strictly increasing array
 * @param {number} diff - the required difference between consecutive elements
 * @return {number} - number of valid triplets
 */
function arithmeticTriplets(nums, diff) {
  // Step 1: Convert nums to a Set for O(1) lookups
  // This allows us to quickly check if a number exists in the array
  const numSet = new Set(nums);

  // Step 2: Initialize counter for valid triplets
  let count = 0;

  // Step 3: Iterate through each number in the array
  // Each number is a potential middle element (j) of a triplet
  for (const num of nums) {
    // Step 4: Check if both left neighbor (num - diff) and
    // right neighbor (num + diff) exist in the set
    // If both exist, we have a valid triplet (i, j, k)
    if (numSet.has(num - diff) && numSet.has(num + diff)) {
      count++;
    }
  }

  // Step 5: Return the total count of valid triplets
  return count;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Counts the number of arithmetic triplets in a strictly increasing array.
     *
     * @param nums - strictly increasing array
     * @param diff - the required difference between consecutive elements
     * @return number of valid triplets
     */
    public int arithmeticTriplets(int[] nums, int diff) {
        // Step 1: Convert nums to a HashSet for O(1) lookups
        // This allows us to quickly check if a number exists in the array
        Set<Integer> numSet = new HashSet<>();
        for (int num : nums) {
            numSet.add(num);
        }

        // Step 2: Initialize counter for valid triplets
        int count = 0;

        // Step 3: Iterate through each number in the array
        // Each number is a potential middle element (j) of a triplet
        for (int num : nums) {
            // Step 4: Check if both left neighbor (num - diff) and
            // right neighbor (num + diff) exist in the set
            // If both exist, we have a valid triplet (i, j, k)
            if (numSet.contains(num - diff) && numSet.contains(num + diff)) {
                count++;
            }
        }

        // Step 5: Return the total count of valid triplets
        return count;
    }
}
```

</div>

## Alternative Approach: Two Pointers

Since the array is sorted, we can also solve this with a two-pointer approach in O(n) time and O(1) space:

1. For each element as potential `i`, use two pointers to find `j` and `k`
2. Move `j` forward until `nums[j] - nums[i] >= diff`
3. If equal to `diff`, move `k` forward from `j+1` until `nums[k] - nums[j] >= diff`
4. If both differences equal `diff`, increment count

This approach is more complex to implement but achieves better space complexity. However, for interview purposes, the hash set solution is usually preferred for its simplicity and clarity.

## Complexity Analysis

**Time Complexity**: O(n)

- Creating the set from `nums` takes O(n) time
- Iterating through `nums` and checking set membership takes O(n) × O(1) = O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity**: O(n)

- The hash set stores all `n` elements from the array
- No other significant data structures are used
- Total: O(n)

## Common Mistakes

1. **Forgetting the strictly increasing property**: Some candidates might worry about duplicate elements, but the problem guarantees the array is strictly increasing, so all elements are unique. This makes the hash set approach perfectly valid.

2. **Checking indices instead of values**: The problem asks for `nums[j] - nums[i] == diff`, not `j - i == diff`. This is a common misreading, especially since the array indices are also numbers.

3. **Incorrect loop boundaries in brute force**: When implementing the brute force solution, it's easy to make off-by-one errors in the nested loops. Remember: `i` goes from `0` to `n-3`, `j` from `i+1` to `n-2`, and `k` from `j+1` to `n-1`.

4. **Not considering the middle element approach**: Some candidates try to fix `i` and look for `j` and `k`, which requires more complex logic. The key insight is that fixing the middle element `j` simplifies the problem significantly.

## When You'll See This Pattern

This problem uses the **"existence checking with hash set"** pattern, which appears in many array problems:

1. **Two Sum (Easy)**: The classic problem where you need to find two numbers that add up to a target. The optimal solution uses a hash map to store seen numbers and check for complements.

2. **3Sum (Medium)**: While more complex, it builds on the same idea of finding triplets with specific properties. The two-pointer variant for sorted arrays is particularly relevant.

3. **Number of Unequal Triplets in Array (Easy)**: Another counting problem involving triplets, though with different constraints.

The pattern to recognize: When you need to check if specific values exist in an array, and the array elements are unique or you don't need counts, a hash set provides O(1) lookups that dramatically improve efficiency over linear searches.

## Key Takeaways

1. **Hash sets transform O(n) searches into O(1) lookups**: Whenever you need to repeatedly check if values exist in a collection, consider converting it to a hash set first.

2. **Fix the middle element for symmetric conditions**: When looking for triplets where conditions are symmetric around a middle element (like `a, a+diff, a+2diff`), consider iterating through potential middle elements rather than starting from the left.

3. **Read constraints carefully**: The "strictly increasing" property here is crucial—it guarantees uniqueness, which makes the hash set approach work perfectly. Always note special conditions in the problem statement.

Related problems: [Two Sum](/problem/two-sum), [3Sum](/problem/3sum), [Number of Unequal Triplets in Array](/problem/number-of-unequal-triplets-in-array)
