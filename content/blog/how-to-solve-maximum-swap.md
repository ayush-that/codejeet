---
title: "How to Solve Maximum Swap — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Swap. Medium difficulty, 51.9% acceptance rate. Topics: Math, Greedy."
date: "2027-05-02"
category: "dsa-patterns"
tags: ["maximum-swap", "math", "greedy", "medium"]
---

# How to Solve Maximum Swap

You're given an integer and can swap two digits exactly once to create the largest possible number. The challenge lies in identifying which swap yields the maximum improvement—it's not always about swapping the largest digit to the front, but finding the optimal trade that considers digit positions and values.

## Visual Walkthrough

Let's trace through `num = 2736` step by step:

**Step 1: Convert to digits**  
We get `[2, 7, 3, 6]` (positions 0 through 3 from left to right).

**Step 2: Find the rightmost occurrence of each digit**  
We track the last position where each digit (0-9) appears:

- Digit 2: position 0
- Digit 7: position 1
- Digit 3: position 2
- Digit 6: position 3

**Step 3: Scan from left to right**  
We want to swap a smaller left digit with a larger right digit that's as far right as possible.

- Position 0: digit `2`. Check if any digit > 2 exists to the right. Yes, digits 7, 3, and 6 are all > 2. We want the largest possible digit (7) at the rightmost position (position 1).
- Position 1: digit `7`. Check digits > 7 to the right. None exist (3 and 6 are < 7).
- We found our swap: position 0 (digit 2) with position 1 (digit 7).

**Step 4: Perform the swap**  
Swap digits at positions 0 and 1: `[7, 2, 3, 6]` → `7236`

**Result:** `7236` is indeed larger than the original `2736`.

Why not swap with digit 6 at position 3? Because swapping 2 with 7 gives `7236`, while swapping 2 with 6 gives `6732`, which is smaller. The optimal swap uses the largest possible digit at the rightmost position.

## Brute Force Approach

A naive solution would try every possible pair of positions and swap them, keeping track of the maximum result. For an n-digit number, there are C(n,2) = n(n-1)/2 possible swaps. We'd convert the number to a list of digits, try each swap, convert back to integer, and track the maximum.

**Why it's insufficient:**  
While this approach works correctly, it has O(n²) time complexity. For a 32-bit integer with up to 10 digits, 45 swaps might seem acceptable, but the pattern doesn't scale well conceptually, and interviewers expect the optimal O(n) greedy solution.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def maximumSwap_brute(num):
    """
    Brute force: try all possible swaps
    """
    num_str = list(str(num))
    max_num = num

    # Try every possible pair (i, j) where i < j
    for i in range(len(num_str)):
        for j in range(i + 1, len(num_str)):
            # Swap digits at positions i and j
            num_str[i], num_str[j] = num_str[j], num_str[i]

            # Convert back to integer
            current = int(''.join(num_str))
            max_num = max(max_num, current)

            # Swap back for next iteration
            num_str[i], num_str[j] = num_str[j], num_str[i]

    return max_num
```

```javascript
// Time: O(n²) | Space: O(n)
function maximumSwapBrute(num) {
  // Convert number to array of characters
  const numStr = num.toString().split("");
  let maxNum = num;

  // Try every possible pair (i, j) where i < j
  for (let i = 0; i < numStr.length; i++) {
    for (let j = i + 1; j < numStr.length; j++) {
      // Swap digits at positions i and j
      [numStr[i], numStr[j]] = [numStr[j], numStr[i]];

      // Convert back to number
      const current = parseInt(numStr.join(""));
      maxNum = Math.max(maxNum, current);

      // Swap back for next iteration
      [numStr[i], numStr[j]] = [numStr[j], numStr[i]];
    }
  }

  return maxNum;
}
```

```java
// Time: O(n²) | Space: O(n)
public int maximumSwapBrute(int num) {
    // Convert number to character array
    char[] digits = Integer.toString(num).toCharArray();
    int maxNum = num;

    // Try every possible pair (i, j) where i < j
    for (int i = 0; i < digits.length; i++) {
        for (int j = i + 1; j < digits.length; j++) {
            // Swap digits at positions i and j
            char temp = digits[i];
            digits[i] = digits[j];
            digits[j] = temp;

            // Convert back to integer
            int current = Integer.parseInt(new String(digits));
            maxNum = Math.max(maxNum, current);

            // Swap back for next iteration
            temp = digits[i];
            digits[i] = digits[j];
            digits[j] = temp;
        }
    }

    return maxNum;
}
```

</div>

## Optimized Approach

The key insight is that we want to swap a left digit with a larger digit as far right as possible. Specifically:

1. We scan from left to right looking for the first digit that has a larger digit somewhere to its right
2. When we find such a digit, we want to swap it with the **largest possible digit** at the **rightmost position** (to maximize the value)

**Why greedy works:**

- If we swap a digit at position `i` with a larger digit at position `j`, the value increases more when:
  - The digit at `j` is as large as possible (preferably 9)
  - The position `j` is as far right as possible (affects more significant places)
- We can precompute the last occurrence of each digit (0-9) to quickly find the rightmost position of any digit
- The first position where we find a digit that has a larger digit to its right is optimal because swapping earlier positions affects more significant digits

**Step-by-step reasoning:**

1. Convert the number to a list of digits for easy manipulation
2. Create an array `last[10]` to store the last occurrence index of each digit (0-9)
3. For each position from left to right:
   - Check if there exists any digit `d` greater than the current digit
   - If yes, find the rightmost position of the largest such digit
   - Swap and return immediately (we only need one swap)
4. If no such digit exists, return the original number

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) where n is number of digits
def maximumSwap(num):
    """
    Greedy approach: find the first digit that has a larger digit
    to its right, then swap it with the largest such digit at the
    rightmost position.
    """
    # Convert number to list of characters for easy swapping
    digits = list(str(num))

    # Track the last occurrence of each digit (0-9)
    # Initialize with -1 meaning digit hasn't appeared
    last = [-1] * 10

    # Record the last position where each digit appears
    for i, digit in enumerate(digits):
        last[int(digit)] = i

    # Scan from left to right
    for i, digit in enumerate(digits):
        current_digit = int(digit)

        # Check if there's any larger digit to the right
        # We check from 9 down to current_digit+1 to find the largest possible
        for larger_digit in range(9, current_digit, -1):
            # If this larger digit exists and is to the right of current position
            if last[larger_digit] > i:
                # Swap current digit with the larger digit at its last occurrence
                j = last[larger_digit]
                digits[i], digits[j] = digits[j], digits[i]

                # Convert back to integer and return immediately
                # We only need one swap
                return int(''.join(digits))

    # If no swap improves the number, return original
    return num
```

```javascript
// Time: O(n) | Space: O(n) where n is number of digits
function maximumSwap(num) {
  // Convert number to array of characters for easy swapping
  const digits = num.toString().split("");

  // Track the last occurrence of each digit (0-9)
  // Initialize with -1 meaning digit hasn't appeared
  const last = new Array(10).fill(-1);

  // Record the last position where each digit appears
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i]);
    last[digit] = i;
  }

  // Scan from left to right
  for (let i = 0; i < digits.length; i++) {
    const currentDigit = parseInt(digits[i]);

    // Check if there's any larger digit to the right
    // We check from 9 down to currentDigit+1 to find the largest possible
    for (let largerDigit = 9; largerDigit > currentDigit; largerDigit--) {
      // If this larger digit exists and is to the right of current position
      if (last[largerDigit] > i) {
        // Swap current digit with the larger digit at its last occurrence
        const j = last[largerDigit];
        [digits[i], digits[j]] = [digits[j], digits[i]];

        // Convert back to number and return immediately
        // We only need one swap
        return parseInt(digits.join(""));
      }
    }
  }

  // If no swap improves the number, return original
  return num;
}
```

```java
// Time: O(n) | Space: O(n) where n is number of digits
public int maximumSwap(int num) {
    // Convert number to character array for easy manipulation
    char[] digits = Integer.toString(num).toCharArray();

    // Track the last occurrence of each digit (0-9)
    // Initialize with -1 meaning digit hasn't appeared
    int[] last = new int[10];
    Arrays.fill(last, -1);

    // Record the last position where each digit appears
    for (int i = 0; i < digits.length; i++) {
        int digit = digits[i] - '0';  // Convert char to int
        last[digit] = i;
    }

    // Scan from left to right
    for (int i = 0; i < digits.length; i++) {
        int currentDigit = digits[i] - '0';

        // Check if there's any larger digit to the right
        // We check from 9 down to currentDigit+1 to find the largest possible
        for (int largerDigit = 9; largerDigit > currentDigit; largerDigit--) {
            // If this larger digit exists and is to the right of current position
            if (last[largerDigit] > i) {
                // Swap current digit with the larger digit at its last occurrence
                int j = last[largerDigit];
                char temp = digits[i];
                digits[i] = digits[j];
                digits[j] = temp;

                // Convert back to integer and return immediately
                // We only need one swap
                return Integer.parseInt(new String(digits));
            }
        }
    }

    // If no swap improves the number, return original
    return num;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the number of digits in the input number.

- Converting to string/list: O(n)
- Building the `last` array: O(n)
- Scanning and checking for larger digits: O(n × 10) = O(n) since 10 is constant
- The inner loop runs at most 9 iterations per digit, which is constant

**Space Complexity: O(n)** for storing the digit list and the `last` array.

- The digit list requires O(n) space
- The `last` array requires O(10) = O(1) space
- Total: O(n) dominated by the digit list

## Common Mistakes

1. **Swapping with the first larger digit found:** Candidates often swap with the first larger digit to the right, but the optimal swap uses the largest possible digit at the rightmost position. For `1993`, swapping the first 1 with the first 9 gives `9193`, but swapping with the last 9 gives `9913`, which is larger.

2. **Not handling already maximum numbers:** For numbers like `98765` (already in descending order), no swap improves the value. The algorithm should return the original number, not attempt an unnecessary swap.

3. **Incorrect digit comparison:** When comparing characters instead of their integer values, `'9' > '10'` is true in lexicographic order but incorrect numerically. Always convert to integers for comparison.

4. **Forgetting single-digit numbers:** For `num = 5`, there's nothing to swap. The algorithm should handle this edge case correctly by returning the original number.

5. **Multiple swaps:** The problem allows only one swap. Some candidates try to find multiple improvement opportunities, but we must stop after the first valid swap.

## When You'll See This Pattern

This greedy "rightmost largest" pattern appears in several optimization problems:

1. **Next Greater Element III** (LeetCode 556): Find the smallest integer greater than n with the same digits. Uses similar right-to-left scanning to find the swap point.

2. **Next Permutation** (LeetCode 31): Rearrange numbers into the lexicographically next greater permutation. Involves finding the rightmost ascending pair and swapping with the smallest larger element to the right.

3. **Remove K Digits** (LeetCode 402): Create the smallest possible number by removing k digits. Uses a monotonic stack to maintain increasing order, similar to our greedy selection.

The core pattern is: when optimizing digit arrangements, often the optimal strategy involves scanning from one end and making decisions based on what's available at the other end.

## Key Takeaways

1. **Greedy with precomputation works:** By tracking the last occurrence of each digit, we can make optimal swap decisions in O(n) time without trying all possibilities.

2. **Rightmost matters for swaps:** When swapping to maximize a number, prefer swapping with the rightmost occurrence of the largest possible digit—this affects less significant positions while still providing maximum value increase.

3. **Single-pass scanning with auxiliary data:** Many digit manipulation problems can be solved efficiently with a single left-to-right or right-to-left scan combined with precomputed information about digit positions or values.

Related problems: [Create Maximum Number](/problem/create-maximum-number)
