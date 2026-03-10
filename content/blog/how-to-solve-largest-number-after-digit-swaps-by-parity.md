---
title: "How to Solve Largest Number After Digit Swaps by Parity — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Number After Digit Swaps by Parity. Easy difficulty, 65.0% acceptance rate. Topics: Sorting, Heap (Priority Queue)."
date: "2028-03-08"
category: "dsa-patterns"
tags: ["largest-number-after-digit-swaps-by-parity", "sorting", "heap-(priority-queue)", "easy"]
---

# How to Solve Largest Number After Digit Swaps by Parity

You're given a positive integer where you can swap any two digits that share the same parity (both odd or both even). Your task is to find the largest possible number after performing any number of such swaps. What makes this problem interesting is that you can't simply sort all digits—you can only rearrange digits within their parity groups. This constraint forces you to think about how to maximize the number while respecting the parity separation.

## Visual Walkthrough

Let's trace through an example: `num = 658217`

**Step 1: Identify digits and their parity**
Digits: 6, 5, 8, 2, 1, 7
Even digits: 6, 8, 2 (positions 0, 2, 3)
Odd digits: 5, 1, 7 (positions 1, 4, 5)

**Step 2: Sort digits within each parity group**
Even digits sorted descending: 8, 6, 2
Odd digits sorted descending: 7, 5, 1

**Step 3: Reconstruct the number**
We need to place the sorted digits back into their original positions based on parity:

- Position 0 (even) → largest even digit (8)
- Position 1 (odd) → largest odd digit (7)
- Position 2 (even) → next largest even digit (6)
- Position 3 (even) → next largest even digit (2)
- Position 4 (odd) → next largest odd digit (5)
- Position 5 (odd) → next largest odd digit (1)

Result: `876251`

**Step 4: Verify**
We started with 658217 and ended with 876251. Check that all swaps were valid:

- 6 and 8 are both even ✓
- 5 and 7 are both odd ✓
- 1 and 5 are both odd ✓
  The final number 876251 is indeed larger than the original.

## Brute Force Approach

A naive approach would be to try all possible sequences of swaps. Since we can perform any number of swaps, we could:

1. Generate all permutations of digits that maintain parity positions
2. Filter out invalid permutations (where digits change parity)
3. Find the maximum valid permutation

However, this approach is extremely inefficient. For an n-digit number, there are n! permutations to check. Even for a modest 10-digit number, that's 3.6 million permutations. Additionally, checking parity constraints for each permutation adds overhead.

The key insight is that we don't need to explore all permutations. Since we can swap any two digits of the same parity any number of times, each parity group can be independently sorted. This reduces the problem from exponential complexity to O(n log n).

## Optimal Solution

The optimal solution separates digits into even and odd groups, sorts each group in descending order, then reconstructs the number by placing the largest available digit of the correct parity at each position.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def largestInteger(num: int) -> int:
    # Convert the number to a list of digits for easier manipulation
    digits = list(str(num))

    # Separate digits into even and odd lists
    evens = []
    odds = []

    # Collect digits based on their parity
    for digit in digits:
        # Convert char to int to check parity
        if int(digit) % 2 == 0:
            evens.append(digit)
        else:
            odds.append(digit)

    # Sort each list in descending order
    # We sort in reverse so largest digits come first
    evens.sort(reverse=True)
    odds.sort(reverse=True)

    # Reconstruct the result
    result = []
    even_idx = 0  # Pointer for evens list
    odd_idx = 0   # Pointer for odds list

    for digit in digits:
        # Check parity of current position's original digit
        if int(digit) % 2 == 0:
            # Place the next largest even digit
            result.append(evens[even_idx])
            even_idx += 1
        else:
            # Place the next largest odd digit
            result.append(odds[odd_idx])
            odd_idx += 1

    # Convert list of characters back to integer
    return int(''.join(result))
```

```javascript
// Time: O(n log n) | Space: O(n)
function largestInteger(num) {
  // Convert number to string to access individual digits
  const digits = num.toString().split("");

  // Separate digits into even and odd arrays
  const evens = [];
  const odds = [];

  // Collect digits based on parity
  for (const digit of digits) {
    // Convert char to number to check parity
    const digitNum = parseInt(digit);
    if (digitNum % 2 === 0) {
      evens.push(digit);
    } else {
      odds.push(digit);
    }
  }

  // Sort each array in descending order
  evens.sort((a, b) => b - a);
  odds.sort((a, b) => b - a);

  // Reconstruct the result
  const result = [];
  let evenIdx = 0; // Pointer for evens array
  let oddIdx = 0; // Pointer for odds array

  for (const digit of digits) {
    // Check parity of current position's original digit
    const digitNum = parseInt(digit);
    if (digitNum % 2 === 0) {
      // Place the next largest even digit
      result.push(evens[evenIdx]);
      evenIdx++;
    } else {
      // Place the next largest odd digit
      result.push(odds[oddIdx]);
      oddIdx++;
    }
  }

  // Convert array back to number
  return parseInt(result.join(""));
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int largestInteger(int num) {
        // Convert number to string to access individual digits
        String numStr = Integer.toString(num);
        char[] digits = numStr.toCharArray();

        // Separate digits into even and odd lists
        List<Character> evens = new ArrayList<>();
        List<Character> odds = new ArrayList<>();

        // Collect digits based on parity
        for (char digitChar : digits) {
            int digit = digitChar - '0';  // Convert char to int
            if (digit % 2 == 0) {
                evens.add(digitChar);
            } else {
                odds.add(digitChar);
            }
        }

        // Sort each list in descending order
        Collections.sort(evens, Collections.reverseOrder());
        Collections.sort(odds, Collections.reverseOrder());

        // Reconstruct the result
        StringBuilder result = new StringBuilder();
        int evenIdx = 0;  // Pointer for evens list
        int oddIdx = 0;   // Pointer for odds list

        for (char digitChar : digits) {
            int digit = digitChar - '0';  // Convert char to int

            if (digit % 2 == 0) {
                // Place the next largest even digit
                result.append(evens.get(evenIdx));
                evenIdx++;
            } else {
                // Place the next largest odd digit
                result.append(odds.get(oddIdx));
                oddIdx++;
            }
        }

        // Convert back to integer
        return Integer.parseInt(result.toString());
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Converting the number to digits: O(n)
- Separating digits into even/odd groups: O(n)
- Sorting both groups: O(k log k + m log m) where k + m = n, which simplifies to O(n log n)
- Reconstructing the result: O(n)
- The dominant term is O(n log n) from sorting

**Space Complexity: O(n)**

- We store the digits in lists/arrays: O(n)
- We store separated even and odd digits: O(n) total
- The result string/array: O(n)
- Total space is linear in the number of digits

## Common Mistakes

1. **Forgetting that 0 is even**: Some candidates mistakenly treat 0 as odd or special. Remember: 0 % 2 == 0, so 0 is an even digit and can only be swapped with other even digits.

2. **Sorting in ascending instead of descending order**: To maximize the number, we need the largest digits first. Sorting in ascending order gives us the smallest possible number. Always double-check your sort direction.

3. **Mixing up indices when reconstructing**: When placing digits back, you must use the parity of the _original_ digit at each position, not the parity of the digit you're about to place. The position's parity constraint is fixed.

4. **Not handling single-digit numbers**: While the problem guarantees positive integers, a single-digit number should return itself since there are no swaps possible. The algorithm handles this correctly, but it's worth testing.

## When You'll See This Pattern

This problem uses the **"separate and conquer"** pattern where you:

1. Separate elements based on a property (parity in this case)
2. Process each group independently
3. Recombine the results

You'll see similar patterns in:

1. **Sort Array By Parity (LeetCode 905)**: Separate even and odd numbers, then concatenate them. The difference is that here we sort within groups for optimization.

2. **Sort Array By Parity II (LeetCode 922)**: Arrange array so that every even index has an even number and every odd index has an odd number. This also involves separating by parity but with positional constraints.

3. **Custom Sort String (LeetCode 791)**: Sort characters in a string according to a custom order. Similar separation and recombination logic applies.

## Key Takeaways

1. **Constraints define sorting boundaries**: When you can only swap elements within certain groups, you can sort each group independently. The overall structure is preserved while optimizing within constraints.

2. **Think in terms of positions, not just values**: The parity constraint applies to positions, not just values. A position that originally held an even digit must always hold an even digit, regardless of swaps.

3. **Separate-process-recombine is a powerful pattern**: Many problems become simpler when you separate elements by some property, process each group optimally, then recombine according to the original structure.

Related problems: [Largest Number At Least Twice of Others](/problem/largest-number-at-least-twice-of-others), [Sort Array By Parity](/problem/sort-array-by-parity), [Sort Array By Parity II](/problem/sort-array-by-parity-ii)
