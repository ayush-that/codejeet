---
title: "How to Solve Counting Bits — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Counting Bits. Easy difficulty, 80.4% acceptance rate. Topics: Dynamic Programming, Bit Manipulation."
date: "2026-07-05"
category: "dsa-patterns"
tags: ["counting-bits", "dynamic-programming", "bit-manipulation", "easy"]
---

# How to Solve Counting Bits

This problem asks us to count the number of 1 bits (set bits) in the binary representation of every number from 0 to n, returning the results in an array. While it seems straightforward at first glance, the challenge lies in finding an efficient way to compute these counts without recalculating from scratch for each number. The optimal solution uses a clever dynamic programming approach that builds upon previously computed results, making it an excellent introduction to overlapping subproblems in bit manipulation contexts.

## Visual Walkthrough

Let's trace through n = 5 to build intuition:

**Binary representations:**

- 0: 0000 → 0 ones
- 1: 0001 → 1 one
- 2: 0010 → 1 one
- 3: 0011 → 2 ones
- 4: 0100 → 1 one
- 5: 0101 → 2 ones

Our output array should be: [0, 1, 1, 2, 1, 2]

Now let's look for patterns. Notice that:

- 1 (01) is 0 (00) + 1
- 2 (10) is 0 (00) + 1
- 3 (11) is 1 (01) + 1
- 4 (100) is 0 (000) + 1
- 5 (101) is 1 (001) + 1

The key insight: For any number i, if we remove the least significant bit (rightmost bit), we get i >> 1 (i divided by 2). The number of 1s in i equals the number of 1s in (i >> 1) plus whether the current least significant bit is 1 (i & 1).

Let's verify:

- 5: 5 >> 1 = 2 (which has 1 one), and 5 & 1 = 1 → 1 + 1 = 2 ✓
- 4: 4 >> 1 = 2 (1 one), 4 & 1 = 0 → 1 + 0 = 1 ✓
- 3: 3 >> 1 = 1 (1 one), 3 & 1 = 1 → 1 + 1 = 2 ✓

This recurrence relation forms the basis of our dynamic programming solution.

## Brute Force Approach

The most straightforward approach is to compute the count of 1 bits for each number independently. For each i from 0 to n, we can:

1. Convert i to binary
2. Count the '1' characters in the string representation
3. Store the count in our result array

Alternatively, we can use bit manipulation: repeatedly check the least significant bit and right-shift until the number becomes 0.

While this approach is simple and correct, it's inefficient because it recomputes everything from scratch for each number. For a number with b bits, we need O(b) operations to count its 1 bits. Since we do this for n+1 numbers, the total time complexity is O(n log n) — each number has up to log₂(n) bits.

Here's what the brute force looks like:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) excluding output array
def countBits_brute(n):
    ans = [0] * (n + 1)

    for i in range(n + 1):
        count = 0
        num = i
        # Count 1 bits by repeatedly checking LSB and right-shifting
        while num > 0:
            count += num & 1  # Add 1 if LSB is 1, 0 otherwise
            num >>= 1         # Right shift to check next bit
        ans[i] = count

    return ans
```

```javascript
// Time: O(n log n) | Space: O(1) excluding output array
function countBitsBrute(n) {
  const ans = new Array(n + 1).fill(0);

  for (let i = 0; i <= n; i++) {
    let count = 0;
    let num = i;
    // Count 1 bits by repeatedly checking LSB and right-shifting
    while (num > 0) {
      count += num & 1; // Add 1 if LSB is 1, 0 otherwise
      num >>= 1; // Right shift to check next bit
    }
    ans[i] = count;
  }

  return ans;
}
```

```java
// Time: O(n log n) | Space: O(1) excluding output array
public int[] countBitsBrute(int n) {
    int[] ans = new int[n + 1];

    for (int i = 0; i <= n; i++) {
        int count = 0;
        int num = i;
        // Count 1 bits by repeatedly checking LSB and right-shifting
        while (num > 0) {
            count += num & 1;  // Add 1 if LSB is 1, 0 otherwise
            num >>= 1;         // Right shift to check next bit
        }
        ans[i] = count;
    }

    return ans;
}
```

</div>

The brute force works but is suboptimal because it doesn't leverage the fact that smaller numbers' bit counts are reusable when computing larger numbers' counts.

## Optimal Solution

The optimal solution uses dynamic programming with the recurrence relation we discovered: `ans[i] = ans[i >> 1] + (i & 1)`. This works because:

- `i >> 1` gives us i without its least significant bit
- We've already computed the count for `i >> 1` since it's smaller than i
- `i & 1` tells us whether the removed bit was 1 (adds 1) or 0 (adds 0)

We initialize `ans[0] = 0` (0 has no 1 bits) and build up from there.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def countBits(n):
    # Initialize result array with n+1 elements, all starting at 0
    ans = [0] * (n + 1)

    # Build the DP table from 1 to n (0 is already 0)
    for i in range(1, n + 1):
        # Key insight: number of 1s in i equals:
        # number of 1s in (i with last bit removed) + (1 if last bit is 1, else 0)
        # i >> 1 is i divided by 2 (integer division)
        # i & 1 checks if the least significant bit is 1
        ans[i] = ans[i >> 1] + (i & 1)

    return ans
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function countBits(n) {
  // Initialize result array with n+1 elements, all starting at 0
  const ans = new Array(n + 1).fill(0);

  // Build the DP table from 1 to n (0 is already 0)
  for (let i = 1; i <= n; i++) {
    // Key insight: number of 1s in i equals:
    // number of 1s in (i with last bit removed) + (1 if last bit is 1, else 0)
    // i >> 1 is i divided by 2 (integer division)
    // i & 1 checks if the least significant bit is 1
    ans[i] = ans[i >> 1] + (i & 1);
  }

  return ans;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
public int[] countBits(int n) {
    // Initialize result array with n+1 elements, all starting at 0
    int[] ans = new int[n + 1];

    // Build the DP table from 1 to n (0 is already 0)
    for (int i = 1; i <= n; i++) {
        // Key insight: number of 1s in i equals:
        // number of 1s in (i with last bit removed) + (1 if last bit is 1, else 0)
        // i >> 1 is i divided by 2 (integer division)
        // i & 1 checks if the least significant bit is 1
        ans[i] = ans[i >> 1] + (i & 1);
    }

    return ans;
}
```

</div>

**Alternative formulation:** Some implementations use `ans[i] = ans[i // 2] + i % 2` which is mathematically equivalent but slightly less efficient due to division/modulo operations.

## Complexity Analysis

**Time Complexity: O(n)**

- We perform a constant amount of work for each i from 1 to n
- Each iteration involves one right shift, one bitwise AND, one array lookup, and one addition
- This is significantly faster than the O(n log n) brute force approach

**Space Complexity: O(1) excluding the output array**

- We only use the output array `ans` of size n+1
- No additional data structures are needed
- If we count the output array, space is O(n), but typically in algorithm analysis we don't count space required for the output

## Common Mistakes

1. **Off-by-one errors in array initialization**: Forgetting that we need n+1 elements (0 through n inclusive) and creating an array of size n instead. Always remember: if we need results for 0 to n, that's n+1 total numbers.

2. **Starting the loop from 0 instead of 1**: While starting from 0 works (0 >> 1 = 0, and 0 & 1 = 0, so ans[0] would remain 0), it's inefficient to compute something we already know. More importantly, some alternative DP formulations might fail if not handled properly at i=0.

3. **Using division/modulo instead of bit operations**: While `ans[i] = ans[i // 2] + i % 2` gives the same result, bit operations (>> and &) are generally faster. In interviews, showing you know bit operations is a plus.

4. **Misunderstanding the recurrence relation**: Some candidates try `ans[i] = ans[i-1] + 1` which doesn't work (e.g., from 3 to 4, the count decreases from 2 to 1, not increases). Remember: we remove the least significant bit, not subtract 1.

## When You'll See This Pattern

This problem teaches a fundamental dynamic programming pattern: **building solutions for larger problems from solutions to smaller subproblems**. Specifically, it shows how to use previously computed results to avoid redundant calculations.

You'll see similar patterns in:

1. **Fibonacci Sequence** - Each number is the sum of the two preceding ones
2. **Climbing Stairs** - Ways to reach step n depends on steps n-1 and n-2
3. **Coin Change** - Minimum coins for amount i depends on amounts i - coinValue
4. **Longest Increasing Subsequence** - LIS ending at i depends on previous elements

In bit manipulation contexts, this "remove LSB and check" pattern appears in:

- **Number of 1 Bits (Hamming Weight)** - The brute force approach to this problem
- **Power of Two** - Checking if a number has exactly one 1 bit
- **Reverse Bits** - Building the reversed number bit by bit

## Key Takeaways

1. **Dynamic programming often involves finding a recurrence relation** where the solution for i depends on solutions for smaller indices. Look for ways to break problems into smaller subproblems.

2. **Bit manipulation tricks like >> and & are powerful tools** for efficient computation. Right-shifting divides by 2 (integer division), and `& 1` checks the least significant bit.

3. **When a problem asks for results for a range of values**, consider whether computing them in order allows reuse of previous computations. This is the essence of dynamic programming.

Related problems: [Number of 1 Bits](/problem/number-of-1-bits), [Sum of Values at Indices With K Set Bits](/problem/sum-of-values-at-indices-with-k-set-bits), [Find the K-or of an Array](/problem/find-the-k-or-of-an-array)
