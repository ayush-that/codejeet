---
title: "How to Solve Count Odd Numbers in an Interval Range — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Odd Numbers in an Interval Range. Easy difficulty, 54.4% acceptance rate. Topics: Math."
date: "2027-04-15"
category: "dsa-patterns"
tags: ["count-odd-numbers-in-an-interval-range", "math", "easy"]
---

# How to Solve Count Odd Numbers in an Interval Range

At first glance, this problem seems trivial: count the odd numbers between `low` and `high` inclusive. However, the challenge lies in finding an efficient mathematical solution rather than brute force iteration. The interesting part is recognizing the pattern in how odd numbers are distributed across intervals with different starting points. This problem tests your ability to move from an obvious O(n) solution to an elegant O(1) mathematical formula.

## Visual Walkthrough

Let's trace through a few examples to build intuition:

**Example 1: low = 3, high = 7**
Numbers: 3, 4, 5, 6, 7
Odd numbers: 3, 5, 7 → 3 odds
Pattern: Both ends are odd, so we have (7-3)/2 + 1 = 4/2 + 1 = 2 + 1 = 3

**Example 2: low = 8, high = 10**
Numbers: 8, 9, 10
Odd numbers: 9 → 1 odd
Pattern: First odd is 9, last is 9 (same), so we have (10-8)/2 = 2/2 = 1

**Example 3: low = 0, high = 10**
Numbers: 0 through 10
Odd numbers: 1, 3, 5, 7, 9 → 5 odds
Pattern: First odd is 1, last is 9, so we have (10-0)/2 = 10/2 = 5

Notice the pattern: when both `low` and `high` are odd, we get one extra odd number compared to when they're even. Let's derive the formula:

1. The total numbers in range = `high - low + 1`
2. Half of these (rounded down) would be odd if the range started with an odd number
3. But we need to adjust based on whether the first number is odd or not

The key insight: Count = `(high - low + 1) // 2` plus an adjustment if either endpoint is odd.

## Brute Force Approach

The most straightforward solution is to iterate through all numbers from `low` to `high` and count how many are odd:

<div class="code-group">

```python
# Time: O(n) where n = high - low + 1
# Space: O(1)
def countOddsBrute(low: int, high: int) -> int:
    count = 0
    # Iterate through all numbers in the range
    for num in range(low, high + 1):
        # Check if number is odd using modulo
        if num % 2 == 1:
            count += 1
    return count
```

```javascript
// Time: O(n) where n = high - low + 1
// Space: O(1)
function countOddsBrute(low, high) {
  let count = 0;
  // Iterate through all numbers in the range
  for (let num = low; num <= high; num++) {
    // Check if number is odd using modulo
    if (num % 2 === 1) {
      count++;
    }
  }
  return count;
}
```

```java
// Time: O(n) where n = high - low + 1
// Space: O(1)
public int countOddsBrute(int low, int high) {
    int count = 0;
    // Iterate through all numbers in the range
    for (int num = low; num <= high; num++) {
        // Check if number is odd using modulo
        if (num % 2 == 1) {
            count++;
        }
    }
    return count;
}
```

</div>

**Why this isn't optimal:** While this works correctly, it's inefficient for large ranges. If `low = 0` and `high = 10^9`, we'd need to iterate through a billion numbers! The problem constraints (0 ≤ low ≤ high ≤ 10^9) make the O(n) solution potentially too slow. We need a mathematical formula that works in O(1) time.

## Optimal Solution

The optimal solution uses a mathematical formula derived from observing the pattern of odd numbers. Here's the reasoning:

1. **Total numbers in range**: `high - low + 1`
2. **Base odd count**: Approximately half of these, which is `(high - low + 1) // 2`
3. **Adjustment needed**: If the range starts with an odd number, we need to add 1 more odd to the count

But wait, let's think more carefully. Actually, the formula is simpler: if both `low` and `high` are even, then the count is exactly `(high - low) // 2`. Otherwise, it's `(high - low) // 2 + 1`.

Even simpler: The count is `(high + 1) // 2 - low // 2`. Let's see why this works:

- `(high + 1) // 2` counts odd numbers from 1 to `high`
- `low // 2` counts odd numbers from 1 to `low - 1`
- Subtracting gives us odd numbers from `low` to `high`

Here's the implementation:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def countOdds(low: int, high: int) -> int:
    """
    Count odd numbers between low and high (inclusive).

    Formula: (high + 1) // 2 - low // 2

    Explanation:
    - (high + 1) // 2 gives count of odd numbers from 1 to high
    - low // 2 gives count of odd numbers from 1 to (low - 1)
    - Subtracting gives count of odd numbers from low to high
    """
    # Calculate odd count using mathematical formula
    return (high + 1) // 2 - low // 2
```

```javascript
// Time: O(1) | Space: O(1)
function countOdds(low, high) {
  /**
   * Count odd numbers between low and high (inclusive).
   *
   * Formula: Math.floor((high + 1) / 2) - Math.floor(low / 2)
   *
   * Explanation:
   * - Math.floor((high + 1) / 2) gives count of odd numbers from 1 to high
   * - Math.floor(low / 2) gives count of odd numbers from 1 to (low - 1)
   * - Subtracting gives count of odd numbers from low to high
   */
  // Calculate odd count using mathematical formula
  return Math.floor((high + 1) / 2) - Math.floor(low / 2);
}
```

```java
// Time: O(1) | Space: O(1)
public int countOdds(int low, int high) {
    /**
     * Count odd numbers between low and high (inclusive).
     *
     * Formula: (high + 1) / 2 - low / 2
     *
     * Explanation:
     * - (high + 1) / 2 gives count of odd numbers from 1 to high
     * - low / 2 gives count of odd numbers from 1 to (low - 1)
     * - Subtracting gives count of odd numbers from low to high
     */
    // Calculate odd count using mathematical formula
    // Note: Integer division automatically floors the result
    return (high + 1) / 2 - low / 2;
}
```

</div>

**Alternative formula approach:** Some people find this version more intuitive:

<div class="code-group">

```python
def countOddsAlternative(low: int, high: int) -> int:
    # Count of numbers in the range
    total_numbers = high - low + 1

    # If total count is even, exactly half are odd
    if total_numbers % 2 == 0:
        return total_numbers // 2

    # If total count is odd, check if low is odd
    # If low is odd, we have one more odd than even
    return total_numbers // 2 + (1 if low % 2 == 1 else 0)
```

```javascript
function countOddsAlternative(low, high) {
  // Count of numbers in the range
  const totalNumbers = high - low + 1;

  // If total count is even, exactly half are odd
  if (totalNumbers % 2 === 0) {
    return totalNumbers / 2;
  }

  // If total count is odd, check if low is odd
  // If low is odd, we have one more odd than even
  return Math.floor(totalNumbers / 2) + (low % 2 === 1 ? 1 : 0);
}
```

```java
public int countOddsAlternative(int low, int high) {
    // Count of numbers in the range
    int totalNumbers = high - low + 1;

    // If total count is even, exactly half are odd
    if (totalNumbers % 2 == 0) {
        return totalNumbers / 2;
    }

    // If total count is odd, check if low is odd
    // If low is odd, we have one more odd than even
    return totalNumbers / 2 + (low % 2 == 1 ? 1 : 0);
}
```

</div>

Both approaches are O(1) and work correctly. The first formula `(high + 1) // 2 - low // 2` is more elegant and directly computes the result without conditional logic.

## Complexity Analysis

**Time Complexity: O(1)**

- The mathematical formula performs a constant number of arithmetic operations
- No iteration through the range is needed
- Execution time doesn't depend on the size of the input range

**Space Complexity: O(1)**

- We only use a few integer variables
- No additional data structures are created
- Memory usage is constant regardless of input size

## Common Mistakes

1. **Off-by-one errors with range inclusion**: Forgetting that the range is inclusive of both `low` and `high`. A common mistake is using `range(low, high)` in Python or `for (num = low; num < high; num++)` in JavaScript/Java, which excludes `high`.

2. **Integer overflow with large numbers**: While not an issue in Python (which has arbitrary precision integers), in Java and JavaScript, using formulas like `(high - low + 1)` could theoretically overflow with extremely large numbers, though the constraints make this unlikely.

3. **Incorrect formula derivation**: Many candidates try to use `(high - low) // 2` and then add various adjustments. The most reliable approach is to derive and test the formula systematically:
   - Test case 1: low=3, high=7 → should return 3
   - Test case 2: low=8, high=10 → should return 1
   - Test case 3: low=0, high=0 → should return 0
   - Test case 4: low=1, high=1 → should return 1

4. **Forgetting to handle the zero case**: When `low = 0`, some formulas might give incorrect results. Always test with `low = 0` and `high = 0` (should return 0) and `low = 0`, `high = 1` (should return 1).

## When You'll See This Pattern

This problem teaches the important pattern of **mathematical optimization for sequence counting problems**. Instead of iterating through elements, you find a formula that directly computes the result. You'll see similar patterns in:

1. **Count Primes (LeetCode 204)**: While more complex, it also involves counting numbers with specific properties in a range, though it requires sieve algorithms rather than simple formulas.

2. **Sum of All Odd Length Subarrays (LeetCode 1588)**: This involves mathematical formulas for counting how many times each element appears in odd-length subarrays.

3. **Check if Bitwise OR Has Trailing Zeros (LeetCode 2980)**: This problem also involves parity checking and mathematical reasoning about binary representations.

4. **Bulb Switcher (LeetCode 319)**: Another math-based counting problem where the optimal solution is a simple formula rather than simulation.

The key insight across these problems is recognizing when you can replace iteration with mathematical reasoning.

## Key Takeaways

1. **Always look for mathematical patterns before coding**: For problems involving counting or sequences, pause to see if there's a formula. Ask yourself: "Is there a pattern I can express mathematically?"

2. **Test your formula with edge cases**: Before finalizing your solution, test with:
   - Minimum range (low = high)
   - Range starting at 0
   - Both endpoints even
   - Both endpoints odd
   - One even, one odd

3. **Understand why the formula works**: Don't just memorize `(high + 1) // 2 - low // 2`. Understand that:
   - `(high + 1) // 2` counts odds from 1 to high
   - `low // 2` counts odds from 1 to low-1
   - The difference gives odds from low to high

This problem may seem simple, but it's an excellent example of how interviewers test your ability to optimize beyond the obvious solution. Recognizing when to use mathematical formulas instead of iteration is a valuable skill for coding interviews.

Related problems: [Check if Bitwise OR Has Trailing Zeros](/problem/check-if-bitwise-or-has-trailing-zeros)
