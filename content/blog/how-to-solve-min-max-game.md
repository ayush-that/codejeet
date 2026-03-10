---
title: "How to Solve Min Max Game — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Min Max Game. Easy difficulty, 64.3% acceptance rate. Topics: Array, Simulation."
date: "2028-03-09"
category: "dsa-patterns"
tags: ["min-max-game", "array", "simulation", "easy"]
---

# How to Solve Min Max Game

This problem asks you to simulate a reduction algorithm on an array whose length is a power of 2. At each step, you create a new array half the size by applying min/max operations on adjacent pairs. The tricky part is keeping track of which operation to apply at each position - min for even indices, max for odd indices - while correctly reducing the array until only one element remains.

## Visual Walkthrough

Let's trace through the example `nums = [1, 3, 5, 2, 4, 8, 2, 2]`:

**Step 1:** `n = 8`, create `newNums` of length 4

- Index 0 (even): `min(1, 3) = 1`
- Index 1 (odd): `max(5, 2) = 5`
- Index 2 (even): `min(4, 8) = 4`
- Index 3 (odd): `max(2, 2) = 2`
  Result: `[1, 5, 4, 2]`

**Step 2:** `n = 4`, create `newNums` of length 2

- Index 0 (even): `min(1, 5) = 1`
- Index 1 (odd): `max(4, 2) = 4`
  Result: `[1, 4]`

**Step 3:** `n = 2`, create `newNums` of length 1

- Index 0 (even): `min(1, 4) = 1`
  Result: `[1]`

The algorithm ends with `1` as the final answer.

## Brute Force Approach

The most straightforward approach is to literally follow the algorithm description: repeatedly create new arrays until only one element remains. While this is actually the optimal approach for this problem (since we must simulate each step), some candidates might try to find mathematical shortcuts or use recursion without proper base cases.

The key insight is that we need to simulate the process exactly as described - there's no clever formula to skip steps because the min/max operations at each position depend on the current index parity, which changes as the array shrinks.

## Optimal Solution

We'll implement a direct simulation that repeatedly creates new arrays until only one element remains. The solution uses a while loop that continues as long as the array length is greater than 1, creating a new array at each iteration by applying the appropriate min/max operations.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minMaxGame(nums):
    """
    Simulates the min-max game algorithm until only one element remains.

    Args:
        nums: List[int] - Input array with length power of 2

    Returns:
        int - The final single element after all reductions
    """
    # Continue until we have only one element
    while len(nums) > 1:
        # Create a new array half the size
        new_nums = [0] * (len(nums) // 2)

        # Fill the new array according to the rules
        for i in range(len(new_nums)):
            if i % 2 == 0:
                # Even index: take minimum of the pair
                new_nums[i] = min(nums[2 * i], nums[2 * i + 1])
            else:
                # Odd index: take maximum of the pair
                new_nums[i] = max(nums[2 * i], nums[2 * i + 1])

        # Replace the old array with the new reduced one
        nums = new_nums

    # Return the single remaining element
    return nums[0]
```

```javascript
// Time: O(n) | Space: O(n)
function minMaxGame(nums) {
  /**
   * Simulates the min-max game algorithm until only one element remains.
   *
   * @param {number[]} nums - Input array with length power of 2
   * @return {number} - The final single element after all reductions
   */
  // Continue until we have only one element
  while (nums.length > 1) {
    // Create a new array half the size
    const newNums = new Array(nums.length / 2);

    // Fill the new array according to the rules
    for (let i = 0; i < newNums.length; i++) {
      if (i % 2 === 0) {
        // Even index: take minimum of the pair
        newNums[i] = Math.min(nums[2 * i], nums[2 * i + 1]);
      } else {
        // Odd index: take maximum of the pair
        newNums[i] = Math.max(nums[2 * i], nums[2 * i + 1]);
      }
    }

    // Replace the old array with the new reduced one
    nums = newNums;
  }

  // Return the single remaining element
  return nums[0];
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    /**
     * Simulates the min-max game algorithm until only one element remains.
     *
     * @param nums - Input array with length power of 2
     * @return The final single element after all reductions
     */
    public int minMaxGame(int[] nums) {
        // Continue until we have only one element
        while (nums.length > 1) {
            // Create a new array half the size
            int[] newNums = new int[nums.length / 2];

            // Fill the new array according to the rules
            for (int i = 0; i < newNums.length; i++) {
                if (i % 2 == 0) {
                    // Even index: take minimum of the pair
                    newNums[i] = Math.min(nums[2 * i], nums[2 * i + 1]);
                } else {
                    // Odd index: take maximum of the pair
                    newNums[i] = Math.max(nums[2 * i], nums[2 * i + 1]);
                }
            }

            // Replace the old array with the new reduced one
            nums = newNums;
        }

        // Return the single remaining element
        return nums[0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each iteration processes half the elements of the previous array
- The total work is n + n/2 + n/4 + ... = 2n = O(n)
- Each element is processed exactly once across all iterations

**Space Complexity: O(n)**

- We create a new array of size n/2 at each iteration
- The maximum space used at any time is O(n) for the current array
- We could optimize to O(1) by modifying the array in-place, but the problem description suggests creating new arrays

## Common Mistakes

1. **Incorrect index calculation**: Forgetting that `newNums[i]` uses `nums[2*i]` and `nums[2*i+1]`, not `nums[i]` and `nums[i+1]`. The new array indices are half of the original indices.

2. **Wrong parity check**: Applying min/max based on the original array indices instead of the new array indices. The problem states "for every even index i" where i is in `newNums`, not in the original `nums`.

3. **Infinite loop**: Forgetting to update `nums = newNums` or using the wrong termination condition. The loop should continue while `len(nums) > 1`, not `len(nums) > 0`.

4. **Off-by-one in array creation**: Creating `newNums` with wrong size. Since n is always a power of 2, n/2 is always an integer, but in languages like Java, ensure you're using integer division.

## When You'll See This Pattern

This problem demonstrates **iterative array reduction**, a pattern where you repeatedly transform an array by combining elements according to specific rules until reaching a single value. Similar problems include:

1. **Elimination Game (Medium)**: Also reduces an array iteratively, though with alternating directions of elimination rather than min/max operations.

2. **Find Triangular Sum of an Array (Medium)**: Reduces an array by adding adjacent elements modulo 10, similar to Pascal's triangle but with addition instead of min/max.

3. **Tower of Hanoi variants**: While not exactly the same, these involve recursive/iterative reduction of problems to smaller subproblems.

The key pattern is recognizing when a problem requires simulating a process step-by-step rather than finding a mathematical shortcut.

## Key Takeaways

1. **Some problems require simulation**: When an algorithm is explicitly described with steps that depend on intermediate results, you often need to simulate it exactly rather than looking for shortcuts.

2. **Pay attention to index transformations**: When creating a new array from an old one, carefully map how indices relate between the two arrays. Drawing examples helps verify the mapping.

3. **Power-of-2 properties matter**: The guarantee that the length is a power of 2 ensures the process terminates cleanly without fractional array lengths.

Related problems: [Elimination Game](/problem/elimination-game), [Find Triangular Sum of an Array](/problem/find-triangular-sum-of-an-array)
