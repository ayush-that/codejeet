---
title: "How to Solve Percentage of Letter in String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Percentage of Letter in String. Easy difficulty, 75.1% acceptance rate. Topics: String."
date: "2027-06-28"
category: "dsa-patterns"
tags: ["percentage-of-letter-in-string", "string", "easy"]
---

# How to Solve Percentage of Letter in String

This problem asks us to calculate what percentage of characters in a given string match a specific letter, then round down to the nearest whole percent. While conceptually straightforward, it tests your ability to work with strings, count occurrences, and handle integer division with proper rounding. The "rounded down" requirement is what makes this problem interesting—it's easy to accidentally round incorrectly or use floating-point arithmetic when integer operations would suffice.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `s = "foobar"`
- `letter = "o"`

**Step 1: Count matching characters**
We examine each character in "foobar":

- f ≠ o → no match
- o = o → match (count = 1)
- o = o → match (count = 2)
- b ≠ o → no match
- a ≠ o → no match
- r ≠ o → no match

Total matches = 2

**Step 2: Calculate percentage**
Total characters = 6
Percentage = (2 / 6) × 100 = 33.333...%

**Step 3: Round down**
We take the floor of 33.333... → 33%

**Step 4: Return as integer**
Return 33

The key insight is that we can compute this entirely with integer arithmetic: `(count * 100) // length` gives us the floor of the percentage without any floating-point operations.

## Brute Force Approach

For this problem, there's really only one reasonable approach: iterate through the string once and count occurrences of the target letter. Any "brute force" approach would essentially be the same as the optimal solution since we must examine every character at least once to get an accurate count.

However, a naive candidate might try to:

1. Convert the string to a list and use built-in methods inefficiently
2. Use floating-point division and then convert to integer (which requires careful handling of rounding)
3. Create unnecessary data structures like dictionaries when a simple counter suffices

The most common "non-optimal" approach would be using Python's `count()` method or similar in other languages, which is actually O(n) and perfectly acceptable. The real optimization here is in the percentage calculation, not the counting itself.

## Optimal Solution

The optimal solution follows these steps:

1. Count how many characters in the string equal the target letter
2. Calculate the percentage using integer arithmetic: `(count * 100) // len(s)`
3. Return the result as an integer

The integer division automatically gives us floor rounding, which is exactly what the problem requires.

<div class="code-group">

```python
# Time: O(n) where n is the length of s | Space: O(1)
def percentageLetter(s: str, letter: str) -> int:
    """
    Calculate the percentage of characters in s that equal letter,
    rounded down to the nearest whole percent.

    Args:
        s: The input string to analyze
        letter: The character to count in s

    Returns:
        Integer percentage (0-100) rounded down
    """
    # Edge case: empty string - percentage is 0
    if not s:
        return 0

    # Step 1: Count occurrences of letter in s
    count = 0
    for ch in s:
        if ch == letter:
            count += 1

    # Step 2: Calculate percentage using integer division
    # Multiplying by 100 before dividing ensures we get a percentage
    # Integer division automatically floors the result
    percentage = (count * 100) // len(s)

    return percentage
```

```javascript
// Time: O(n) where n is the length of s | Space: O(1)
/**
 * Calculate the percentage of characters in s that equal letter,
 * rounded down to the nearest whole percent.
 *
 * @param {string} s - The input string to analyze
 * @param {string} letter - The character to count in s
 * @return {number} Integer percentage (0-100) rounded down
 */
function percentageLetter(s, letter) {
  // Edge case: empty string - percentage is 0
  if (s.length === 0) {
    return 0;
  }

  // Step 1: Count occurrences of letter in s
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === letter) {
      count++;
    }
  }

  // Step 2: Calculate percentage using integer division
  // Math.floor ensures we round down to nearest whole percent
  // Multiplying by 100 converts fraction to percentage
  const percentage = Math.floor((count * 100) / s.length);

  return percentage;
}
```

```java
// Time: O(n) where n is the length of s | Space: O(1)
class Solution {
    /**
     * Calculate the percentage of characters in s that equal letter,
     * rounded down to the nearest whole percent.
     *
     * @param s The input string to analyze
     * @param letter The character to count in s
     * @return Integer percentage (0-100) rounded down
     */
    public int percentageLetter(String s, char letter) {
        // Edge case: empty string - percentage is 0
        if (s == null || s.length() == 0) {
            return 0;
        }

        // Step 1: Count occurrences of letter in s
        int count = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == letter) {
                count++;
            }
        }

        // Step 2: Calculate percentage using integer division
        // Multiplying by 100 before dividing ensures we get a percentage
        // Integer division automatically floors the result in Java
        int percentage = (count * 100) / s.length();

        return percentage;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once to count matching characters, which takes O(n) time where n is the length of the string.
- The percentage calculation is O(1) since it's just arithmetic operations.
- Total time is dominated by the linear scan: O(n).

**Space Complexity: O(1)**

- We only use a constant amount of extra space: a counter variable and the result variable.
- No additional data structures are created that scale with input size.
- Even the input string is provided, not created by our algorithm.

## Common Mistakes

1. **Incorrect rounding**: Using floating-point division and then converting to integer can lead to incorrect rounding. For example, `int(33.999)` gives 33, but `int(round(33.999))` would give 34. The problem specifically requires floor rounding, so integer division `(count * 100) // len(s)` is the correct approach.

2. **Not handling empty strings**: If the input string is empty, `len(s)` would be 0, causing a division by zero error. Always check for this edge case at the beginning of your function.

3. **Using the wrong data type for percentage**: In languages like Java, if you do `(count / s.length()) * 100`, you'll get 0 because integer division happens first. You must multiply before dividing: `(count * 100) / s.length()`.

4. **Assuming letter is always lowercase or single character**: While the problem states it's a character, some candidates might not handle case sensitivity properly. The comparison should be exact: 'A' ≠ 'a'. Always use the exact comparison provided by the language.

## When You'll See This Pattern

This problem uses the **frequency counting** pattern, which appears in many string and array problems:

1. **Sort Characters By Frequency (Medium)**: Instead of just counting one character, you count all characters and sort by frequency. The counting step is identical to what we do here.

2. **First Unique Character in a String (Easy)**: Requires counting character frequencies to find the first character with count = 1.

3. **Valid Anagram (Easy)**: Compares frequency counts of two strings to determine if they're anagrams.

4. **Majority Element (Easy)**: Finds the element that appears more than n/2 times, which requires counting frequencies.

The core technique—iterating through a collection and counting occurrences—is fundamental to many algorithms. Recognizing when to use a simple counter versus a full frequency map is key to solving these problems efficiently.

## Key Takeaways

1. **Simple counting problems often have O(n) solutions**: When you need to count occurrences in a string or array, a single pass with a counter is usually optimal.

2. **Integer arithmetic avoids floating-point issues**: For problems requiring floor division or percentage calculations, use integer operations `(a * b) // c` instead of floating-point then conversion.

3. **Always handle edge cases first**: Empty input, single element, all matches, no matches—these boundary conditions are where bugs hide. Check for them before your main logic.

4. **The problem's constraints guide implementation**: Since we only need to count one character, a simple counter suffices. If we needed to count all characters, we'd use a hash map.

Related problems: [Sort Characters By Frequency](/problem/sort-characters-by-frequency)
