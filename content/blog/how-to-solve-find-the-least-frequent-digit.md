---
title: "How to Solve Find The Least Frequent Digit — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find The Least Frequent Digit. Easy difficulty, 69.7% acceptance rate. Topics: Array, Hash Table, Math, Counting."
date: "2028-10-28"
category: "dsa-patterns"
tags: ["find-the-least-frequent-digit", "array", "hash-table", "math", "easy"]
---

# How to Solve "Find The Least Frequent Digit"

This problem asks us to find the digit that appears least frequently in the decimal representation of a given integer `n`. If multiple digits share the same minimum frequency, we return the smallest digit. While the problem is conceptually straightforward, it requires careful handling of digit counting, frequency comparison, and tie-breaking rules—common pitfalls in interview settings.

**What makes this interesting:** The challenge isn't algorithmic complexity but rather clean implementation. You need to handle zero digits correctly, compare frequencies properly, and implement the tie-breaking logic without errors. Many candidates stumble on edge cases like `n = 0` or numbers with all digits appearing once.

## Visual Walkthrough

Let's trace through `n = 133779` step by step:

1. **Convert to string for digit access**: `"133779"`
2. **Count digit frequencies**:
   - '1': appears 1 time
   - '3': appears 2 times
   - '7': appears 2 times
   - '9': appears 1 time
   - Digits 0, 2, 4, 5, 6, 8: appear 0 times
3. **Find minimum frequency**: The smallest frequency is 0 (for digits that don't appear)
4. **Handle tie-breaking**: Multiple digits have frequency 0: 0, 2, 4, 5, 6, 8
5. **Return smallest digit**: Among these, 0 is the smallest
6. **Result**: Return `0`

Now let's try `n = 112233`:

- '1': 2 times, '2': 2 times, '3': 2 times, others: 0 times
- Minimum frequency is 0
- Digits with frequency 0: 0, 4, 5, 6, 7, 8, 9
- Smallest is 0
- Result: `0`

For `n = 9876543210`:

- All digits 0-9 appear exactly once
- Minimum frequency is 1
- All digits have frequency 1
- Smallest digit is 0
- Result: `0`

## Brute Force Approach

A naive approach might involve:

1. Converting the number to a string
2. For each digit 0-9, count how many times it appears by scanning the entire string
3. Track the minimum frequency and corresponding digit

This approach is inefficient because for each of the 10 digits, we scan the entire string of length d (where d is the number of digits in n). This gives us O(10 × d) = O(d) time complexity, which is actually acceptable since d ≤ 10 for 32-bit integers. However, it's still suboptimal because we can count all digits in a single pass.

The real "brute force" mistake would be to use nested loops unnecessarily or to forget about digits that don't appear at all. Some candidates might try to solve this mathematically without converting to a string, which complicates digit extraction unnecessarily.

## Optimal Solution

The optimal approach uses a single pass to count all digit frequencies, then finds the digit with minimum frequency (with tie-breaking for smallest digit). We'll use an array of size 10 to store counts for digits 0-9.

**Key insights:**

1. Convert the number to a string or extract digits mathematically to count frequencies
2. Use an array where index represents the digit and value represents its count
3. Handle negative numbers by taking the absolute value (or check constraints—typically n ≥ 0)
4. Special case: n = 0 has one digit '0' with frequency 1

<div class="code-group">

```python
# Time: O(d) where d is number of digits in n | Space: O(1) for fixed-size count array
def leastFrequentDigit(n: int) -> int:
    # Handle negative numbers by taking absolute value
    # Problem states n is an integer, but frequency is based on decimal representation
    # which is the same for n and -n (except for the minus sign)
    n = abs(n)

    # Initialize count array for digits 0-9
    # Index represents digit, value represents frequency
    count = [0] * 10

    # Special case: if n is 0, we have one digit '0'
    if n == 0:
        return 0

    # Count digit frequencies
    # We process digits from right to left using modulo and division
    while n > 0:
        digit = n % 10  # Extract last digit
        count[digit] += 1  # Increment count for this digit
        n //= 10  # Remove last digit

    # Find digit with minimum frequency
    min_freq = float('inf')  # Start with very large number
    result_digit = -1

    # Check digits 0-9 in increasing order
    # This ensures we get smallest digit when frequencies are equal
    for digit in range(10):
        # If this digit has smaller frequency than current minimum
        # OR if frequencies are equal but this digit is smaller
        if count[digit] < min_freq:
            min_freq = count[digit]
            result_digit = digit

    return result_digit
```

```javascript
// Time: O(d) where d is number of digits in n | Space: O(1) for fixed-size count array
function leastFrequentDigit(n) {
  // Handle negative numbers by taking absolute value
  n = Math.abs(n);

  // Initialize count array for digits 0-9
  // Index represents digit, value represents frequency
  const count = new Array(10).fill(0);

  // Special case: if n is 0, we have one digit '0'
  if (n === 0) {
    return 0;
  }

  // Count digit frequencies
  // We process digits from right to left using modulo and division
  while (n > 0) {
    const digit = n % 10; // Extract last digit
    count[digit]++; // Increment count for this digit
    n = Math.floor(n / 10); // Remove last digit
  }

  // Find digit with minimum frequency
  let minFreq = Infinity; // Start with very large number
  let resultDigit = -1;

  // Check digits 0-9 in increasing order
  // This ensures we get smallest digit when frequencies are equal
  for (let digit = 0; digit < 10; digit++) {
    // If this digit has smaller frequency than current minimum
    if (count[digit] < minFreq) {
      minFreq = count[digit];
      resultDigit = digit;
    }
  }

  return resultDigit;
}
```

```java
// Time: O(d) where d is number of digits in n | Space: O(1) for fixed-size count array
public int leastFrequentDigit(int n) {
    // Handle negative numbers by taking absolute value
    n = Math.abs(n);

    // Initialize count array for digits 0-9
    // Index represents digit, value represents frequency
    int[] count = new int[10];

    // Special case: if n is 0, we have one digit '0'
    if (n == 0) {
        return 0;
    }

    // Count digit frequencies
    // We process digits from right to left using modulo and division
    while (n > 0) {
        int digit = n % 10;  // Extract last digit
        count[digit]++;      // Increment count for this digit
        n /= 10;             // Remove last digit
    }

    // Find digit with minimum frequency
    int minFreq = Integer.MAX_VALUE;  // Start with very large number
    int resultDigit = -1;

    // Check digits 0-9 in increasing order
    // This ensures we get smallest digit when frequencies are equal
    for (int digit = 0; digit < 10; digit++) {
        // If this digit has smaller frequency than current minimum
        if (count[digit] < minFreq) {
            minFreq = count[digit];
            resultDigit = digit;
        }
    }

    return resultDigit;
}
```

</div>

**Alternative string-based approach:** Some candidates prefer converting to a string first, which can be more intuitive:

```python
def leastFrequentDigit(n):
    n_str = str(abs(n))
    count = [0] * 10

    for ch in n_str:
        digit = int(ch)
        count[digit] += 1

    # Handle the case when n is 0
    if len(n_str) == 1 and n_str[0] == '0':
        return 0

    min_freq = float('inf')
    result = -1

    for digit in range(10):
        if count[digit] < min_freq:
            min_freq = count[digit]
            result = digit

    return result
```

The mathematical approach (using modulo) is generally preferred in interviews because it demonstrates understanding of number manipulation and avoids string conversion overhead.

## Complexity Analysis

**Time Complexity: O(d)**

- Where d is the number of digits in the input number n
- We process each digit exactly once when counting (O(d))
- We then check 10 digits to find the minimum (O(10) = O(1))
- Total: O(d + 10) = O(d)

**Space Complexity: O(1)**

- We use a fixed-size array of length 10 to store digit counts
- This doesn't grow with input size, so it's constant space
- Additional variables use constant space

For a 32-bit integer, d ≤ 10 (since 2³¹ ≈ 2.1 billion has 10 digits), so both time and space are effectively constant. However, we still express complexity in terms of d for correctness with arbitrary-sized integers.

## Common Mistakes

1. **Forgetting digits that don't appear**: The most common error is only considering digits that appear in the number. Digits with frequency 0 are valid candidates! If no digit appears, the minimum frequency is 0, and the smallest digit with frequency 0 is 0.

2. **Incorrect tie-breaking**: When multiple digits have the same minimum frequency, you must return the smallest digit. Some candidates return the first one they encounter, which depends on iteration order. Always iterate from 0 to 9 to ensure you get the smallest.

3. **Handling n = 0 incorrectly**: When n = 0, it has one digit '0' with frequency 1. Some implementations might skip the counting loop (since n > 0 is false) and return -1 or incorrect result. Always handle this special case.

4. **Negative number handling**: The problem says "integer n" but doesn't specify non-negative. The decimal representation of -123 is "123" (ignoring the minus sign), so we should use `abs(n)`. Forgetting this could cause infinite loops (if using n > 0 condition) or incorrect string conversion.

## When You'll See This Pattern

This problem uses **frequency counting with fixed-range keys**, a pattern that appears in many coding problems:

1. **First Unique Character in a String (LeetCode 387)**: Similar frequency counting, but looking for count = 1 instead of minimum count.

2. **Sort Characters By Frequency (LeetCode 451)**: Count character frequencies, then sort by frequency—more complex version of frequency analysis.

3. **Find Common Characters (LeetCode 1002)**: Multiple frequency arrays to find minimum frequencies across multiple strings.

4. **Maximum Number of Balloons (LeetCode 1189)**: Count character frequencies and find the limiting factor based on character requirements.

The core pattern: when you need to analyze frequency of items from a known, small set (digits 0-9, letters a-z, etc.), use an array where the index represents the item and the value represents its count.

## Key Takeaways

1. **Fixed-range frequency counting**: When counting frequencies of items from a known small set (like digits 0-9 or letters a-z), use an array instead of a hash map for simplicity and efficiency.

2. **Consider all possibilities**: Don't just analyze what's present—consider the entire domain. For digit frequency problems, always check digits 0-9, not just those appearing in the input.

3. **Tie-breaking requires careful iteration order**: When multiple items satisfy a condition and you need the smallest/largest, control your iteration order (0 to 9 for smallest, 9 to 0 for largest).

Remember: The "easy" problems test your attention to detail and edge cases as much as your algorithmic thinking.

[Practice this problem on CodeJeet](/problem/find-the-least-frequent-digit)
