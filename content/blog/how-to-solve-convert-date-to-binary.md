---
title: "How to Solve Convert Date to Binary — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Convert Date to Binary. Easy difficulty, 88.7% acceptance rate. Topics: Math, String."
date: "2027-09-21"
category: "dsa-patterns"
tags: ["convert-date-to-binary", "math", "string", "easy"]
---

## How to Solve Convert Date to Binary

You're given a date string in `yyyy-mm-dd` format and need to convert each component (year, month, day) to its binary representation without leading zeros, then combine them back into a string with hyphens. While conceptually straightforward, this problem tests your ability to parse strings, convert integers to binary, and handle edge cases cleanly. The interesting part is that you need to think about three separate conversions while maintaining the original format structure.

## Visual Walkthrough

Let's trace through the example `date = "2023-05-25"`:

1. **Parse the date string:**
   - Year: `"2023"` → integer `2023`
   - Month: `"05"` → integer `5` (note: we drop leading zeros)
   - Day: `"25"` → integer `25`

2. **Convert each component to binary:**
   - Year: `2023` in binary is `11111100111`
     - How we get there: 2023 ÷ 2 = 1011 remainder 1, and so on...
   - Month: `5` in binary is `101`
   - Day: `25` in binary is `11001`

3. **Combine with hyphens:**
   - Result: `"11111100111-101-11001"`

The key insight is that each component converts independently, and we must remove any leading zeros that might appear if we used a standard binary conversion function that pads to fixed width.

## Brute Force Approach

Actually, for this problem, there's only one reasonable approach since the operations are inherently O(1). However, a "naive" implementation might involve unnecessary steps:

1. Split the string by `"-"`
2. For each part, convert to integer
3. Convert integer to binary string using built-in functions
4. Remove leading zeros
5. Join with hyphens

The potential inefficiency would come from manually implementing binary conversion instead of using built-in functions, or from using regex unnecessarily. But since the date has fixed format and each component has bounded size (year ≤ 9999, month ≤ 12, day ≤ 31), any reasonable implementation will be O(1) time and space.

## Optimal Solution

The optimal solution follows the intuitive steps: parse, convert, format. We'll use built-in language features for binary conversion (like `bin()` in Python, `toString(2)` in JavaScript, `Integer.toBinaryString()` in Java) to keep the code clean and efficient.

<div class="code-group">

```python
# Time: O(1) - fixed-length input, constant operations
# Space: O(1) - output size is bounded
def convert_date_to_binary(date: str) -> str:
    # Step 1: Split the date string into year, month, day components
    # The date format is guaranteed to be yyyy-mm-dd
    year_str, month_str, day_str = date.split('-')

    # Step 2: Convert each component from string to integer
    # This automatically removes leading zeros (e.g., "05" -> 5)
    year_int = int(year_str)
    month_int = int(month_str)
    day_int = int(day_str)

    # Step 3: Convert each integer to binary string without leading '0b' prefix
    # bin() returns a string like '0b101', we slice from index 2 to remove '0b'
    year_binary = bin(year_int)[2:]
    month_binary = bin(month_int)[2:]
    day_binary = bin(day_int)[2:]

    # Step 4: Combine the binary strings with hyphens
    # This reconstructs the original format but with binary representations
    return f"{year_binary}-{month_binary}-{day_binary}"
```

```javascript
// Time: O(1) - fixed-length input, constant operations
// Space: O(1) - output size is bounded
function convertDateToBinary(date) {
  // Step 1: Split the date string into year, month, day components
  // The date format is guaranteed to be yyyy-mm-dd
  const parts = date.split("-");

  // Step 2: Convert each component from string to integer
  // parseInt automatically removes leading zeros (e.g., "05" -> 5)
  const yearInt = parseInt(parts[0], 10);
  const monthInt = parseInt(parts[1], 10);
  const dayInt = parseInt(parts[2], 10);

  // Step 3: Convert each integer to binary string
  // toString(2) converts to base-2 representation without leading zeros
  const yearBinary = yearInt.toString(2);
  const monthBinary = monthInt.toString(2);
  const dayBinary = dayInt.toString(2);

  // Step 4: Combine the binary strings with hyphens
  // This reconstructs the original format but with binary representations
  return `${yearBinary}-${monthBinary}-${dayBinary}`;
}
```

```java
// Time: O(1) - fixed-length input, constant operations
// Space: O(1) - output size is bounded
public String convertDateToBinary(String date) {
    // Step 1: Split the date string into year, month, day components
    // The date format is guaranteed to be yyyy-mm-dd
    String[] parts = date.split("-");

    // Step 2: Convert each component from string to integer
    // Integer.parseInt automatically removes leading zeros (e.g., "05" -> 5)
    int yearInt = Integer.parseInt(parts[0]);
    int monthInt = Integer.parseInt(parts[1]);
    int dayInt = Integer.parseInt(parts[2]);

    // Step 3: Convert each integer to binary string
    // Integer.toBinaryString() converts to base-2 without leading zeros
    String yearBinary = Integer.toBinaryString(yearInt);
    String monthBinary = Integer.toBinaryString(monthInt);
    String dayBinary = Integer.toBinaryString(dayInt);

    // Step 4: Combine the binary strings with hyphens
    // This reconstructs the original format but with binary representations
    return yearBinary + "-" + monthBinary + "-" + dayBinary;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- Splitting the string: O(1) since the input has fixed length (10 characters)
- Integer parsing: O(1) since each component has bounded length (year: 4 chars, month: 2 chars, day: 2 chars)
- Binary conversion: O(log n) for each component, but since year ≤ 9999, month ≤ 12, day ≤ 31, these are bounded by constants
- String concatenation: O(1) since output length is bounded (max ~30 characters)

**Space Complexity: O(1)**

- We store a few temporary strings and integers, all bounded in size
- The output string itself is bounded (max length when year=9999: binary "10011100001111" = 14 chars, plus hyphens and other components)

## Common Mistakes

1. **Forgetting to remove leading zeros from binary conversion:** Some binary conversion functions might pad to fixed width. For example, if you manually implement conversion for month "05", you might get "0101" instead of "101". Always check that your conversion doesn't include unnecessary leading zeros.

2. **Not handling the string-to-integer conversion properly:** Using functions that don't automatically handle leading zeros (like some manual parsing) could cause issues. Built-in `int()`, `parseInt()`, and `Integer.parseInt()` handle this correctly.

3. **Incorrectly splitting the date string:** Using the wrong delimiter or not splitting at all. Remember the format is `yyyy-mm-dd`, so split on `"-"`.

4. **Trying to convert the entire date string at once:** Some candidates try to remove hyphens and convert the entire number (like 20230525) to binary, which gives wrong results. Each component must be converted separately.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **String parsing with delimiters** - Similar to problems like [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string/) where you split, process, and rejoin strings.

2. **Base conversion** - The core of converting between number bases appears in problems like [Convert to Base -2](https://leetcode.com/problems/convert-to-base-2/) and [Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title/).

3. **Integer to string conversion** - This is a subset of number formatting problems, similar to how you'd handle [Integer to Roman](https://leetcode.com/problems/integer-to-roman/) but much simpler.

The pattern of "parse → transform → format" appears frequently in interview problems, especially when dealing with structured data like dates, IP addresses, or version numbers.

## Key Takeaways

1. **Break complex transformations into clear steps:** Parse the input, transform each component independently, then reassemble. This makes the code easier to write, read, and debug.

2. **Know your language's built-in conversion functions:** Most languages have efficient, well-tested functions for common conversions like integer to binary string. Using them saves time and reduces bugs.

3. **Pay attention to formatting requirements:** The difference between "101" and "0101" matters here. Always verify your output matches the exact format specified.

Related problems: [Number of 1 Bits](/problem/number-of-1-bits), [Convert to Base -2](/problem/convert-to-base-2)
