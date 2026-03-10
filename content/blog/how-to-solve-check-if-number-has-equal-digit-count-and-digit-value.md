---
title: "How to Solve Check if Number Has Equal Digit Count and Digit Value — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Number Has Equal Digit Count and Digit Value. Easy difficulty, 73.1% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-10-16"
category: "dsa-patterns"
tags:
  [
    "check-if-number-has-equal-digit-count-and-digit-value",
    "hash-table",
    "string",
    "counting",
    "easy",
  ]
---

# How to Solve "Check if Number Has Equal Digit Count and Digit Value"

This problem asks us to verify whether a digit string follows a specific self-referential rule: for every index `i` (which is also a digit), the digit `i` must appear exactly `num[i]` times in the string. The challenge lies in efficiently counting digit frequencies and comparing them against the digit values at each position.

## Visual Walkthrough

Let's trace through an example: `num = "1210"`

**Step 1: Understand the rule**

- At index 0 (digit '0'): digit 0 should appear `num[0] = '1'` times → check if '0' appears once
- At index 1 (digit '1'): digit 1 should appear `num[1] = '2'` times → check if '1' appears twice
- At index 2 (digit '2'): digit 2 should appear `num[2] = '1'` time → check if '2' appears once
- At index 3 (digit '3'): digit 3 should appear `num[3] = '0'` times → check if '3' appears zero times

**Step 2: Count actual frequencies**

- '0' appears 1 time ✓
- '1' appears 2 times ✓
- '2' appears 1 time ✓
- '3' appears 0 times ✓

All conditions are satisfied, so `"1210"` returns `true`.

Now try `num = "030"`:

- Index 0: digit 0 should appear `num[0] = '0'` times → '0' appears 2 times ✗
- Already fails at first check, so return `false`.

## Brute Force Approach

A naive approach would be: for each index `i`, count how many times digit `i` appears in the string, then compare that count to `num[i]`. This requires scanning the entire string for each index.

**Why this is inefficient:**

- For a string of length `n`, we'd scan the string `n` times
- Time complexity: O(n²) where n is the string length
- Space complexity: O(1) for the counter

While this would technically work (and might even pass for small inputs), it's inefficient. The key insight is that we only need to count each digit's frequency **once**, then compare those counts against the expected values.

## Optimal Solution

The optimal approach uses a frequency counter:

1. Count how many times each digit (0-9) appears in the string
2. For each index `i` (0 to n-1), compare the count of digit `i` with the integer value of `num[i]`
3. If all comparisons match, return `true`; otherwise `false`

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - fixed size array of 10 elements
def digitCount(num: str) -> bool:
    # Step 1: Count frequency of each digit (0-9)
    # We use a fixed-size array since digits are only 0-9
    freq = [0] * 10

    # Count each digit in the string
    for digit_char in num:
        digit = int(digit_char)  # Convert char to integer
        freq[digit] += 1

    # Step 2: Verify the condition for each index
    # For index i, digit i should appear num[i] times
    for i in range(len(num)):
        expected_count = int(num[i])  # Convert char at position i to integer
        actual_count = freq[i]  # Get count of digit i from frequency array

        # If counts don't match, condition fails
        if actual_count != expected_count:
            return False

    # All conditions satisfied
    return True
```

```javascript
// Time: O(n) | Space: O(1) - fixed size array of 10 elements
function digitCount(num) {
  // Step 1: Count frequency of each digit (0-9)
  // Use array of size 10 since digits are only 0-9
  const freq = new Array(10).fill(0);

  // Count each digit in the string
  for (let i = 0; i < num.length; i++) {
    const digit = parseInt(num[i]); // Convert char to integer
    freq[digit]++; // Increment count for this digit
  }

  // Step 2: Verify the condition for each index
  // For index i, digit i should appear num[i] times
  for (let i = 0; i < num.length; i++) {
    const expectedCount = parseInt(num[i]); // Convert char at position i to integer
    const actualCount = freq[i]; // Get count of digit i from frequency array

    // If counts don't match, condition fails
    if (actualCount !== expectedCount) {
      return false;
    }
  }

  // All conditions satisfied
  return true;
}
```

```java
// Time: O(n) | Space: O(1) - fixed size array of 10 elements
class Solution {
    public boolean digitCount(String num) {
        // Step 1: Count frequency of each digit (0-9)
        // Use array of size 10 since digits are only 0-9
        int[] freq = new int[10];

        // Count each digit in the string
        for (int i = 0; i < num.length(); i++) {
            char digitChar = num.charAt(i);
            int digit = digitChar - '0';  // Convert char to integer
            freq[digit]++;  // Increment count for this digit
        }

        // Step 2: Verify the condition for each index
        // For index i, digit i should appear num[i] times
        for (int i = 0; i < num.length(); i++) {
            char expectedChar = num.charAt(i);
            int expectedCount = expectedChar - '0';  // Convert char at position i to integer
            int actualCount = freq[i];  // Get count of digit i from frequency array

            // If counts don't match, condition fails
            if (actualCount != expectedCount) {
                return false;
            }
        }

        // All conditions satisfied
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one to count frequencies (O(n)), and one to verify conditions (O(n))
- The total is O(n) + O(n) = O(2n) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size array of 10 integers to store digit frequencies
- This is constant space regardless of input size
- Even if we used a hash map, the maximum number of keys would be 10 (digits 0-9), so it's still O(1)

## Common Mistakes

1. **Not converting characters to integers**: Forgetting that `num[i]` returns a character, not an integer. In Python, `'5' != 5`. You must use `int(num[i])` or equivalent in other languages.

2. **Checking beyond digit 9**: The problem only considers digits 0-9, but some candidates try to check indices beyond 9. Since we're counting digit frequencies, and digits are only 0-9, we only need to check indices 0-9. However, the input string can be longer than 10 characters, so we only check indices up to `len(num)-1`.

3. **Using the wrong index for comparison**: Confusing which digit's frequency to check. Remember: at index `i`, we check the frequency of digit `i` (not the digit at position `i`).

4. **Early termination without checking all indices**: Some candidates return `true` as soon as they find one matching condition, but we need **all** conditions to be satisfied.

## When You'll See This Pattern

This problem uses **frequency counting with fixed bounds**, a common pattern in string and array problems:

1. **First Unique Character in a String (LeetCode 387)**: Uses frequency counting to find the first character with count 1.
2. **Valid Anagram (LeetCode 242)**: Compares frequency counts of two strings to check if they're anagrams.
3. **Find All Anagrams in a String (LeetCode 438)**: Uses sliding window with frequency counting to find all anagram substrings.

The key insight is recognizing when you can use a fixed-size array instead of a hash map because the possible keys are limited and known in advance (like digits 0-9 or lowercase letters a-z).

## Key Takeaways

1. **Fixed-bound frequency counting**: When the domain of possible values is small and known (like digits 0-9 or letters a-z), use a fixed-size array instead of a hash map for better performance and simpler code.

2. **Self-referential validation problems**: This problem belongs to a class of problems where you need to verify that data follows a rule that references itself. Always look for opportunities to precompute values (like frequencies) to avoid redundant calculations.

3. **Character-to-integer conversion**: Remember that string digits are characters, not numbers. You need explicit conversion (`int()`, `parseInt()`, or `char - '0'`) to use them numerically.

Related problems: [Self Dividing Numbers](/problem/self-dividing-numbers)
