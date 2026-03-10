---
title: "How to Solve Finding 3-Digit Even Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Finding 3-Digit Even Numbers. Easy difficulty, 78.8% acceptance rate. Topics: Array, Hash Table, Recursion, Sorting, Enumeration."
date: "2026-04-19"
category: "dsa-patterns"
tags: ["finding-3-digit-even-numbers", "array", "hash-table", "recursion", "easy"]
---

# How to Solve Finding 3-Digit Even Numbers

You're given an array of digits (0-9) that may contain duplicates, and you need to find all unique 3-digit even numbers that can be formed by concatenating any three digits from the array. The digits can be used multiple times from the array, but each number must be even and have exactly three digits (no leading zeros). What makes this problem interesting is balancing the need for uniqueness with the ability to reuse digits from the array.

## Visual Walkthrough

Let's trace through a concrete example: `digits = [1, 2, 2, 4]`

We need to generate all unique 3-digit even numbers. Let's think through the constraints:

1. **No leading zeros**: The first digit (hundreds place) cannot be 0
2. **Even number**: The last digit (units place) must be 0, 2, 4, 6, or 8
3. **Digits can be reused**: Since we're selecting from the array, we can use the same digit multiple times if it appears multiple times in the array

Let's build numbers systematically:

**Step 1: Choose the last digit (must be even)**
From our array, the even digits available are: 2, 2, 4

**Step 2: Choose the first digit (cannot be 0)**
From our array, available digits are: 1, 2, 2, 4

**Step 3: Choose the middle digit (any digit from array)**
From our array, available digits are: 1, 2, 2, 4

Now let's generate some numbers:

- If last digit = 2, first digit = 1, middle digit = 2 → 122 ✓
- If last digit = 2, first digit = 1, middle digit = 4 → 142 ✓
- If last digit = 2, first digit = 2, middle digit = 1 → 212 ✓
- If last digit = 2, first digit = 2, middle digit = 2 → 222 ✓
- If last digit = 2, first digit = 2, middle digit = 4 → 242 ✓
- If last digit = 2, first digit = 4, middle digit = 1 → 412 ✓
- If last digit = 2, first digit = 4, middle digit = 2 → 422 ✓
- If last digit = 2, first digit = 4, middle digit = 4 → 442 ✓

- If last digit = 4, first digit = 1, middle digit = 2 → 124 ✓
- If last digit = 4, first digit = 1, middle digit = 2 (other 2) → 124 (duplicate!)
- If last digit = 4, first digit = 2, middle digit = 1 → 214 ✓
- If last digit = 4, first digit = 2, middle digit = 2 → 224 ✓
- If last digit = 4, first digit = 2, middle digit = 4 → 244 ✓
- If last digit = 4, first digit = 4, middle digit = 1 → 414 ✓
- If last digit = 4, first digit = 4, middle digit = 2 → 424 ✓
- If last digit = 4, first digit = 4, middle digit = 4 → 444 ✓

We need to remove duplicates: 124 appears twice. Final unique numbers sorted: [122, 124, 142, 212, 214, 222, 224, 242, 244, 412, 414, 422, 424, 442, 444]

## Brute Force Approach

The most straightforward approach is to generate all possible 3-digit combinations using three nested loops, check if each number is even and has no leading zero, then store unique results. While conceptually simple, this approach has several inefficiencies:

1. **Redundant work**: We generate many invalid numbers (odd numbers, numbers with leading zeros)
2. **Duplicate generation**: We generate the same number multiple times when digits repeat
3. **Inefficient checking**: We check conditions after generating the full number

The brute force would have O(n³) time complexity where n is the number of digits (up to 10, so at most 1000 iterations, which is actually acceptable for this problem size). However, we can optimize by being more selective about which digits we choose for each position.

## Optimal Solution

The key insight is to work backwards from the constraints:

1. Start by choosing the last digit (must be even)
2. Then choose the first digit (cannot be 0)
3. Finally choose the middle digit (any digit)
4. Use a set to automatically handle uniqueness

We'll convert the array to a set to easily check which digits are available, but we need to handle counts properly since digits can be reused. Actually, since we're selecting from the original array (not a set), and digits can be reused, we just need to check if a digit exists in the array at all.

<div class="code-group">

```python
# Time: O(10^3) = O(1) since we have at most 10 digits and 3 positions
# Space: O(1) for the result set (at most 9*10*5 = 450 possible numbers)
def findEvenNumbers(self, digits):
    """
    Find all unique 3-digit even numbers that can be formed from given digits.

    Approach:
    1. Use a frequency counter to track available digits
    2. Generate all valid combinations by:
       - Choosing an even digit for the last position
       - Choosing a non-zero digit for the first position
       - Choosing any digit for the middle position
    3. Use a set to ensure uniqueness
    4. Sort the result before returning

    Args:
        digits: List of integers (0-9)

    Returns:
        List of unique 3-digit even numbers in ascending order
    """
    from collections import Counter

    # Count frequency of each digit in the input
    freq = Counter(digits)
    result = set()

    # Iterate through all possible 3-digit combinations
    for i in range(10):           # First digit (hundreds place)
        if i == 0:                # Skip leading zeros
            continue
        if freq[i] == 0:          # Digit not available
            continue

        # Decrement count for first digit (temporarily using it)
        freq[i] -= 1

        for j in range(10):       # Second digit (tens place)
            if freq[j] == 0:      # Digit not available
                continue

            # Decrement count for second digit
            freq[j] -= 1

            for k in range(0, 10, 2):  # Third digit (units place, must be even)
                if freq[k] == 0:       # Even digit not available
                    continue

                # Found a valid combination
                num = i * 100 + j * 10 + k
                result.add(num)

            # Restore count for second digit
            freq[j] += 1

        # Restore count for first digit
        freq[i] += 1

    # Convert set to sorted list and return
    return sorted(result)
```

```javascript
// Time: O(10^3) = O(1) since we have at most 10 digits and 3 positions
// Space: O(1) for the result set (at most 9*10*5 = 450 possible numbers)
function findEvenNumbers(digits) {
  /**
   * Find all unique 3-digit even numbers that can be formed from given digits.
   *
   * Approach:
   * 1. Use a frequency counter to track available digits
   * 2. Generate all valid combinations by:
   *    - Choosing an even digit for the last position
   *    - Choosing a non-zero digit for the first position
   *    - Choosing any digit for the middle position
   * 3. Use a set to ensure uniqueness
   * 4. Sort the result before returning
   *
   * @param {number[]} digits - Array of integers (0-9)
   * @return {number[]} - Sorted array of unique 3-digit even numbers
   */

  // Create frequency map of digits
  const freq = new Array(10).fill(0);
  for (const digit of digits) {
    freq[digit]++;
  }

  const result = new Set();

  // Generate all valid 3-digit combinations
  for (let i = 1; i < 10; i++) {
    // First digit: 1-9 (no leading zero)
    if (freq[i] === 0) continue; // Digit not available

    // Use first digit
    freq[i]--;

    for (let j = 0; j < 10; j++) {
      // Second digit: 0-9
      if (freq[j] === 0) continue; // Digit not available

      // Use second digit
      freq[j]--;

      for (let k = 0; k < 10; k += 2) {
        // Third digit: even numbers only
        if (freq[k] === 0) continue; // Even digit not available

        // Form the 3-digit number
        const num = i * 100 + j * 10 + k;
        result.add(num);
      }

      // Restore second digit
      freq[j]++;
    }

    // Restore first digit
    freq[i]++;
  }

  // Convert set to sorted array
  return Array.from(result).sort((a, b) => a - b);
}
```

```java
// Time: O(10^3) = O(1) since we have at most 10 digits and 3 positions
// Space: O(1) for the result set (at most 9*10*5 = 450 possible numbers)
public int[] findEvenNumbers(int[] digits) {
    /**
     * Find all unique 3-digit even numbers that can be formed from given digits.
     *
     * Approach:
     * 1. Use a frequency counter to track available digits
     * 2. Generate all valid combinations by:
     *    - Choosing an even digit for the last position
     *    - Choosing a non-zero digit for the first position
     *    - Choosing any digit for the middle position
     * 3. Use a set to ensure uniqueness
     * 4. Sort the result before returning
     *
     * @param digits - Array of integers (0-9)
     * @return - Sorted array of unique 3-digit even numbers
     */

    // Count frequency of each digit
    int[] freq = new int[10];
    for (int digit : digits) {
        freq[digit]++;
    }

    Set<Integer> resultSet = new HashSet<>();

    // Generate all valid combinations
    for (int i = 1; i < 10; i++) {      // First digit: 1-9 (no leading zero)
        if (freq[i] == 0) continue;     // Digit not available

        // Use first digit
        freq[i]--;

        for (int j = 0; j < 10; j++) {  // Second digit: 0-9
            if (freq[j] == 0) continue; // Digit not available

            // Use second digit
            freq[j]--;

            for (int k = 0; k < 10; k += 2) {  // Third digit: even numbers only
                if (freq[k] == 0) continue;    // Even digit not available

                // Form the 3-digit number
                int num = i * 100 + j * 10 + k;
                resultSet.add(num);
            }

            // Restore second digit
            freq[j]++;
        }

        // Restore first digit
        freq[i]++;
    }

    // Convert set to sorted array
    int[] result = new int[resultSet.size()];
    int index = 0;
    for (int num : resultSet) {
        result[index++] = num;
    }
    Arrays.sort(result);
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We iterate through all possible digits for three positions: 10 × 10 × 5 = 500 iterations maximum
- The 5 comes from only checking even digits (0, 2, 4, 6, 8) for the last position
- Sorting the result takes O(m log m) where m ≤ 450 (9 first digits × 10 second digits × 5 third digits)
- Since these are constant bounds, overall time is O(1)

**Space Complexity: O(1)**

- Frequency array uses O(10) = O(1) space
- Result set stores at most 450 numbers = O(1)
- No recursion or dynamic data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle leading zeros**: The most common error is generating numbers like 012 or 034. Remember that a 3-digit number cannot start with 0. Always check that the first digit (hundreds place) is 1-9.

2. **Not handling duplicates properly**: When the input contains duplicate digits (like [2,2,2]), candidates might generate duplicate numbers. Using a set for the results automatically handles uniqueness, but you must also ensure you're not using the same digit instance multiple times when it only appears once.

3. **Incorrect digit availability checking**: When you use a digit, you need to check if it's still available. The frequency counter approach with increment/decrement ensures we don't use more copies of a digit than exist in the original array.

4. **Missing the even constraint**: Some candidates check if the entire number is even at the end, but it's more efficient to only consider even digits for the last position from the start. This reduces the search space.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Constraint-based generation**: Similar to "Letter Combinations of a Phone Number" (LeetCode 17), where you generate combinations based on constraints (which letters map to which digits).

2. **Combinatorial enumeration with constraints**: Like "Combination Sum" (LeetCode 39) problems, where you generate all combinations that meet certain criteria, though here the order matters (it's a permutation, not a combination).

3. **Frequency counting for resource management**: The pattern of using a frequency counter to track available resources appears in problems like "Task Scheduler" (LeetCode 621) and "Maximum Number of Balloons" (LeetCode 1189).

## Key Takeaways

1. **Work backwards from constraints**: When a problem has multiple constraints (no leading zero, must be even), start with the most restrictive constraint first (even last digit), then handle other constraints (non-zero first digit).

2. **Use frequency counters for "available resources"**: When you need to track how many times you can use each element from a multiset, frequency counters are more efficient than checking the original array repeatedly.

3. **Sets automatically handle uniqueness**: When the problem asks for unique results and you might generate duplicates, using a set to collect results saves you from manual duplicate removal.

Related problems: [Find Numbers with Even Number of Digits](/problem/find-numbers-with-even-number-of-digits), [Unique 3-Digit Even Numbers](/problem/unique-3-digit-even-numbers)
