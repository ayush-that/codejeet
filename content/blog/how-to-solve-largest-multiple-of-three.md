---
title: "How to Solve Largest Multiple of Three — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Largest Multiple of Three. Hard difficulty, 33.1% acceptance rate. Topics: Array, Math, Dynamic Programming, Greedy, Sorting."
date: "2029-07-20"
category: "dsa-patterns"
tags: ["largest-multiple-of-three", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Largest Multiple of Three

This problem asks us to form the largest possible number (as a string) that's divisible by 3, using digits from a given array. The challenge comes from two competing requirements: we need the largest number possible (which means using as many digits as possible, sorted in descending order), but we also need the sum of digits to be divisible by 3. When the total sum isn't divisible by 3, we must remove the smallest possible digits to make it divisible by 3 while keeping the number as large as possible.

## Visual Walkthrough

Let's trace through an example: `digits = [8, 7, 6, 1, 0]`

**Step 1: Sort the digits in descending order**
Sorted: `[8, 7, 6, 1, 0]` (already sorted in this case)

**Step 2: Calculate total sum of digits**
Sum = 8 + 7 + 6 + 1 + 0 = 22

**Step 3: Check divisibility by 3**
22 ÷ 3 = 7 remainder 1 (not divisible by 3)

**Step 4: Find digits to remove**
Since remainder is 1, we need to remove digits whose value mod 3 equals 1.

- Digits with remainder 1: `[1, 7]` (7%3=1, 1%3=1)
- We should remove the smallest such digit: `1`

**Step 5: Form the number**
Remove `1`, remaining digits: `[8, 7, 6, 0]`
Concatenate: `"8760"`

**Step 6: Handle edge cases**

- If we get all zeros, return `"0"` not `"000"`
- If no valid combination exists, return `""`

Let's try another example where we need to remove two digits: `digits = [9, 8, 7, 6, 5, 4, 3, 2, 1]`

Sum = 45 (divisible by 3, so we can use all digits)
Sorted descending: `[9, 8, 7, 6, 5, 4, 3, 2, 1]`
Result: `"987654321"`

## Brute Force Approach

A brute force approach would try all possible subsets of digits, check if their sum is divisible by 3, and keep track of the largest valid number. For each subset:

1. Check if sum of digits is divisible by 3
2. Sort digits in descending order to form the largest number
3. Compare with current best solution

However, this approach is exponential (O(2ⁿ)) since there are 2ⁿ possible subsets for n digits. With n up to 10⁴, this is completely infeasible. Even for moderate n, generating and testing all subsets is too slow.

The key insight we need is that we don't need to try all combinations - we can use mathematical properties of numbers divisible by 3.

## Optimized Approach

The optimal solution uses these mathematical facts:

1. A number is divisible by 3 if and only if the sum of its digits is divisible by 3
2. To maximize the number, we want to:
   - Use as many digits as possible
   - Sort digits in descending order
3. When the total sum isn't divisible by 3, we need to remove the smallest possible digits to make it divisible

**Step-by-step reasoning:**

1. **Sort digits in descending order** - This ensures the largest number when concatenated
2. **Calculate total sum** and find remainder when divided by 3
3. **If remainder is 0**: We can use all digits
4. **If remainder is 1**: We need to remove digits summing to remainder 1
   - Option 1: Remove one digit with remainder 1 (smallest such digit)
   - Option 2: Remove two digits with remainder 2 (two smallest such digits)
   - Choose the option that removes fewer digits, or if equal, removes smaller total value
5. **If remainder is 2**: We need to remove digits summing to remainder 2
   - Option 1: Remove one digit with remainder 2 (smallest such digit)
   - Option 2: Remove two digits with remainder 1 (two smallest such digits)
   - Choose the option that removes fewer digits, or if equal, removes smaller total value
6. **Handle special cases**:
   - If we remove all digits, return `""`
   - If remaining digits are all zeros, return `"0"` not `"000..."`
   - If no valid removal exists, return `""`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for storing digits
def largestMultipleOfThree(digits):
    """
    Returns the largest multiple of 3 that can be formed from given digits.

    Approach:
    1. Sort digits in descending order to maximize the number
    2. Calculate total sum and find remainder mod 3
    3. Based on remainder, remove minimal digits to make sum divisible by 3
    4. Handle edge cases like all zeros or empty result
    """
    # Step 1: Sort digits in descending order
    digits.sort(reverse=True)

    # Step 2: Calculate total sum and group digits by remainder mod 3
    total_sum = sum(digits)
    remainder = total_sum % 3

    # Group digits by their remainder when divided by 3
    remainder_1 = []  # digits with remainder 1
    remainder_2 = []  # digits with remainder 2

    for digit in digits:
        if digit % 3 == 1:
            remainder_1.append(digit)
        elif digit % 3 == 2:
            remainder_2.append(digit)

    # Step 3: Handle different remainder cases
    if remainder == 1:
        # Need to remove digits summing to remainder 1
        if remainder_1:
            # Option 1: Remove one digit with remainder 1
            digits.remove(remainder_1[-1])  # Remove smallest remainder_1 digit
        elif len(remainder_2) >= 2:
            # Option 2: Remove two digits with remainder 2
            digits.remove(remainder_2[-1])  # Remove smallest remainder_2 digit
            digits.remove(remainder_2[-2])  # Remove second smallest remainder_2 digit
        else:
            return ""  # No valid removal possible

    elif remainder == 2:
        # Need to remove digits summing to remainder 2
        if remainder_2:
            # Option 1: Remove one digit with remainder 2
            digits.remove(remainder_2[-1])  # Remove smallest remainder_2 digit
        elif len(remainder_1) >= 2:
            # Option 2: Remove two digits with remainder 1
            digits.remove(remainder_1[-1])  # Remove smallest remainder_1 digit
            digits.remove(remainder_1[-2])  # Remove second smallest remainder_1 digit
        else:
            return ""  # No valid removal possible

    # Step 4: Handle edge cases
    if not digits:
        return ""  # All digits removed

    # If all remaining digits are 0, return "0" not "000..."
    if all(d == 0 for d in digits):
        return "0"

    # Convert digits to string and join
    return ''.join(map(str, digits))
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for storing digits
function largestMultipleOfThree(digits) {
  /**
   * Returns the largest multiple of 3 that can be formed from given digits.
   *
   * Approach:
   * 1. Sort digits in descending order to maximize the number
   * 2. Calculate total sum and find remainder mod 3
   * 3. Based on remainder, remove minimal digits to make sum divisible by 3
   * 4. Handle edge cases like all zeros or empty result
   */

  // Step 1: Sort digits in descending order
  digits.sort((a, b) => b - a);

  // Step 2: Calculate total sum and group digits by remainder mod 3
  let totalSum = digits.reduce((sum, digit) => sum + digit, 0);
  let remainder = totalSum % 3;

  // Group digits by their remainder when divided by 3
  let remainder1 = []; // digits with remainder 1
  let remainder2 = []; // digits with remainder 2

  for (let digit of digits) {
    if (digit % 3 === 1) {
      remainder1.push(digit);
    } else if (digit % 3 === 2) {
      remainder2.push(digit);
    }
  }

  // Step 3: Handle different remainder cases
  if (remainder === 1) {
    // Need to remove digits summing to remainder 1
    if (remainder1.length > 0) {
      // Option 1: Remove one digit with remainder 1
      let toRemove = remainder1[remainder1.length - 1]; // Smallest remainder1 digit
      let index = digits.lastIndexOf(toRemove);
      digits.splice(index, 1);
    } else if (remainder2.length >= 2) {
      // Option 2: Remove two digits with remainder 2
      let toRemove1 = remainder2[remainder2.length - 1]; // Smallest remainder2 digit
      let toRemove2 = remainder2[remainder2.length - 2]; // Second smallest remainder2 digit

      let index1 = digits.lastIndexOf(toRemove1);
      digits.splice(index1, 1);

      // Find index again after first removal
      let index2 = digits.lastIndexOf(toRemove2);
      digits.splice(index2, 1);
    } else {
      return ""; // No valid removal possible
    }
  } else if (remainder === 2) {
    // Need to remove digits summing to remainder 2
    if (remainder2.length > 0) {
      // Option 1: Remove one digit with remainder 2
      let toRemove = remainder2[remainder2.length - 1]; // Smallest remainder2 digit
      let index = digits.lastIndexOf(toRemove);
      digits.splice(index, 1);
    } else if (remainder1.length >= 2) {
      // Option 2: Remove two digits with remainder 1
      let toRemove1 = remainder1[remainder1.length - 1]; // Smallest remainder1 digit
      let toRemove2 = remainder1[remainder1.length - 2]; // Second smallest remainder1 digit

      let index1 = digits.lastIndexOf(toRemove1);
      digits.splice(index1, 1);

      // Find index again after first removal
      let index2 = digits.lastIndexOf(toRemove2);
      digits.splice(index2, 1);
    } else {
      return ""; // No valid removal possible
    }
  }

  // Step 4: Handle edge cases
  if (digits.length === 0) {
    return ""; // All digits removed
  }

  // If all remaining digits are 0, return "0" not "000..."
  if (digits.every((d) => d === 0)) {
    return "0";
  }

  // Convert digits to string and join
  return digits.join("");
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for storing digits
import java.util.*;

class Solution {
    public String largestMultipleOfThree(int[] digits) {
        /**
         * Returns the largest multiple of 3 that can be formed from given digits.
         *
         * Approach:
         * 1. Sort digits in descending order to maximize the number
         * 2. Calculate total sum and find remainder mod 3
         * 3. Based on remainder, remove minimal digits to make sum divisible by 3
         * 4. Handle edge cases like all zeros or empty result
         */

        // Step 1: Convert to list and sort in descending order
        List<Integer> digitList = new ArrayList<>();
        for (int digit : digits) {
            digitList.add(digit);
        }
        digitList.sort((a, b) -> b - a);  // Sort descending

        // Step 2: Calculate total sum and group digits by remainder mod 3
        int totalSum = 0;
        for (int digit : digitList) {
            totalSum += digit;
        }
        int remainder = totalSum % 3;

        // Group digits by their remainder when divided by 3
        List<Integer> remainder1 = new ArrayList<>();  // digits with remainder 1
        List<Integer> remainder2 = new ArrayList<>();  // digits with remainder 2

        for (int digit : digitList) {
            if (digit % 3 == 1) {
                remainder1.add(digit);
            } else if (digit % 3 == 2) {
                remainder2.add(digit);
            }
        }

        // Step 3: Handle different remainder cases
        if (remainder == 1) {
            // Need to remove digits summing to remainder 1
            if (!remainder1.isEmpty()) {
                // Option 1: Remove one digit with remainder 1
                int toRemove = remainder1.get(remainder1.size() - 1); // Smallest remainder1 digit
                digitList.remove(Integer.valueOf(toRemove));
            } else if (remainder2.size() >= 2) {
                // Option 2: Remove two digits with remainder 2
                int toRemove1 = remainder2.get(remainder2.size() - 1); // Smallest remainder2 digit
                int toRemove2 = remainder2.get(remainder2.size() - 2); // Second smallest remainder2 digit
                digitList.remove(Integer.valueOf(toRemove1));
                digitList.remove(Integer.valueOf(toRemove2));
            } else {
                return "";  // No valid removal possible
            }
        } else if (remainder == 2) {
            // Need to remove digits summing to remainder 2
            if (!remainder2.isEmpty()) {
                // Option 1: Remove one digit with remainder 2
                int toRemove = remainder2.get(remainder2.size() - 1); // Smallest remainder2 digit
                digitList.remove(Integer.valueOf(toRemove));
            } else if (remainder1.size() >= 2) {
                // Option 2: Remove two digits with remainder 1
                int toRemove1 = remainder1.get(remainder1.size() - 1); // Smallest remainder1 digit
                int toRemove2 = remainder1.get(remainder1.size() - 2); // Second smallest remainder1 digit
                digitList.remove(Integer.valueOf(toRemove1));
                digitList.remove(Integer.valueOf(toRemove2));
            } else {
                return "";  // No valid removal possible
            }
        }

        // Step 4: Handle edge cases
        if (digitList.isEmpty()) {
            return "";  // All digits removed
        }

        // If all remaining digits are 0, return "0" not "000..."
        boolean allZeros = true;
        for (int digit : digitList) {
            if (digit != 0) {
                allZeros = false;
                break;
            }
        }
        if (allZeros) {
            return "0";
        }

        // Convert digits to string and join
        StringBuilder result = new StringBuilder();
        for (int digit : digitList) {
            result.append(digit);
        }
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the digits takes O(n log n) time
- Calculating the sum and grouping digits by remainder takes O(n) time
- Removing digits from the list takes O(n) time in worst case
- Overall dominated by the sorting step

**Space Complexity: O(n)**

- We need to store the digits in a list/array
- We create additional lists for grouping digits by remainder (remainder1 and remainder2)
- In Python/JavaScript, we work with the original array; in Java, we convert to ArrayList

## Common Mistakes

1. **Forgetting to sort in descending order**: The problem asks for the _largest_ multiple of 3, so digits must be arranged in descending order. Sorting ascending or not sorting at all gives a smaller number.

2. **Not handling the "all zeros" case properly**: When all remaining digits are zero, we should return `"0"` not `"000..."`. This is a common edge case that trips up many candidates.

3. **Incorrect removal strategy**: When the sum has remainder 1, candidates might only try to remove one digit with remainder 1, forgetting that removing two digits with remainder 2 also works (and vice versa for remainder 2).

4. **Using the wrong data structure for removal**: In Java, using `ArrayList.remove(Integer.valueOf(x))` removes the first occurrence. We need to be careful to remove the correct (smallest) digit when there are duplicates.

## When You'll See This Pattern

This problem combines mathematical insight with greedy selection. Similar patterns appear in:

1. **Largest Number (LeetCode 179)**: Also requires sorting with a custom comparator to form the largest number from digits.

2. **Partition Equal Subset Sum (LeetCode 416)**: Uses remainder properties and dynamic programming to partition arrays based on sums.

3. **Continuous Subarray Sum (LeetCode 523)**: Uses remainder properties to find subarrays with sums divisible by k.

The key pattern is using mathematical properties (like divisibility rules) to reduce an exponential search space to a manageable greedy or DP solution.

## Key Takeaways

1. **Divisibility rules are powerful optimization tools**: The rule that a number is divisible by 3 if the sum of its digits is divisible by 3 transforms the problem from checking all permutations to managing digit sums.

2. **Greedy removal of smallest digits**: When you need to adjust a sum to meet a divisibility condition while maximizing the result, always remove the smallest possible digits that achieve the required adjustment.

3. **Edge cases matter**: The "all zeros" case and empty result case are critical. Always test with `[0,0,0]` and cases where no valid combination exists.

[Practice this problem on CodeJeet](/problem/largest-multiple-of-three)
