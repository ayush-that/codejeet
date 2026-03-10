---
title: "How to Solve Adding Two Negabinary Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Adding Two Negabinary Numbers. Medium difficulty, 37.6% acceptance rate. Topics: Array, Math."
date: "2029-10-13"
category: "dsa-patterns"
tags: ["adding-two-negabinary-numbers", "array", "math", "medium"]
---

# How to Solve Adding Two Negabinary Numbers

This problem asks us to add two numbers represented in base -2 (negabinary). The tricky part is that negative bases behave differently from positive bases—carry values can be negative, and we need to handle them carefully. This isn't just standard binary addition with a twist; it requires understanding how negative bases fundamentally work.

## Visual Walkthrough

Let's trace through adding `arr1 = [1,1,1,1,1]` and `arr2 = [1,0,1]` in base -2.

First, align them by their least significant bits (rightmost):

```
arr1: 1 1 1 1 1  (represents 1*(-2)^4 + 1*(-2)^3 + 1*(-2)^2 + 1*(-2)^1 + 1*(-2)^0 = 11 in decimal)
arr2: 0 0 1 0 1  (padded with zeros: represents 5 in decimal)
```

We'll add from right to left (least significant to most significant), just like regular addition, but with different carry rules:

**Position 0 (2^0):** 1 + 1 = 2

- In base -2, 2 = 0 with carry of -1 (because (-2)^1 = -2, so we need -1 of them to represent +2)
- Result bit: 0, Carry: -1

**Position 1 (2^1):** 1 + 0 + (-1 carry) = 0

- Result bit: 0, Carry: 0

**Position 2 (2^2):** 1 + 1 + 0 = 2

- Again, 2 = 0 with carry of -1
- Result bit: 0, Carry: -1

**Position 3 (2^3):** 1 + 0 + (-1) = 0

- Result bit: 0, Carry: 0

**Position 4 (2^4):** 1 + 0 + 0 = 1

- Result bit: 1, Carry: 0

So we get `[1,0,0,0,0]` which represents 16 in decimal. Wait, 11 + 5 = 16, so that's correct!

The key insight: when our sum at a position is 2 or 3, we need to handle carries differently than in positive bases. Specifically:

- If sum = 0 or 1: result bit = sum, carry = 0
- If sum = 2: result bit = 0, carry = -1 (because we're effectively borrowing from the next position)
- If sum = 3: result bit = 1, carry = -1
- If sum = -1: result bit = 1, carry = 1 (we need to add back in the next position)

## Brute Force Approach

A naive approach might be:

1. Convert both negabinary arrays to decimal
2. Add the decimal numbers
3. Convert the sum back to negabinary

However, this has several problems:

- The arrays can be up to 1000 elements long, representing extremely large numbers that might overflow standard integer types
- The conversion algorithms themselves are non-trivial and error-prone
- Even with big integers, the time complexity would be O(n²) for the conversions

More importantly, this misses the point of the problem—interviewers want to see you understand how to perform arithmetic directly in negabinary, not just convert to a familiar base.

## Optimized Approach

The optimal approach performs addition directly in base -2, similar to how we add binary numbers but with modified carry rules. Here's the step-by-step reasoning:

1. **Work from least significant to most significant**: Just like regular addition, we start from the rightmost bit.

2. **Handle four cases for the sum at each position**:
   - If sum = 0 or 1: Write it down, carry 0 to next position
   - If sum = 2: Write 0, carry -1 (because in base -2, 2 = (-2)^1 \* (-1) + 0)
   - If sum = 3: Write 1, carry -1 (because 3 = (-2)^1 \* (-1) + 1)
   - If sum = -1: Write 1, carry 1 (because -1 = (-2)^1 \* 1 + 1)

3. **Continue until all bits are processed and carry is 0**: Unlike binary addition where we stop when carry is 0, in negabinary we might have negative carries that propagate.

4. **Remove leading zeros**: The result should not have unnecessary leading zeros.

The mathematical justification: In base b, when we have digit d and carry c, we're solving: d = result + b × next_carry. For b = -2, this becomes: d = result + (-2) × next_carry. Solving for next_carry: next_carry = (result - d) / 2. Since result must be 0 or 1, we choose result that makes next_carry an integer.

## Optimal Solution

<div class="code-group">

```python
# Time: O(max(n, m)) where n,m are lengths of arr1, arr2
# Space: O(max(n, m)) for the result array
def addNegabinary(arr1, arr2):
    """
    Add two numbers in base -2 (negabinary).

    The key insight: carry can be negative in negabinary.
    We process bits from least to most significant, handling
    four cases for the sum at each position.
    """
    i, j = len(arr1) - 1, len(arr2) - 1
    carry = 0
    result = []

    # Process all bits from both numbers and any remaining carry
    while i >= 0 or j >= 0 or carry != 0:
        # Get current bits (0 if we've exhausted the array)
        bit1 = arr1[i] if i >= 0 else 0
        bit2 = arr2[j] if j >= 0 else 0

        # Calculate sum of current bits and carry
        current_sum = bit1 + bit2 + carry

        # Determine result bit and next carry based on sum value
        if current_sum == 0 or current_sum == 1:
            # Simple case: write sum as is, no carry
            result.append(current_sum)
            carry = 0
        elif current_sum == 2:
            # 2 in negabinary becomes 0 with carry -1
            result.append(0)
            carry = -1
        elif current_sum == 3:
            # 3 in negabinary becomes 1 with carry -1
            result.append(1)
            carry = -1
        elif current_sum == -1:
            # -1 in negabinary becomes 1 with carry 1
            result.append(1)
            carry = 1
        else:
            # This handles cases like current_sum = 4 (shouldn't happen with valid inputs)
            result.append(current_sum % 2)
            carry = -(current_sum // 2)

        # Move to next more significant bit
        i -= 1
        j -= 1

    # Remove leading zeros (except keep at least one zero if result is all zeros)
    while len(result) > 1 and result[-1] == 0:
        result.pop()

    # Reverse result since we built it from least to most significant
    return result[::-1]
```

```javascript
// Time: O(max(n, m)) where n,m are lengths of arr1, arr2
// Space: O(max(n, m)) for the result array
function addNegabinary(arr1, arr2) {
  /**
   * Add two numbers in base -2 (negabinary).
   *
   * The key insight: carry can be negative in negabinary.
   * We process bits from least to most significant, handling
   * four cases for the sum at each position.
   */
  let i = arr1.length - 1;
  let j = arr2.length - 1;
  let carry = 0;
  const result = [];

  // Process all bits from both numbers and any remaining carry
  while (i >= 0 || j >= 0 || carry !== 0) {
    // Get current bits (0 if we've exhausted the array)
    const bit1 = i >= 0 ? arr1[i] : 0;
    const bit2 = j >= 0 ? arr2[j] : 0;

    // Calculate sum of current bits and carry
    const currentSum = bit1 + bit2 + carry;

    // Determine result bit and next carry based on sum value
    if (currentSum === 0 || currentSum === 1) {
      // Simple case: write sum as is, no carry
      result.push(currentSum);
      carry = 0;
    } else if (currentSum === 2) {
      // 2 in negabinary becomes 0 with carry -1
      result.push(0);
      carry = -1;
    } else if (currentSum === 3) {
      // 3 in negabinary becomes 1 with carry -1
      result.push(1);
      carry = -1;
    } else if (currentSum === -1) {
      // -1 in negabinary becomes 1 with carry 1
      result.push(1);
      carry = 1;
    } else {
      // This handles edge cases (shouldn't happen with valid inputs)
      result.push(currentSum % 2);
      carry = -Math.floor(currentSum / 2);
    }

    // Move to next more significant bit
    i--;
    j--;
  }

  // Remove leading zeros (except keep at least one zero if result is all zeros)
  while (result.length > 1 && result[result.length - 1] === 0) {
    result.pop();
  }

  // Reverse result since we built it from least to most significant
  return result.reverse();
}
```

```java
// Time: O(max(n, m)) where n,m are lengths of arr1, arr2
// Space: O(max(n, m)) for the result list
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public List<Integer> addNegabinary(int[] arr1, int[] arr2) {
    /**
     * Add two numbers in base -2 (negabinary).
     *
     * The key insight: carry can be negative in negabinary.
     * We process bits from least to most significant, handling
     * four cases for the sum at each position.
     */
    int i = arr1.length - 1;
    int j = arr2.length - 1;
    int carry = 0;
    List<Integer> result = new ArrayList<>();

    // Process all bits from both numbers and any remaining carry
    while (i >= 0 || j >= 0 || carry != 0) {
        // Get current bits (0 if we've exhausted the array)
        int bit1 = i >= 0 ? arr1[i] : 0;
        int bit2 = j >= 0 ? arr2[j] : 0;

        // Calculate sum of current bits and carry
        int currentSum = bit1 + bit2 + carry;

        // Determine result bit and next carry based on sum value
        if (currentSum == 0 || currentSum == 1) {
            // Simple case: write sum as is, no carry
            result.add(currentSum);
            carry = 0;
        } else if (currentSum == 2) {
            // 2 in negabinary becomes 0 with carry -1
            result.add(0);
            carry = -1;
        } else if (currentSum == 3) {
            // 3 in negabinary becomes 1 with carry -1
            result.add(1);
            carry = -1;
        } else if (currentSum == -1) {
            // -1 in negabinary becomes 1 with carry 1
            result.add(1);
            carry = 1;
        } else {
            // This handles edge cases (shouldn't happen with valid inputs)
            result.add(currentSum % 2);
            carry = -(currentSum / 2);
        }

        // Move to next more significant bit
        i--;
        j--;
    }

    // Remove leading zeros (except keep at least one zero if result is all zeros)
    while (result.size() > 1 && result.get(result.size() - 1) == 0) {
        result.remove(result.size() - 1);
    }

    // Reverse result since we built it from least to most significant
    Collections.reverse(result);

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(max(n, m)) where n and m are the lengths of arr1 and arr2. We process each bit position once, and the number of positions is at most max(n, m) plus possibly a few extra for carry propagation.

**Space Complexity:** O(max(n, m)) for the result array. In the worst case, the result might be one bit longer than the longer input (e.g., when adding [1] + [1] = [1,1,0] in negabinary).

The carry propagation is bounded—even though carries can bounce between positive and negative, they eventually resolve to 0 within a reasonable number of steps.

## Common Mistakes

1. **Forgetting that carry can be negative**: The most common error is treating this like regular binary addition where carry is always 0 or 1. In negabinary, carry can be -1, which requires special handling.

2. **Not removing leading zeros correctly**: The problem specifies the result should not have leading zeros, except for the number 0 itself which should be represented as [0]. Candidates often either remove all zeros (returning empty array for zero) or keep unnecessary leading zeros.

3. **Wrong iteration condition**: Using `while (i >= 0 || j >= 0)` without `|| carry != 0` can cut off the result prematurely when there's still a carry to process.

4. **Incorrect bit indexing**: Since arrays are given most-significant-bit first, but we process least-significant-bit first, it's easy to get the indexing wrong. Always double-check whether you're accessing `arr[i]` or `arr[len(arr)-1-i]`.

## When You'll See This Pattern

This problem teaches **positional numeral system arithmetic with non-standard bases**, which appears in:

1. **Add Binary (LeetCode 67)** - Similar bit-by-bit addition with carry, but simpler since base 2 only has positive carries.
2. **Add Two Numbers (LeetCode 2)** - Linked list addition with carry, though in base 10.
3. **Convert to Base -2 (LeetCode 1017)** - The inverse operation: converting from decimal to negabinary.

The core pattern is: **when performing arithmetic in an unusual base, derive the carry rules mathematically from the base's definition, then implement them carefully case-by-case.**

## Key Takeaways

1. **Negative bases invert the usual carry behavior**: In base -2, a sum of 2 produces a negative carry (-1), while a sum of -1 produces a positive carry (1). Always derive carry rules from the equation: digit = result + base × next_carry.

2. **Process from least to most significant regardless of representation**: Even though the input is given most-significant-bit first, arithmetic always works from the least significant digit upward.

3. **Test edge cases thoroughly**: With unusual number systems, test with zeros, ones, and cases that produce negative intermediate sums. The carry propagation can be non-intuitive.

[Practice this problem on CodeJeet](/problem/adding-two-negabinary-numbers)
