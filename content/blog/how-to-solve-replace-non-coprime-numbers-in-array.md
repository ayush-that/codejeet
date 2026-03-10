---
title: "How to Solve Replace Non-Coprime Numbers in Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Replace Non-Coprime Numbers in Array. Hard difficulty, 57.7% acceptance rate. Topics: Array, Math, Stack, Number Theory."
date: "2027-03-18"
category: "dsa-patterns"
tags: ["replace-non-coprime-numbers-in-array", "array", "math", "stack", "hard"]
---

# How to Solve Replace Non-Coprime Numbers in Array

This problem asks us to repeatedly find adjacent non-coprime numbers in an array, replace them with their LCM, and continue until no adjacent non-coprime pairs remain. What makes this tricky is that after replacing two numbers, the new LCM might become non-coprime with its new neighbors, potentially causing a chain reaction that requires backtracking. A naive approach that scans from the beginning each time would be too slow for large arrays.

## Visual Walkthrough

Let's trace through `nums = [6, 4, 3, 2, 7, 6]` step by step:

1. Start: `[6, 4, 3, 2, 7, 6]`
2. Check 6 and 4: gcd(6,4) = 2 ≠ 1 → non-coprime
   - LCM(6,4) = (6×4)/2 = 12
   - Replace with 12: `[12, 3, 2, 7, 6]`
3. Check 12 and 3: gcd(12,3) = 3 ≠ 1 → non-coprime
   - LCM(12,3) = (12×3)/3 = 12
   - Replace with 12: `[12, 2, 7, 6]`
4. Check 12 and 2: gcd(12,2) = 2 ≠ 1 → non-coprime
   - LCM(12,2) = (12×2)/2 = 12
   - Replace with 12: `[12, 7, 6]`
5. Check 12 and 7: gcd(12,7) = 1 → coprime ✓
6. Check 7 and 6: gcd(7,6) = 1 → coprime ✓
7. Final result: `[12, 7, 6]`

Notice how replacing `[6,4]` with 12 created a chain reaction where 12 kept merging with subsequent numbers until it met 7. This suggests we need a way to efficiently handle these cascading merges without repeatedly scanning from the beginning.

## Brute Force Approach

A naive approach would repeatedly scan the array from left to right, merging the first non-coprime pair we find, then starting over from the beginning:

1. While true:
   - Scan array for first adjacent pair with gcd > 1
   - If none found, break
   - Replace that pair with their LCM
2. Return the final array

This is problematic because:

- After a merge, we need to check if the new value is non-coprime with its left neighbor (which we already passed)
- In the worst case, we might scan O(n) times and perform O(n) merges, leading to O(n²) time complexity
- For n up to 10⁵, this would be far too slow (10¹⁰ operations)

The key insight is that merges can propagate backward, so we need a data structure that lets us efficiently check and merge with the previous element.

## Optimized Approach

The optimal solution uses a **stack** to process numbers from left to right while allowing backward merges:

1. Initialize an empty stack
2. For each number in the input array:
   - Push it onto the stack
   - While stack has at least 2 elements and the top two are non-coprime:
     - Pop the top two elements
     - Compute their LCM and push it back
3. Return the stack as the result

**Why this works:**

- The stack naturally handles backward propagation: when we push a new number, we check if it merges with the top of the stack
- If a merge happens, the new LCM might merge with the next element down, so we continue checking
- This processes each number once while handling all possible backward merges
- The stack represents the "processed so far" portion of the array where all adjacent pairs are coprime

**Mathematical details:**

- gcd(a,b) > 1 means a and b share at least one prime factor
- LCM(a,b) = a × b / gcd(a,b)
- If gcd(a,b) > 1, then LCM(a,b) will be ≤ a × b / 2
- The LCM preserves all prime factors from both numbers, so if LCM(a,b) is non-coprime with c, then at least one of a or b was non-coprime with c

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log M) where M is the maximum value in nums
# Space: O(n) for the stack
def replaceNonCoprimes(nums):
    """
    Process nums from left to right using a stack.
    Whenever the top two elements are non-coprime, replace them with their LCM.
    """
    import math

    stack = []

    for num in nums:
        # Add current number to stack
        current = num

        # While we can merge current with top of stack
        while stack:
            # Get gcd of current and last element in stack
            g = math.gcd(current, stack[-1])

            # If coprime (gcd == 1), no merge needed
            if g == 1:
                break

            # Non-coprime pair found: merge them
            # Pop the last element and compute LCM with current
            last = stack.pop()
            current = current * last // g  # LCM = a*b/gcd(a,b)

            # Continue loop to check if new current merges with new top

        # Push the (possibly merged) value onto stack
        stack.append(current)

    return stack
```

```javascript
// Time: O(n log M) where M is the maximum value in nums
// Space: O(n) for the stack
function replaceNonCoprimes(nums) {
  /**
   * Process nums from left to right using a stack.
   * Whenever the top two elements are non-coprime, replace them with their LCM.
   */

  // Helper function to compute GCD using Euclidean algorithm
  const gcd = (a, b) => {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const stack = [];

  for (let num of nums) {
    let current = num;

    // While we can merge current with top of stack
    while (stack.length > 0) {
      // Get gcd of current and last element in stack
      const g = gcd(current, stack[stack.length - 1]);

      // If coprime (gcd == 1), no merge needed
      if (g === 1) {
        break;
      }

      // Non-coprime pair found: merge them
      // Pop the last element and compute LCM with current
      const last = stack.pop();
      current = (current * last) / g; // LCM = a*b/gcd(a,b)

      // Continue loop to check if new current merges with new top
    }

    // Push the (possibly merged) value onto stack
    stack.push(current);
  }

  return stack;
}
```

```java
// Time: O(n log M) where M is the maximum value in nums
// Space: O(n) for the stack
import java.util.*;

class Solution {
    public List<Integer> replaceNonCoprimes(int[] nums) {
        /**
         * Process nums from left to right using a stack.
         * Whenever the top two elements are non-coprime, replace them with their LCM.
         */

        // Use LinkedList as stack for efficient operations
        LinkedList<Integer> stack = new LinkedList<>();

        for (int num : nums) {
            int current = num;

            // While we can merge current with top of stack
            while (!stack.isEmpty()) {
                // Get gcd of current and last element in stack
                int g = gcd(current, stack.getLast());

                // If coprime (gcd == 1), no merge needed
                if (g == 1) {
                    break;
                }

                // Non-coprime pair found: merge them
                // Pop the last element and compute LCM with current
                int last = stack.removeLast();
                current = (int)((long)current * last / g);  // LCM = a*b/gcd(a,b)

                // Continue loop to check if new current merges with new top
            }

            // Push the (possibly merged) value onto stack
            stack.addLast(current);
        }

        return stack;
    }

    // Helper method to compute GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log M)

- We process each element once when pushing onto the stack: O(n)
- Each element can be merged multiple times, but each merge reduces the total number of elements
- The gcd computation takes O(log M) time where M is the maximum value in nums
- In the worst case, we might compute gcd for each element against previous ones, giving O(n log M)

**Space Complexity:** O(n)

- The stack can hold up to n elements in the worst case (if all numbers are pairwise coprime)
- In practice, it often holds fewer elements due to merges

## Common Mistakes

1. **Forgetting to check backward after a merge:** After replacing two numbers with their LCM, you must check if the new LCM is non-coprime with the number before it. The stack approach handles this naturally with the while loop.

2. **Integer overflow when computing LCM:** When computing a × b / gcd(a,b), the intermediate product a × b might overflow 32-bit integers even if the final result fits. Use 64-bit integers (long in Java/C++, BigInt in JavaScript, Python handles big integers natively).

3. **Incorrect LCM formula:** LCM(a,b) = a × b / gcd(a,b), not (a + b) or other formulas. Remember to use integer division.

4. **Not handling the stack correctly:** Some candidates try to modify the array in-place, which leads to O(n²) complexity due to shifting elements. The stack is essential for O(n) processing.

## When You'll See This Pattern

This "merge adjacent elements with some condition" pattern appears in several problems:

1. **Remove All Adjacent Duplicates in String II (Medium):** Remove k adjacent duplicate characters. Similar stack-based approach where you track counts.

2. **Evaluate Reverse Polish Notation (Medium):** Process tokens and apply operations to the last two numbers on the stack.

3. **Asteroid Collision (Medium):** Collide asteroids moving in opposite directions based on their sizes. Stack helps handle chain reactions.

The common theme is processing elements sequentially while potentially merging/removing them based on relationships with recently processed elements (LIFO order).

## Key Takeaways

1. **Stack is ideal for backward propagation:** When an operation on the current element might affect previously processed elements, a stack lets you efficiently check and merge backward.

2. **Chain reactions need while loops, not if statements:** After merging two elements, you need to check if the result triggers another merge. A while loop continues until no more merges are possible.

3. **Mathematical properties matter:** Understanding that LCM preserves prime factors helps recognize that if LCM(a,b) is non-coprime with c, then at least one of a or b was non-coprime with c. This justifies the stack approach.

Related problems: [Remove All Adjacent Duplicates in String II](/problem/remove-all-adjacent-duplicates-in-string-ii), [Number of Pairs of Interchangeable Rectangles](/problem/number-of-pairs-of-interchangeable-rectangles), [Split the Array to Make Coprime Products](/problem/split-the-array-to-make-coprime-products)
