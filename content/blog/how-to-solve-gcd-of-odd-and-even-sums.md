---
title: "How to Solve GCD of Odd and Even Sums — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode GCD of Odd and Even Sums. Easy difficulty, 84.8% acceptance rate. Topics: Math, Number Theory."
date: "2027-08-28"
category: "dsa-patterns"
tags: ["gcd-of-odd-and-even-sums", "math", "number-theory", "easy"]
---

# How to Solve GCD of Odd and Even Sums

This problem asks us to find the greatest common divisor (GCD) between two sums: the sum of the first `n` positive odd numbers and the sum of the first `n` positive even numbers. While it might seem like a straightforward computation problem, the interesting part is recognizing the mathematical patterns that allow us to solve it efficiently without actually computing large sums.

What makes this problem tricky is that a naive approach would compute both sums directly, which works for small `n` but becomes inefficient for large values. The optimal solution requires understanding the closed-form formulas for these sums and their mathematical properties.

## Visual Walkthrough

Let's trace through an example with `n = 3` to build intuition:

**Step 1: Identify the numbers we need**

- First 3 positive odd numbers: 1, 3, 5
- First 3 positive even numbers: 2, 4, 6

**Step 2: Calculate the sums**

- `sumOdd = 1 + 3 + 5 = 9`
- `sumEven = 2 + 4 + 6 = 12`

**Step 3: Find the GCD**

- Factors of 9: 1, 3, 9
- Factors of 12: 1, 2, 3, 4, 6, 12
- Greatest common factor: 3

So for `n = 3`, the answer is 3.

Let's try another example with `n = 4`:

- First 4 positive odd numbers: 1, 3, 5, 7 → sum = 16
- First 4 positive even numbers: 2, 4, 6, 8 → sum = 20
- GCD(16, 20) = 4

Notice a pattern? For `n = 3`, answer is 3. For `n = 4`, answer is 4. Let's check `n = 5`:

- Odd: 1, 3, 5, 7, 9 → sum = 25
- Even: 2, 4, 6, 8, 10 → sum = 30
- GCD(25, 30) = 5

The pattern suggests the answer might be `n` itself. But is this always true? Let's test `n = 1`:

- Odd: 1 → sum = 1
- Even: 2 → sum = 2
- GCD(1, 2) = 1 ✓

And `n = 2`:

- Odd: 1, 3 → sum = 4
- Even: 2, 4 → sum = 6
- GCD(4, 6) = 2 ✓

The pattern holds! But why? Let's explore the mathematical reasoning.

## Brute Force Approach

The most straightforward approach is to:

1. Generate the first `n` odd numbers and sum them
2. Generate the first `n` even numbers and sum them
3. Compute the GCD of these two sums

Here's what that looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def gcdOfSumsBruteForce(n):
    sum_odd = 0
    sum_even = 0

    # Generate first n odd numbers: 1, 3, 5, ...
    for i in range(n):
        sum_odd += (2 * i + 1)

    # Generate first n even numbers: 2, 4, 6, ...
    for i in range(1, n + 1):
        sum_even += (2 * i)

    # Compute GCD using Euclidean algorithm
    a, b = sum_odd, sum_even
    while b:
        a, b = b, a % b

    return a
```

```javascript
// Time: O(n) | Space: O(1)
function gcdOfSumsBruteForce(n) {
  let sumOdd = 0;
  let sumEven = 0;

  // Generate first n odd numbers: 1, 3, 5, ...
  for (let i = 0; i < n; i++) {
    sumOdd += 2 * i + 1;
  }

  // Generate first n even numbers: 2, 4, 6, ...
  for (let i = 1; i <= n; i++) {
    sumEven += 2 * i;
  }

  // Compute GCD using Euclidean algorithm
  let a = sumOdd;
  let b = sumEven;
  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a;
}
```

```java
// Time: O(n) | Space: O(1)
public int gcdOfSumsBruteForce(int n) {
    long sumOdd = 0;
    long sumEven = 0;

    // Generate first n odd numbers: 1, 3, 5, ...
    for (int i = 0; i < n; i++) {
        sumOdd += (2L * i + 1);
    }

    // Generate first n even numbers: 2, 4, 6, ...
    for (int i = 1; i <= n; i++) {
        sumEven += (2L * i);
    }

    // Compute GCD using Euclidean algorithm
    long a = sumOdd;
    long b = sumEven;
    while (b != 0) {
        long temp = b;
        b = a % b;
        a = temp;
    }

    return (int) a;
}
```

</div>

**Why this approach is insufficient:**
While this brute force solution works correctly, it has O(n) time complexity. For extremely large values of `n` (which could be up to 10^9 in some problem variations), this linear approach would be too slow. We need a constant-time solution.

## Optimal Solution

The key insight is recognizing the closed-form formulas for these sums:

1. **Sum of first n odd numbers**: This is a well-known result: 1 + 3 + 5 + ... + (2n-1) = n²
   - For n=3: 1+3+5=9=3²
   - For n=4: 1+3+5+7=16=4²

2. **Sum of first n even numbers**: 2 + 4 + 6 + ... + 2n = 2(1+2+3+...+n) = 2 × [n(n+1)/2] = n(n+1)

So we have:

- `sumOdd = n²`
- `sumEven = n(n+1)`

Now we need to find GCD(n², n(n+1)). Since both terms have a factor of `n`, we can factor it out:
GCD(n², n(n+1)) = n × GCD(n, n+1)

The crucial observation: **n and n+1 are consecutive integers, so they are always coprime** (their GCD is 1). This is because any common divisor d of n and n+1 must also divide their difference (n+1 - n = 1), so d must be 1.

Therefore:
GCD(n², n(n+1)) = n × GCD(n, n+1) = n × 1 = n

So the answer is simply `n`!

Here's the optimal solution:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def gcdOfSums(n):
    """
    Returns the GCD of:
    1) Sum of first n positive odd numbers = n²
    2) Sum of first n positive even numbers = n(n+1)

    Mathematical derivation:
    GCD(n², n(n+1)) = n × GCD(n, n+1)
    Since n and n+1 are consecutive integers, GCD(n, n+1) = 1
    Therefore, answer = n × 1 = n
    """
    return n  # That's it!
```

```javascript
// Time: O(1) | Space: O(1)
function gcdOfSums(n) {
  /**
   * Returns the GCD of:
   * 1) Sum of first n positive odd numbers = n²
   * 2) Sum of first n positive even numbers = n(n+1)
   *
   * Mathematical derivation:
   * GCD(n², n(n+1)) = n × GCD(n, n+1)
   * Since n and n+1 are consecutive integers, GCD(n, n+1) = 1
   * Therefore, answer = n × 1 = n
   */
  return n; // That's it!
}
```

```java
// Time: O(1) | Space: O(1)
public int gcdOfSums(int n) {
    /**
     * Returns the GCD of:
     * 1) Sum of first n positive odd numbers = n²
     * 2) Sum of first n positive even numbers = n(n+1)
     *
     * Mathematical derivation:
     * GCD(n², n(n+1)) = n × GCD(n, n+1)
     * Since n and n+1 are consecutive integers, GCD(n, n+1) = 1
     * Therefore, answer = n × 1 = n
     */
    return n;  // That's it!
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The optimal solution performs a single operation: returning `n`
- No loops or recursion needed
- This is constant time regardless of input size

**Space Complexity: O(1)**

- We only use a constant amount of extra space
- No additional data structures are created
- The input `n` itself is the only variable we need

## Common Mistakes

1. **Actually computing the sums for large n**: Some candidates might try to compute the sums directly using loops, which would be O(n) time. For large values of `n`, this could timeout. Always look for mathematical patterns before writing code.

2. **Forgetting that n and n+1 are coprime**: The key insight is that consecutive integers share no common factors other than 1. If you miss this, you might try to compute GCD(n², n(n+1)) directly, which still gives the right answer but requires more computation.

3. **Integer overflow in brute force approach**: When `n` is large (e.g., 10^9), computing n² or n(n+1) directly could cause integer overflow in languages with fixed-size integers. The optimal solution avoids this entirely.

4. **Misunderstanding which numbers to sum**: Some candidates might confuse "first n odd numbers" with "odd numbers up to n". Remember: "first n positive odd numbers" means the smallest n odd numbers: 1, 3, 5, ..., (2n-1).

## When You'll See This Pattern

This problem teaches several important patterns:

1. **Mathematical simplification before coding**: Many problems that seem to require computation can be simplified mathematically. Always ask: "Is there a formula or property that makes this simpler?"

2. **Properties of consecutive integers**: The fact that n and n+1 are coprime appears in many number theory problems. This is useful in problems like:
   - **LeetCode 914: X of a Kind in a Deck of Cards** - Uses GCD properties to determine if cards can be grouped
   - **LeetCode 365: Water and Jug Problem** - Uses Bézout's identity and GCD properties
   - **LeetCode 1071: Greatest Common Divisor of Strings** - Finding GCD of string lengths

3. **Closed-form summation formulas**: Recognizing common sums (sum of first n odd numbers = n², sum of first n numbers = n(n+1)/2) is valuable in many algorithmic problems.

## Key Takeaways

1. **Always look for mathematical patterns first**: Before writing any code, spend a minute thinking about whether there's a mathematical formula or property that simplifies the problem. This is especially true for "easy" problems that seem too straightforward.

2. **Consecutive integers are coprime**: This is a fundamental number theory fact that appears in many problems. If you see GCD(n, n+1) or similar expressions, the answer is always 1.

3. **Know your summation formulas**: The sum of first n odd numbers = n² and sum of first n even numbers = n(n+1) are useful identities that come up more often than you might expect in coding interviews.

[Practice this problem on CodeJeet](/problem/gcd-of-odd-and-even-sums)
