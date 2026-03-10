---
title: "How to Solve Ugly Number III — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Ugly Number III. Medium difficulty, 31.3% acceptance rate. Topics: Math, Binary Search, Combinatorics, Number Theory."
date: "2028-10-15"
category: "dsa-patterns"
tags: ["ugly-number-iii", "math", "binary-search", "combinatorics", "medium"]
---

## How to Solve Ugly Number III

This problem asks us to find the nth positive integer divisible by at least one of three given numbers a, b, or c. What makes this tricky is that n can be up to 10⁹, and a, b, c up to 2×10⁹, so we cannot simply iterate through numbers checking divisibility—that would be far too slow. The key insight is that we can use binary search to "guess" the answer and count how many ugly numbers exist up to that guess using the inclusion-exclusion principle.

## Visual Walkthrough

Let's trace through a small example: n = 3, a = 2, b = 3, c = 5.

We want the 3rd number divisible by 2, 3, or 5. The sequence is: 2, 3, 4, 5, 6, 8, 9, 10... so the 3rd is 4.

But how do we find this efficiently? We can think: "Is there a way to count how many ugly numbers are ≤ some value X?" If we can answer that, we can binary search for the smallest X where count(X) ≥ n.

For X = 4:

- Numbers divisible by 2: 2, 4 → 2 numbers
- Numbers divisible by 3: 3 → 1 number
- Numbers divisible by 5: none → 0 numbers
  But we've double-counted numbers divisible by both 2 and 3 (like 6, but 6 > 4 so none here), etc.

Using inclusion-exclusion:
count = ⌊X/a⌋ + ⌊X/b⌋ + ⌊X/c⌋ - ⌊X/lcm(a,b)⌋ - ⌊X/lcm(a,c)⌋ - ⌊X/lcm(b,c)⌋ + ⌊X/lcm(a,b,c)⌋

For X = 4:

- ⌊4/2⌋ = 2
- ⌊4/3⌋ = 1
- ⌊4/5⌋ = 0
- ⌊4/lcm(2,3)=6⌋ = 0
- ⌊4/lcm(2,5)=10⌋ = 0
- ⌊4/lcm(3,5)=15⌋ = 0
- ⌊4/lcm(2,3,5)=30⌋ = 0
  Total = 2 + 1 + 0 - 0 - 0 - 0 + 0 = 3

So there are 3 ugly numbers ≤ 4. Since we want the 3rd ugly number, 4 is a candidate. We'll binary search to find the smallest X with count ≥ 3.

## Brute Force Approach

The most straightforward approach is to iterate through positive integers starting from 1, check if each is divisible by a, b, or c, and stop when we've found n such numbers.

<div class="code-group">

```python
# Time: O(n * max(a,b,c)) - Too slow for n up to 10^9
# Space: O(1)
def nthUglyNumber_brute(n: int, a: int, b: int, c: int) -> int:
    count = 0
    num = 1

    while count < n:
        if num % a == 0 or num % b == 0 or num % c == 0:
            count += 1
        num += 1

    return num - 1
```

```javascript
// Time: O(n * max(a,b,c)) - Too slow for n up to 10^9
// Space: O(1)
function nthUglyNumberBrute(n, a, b, c) {
  let count = 0;
  let num = 1;

  while (count < n) {
    if (num % a === 0 || num % b === 0 || num % c === 0) {
      count++;
    }
    num++;
  }

  return num - 1;
}
```

```java
// Time: O(n * max(a,b,c)) - Too slow for n up to 10^9
// Space: O(1)
public int nthUglyNumberBrute(int n, int a, int b, int c) {
    int count = 0;
    int num = 1;

    while (count < n) {
        if (num % a == 0 || num % b == 0 || num % c == 0) {
            count++;
        }
        num++;
    }

    return num - 1;
}
```

</div>

**Why this fails:** With n up to 10⁹, this could require checking billions of numbers. Even checking divisibility for each number is O(1), the sheer number of iterations makes this infeasible. We need a solution that scales logarithmically, not linearly.

## Optimized Approach

The key insight is that we can **binary search** for the answer. If we can answer the question "How many ugly numbers are ≤ X?" in O(1) time, then we can use binary search to find the smallest X where count(X) ≥ n.

To count ugly numbers ≤ X efficiently, we use the **inclusion-exclusion principle**:

- Count numbers divisible by a: ⌊X/a⌋
- Count numbers divisible by b: ⌊X/b⌋
- Count numbers divisible by c: ⌊X/c⌋
  But numbers divisible by multiple divisors are counted multiple times, so we subtract overlaps:
- Subtract numbers divisible by both a and b: ⌊X/lcm(a,b)⌋
- Subtract numbers divisible by both a and c: ⌊X/lcm(a,c)⌋
- Subtract numbers divisible by both b and c: ⌊X/lcm(b,c)⌋
  But now numbers divisible by all three were subtracted too many times, so add back: ⌊X/lcm(a,b,c)⌋

The formula becomes:
count(X) = ⌊X/a⌋ + ⌊X/b⌋ + ⌊X/c⌋ - ⌊X/lcm(a,b)⌋ - ⌊X/lcm(a,c)⌋ - ⌊X/lcm(b,c)⌋ + ⌊X/lcm(a,b,c)⌋

We need to compute LCMs efficiently. Since lcm(x,y) = x\*y/gcd(x,y), we can use the Euclidean algorithm for GCD.

## Optimal Solution

We implement binary search with the inclusion-exclusion counting function. The search space is from 1 to min(a,b,c)\*n (a safe upper bound since the nth ugly number won't exceed n times the smallest divisor).

<div class="code-group">

```python
# Time: O(log(min(a,b,c)*n)) - Binary search with O(1) counting
# Space: O(1)
def nthUglyNumber(n: int, a: int, b: int, c: int) -> int:
    # Helper function to compute greatest common divisor
    def gcd(x, y):
        while y:
            x, y = y, x % y
        return x

    # Helper function to compute least common multiple
    def lcm(x, y):
        return x * y // gcd(x, y)

    # Count how many ugly numbers are <= num
    def count_ugly(num):
        # Inclusion-exclusion principle
        count = (num // a) + (num // b) + (num // c)
        count -= (num // lcm_ab) + (num // lcm_ac) + (num // lcm_bc)
        count += num // lcm_abc
        return count

    # Precompute LCMs once to avoid recomputing in each count_ugly call
    lcm_ab = lcm(a, b)
    lcm_ac = lcm(a, c)
    lcm_bc = lcm(b, c)
    lcm_abc = lcm(lcm_ab, c)

    # Binary search for the smallest number with at least n ugly numbers <= it
    left, right = 1, min(a, b, c) * n

    while left < right:
        mid = left + (right - left) // 2

        if count_ugly(mid) < n:
            left = mid + 1  # Need more ugly numbers
        else:
            right = mid  # mid could be the answer, but check smaller

    return left
```

```javascript
// Time: O(log(min(a,b,c)*n)) - Binary search with O(1) counting
// Space: O(1)
function nthUglyNumber(n, a, b, c) {
  // Helper function to compute greatest common divisor
  const gcd = (x, y) => {
    while (y) {
      [x, y] = [y, x % y];
    }
    return x;
  };

  // Helper function to compute least common multiple
  const lcm = (x, y) => (x * y) / gcd(x, y);

  // Precompute LCMs once to avoid recomputing in each countUgly call
  const lcmAB = lcm(a, b);
  const lcmAC = lcm(a, c);
  const lcmBC = lcm(b, c);
  const lcmABC = lcm(lcmAB, c);

  // Count how many ugly numbers are <= num
  const countUgly = (num) => {
    // Inclusion-exclusion principle
    let count = Math.floor(num / a) + Math.floor(num / b) + Math.floor(num / c);
    count -= Math.floor(num / lcmAB) + Math.floor(num / lcmAC) + Math.floor(num / lcmBC);
    count += Math.floor(num / lcmABC);
    return count;
  };

  // Binary search for the smallest number with at least n ugly numbers <= it
  let left = 1;
  let right = Math.min(a, b, c) * n;

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (countUgly(mid) < n) {
      left = mid + 1; // Need more ugly numbers
    } else {
      right = mid; // mid could be the answer, but check smaller
    }
  }

  return left;
}
```

```java
// Time: O(log(min(a,b,c)*n)) - Binary search with O(1) counting
// Space: O(1)
public int nthUglyNumber(int n, int a, int b, int c) {
    // Helper function to compute greatest common divisor
    long gcd(long x, long y) {
        while (y != 0) {
            long temp = y;
            y = x % y;
            x = temp;
        }
        return x;
    }

    // Helper function to compute least common multiple
    long lcm(long x, long y) {
        return x * y / gcd(x, y);
    }

    // Precompute LCMs once to avoid recomputing in each countUgly call
    long lcmAB = lcm(a, b);
    long lcmAC = lcm(a, c);
    long lcmBC = lcm(b, c);
    long lcmABC = lcm(lcmAB, c);

    // Count how many ugly numbers are <= num
    long countUgly(long num) {
        // Inclusion-exclusion principle
        long count = num / a + num / b + num / c;
        count -= num / lcmAB + num / lcmAC + num / lcmBC;
        count += num / lcmABC;
        return count;
    }

    // Binary search for the smallest number with at least n ugly numbers <= it
    long left = 1;
    long right = Math.min(Math.min(a, b), c) * (long)n;

    while (left < right) {
        long mid = left + (right - left) / 2;

        if (countUgly(mid) < n) {
            left = mid + 1;  // Need more ugly numbers
        } else {
            right = mid;  // mid could be the answer, but check smaller
        }
    }

    return (int)left;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(min(a,b,c) \* n))

- Binary search runs O(log(min(a,b,c)\*n)) iterations
- Each iteration uses O(1) time for the count_ugly function
- GCD/LCM computations are O(log(min(x,y))) but are computed only once

**Space Complexity:** O(1)

- We only store a few variables for LCMs and binary search bounds
- No additional data structures that scale with input size

## Common Mistakes

1. **Integer overflow when computing LCM**: When a, b, c can be up to 2×10⁹, multiplying them directly can overflow 32-bit integers. Use 64-bit integers (long in Java, no issue in Python).
2. **Incorrect binary search bounds**: Setting the upper bound too low (like n) can miss the answer. The nth ugly number could be as large as min(a,b,c)\*n. Setting it too high (like 2×10¹⁸) is safe but may cause overflow in LCM computations.

3. **Forgetting the inclusion-exclusion principle**: Some candidates try count = ⌊X/a⌋ + ⌊X/b⌋ + ⌊X/c⌋ without subtracting overlaps, which overcounts numbers divisible by multiple divisors.

4. **Off-by-one in binary search**: The classic binary search mistake. Remember we want the smallest X where count(X) ≥ n. The condition `count(mid) < n` means we need to search higher (`left = mid + 1`), otherwise `right = mid`.

## When You'll See This Pattern

This "binary search on answer with counting function" pattern appears in many problems where:

1. You need to find the nth element satisfying some property
2. Counting how many elements satisfy the property up to some value X is easier than generating them
3. The answer space is monotonic (if X works, all larger X also work)

Related problems:

- **Ugly Number II**: Similar but uses a heap/DP approach since divisors are fixed (2,3,5)
- **Kth Smallest Number in Multiplication Table**: Find kth smallest in multiplication table using similar binary search + counting
- **Find K-th Smallest Pair Distance**: Binary search on distance with counting function
- **Kth Smallest Prime Fraction**: Binary search on value with counting of fractions ≤ target

## Key Takeaways

1. **When asked for the "nth" something, consider if you can binary search for the answer** by creating a counting function that answers "how many such items exist ≤ X?"

2. **Inclusion-exclusion principle** is essential for counting numbers divisible by any of several divisors without double-counting overlaps.

3. **Precompute expensive operations** (like LCMs) outside the binary search loop to maintain O(1) counting per iteration.

Related problems: [Ugly Number II](/problem/ugly-number-ii)
