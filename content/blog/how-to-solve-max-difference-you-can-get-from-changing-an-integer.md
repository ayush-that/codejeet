---
title: "How to Solve Max Difference You Can Get From Changing an Integer — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Max Difference You Can Get From Changing an Integer. Medium difficulty, 48.8% acceptance rate. Topics: Math, Greedy."
date: "2027-03-29"
category: "dsa-patterns"
tags: ["max-difference-you-can-get-from-changing-an-integer", "math", "greedy", "medium"]
---

# How to Solve "Max Difference You Can Get From Changing an Integer"

You're given an integer `num` and can perform two digit replacement operations: first to maximize the number, then to minimize it (or vice versa). The challenge is to find the maximum possible difference between these two results. What makes this tricky is that you must replace **all occurrences** of a chosen digit with another digit, and you need to strategically choose which digits to replace to get the largest spread between your maximum and minimum results.

## Visual Walkthrough

Let's trace through `num = 555` step by step:

1. **First operation (maximize):** We want the largest number possible. The digit `5` appears everywhere. If we replace `5` with `9`, we get `999`. That's the maximum.

2. **Second operation (minimize):** Starting from the original `555` (not from `999` - each operation works on the original), we want the smallest number possible. If we replace `5` with `0`, we get `000` which is just `0`. But wait - we can't replace the first digit with `0` because that would create a number with leading zeros, which isn't valid. So we need to be careful about that constraint.

3. **Calculate difference:** `999 - 0 = 999`

Now let's try a more interesting example: `num = 9283`

**Maximizing:**

- Look at the first digit `9`. We can't increase it since it's already the maximum digit.
- Look at the next non-9 digit: `2`. If we replace all `2`s with `9`, we get `9983`.
- But actually, we should replace the first non-9 digit we find with `9`. That's `2` at position 1 (0-indexed), so replace all `2`s with `9`: `9983`.

**Minimizing:**

- If the first digit is `1`, we can't replace it with `0` (leading zero issue).
- If the first digit is not `1`, we can replace it with `1` to minimize.
- Here first digit is `9`, so replace all `9`s with `1`: `1283`.
- But wait, what if we can do better? What if we replace a different digit?
- Actually, we need to find the first digit that's not `0` or `1` (since we want to minimize) and replace it with `0` if it's not the first digit, or with `1` if it is the first digit.

**Correct minimization for `9283`:**

- First digit is `9` (not `1`), so we can replace all `9`s with `1`: `1283`
- Alternative: replace `8` (not first digit) with `0`: `9203` → smaller than `1283`? No, `9203` > `1283`.
- Alternative: replace `2` with `0`: `9083` → even larger.
- So `1283` is indeed the minimum.

**Difference:** `9983 - 1283 = 8700`

## Brute Force Approach

A brute force approach would try all possible digit replacements for both operations:

1. For the first operation, try replacing every digit `x` (0-9) with every digit `y` (0-9)
2. For each resulting number, try all possible replacements for the second operation
3. Calculate the difference and track the maximum

This would be O(10 × 10 × 10 × 10 × n) = O(10,000 × n) where n is the number of digits. For a 10-digit number, that's 100,000 operations - technically feasible but inefficient and not elegant.

The key insight is that we don't need to try all combinations. For maximization, we only care about replacing the first non-9 digit with 9. For minimization, we have two cases based on whether the first digit is 1 or not.

## Optimized Approach

The optimal solution uses greedy reasoning:

**Maximization Strategy:**

- Convert the number to a string for easy digit manipulation
- Find the first digit that is not `9`
- Replace all occurrences of that digit with `9`
- If all digits are already `9`, the number is already maximized

**Minimization Strategy (more nuanced):**
We have two cases:

1. **If the first digit is not `1`:** We can safely replace all occurrences of the first digit with `1` to minimize the number without creating leading zeros.
2. **If the first digit is `1`:** We need to be more careful. We look for the first digit that is neither `0` nor `1` (since we can't replace `1` with `0` in the first position, and replacing `0` with something else won't help minimization). We replace all occurrences of that digit with `0`.

**Why this works:**

- For maximization: Replacing any digit with `9` gives the maximum increase. Doing it from the leftmost non-9 digit maximizes the impact.
- For minimization: We want the smallest possible number without leading zeros. If the first digit isn't `1`, making it `1` gives the smallest possible first digit. If it's already `1`, we look for the next opportunity to reduce the number by replacing a non-zero, non-one digit with `0`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of digits | Space: O(n) for string conversion
def maxDiff(self, num: int) -> int:
    # Convert number to string for easy digit manipulation
    s = str(num)

    # Step 1: Find maximum number
    max_num = list(s)  # Create mutable copy

    # Find first digit that is not '9'
    for digit in max_num:
        if digit != '9':
            # Replace all occurrences of this digit with '9'
            replace_digit = digit
            for i in range(len(max_num)):
                if max_num[i] == replace_digit:
                    max_num[i] = '9'
            break  # We only need to do this once

    # Convert back to integer
    max_val = int(''.join(max_num))

    # Step 2: Find minimum number
    min_num = list(s)  # Create another mutable copy

    # Case 1: First digit is not '1'
    if min_num[0] != '1':
        replace_digit = min_num[0]
        for i in range(len(min_num)):
            if min_num[i] == replace_digit:
                min_num[i] = '1'
    else:
        # Case 2: First digit is '1'
        # Find first digit that is not '0' and not '1'
        for digit in min_num:
            if digit not in ('0', '1'):
                replace_digit = digit
                for i in range(len(min_num)):
                    if min_num[i] == replace_digit:
                        min_num[i] = '0'
                break  # We only need to do this once

    # Convert back to integer
    min_val = int(''.join(min_num))

    # Step 3: Return the difference
    return max_val - min_val
```

```javascript
// Time: O(n) where n is number of digits | Space: O(n) for string conversion
function maxDiff(num) {
  // Convert number to string for easy digit manipulation
  let s = num.toString();

  // Step 1: Find maximum number
  let maxNum = s.split(""); // Create mutable array

  // Find first digit that is not '9'
  for (let digit of maxNum) {
    if (digit !== "9") {
      // Replace all occurrences of this digit with '9'
      let replaceDigit = digit;
      for (let i = 0; i < maxNum.length; i++) {
        if (maxNum[i] === replaceDigit) {
          maxNum[i] = "9";
        }
      }
      break; // We only need to do this once
    }
  }

  // Convert back to integer
  let maxVal = parseInt(maxNum.join(""));

  // Step 2: Find minimum number
  let minNum = s.split(""); // Create another mutable array

  // Case 1: First digit is not '1'
  if (minNum[0] !== "1") {
    let replaceDigit = minNum[0];
    for (let i = 0; i < minNum.length; i++) {
      if (minNum[i] === replaceDigit) {
        minNum[i] = "1";
      }
    }
  } else {
    // Case 2: First digit is '1'
    // Find first digit that is not '0' and not '1'
    for (let digit of minNum) {
      if (digit !== "0" && digit !== "1") {
        let replaceDigit = digit;
        for (let i = 0; i < minNum.length; i++) {
          if (minNum[i] === replaceDigit) {
            minNum[i] = "0";
          }
        }
        break; // We only need to do this once
      }
    }
  }

  // Convert back to integer
  let minVal = parseInt(minNum.join(""));

  // Step 3: Return the difference
  return maxVal - minVal;
}
```

```java
// Time: O(n) where n is number of digits | Space: O(n) for string conversion
class Solution {
    public int maxDiff(int num) {
        // Convert number to string for easy digit manipulation
        String s = Integer.toString(num);
        char[] chars = s.toCharArray();

        // Step 1: Find maximum number
        char[] maxNum = chars.clone();  // Create mutable copy

        // Find first digit that is not '9'
        for (char digit : maxNum) {
            if (digit != '9') {
                // Replace all occurrences of this digit with '9'
                char replaceDigit = digit;
                for (int i = 0; i < maxNum.length; i++) {
                    if (maxNum[i] == replaceDigit) {
                        maxNum[i] = '9';
                    }
                }
                break;  // We only need to do this once
            }
        }

        // Convert back to integer
        int maxVal = Integer.parseInt(new String(maxNum));

        // Step 2: Find minimum number
        char[] minNum = chars.clone();  // Create another mutable copy

        // Case 1: First digit is not '1'
        if (minNum[0] != '1') {
            char replaceDigit = minNum[0];
            for (int i = 0; i < minNum.length; i++) {
                if (minNum[i] == replaceDigit) {
                    minNum[i] = '1';
                }
            }
        } else {
            // Case 2: First digit is '1'
            // Find first digit that is not '0' and not '1'
            for (char digit : minNum) {
                if (digit != '0' && digit != '1') {
                    char replaceDigit = digit;
                    for (int i = 0; i < minNum.length; i++) {
                        if (minNum[i] == replaceDigit) {
                            minNum[i] = '0';
                        }
                    }
                    break;  // We only need to do this once
                }
            }
        }

        // Convert back to integer
        int minVal = Integer.parseInt(new String(minNum));

        // Step 3: Return the difference
        return maxVal - minVal;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of digits in `num`. We make two passes through the digits: one for maximization and one for minimization. Each pass involves scanning the digits and potentially replacing them, but each digit is processed a constant number of times.

**Space Complexity:** O(n) for storing the string representation and mutable character arrays. We need to create copies of the digit string to perform replacements without modifying the original.

## Common Mistakes

1. **Not handling the leading zero constraint:** The most common mistake is trying to replace the first digit with `0` when minimizing. This would create an invalid number with leading zeros. Always check if you're modifying the first digit and ensure the replacement isn't `0`.

2. **Forgetting that replacements affect all occurrences:** Some candidates try to replace only specific positions, but the problem requires replacing ALL occurrences of the chosen digit. Make sure your replacement loop goes through the entire number.

3. **Incorrect minimization logic when first digit is 1:** When the first digit is already `1`, you can't replace it with `0`. You need to look for the next digit that's not `0` or `1` to replace with `0`. Missing this case leads to suboptimal minimization.

4. **Assuming you can use different replacements for each operation:** Remember that each operation works on the ORIGINAL number, not on the result of the previous operation. Some candidates mistakenly chain the operations, applying the second replacement to the already-modified number from the first operation.

## When You'll See This Pattern

This problem combines greedy digit manipulation with constraint handling. You'll see similar patterns in:

1. **Maximum Swap (LeetCode 670):** Similar digit manipulation to maximize a number by swapping at most two digits. The greedy "find first non-9 digit" approach appears here too.

2. **Monotone Increasing Digits (LeetCode 738):** Requires manipulating digits to satisfy a monotonic property, with similar careful handling of digit replacements from left to right.

3. **Next Greater Element III (LeetCode 556):** Involves finding the next permutation of digits, which requires similar digit analysis and replacement logic.

These problems all require analyzing digits from left to right, making greedy decisions, and handling edge cases around digit boundaries (especially the first digit).

## Key Takeaways

1. **Greedy digit manipulation often works from left to right:** The leftmost digits have the greatest impact on a number's value, so start your analysis there.

2. **Constraints create special cases:** The "no leading zeros" constraint creates two distinct cases for minimization. Always identify constraints early and handle them explicitly in your logic.

3. **String representation is your friend:** When you need to manipulate individual digits, converting to a string or character array is often cleaner than using modulo arithmetic.

[Practice this problem on CodeJeet](/problem/max-difference-you-can-get-from-changing-an-integer)
