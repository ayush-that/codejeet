---
title: "How to Solve Fraction to Recurring Decimal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Fraction to Recurring Decimal. Medium difficulty, 30.6% acceptance rate. Topics: Hash Table, Math, String."
date: "2027-09-25"
category: "dsa-patterns"
tags: ["fraction-to-recurring-decimal", "hash-table", "math", "string", "medium"]
---

# How to Solve Fraction to Recurring Decimal

This problem asks us to convert a fraction given as two integers (numerator and denominator) into its string representation. The tricky part is detecting repeating decimals and enclosing the repeating part in parentheses. What makes this problem interesting is that it combines mathematical long division with cycle detection using hash maps, requiring careful handling of edge cases like negative numbers, integer overflow, and exact divisions.

## Visual Walkthrough

Let's trace through an example: `numerator = 4`, `denominator = 333`.

**Step 1: Handle the sign**

- Result is negative if only one of numerator or denominator is negative
- We'll work with absolute values: `abs(4) ÷ abs(333)`

**Step 2: Integer part**

- `4 ÷ 333 = 0` with remainder `4`
- Integer part is `"0"`

**Step 3: Decimal part (long division)**

- Since remainder `4` < `333`, we add decimal point: `"0."`
- Multiply remainder by 10: `4 × 10 = 40`
- `40 ÷ 333 = 0` with remainder `40` → append `"0"` → `"0.0"`
- Multiply remainder by 10: `40 × 10 = 400`
- `400 ÷ 333 = 1` with remainder `67` → append `"1"` → `"0.01"`
- Multiply remainder by 10: `67 × 10 = 670`
- `670 ÷ 333 = 2` with remainder `4` → append `"2"` → `"0.012"`

**Step 4: Detect repetition**

- We've seen remainder `4` before! It was our original remainder after the integer part
- This means the sequence `"012"` will repeat indefinitely
- Insert `"("` after the first occurrence: `"0.("`
- Append `")"` at the end: `"0.(012)"`

**Key insight**: When a remainder repeats, the decimal sequence repeats from that point. We need a hash map to track remainders and their positions in the result string.

## Brute Force Approach

A naive approach might try to simulate long division without cycle detection, continuing until we either get remainder 0 or reach some arbitrary precision limit. This fails because:

1. **Infinite loops**: For repeating decimals, the division never terminates
2. **Arbitrary precision**: We don't know when to stop
3. **No parentheses**: Even if we detect repetition by comparing strings, it's inefficient

The brute force would look something like this (pseudocode):

```
result = integer_part + "."
remainder = numerator % denominator
for i in range(some_large_number):
    if remainder == 0: return result
    remainder *= 10
    digit = remainder // denominator
    result += str(digit)
    remainder %= denominator
return result + "..."  # Indicate it goes on forever
```

This doesn't properly handle repeating decimals and has no way to insert parentheses at the correct position.

## Optimized Approach

The optimal solution uses these key insights:

1. **Handle signs separately**: Work with absolute values to simplify logic
2. **Long division simulation**: Repeatedly multiply remainder by 10, divide by denominator
3. **Cycle detection with hash map**: Store each remainder and its position in the result string
4. **Insert parentheses**: When a remainder repeats, insert "(" at the stored position and ")" at the end

**Step-by-step reasoning**:

1. Handle edge case: numerator is 0 → return "0"
2. Determine sign using XOR (negative if signs differ)
3. Get absolute values using `long` type to prevent overflow (e.g., -2147483648 ÷ -1)
4. Append integer part
5. If remainder is 0, return result
6. Append decimal point
7. While remainder ≠ 0:
   - If remainder seen before → insert "(" at stored position, append ")", return
   - Store current remainder with its position
   - Multiply remainder by 10, append digit, update remainder
8. Return result (non-repeating decimal)

## Optimal Solution

<div class="code-group">

```python
# Time: O(k) where k is length of decimal part | Space: O(k) for hash map
def fractionToDecimal(numerator: int, denominator: int) -> str:
    # Edge case: numerator is 0
    if numerator == 0:
        return "0"

    result = []

    # Determine the sign
    # XOR: result is negative if exactly one of numerator or denominator is negative
    if (numerator < 0) ^ (denominator < 0):
        result.append("-")

    # Work with absolute values to simplify division
    # Use long division with long type to prevent overflow
    num = abs(numerator)
    den = abs(denominator)

    # Append the integer part
    result.append(str(num // den))

    # Calculate the remainder
    remainder = num % den

    # If remainder is 0, we have an exact division
    if remainder == 0:
        return "".join(result)

    # Add decimal point for fractional part
    result.append(".")

    # Dictionary to store remainders and their positions in result
    # When a remainder repeats, the decimal repeats from that position
    remainder_map = {}

    # Process the fractional part
    while remainder != 0:
        # If we've seen this remainder before, we have a repeating decimal
        if remainder in remainder_map:
            # Insert opening parenthesis at the position where repetition starts
            result.insert(remainder_map[remainder], "(")
            # Add closing parenthesis at the end
            result.append(")")
            break

        # Store current remainder's position (current length of result)
        remainder_map[remainder] = len(result)

        # Perform one step of long division: multiply remainder by 10
        remainder *= 10

        # Append the next digit to result
        result.append(str(remainder // den))

        # Update remainder for next iteration
        remainder %= den

    return "".join(result)
```

```javascript
// Time: O(k) where k is length of decimal part | Space: O(k) for hash map
function fractionToDecimal(numerator, denominator) {
  // Edge case: numerator is 0
  if (numerator === 0) {
    return "0";
  }

  let result = [];

  // Determine the sign
  // XOR using multiplication: result is negative if exactly one is negative
  if ((numerator < 0) ^ (denominator < 0)) {
    result.push("-");
  }

  // Work with absolute values to simplify division
  // Use BigInt to prevent overflow (especially for -2147483648 ÷ -1)
  let num = BigInt(Math.abs(numerator));
  let den = BigInt(Math.abs(denominator));

  // Append the integer part
  result.push((num / den).toString());

  // Calculate the remainder
  let remainder = num % den;

  // If remainder is 0, we have an exact division
  if (remainder === 0n) {
    return result.join("");
  }

  // Add decimal point for fractional part
  result.push(".");

  // Map to store remainders and their positions in result
  // When a remainder repeats, the decimal repeats from that position
  const remainderMap = new Map();

  // Process the fractional part
  while (remainder !== 0n) {
    // If we've seen this remainder before, we have a repeating decimal
    if (remainderMap.has(remainder)) {
      // Insert opening parenthesis at the position where repetition starts
      const insertPos = remainderMap.get(remainder);
      result.splice(insertPos, 0, "(");
      // Add closing parenthesis at the end
      result.push(")");
      break;
    }

    // Store current remainder's position (current length of result)
    remainderMap.set(remainder, result.length);

    // Perform one step of long division: multiply remainder by 10
    remainder *= 10n;

    // Append the next digit to result
    result.push((remainder / den).toString());

    // Update remainder for next iteration
    remainder %= den;
  }

  return result.join("");
}
```

```java
// Time: O(k) where k is length of decimal part | Space: O(k) for hash map
public String fractionToDecimal(int numerator, int denominator) {
    // Edge case: numerator is 0
    if (numerator == 0) {
        return "0";
    }

    StringBuilder result = new StringBuilder();

    // Determine the sign
    // XOR: result is negative if exactly one of numerator or denominator is negative
    if ((numerator < 0) ^ (denominator < 0)) {
        result.append("-");
    }

    // Work with absolute values to simplify division
    // Use long to prevent overflow (especially for -2147483648 ÷ -1)
    long num = Math.abs((long) numerator);
    long den = Math.abs((long) denominator);

    // Append the integer part
    result.append(num / den);

    // Calculate the remainder
    long remainder = num % den;

    // If remainder is 0, we have an exact division
    if (remainder == 0) {
        return result.toString();
    }

    // Add decimal point for fractional part
    result.append(".");

    // HashMap to store remainders and their positions in result
    // When a remainder repeats, the decimal repeats from that position
    Map<Long, Integer> remainderMap = new HashMap<>();

    // Process the fractional part
    while (remainder != 0) {
        // If we've seen this remainder before, we have a repeating decimal
        if (remainderMap.containsKey(remainder)) {
            // Insert opening parenthesis at the position where repetition starts
            int insertPos = remainderMap.get(remainder);
            result.insert(insertPos, "(");
            // Add closing parenthesis at the end
            result.append(")");
            break;
        }

        // Store current remainder's position (current length of result)
        remainderMap.put(remainder, result.length());

        // Perform one step of long division: multiply remainder by 10
        remainder *= 10;

        // Append the next digit to result
        result.append(remainder / den);

        // Update remainder for next iteration
        remainder %= den;
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(k) where k is the length of the decimal part

- In the worst case, we process each digit of the decimal representation once
- For repeating decimals, we stop as soon as we detect a cycle
- For non-repeating decimals, we stop when remainder becomes 0

**Space Complexity**: O(k) where k is the length of the decimal part

- The hash map stores at most k entries (one for each unique remainder)
- The result string itself also requires O(k) space
- In practice, the hash map dominates for repeating decimals with long cycles

## Common Mistakes

1. **Integer overflow**: Not using `long` or `BigInt` when taking absolute values of `Integer.MIN_VALUE` or when multiplying remainder by 10. The test case `-2147483648 ÷ -1` causes overflow if using regular integers.

2. **Forgetting to handle signs**: Calculating with negative numbers directly makes the division logic complex. Always handle signs at the beginning and work with absolute values.

3. **Incorrect cycle detection**: Trying to detect cycles by comparing substrings instead of remainders. Remainders are more reliable because the same digit sequence can appear from different remainders.

4. **Wrong parenthesis placement**: Inserting "(" at the wrong position. Remember: the position stored in the hash map is where the repeating part _starts_, not where we first saw the remainder.

## When You'll See This Pattern

This problem combines **mathematical simulation** with **cycle detection using hash maps**:

1. **Happy Number (LeetCode 202)**: Uses hash set to detect cycles in a sequence of transformed numbers
2. **Linked List Cycle II (LeetCode 142)**: Floyd's cycle detection algorithm finds start of cycle
3. **Find the Duplicate Number (LeetCode 287)**: Treats array as linked list to detect cycles

The core pattern: when you need to detect repeating sequences in a state machine, use a hash map to store states and their positions/occurrences.

## Key Takeaways

1. **Remainders reveal repetition**: In decimal conversion, when a remainder repeats, the decimal digits repeat from that point. This is more reliable than comparing digit sequences.

2. **Hash maps for state tracking**: Whenever you need to detect cycles or repetitions in a process, store states in a hash map with their positions or counts.

3. **Handle edge cases early**: Check for zero numerator, manage signs separately, and prevent integer overflow before starting the main logic.

[Practice this problem on CodeJeet](/problem/fraction-to-recurring-decimal)
