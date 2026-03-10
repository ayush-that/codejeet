---
title: "How to Solve Build an Array With Stack Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Build an Array With Stack Operations. Medium difficulty, 81.0% acceptance rate. Topics: Array, Stack, Simulation."
date: "2028-05-21"
category: "dsa-patterns"
tags: ["build-an-array-with-stack-operations", "array", "stack", "simulation", "medium"]
---

# How to Solve Build an Array With Stack Operations

This problem asks us to simulate building a target array using only "Push" and "Pop" operations on a stack, given a stream of integers from 1 to n. The tricky part is that we must generate the exact target array in order, but we can only push numbers in increasing order from the stream, and we must pop when we encounter numbers not in the target. This requires careful simulation of the stack operations to match the target sequence.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `target = [1,3]` and `n = 3`.

We have a stream of integers: 1, 2, 3 (from 1 to n)
We need to build the target array `[1,3]` in our stack.

**Step 1:** Current stream number = 1

- 1 is in target (it's the first element we need)
- We push "1" → stack becomes `[1]`
- Move to next target element (3)

**Step 2:** Current stream number = 2

- 2 is NOT in target (we need 3 next, not 2)
- We push "2" then immediately pop it → operations: "Push", "Pop"
- Stack remains `[1]`

**Step 3:** Current stream number = 3

- 3 is in target (it's the next element we need)
- We push "3" → stack becomes `[1,3]`
- We've built the entire target array

Final operations: `["Push","Push","Pop","Push"]`

The key insight: We iterate through numbers 1 to n, pushing each number. If the number matches the next target element, we keep it. If it doesn't, we push it then immediately pop it. We stop when we've built all target elements.

## Brute Force Approach

A naive approach might try to generate all possible sequences of push/pop operations and check which ones produce the target. However, with n up to 100, there are 2^(2n) possible sequences (push or pop at each step), which is astronomically large (2^200 ≈ 1.6×10^60).

Another brute force might involve trying to match the target by exploring different branching decisions, but this would also be exponential in complexity. The problem constraints (n ≤ 100) suggest we need a linear solution.

The brute force fails because:

1. It doesn't leverage the fact that numbers come in increasing order
2. It doesn't recognize that we must process numbers sequentially
3. It would be far too slow for the constraints

## Optimized Approach

The optimal approach uses a simple simulation with two pointers:

1. **Pointer to current number in stream**: We iterate i from 1 to n
2. **Pointer to next target element**: We track which element in target we're trying to build next

**Key Insight**: Since the stream gives us numbers 1, 2, 3, ... in order, and the target is sorted (though not necessarily consecutive), we can simulate the process directly:

- For each number i from 1 to n:
  - Always push i (we have to process it somehow)
  - If i equals the next target element, we keep it (just push)
  - If i doesn't equal the next target element, we must pop it immediately (push then pop)
- Stop when we've built all target elements (even if i hasn't reached n yet)

**Why this works**: The target array tells us exactly which numbers we want to keep. Any number not in the target must be removed immediately after pushing. Since numbers arrive in increasing order, we know exactly when to expect each target element.

**Edge Cases to Consider**:

- Target contains all numbers 1 to n → just push each number
- Target contains only the last number → push and pop all numbers except the last
- Target is empty → no operations needed
- n is larger than needed to build target → stop early

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the given integer n
# Space: O(1) excluding the output list, O(n) including output
def buildArray(target, n):
    """
    Builds the target array using push and pop operations.

    Args:
        target: List of integers to build
        n: Maximum integer in the stream (1 to n)

    Returns:
        List of "Push" and "Pop" operations
    """
    operations = []  # Store the sequence of operations
    target_index = 0  # Pointer to current position in target array

    # Iterate through numbers 1 to n from the stream
    for current_num in range(1, n + 1):
        # If we've built all target elements, stop early
        if target_index >= len(target):
            break

        # Always push the current number (required by problem)
        operations.append("Push")

        # Check if current number matches the next target element
        if current_num == target[target_index]:
            # Number matches target, keep it in stack
            target_index += 1  # Move to next target element
        else:
            # Number doesn't match target, pop it immediately
            operations.append("Pop")

    return operations
```

```javascript
// Time: O(n) where n is the given integer n
// Space: O(1) excluding the output array, O(n) including output
function buildArray(target, n) {
  /**
   * Builds the target array using push and pop operations.
   *
   * @param {number[]} target - Array of integers to build
   * @param {number} n - Maximum integer in the stream (1 to n)
   * @return {string[]} - Array of "Push" and "Pop" operations
   */
  const operations = []; // Store the sequence of operations
  let targetIndex = 0; // Pointer to current position in target array

  // Iterate through numbers 1 to n from the stream
  for (let currentNum = 1; currentNum <= n; currentNum++) {
    // If we've built all target elements, stop early
    if (targetIndex >= target.length) {
      break;
    }

    // Always push the current number (required by problem)
    operations.push("Push");

    // Check if current number matches the next target element
    if (currentNum === target[targetIndex]) {
      // Number matches target, keep it in stack
      targetIndex++; // Move to next target element
    } else {
      // Number doesn't match target, pop it immediately
      operations.push("Pop");
    }
  }

  return operations;
}
```

```java
// Time: O(n) where n is the given integer n
// Space: O(1) excluding the output list, O(n) including output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> buildArray(int[] target, int n) {
        /**
         * Builds the target array using push and pop operations.
         *
         * @param target - Array of integers to build
         * @param n - Maximum integer in the stream (1 to n)
         * @return List of "Push" and "Pop" operations
         */
        List<String> operations = new ArrayList<>();  // Store the sequence of operations
        int targetIndex = 0;  // Pointer to current position in target array

        // Iterate through numbers 1 to n from the stream
        for (int currentNum = 1; currentNum <= n; currentNum++) {
            // If we've built all target elements, stop early
            if (targetIndex >= target.length) {
                break;
            }

            // Always push the current number (required by problem)
            operations.add("Push");

            // Check if current number matches the next target element
            if (currentNum == target[targetIndex]) {
                // Number matches target, keep it in stack
                targetIndex++;  // Move to next target element
            } else {
                // Number doesn't match target, pop it immediately
                operations.add("Pop");
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through numbers from 1 to n at most once
- Each iteration performs O(1) operations (comparisons and list appends)
- Even though we might stop early if target is built before reaching n, worst case is O(n)

**Space Complexity: O(n) for the output, O(1) extra space**

- The output list contains at most 2n operations (push for every number, possibly pop for every number)
- We use only a few integer variables for pointers (O(1) extra space)
- If we count the output as part of space complexity, it's O(n)

## Common Mistakes

1. **Forgetting to stop early**: Continuing to process numbers after building the target array. This wastes operations and could exceed n unnecessarily. Always check if `target_index >= len(target)`.

2. **Incorrect comparison logic**: Comparing with wrong target element or not updating the target pointer correctly. Remember to only advance the target pointer when you find a match.

3. **Not pushing every number**: The problem requires that we process each number from the stream in order. We must push every number we encounter, even if we immediately pop it.

4. **Assuming target is consecutive**: The target array may have gaps (like [1,3]), so don't assume numbers are consecutive. The stream gives consecutive numbers, but target may skip some.

5. **Off-by-one errors with n**: Remember the stream includes numbers 1 through n inclusive. Use `<= n` not `< n` in loops.

## When You'll See This Pattern

This simulation-with-two-pointers pattern appears in problems where you need to match or build a target sequence from a source with constraints:

1. **Merge Two Sorted Lists (Easy)**: Similar two-pointer approach to merge sorted arrays, though without the push/pop simulation.

2. **Backspace String Compare (Easy)**: Simulating text editors with backspace operations, requiring similar simulation of building strings.

3. **Validate Stack Sequences (Medium)**: Almost identical concept - given pushed and popped sequences, determine if they're valid. This problem is essentially the inverse of "Build an Array With Stack Operations".

4. **Crawler Log Folder (Easy)**: Simulating navigation with "../" and "./" operations, requiring similar step-by-step simulation.

The core pattern is: **When you need to transform or match sequences with specific allowed operations, simulate the process step-by-step with pointers tracking progress in each sequence.**

## Key Takeaways

1. **Simulation problems often have straightforward solutions**: Don't overcomplicate. When asked to simulate a process, just simulate it step-by-step as a human would.

2. **Two pointers are powerful for sequence matching**: When you have an input sequence and a target sequence, use one pointer for each and advance them based on matching conditions.

3. **Read constraints carefully**: The fact that numbers come in increasing order from 1 to n is crucial. Without this, the problem would be much harder.

4. **Early termination optimization**: Always check if you can stop processing once you've achieved your goal, even if more input remains.

Related problems: [Minimum Operations to Collect Elements](/problem/minimum-operations-to-collect-elements)
