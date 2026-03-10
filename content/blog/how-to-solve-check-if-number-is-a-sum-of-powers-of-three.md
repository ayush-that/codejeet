---
title: "How to Solve Check if Number is a Sum of Powers of Three — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Check if Number is a Sum of Powers of Three. Medium difficulty, 79.4% acceptance rate. Topics: Math."
date: "2028-08-16"
category: "dsa-patterns"
tags: ["check-if-number-is-a-sum-of-powers-of-three", "math", "medium"]
---

# How to Solve "Check if Number is a Sum of Powers of Three"

The problem asks whether a given integer `n` can be expressed as a sum of _distinct_ powers of three. This means you can use 3⁰, 3¹, 3², etc., but each power can be used at most once. What makes this problem interesting is that it looks like a subset sum problem, but the special properties of base-3 representation give us a much more efficient solution.

## Visual Walkthrough

Let's trace through an example: `n = 12`.

We need to check if we can build 12 using distinct powers of three. The powers are: 1, 3, 9, 27, 81... (Note: 27 is already larger than 12, so we only consider up to 9).

A naive approach would try all combinations:

- 9 + 3 = 12 ✓ (uses 9 and 3, distinct powers)
- 9 + 1 = 10 ✗
- 3 + 1 = 4 ✗
- 9 + 3 + 1 = 13 ✗ (exceeds 12)

So 12 works because 9 + 3 = 12.

Now let's try `n = 91`:

- Powers up to 81: 1, 3, 9, 27, 81
- 81 + 9 + 1 = 91 ✓

What about `n = 2`?

- We can only use 1 (since 3 > 2)
- 1 + 1 is not allowed (powers must be distinct)
- So 2 cannot be formed ✗

The pattern emerges: this is essentially checking whether `n` in base-3 representation contains only digits 0 or 1 (never 2). Why? Because in base-3, each digit position represents how many times we take that power of three. If we allow only 0 or 1, we're saying "take this power zero times or once" — exactly the "distinct powers" requirement.

Let's verify with our examples:

- 12 in base-3: 12 = 1×9 + 1×3 + 0×1 = 110₃ (digits: 1,1,0) ✓
- 91 in base-3: 91 = 1×81 + 1×9 + 0×3 + 1×1 = 10101₃ (digits: 1,0,1,0,1) ✓
- 2 in base-3: 2 = 2×1 = 2₃ (digit: 2) ✗

## Brute Force Approach

A brute force solution would generate all subsets of powers of three less than or equal to `n`, then check if any subset sums to `n`. For each power of three, we have two choices: include it or exclude it. With `k` powers (where `k ≈ log₃(n)`), this gives us 2ᵏ subsets to check.

While this approach would work for small `n`, it becomes exponential in the number of digits: O(2^(log₃n)) = O(n^(log₃2)) ≈ O(n^0.63), which is too slow for larger `n`.

Here's what the brute force might look like:

<div class="code-group">

```python
# Brute force - too slow for large n
def checkPowersOfThree(n):
    # Generate all powers of three <= n
    powers = []
    p = 1
    while p <= n:
        powers.append(p)
        p *= 3

    # Try all subsets
    total_subsets = 1 << len(powers)  # 2^k subsets
    for mask in range(total_subsets):
        current_sum = 0
        for i in range(len(powers)):
            if mask & (1 << i):  # Check if i-th bit is set
                current_sum += powers[i]
        if current_sum == n:
            return True
    return False
```

```javascript
// Brute force - too slow for large n
function checkPowersOfThree(n) {
  // Generate all powers of three <= n
  const powers = [];
  let p = 1;
  while (p <= n) {
    powers.push(p);
    p *= 3;
  }

  // Try all subsets
  const totalSubsets = 1 << powers.length; // 2^k subsets
  for (let mask = 0; mask < totalSubsets; mask++) {
    let currentSum = 0;
    for (let i = 0; i < powers.length; i++) {
      if (mask & (1 << i)) {
        // Check if i-th bit is set
        currentSum += powers[i];
      }
    }
    if (currentSum === n) {
      return true;
    }
  }
  return false;
}
```

```java
// Brute force - too slow for large n
public boolean checkPowersOfThree(int n) {
    // Generate all powers of three <= n
    List<Integer> powers = new ArrayList<>();
    long p = 1;  // Use long to avoid overflow
    while (p <= n) {
        powers.add((int)p);
        p *= 3;
    }

    // Try all subsets
    int totalSubsets = 1 << powers.size();  // 2^k subsets
    for (int mask = 0; mask < totalSubsets; mask++) {
        int currentSum = 0;
        for (int i = 0; i < powers.size(); i++) {
            if ((mask & (1 << i)) != 0) {  // Check if i-th bit is set
                currentSum += powers.get(i);
            }
        }
        if (currentSum == n) {
            return true;
        }
    }
    return false;
}
```

</div>

## Optimized Approach

The key insight is that this problem is equivalent to checking whether `n` in base-3 representation contains only digits 0 or 1. Here's why:

1. Any number can be represented in base-3 as a sum of powers of three multiplied by coefficients (0, 1, or 2).
2. The "distinct powers" condition means each coefficient must be 0 or 1 (we can't take the same power twice).
3. Therefore, we just need to check that when we convert `n` to base-3, no digit equals 2.

We can check this without explicitly converting to base-3 by repeatedly dividing `n` by 3 and checking remainders:

- While `n > 0`:
  - Get the remainder when dividing by 3: `digit = n % 3`
  - If `digit == 2`, return `false` (we'd need to use the same power twice)
  - Otherwise, divide `n` by 3 and continue: `n //= 3`

This works because:

- Each division by 3 effectively looks at the next digit in base-3 representation
- If we ever see a digit 2, it means we'd need to include the same power of three twice to represent the number
- If we only see digits 0 or 1, we can represent the number using distinct powers

## Optimal Solution

Here's the optimal solution using the base-3 digit check:

<div class="code-group">

```python
# Time: O(log₃ n) | Space: O(1)
def checkPowersOfThree(n):
    """
    Check if n can be represented as sum of distinct powers of three.

    The key insight: In base-3 representation, each digit tells us how many
    times to take that power of three. Since we can only take each power
    at most once (distinct), all digits must be 0 or 1 (never 2).

    We check this by repeatedly dividing by 3 and checking remainders.
    """
    while n > 0:
        # Get the current base-3 digit (remainder when dividing by 3)
        digit = n % 3

        # If digit is 2, we'd need to use the same power twice
        # This violates the "distinct powers" condition
        if digit == 2:
            return False

        # Move to the next digit by integer division
        n //= 3

    # If we processed all digits without finding a 2, the number is valid
    return True
```

```javascript
// Time: O(log₃ n) | Space: O(1)
function checkPowersOfThree(n) {
  /**
   * Check if n can be represented as sum of distinct powers of three.
   *
   * The key insight: In base-3 representation, each digit tells us how many
   * times to take that power of three. Since we can only take each power
   * at most once (distinct), all digits must be 0 or 1 (never 2).
   *
   * We check this by repeatedly dividing by 3 and checking remainders.
   */
  while (n > 0) {
    // Get the current base-3 digit (remainder when dividing by 3)
    const digit = n % 3;

    // If digit is 2, we'd need to use the same power twice
    // This violates the "distinct powers" condition
    if (digit === 2) {
      return false;
    }

    // Move to the next digit by integer division
    n = Math.floor(n / 3);
  }

  // If we processed all digits without finding a 2, the number is valid
  return true;
}
```

```java
// Time: O(log₃ n) | Space: O(1)
public boolean checkPowersOfThree(int n) {
    /**
     * Check if n can be represented as sum of distinct powers of three.
     *
     * The key insight: In base-3 representation, each digit tells us how many
     * times to take that power of three. Since we can only take each power
     * at most once (distinct), all digits must be 0 or 1 (never 2).
     *
     * We check this by repeatedly dividing by 3 and checking remainders.
     */
    while (n > 0) {
        // Get the current base-3 digit (remainder when dividing by 3)
        int digit = n % 3;

        // If digit is 2, we'd need to use the same power twice
        // This violates the "distinct powers" condition
        if (digit == 2) {
            return false;
        }

        // Move to the next digit by integer division
        n /= 3;
    }

    // If we processed all digits without finding a 2, the number is valid
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log₃ n)

- We divide `n` by 3 in each iteration until it becomes 0
- The number of iterations equals the number of digits in base-3 representation, which is log₃ n
- In big-O notation, this is O(log n) since log₃ n = log n / log 3, and constant factors are ignored

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables (`digit`, loop counter)
- No additional data structures that grow with input size

## Common Mistakes

1. **Not handling the "distinct" requirement properly**: Some candidates try to greedily subtract the largest power of three, but this doesn't work when a digit 2 appears in base-3. For example, with n=5: largest power ≤5 is 3, subtract to get 2, then can't use 1 twice. But 5 = 3 + 1 + 1 is invalid. The correct answer is false since 5 in base-3 is 12₃.

2. **Infinite loop with negative numbers**: The problem states `n` is an integer but doesn't specify non-negative. However, powers of three are positive, so any sum of them must be non-negative. A robust solution should handle n ≤ 0: n=0 returns true (empty sum), n<0 returns false. Our solution handles this since the while loop doesn't execute for n ≤ 0.

3. **Overflow in brute force approach**: When generating powers of three, multiplying by 3 repeatedly can overflow 32-bit integers. In Java, use `long` for the power calculation. The optimal solution avoids this issue entirely.

4. **Misunderstanding base conversion**: Some candidates convert to base-3 string then check for '2', which works but is less efficient due to string operations. The modulo/division approach is cleaner and more efficient.

## When You'll See This Pattern

This "digit checking in a different base" pattern appears in several problems:

1. **Power of Three (Easy)**: Check if a number is exactly a power of three. Similar base-3 manipulation, but checking if there's exactly one '1' digit in base-3 representation.

2. **Base 7 (Easy)**: Convert a number to base-7 representation. Uses the same repeated division technique but builds the result string instead of checking digits.

3. **Complement of Base 10 Integer (Easy)**: While not exactly the same, it involves bit manipulation which is analogous to base-2 digit checking.

4. **Add Digits (Easy)**: Repeatedly summing digits until single digit (digital root) uses similar modulo/division operations.

The core technique of "repeated division by base to examine digits" is useful anytime you need to work with a number's representation in a different base or check properties of its digits.

## Key Takeaways

1. **When a problem involves powers of a number, think about base representation**: Problems about sums of distinct powers often map to checking digits in that base. For powers of k, check base-k digits.

2. **Repeated division/modulo is efficient for digit examination**: Instead of converting to string, use `n % base` to get the current digit and `n //= base` to shift to the next digit. This is O(log n) time and O(1) space.

3. **"Distinct powers" means coefficients are 0 or 1**: In mathematical terms, ∑ aᵢ \* kⁱ where each aᵢ ∈ {0, 1}. This is exactly a number's representation in base-k with digits restricted to 0 or 1.

Related problems: [Power of Three](/problem/power-of-three)
