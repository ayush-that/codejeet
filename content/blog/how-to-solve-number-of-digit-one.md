---
title: "How to Solve Number of Digit One — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Digit One. Hard difficulty, 37.7% acceptance rate. Topics: Math, Dynamic Programming, Recursion."
date: "2026-11-16"
category: "dsa-patterns"
tags: ["number-of-digit-one", "math", "dynamic-programming", "recursion", "hard"]
---

# How to Solve Number of Digit One

Counting how many times the digit `1` appears in all numbers from 1 to `n` seems straightforward at first glance, but the naive approach quickly becomes impossible for large `n`. This problem is tricky because it requires mathematical insight rather than brute force iteration. The key is recognizing that we can count contributions from each digit position separately using a pattern that repeats every power of 10.

## Visual Walkthrough

Let's trace through `n = 213` to build intuition. We'll count how many times `1` appears in each digit position (ones, tens, hundreds) across all numbers from 1 to 213.

**For the ones place (10⁰ position):**

- Pattern repeats every 10 numbers: 1 appears once in numbers ending with 1
- For 213: We have 21 complete cycles of 0-9 (numbers 1-209) plus numbers 210-213
- Each complete cycle contributes 1 occurrence per cycle × 21 cycles = 21 ones
- In the partial cycle (210-213): 211 has a 1 in ones place → +1
- Total for ones place: 21 + 1 = 22

**For the tens place (10¹ position):**

- Pattern repeats every 100 numbers: 1 appears 10 times in each block (10-19)
- For 213: We have 2 complete cycles of 0-99 (numbers 1-199) plus numbers 200-213
- Each complete cycle contributes 10 occurrences per cycle × 2 cycles = 20 ones
- In the partial cycle (200-213): Numbers 210-213 have 1 in tens place? Let's check:
  - 210: tens digit is 1 → +1
  - 211: tens digit is 1 → +1
  - 212: tens digit is 1 → +1
  - 213: tens digit is 1 → +1
  - Total: 4 ones
- Total for tens place: 20 + 4 = 24

**For the hundreds place (10² position):**

- Pattern repeats every 1000 numbers: 1 appears 100 times in each block (100-199)
- For 213: We have 0 complete cycles of 0-999
- In the partial cycle (1-213): Numbers 100-199 all have 1 in hundreds place
  - That's 100 numbers (100 to 199 inclusive)
  - But we only go up to 213, so all 100 count
- Total for hundreds place: 100

**Final total:** 22 + 24 + 100 = 146

This manual calculation reveals the pattern we need to formalize.

## Brute Force Approach

The brute force solution iterates through every number from 1 to `n`, converts each to a string, and counts the `1`s. While simple to implement, this approach is far too slow for large `n` (up to 2³¹ - 1 ≈ 2.1 billion).

<div class="code-group">

```python
# Time: O(n × log₁₀(n)) | Space: O(log₁₀(n)) for string conversion
def countDigitOne_brute(n: int) -> int:
    count = 0
    for i in range(1, n + 1):
        # Convert to string and count '1' characters
        count += str(i).count('1')
    return count
```

```javascript
// Time: O(n × log₁₀(n)) | Space: O(log₁₀(n)) for string conversion
function countDigitOneBrute(n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    // Convert to string and count '1' characters
    count += (i.toString().match(/1/g) || []).length;
  }
  return count;
}
```

```java
// Time: O(n × log₁₀(n)) | Space: O(log₁₀(n)) for string conversion
public int countDigitOneBrute(int n) {
    int count = 0;
    for (int i = 1; i <= n; i++) {
        String s = Integer.toString(i);
        for (char c : s.toCharArray()) {
            if (c == '1') {
                count++;
            }
        }
    }
    return count;
}
```

</div>

**Why it's too slow:** For `n = 10⁹`, we'd need to process about 10⁹ numbers, each requiring string conversion and character counting. At 1 microsecond per number (optimistic), this would take 1000 seconds — far too long for interview constraints.

## Optimized Approach

The key insight is that we don't need to examine every number individually. Instead, we can count how many times `1` appears at each digit position (ones, tens, hundreds, etc.) using a mathematical formula.

For a given digit position represented by `factor = 10^k` (where k = 0 for ones, 1 for tens, etc.):

- **Complete cycles:** `n // (factor * 10)` tells us how many complete cycles of 0-9, 0-99, etc. we've passed
- **Current digit:** `(n // factor) % 10` gives us the digit at the current position
- **Remainder:** `n % factor` gives us the remaining part after the current position

The formula for contributions at position `factor` is:

```
count = (n // (factor * 10)) * factor + min(max((n % (factor * 10)) - factor + 1, 0), factor)
```

Let's break this down:

1. **First term:** `(n // (factor * 10)) * factor`
   - Counts complete cycles before the current digit
   - Each complete cycle contributes `factor` ones at this position
2. **Second term:** `min(max((n % (factor * 10)) - factor + 1, 0), factor)`
   - Handles the partial cycle
   - `(n % (factor * 10))` gives us the last `k+1` digits
   - Subtract `factor` to see how many numbers in the current block have `1` at this position
   - The `max(..., 0)` ensures we don't go negative if we're before the block
   - The `min(..., factor)` caps at `factor` (the maximum possible in one block)

## Optimal Solution

Here's the implementation using the digit-by-digit counting approach:

<div class="code-group">

```python
# Time: O(log₁₀(n)) | Space: O(1)
def countDigitOne(n: int) -> int:
    """
    Count total number of digit 1 appearing in all non-negative integers ≤ n.

    The key insight: count contributions from each digit position separately.
    For each position (ones, tens, hundreds...), we calculate how many times
    '1' appears at that position across all numbers from 1 to n.
    """
    if n <= 0:
        return 0

    count = 0
    factor = 1  # Represents current digit position: 1=ones, 10=tens, 100=hundreds...

    while factor <= n:
        # Calculate the divisor for the next higher position
        higher = factor * 10

        # Count complete cycles before current digit
        # Each complete cycle contributes 'factor' ones at current position
        complete_cycles = n // higher
        count += complete_cycles * factor

        # Handle the partial (incomplete) cycle
        # Get the remainder after removing complete cycles
        remainder = n % higher

        # How many numbers in current block have '1' at current position?
        # We subtract (factor - 1) to count from the start of the block
        # The max(..., 0) ensures we don't count negative if remainder < factor
        # The min(..., factor) caps at 'factor' (max possible in one block)
        count += max(min(remainder - factor + 1, factor), 0)

        # Move to next digit position
        factor = higher

    return count
```

```javascript
// Time: O(log₁₀(n)) | Space: O(1)
function countDigitOne(n) {
  /**
   * Count total number of digit 1 appearing in all non-negative integers ≤ n.
   *
   * The key insight: count contributions from each digit position separately.
   * For each position (ones, tens, hundreds...), we calculate how many times
   * '1' appears at that position across all numbers from 1 to n.
   */
  if (n <= 0) return 0;

  let count = 0;
  let factor = 1; // Represents current digit position: 1=ones, 10=tens, 100=hundreds...

  while (factor <= n) {
    // Calculate the divisor for the next higher position
    const higher = factor * 10;

    // Count complete cycles before current digit
    // Each complete cycle contributes 'factor' ones at current position
    const completeCycles = Math.floor(n / higher);
    count += completeCycles * factor;

    // Handle the partial (incomplete) cycle
    // Get the remainder after removing complete cycles
    const remainder = n % higher;

    // How many numbers in current block have '1' at current position?
    // We subtract (factor - 1) to count from the start of the block
    // The Math.max(..., 0) ensures we don't count negative if remainder < factor
    // The Math.min(..., factor) caps at 'factor' (max possible in one block)
    count += Math.max(Math.min(remainder - factor + 1, factor), 0);

    // Move to next digit position
    factor = higher;
  }

  return count;
}
```

```java
// Time: O(log₁₀(n)) | Space: O(1)
public int countDigitOne(int n) {
    /**
     * Count total number of digit 1 appearing in all non-negative integers ≤ n.
     *
     * The key insight: count contributions from each digit position separately.
     * For each position (ones, tens, hundreds...), we calculate how many times
     * '1' appears at that position across all numbers from 1 to n.
     */
    if (n <= 0) return 0;

    long count = 0;  // Use long to avoid overflow for large n
    long factor = 1;  // Represents current digit position: 1=ones, 10=tens, 100=hundreds...

    while (factor <= n) {
        // Calculate the divisor for the next higher position
        long higher = factor * 10;

        // Count complete cycles before current digit
        // Each complete cycle contributes 'factor' ones at current position
        long completeCycles = n / higher;
        count += completeCycles * factor;

        // Handle the partial (incomplete) cycle
        // Get the remainder after removing complete cycles
        long remainder = n % higher;

        // How many numbers in current block have '1' at current position?
        // We subtract (factor - 1) to count from the start of the block
        // The Math.max ensures we don't count negative if remainder < factor
        // The Math.min caps at 'factor' (max possible in one block)
        count += Math.max(Math.min(remainder - factor + 1, factor), 0);

        // Move to next digit position
        factor = higher;
    }

    return (int) count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log₁₀(n))

- The while loop runs once for each digit position in `n`
- Since we multiply `factor` by 10 each iteration, we do log₁₀(n) iterations
- For example: n = 1,000,000 has 7 digits → 7 iterations

**Space Complexity:** O(1)

- We only use a constant amount of extra space (count, factor, and temporary variables)
- No data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in the partial cycle calculation:** The formula `remainder - factor + 1` is tricky. When `remainder < factor`, this becomes negative. Always use `max(..., 0)` to handle this case. Test with n = 10, 11, 19, 20 to catch these errors.

2. **Integer overflow for large n:** In Java, using `int` for intermediate calculations can overflow when `factor * 10` exceeds 2³¹-1. Always use `long` for intermediate calculations when dealing with large numbers.

3. **Forgetting to handle n = 0:** The problem says "non-negative integers less than or equal to n," which includes 0. Our formula works for n ≥ 1, so we need an explicit check for n ≤ 0.

4. **Misunderstanding the digit position logic:** Some candidates try to extract digits by converting to string, which defeats the purpose of the mathematical approach. Remember: `(n // factor) % 10` gives the digit at position `factor` without string conversion.

## When You'll See This Pattern

This digit-by-digit counting pattern appears in several related problems:

1. **Factorial Trailing Zeroes (LeetCode 172):** Counts how many times 10 divides n!, which reduces to counting factors of 5. Similar digit-position thinking but for prime factors.

2. **Digit Count in Range (LeetCode 1067):** Generalizes this problem to count any digit (0-9) in a range [low, high]. Uses the same digit-position approach with range subtraction.

3. **Number of 2s (Cracking the Coding Interview 17.6):** Exactly the same pattern but counting digit 2 instead of 1.

The core technique is recognizing that for digit counting problems, we can process each digit position independently and use mathematical formulas rather than iteration.

## Key Takeaways

1. **Digit-position decomposition:** When counting digits across ranges, break the problem down by digit position (ones, tens, hundreds...). Each position follows a predictable pattern that repeats every power of 10.

2. **Mathematical formulas beat iteration:** For problems with large input ranges (up to billions), look for mathematical patterns that let you compute results directly rather than iterating through all values.

3. **Test with edge cases:** Always test with n = 0, n = 1, n = 9, n = 10, n = 11, n = 99, n = 100, n = 101. These reveal most off-by-one errors in the partial cycle calculation.

Related problems: [Factorial Trailing Zeroes](/problem/factorial-trailing-zeroes), [Digit Count in Range](/problem/digit-count-in-range)
