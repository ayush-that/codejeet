---
title: "How to Solve Digit Operations to Make Two Integers Equal — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Digit Operations to Make Two Integers Equal. Medium difficulty, 29.8% acceptance rate. Topics: Math, Graph Theory, Heap (Priority Queue), Number Theory, Shortest Path."
date: "2026-06-04"
category: "dsa-patterns"
tags:
  [
    "digit-operations-to-make-two-integers-equal",
    "math",
    "graph-theory",
    "heap-(priority-queue)",
    "medium",
  ]
---

# How to Solve Digit Operations to Make Two Integers Equal

You're given two integers `n` and `m` with the same number of digits. You can repeatedly increase any non-9 digit by 1 or decrease any non-0 digit by 1. The goal is to make `n` equal to `m` using the minimum number of operations. What makes this problem interesting is that each digit can be adjusted independently, but the operations have constraints (no wrapping around 0-9), and we need to find the optimal sequence across all digits.

## Visual Walkthrough

Let's trace through an example: `n = 1234` and `m = 4321`.

We compare digit by digit from left to right:

- **Digit 1 (thousands place)**: `n` has 1, `m` has 4. We need to increase 1 to 4. Operations needed: 4 - 1 = 3
- **Digit 2 (hundreds place)**: `n` has 2, `m` has 3. We need to increase 2 to 3. Operations: 3 - 2 = 1
- **Digit 3 (tens place)**: `n` has 3, `m` has 2. We need to decrease 3 to 2. Operations: 3 - 2 = 1
- **Digit 4 (ones place)**: `n` has 4, `m` has 1. We need to decrease 4 to 1. Operations: 4 - 1 = 3

Total operations if we treat digits independently: 3 + 1 + 1 + 3 = 8

But wait — can we do better? What if we "borrow" operations between digits? For example, decreasing the thousands digit from 1 to 0 (1 operation) would require increasing another digit to compensate. This gets complex quickly, which is why we need a systematic approach.

## Brute Force Approach

A naive approach would try all possible sequences of operations. For each digit position, we could try increasing or decreasing it step by step until it matches the target digit. Since each operation changes a digit by ±1, and digits range from 0-9, there are up to 9 possible states per digit. With `k` digits, that's 9^k states to explore — exponential time complexity.

We could model this as a graph search problem:

- Each state is the current number
- Edges represent single-digit operations (increase non-9 digit, decrease non-0 digit)
- Use BFS to find shortest path from `n` to `m`

However, with numbers up to 10^9 (9 digits), BFS would explore up to 10^9 states — far too many. Even for smaller numbers, this approach doesn't scale.

<div class="code-group">

```python
# Brute Force BFS - Too slow for large inputs
from collections import deque

def min_operations_bfs(n, m):
    if n == m:
        return 0

    visited = set()
    queue = deque([(n, 0)])

    while queue:
        current, steps = queue.popleft()

        # Try all possible digit operations
        str_current = str(current).zfill(len(str(n)))
        for i in range(len(str_current)):
            digit = int(str_current[i])

            # Increase operation
            if digit < 9:
                new_digit = digit + 1
                new_num = int(str_current[:i] + str(new_digit) + str_current[i+1:])
                if new_num == m:
                    return steps + 1
                if new_num not in visited:
                    visited.add(new_num)
                    queue.append((new_num, steps + 1))

            # Decrease operation
            if digit > 0:
                new_digit = digit - 1
                new_num = int(str_current[:i] + str(new_digit) + str_current[i+1:])
                if new_num == m:
                    return steps + 1
                if new_num not in visited:
                    visited.add(new_num)
                    queue.append((new_num, steps + 1))

    return -1  # Should never reach here for valid inputs
```

```javascript
// Brute Force BFS - Too slow for large inputs
function minOperationsBFS(n, m) {
  if (n === m) return 0;

  const visited = new Set();
  const queue = [[n, 0]];

  const nStr = n.toString();
  const numDigits = nStr.length;

  while (queue.length > 0) {
    const [current, steps] = queue.shift();
    const currentStr = current.toString().padStart(numDigits, "0");

    // Try all possible digit operations
    for (let i = 0; i < numDigits; i++) {
      const digit = parseInt(currentStr[i]);

      // Increase operation
      if (digit < 9) {
        const newDigit = digit + 1;
        const newNum = parseInt(
          currentStr.substring(0, i) + newDigit + currentStr.substring(i + 1)
        );
        if (newNum === m) return steps + 1;
        if (!visited.has(newNum)) {
          visited.add(newNum);
          queue.push([newNum, steps + 1]);
        }
      }

      // Decrease operation
      if (digit > 0) {
        const newDigit = digit - 1;
        const newNum = parseInt(
          currentStr.substring(0, i) + newDigit + currentStr.substring(i + 1)
        );
        if (newNum === m) return steps + 1;
        if (!visited.has(newNum)) {
          visited.add(newNum);
          queue.push([newNum, steps + 1]);
        }
      }
    }
  }

  return -1; // Should never reach here for valid inputs
}
```

```java
// Brute Force BFS - Too slow for large inputs
import java.util.*;

public class Solution {
    public int minOperationsBFS(int n, int m) {
        if (n == m) return 0;

        Set<Integer> visited = new HashSet<>();
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{n, 0});
        visited.add(n);

        String nStr = Integer.toString(n);
        int numDigits = nStr.length();

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int currentNum = current[0];
            int steps = current[1];

            String currentStr = String.format("%0" + numDigits + "d", currentNum);

            // Try all possible digit operations
            for (int i = 0; i < numDigits; i++) {
                int digit = currentStr.charAt(i) - '0';

                // Increase operation
                if (digit < 9) {
                    int newDigit = digit + 1;
                    String newStr = currentStr.substring(0, i) + newDigit + currentStr.substring(i + 1);
                    int newNum = Integer.parseInt(newStr);
                    if (newNum == m) return steps + 1;
                    if (!visited.contains(newNum)) {
                        visited.add(newNum);
                        queue.offer(new int[]{newNum, steps + 1});
                    }
                }

                // Decrease operation
                if (digit > 0) {
                    int newDigit = digit - 1;
                    String newStr = currentStr.substring(0, i) + newDigit + currentStr.substring(i + 1);
                    int newNum = Integer.parseInt(newStr);
                    if (newNum == m) return steps + 1;
                    if (!visited.contains(newNum)) {
                        visited.add(newNum);
                        queue.offer(new int[]{newNum, steps + 1});
                    }
                }
            }
        }

        return -1; // Should never reach here for valid inputs
    }
}
```

</div>

## Optimized Approach

The key insight is that **operations on different digits are independent** when we consider the minimum cost. For each digit position:

1. Let `a` be the digit in `n` at that position
2. Let `b` be the digit in `m` at that position
3. We need to transform `a` to `b`

The operations available are:

- Increase `a` by 1 (if `a < 9`)
- Decrease `a` by 1 (if `a > 0`)

This is essentially finding the minimum number of ±1 steps to go from `a` to `b` on a line from 0 to 9, where you can't go below 0 or above 9.

The optimal strategy is straightforward: if `a < b`, we need `b - a` increase operations. If `a > b`, we need `a - b` decrease operations. But wait — what if going the "long way around" is cheaper? For example, going from 9 to 0: direct path would require decreasing 9 times (9→0), but we could increase from 9 to 9 (can't, since 9 is max), so no alternative exists.

Actually, there's no "wrapping around" because we can't go from 9 to 0 directly or from 0 to 9 directly. So the shortest path is always the direct difference: `abs(a - b)`.

But here's the catch: **we can perform operations in parallel on different digits**. The total time is not the sum of operations, but rather the maximum operations needed on any single digit. Why? Because we can perform one operation per time unit, and we can choose which digit to operate on. To minimize total time, we should always work on the digit that needs the most operations remaining.

This becomes a **scheduling problem**: we have `k` tasks (digits), each requiring `abs(a_i - b_i)` operations. We can do one operation per time unit on any task. The minimum time is the maximum operations needed on any single digit.

Wait, let's verify with an example: `n = 19, m = 34`

- Digit 1: |1 - 3| = 2 operations (increase)
- Digit 2: |9 - 4| = 5 operations (decrease)
  Total operations if sequential: 7
  But we can work in parallel: at time 1, decrease digit 2 (9→8). At time 2, decrease digit 2 (8→7) AND increase digit 1 (1→2) — but we can only do one per time unit! So we need to sequence them.

Actually, the minimum time is indeed the maximum of the digit differences: max(2, 5) = 5. Schedule:
Time 1: decrease digit 2 (9→8)
Time 2: decrease digit 2 (8→7)  
Time 3: decrease digit 2 (7→6)
Time 4: decrease digit 2 (6→5) AND increase digit 1 (1→2) — can't do both at once!
We need to interleave: do digit 2 operations first since it needs more.

Better schedule:
Time 1: digit 2: 9→8
Time 2: digit 2: 8→7  
Time 3: digit 2: 7→6
Time 4: digit 2: 6→5
Time 5: digit 2: 5→4 (done with digit 2)
Time 6: digit 1: 1→2
Time 7: digit 1: 2→3
Total: 7, not 5. So max(differences) is not correct.

Let's think differently. Each operation changes one digit by ±1. The total number of operations needed is the sum of absolute differences: Σ|a_i - b_i|. But we can perform only one operation per time unit. So the minimum time equals the total operations.

But can we do better by "chaining" operations? No, because each operation affects only one digit. So we need at least Σ|a_i - b_i| operations.

Actually, let's test with the original example `1234` → `4321`:
Differences: |1-4|=3, |2-3|=1, |3-2|=1, |4-1|=3
Sum = 8, which matches our initial calculation.

So the answer is simply the sum of absolute differences between corresponding digits!

## Optimal Solution

The optimal solution is straightforward: convert both numbers to strings (padding if necessary), iterate through each digit position, calculate the absolute difference, and sum them up.

<div class="code-group">

```python
# Time: O(d) where d is number of digits | Space: O(d) for string conversion
def minOperations(n: int, m: int) -> int:
    """
    Calculate minimum operations to transform n into m.
    Each operation can increase a non-9 digit by 1 or decrease a non-0 digit by 1.
    """
    # Convert to strings to access individual digits
    str_n = str(n)
    str_m = str(m)

    # Both numbers have the same number of digits per problem statement
    # But we'll handle potential padding for safety
    max_len = max(len(str_n), len(str_m))
    str_n = str_n.zfill(max_len)
    str_m = str_m.zfill(max_len)

    total_operations = 0

    # Iterate through each digit position
    for i in range(max_len):
        digit_n = int(str_n[i])
        digit_m = int(str_m[i])

        # Add absolute difference to total operations
        # Each unit difference requires one operation
        total_operations += abs(digit_n - digit_m)

    return total_operations
```

```javascript
// Time: O(d) where d is number of digits | Space: O(d) for string conversion
function minOperations(n, m) {
  /**
   * Calculate minimum operations to transform n into m.
   * Each operation can increase a non-9 digit by 1 or decrease a non-0 digit by 1.
   */
  // Convert to strings to access individual digits
  let strN = n.toString();
  let strM = m.toString();

  // Both numbers have the same number of digits per problem statement
  // But we'll handle potential padding for safety
  const maxLen = Math.max(strN.length, strM.length);
  strN = strN.padStart(maxLen, "0");
  strM = strM.padStart(maxLen, "0");

  let totalOperations = 0;

  // Iterate through each digit position
  for (let i = 0; i < maxLen; i++) {
    const digitN = parseInt(strN[i]);
    const digitM = parseInt(strM[i]);

    // Add absolute difference to total operations
    // Each unit difference requires one operation
    totalOperations += Math.abs(digitN - digitM);
  }

  return totalOperations;
}
```

```java
// Time: O(d) where d is number of digits | Space: O(d) for string conversion
class Solution {
    public int minOperations(int n, int m) {
        /**
         * Calculate minimum operations to transform n into m.
         * Each operation can increase a non-9 digit by 1 or decrease a non-0 digit by 1.
         */
        // Convert to strings to access individual digits
        String strN = Integer.toString(n);
        String strM = Integer.toString(m);

        // Both numbers have the same number of digits per problem statement
        // But we'll handle potential padding for safety
        int maxLen = Math.max(strN.length(), strM.length());
        strN = String.format("%0" + maxLen + "d", n);
        strM = String.format("%0" + maxLen + "d", m);

        int totalOperations = 0;

        // Iterate through each digit position
        for (int i = 0; i < maxLen; i++) {
            int digitN = strN.charAt(i) - '0';
            int digitM = strM.charAt(i) - '0';

            // Add absolute difference to total operations
            // Each unit difference requires one operation
            totalOperations += Math.abs(digitN - digitM);
        }

        return totalOperations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(d) where d is the number of digits in the input numbers. Since numbers can be up to 10^9, d ≤ 10. In practice, this is O(1) since the number of digits is bounded by the maximum possible integer size.

**Space Complexity:** O(d) for storing the string representations of the numbers. Again, this is effectively O(1) since d is bounded.

The algorithm is extremely efficient because:

1. We process each digit exactly once
2. No complex data structures are needed
3. The mathematical insight reduces the problem to simple arithmetic

## Common Mistakes

1. **Overcomplicating with BFS/DFS**: Many candidates try to model this as a graph search problem, which has exponential complexity. They miss the simple mathematical insight that operations on different digits are independent.

2. **Incorrectly assuming parallel operations**: Some think the answer is `max(|digit_n - digit_m|)` across all positions, believing operations can be done in parallel. But only one operation can be performed at a time, so we need the sum, not the maximum.

3. **Forgetting digit constraints**: While the absolute difference approach works, candidates should note that the constraints (no increasing 9, no decreasing 0) don't affect the minimum because the optimal path never tries to violate them. If `a < b`, we only increase; if `a > b`, we only decrease.

4. **Not handling equal numbers**: The trivial case where `n == m` should return 0. While our solution handles this (sum of differences will be 0), it's good to mention it explicitly.

5. **Padding issues**: When numbers have different lengths (though the problem states they have the same number of digits), failing to pad with zeros can cause misalignment of digits.

## When You'll See This Pattern

This problem teaches the **digit manipulation** pattern combined with **greedy optimization**:

1. **Minimum Moves to Equal Array Elements** (LeetCode 453): Similar concept of making elements equal with minimum operations, though operations differ.

2. **Minimum Number of Operations to Move All Balls to Each Box** (LeetCode 1769): Calculating costs based on distances, similar to summing absolute differences.

3. **Calculate Digit Sum of a String** (LeetCode 2243): Working with digit representations and performing operations digit by digit.

The core pattern is recognizing when a problem can be decomposed into independent subproblems (one per digit or position) and solved with simple arithmetic rather than complex search algorithms.

## Key Takeaways

1. **Decompose by position**: When operations affect individual digits/positions independently, solve for each position separately and combine results.

2. **Constraints may not affect optimal solution**: Sometimes problem constraints (like "can't increase 9") don't change the optimal path because you'd never want to go that way anyway.

3. **Simple arithmetic beats complex algorithms**: If you find yourself considering BFS/DFS for what seems like a simple problem, step back and look for mathematical properties or greedy approaches.

4. **Test with small examples**: The example `1234` → `4321` clearly shows why we need the sum of differences, not the maximum.

[Practice this problem on CodeJeet](/problem/digit-operations-to-make-two-integers-equal)
