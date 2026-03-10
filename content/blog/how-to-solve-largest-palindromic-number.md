---
title: "How to Solve Largest Palindromic Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Palindromic Number. Medium difficulty, 37.0% acceptance rate. Topics: Hash Table, String, Greedy, Counting."
date: "2028-06-23"
category: "dsa-patterns"
tags: ["largest-palindromic-number", "hash-table", "string", "greedy", "medium"]
---

# How to Solve Largest Palindromic Number

You're given a string of digits, and you need to construct the largest possible palindrome number using those digits. The catch? You can't have leading zeros, and you don't have to use all digits. This problem is interesting because it combines palindrome construction with greedy selection and careful handling of edge cases like zeros and odd-length palindromes.

## Visual Walkthrough

Let's trace through `num = "444947137"` step by step:

1. **Count digit frequencies:**
   - '0': 0, '1': 2, '2': 0, '3': 1, '4': 4, '5': 0, '6': 0, '7': 2, '8': 0, '9': 1

2. **Build the palindrome from the outside in:**
   - Start with an empty left half and right half
   - Process digits from '9' down to '0' (to get largest number)
   - For digit '9': count = 1 → can't form a pair (need 2), but can be middle if needed
   - For digit '8': count = 0 → skip
   - For digit '7': count = 2 → add "7" to left, will mirror to right later
   - For digit '6': count = 0 → skip
   - For digit '5': count = 0 → skip
   - For digit '4': count = 4 → add "44" to left (use 2 pairs)
   - For digit '3': count = 1 → can't form pair
   - For digit '2': count = 0 → skip
   - For digit '1': count = 2 → add "1" to left
   - For digit '0': count = 0 → skip

3. **Current left half: "7441"** (from processing 7, 4, 4, 1)

4. **Find middle digit:**
   - Check digits from '9' down to '0' for any remaining odd counts
   - '9': count was 1, not used → can be middle
   - '7': used both → count now 0
   - '4': used 4 → count now 0
   - '3': count 1 → can be middle
   - '1': used both → count now 0
   - Choose largest possible: '9' > '3', so middle = "9"

5. **Construct full palindrome:**
   - Left: "7441"
   - Middle: "9"
   - Right: reverse of left = "1447"
   - Result: "74419447"

This is indeed the largest palindrome possible from these digits!

## Brute Force Approach

A naive approach would be to:

1. Generate all possible subsets of digits
2. Generate all permutations of each subset
3. Check if each permutation is a palindrome
4. Keep track of the largest valid palindrome

This is extremely inefficient. For a string of length n:

- There are 2ⁿ possible subsets
- Each subset of size k has k! permutations
- Total complexity is O(2ⁿ × n!), which is astronomical even for small n

Even with optimizations (like only considering subsets with appropriate digit counts for palindromes), this approach is impractical. We need a smarter counting-based solution.

## Optimized Approach

The key insight is that a palindrome reads the same forwards and backwards, which means:

1. For most digits, they must appear in pairs (one on left, mirrored on right)
2. At most one digit can appear in the middle (if the palindrome has odd length)
3. To maximize the number:
   - Use larger digits first (process from '9' down to '0')
   - Place the largest possible digit in the middle
   - Avoid leading zeros

The algorithm works like this:

1. **Count frequencies** of each digit (0-9)
2. **Build left half greedily** from largest to smallest digit:
   - For each digit, use as many complete pairs as possible
   - Add digit × (count // 2) to left half
3. **Find middle digit**: Look for the largest digit with odd count remaining
4. **Construct palindrome**: left + middle + reverse(left)
5. **Handle edge cases**:
   - If result would start with '0', return "0" (or the middle digit if exists)
   - If no digits can be used at all, return "0"

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of num
# Space: O(1) for fixed-size count array of 10 elements
def largestPalindromic(num: str) -> str:
    # Step 1: Count frequency of each digit (0-9)
    count = [0] * 10
    for digit in num:
        count[int(digit)] += 1

    # Step 2: Build the left half of palindrome
    # We process from largest digit (9) to smallest (0) to maximize value
    left_half = []

    for digit in range(9, -1, -1):
        # Skip if no occurrences of this digit
        if count[digit] == 0:
            continue

        # Special case: digit 0
        # We can't have leading zeros in the palindrome
        if digit == 0 and not left_half:
            # If left_half is empty, adding zeros would create leading zeros
            # So we skip zeros entirely unless they can be in the middle
            continue

        # Use as many pairs as possible
        pairs = count[digit] // 2
        left_half.extend([str(digit)] * pairs)
        count[digit] -= pairs * 2  # Update remaining count

    # Step 3: Find the middle digit (largest digit with odd count remaining)
    middle = ""
    for digit in range(9, -1, -1):
        if count[digit] > 0:
            middle = str(digit)
            break

    # Step 4: Construct the full palindrome
    # If left_half is empty, we can only use middle digit (if exists)
    if not left_half:
        return middle if middle else "0"

    # Create right half by reversing left half
    right_half = left_half[::-1]

    # Combine: left + middle + right
    result = ''.join(left_half) + middle + ''.join(right_half)

    # Edge case: result should not be empty
    return result if result else "0"
```

```javascript
// Time: O(n) where n is length of num
// Space: O(1) for fixed-size count array of 10 elements
function largestPalindromic(num) {
  // Step 1: Count frequency of each digit (0-9)
  const count = new Array(10).fill(0);
  for (let char of num) {
    count[parseInt(char)]++;
  }

  // Step 2: Build the left half of palindrome
  // Process from largest digit (9) to smallest (0) to maximize value
  const leftHalf = [];

  for (let digit = 9; digit >= 0; digit--) {
    // Skip if no occurrences of this digit
    if (count[digit] === 0) continue;

    // Special case: digit 0
    // We can't have leading zeros in the palindrome
    if (digit === 0 && leftHalf.length === 0) {
      // If leftHalf is empty, adding zeros would create leading zeros
      continue;
    }

    // Use as many pairs as possible
    const pairs = Math.floor(count[digit] / 2);
    for (let i = 0; i < pairs; i++) {
      leftHalf.push(digit.toString());
    }
    count[digit] -= pairs * 2; // Update remaining count
  }

  // Step 3: Find the middle digit (largest digit with odd count remaining)
  let middle = "";
  for (let digit = 9; digit >= 0; digit--) {
    if (count[digit] > 0) {
      middle = digit.toString();
      break;
    }
  }

  // Step 4: Construct the full palindrome
  // If leftHalf is empty, we can only use middle digit (if exists)
  if (leftHalf.length === 0) {
    return middle || "0";
  }

  // Create right half by reversing left half
  const rightHalf = [...leftHalf].reverse();

  // Combine: left + middle + right
  const result = leftHalf.join("") + middle + rightHalf.join("");

  // Edge case: result should not be empty
  return result || "0";
}
```

```java
// Time: O(n) where n is length of num
// Space: O(1) for fixed-size count array of 10 elements
class Solution {
    public String largestPalindromic(String num) {
        // Step 1: Count frequency of each digit (0-9)
        int[] count = new int[10];
        for (char c : num.toCharArray()) {
            count[c - '0']++;
        }

        // Step 2: Build the left half of palindrome
        // Process from largest digit (9) to smallest (0) to maximize value
        StringBuilder leftHalf = new StringBuilder();

        for (int digit = 9; digit >= 0; digit--) {
            // Skip if no occurrences of this digit
            if (count[digit] == 0) continue;

            // Special case: digit 0
            // We can't have leading zeros in the palindrome
            if (digit == 0 && leftHalf.length() == 0) {
                // If leftHalf is empty, adding zeros would create leading zeros
                continue;
            }

            // Use as many pairs as possible
            int pairs = count[digit] / 2;
            for (int i = 0; i < pairs; i++) {
                leftHalf.append(digit);
            }
            count[digit] -= pairs * 2; // Update remaining count
        }

        // Step 3: Find the middle digit (largest digit with odd count remaining)
        String middle = "";
        for (int digit = 9; digit >= 0; digit--) {
            if (count[digit] > 0) {
                middle = String.valueOf(digit);
                break;
            }
        }

        // Step 4: Construct the full palindrome
        // If leftHalf is empty, we can only use middle digit (if exists)
        if (leftHalf.length() == 0) {
            return middle.isEmpty() ? "0" : middle;
        }

        // Create right half by reversing left half
        String rightHalf = new StringBuilder(leftHalf).reverse().toString();

        // Combine: left + middle + right
        String result = leftHalf.toString() + middle + rightHalf;

        // Edge case: result should not be empty
        return result.isEmpty() ? "0" : result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting digits: O(n) where n is the length of the input string
- Building left half: O(10) = O(1) since we only process 10 digits
- Finding middle: O(10) = O(1)
- Constructing result: O(n) in worst case (when we use most digits)
- Total: O(n) + O(1) + O(1) + O(n) = O(n)

**Space Complexity: O(1)**

- The count array has fixed size 10, regardless of input size
- The result string could be O(n), but this is output space, not auxiliary space
- Additional space for left_half is O(n) in worst case, but this is also part of the output construction

## Common Mistakes

1. **Forgetting to handle leading zeros**: Candidates often add zeros to the left half without checking if it's empty. If the first digit is '0', the entire number has a leading zero. The fix: skip zeros when left_half is empty.

2. **Incorrect middle selection**: Some candidates pick the first digit with odd count they encounter. Since we process from 0 to 9, this gives the smallest possible middle digit. We need the largest, so process from 9 down to 0.

3. **Not handling all-zero input**: For input like "0000", the correct output is "0" (not "0000" or ""). Many solutions return empty string or "0000" which are invalid.

4. **Off-by-one in pair calculation**: Using `count[digit] / 2` without integer division or floor can cause issues in languages where division returns float. Always use integer division.

## When You'll See This Pattern

This problem uses **frequency counting + greedy construction**, a pattern common in:

1. **"Longest Palindrome" (LeetCode 409)**: Similar concept of building palindrome from character counts, but simpler since it's about length not value.
2. **"Rearrange String k Distance Apart" (LeetCode 358)**: Uses frequency counting and greedy placement with constraints.
3. **"Maximum Number of Balloons" (LeetCode 1189)**: Count frequencies and find maximum complete sets.

The core pattern: when you need to construct something optimal from a multiset of items, count frequencies first, then apply greedy rules for construction.

## Key Takeaways

1. **Palindromes are symmetric**: When building palindromes from available characters/digits, think in terms of pairs and possibly one middle element.

2. **Greedy works with sorted choices**: To maximize numerical value, always use the largest available digits first for the most significant positions (left side).

3. **Edge cases matter**: Leading zeros and all-zero inputs require special handling. Always test with "0", "0000", "000123", and "1001" to catch these issues.

Related problems: [Longest Palindrome](/problem/longest-palindrome)
