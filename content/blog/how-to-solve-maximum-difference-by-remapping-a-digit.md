---
title: "How to Solve Maximum Difference by Remapping a Digit — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Difference by Remapping a Digit. Easy difficulty, 76.1% acceptance rate. Topics: Math, Greedy."
date: "2026-12-07"
category: "dsa-patterns"
tags: ["maximum-difference-by-remapping-a-digit", "math", "greedy", "easy"]
---

# How to Solve Maximum Difference by Remapping a Digit

This problem asks us to find the maximum possible difference Bob can create by remapping exactly one digit in a given integer. The tricky part is understanding that remapping means replacing **all occurrences** of a chosen digit with another digit throughout the entire number. This isn't about changing a single digit position, but systematically transforming every instance of one digit to another.

## Visual Walkthrough

Let's trace through an example: `num = 11891`

**Step 1: Understanding the transformation**
When Bob remaps a digit, say he chooses to remap digit '1' to '9'. This means every '1' in the number becomes '9':

- Original: 1 1 8 9 1
- After remapping '1' → '9': 9 9 8 9 9 = 99899

**Step 2: Finding the maximum value**
To maximize the number, we want to make it as large as possible. The best strategy is:

1. Find the first non-9 digit from the left (most significant position)
2. Remap that digit to 9

For `11891`:

- First digit is '1' (not 9)
- Remap '1' → '9': 99899 (as we saw above)

**Step 3: Finding the minimum value**
To minimize the number, we want to make it as small as possible. The strategy depends on whether the first digit can be made 0:

- If the first digit is not '1', we can remap it to '0'
- If the first digit is '1', we need to find the first non-0 and non-1 digit to remap to '0'

For `11891`:

- First digit is '1', so we can't remap it to '0' (that would create a leading zero)
- Look for first digit that's not '0' or '1': third digit is '8'
- Remap '8' → '0': 11091

**Step 4: Calculate the difference**
Maximum: 99899
Minimum: 11091
Difference: 99899 - 11091 = 88808

## Brute Force Approach

A naive approach would be to try all possible digit remappings:

1. For each of the 10 digits (0-9) as the source digit
2. For each of the 9 possible target digits (excluding the source itself)
3. Apply the remapping to create a new number
4. Track the maximum and minimum values

This would require 10 × 9 = 90 transformations for each number. While this might work for small inputs, it's inefficient and doesn't leverage the key insight that we only need to consider specific remappings based on the number's structure.

The brute force fails to recognize that:

- We only care about remappings that affect the most significant digits for maximum/minimum
- Many remappings produce identical or clearly suboptimal results
- We can determine the optimal remappings directly without trying all combinations

## Optimal Solution

The optimal solution uses greedy reasoning:

1. **For maximum**: Find the first digit from left that's not '9', remap it to '9'
2. **For minimum**:
   - If first digit is not '1', remap it to '0'
   - If first digit is '1', find first digit that's not '0' or '1', remap it to '0'

<div class="code-group">

```python
# Time: O(n) where n is number of digits | Space: O(n) for string conversion
def minMaxDifference(num: int) -> int:
    # Convert number to string for easy digit manipulation
    num_str = str(num)

    # Step 1: Find digit to remap for maximum value
    max_digit = None
    for digit in num_str:
        if digit != '9':
            max_digit = digit  # First non-9 digit from left
            break

    # Create maximum number by replacing max_digit with '9'
    # If all digits are '9', max_num remains the same
    max_num = num_str if max_digit is None else num_str.replace(max_digit, '9')

    # Step 2: Find digit to remap for minimum value
    min_digit = None
    # Check first digit - special case for leading zeros
    if num_str[0] != '1':
        min_digit = num_str[0]  # Can safely remap first digit to '0'
    else:
        # First digit is '1', find first non-0 and non-1 digit
        for digit in num_str:
            if digit != '0' and digit != '1':
                min_digit = digit
                break

    # Create minimum number by replacing min_digit with '0'
    # If no suitable min_digit found (all digits are 0 or 1), min_num remains the same
    min_num = num_str if min_digit is None else num_str.replace(min_digit, '0')

    # Step 3: Convert back to integers and calculate difference
    return int(max_num) - int(min_num)
```

```javascript
// Time: O(n) where n is number of digits | Space: O(n) for string conversion
function minMaxDifference(num) {
  // Convert number to string for easy digit manipulation
  const numStr = num.toString();

  // Step 1: Find digit to remap for maximum value
  let maxDigit = null;
  for (let digit of numStr) {
    if (digit !== "9") {
      maxDigit = digit; // First non-9 digit from left
      break;
    }
  }

  // Create maximum number by replacing maxDigit with '9'
  // If all digits are '9', maxNum remains the same
  const maxNum = maxDigit === null ? numStr : numStr.replaceAll(maxDigit, "9");

  // Step 2: Find digit to remap for minimum value
  let minDigit = null;
  // Check first digit - special case for leading zeros
  if (numStr[0] !== "1") {
    minDigit = numStr[0]; // Can safely remap first digit to '0'
  } else {
    // First digit is '1', find first non-0 and non-1 digit
    for (let digit of numStr) {
      if (digit !== "0" && digit !== "1") {
        minDigit = digit;
        break;
      }
    }
  }

  // Create minimum number by replacing minDigit with '0'
  // If no suitable minDigit found (all digits are 0 or 1), minNum remains the same
  const minNum = minDigit === null ? numStr : numStr.replaceAll(minDigit, "0");

  // Step 3: Convert back to integers and calculate difference
  return parseInt(maxNum) - parseInt(minNum);
}
```

```java
// Time: O(n) where n is number of digits | Space: O(n) for string conversion
class Solution {
    public int minMaxDifference(int num) {
        // Convert number to string for easy digit manipulation
        String numStr = Integer.toString(num);

        // Step 1: Find digit to remap for maximum value
        Character maxDigit = null;
        for (char digit : numStr.toCharArray()) {
            if (digit != '9') {
                maxDigit = digit;  // First non-9 digit from left
                break;
            }
        }

        // Create maximum number by replacing maxDigit with '9'
        // If all digits are '9', maxNum remains the same
        String maxNumStr = maxDigit == null ?
            numStr : numStr.replace(maxDigit, '9');

        // Step 2: Find digit to remap for minimum value
        Character minDigit = null;
        // Check first digit - special case for leading zeros
        if (numStr.charAt(0) != '1') {
            minDigit = numStr.charAt(0);  // Can safely remap first digit to '0'
        } else {
            // First digit is '1', find first non-0 and non-1 digit
            for (char digit : numStr.toCharArray()) {
                if (digit != '0' && digit != '1') {
                    minDigit = digit;
                    break;
                }
            }
        }

        // Create minimum number by replacing minDigit with '0'
        // If no suitable minDigit found (all digits are 0 or 1), minNum remains the same
        String minNumStr = minDigit == null ?
            numStr : numStr.replace(minDigit, '0');

        // Step 3: Convert back to integers and calculate difference
        return Integer.parseInt(maxNumStr) - Integer.parseInt(minNumStr);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one to find the digit for maximum, and one to find the digit for minimum
- Each pass takes O(n) time where n is the number of digits
- The string replacement operations also take O(n) time
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We create strings for the number representation: O(n)
- The replaced strings also require O(n) space
- Total auxiliary space: O(n)

## Common Mistakes

1. **Not handling the leading zero case for minimum**: The most common mistake is trying to remap the first digit to '0' when it's '1', which would create a number with leading zeros. Always check if the first digit is '1' before deciding what to remap for the minimum.

2. **Assuming only one digit changes**: Remember that remapping affects ALL occurrences of a digit. Some candidates mistakenly think they're changing just one digit position rather than transforming every instance of a chosen digit.

3. **Forgetting the "all digits are 9" case**: When all digits are '9', there's no digit to remap for maximum value. The code should handle this by leaving the number unchanged rather than trying to replace a non-existent digit.

4. **Using integer division instead of string manipulation**: While mathematically possible, using integer division and modulus to extract digits makes the logic more complex and error-prone. String conversion simplifies digit analysis and replacement.

## When You'll See This Pattern

This problem uses **greedy digit manipulation**, a pattern seen in several other LeetCode problems:

1. **Maximum Swap (LeetCode 670)**: Similar concept of making one change to maximize a number, though in that problem you swap two digits rather than remap one digit.

2. **Next Greater Element III (LeetCode 556)**: Involves finding the next permutation of digits to create the next greater number, requiring careful digit analysis and manipulation.

3. **Monotone Increasing Digits (LeetCode 738)**: Requires finding the largest number less than or equal to N with monotone increasing digits, using similar digit-by-digit analysis.

The core pattern is analyzing digits from most significant to least significant and making greedy choices based on position value.

## Key Takeaways

1. **Position matters more than value**: When manipulating numbers for maximum/minimum, the most significant digits have the greatest impact. Always process digits from left to right.

2. **Greedy works for digit problems**: For problems involving single transformations to optimize a number, a greedy approach that focuses on the most significant changeable digit is often optimal.

3. **Watch for edge cases with zeros**: Leading zeros are invalid in numbers, so any transformation that could create them requires special handling, especially when minimizing.

[Practice this problem on CodeJeet](/problem/maximum-difference-by-remapping-a-digit)
