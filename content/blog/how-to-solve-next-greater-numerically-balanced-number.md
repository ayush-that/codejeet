---
title: "How to Solve Next Greater Numerically Balanced Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Next Greater Numerically Balanced Number. Medium difficulty, 63.0% acceptance rate. Topics: Hash Table, Math, Backtracking, Counting, Enumeration."
date: "2027-05-22"
category: "dsa-patterns"
tags: ["next-greater-numerically-balanced-number", "hash-table", "math", "backtracking", "medium"]
---

# How to Solve Next Greater Numerically Balanced Number

This problem asks us to find the smallest numerically balanced number greater than a given integer `n`. A number is numerically balanced if for each digit `d` in the number, that digit appears exactly `d` times. For example, 22 is balanced because digit 2 appears twice, while 212 is not balanced because digit 1 appears once (correct) but digit 2 appears twice (should appear exactly twice — wait, that's actually correct! Let's check: digit 1 appears once, digit 2 appears twice — that's balanced!). Actually 212 is balanced: digit 1 appears once, digit 2 appears twice. The tricky part is that ALL digits in the number must satisfy this condition, not just some of them.

What makes this problem interesting is that we need to generate candidate numbers that satisfy a specific digit frequency constraint, and we need to find the smallest one greater than `n`. The brute force approach of checking every number would be too slow, so we need a smarter generation strategy.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 1000`. We need to find the smallest balanced number > 1000.

First, what are possible balanced numbers? Let's think about what digit combinations can be balanced:

- Digit 1 can appear 1 time
- Digit 2 can appear 2 times
- Digit 3 can appear 3 times
- ... up to digit 9 appearing 9 times

But a number can contain multiple digits! For example, a number could contain digit 1 (appearing once) and digit 2 (appearing twice). The total length would be 1 + 2 = 3 digits. Some combinations are impossible: we can't have digit 1 appearing once AND digit 1 appearing twice — that's contradictory.

Let's systematically find balanced numbers around 1000:

1. Check length 4 numbers (since 1000 has 4 digits):
   - Possible digit sets: {1,3} (1+3=4), {4} (4=4), {1,1,2} (1+1+2=4 but duplicate digit 1 invalid), {2,2} (2+2=4 but duplicate digit 2 invalid)
   - {1,3} means digit 1 appears once, digit 3 appears thrice → numbers like 1333, 3133, 3313, 3331
   - {4} means digit 4 appears 4 times → 4444
   - The smallest > 1000 from these is 1333

2. But wait, we should check shorter lengths too if no length-4 solution exists? Actually we need numbers GREATER than 1000, so they must be at least 1000. The smallest balanced number with 4 digits is 1333, which is > 1000.

3. Let's verify 1333: digit 1 appears once ✓, digit 3 appears three times ✓. So 1333 is balanced and > 1000.

But is there a smaller 4-digit balanced number? Let's check 1122: digit 1 appears twice (should be once) ✗. 1222: digit 1 appears once ✓, digit 2 appears three times (should be twice) ✗. So 1333 seems correct.

Actually, let me check 22: digit 2 appears twice ✓. But 22 is 2 digits, less than 1000. We need > 1000.

So for n=1000, answer is 1333.

## Brute Force Approach

The most straightforward approach is to start from `n+1` and check each number until we find a balanced one:

1. For each candidate `x` starting from `n+1`
2. Count frequency of each digit in `x`
3. Check if for every digit `d` in `x`, `count[d] == d`
4. Also check that for digits NOT in `x`, we don't require anything (they can have count 0, which equals not appearing)

This brute force has a critical flaw: balanced numbers are quite sparse. For large `n`, we might need to check millions of numbers. The maximum answer is limited (we'll see why), but for n close to that maximum, we still check many numbers.

Here's what the brute force code might look like:

<div class="code-group">

```python
# Time: O(m * k) where m is gap to next balanced number, k is digits in number
# Space: O(1)
def nextBeautifulNumber_brute(n: int) -> int:
    def is_balanced(x: int) -> bool:
        count = [0] * 10
        while x > 0:
            digit = x % 10
            count[digit] += 1
            x //= 10

        for d in range(1, 10):
            if count[d] > 0 and count[d] != d:
                return False
        # Note: digit 0 is special - if it appears, must appear 0 times (impossible)
        # So any number containing 0 is automatically unbalanced
        if count[0] > 0:
            return False
        return True

    x = n + 1
    while True:
        if is_balanced(x):
            return x
        x += 1
```

```javascript
// Time: O(m * k) where m is gap to next balanced number, k is digits in number
// Space: O(1)
function nextBeautifulNumberBrute(n) {
  function isBalanced(x) {
    const count = new Array(10).fill(0);
    while (x > 0) {
      const digit = x % 10;
      count[digit]++;
      x = Math.floor(x / 10);
    }

    // Digit 0 cannot appear in balanced numbers
    if (count[0] > 0) return false;

    for (let d = 1; d <= 9; d++) {
      if (count[d] > 0 && count[d] !== d) {
        return false;
      }
    }
    return true;
  }

  let x = n + 1;
  while (true) {
    if (isBalanced(x)) return x;
    x++;
  }
}
```

```java
// Time: O(m * k) where m is gap to next balanced number, k is digits in number
// Space: O(1)
public int nextBeautifulNumberBrute(int n) {
    int x = n + 1;
    while (true) {
        if (isBalanced(x)) return x;
        x++;
    }
}

private boolean isBalanced(int x) {
    int[] count = new int[10];
    while (x > 0) {
        int digit = x % 10;
        count[digit]++;
        x /= 10;
    }

    // Digit 0 cannot appear (would need to appear 0 times)
    if (count[0] > 0) return false;

    for (int d = 1; d <= 9; d++) {
        if (count[d] > 0 && count[d] != d) {
            return false;
        }
    }
    return true;
}
```

</div>

The brute force is too slow because:

1. Balanced numbers are rare
2. For n up to 10^6, the next balanced number could be far away
3. We need a more efficient generation approach

## Optimized Approach

The key insight is that we can **generate** balanced numbers instead of checking random numbers. Here's the reasoning:

1. A balanced number can only contain digits 1-9 (digit 0 would need to appear 0 times, so it can't appear at all).
2. For each digit `d` from 1-9, if it appears in the number, it must appear exactly `d` times.
3. So the total length of the number is the sum of all `d` for digits that appear.
4. We need to find all valid combinations of digits where each chosen digit `d` contributes `d` to the total length.

For example, valid combinations:

- {1} → length 1 → numbers: 1
- {2} → length 2 → numbers: 22
- {1,2} → length 1+2=3 → numbers: 122, 212, 221
- {3} → length 3 → numbers: 333
- {1,3} → length 4 → numbers: 1333, 3133, 3313, 3331

We can generate all valid digit multisets (combinations with repetitions), then generate all permutations of each multiset, convert to numbers, and find the smallest one > n.

But there's a catch: we need to be efficient. The maximum n is 10^6, so we only need to generate balanced numbers up to maybe 10^7 (since balanced numbers get denser with more digits). Actually, let's find the maximum we need:

The smallest balanced number with 7 digits comes from combination {1,6} (1+6=7) → 1666666. With 8 digits: {1,7} → 17777777. These are already > 10^6. So we only need to generate balanced numbers up to ~12 million to cover all n ≤ 10^6.

Generation strategy:

1. Precompute all valid digit multisets for lengths 1 to 7 (maybe 8 to be safe)
2. For each multiset, generate all unique permutations
3. Convert each permutation to a number
4. Store all balanced numbers in a sorted list
5. For query n, binary search for first number > n

But generating all permutations for multisets like {4,4,4,4} (just 4444) is fine, but for {1,2,2,3,3,3} there are many permutations. We need to be careful about efficiency.

Actually, there's an even smarter approach: we can generate numbers directly using backtracking/DFS, building numbers digit by digit from the valid multisets, and only keeping those > n.

## Optimal Solution

The optimal solution uses DFS/backtracking to generate balanced numbers in increasing order. Here's the plan:

1. Predefine all valid combinations of (digit, count) pairs where count == digit
2. Use DFS to generate numbers from these digit pools
3. Start from smallest length, generate all numbers of that length
4. For each generated number, check if > n, return the first one
5. If no number of current length > n, go to next length

We need to generate numbers in increasing order to find the smallest one > n efficiently.

<div class="code-group">

```python
# Time: O(1) - we generate a fixed set of balanced numbers (bounded by constraints)
# Space: O(1) - fixed storage for combinations and results
class Solution:
    def nextBeautifulNumber(self, n: int) -> int:
        # Predefined valid combinations: (total_length, digit_counts)
        # Each combination is a list of (digit, count) where count == digit
        # We only need combinations for lengths up to 7 since n <= 10^6
        combinations = [
            [(1, 1)],  # length 1
            [(2, 2)],  # length 2
            [(1, 1), (2, 2)],  # length 3: 1+2
            [(3, 3)],  # length 3: 3
            [(4, 4)],  # length 4
            [(1, 1), (4, 4)],  # length 5: 1+4
            [(2, 2), (3, 3)],  # length 5: 2+3
            [(5, 5)],  # length 5: 5
            [(1, 1), (2, 2), (3, 3)],  # length 6: 1+2+3
            [(6, 6)],  # length 6: 6
            [(1, 1), (6, 6)],  # length 7: 1+6
            [(2, 2), (5, 5)],  # length 7: 2+5
            [(3, 3), (4, 4)],  # length 7: 3+4
            [(7, 7)],  # length 7: 7
        ]

        # Helper function to generate all numbers from a combination
        def generate_numbers(combo):
            from itertools import permutations

            # Build list of digits with repetitions
            digits = []
            for digit, count in combo:
                digits.extend([digit] * count)

            # Generate all unique permutations
            unique_nums = set()
            for perm in permutations(digits):
                # Don't allow leading zero (but we don't have zero digits anyway)
                if perm[0] == 0:
                    continue
                # Convert tuple to number
                num = 0
                for d in perm:
                    num = num * 10 + d
                unique_nums.add(num)

            return sorted(unique_nums)

        # Generate all balanced numbers for each combination
        all_balanced = []
        for combo in combinations:
            all_balanced.extend(generate_numbers(combo))

        # Remove duplicates and sort
        all_balanced = sorted(set(all_balanced))

        # Binary search for first number > n
        import bisect
        idx = bisect.bisect_right(all_balanced, n)
        return all_balanced[idx]
```

```javascript
// Time: O(1) - fixed set of balanced numbers
// Space: O(1) - fixed storage
function nextBeautifulNumber(n) {
  // Predefined combinations: each is array of [digit, count] pairs
  const combinations = [
    [[1, 1]], // length 1
    [[2, 2]], // length 2
    [
      [1, 1],
      [2, 2],
    ], // length 3: 1+2
    [[3, 3]], // length 3: 3
    [[4, 4]], // length 4
    [
      [1, 1],
      [4, 4],
    ], // length 5: 1+4
    [
      [2, 2],
      [3, 3],
    ], // length 5: 2+3
    [[5, 5]], // length 5: 5
    [
      [1, 1],
      [2, 2],
      [3, 3],
    ], // length 6: 1+2+3
    [[6, 6]], // length 6: 6
    [
      [1, 1],
      [6, 6],
    ], // length 7: 1+6
    [
      [2, 2],
      [5, 5],
    ], // length 7: 2+5
    [
      [3, 3],
      [4, 4],
    ], // length 7: 3+4
    [[7, 7]], // length 7: 7
  ];

  // Helper to generate all permutations (with duplicates handled)
  function generateNumbers(combo) {
    // Build digits array
    const digits = [];
    for (const [digit, count] of combo) {
      for (let i = 0; i < count; i++) {
        digits.push(digit);
      }
    }

    // Generate all unique permutations
    const uniqueNums = new Set();

    function backtrack(start) {
      if (start === digits.length) {
        // Convert to number (check leading zero)
        if (digits[0] === 0) return;
        let num = 0;
        for (const d of digits) {
          num = num * 10 + d;
        }
        uniqueNums.add(num);
        return;
      }

      for (let i = start; i < digits.length; i++) {
        // Swap
        [digits[start], digits[i]] = [digits[i], digits[start]];
        backtrack(start + 1);
        // Backtrack
        [digits[start], digits[i]] = [digits[i], digits[start]];
      }
    }

    backtrack(0);
    return Array.from(uniqueNums);
  }

  // Generate all balanced numbers
  let allBalanced = [];
  for (const combo of combinations) {
    allBalanced.push(...generateNumbers(combo));
  }

  // Sort and remove duplicates
  allBalanced = [...new Set(allBalanced)].sort((a, b) => a - b);

  // Find first number > n
  for (const num of allBalanced) {
    if (num > n) return num;
  }

  // Fallback (shouldn't reach here for n <= 10^6)
  return 1224444;
}
```

```java
// Time: O(1) - fixed set of balanced numbers
// Space: O(1) - fixed storage
import java.util.*;

class Solution {
    public int nextBeautifulNumber(int n) {
        // Predefined combinations
        List<List<int[]>> combinations = Arrays.asList(
            Arrays.asList(new int[]{1, 1}),  // length 1
            Arrays.asList(new int[]{2, 2}),  // length 2
            Arrays.asList(new int[]{1, 1}, new int[]{2, 2}),  // length 3: 1+2
            Arrays.asList(new int[]{3, 3}),  // length 3: 3
            Arrays.asList(new int[]{4, 4}),  // length 4
            Arrays.asList(new int[]{1, 1}, new int[]{4, 4}),  // length 5: 1+4
            Arrays.asList(new int[]{2, 2}, new int[]{3, 3}),  // length 5: 2+3
            Arrays.asList(new int[]{5, 5}),  // length 5: 5
            Arrays.asList(new int[]{1, 1}, new int[]{2, 2}, new int[]{3, 3}),  // length 6: 1+2+3
            Arrays.asList(new int[]{6, 6}),  // length 6: 6
            Arrays.asList(new int[]{1, 1}, new int[]{6, 6}),  // length 7: 1+6
            Arrays.asList(new int[]{2, 2}, new int[]{5, 5}),  // length 7: 2+5
            Arrays.asList(new int[]{3, 3}, new int[]{4, 4}),  // length 7: 3+4
            Arrays.asList(new int[]{7, 7})   // length 7: 7
        );

        // Generate all balanced numbers
        TreeSet<Integer> allBalanced = new TreeSet<>();
        for (List<int[]> combo : combinations) {
            allBalanced.addAll(generateNumbers(combo));
        }

        // Find first number > n
        return allBalanced.higher(n);
    }

    private Set<Integer> generateNumbers(List<int[]> combo) {
        // Build digits list
        List<Integer> digits = new ArrayList<>();
        for (int[] pair : combo) {
            int digit = pair[0];
            int count = pair[1];
            for (int i = 0; i < count; i++) {
                digits.add(digit);
            }
        }

        Set<Integer> result = new HashSet<>();
        boolean[] used = new boolean[digits.size()];
        generatePermutations(digits, used, new StringBuilder(), result);
        return result;
    }

    private void generatePermutations(List<Integer> digits, boolean[] used,
                                     StringBuilder current, Set<Integer> result) {
        if (current.length() == digits.size()) {
            // No leading zero check needed (no zero digits)
            result.add(Integer.parseInt(current.toString()));
            return;
        }

        for (int i = 0; i < digits.size(); i++) {
            if (used[i]) continue;
            // Skip duplicates to avoid redundant permutations
            if (i > 0 && digits.get(i).equals(digits.get(i - 1)) && !used[i - 1]) continue;

            used[i] = true;
            current.append(digits.get(i));
            generatePermutations(digits, used, current, result);
            current.deleteCharAt(current.length() - 1);
            used[i] = false;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We generate a fixed set of balanced numbers (bounded since n ≤ 10^6)
- The number of balanced numbers up to 10^7 is constant (~100-200)
- Generating permutations for each fixed combination takes constant time
- Binary search or linear scan on constant-sized array is O(1)

**Space Complexity:** O(1)

- We store a fixed set of combinations
- We store a fixed set of balanced numbers (constant size)
- Recursion depth is bounded by maximum length (7 digits)

## Common Mistakes

1. **Forgetting digit 0 constraint**: Digit 0 cannot appear in balanced numbers because it would need to appear 0 times. Candidates often miss this and include numbers with 0 digits.

2. **Not generating all permutations**: For combination {1,2,2}, the valid numbers are 122, 212, 221. Some candidates only generate 122 or forget to handle duplicate digits in permutations.

3. **Inefficient generation**: Trying to generate ALL balanced numbers without bound. Since n ≤ 10^6, we only need numbers up to ~10^7. Generating numbers with 8+ digits is unnecessary.

4. **Off-by-one in comparison**: The problem asks for "strictly greater than n". If n itself is balanced, we still need the NEXT balanced number. Some candidates return n if it's balanced.

5. **Missing valid combinations**: For length 5, valid combinations are {5}, {1,4}, and {2,3}. Some candidates miss {2,3} or {1,4}.

## When You'll See This Pattern

This problem combines **constraint-based generation** with **search**. Similar patterns appear in:

1. **Permutations with constraints** (LeetCode 46, 47): Generating all permutations with/without duplicates, often with additional constraints.

2. **Combination Sum problems** (LeetCode 39, 40): Finding combinations that sum to a target, similar to how we combine digits to reach a total length.

3. **Next Greater Element problems** (LeetCode 496, 503): Finding the next element satisfying some property, though usually with different constraints.

4. **Digit DP problems**: Problems that involve generating numbers with specific digit properties, though this is simpler than full Digit DP.

The core technique is: when brute force checking is too expensive, precompute or generate all valid candidates according to constraints, then search efficiently.

## Key Takeaways

1. **Constraint-based generation**: When checking all numbers is too slow, identify the constraints and generate only valid candidates. Here, the constraint is digit frequency equals digit value.

2. **Problem bounds matter**: Since n ≤ 10^6, we only need balanced numbers up to ~10^7. This makes precomputation feasible. Always check problem constraints!

3. **Break into subproblems**: First find valid digit combinations (which digits, how many times), then generate numbers from those combinations (permutations), then search.

4. **Watch for special cases**: Digit 0 can't appear, need "strictly greater", handle duplicate digits in permutations.

Related problems: [Find the Width of Columns of a Grid](/problem/find-the-width-of-columns-of-a-grid)
