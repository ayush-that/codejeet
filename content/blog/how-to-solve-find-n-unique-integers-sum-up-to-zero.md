---
title: "How to Solve Find N Unique Integers Sum up to Zero — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find N Unique Integers Sum up to Zero. Easy difficulty, 78.5% acceptance rate. Topics: Array, Math."
date: "2027-08-07"
category: "dsa-patterns"
tags: ["find-n-unique-integers-sum-up-to-zero", "array", "math", "easy"]
---

# How to Solve Find N Unique Integers Sum up to Zero

This problem asks us to generate an array of `n` unique integers that sum to zero. While it seems simple at first glance, the challenge lies in finding a systematic approach that works for all values of `n` (including odd numbers) without resorting to brute force search. The "any" array requirement gives us flexibility, but we need an algorithm that's both efficient and easy to implement under interview pressure.

## Visual Walkthrough

Let's build intuition with concrete examples before diving into code. We need to generate `n` unique integers that sum to zero.

**Example 1: n = 5 (odd)**
We need 5 unique numbers that sum to 0. One approach: use symmetric pairs plus zero.

- Generate: -2, -1, 0, 1, 2
- Sum: (-2) + (-1) + 0 + 1 + 2 = 0 ✓
- All numbers are unique ✓

**Example 2: n = 4 (even)**
We need 4 unique numbers that sum to 0. For even n, we can't have a single zero in the middle.

- Generate: -2, -1, 1, 2
- Sum: (-2) + (-1) + 1 + 2 = 0 ✓
- All numbers are unique ✓

**Example 3: n = 1 (edge case)**
We need 1 unique number that sums to 0.

- Only possible answer: [0]
- Sum: 0 = 0 ✓

The pattern emerges: we can generate numbers symmetrically around zero. For odd `n`, include zero in the middle. For even `n`, use pairs of positive and negative numbers without zero.

## Brute Force Approach

A naive approach might try to randomly generate arrays until finding one that works, but this is highly inefficient. Another brute force method would be to try all combinations of `n` distinct integers, but the search space grows factorially with `n`.

What a candidate might initially consider:

1. Start with an empty array
2. Keep adding random unique integers
3. Track the sum
4. When we have `n` numbers, if sum ≠ 0, backtrack and try different numbers

This approach fails because:

- It has no guaranteed termination
- The time complexity is exponential in the worst case
- It's overly complicated for what should be a simple problem

The key insight is that we don't need to search for a solution—we can construct one directly using mathematical reasoning.

## Optimal Solution

The optimal solution leverages symmetry. We can generate numbers in pairs: for each positive integer `i`, we include both `i` and `-i`. This ensures each pair sums to zero. For odd `n`, we add a single zero to complete the set.

**Algorithm:**

1. Initialize an empty result array
2. For `i` from 1 to `n//2` (integer division):
   - Add `i` and `-i` to the result
3. If `n` is odd, add `0` to the result
4. Return the result

This works because:

- Each positive/negative pair cancels out (sums to 0)
- All numbers are unique since `i` values are distinct
- For odd `n`, adding zero doesn't change the sum
- Time complexity is O(n), space complexity is O(n)

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the output array
def sumZero(n):
    """
    Generate n unique integers that sum to zero.

    Approach: Use symmetric pairs around zero.
    For even n: generate n/2 pairs of (i, -i)
    For odd n: generate (n-1)/2 pairs plus a zero

    Args:
        n (int): Number of unique integers needed

    Returns:
        List[int]: Array of n unique integers summing to zero
    """
    result = []

    # Generate symmetric pairs
    # For i from 1 to n//2, add both i and -i
    # This creates pairs that cancel each other out
    for i in range(1, n // 2 + 1):
        result.append(i)      # Positive number
        result.append(-i)     # Corresponding negative

    # If n is odd, we need one more number
    # Adding 0 maintains the sum while giving us n numbers
    if n % 2 == 1:
        result.append(0)

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the output array
function sumZero(n) {
  /**
   * Generate n unique integers that sum to zero.
   *
   * Approach: Use symmetric pairs around zero.
   * For even n: generate n/2 pairs of (i, -i)
   * For odd n: generate (n-1)/2 pairs plus a zero
   *
   * @param {number} n - Number of unique integers needed
   * @return {number[]} Array of n unique integers summing to zero
   */
  const result = [];

  // Generate symmetric pairs
  // For i from 1 to Math.floor(n/2), add both i and -i
  // This creates pairs that cancel each other out
  for (let i = 1; i <= Math.floor(n / 2); i++) {
    result.push(i); // Positive number
    result.push(-i); // Corresponding negative
  }

  // If n is odd, we need one more number
  // Adding 0 maintains the sum while giving us n numbers
  if (n % 2 === 1) {
    result.push(0);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the output array
class Solution {
    /**
     * Generate n unique integers that sum to zero.
     *
     * Approach: Use symmetric pairs around zero.
     * For even n: generate n/2 pairs of (i, -i)
     * For odd n: generate (n-1)/2 pairs plus a zero
     *
     * @param n Number of unique integers needed
     * @return Array of n unique integers summing to zero
     */
    public int[] sumZero(int n) {
        int[] result = new int[n];
        int index = 0;

        // Generate symmetric pairs
        // For i from 1 to n/2, add both i and -i
        // This creates pairs that cancel each other out
        for (int i = 1; i <= n / 2; i++) {
            result[index++] = i;      // Positive number
            result[index++] = -i;     // Corresponding negative
        }

        // If n is odd, we need one more number
        // Adding 0 maintains the sum while giving us n numbers
        if (n % 2 == 1) {
            result[index] = 0;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate exactly `n//2` times in the loop, performing constant-time operations each iteration
- The odd/even check is O(1)
- Total operations scale linearly with `n`

**Space Complexity: O(n)**

- We need to store `n` integers in the output array
- The algorithm itself uses only O(1) extra space (excluding the output)
- In languages like Python and JavaScript, the space is O(n) for the result list/array
- In Java, we allocate exactly `n` integers in the result array

## Common Mistakes

1. **Forgetting the n = 1 edge case**: Some solutions fail when n = 1 because they don't handle the case where no pairs can be formed. The correct output for n = 1 is simply [0].

2. **Incorrect loop bounds for even n**: When n is even, we need exactly n/2 pairs. Using `range(1, n//2)` in Python (which excludes the upper bound) would give n-2 numbers. We need `range(1, n//2 + 1)` to include the upper bound.

3. **Generating non-unique numbers**: Some candidates might try to use a pattern like [1, -1, 2, -2, ...] but accidentally include duplicate zeros or overlapping ranges. The symmetric pair approach guarantees uniqueness because each `i` value is used only once.

4. **Overcomplicating the solution**: Candidates sometimes try to use hash sets, random generation, or complex mathematical formulas. The simplest solution is often the best in interviews, provided it's correct and efficient.

## When You'll See This Pattern

The symmetric pair pattern appears in various problems where you need to balance positive and negative values or create canceling pairs:

1. **Partition Array Into Three Parts With Equal Sum (LeetCode 1013)**: While more complex, it uses the idea of balancing sums across partitions.

2. **Divide Array Into Equal Pairs (LeetCode 2206)**: Similar concept of pairing elements, though with different constraints.

3. **Array Partition (LeetCode 561)**: Uses pairing to maximize the sum of min(pairs), which involves sorting and pairing adjacent elements.

The core technique of using symmetry or complementary pairs is useful whenever you need to achieve a net zero or balanced state. It's a form of "greedy construction" where you build the solution directly rather than searching for it.

## Key Takeaways

1. **Construction beats search**: When a problem asks for "any" valid solution and gives you flexibility in the output, look for a direct construction method rather than searching through possibilities.

2. **Symmetry simplifies**: Many problems involving sums or balances can be solved by creating symmetric pairs that cancel each other out. This is especially useful when working with integers.

3. **Handle parity separately**: Odd and even cases often need different handling in construction problems. Check both cases and make sure your solution works for the smallest values (n=1, n=2).

Remember: Interviewers love seeing candidates who can recognize when brute force is unnecessary and instead apply mathematical reasoning to construct an efficient solution directly.

[Practice this problem on CodeJeet](/problem/find-n-unique-integers-sum-up-to-zero)
