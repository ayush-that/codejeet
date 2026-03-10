---
title: "How to Solve XOR Operation in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode XOR Operation in an Array. Easy difficulty, 87.4% acceptance rate. Topics: Math, Bit Manipulation."
date: "2028-04-09"
category: "dsa-patterns"
tags: ["xor-operation-in-an-array", "math", "bit-manipulation", "easy"]
---

# How to Solve XOR Operation in an Array

This problem asks us to compute the XOR of a specific arithmetic sequence: given `n` and `start`, we need to XOR together `n` numbers where the i-th number equals `start + 2*i`. While the problem is straightforward to solve by brute force, it offers an excellent opportunity to practice bit manipulation fundamentals and understand XOR properties. The interesting aspect is recognizing that while we can compute the result directly, there's also a mathematical pattern we could exploit for optimization.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 5` and `start = 0`:

We need to create the array: `nums[i] = start + 2*i` for `i = 0` to `n-1`

- `nums[0] = 0 + 2*0 = 0`
- `nums[1] = 0 + 2*1 = 2`
- `nums[2] = 0 + 2*2 = 4`
- `nums[3] = 0 + 2*3 = 6`
- `nums[4] = 0 + 2*4 = 8`

Now we need to compute: `0 XOR 2 XOR 4 XOR 6 XOR 8`

Let's compute step by step:

1. Start with `result = 0`
2. `0 XOR 2 = 2` (binary: 00 ⊕ 10 = 10)
3. `2 XOR 4 = 6` (binary: 010 ⊕ 100 = 110)
4. `6 XOR 6 = 0` (binary: 110 ⊕ 110 = 000)
5. `0 XOR 8 = 8` (binary: 0000 ⊕ 1000 = 1000)

Final result: `8`

This shows the process: we generate each number in the sequence and accumulate the XOR result.

## Brute Force Approach

The most straightforward solution is to directly implement what the problem asks:

1. Initialize a result variable to 0
2. Loop from `i = 0` to `n-1`
3. For each `i`, compute `num = start + 2*i`
4. XOR this number with the current result
5. Return the final result

This approach is perfectly valid for this problem since the constraints are reasonable. However, a naive candidate might try to:

1. First build the entire array, then XOR all elements (wasting space)
2. Use addition instead of XOR (misunderstanding the operator)
3. Get the loop boundaries wrong (off-by-one errors)

The brute force is actually optimal for this problem in terms of time complexity, but we can discuss space optimization by not storing the entire array.

## Optimal Solution

The optimal approach follows the brute force logic but implements it efficiently without storing unnecessary data. We'll compute each number on the fly and accumulate the XOR result.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def xorOperation(n: int, start: int) -> int:
    """
    Compute XOR of arithmetic sequence: start, start+2, start+4, ..., start+2*(n-1)

    Args:
        n: Number of elements in the sequence
        start: Starting value of the sequence

    Returns:
        XOR of all elements in the sequence
    """
    result = 0  # Initialize result to 0 (XOR identity)

    # Loop through each index from 0 to n-1
    for i in range(n):
        # Compute current number in the sequence: start + 2*i
        current_num = start + 2 * i

        # XOR current number with accumulated result
        # XOR operation: result = result ^ current_num
        result ^= current_num

    return result  # Return final XOR result
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Compute XOR of arithmetic sequence: start, start+2, start+4, ..., start+2*(n-1)
 * @param {number} n - Number of elements in the sequence
 * @param {number} start - Starting value of the sequence
 * @return {number} XOR of all elements in the sequence
 */
function xorOperation(n, start) {
  let result = 0; // Initialize result to 0 (XOR identity)

  // Loop through each index from 0 to n-1
  for (let i = 0; i < n; i++) {
    // Compute current number in the sequence: start + 2*i
    const currentNum = start + 2 * i;

    // XOR current number with accumulated result
    // XOR operation: result = result ^ currentNum
    result ^= currentNum;
  }

  return result; // Return final XOR result
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Compute XOR of arithmetic sequence: start, start+2, start+4, ..., start+2*(n-1)
     * @param n Number of elements in the sequence
     * @param start Starting value of the sequence
     * @return XOR of all elements in the sequence
     */
    public int xorOperation(int n, int start) {
        int result = 0;  // Initialize result to 0 (XOR identity)

        // Loop through each index from 0 to n-1
        for (int i = 0; i < n; i++) {
            // Compute current number in the sequence: start + 2*i
            int currentNum = start + 2 * i;

            // XOR current number with accumulated result
            // XOR operation: result = result ^ currentNum
            result ^= currentNum;
        }

        return result;  // Return final XOR result
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate exactly `n` times in our loop
- Each iteration performs constant-time operations: arithmetic calculation and XOR
- No nested loops or recursive calls

**Space Complexity: O(1)**

- We only use a few integer variables (`result`, `i`, `currentNum`)
- We don't store the entire array, only compute values on the fly
- Memory usage doesn't grow with input size

## Common Mistakes

1. **Off-by-one errors in the loop**: Using `i <= n` instead of `i < n` or starting from `i = 1`. Remember: we need exactly `n` numbers starting from `i = 0`.
   - **How to avoid**: Carefully check loop boundaries. The sequence has `n` elements: `i = 0, 1, 2, ..., n-1`.

2. **Building unnecessary array**: Some candidates first create the entire array, then XOR all elements. This wastes O(n) space.
   - **How to avoid**: Recognize that we can compute and XOR each number on the fly without storing it.

3. **Misunderstanding XOR properties**: Confusing XOR (`^`) with other bitwise operators like OR (`|`) or AND (`&`).
   - **How to avoid**: Remember XOR returns 1 only when bits differ (1^0 or 0^1 = 1, 1^1 or 0^0 = 0).

4. **Integer overflow concerns**: While not an issue in this problem due to constraints, in languages with fixed-width integers, large values could overflow.
   - **How to avoid**: Understand the constraints. Here, `0 <= n <= 1000` and `0 <= start <= 1000`, so maximum value is `1000 + 2*999 = 2998`, well within 32-bit integer range.

## When You'll See This Pattern

This problem teaches fundamental bit manipulation skills that appear in many coding problems:

1. **Single Number (LeetCode 136)**: Find the element that appears once when all others appear twice. Solution uses XOR to cancel out pairs.
   - **Connection**: Both use XOR's property that `a ^ a = 0` and `a ^ 0 = a`.

2. **Missing Number (LeetCode 268)**: Find the missing number in an array containing 0 to n.
   - **Connection**: Can be solved by XORing all numbers with 0..n, similar to accumulating results.

3. **Find the Difference (LeetCode 389)**: Find the extra character added to a string.
   - **Connection**: XOR all character codes to find the one that doesn't cancel out.

The core pattern is using XOR to find unique elements or compute cumulative results efficiently.

## Key Takeaways

1. **XOR fundamentals matter**: XOR has useful properties: `a ^ a = 0`, `a ^ 0 = a`, and it's commutative/associative. These properties make it excellent for finding unique elements and computing cumulative results.

2. **Space optimization through on-the-fly computation**: When you only need a final result (not intermediate values), compute values as you go rather than storing them all.

3. **Read constraints carefully**: The problem specifies `nums[i] = start + 2*i` and `n == nums.length`. Understanding the exact formula prevents implementation errors.

[Practice this problem on CodeJeet](/problem/xor-operation-in-an-array)
