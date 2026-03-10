---
title: "How to Solve Count Special Triplets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Special Triplets. Medium difficulty, 47.1% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2027-03-07"
category: "dsa-patterns"
tags: ["count-special-triplets", "array", "hash-table", "counting", "medium"]
---

# How to Solve Count Special Triplets

This problem asks us to count triplets `(i, j, k)` where `i < j < k` and both `nums[i]` and `nums[k]` are exactly twice the value of `nums[j]`. The challenge lies in efficiently counting these relationships while maintaining the strict index ordering constraint. A brute force check of all triplets would be prohibitively slow for larger arrays, requiring us to find a smarter counting strategy.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [2, 1, 4, 2, 4]`.

We need to find all `(i, j, k)` where:

- `i < j < k`
- `nums[i] = 2 * nums[j]`
- `nums[k] = 2 * nums[j]`

Let's examine each possible `j` position:

**When j = 1 (nums[j] = 1):**

- We need `nums[i] = 2` and `nums[k] = 2` with `i < 1 < k`
- Possible `i` values: index 0 has value 2 ✓
- Possible `k` values: index 3 has value 2 ✓
- This gives us 1 valid triplet: (0, 1, 3)

**When j = 2 (nums[j] = 4):**

- We need `nums[i] = 8` and `nums[k] = 8` with `i < 2 < k`
- No element equals 8, so 0 triplets

**When j = 3 (nums[j] = 2):**

- We need `nums[i] = 4` and `nums[k] = 4` with `i < 3 < k`
- Possible `i` values: index 2 has value 4 ✓
- Possible `k` values: index 4 has value 4 ✓
- This gives us 1 valid triplet: (2, 3, 4)

Total: 2 special triplets.

The key insight: For each middle element `nums[j]`, we need to count how many elements to its left equal `2*nums[j]` and how many elements to its right equal `2*nums[j]`, then multiply these counts.

## Brute Force Approach

The most straightforward solution checks all possible triplets `(i, j, k)`:

1. Use three nested loops: `i` from 0 to n-3, `j` from i+1 to n-2, `k` from j+1 to n-1
2. For each triplet, check if `nums[i] == 2*nums[j]` and `nums[k] == 2*nums[j]`
3. Count valid triplets

While this approach is simple and correct, it has O(n³) time complexity, which becomes impractical for arrays larger than a few hundred elements. For n=1000, we'd need to check about 166 million triplets!

## Optimized Approach

The optimal solution uses a counting approach with hash maps. The core insight is that for each position `j` as the middle element:

1. We need to know: How many elements before position `j` have value `2*nums[j]`?
2. We need to know: How many elements after position `j` have value `2*nums[j]`?

We can precompute these counts efficiently:

- **Left counts**: As we iterate through the array from left to right, we maintain a frequency map of values we've seen so far. For each `j`, the count of valid `i` positions is simply `leftCount[2*nums[j]]`.

- **Right counts**: We can either precompute a right frequency map by first counting all elements, then adjusting as we iterate, or we can compute it similarly to the left counts by iterating from right to left.

The algorithm:

1. First pass: Count frequency of all elements (for right counts)
2. Second pass: For each element `nums[j]`:
   - Decrement its count in the right map (since `j` is no longer "to the right")
   - Check left map for count of `2*nums[j]`
   - Check right map for count of `2*nums[j]`
   - Add `leftCount * rightCount` to total
   - Increment `nums[j]` in left map

This gives us O(n) time with O(n) space, a massive improvement over O(n³).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countSpecialTriplets(nums):
    """
    Counts special triplets (i, j, k) where:
    - i < j < k
    - nums[i] == 2 * nums[j]
    - nums[k] == 2 * nums[j]
    """
    n = len(nums)
    total = 0

    # left_count tracks frequencies of elements we've seen to the left of current j
    left_count = {}
    # right_count tracks frequencies of elements to the right of current j
    right_count = {}

    # Initialize right_count with all elements
    for num in nums:
        right_count[num] = right_count.get(num, 0) + 1

    # Iterate through each element as potential middle (j)
    for j in range(n):
        current = nums[j]

        # Remove current element from right_count since it's no longer to the right
        right_count[current] -= 1
        if right_count[current] == 0:
            del right_count[current]

        # Calculate how many valid i's and k's exist for this j
        target = 2 * current

        # Count elements to the left that equal target
        left_target_count = left_count.get(target, 0)
        # Count elements to the right that equal target
        right_target_count = right_count.get(target, 0)

        # Each valid left element can pair with each valid right element
        total += left_target_count * right_target_count

        # Add current element to left_count for future iterations
        left_count[current] = left_count.get(current, 0) + 1

    return total
```

```javascript
// Time: O(n) | Space: O(n)
function countSpecialTriplets(nums) {
  /**
   * Counts special triplets (i, j, k) where:
   * - i < j < k
   * - nums[i] == 2 * nums[j]
   * - nums[k] == 2 * nums[j]
   */
  const n = nums.length;
  let total = 0;

  // leftCount tracks frequencies of elements to the left of current j
  const leftCount = new Map();
  // rightCount tracks frequencies of elements to the right of current j
  const rightCount = new Map();

  // Initialize rightCount with all elements
  for (const num of nums) {
    rightCount.set(num, (rightCount.get(num) || 0) + 1);
  }

  // Iterate through each element as potential middle (j)
  for (let j = 0; j < n; j++) {
    const current = nums[j];
    const target = 2 * current;

    // Remove current element from rightCount (it's no longer to the right)
    rightCount.set(current, rightCount.get(current) - 1);
    if (rightCount.get(current) === 0) {
      rightCount.delete(current);
    }

    // Count valid elements to the left and right
    const leftTargetCount = leftCount.get(target) || 0;
    const rightTargetCount = rightCount.get(target) || 0;

    // Each left element can pair with each right element
    total += leftTargetCount * rightTargetCount;

    // Add current element to leftCount for future iterations
    leftCount.set(current, (leftCount.get(current) || 0) + 1);
  }

  return total;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int countSpecialTriplets(int[] nums) {
        /**
         * Counts special triplets (i, j, k) where:
         * - i < j < k
         * - nums[i] == 2 * nums[j]
         * - nums[k] == 2 * nums[j]
         */
        int n = nums.length;
        int total = 0;

        // leftCount tracks frequencies of elements to the left of current j
        Map<Integer, Integer> leftCount = new HashMap<>();
        // rightCount tracks frequencies of elements to the right of current j
        Map<Integer, Integer> rightCount = new HashMap<>();

        // Initialize rightCount with all elements
        for (int num : nums) {
            rightCount.put(num, rightCount.getOrDefault(num, 0) + 1);
        }

        // Iterate through each element as potential middle (j)
        for (int j = 0; j < n; j++) {
            int current = nums[j];
            int target = 2 * current;

            // Remove current element from rightCount (it's no longer to the right)
            rightCount.put(current, rightCount.get(current) - 1);
            if (rightCount.get(current) == 0) {
                rightCount.remove(current);
            }

            // Count valid elements to the left and right
            int leftTargetCount = leftCount.getOrDefault(target, 0);
            int rightTargetCount = rightCount.getOrDefault(target, 0);

            // Each left element can pair with each right element
            total += leftTargetCount * rightTargetCount;

            // Add current element to leftCount for future iterations
            leftCount.put(current, leftCount.getOrDefault(current, 0) + 1);
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array: one to initialize the right count map (O(n)), and one to process each element as a potential middle (O(n)).
- Hash map operations (get, put, delete) are O(1) on average.
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We maintain two hash maps that collectively store at most n entries (one for left counts, one for right counts).
- In the worst case where all elements are distinct, each map could store up to n entries.
- Total: O(n) space

## Common Mistakes

1. **Forgetting to remove current element from right counts**: When processing position `j`, we must decrement `right_count[nums[j]]` because `j` is no longer "to the right" of itself. Forgetting this leads to counting `j` as a valid `k`, violating `j < k`.

2. **Integer overflow with multiplication**: When `left_target_count` and `right_target_count` are large (up to n each), their product can exceed 32-bit integer limits. Always use 64-bit integers (Python handles this automatically, but in Java/C++ use `long`).

3. **Incorrect initialization of right counts**: Some candidates try to build right counts on the fly while iterating, but this requires looking ahead. It's simpler to count all elements first, then adjust as we go.

4. **Confusing the target value**: The condition requires `nums[i] = 2*nums[j]` and `nums[k] = 2*nums[j]`, not `nums[j] = 2*nums[i]`. Double-check which value gets multiplied by 2.

## When You'll See This Pattern

This "count pairs/triplets with specific relationships" pattern appears in many array problems:

1. **Count Good Triplets** (LeetCode 1534): Similar structure but with different conditions (absolute differences). The same "fix middle, count left and right" approach works.

2. **Number of Arithmetic Triplets** (LeetCode 2367): Find triplets where `nums[k] - nums[j] = nums[j] - nums[i] = diff`. The counting technique is nearly identical.

3. **3Sum** (LeetCode 15): While typically solved with two pointers, the core idea of fixing one element and finding pairs that complete a condition is similar.

These problems all share the insight that by fixing one element (often the middle), we can use hash maps to efficiently count valid combinations on either side.

## Key Takeaways

1. **Fix and count strategy**: When counting ordered triplets with constraints, often the most efficient approach is to fix the middle element and count valid left/right pairs separately, then combine the counts.

2. **Precomputation with adjustment**: Initialize a frequency map of all elements, then adjust it as you iterate through the array. This avoids repeated scanning of the same elements.

3. **Multiplication of independent counts**: When left and right choices are independent (any valid left element can pair with any valid right element), the total combinations is simply the product of the two counts.

[Practice this problem on CodeJeet](/problem/count-special-triplets)
