---
title: "How to Solve Numbers With Same Consecutive Differences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Numbers With Same Consecutive Differences. Medium difficulty, 59.1% acceptance rate. Topics: Backtracking, Breadth-First Search."
date: "2026-08-18"
category: "dsa-patterns"
tags:
  ["numbers-with-same-consecutive-differences", "backtracking", "breadth-first-search", "medium"]
---

# How to Solve Numbers With Same Consecutive Differences

This problem asks us to generate all n-digit numbers where the absolute difference between every pair of consecutive digits equals k. The challenge lies in efficiently constructing valid numbers without generating all possible n-digit numbers and checking each one (which would be prohibitively slow). The interesting twist is that each digit can have up to two possible next digits (current digit ± k), unless k = 0, in which case there's only one option.

## Visual Walkthrough

Let's trace through an example: `n = 3, k = 2`

We need to generate all 3-digit numbers where the difference between consecutive digits is exactly 2. Let's build them digit by digit:

**Step 1: First digit choices**

- Cannot be 0 (no leading zeros)
- Possible first digits: 1-9

**Step 2: For each first digit, find valid second digits**

- If first digit = 1: second digit = 1 ± 2 = 3 or -1 (invalid, so only 3)
- If first digit = 2: second digit = 4 or 0 (0 is valid for non-leading positions)
- If first digit = 3: second digit = 5 or 1
- ... and so on

**Step 3: Continue building**
Let's trace one path: Start with 1

- First digit: 1
- Second digit: 3 (since 1+2=3, 1-2=-1 invalid)
- Third digit: 5 (3+2=5) or 1 (3-2=1)
- Results: 135 and 131

Another path: Start with 2

- First digit: 2
- Second digit: 4 (2+2) or 0 (2-2)
- If second digit = 4: third digit = 6 (4+2) or 2 (4-2) → 246, 242
- If second digit = 0: third digit = 2 (0+2) or -2 (invalid) → 202

Continuing this process for all starting digits 1-9 gives us the complete solution.

## Brute Force Approach

A naive approach would be to generate all n-digit numbers (from 10^(n-1) to 10^n - 1) and check each one to see if it satisfies the consecutive difference condition. For each number, we'd need to:

1. Convert it to digits
2. Check that each pair of consecutive digits has absolute difference = k

**Why this fails:**

- For n=9, there are 900 million numbers to check (10^9 - 10^8 = 900,000,000)
- Checking each number requires O(n) time to examine its digits
- Total time: O(9 × 10^(n-1) × n) which is exponential in n
- Even for moderate n (like n=7), this becomes computationally infeasible

The brute force approach generates many invalid numbers that we could have avoided building in the first place. Once we have an invalid prefix (like "12" when k=5), no number starting with "12" can be valid, so we should stop exploring that path immediately.

## Optimized Approach

The key insight is that we can **build numbers digit by digit** and **prune invalid paths early**. This is a classic application of DFS (Depth-First Search) or BFS (Breadth-First Search) on an implicit graph where:

- Nodes represent partial numbers (prefixes)
- Edges represent adding a valid next digit

**Step-by-step reasoning:**

1. Start with all possible first digits (1-9, since no leading zeros)
2. For each partial number, calculate possible next digits = current_digit ± k
3. Filter out invalid digits (must be between 0-9 inclusive)
4. Continue until we have n digits
5. Add complete numbers to results

**Special cases:**

- When k = 0, current_digit ± k gives the same digit twice, so we only have one option
- When k > 0, we may have 0, 1, or 2 options depending on whether ± k stays within 0-9

This approach only explores valid prefixes, dramatically reducing the search space compared to brute force.

## Optimal Solution

We'll implement a DFS (backtracking) solution that builds numbers recursively. BFS would also work, but DFS is more natural for this construction problem.

<div class="code-group">

```python
# Time: O(2^n) in worst case, but much better than brute force
# Space: O(2^n) for the output, O(n) for recursion stack
class Solution:
    def numsSameConsecDiff(self, n: int, k: int) -> List[int]:
        # Edge case: if n is 1, all digits 0-9 are valid (single-digit numbers)
        if n == 1:
            return [i for i in range(10)]

        result = []

        # Start DFS from each possible first digit (1-9, no leading zero)
        for digit in range(1, 10):
            self.dfs(n - 1, k, digit, result)

        return result

    def dfs(self, remaining_digits: int, k: int, current_num: int, result: List[int]):
        """
        DFS helper to build numbers recursively.

        Args:
            remaining_digits: How many more digits we need to add
            k: The required difference between consecutive digits
            current_num: The number we've built so far
            result: List to store complete numbers
        """
        # Base case: if no digits left to add, we have a complete number
        if remaining_digits == 0:
            result.append(current_num)
            return

        # Get the last digit of our current number
        last_digit = current_num % 10

        # Calculate possible next digits
        next_digits = set()

        # Add last_digit + k if it's a valid digit (0-9)
        if last_digit + k < 10:
            next_digits.add(last_digit + k)

        # Add last_digit - k if it's a valid digit (0-9)
        if last_digit - k >= 0:
            next_digits.add(last_digit - k)

        # For each valid next digit, continue building the number
        for next_digit in next_digits:
            # Append the next digit to our current number
            # current_num * 10 shifts digits left, + next_digit adds new digit
            new_num = current_num * 10 + next_digit
            self.dfs(remaining_digits - 1, k, new_num, result)
```

```javascript
// Time: O(2^n) in worst case, but much better than brute force
// Space: O(2^n) for the output, O(n) for recursion stack
/**
 * @param {number} n
 * @param {number} k
 * @return {number[]}
 */
var numsSameConsecDiff = function (n, k) {
  // Edge case: if n is 1, all digits 0-9 are valid
  if (n === 1) {
    return Array.from({ length: 10 }, (_, i) => i);
  }

  const result = [];

  // Start DFS from each possible first digit (1-9, no leading zero)
  for (let digit = 1; digit <= 9; digit++) {
    dfs(n - 1, k, digit, result);
  }

  return result;
};

/**
 * DFS helper to build numbers recursively
 * @param {number} remainingDigits - How many more digits to add
 * @param {number} k - Required difference between consecutive digits
 * @param {number} currentNum - The number built so far
 * @param {number[]} result - Array to store complete numbers
 */
function dfs(remainingDigits, k, currentNum, result) {
  // Base case: if no digits left to add, we have a complete number
  if (remainingDigits === 0) {
    result.push(currentNum);
    return;
  }

  // Get the last digit of our current number
  const lastDigit = currentNum % 10;

  // Calculate possible next digits using a Set to avoid duplicates when k=0
  const nextDigits = new Set();

  // Add lastDigit + k if it's a valid digit (0-9)
  if (lastDigit + k < 10) {
    nextDigits.add(lastDigit + k);
  }

  // Add lastDigit - k if it's a valid digit (0-9)
  if (lastDigit - k >= 0) {
    nextDigits.add(lastDigit - k);
  }

  // For each valid next digit, continue building the number
  for (const nextDigit of nextDigits) {
    // Append the next digit to our current number
    // currentNum * 10 shifts digits left, + nextDigit adds new digit
    const newNum = currentNum * 10 + nextDigit;
    dfs(remainingDigits - 1, k, newNum, result);
  }
}
```

```java
// Time: O(2^n) in worst case, but much better than brute force
// Space: O(2^n) for the output, O(n) for recursion stack
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {
    public int[] numsSameConsecDiff(int n, int k) {
        // Edge case: if n is 1, all digits 0-9 are valid
        if (n == 1) {
            int[] result = new int[10];
            for (int i = 0; i < 10; i++) {
                result[i] = i;
            }
            return result;
        }

        List<Integer> result = new ArrayList<>();

        // Start DFS from each possible first digit (1-9, no leading zero)
        for (int digit = 1; digit <= 9; digit++) {
            dfs(n - 1, k, digit, result);
        }

        // Convert List to array
        int[] arr = new int[result.size()];
        for (int i = 0; i < result.size(); i++) {
            arr[i] = result.get(i);
        }
        return arr;
    }

    /**
     * DFS helper to build numbers recursively
     * @param remainingDigits How many more digits to add
     * @param k Required difference between consecutive digits
     * @param currentNum The number built so far
     * @param result List to store complete numbers
     */
    private void dfs(int remainingDigits, int k, int currentNum, List<Integer> result) {
        // Base case: if no digits left to add, we have a complete number
        if (remainingDigits == 0) {
            result.add(currentNum);
            return;
        }

        // Get the last digit of our current number
        int lastDigit = currentNum % 10;

        // Calculate possible next digits using a Set to avoid duplicates when k=0
        Set<Integer> nextDigits = new HashSet<>();

        // Add lastDigit + k if it's a valid digit (0-9)
        if (lastDigit + k < 10) {
            nextDigits.add(lastDigit + k);
        }

        // Add lastDigit - k if it's a valid digit (0-9)
        if (lastDigit - k >= 0) {
            nextDigits.add(lastDigit - k);
        }

        // For each valid next digit, continue building the number
        for (int nextDigit : nextDigits) {
            // Append the next digit to our current number
            // currentNum * 10 shifts digits left, + nextDigit adds new digit
            int newNum = currentNum * 10 + nextDigit;
            dfs(remainingDigits - 1, k, newNum, result);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(2^n) in worst case, but typically much less**

- In the worst case (k=0 or k such that most digits have 2 options), each level of the tree could double the number of paths
- However, many paths are pruned when ± k goes outside 0-9
- More precisely: O(9 × 2^(n-1)) since we start with 9 options and each subsequent digit has at most 2 options
- This is exponentially better than brute force O(9 × 10^(n-1))

**Space Complexity: O(2^n) for output + O(n) for recursion stack**

- The output itself takes O(2^n) space in worst case
- The recursion stack goes n levels deep, so O(n) for call stack
- We don't store all intermediate states simultaneously, just the current path

## Common Mistakes

1. **Forgetting to handle the n=1 edge case**: When n=1, the "no leading zeros" rule doesn't apply because single-digit numbers like 0, 1, 2,... are all valid. Always test n=1.

2. **Not using a Set for next digits when k=0**: When k=0, last_digit ± k gives the same digit twice. If you use a list or array without deduplication, you'll explore duplicate paths, wasting time and potentially creating duplicate results.

3. **Incorrect bounds checking for next digits**: Must check that next_digit is between 0 and 9 inclusive. A common mistake is checking `> 0` instead of `>= 0`, which incorrectly excludes 0 as a valid non-leading digit.

4. **Building numbers as strings instead of integers**: While strings make digit manipulation easier, converting back and forth is inefficient. Building as integers (current × 10 + new_digit) is cleaner and faster.

## When You'll See This Pattern

This "digit-by-digit construction with constraints" pattern appears in several LeetCode problems:

1. **Lexicographical Numbers (LeetCode 386)**: Generate numbers in lexicographical order. Similar digit-by-digit construction, but with different ordering constraints.

2. **Letter Combinations of a Phone Number (LeetCode 17)**: Build strings letter by letter from digit mappings. The recursion structure is identical—each digit gives you options for the next character.

3. **Combination Sum (LeetCode 39)**: Build combinations that sum to a target. While the constraint is different (sum vs. digit difference), the backtracking approach of building solutions incrementally and pruning invalid paths is the same.

The core pattern is: when you need to generate combinatorial objects (numbers, strings, sequences) subject to constraints, consider building them element by element and pruning as soon as constraints are violated.

## Key Takeaways

1. **Prune early, prune often**: The power of backtracking comes from abandoning invalid partial solutions immediately. Don't build the whole solution only to check constraints at the end.

2. **Digit manipulation tricks**: Remember that for integers, `num % 10` gets the last digit, and `num * 10 + digit` appends a digit. These are more efficient than string operations.

3. **Consider edge cases systematically**: For digit problems, always check: n=1 (single digit), k=0 (same digit repeated), k large (few valid options), and the leading zero constraint.

[Practice this problem on CodeJeet](/problem/numbers-with-same-consecutive-differences)
