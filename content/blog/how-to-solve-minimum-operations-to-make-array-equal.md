---
title: "How to Solve Minimum Operations to Make Array Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Array Equal. Medium difficulty, 82.7% acceptance rate. Topics: Math."
date: "2027-03-08"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-array-equal", "math", "medium"]
---

# How to Solve Minimum Operations to Make Array Equal

This problem asks us to find the minimum number of operations needed to make all elements in a special array equal. The array has length `n` where `arr[i] = (2 * i) + 1`, meaning it contains the first `n` odd numbers starting from 1. In each operation, we can transfer 1 from any element to any other element. What makes this problem interesting is that while it appears to be an array manipulation problem, the optimal solution is purely mathematical—no actual array manipulation is needed.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `n = 4`:

- The array is: `[1, 3, 5, 7]` (since arr[i] = 2\*i + 1)
- Our goal: Make all elements equal with minimum operations

**Step 1: Find the target value**
Since we can only transfer values between elements (not create or destroy total sum), the final equal value must be the average of all elements:

- Total sum = 1 + 3 + 5 + 7 = 16
- Average = 16 / 4 = 4

**Step 2: Calculate operations needed**
We need to bring each element to the target value of 4:

- Element 1: needs +3 (from 1 to 4)
- Element 3: needs +1 (from 3 to 4)
- Element 5: needs -1 (from 5 to 4)
- Element 7: needs -3 (from 7 to 4)

**Step 3: Pair deficits with surpluses**
Each operation transfers 1 from a surplus element to a deficit element:

- Transfer 1 from element 7 to element 1 (now: 2, 3, 5, 6)
- Transfer 1 from element 7 to element 1 (now: 3, 3, 5, 5)
- Transfer 1 from element 7 to element 1 (now: 4, 3, 5, 4)
- Transfer 1 from element 5 to element 3 (now: 4, 4, 4, 4)

Total operations: 4

Notice that we only need to consider the elements that need to increase (or decrease), since each operation handles one unit of transfer. The minimum operations equals the total amount we need to increase all deficit elements (which equals the total amount we need to decrease all surplus elements).

## Brute Force Approach

A naive approach might try to simulate the operations:

1. Calculate the target value (average)
2. While not all elements are equal:
   - Find an element below target
   - Find an element above target
   - Transfer 1 from the high element to the low element
   - Count this as one operation

The problem with this approach is efficiency. For large `n`, we could need up to O(n²) operations in the worst case (imagine transferring from the last element to the first element one unit at a time). Even with optimization, simulating each operation would be too slow for the constraints.

More importantly, this misses the mathematical insight: we don't need to simulate anything. We can calculate the answer directly from the pattern of the array.

## Optimized Approach

The key insight comes from recognizing two important properties:

1. **The array is symmetric**: For `arr[i] = 2*i + 1`, the array is symmetric around its center. When `n` is odd, there's a middle element that's already at the target value. When `n` is even, the target is exactly between the two middle elements.

2. **Operations are independent**: Each unit that needs to be moved requires exactly one operation, regardless of where it comes from or goes to. The minimum operations equals the total amount that needs to be increased (or decreased).

3. **Mathematical formula**: For the first half of elements (which are all below the average), the deficit for element at index `i` is `(target - arr[i])`. Summing these deficits gives the total operations needed.

Let's derive the formula:

- For odd `n`: middle index = `n//2`, target = `arr[middle] = 2*(n//2) + 1 = n`
- For even `n`: target = average = `n` (interestingly, same as odd case!)
- Elements needing increase: indices `0` to `(n-1)//2`
- Deficit for index `i`: `n - (2*i + 1) = n - 2*i - 1`
- Total operations = sum of deficits for first half = `Σ(n - 2*i - 1)` for `i = 0` to `(n-1)//2`

This simplifies to a closed-form formula: `(n * n) // 4` for even `n`, and `(n // 2) * ((n // 2) + 1)` for odd `n`. But there's an even simpler observation: both cases equal `floor(n²/4)`.

## Optimal Solution

The optimal solution uses the mathematical insight to compute the answer in O(1) time and O(1) space. We don't even need to create the array!

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def minOperations(n):
    """
    Calculate minimum operations to make all elements equal.

    The array contains first n odd numbers: [1, 3, 5, ..., 2n-1]
    The target value is always n (the average).
    For the first half of elements (indices 0 to (n-1)//2),
    each needs (n - (2*i + 1)) operations to reach n.

    Summing these gives the formula: floor(n²/4)
    """
    # The formula n * n // 4 works because:
    # - For even n: n²/4 is integer
    # - For odd n: n²/4 = (n//2)*(n//2 + 1) which is correct
    return n * n // 4
```

```javascript
// Time: O(1) | Space: O(1)
function minOperations(n) {
  /**
   * Calculate minimum operations to make all elements equal.
   *
   * The array contains first n odd numbers: [1, 3, 5, ..., 2n-1]
   * The target value is always n (the average).
   * For the first half of elements (indices 0 to Math.floor((n-1)/2)),
   * each needs (n - (2*i + 1)) operations to reach n.
   *
   * Summing these gives the formula: Math.floor(n²/4)
   */
  // Using Math.floor for integer division
  return Math.floor((n * n) / 4);
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    public int minOperations(int n) {
        /**
         * Calculate minimum operations to make all elements equal.
         *
         * The array contains first n odd numbers: [1, 3, 5, ..., 2n-1]
         * The target value is always n (the average).
         * For the first half of elements (indices 0 to (n-1)/2),
         * each needs (n - (2*i + 1)) operations to reach n.
         *
         * Summing these gives the formula: n²/4 (integer division)
         */
        // Integer division automatically floors for positive integers
        return n * n / 4;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We perform a constant number of arithmetic operations regardless of input size
- No loops, no recursion, just simple arithmetic

**Space Complexity: O(1)**

- We use only a constant amount of extra space
- No arrays or data structures are created
- Only a few integer variables are needed

The elegance of this solution comes from recognizing the mathematical pattern. Instead of simulating operations or even iterating through the array, we derive a closed-form formula from the properties of odd numbers and symmetry.

## Common Mistakes

1. **Actually building the array**: Some candidates waste time and space creating the array `[1, 3, 5, ..., 2n-1]`. This is unnecessary since we only need `n` to compute the answer.

2. **Incorrect target calculation**: The target is always `n`, not the middle element. For even `n`, the middle element doesn't exist, but the average is still `n`. Test with `n=4`: average of `[1,3,5,7]` is `4`, which equals `n`.

3. **Off-by-one errors in summation**: When manually summing deficits, candidates might include/exclude the middle element incorrectly. For odd `n`, the middle element is already at target and shouldn't be included in the sum.

4. **Overcomplicating with simulation**: Attempting to simulate the transfer operations is the most common trap. This leads to either inefficient code or complex logic that's prone to errors.

**How to avoid these**: Always test with small examples (n=1,2,3,4) and verify the pattern. Recognize that problems about "minimum operations to make equal" often have mathematical solutions when the operation is transferring units between elements.

## When You'll See This Pattern

This problem teaches the pattern of **mathematical simplification for symmetric operations**. You'll see similar patterns in:

1. **Minimum Number of Operations to Make Arrays Similar (Hard)**: Also involves transferring values between elements, but with more constraints. The core insight is similar: sort both arrays and pair deficits with surpluses.

2. **Minimum Operations to Make Array Equal II (Medium)**: A generalization where you can add/subtract 1 from any element (not just transfer between elements). The solution involves finding the median rather than the mean.

3. **Minimum Moves to Equal Array Elements II (Medium)**: Given an array, find minimum moves to make all elements equal, where a move is incrementing or decrementing an element by 1. The optimal target is the median.

The common thread is recognizing that when operations involve adjusting values toward equality, there's often a mathematical target (mean or median) and the answer can be computed directly without simulation.

## Key Takeaways

1. **Look for mathematical patterns in seemingly array-based problems**: When operations are symmetric and the array has a regular structure, there's often a closed-form solution. The sequence of odd numbers is a big hint.

2. **The sum of deficits equals minimum operations**: In transfer problems, each unit needs exactly one operation to move. The total operations equals the sum of all positive differences from the target (which equals the sum of all negative differences).

3. **Test with small examples to discover patterns**: n=1,2,3,4 reveal that the answer follows n²/4. This pattern recognition is crucial for interview problems.

Remember: In coding interviews, the simplest solution is often the best. If you find yourself writing complex simulation code for what seems like a simple problem, step back and look for mathematical properties.

Related problems: [Minimum Number of Operations to Make Arrays Similar](/problem/minimum-number-of-operations-to-make-arrays-similar), [Minimum Operations to Make Array Equal II](/problem/minimum-operations-to-make-array-equal-ii)
