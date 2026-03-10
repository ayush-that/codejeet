---
title: "How to Solve Sum of Values at Indices With K Set Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of Values at Indices With K Set Bits. Easy difficulty, 86.1% acceptance rate. Topics: Array, Bit Manipulation."
date: "2027-07-18"
category: "dsa-patterns"
tags: ["sum-of-values-at-indices-with-k-set-bits", "array", "bit-manipulation", "easy"]
---

# How to Solve Sum of Values at Indices With K Set Bits

This problem asks us to sum elements from an array where the index (in binary) has exactly `k` ones. While conceptually straightforward, it tests your ability to work with binary representations and bit manipulation—a fundamental skill for optimization problems. The challenge lies in efficiently counting set bits for each index without converting to strings.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [5, 10, 1, 5, 2]` and `k = 1`.

We need to examine each index from 0 to 4 (since arrays are 0-indexed) and check if its binary representation has exactly one '1' bit:

- **Index 0**: Binary = `0` (or `000` in 3-bit form). Number of 1's = 0. ❌ Not equal to k=1.
- **Index 1**: Binary = `1` (`001`). Number of 1's = 1. ✅ Equal to k=1. Add `nums[1] = 10` to sum.
- **Index 2**: Binary = `2` (`010`). Number of 1's = 1. ✅ Equal to k=1. Add `nums[2] = 1` to sum.
- **Index 3**: Binary = `3` (`011`). Number of 1's = 2. ❌ Not equal to k=1.
- **Index 4**: Binary = `4` (`100`). Number of 1's = 1. ✅ Equal to k=1. Add `nums[4] = 2` to sum.

Sum = 10 + 1 + 2 = **13**.

The key insight is that we need a way to count set bits for each index efficiently.

## Brute Force Approach

A naive approach would be to:

1. Iterate through each index `i` from 0 to `n-1`
2. Convert `i` to a binary string
3. Count the number of '1' characters in that string
4. If the count equals `k`, add `nums[i]` to the running sum

While this works, converting integers to strings for bit counting is inefficient. The string conversion takes O(log i) time for each index (since the binary representation has about log₂(i) digits), making the overall time complexity O(n log n) where n is the array length. While acceptable for small inputs, this approach doesn't demonstrate optimal bit manipulation skills that interviewers look for.

## Optimal Solution

The optimal solution uses bit manipulation to count set bits efficiently. We can use the **Brian Kernighan's algorithm** which repeatedly clears the least significant set bit. The trick: `n & (n-1)` clears the lowest-order '1' bit. We count how many times we can do this until `n` becomes 0.

For example, to count bits in 13 (binary `1101`):

- 13 & 12 = `1101 & 1100` = `1100` (12) → count = 1
- 12 & 11 = `1100 & 1011` = `1000` (8) → count = 2
- 8 & 7 = `1000 & 0111` = `0000` (0) → count = 3

This takes O(number of set bits) time instead of O(log n), though both are efficient for 32-bit integers.

<div class="code-group">

```python
# Time: O(n * b) where b is the average number of set bits per index (max 32 for 32-bit ints)
# Space: O(1) - only using a few variables
def sumIndicesWithKSetBits(nums, k):
    """
    Sum elements from nums where the index has exactly k set bits.

    Args:
        nums: List[int] - input array
        k: int - target number of set bits

    Returns:
        int - sum of qualifying elements
    """
    total_sum = 0

    # Iterate through each index in the array
    for i in range(len(nums)):
        # Count set bits in current index i using Brian Kernighan's algorithm
        count = 0
        n = i  # Work with a copy so we don't modify the loop variable

        # Keep clearing the least significant set bit until n becomes 0
        # n & (n-1) clears the lowest-order '1' bit in n
        while n:
            n &= n - 1  # Clear the least significant set bit
            count += 1   # Increment count for each cleared bit

        # If this index has exactly k set bits, add its value to the sum
        if count == k:
            total_sum += nums[i]

    return total_sum
```

```javascript
// Time: O(n * b) where b is the average number of set bits per index
// Space: O(1) - constant extra space
function sumIndicesWithKSetBits(nums, k) {
  /**
   * Sum elements from nums where the index has exactly k set bits.
   *
   * @param {number[]} nums - input array
   * @param {number} k - target number of set bits
   * @return {number} - sum of qualifying elements
   */
  let totalSum = 0;

  // Iterate through each index in the array
  for (let i = 0; i < nums.length; i++) {
    // Count set bits in current index i using Brian Kernighan's algorithm
    let count = 0;
    let n = i; // Work with a copy so we don't modify the loop variable

    // Keep clearing the least significant set bit until n becomes 0
    // n & (n-1) clears the lowest-order '1' bit in n
    while (n) {
      n &= n - 1; // Clear the least significant set bit
      count++; // Increment count for each cleared bit
    }

    // If this index has exactly k set bits, add its value to the sum
    if (count === k) {
      totalSum += nums[i];
    }
  }

  return totalSum;
}
```

```java
// Time: O(n * b) where b is the average number of set bits per index
// Space: O(1) - constant extra space
class Solution {
    public int sumIndicesWithKSetBits(List<Integer> nums, int k) {
        /**
         * Sum elements from nums where the index has exactly k set bits.
         *
         * @param nums - input array
         * @param k - target number of set bits
         * @return sum of qualifying elements
         */
        int totalSum = 0;

        // Iterate through each index in the array
        for (int i = 0; i < nums.size(); i++) {
            // Count set bits in current index i using Brian Kernighan's algorithm
            int count = 0;
            int n = i;  // Work with a copy so we don't modify the loop variable

            // Keep clearing the least significant set bit until n becomes 0
            // n & (n-1) clears the lowest-order '1' bit in n
            while (n != 0) {
                n &= n - 1;  // Clear the least significant set bit
                count++;     // Increment count for each cleared bit
            }

            // If this index has exactly k set bits, add its value to the sum
            if (count == k) {
                totalSum += nums.get(i);
            }
        }

        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × b), where n is the length of the array and b is the average number of set bits per index. Since we're dealing with array indices, and indices are limited by array length (which in turn is limited by typical constraints), the maximum number of set bits in a 32-bit integer is 32. Therefore, in practice, this is O(32n) = **O(n)**.

**Space Complexity:** O(1) - we only use a few integer variables (`total_sum`, `count`, `n`) regardless of input size. No additional data structures are needed.

## Common Mistakes

1. **Counting bits incorrectly for index 0**: Some implementations might skip index 0 or handle it incorrectly. Remember that 0 has 0 set bits, which could equal k if k=0. Always test with k=0.

2. **Modifying the loop variable**: When counting bits, if you modify `i` directly instead of using a copy (`n = i`), you'll break the loop iteration. Always work with a copy when performing bit manipulation on loop variables.

3. **Using inefficient bit counting**: Converting to binary strings with `bin(i)` or similar functions works but is less efficient and doesn't demonstrate bit manipulation skills. Interviewers prefer the `n & (n-1)` approach.

4. **Forgetting that indices are 0-based**: The problem explicitly states 0-indexed arrays, but some candidates might start from 1. Always read the problem statement carefully.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Bit counting with Brian Kernighan's algorithm** - Used in problems where you need to count set bits efficiently.
2. **Index-based filtering** - Common in problems where you need to select elements based on properties of their indices.

Related problems:

- **Counting Bits (LeetCode 338)**: Requires generating the number of set bits for all numbers from 0 to n. The optimal solution uses dynamic programming with bit manipulation.
- **Find the K-or of an Array (LeetCode 2917)**: Involves examining bits at specific positions across multiple numbers, requiring similar bit manipulation skills.
- **Number of 1 Bits (LeetCode 191)**: The classic problem that teaches Brian Kernighan's algorithm directly.

## Key Takeaways

1. **Brian Kernighan's algorithm** (`n & (n-1)`) is the most efficient way to count set bits in an integer. It clears the least significant '1' bit each iteration.
2. **Bit manipulation is often more efficient than string conversion** for problems involving binary representations. It demonstrates deeper computer science knowledge.
3. **Always consider edge cases** like k=0, empty arrays, or maximum index values. Test with small examples first.

Related problems: [Counting Bits](/problem/counting-bits), [Find the K-or of an Array](/problem/find-the-k-or-of-an-array)
