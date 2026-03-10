---
title: "How to Solve Roman to Integer — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Roman to Integer. Easy difficulty, 66.3% acceptance rate. Topics: Hash Table, Math, String."
date: "2026-02-14"
category: "dsa-patterns"
tags: ["roman-to-integer", "hash-table", "math", "string", "easy"]
---

# How to Solve Roman to Integer

Roman numerals are a numeral system where letters represent values, and you convert a string like "MCMXCIV" to its integer equivalent (1994). What makes this problem interesting is that while most symbols simply add their value, there are six specific cases where a smaller numeral before a larger one means subtraction (like IV = 4). The challenge is to correctly handle these subtraction rules while scanning the string efficiently.

## Visual Walkthrough

Let's trace through the example `"MCMXCIV"` which should equal 1994. We'll read from left to right, keeping track of the total:

1. **M** = 1000 → total = 1000
2. **C** = 100, next is **M** = 1000. Since 100 < 1000, this is a subtraction case (CM = 900). We add 900, but we already added 100 in step 2? Wait, that's the issue! If we just add values as we see them, we'll double-count.

Better approach: Compare each symbol with the next one:

- **M** (1000) vs **C** (100): 1000 > 100 → add 1000
- **C** (100) vs **M** (1000): 100 < 1000 → subtract 100 (not add)
- **M** (1000) vs **X** (10): 1000 > 10 → add 1000
- **X** (10) vs **C** (100): 10 < 100 → subtract 10
- **C** (100) vs **I** (1): 100 > 1 → add 100
- **I** (1) vs **V** (5): 1 < 5 → subtract 1
- **V** (5) → no next → add 5

Let's calculate: 1000 + (1000-100) + (100-10) + (5-1) = 1000 + 900 + 90 + 4 = 1994 ✓

The pattern: When a smaller value appears before a larger value, it's subtracted. Otherwise, it's added.

## Brute Force Approach

A naive approach might try to manually check for all six subtraction cases (IV, IX, XL, XC, CD, CM) by scanning the string and replacing them with special values. While this would work, it's messy and requires multiple passes or complex string manipulation. The code would need to handle overlapping cases and be careful about order of replacement.

Here's what that might look like:

```python
def romanToIntNaive(s: str) -> int:
    # Messy approach with string replacements
    replacements = [("IV", "IIII"), ("IX", "VIIII"),
                   ("XL", "XXXX"), ("XC", "LXXXX"),
                   ("CD", "CCCC"), ("CM", "DCCCC")]

    for old, new in replacements:
        s = s.replace(old, new)

    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50,
              'C': 100, 'D': 500, 'M': 1000}

    total = 0
    for char in s:
        total += values[char]

    return total
```

This works but is inefficient (O(n²) in worst case due to string rebuilding) and doesn't teach the underlying pattern. More importantly, it doesn't generalize well to similar problems.

## Optimal Solution

The optimal solution uses a single left-to-right pass with a hash map for symbol values. The key insight: **When a smaller value appears before a larger value, subtract it; otherwise, add it.** We implement this by comparing each symbol with the next one during iteration.

<div class="code-group">

```python
# Time: O(n) where n is length of string | Space: O(1) for fixed-size map
def romanToInt(s: str) -> int:
    # Map each Roman symbol to its integer value
    values = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    }

    total = 0
    n = len(s)

    # Iterate through each character in the string
    for i in range(n):
        # Get current symbol's value
        current_val = values[s[i]]

        # Check if there's a next symbol to compare with
        if i + 1 < n:
            next_val = values[s[i + 1]]

            # If current value is less than next value, we have a subtraction case
            if current_val < next_val:
                total -= current_val  # Subtract current value
            else:
                total += current_val  # Add current value
        else:
            # Last character, always add it
            total += current_val

    return total
```

```javascript
// Time: O(n) where n is length of string | Space: O(1) for fixed-size map
function romanToInt(s) {
  // Map each Roman symbol to its integer value
  const values = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let total = 0;
  const n = s.length;

  // Iterate through each character in the string
  for (let i = 0; i < n; i++) {
    // Get current symbol's value
    const currentVal = values[s[i]];

    // Check if there's a next symbol to compare with
    if (i + 1 < n) {
      const nextVal = values[s[i + 1]];

      // If current value is less than next value, we have a subtraction case
      if (currentVal < nextVal) {
        total -= currentVal; // Subtract current value
      } else {
        total += currentVal; // Add current value
      }
    } else {
      // Last character, always add it
      total += currentVal;
    }
  }

  return total;
}
```

```java
// Time: O(n) where n is length of string | Space: O(1) for fixed-size map
class Solution {
    public int romanToInt(String s) {
        // Map each Roman symbol to its integer value
        Map<Character, Integer> values = new HashMap<>();
        values.put('I', 1);
        values.put('V', 5);
        values.put('X', 10);
        values.put('L', 50);
        values.put('C', 100);
        values.put('D', 500);
        values.put('M', 1000);

        int total = 0;
        int n = s.length();

        // Iterate through each character in the string
        for (int i = 0; i < n; i++) {
            // Get current symbol's value
            int currentVal = values.get(s.charAt(i));

            // Check if there's a next symbol to compare with
            if (i + 1 < n) {
                int nextVal = values.get(s.charAt(i + 1));

                // If current value is less than next value, we have a subtraction case
                if (currentVal < nextVal) {
                    total -= currentVal;  // Subtract current value
                } else {
                    total += currentVal;  // Add current value
                }
            } else {
                // Last character, always add it
                total += currentVal;
            }
        }

        return total;
    }
}
```

</div>

**Line-by-line explanation of key parts:**

1. **The hash map/dictionary**: Stores the fixed mapping of 7 symbols to values. This gives us O(1) lookup for any symbol.
2. **The loop condition `i + 1 < n`**: Crucial for avoiding index out of bounds when checking the next character. We need to handle the last character separately.
3. **The comparison `current_val < next_val`**: This captures all subtraction cases in one condition. It works because:
   - IV: 1 < 5 → subtract 1
   - IX: 1 < 10 → subtract 1
   - XL: 10 < 50 → subtract 10
   - XC: 10 < 100 → subtract 10
   - CD: 100 < 500 → subtract 100
   - CM: 100 < 1000 → subtract 100
4. **The else case for last character**: When we're at the last symbol, there's no next symbol to compare with, so we always add it.

## Complexity Analysis

**Time Complexity: O(n)** where n is the length of the input string. We make a single pass through the string, performing constant-time operations (hash map lookup and integer comparisons/addition) for each character.

**Space Complexity: O(1)** because we use a fixed-size hash map with only 7 entries regardless of input size. The variables `total`, `i`, `current_val`, and `next_val` use constant space.

## Common Mistakes

1. **Forgetting to handle the last character separately**: If you check `s[i+1]` without verifying `i+1 < n`, you'll get an index out of bounds error on the last iteration.

2. **Adding instead of subtracting in subtraction cases**: The most common logical error is writing `if current_val < next_val: total += current_val` instead of subtracting. Remember: smaller before larger means subtract the smaller.

3. **Using wrong comparison direction**: Writing `if current_val > next_val` instead of `<` will reverse the logic, causing subtraction when you should add and vice versa.

4. **Not using a hash map for O(1) lookups**: Some candidates use switch statements or if-else chains to convert symbols to values. While this works, a hash map is cleaner and more maintainable, especially in interview settings.

5. **Assuming only specific pairs need subtraction**: Some candidates hardcode checks for "IV", "IX", etc. This works but is less elegant than the general comparison approach and requires more code.

## When You'll See This Pattern

This "compare adjacent elements to determine operation" pattern appears in several problems:

1. **Integer to Roman (LeetCode #12)**: The inverse problem uses a similar greedy approach with subtraction cases, but in reverse.

2. **Best Time to Buy and Sell Stock (LeetCode #121)**: You compare prices to find the maximum difference where the buy happens before sell, similar to comparing adjacent values.

3. **Trapping Rain Water (LeetCode #42)**: You compare heights with neighbors to determine how much water can be trapped at each position.

4. **Valid Parentheses (LeetCode #20)**: While not identical, it also involves processing a string left-to-right and making decisions based on the next character (matching closing brackets).

The core pattern: **When processing sequences, sometimes you need to look ahead (or behind) one element to decide how to handle the current element.**

## Key Takeaways

1. **Look-ahead comparison is powerful**: When a problem involves pairs of elements with special rules, comparing each element with its neighbor often yields an elegant solution.

2. **Hash maps simplify symbol-to-value mapping**: For fixed, small sets of mappings, a hash map provides clean, readable code with O(1) lookups.

3. **Edge cases matter**: Always check array/string bounds when accessing `i+1` or `i-1`. The first and last elements often need special handling.

4. **Test with Roman numerals that use all subtraction cases**: "MCMXCIV" (1994) is excellent because it contains CM (900), XC (90), and IV (4).

Related problems: [Integer to Roman](/problem/integer-to-roman)
