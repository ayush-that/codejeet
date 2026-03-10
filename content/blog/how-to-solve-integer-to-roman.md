---
title: "How to Solve Integer to Roman — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Integer to Roman. Medium difficulty, 70.5% acceptance rate. Topics: Hash Table, Math, String."
date: "2026-05-28"
category: "dsa-patterns"
tags: ["integer-to-roman", "hash-table", "math", "string", "medium"]
---

# How to Solve Integer to Roman

Converting integers to Roman numerals is a classic problem that tests your ability to work with mapping systems and handle special subtraction cases. What makes this problem interesting is that Roman numerals aren't just simple digit-by-digit conversion — they have specific patterns where smaller numerals appear before larger ones to represent subtraction (like IV for 4 or IX for 9). The challenge is to systematically apply these rules without getting lost in complex conditional logic.

## Visual Walkthrough

Let's walk through converting the number **1994** to Roman numerals step by step:

**Step 1:** Start with the largest Roman numeral value (1000 = M).  
1994 ≥ 1000, so we add "M" and subtract 1000 → Remainder: 994

**Step 2:** Next largest is 900 (CM).  
994 ≥ 900, so we add "CM" and subtract 900 → Remainder: 94

**Step 3:** Next largest is 90 (XC).  
94 ≥ 90, so we add "XC" and subtract 90 → Remainder: 4

**Step 4:** Next largest is 4 (IV).  
4 ≥ 4, so we add "IV" and subtract 4 → Remainder: 0

**Result:** M + CM + XC + IV = "MCMXCIV"

Notice how we check for special subtraction cases (900, 400, 90, 40, 9, 4) _before_ the regular values (1000, 500, 100, 50, 10, 5, 1). This ensures we always use the correct representation.

## Brute Force Approach

A naive approach might try to handle each digit position separately with complex conditional logic. For example:

1. Extract thousands digit → convert to M's
2. Extract hundreds digit → check if it's 9, 4, or other values
3. Extract tens digit → similar logic
4. Extract ones digit → similar logic

The problem with this approach is the explosion of edge cases. You'd need separate logic for each place value (ones, tens, hundreds, thousands), and within each, you'd need to handle:

- Values 1-3: repeat the symbol
- Value 4: subtraction case
- Value 5: single symbol
- Values 6-8: combination
- Value 9: subtraction case

This leads to messy, hard-to-maintain code with many if-else statements. While it would technically work, it's error-prone and doesn't scale well if we needed to extend to larger numbers.

## Optimized Approach

The key insight is that we can treat all Roman numeral values (including subtraction cases) as independent "coins" in a greedy change-making problem. Instead of thinking about digits, we think about the complete set of value-symbol pairs:

```
1000: "M"
900:  "CM"
500:  "D"
400:  "CD"
100:  "C"
90:   "XC"
50:   "L"
40:   "XL"
10:   "X"
9:    "IX"
5:    "V"
4:    "IV"
1:    "I"
```

The algorithm becomes beautifully simple:

1. Start with the largest value
2. While the number is greater than or equal to the current value:
   - Append the corresponding symbol to the result
   - Subtract the value from the number
3. Move to the next smaller value
4. Repeat until the number reaches 0

This works because Roman numerals are always written from largest to smallest value (except for subtraction cases, which we've included as separate entries). The greedy approach is valid here because each Roman numeral value is at least as large as the sum of all smaller values.

## Optimal Solution

Here's the clean, greedy solution with detailed comments:

<div class="code-group">

```python
# Time: O(1) - We iterate through 13 fixed values
# Space: O(1) - The result string grows but is bounded (max length is 15 for 3888)
def intToRoman(num: int) -> str:
    # Define all value-symbol pairs in descending order
    # Include subtraction cases as separate entries
    values = [
        (1000, "M"),
        (900, "CM"),
        (500, "D"),
        (400, "CD"),
        (100, "C"),
        (90, "XC"),
        (50, "L"),
        (40, "XL"),
        (10, "X"),
        (9, "IX"),
        (5, "V"),
        (4, "IV"),
        (1, "I")
    ]

    result = []

    # Greedy algorithm: use the largest possible value at each step
    for value, symbol in values:
        # While we can subtract this value from the remaining number
        while num >= value:
            result.append(symbol)  # Add the symbol to result
            num -= value           # Subtract the value

        # Early exit if we've converted the entire number
        if num == 0:
            break

    # Join all symbols into a single string
    return "".join(result)
```

```javascript
// Time: O(1) - We iterate through 13 fixed values
// Space: O(1) - The result string grows but is bounded
function intToRoman(num) {
  // Define all value-symbol pairs in descending order
  const values = [
    [1000, "M"],
    [900, "CM"],
    [500, "D"],
    [400, "CD"],
    [100, "C"],
    [90, "XC"],
    [50, "L"],
    [40, "XL"],
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let result = "";

  // Greedy algorithm: use the largest possible value at each step
  for (const [value, symbol] of values) {
    // While we can subtract this value from the remaining number
    while (num >= value) {
      result += symbol; // Append the symbol to result
      num -= value; // Subtract the value
    }

    // Early exit if we've converted the entire number
    if (num === 0) {
      break;
    }
  }

  return result;
}
```

```java
// Time: O(1) - We iterate through 13 fixed values
// Space: O(1) - The result string grows but is bounded
public String intToRoman(int num) {
    // Define all value-symbol pairs in descending order
    int[] values = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    String[] symbols = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};

    StringBuilder result = new StringBuilder();

    // Greedy algorithm: use the largest possible value at each step
    for (int i = 0; i < values.length; i++) {
        int value = values[i];
        String symbol = symbols[i];

        // While we can subtract this value from the remaining number
        while (num >= value) {
            result.append(symbol);  // Append the symbol to result
            num -= value;           // Subtract the value
        }

        // Early exit if we've converted the entire number
        if (num == 0) {
            break;
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)  
We iterate through a fixed list of 13 value-symbol pairs. Even though we have a while loop inside the for loop, the total number of iterations is bounded because:

- The maximum input is 3999 (as per standard Roman numeral conventions)
- The maximum number of symbols we can append is 15 (for 3888: MMMDCCCLXXXVIII)
- Each iteration either moves to a smaller value or reduces the number

**Space Complexity:** O(1)  
We use a fixed amount of extra space for the data structures. The result string grows with the output, but its maximum length is 15 characters, which is constant.

## Common Mistakes

1. **Forgetting subtraction cases:** The most common error is only including the basic symbols (I, V, X, L, C, D, M) and trying to handle subtraction with complex logic. This leads to messy code that's hard to debug.

2. **Wrong order of values:** If you don't list values in descending order, the greedy algorithm fails. For example, if you check for 1 before 4, you'd get "IIII" instead of "IV" for 4.

3. **Off-by-one with bounds:** The problem typically specifies input range 1-3999. Some candidates forget to handle the minimum (1) or maximum (3999) correctly. Always check constraints.

4. **Inefficient string concatenation:** In languages like Java or JavaScript, repeatedly using `+` on strings creates new objects. Use `StringBuilder` (Java) or array joining (JavaScript) for better performance.

## When You'll See This Pattern

This greedy mapping pattern appears in several types of problems:

1. **Coin Change (Minimum Coins):** Similar to finding the minimum number of coins to make change, but here we're building a representation rather than minimizing count.

2. **Integer to English Words (LeetCode 273):** This is essentially the same pattern but with English words instead of Roman symbols. You break the number into chunks (thousands, millions, etc.) and map each chunk to words.

3. **Excel Sheet Column Title (LeetCode 168):** Converting numbers to Excel column letters (1→A, 28→AB) uses a similar base-26 conversion with special handling for the lack of a zero digit.

The core pattern is: when you need to convert between numbering systems with irregular mappings, predefine all the mappings in descending order and use a greedy approach.

## Key Takeaways

1. **Greedy with precomputed mappings works:** When conversion involves special cases (like subtraction in Roman numerals), include those cases as separate entries in your mapping table. This simplifies the algorithm to a straightforward greedy approach.

2. **Order matters:** Always process values from largest to smallest in greedy algorithms. This ensures you use the most significant representation first.

3. **Think in terms of value-symbol pairs:** Instead of complex digit-by-digit logic, treat each possible representation (including compound ones like "IV" or "XC") as a single unit. This reduces cognitive load and minimizes bugs.

Related problems: [Roman to Integer](/problem/roman-to-integer), [Integer to English Words](/problem/integer-to-english-words)
