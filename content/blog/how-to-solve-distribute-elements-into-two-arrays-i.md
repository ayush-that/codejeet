---
title: "How to Solve Distribute Elements Into Two Arrays I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Distribute Elements Into Two Arrays I. Easy difficulty, 73.8% acceptance rate. Topics: Array, Simulation."
date: "2028-05-10"
category: "dsa-patterns"
tags: ["distribute-elements-into-two-arrays-i", "array", "simulation", "easy"]
---

# How to Solve Distribute Elements Into Two Arrays I

This problem asks you to distribute distinct integers from a 1-indexed array into two separate arrays following specific rules. While conceptually straightforward, it's interesting because it tests your ability to carefully follow simulation instructions and handle 1-indexed arrays correctly—a common source of off-by-one errors in interviews.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `nums = [5, 4, 3, 2, 1]`.

**Operation 1:** Append `nums[1]` (which is 5) to `arr1`

- `arr1 = [5]`
- `arr2 = []`

**Operation 2:** Append `nums[2]` (which is 4) to `arr2`

- `arr1 = [5]`
- `arr2 = [4]`

**Operation 3:** Now we need to compare the last elements of both arrays. `arr1[-1] = 5`, `arr2[-1] = 4`. Since 5 > 4, we append `nums[3]` (which is 3) to `arr1`

- `arr1 = [5, 3]`
- `arr2 = [4]`

**Operation 4:** Compare last elements again: `arr1[-1] = 3`, `arr2[-1] = 4`. Since 3 < 4, we append `nums[4]` (which is 2) to `arr2`

- `arr1 = [5, 3]`
- `arr2 = [4, 2]`

**Operation 5:** Compare last elements: `arr1[-1] = 3`, `arr2[-1] = 2`. Since 3 > 2, we append `nums[5]` (which is 1) to `arr1`

- `arr1 = [5, 3, 1]`
- `arr2 = [4, 2]`

The final result is `arr1 = [5, 3, 1]` and `arr2 = [4, 2]`, which we return concatenated as `[5, 3, 1, 4, 2]`.

## Brute Force Approach

For this problem, there's really only one reasonable approach: simulate the process exactly as described. A "brute force" approach would be the same as the optimal approach because we must process each element exactly once in the given order.

However, a naive candidate might try to:

1. Sort the array first and then distribute elements
2. Use complex data structures like heaps or trees
3. Try to find mathematical patterns to avoid simulation

These approaches would fail because:

- Sorting would change the order of operations (we must process in the original order)
- Complex data structures add unnecessary overhead for a simple simulation
- The problem explicitly requires following the step-by-step process

The key insight is that we just need to carefully implement the rules as stated.

## Optimal Solution

The optimal solution directly simulates the process. We initialize two empty arrays, handle the first two operations specially, then for the remaining elements, compare the last elements of both arrays and append accordingly.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) where n is the length of nums
def resultArray(self, nums):
    """
    Distributes elements from nums into two arrays following specific rules.

    Rules:
    1. First element goes to arr1
    2. Second element goes to arr2
    3. For remaining elements:
       - If last element of arr1 > last element of arr2: append to arr1
       - Otherwise: append to arr2

    Args:
        nums: List[int] - 1-indexed array of distinct integers

    Returns:
        List[int] - Concatenation of arr1 and arr2
    """
    # Initialize both arrays
    arr1 = []
    arr2 = []

    # Handle first operation: append nums[0] to arr1
    # Note: Python uses 0-indexing, so nums[0] corresponds to nums[1] in problem
    arr1.append(nums[0])

    # Handle second operation: append nums[1] to arr2
    # Only do this if nums has at least 2 elements
    if len(nums) > 1:
        arr2.append(nums[1])

    # Process remaining elements starting from index 2 (third element)
    for i in range(2, len(nums)):
        # Compare last elements of both arrays
        if arr1[-1] > arr2[-1]:
            # Last element of arr1 is greater, append to arr1
            arr1.append(nums[i])
        else:
            # Last element of arr2 is greater or equal, append to arr2
            arr2.append(nums[i])

    # Concatenate arr1 and arr2 as required
    return arr1 + arr2
```

```javascript
// Time: O(n) | Space: O(n) where n is the length of nums
/**
 * Distributes elements from nums into two arrays following specific rules.
 *
 * Rules:
 * 1. First element goes to arr1
 * 2. Second element goes to arr2
 * 3. For remaining elements:
 *    - If last element of arr1 > last element of arr2: append to arr1
 *    - Otherwise: append to arr2
 *
 * @param {number[]} nums - 1-indexed array of distinct integers
 * @return {number[]} - Concatenation of arr1 and arr2
 */
var resultArray = function (nums) {
  // Initialize both arrays
  let arr1 = [];
  let arr2 = [];

  // Handle first operation: append nums[0] to arr1
  // Note: JavaScript uses 0-indexing, so nums[0] corresponds to nums[1] in problem
  arr1.push(nums[0]);

  // Handle second operation: append nums[1] to arr2
  // Only do this if nums has at least 2 elements
  if (nums.length > 1) {
    arr2.push(nums[1]);
  }

  // Process remaining elements starting from index 2 (third element)
  for (let i = 2; i < nums.length; i++) {
    // Compare last elements of both arrays
    if (arr1[arr1.length - 1] > arr2[arr2.length - 1]) {
      // Last element of arr1 is greater, append to arr1
      arr1.push(nums[i]);
    } else {
      // Last element of arr2 is greater or equal, append to arr2
      arr2.push(nums[i]);
    }
  }

  // Concatenate arr1 and arr2 as required
  return arr1.concat(arr2);
};
```

```java
// Time: O(n) | Space: O(n) where n is the length of nums
import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Distributes elements from nums into two arrays following specific rules.
     *
     * Rules:
     * 1. First element goes to arr1
     * 2. Second element goes to arr2
     * 3. For remaining elements:
     *    - If last element of arr1 > last element of arr2: append to arr1
     *    - Otherwise: append to arr2
     *
     * @param nums - 1-indexed array of distinct integers
     * @return List<Integer> - Concatenation of arr1 and arr2
     */
    public List<Integer> resultArray(int[] nums) {
        // Initialize both lists
        List<Integer> arr1 = new ArrayList<>();
        List<Integer> arr2 = new ArrayList<>();

        // Handle first operation: append nums[0] to arr1
        // Note: Java uses 0-indexing, so nums[0] corresponds to nums[1] in problem
        arr1.add(nums[0]);

        // Handle second operation: append nums[1] to arr2
        // Only do this if nums has at least 2 elements
        if (nums.length > 1) {
            arr2.add(nums[1]);
        }

        // Process remaining elements starting from index 2 (third element)
        for (int i = 2; i < nums.length; i++) {
            // Compare last elements of both arrays
            // Use get() to access last element by index
            if (arr1.get(arr1.size() - 1) > arr2.get(arr2.size() - 1)) {
                // Last element of arr1 is greater, append to arr1
                arr1.add(nums[i]);
            } else {
                // Last element of arr2 is greater or equal, append to arr2
                arr2.add(nums[i]);
            }
        }

        // Concatenate arr1 and arr2 as required
        List<Integer> result = new ArrayList<>(arr1);
        result.addAll(arr2);
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the `nums` array exactly once
- Each iteration performs constant-time operations (comparisons and appends)
- The concatenation at the end is O(n) but could be avoided by building the result incrementally

**Space Complexity:** O(n)

- We store all elements from `nums` in either `arr1` or `arr2`
- The output array has exactly n elements
- No additional significant space is used

## Common Mistakes

1. **Off-by-one errors with 1-indexing**: The problem states `nums` is 1-indexed, but most programming languages use 0-indexing. Candidates might incorrectly start with `nums[1]` instead of `nums[0]`. Always remember to translate problem indices to language indices.

2. **Not handling small inputs**: What if `nums` has only 1 element? The code should handle this case gracefully. In our solution, we check `if len(nums) > 1` before accessing the second element.

3. **Forgetting to compare last elements**: Some candidates might compare the current element being processed instead of the last elements of the arrays. The rule clearly states to compare the last elements of `arr1` and `arr2`.

4. **Incorrect comparison logic**: The rule says "if the last element of arr1 is greater than the last element of arr2" - not greater than or equal. Be precise with comparison operators.

## When You'll See This Pattern

This simulation pattern appears in many array manipulation problems:

1. **Split Array Largest Sum (Hard)**: While more complex, it involves distributing elements into groups based on certain conditions, similar to how we distribute here.

2. **Divide Array Into Equal Pairs (Easy)**: Involves distributing elements to satisfy certain conditions, though it uses sorting and counting rather than sequential simulation.

3. **Partition Array According to Given Pivot (Medium)**: Requires distributing elements into three groups based on comparison with a pivot value.

The core pattern is: **process elements in order, make decisions based on current state, and maintain multiple collections**. This is common in problems involving routing, distribution, or categorization of elements.

## Key Takeaways

1. **Read problem statements carefully**: The 1-indexing and specific rules about comparing last elements are easy to miss but crucial for correctness.

2. **Simulation problems are about careful implementation**: There's often no clever algorithm needed—just faithfully implement the described process step by step.

3. **Handle edge cases early**: Small inputs (0, 1, or 2 elements) should be considered before writing the main loop logic.

4. **Use appropriate data structures**: For this problem, arrays/lists are perfect because we need sequential access and appending at the end.

Related problems: [Split Array Largest Sum](/problem/split-array-largest-sum), [Divide Array Into Equal Pairs](/problem/divide-array-into-equal-pairs)
