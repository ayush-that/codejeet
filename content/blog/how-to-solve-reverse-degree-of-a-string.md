---
title: "How to Solve Reverse Degree of a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse Degree of a String. Easy difficulty, 88.6% acceptance rate. Topics: String, Simulation."
date: "2028-03-30"
category: "dsa-patterns"
tags: ["reverse-degree-of-a-string", "string", "simulation", "easy"]
---

# How to Solve Reverse Degree of a String

This problem asks us to calculate a "reverse degree" for a string by summing the product of each character's position in the reversed alphabet with its 1-indexed position in the string. While conceptually straightforward, this problem tests attention to detail with character mapping, indexing, and careful implementation of the given formula.

## Visual Walkthrough

Let's trace through the example `s = "abc"` step by step:

1. **Character positions in string (1-indexed):**
   - 'a' is at position 1
   - 'b' is at position 2
   - 'c' is at position 3

2. **Reverse alphabet positions:**
   - 'a' → 26 (since 'z' = 1, 'y' = 2, ..., 'a' = 26)
   - 'b' → 25
   - 'c' → 24

3. **Calculate products:**
   - 'a': 26 × 1 = 26
   - 'b': 25 × 2 = 50
   - 'c': 24 × 3 = 72

4. **Sum the products:**
   - 26 + 50 + 72 = 148

So for `s = "abc"`, the reverse degree is 148.

Another example: `s = "z"`:

- Position in string: 1
- Reverse alphabet position: 1 ('z' = 1)
- Product: 1 × 1 = 1

## Brute Force Approach

The brute force approach would be to manually calculate the reverse alphabet position for each character by counting from 'z' back to 'a'. For each character `c`:

1. Start from 'z' = 1, 'y' = 2, ..., until you find `c`
2. Multiply this value by the character's (1-indexed) position
3. Add to running total

This approach is inefficient because for each character, we might need to traverse up to 26 positions to find its reverse alphabet value. For a string of length `n`, this gives us O(26n) = O(n) time complexity, which is actually acceptable for this problem since the alphabet is fixed at 26 characters. However, it's still suboptimal compared to using a direct mapping.

A truly naive approach might try to compute reverse alphabet position using `26 - (c - 'a')`, but this would give incorrect results because:

- 'a' would be 26 - 0 = 26 ✓
- 'b' would be 26 - 1 = 25 ✓
- 'z' would be 26 - 25 = 1 ✓

Wait, this actually works! So the "brute force" here isn't about inefficiency but about missing the mathematical relationship. The key insight is recognizing that `reverse_position = 26 - (c - 'a')`.

## Optimal Solution

The optimal solution directly computes the reverse alphabet position using the formula above. We iterate through the string once, calculate each character's contribution, and sum them up.

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) - we only use a few variables
def reverseDegree(s: str) -> int:
    """
    Calculate the reverse degree of a string.

    The reverse degree is the sum of:
    (reverse_alphabet_position * character_index) for each character,
    where character_index is 1-indexed.
    """
    total = 0  # Initialize sum of all products

    # Iterate through each character in the string
    # We use enumerate with start=1 to get 1-indexed positions
    for i, char in enumerate(s, start=1):
        # Calculate reverse alphabet position:
        # 'a' has ASCII value 97, so char - 'a' gives 0 for 'a', 1 for 'b', etc.
        # 26 - this value gives: 26 for 'a', 25 for 'b', ..., 1 for 'z'
        reverse_pos = 26 - (ord(char) - ord('a'))

        # Add the product of reverse position and character index
        total += reverse_pos * i

    return total
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
function reverseDegree(s) {
  /**
   * Calculate the reverse degree of a string.
   *
   * The reverse degree is the sum of:
   * (reverse_alphabet_position * character_index) for each character,
   * where character_index is 1-indexed.
   */
  let total = 0; // Initialize sum of all products

  // Iterate through each character in the string
  // We use 1-indexed positions as specified in the problem
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const position = i + 1; // Convert to 1-indexed

    // Calculate reverse alphabet position:
    // 'a' has char code 97, so charCode - 97 gives 0 for 'a', 1 for 'b', etc.
    // 26 - this value gives: 26 for 'a', 25 for 'b', ..., 1 for 'z'
    const reversePos = 26 - (char.charCodeAt(0) - "a".charCodeAt(0));

    // Add the product of reverse position and character index
    total += reversePos * position;
  }

  return total;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) - we only use a few variables
public int reverseDegree(String s) {
    /**
     * Calculate the reverse degree of a string.
     *
     * The reverse degree is the sum of:
     * (reverse_alphabet_position * character_index) for each character,
     * where character_index is 1-indexed.
     */
    int total = 0;  // Initialize sum of all products

    // Iterate through each character in the string
    // We use 1-indexed positions as specified in the problem
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        int position = i + 1;  // Convert to 1-indexed

        // Calculate reverse alphabet position:
        // 'a' has ASCII value 97, so c - 'a' gives 0 for 'a', 1 for 'b', etc.
        // 26 - this value gives: 26 for 'a', 25 for 'b', ..., 1 for 'z'
        int reversePos = 26 - (c - 'a');

        // Add the product of reverse position and character index
        total += reversePos * position;
    }

    return total;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the input string. We perform a single pass through the string, and for each character, we do constant-time operations (arithmetic calculations and multiplication).

**Space Complexity:** O(1). We only use a few integer variables (`total`, `position`, `reversePos`) regardless of the input size. The input string itself is not counted toward space complexity as it's part of the input.

## Common Mistakes

1. **Using 0-indexed positions instead of 1-indexed:** The problem clearly states that character positions should be 1-indexed. Forgetting to add 1 to the loop index will give incorrect results. Always double-check indexing requirements.

2. **Incorrect reverse alphabet calculation:** Some candidates might try `26 - (c - 'a' + 1)` which would give 'a' = 25 instead of 26. Test your formula with edge cases: 'a' should give 26, 'z' should give 1.

3. **Not handling uppercase letters:** While the problem statement implies lowercase letters, a robust solution might include validation or conversion. Always clarify assumptions with the interviewer.

4. **Integer overflow for very long strings:** While unlikely in interview settings, for extremely long strings, the product `reversePos * position` could overflow. In Python, integers are arbitrary precision, but in Java/JavaScript, you might need to use `long` or `BigInt` for very large inputs.

## When You'll See This Pattern

This problem combines string traversal with mathematical transformation, a common pattern in coding interviews:

1. **Character value mapping problems:** Similar to "Score of a String" (LeetCode 3110) where you sum absolute differences between adjacent characters, or "Calculate Digit Sum of a String" (LeetCode 2243) where you process characters in groups.

2. **Position-based calculations:** Problems like "Subtract the Product and Sum of Digits of an Integer" (LeetCode 1281) where you perform different operations based on digit positions.

3. **Alphabet transformation problems:** "Replace All Digits with Characters" (LeetCode 1844) or "Shifting Letters" (LeetCode 848) where you modify characters based on their positions in the alphabet.

The core pattern is: iterate through a sequence, apply a transformation to each element based on its value and/or position, and accumulate results.

## Key Takeaways

1. **Always verify indexing requirements:** Problems often use 1-indexing for mathematical calculations. The difference between 0-indexed and 1-indexed can completely change the result.

2. **Look for mathematical relationships:** Instead of creating lookup tables for small fixed sets (like 26 letters), find the formula that maps input to output. This is cleaner and more efficient.

3. **Test with edge cases:** For string problems, always test with empty string, single character, and the alphabet boundaries ('a' and 'z'). This catches off-by-one errors in your calculations.

[Practice this problem on CodeJeet](/problem/reverse-degree-of-a-string)
