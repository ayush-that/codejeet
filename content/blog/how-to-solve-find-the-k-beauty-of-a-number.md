---
title: "How to Solve Find the K-Beauty of a Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the K-Beauty of a Number. Easy difficulty, 63.1% acceptance rate. Topics: Math, String, Sliding Window."
date: "2027-08-22"
category: "dsa-patterns"
tags: ["find-the-k-beauty-of-a-number", "math", "string", "sliding-window", "easy"]
---

# How to Solve Find the K-Beauty of a Number

This problem asks us to find all length-`k` substrings of a number `num` (when represented as a string) that are divisors of `num`. While conceptually straightforward, it tests your ability to work with string manipulation, integer conversion, and modular arithmetic—all while avoiding subtle pitfalls like leading zeros and off-by-one errors.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `num = 430043` and `k = 2`.

1. Convert `num` to string: `"430043"`
2. We'll examine every substring of length 2:
   - Substring 1: `"43"` → integer 43
     - Check: 430043 % 43 = 0? Yes (430043 ÷ 43 = 10001 exactly)
     - Count: 1
   - Substring 2: `"30"` → integer 30
     - Check: 430043 % 30 = 23? No
     - Count: 1
   - Substring 3: `"00"` → integer 0
     - Check: Division by zero! We must skip this since 0 can't divide anything
     - Count: 1
   - Substring 4: `"04"` → integer 4
     - Check: 430043 % 4 = 3? No
     - Count: 1
   - Substring 5: `"43"` → integer 43
     - Check: 430043 % 43 = 0? Yes
     - Count: 2

Final answer: 2

Notice two key observations:

1. We need to handle the case where a substring converts to 0 (avoid division by zero)
2. The same numeric value can appear in different positions (`"43"` appears twice)

## Brute Force Approach

The most straightforward approach is to:

1. Convert `num` to a string
2. Generate every possible substring of length `k`
3. Convert each substring to an integer
4. Check if it's non-zero and divides `num` evenly

While this approach is correct, it's worth noting that for a string of length `n`, there are `n - k + 1` substrings. Each substring conversion takes O(k) time, making the overall time complexity O(k × (n - k + 1)). Since `k` can be up to the length of the number (which for 32-bit integers is at most 10 digits), this is actually acceptable. However, we can optimize slightly by avoiding repeated string-to-integer conversions.

What makes this problem interesting is that there's no dramatically more efficient algorithm needed—the constraints are small enough that the brute force approach is essentially optimal. The challenge lies in implementing it correctly and handling edge cases.

## Optimal Solution

The optimal solution uses a sliding window approach to efficiently extract substrings and convert them to integers. We maintain the current substring value as we slide through the number, updating it in O(1) time rather than converting from scratch each time.

<div class="code-group">

```python
# Time: O(n) where n is the number of digits in num
# Space: O(1) - we only use a few integer variables
def divisorSubstrings(num: int, k: int) -> int:
    # Convert num to string for easy character access
    num_str = str(num)
    n = len(num_str)

    # Initialize count of k-beauty and the current window value
    count = 0
    window_val = 0

    # Build the first window of size k
    for i in range(k):
        window_val = window_val * 10 + int(num_str[i])

    # Check if the first window is a divisor (and not zero)
    if window_val != 0 and num % window_val == 0:
        count += 1

    # Slide the window across the rest of the string
    for i in range(k, n):
        # Remove the leftmost digit from the window value
        # Example: window_val = 430, removing '4' (digit at i-k = 0)
        # 430 - 4 * 10^(k-1) = 430 - 4 * 100 = 30
        left_digit = int(num_str[i - k])
        window_val -= left_digit * (10 ** (k - 1))

        # Shift left to make room for new digit and add the new digit
        window_val *= 10
        window_val += int(num_str[i])

        # Check if current window value divides num (and is not zero)
        if window_val != 0 and num % window_val == 0:
            count += 1

    return count
```

```javascript
// Time: O(n) where n is the number of digits in num
// Space: O(1) - we only use a few variables
function divisorSubstrings(num, k) {
  // Convert num to string for character access
  const numStr = num.toString();
  const n = numStr.length;

  // Initialize count and current window value
  let count = 0;
  let windowVal = 0;

  // Build the first window of size k
  for (let i = 0; i < k; i++) {
    windowVal = windowVal * 10 + parseInt(numStr[i]);
  }

  // Check if first window is a divisor (and not zero)
  if (windowVal !== 0 && num % windowVal === 0) {
    count++;
  }

  // Slide window across the rest of the string
  for (let i = k; i < n; i++) {
    // Remove leftmost digit from window value
    const leftDigit = parseInt(numStr[i - k]);
    // Calculate 10^(k-1) efficiently
    const power = Math.pow(10, k - 1);
    windowVal -= leftDigit * power;

    // Shift left and add new digit
    windowVal *= 10;
    windowVal += parseInt(numStr[i]);

    // Check if current window divides num (and is not zero)
    if (windowVal !== 0 && num % windowVal === 0) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n) where n is the number of digits in num
// Space: O(1) - constant extra space
class Solution {
    public int divisorSubstrings(int num, int k) {
        // Convert num to string for character access
        String numStr = Integer.toString(num);
        int n = numStr.length();

        // Initialize count and current window value
        int count = 0;
        int windowVal = 0;

        // Build the first window of size k
        for (int i = 0; i < k; i++) {
            windowVal = windowVal * 10 + (numStr.charAt(i) - '0');
        }

        // Check if first window is a divisor (and not zero)
        if (windowVal != 0 && num % windowVal == 0) {
            count++;
        }

        // Slide window across the rest of the string
        for (int i = k; i < n; i++) {
            // Remove leftmost digit from window value
            int leftDigit = numStr.charAt(i - k) - '0';
            // Calculate 10^(k-1)
            int power = (int)Math.pow(10, k - 1);
            windowVal -= leftDigit * power;

            // Shift left and add new digit
            windowVal *= 10;
            windowVal += numStr.charAt(i) - '0';

            // Check if current window divides num (and is not zero)
            if (windowVal != 0 && num % windowVal == 0) {
                count++;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Converting the number to a string takes O(n) time where n is the number of digits
- Building the first window takes O(k) time
- Sliding the window across n-k positions takes O(n-k) time
- Each window operation (removing left digit, adding right digit, checking divisibility) takes O(1) time
- Total: O(n) + O(k) + O(n-k) = O(n)

**Space Complexity: O(1)**

- We use a few integer variables (count, window_val, etc.)
- The string representation could be considered O(n), but it's typically considered O(1) for fixed-width integers since n ≤ 10 for 32-bit integers

## Common Mistakes

1. **Not handling the zero case**: When a substring like "00" or "0" converts to integer 0, attempting `num % 0` will cause a division by zero error. Always check if the substring value is non-zero before performing the modulo operation.

2. **Off-by-one errors in the sliding window**: When calculating which digit to remove, using `i-k` (not `i-k+1`) is correct because `i` is the index of the new digit being added, and we want to remove the digit that was added `k` steps ago.

3. **Inefficient string-to-integer conversion**: Converting each substring from scratch takes O(k) time per substring. The sliding window approach updates the value in O(1) time by removing the left digit and adding the right digit.

4. **Forgetting that the same numeric value can appear multiple times**: Substrings "43" and "43" at different positions both count if they divide the number. Don't use a set to store unique values unless the problem specifically asks for unique divisors.

## When You'll See This Pattern

The sliding window technique used here appears in many string and array problems:

1. **Maximum Average Subarray I (LeetCode 643)**: Find a contiguous subarray of length k with maximum average value. Similar sliding window approach.

2. **Permutation in String (LeetCode 567)**: Check if one string contains a permutation of another string as a substring. Uses sliding window with character frequency counts.

3. **Find All Anagrams in a String (LeetCode 438)**: Find all starting indices of anagram substrings. Another sliding window with frequency counting problem.

The pattern is recognizable when you need to examine all contiguous subarrays/substrings of a fixed length, and you can update your computation incrementally as the window slides.

## Key Takeaways

1. **Sliding window optimization**: When processing all substrings of fixed length, maintain the current window's value and update it incrementally rather than recomputing from scratch each time.

2. **Edge case vigilance**: Always consider zero values when doing division operations. Test with inputs that contain zeros in various positions.

3. **String-number conversion tricks**: Remember that `char - '0'` in Java/C++ or `int(digit)` in Python converts a digit character to its integer value efficiently.

[Practice this problem on CodeJeet](/problem/find-the-k-beauty-of-a-number)
