---
title: "How to Solve 24 Game — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode 24 Game. Hard difficulty, 59.3% acceptance rate. Topics: Array, Math, Backtracking."
date: "2026-06-01"
category: "dsa-patterns"
tags: ["24-game", "array", "math", "backtracking", "hard"]
---

# How to Solve 24 Game

The 24 Game asks you to determine if you can arrange four numbers using basic arithmetic operations (+, -, \*, /) and parentheses to evaluate to exactly 24. What makes this problem tricky is that you need to consider all possible ways to combine the numbers—different groupings, operation orders, and operator choices—which creates an exponential search space that requires systematic exploration.

## Visual Walkthrough

Let's trace through a concrete example: `cards = [4, 1, 8, 7]`. We need to check if we can reach 24.

**Step 1: Pick two numbers**
We start with all four numbers: [4, 1, 8, 7]. First, we pick any two numbers to combine. Let's pick 4 and 1.

**Step 2: Apply all operations**
For 4 and 1, we try every operation:

- 4 + 1 = 5
- 4 - 1 = 3
- 1 - 4 = -3 (subtraction isn't commutative!)
- 4 × 1 = 4
- 4 ÷ 1 = 4
- 1 ÷ 4 = 0.25

Each result gives us a new list of three numbers. For example, after 4 + 1 = 5, we have [5, 8, 7].

**Step 3: Recursively continue**
Now with [5, 8, 7], we repeat: pick two numbers, apply operations, get a list of two numbers, then finally combine those two.

**Step 4: Check final result**
When we're down to one number, we check if it's approximately 24 (within floating-point tolerance).

**Step 5: Try all possibilities**
We need to try every pair of numbers and every operation at each step. For [4, 1, 8, 7], one valid solution is:

1. 8 ÷ (4 - 7 ÷ 1) = 8 ÷ (4 - 7) = 8 ÷ (-3) = -2.666... ✗ (not 24)
   Actually, let's find a real solution: (8 - 4) × (7 - 1) = 4 × 6 = 24 ✓

The key insight is that we need to explore all binary combinations recursively, which naturally handles parentheses since each operation combines two sub-expressions.

## Brute Force Approach

A truly naive approach would be to try all permutations of numbers and all possible parenthesizations with all operator combinations. For 4 numbers, there are:

- 4! = 24 permutations of numbers
- 5 different binary tree structures (Catalan numbers)
- 4³ = 64 operator assignments
- Total: 24 × 5 × 64 = 7,680 expressions to evaluate

While this is technically computable, it's messy to implement and doesn't generalize well. More importantly, it misses the cleaner recursive approach that handles parentheses implicitly through the order of operations.

The real "brute force" that candidates often attempt is writing nested loops with hardcoded parentheses patterns, which becomes unmanageable and error-prone. The better approach is to recognize this as a recursive combination problem.

## Optimized Approach

The key insight is that we can solve this using **recursive backtracking**:

1. **Base case**: When we have exactly one number left, check if it equals 24 (within floating-point tolerance).

2. **Recursive case**: For every pair of indices (i, j) in our current list:
   - Remove those two numbers from the list
   - For each possible operation (+, -, \*, /):
     - Compute the result (handling division by zero)
     - Add the result back to the list
     - Recursively check if we can reach 24 with this new list
     - If any recursive call returns true, we return true

3. **Important details**:
   - We must try both `a - b` and `b - a` since subtraction isn't commutative
   - We must try both `a / b` and `b / a` (when divisor isn't zero)
   - Use floating-point comparison with tolerance (e.g., 1e-6) due to precision issues
   - We need to backtrack: after trying an operation, restore the original list

This approach implicitly handles all parentheses because each binary operation combines two sub-expressions that could themselves be complex expressions.

## Optimal Solution

Here's the complete solution using recursive backtracking:

<div class="code-group">

```python
# Time: O(1) technically since fixed 4 numbers, but O(4! * 4^3) for general n
# Space: O(1) for call stack depth of 4
class Solution:
    def judgePoint24(self, cards: List[int]) -> bool:
        # Helper function to perform recursive checking
        def dfs(nums):
            # Base case: if only one number left, check if it's approximately 24
            if len(nums) == 1:
                return abs(nums[0] - 24) < 1e-6

            # Try every pair of numbers in the current list
            for i in range(len(nums)):
                for j in range(len(nums)):
                    if i == j:
                        continue  # Skip same index

                    # Create new list without nums[i] and nums[j]
                    new_nums = []
                    for k in range(len(nums)):
                        if k != i and k != j:
                            new_nums.append(nums[k])

                    # Try all possible operations
                    a, b = nums[i], nums[j]

                    # Addition
                    new_nums.append(a + b)
                    if dfs(new_nums):
                        return True
                    new_nums.pop()  # Backtrack

                    # Subtraction (two orders since not commutative)
                    new_nums.append(a - b)
                    if dfs(new_nums):
                        return True
                    new_nums.pop()  # Backtrack

                    new_nums.append(b - a)
                    if dfs(new_nums):
                        return True
                    new_nums.pop()  # Backtrack

                    # Multiplication
                    new_nums.append(a * b)
                    if dfs(new_nums):
                        return True
                    new_nums.pop()  # Backtrack

                    # Division (check for division by zero)
                    if abs(b) > 1e-6:  # Avoid division by zero
                        new_nums.append(a / b)
                        if dfs(new_nums):
                            return True
                        new_nums.pop()  # Backtrack

                    if abs(a) > 1e-6:  # Avoid division by zero
                        new_nums.append(b / a)
                        if dfs(new_nums):
                            return True
                        new_nums.pop()  # Backtrack

            return False

        # Start recursion with initial cards as floats
        return dfs([float(card) for card in cards])
```

```javascript
// Time: O(1) technically since fixed 4 numbers, but O(4! * 4^3) for general n
// Space: O(1) for call stack depth of 4
/**
 * @param {number[]} cards
 * @return {boolean}
 */
var judgePoint24 = function (cards) {
  // Helper function to perform recursive checking
  const dfs = (nums) => {
    // Base case: if only one number left, check if it's approximately 24
    if (nums.length === 1) {
      return Math.abs(nums[0] - 24) < 1e-6;
    }

    // Try every pair of numbers in the current list
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue; // Skip same index

        // Create new list without nums[i] and nums[j]
        const newNums = [];
        for (let k = 0; k < nums.length; k++) {
          if (k !== i && k !== j) {
            newNums.push(nums[k]);
          }
        }

        // Try all possible operations
        const a = nums[i],
          b = nums[j];

        // Addition
        newNums.push(a + b);
        if (dfs(newNums)) return true;
        newNums.pop(); // Backtrack

        // Subtraction (two orders since not commutative)
        newNums.push(a - b);
        if (dfs(newNums)) return true;
        newNums.pop(); // Backtrack

        newNums.push(b - a);
        if (dfs(newNums)) return true;
        newNums.pop(); // Backtrack

        // Multiplication
        newNums.push(a * b);
        if (dfs(newNums)) return true;
        newNums.pop(); // Backtrack

        // Division (check for division by zero)
        if (Math.abs(b) > 1e-6) {
          // Avoid division by zero
          newNums.push(a / b);
          if (dfs(newNums)) return true;
          newNums.pop(); // Backtrack
        }

        if (Math.abs(a) > 1e-6) {
          // Avoid division by zero
          newNums.push(b / a);
          if (dfs(newNums)) return true;
          newNums.pop(); // Backtrack
        }
      }
    }

    return false;
  };

  // Start recursion with initial cards as floats
  return dfs(cards.map((card) => parseFloat(card)));
};
```

```java
// Time: O(1) technically since fixed 4 numbers, but O(4! * 4^3) for general n
// Space: O(1) for call stack depth of 4
class Solution {
    public boolean judgePoint24(int[] cards) {
        // Convert to list of doubles for floating-point arithmetic
        List<Double> nums = new ArrayList<>();
        for (int card : cards) {
            nums.add((double) card);
        }
        return dfs(nums);
    }

    private boolean dfs(List<Double> nums) {
        // Base case: if only one number left, check if it's approximately 24
        if (nums.size() == 1) {
            return Math.abs(nums.get(0) - 24) < 1e-6;
        }

        // Try every pair of numbers in the current list
        for (int i = 0; i < nums.size(); i++) {
            for (int j = 0; j < nums.size(); j++) {
                if (i == j) continue;  // Skip same index

                // Create new list without nums[i] and nums[j]
                List<Double> newNums = new ArrayList<>();
                for (int k = 0; k < nums.size(); k++) {
                    if (k != i && k != j) {
                        newNums.add(nums.get(k));
                    }
                }

                // Try all possible operations
                double a = nums.get(i), b = nums.get(j);

                // Addition
                newNums.add(a + b);
                if (dfs(newNums)) return true;
                newNums.remove(newNums.size() - 1);  // Backtrack

                // Subtraction (two orders since not commutative)
                newNums.add(a - b);
                if (dfs(newNums)) return true;
                newNums.remove(newNums.size() - 1);  // Backtrack

                newNums.add(b - a);
                if (dfs(newNums)) return true;
                newNums.remove(newNums.size() - 1);  // Backtrack

                // Multiplication
                newNums.add(a * b);
                if (dfs(newNums)) return true;
                newNums.remove(newNums.size() - 1);  // Backtrack

                // Division (check for division by zero)
                if (Math.abs(b) > 1e-6) {  // Avoid division by zero
                    newNums.add(a / b);
                    if (dfs(newNums)) return true;
                    newNums.remove(newNums.size() - 1);  // Backtrack
                }

                if (Math.abs(a) > 1e-6) {  // Avoid division by zero
                    newNums.add(b / a);
                    if (dfs(newNums)) return true;
                    newNums.remove(newNums.size() - 1);  // Backtrack
                }
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: Technically O(1) since we always have exactly 4 cards, but if we generalize to n numbers:

- At each step, we choose 2 numbers from k numbers: O(k²) pairs
- For each pair, we try up to 6 operations (+, -, reverse -, ×, ÷, reverse ÷)
- The recursion depth is n-1 (from n numbers down to 1)
- Total operations: For n=4, it's roughly 4! × 4³ = 24 × 64 = 1,536 operations in worst case

**Space Complexity**: O(1) for the recursion stack since depth is at most 3 (4 → 3 → 2 → 1). We use O(n) space for the lists, but with n=4, this is constant.

## Common Mistakes

1. **Using integer arithmetic**: The problem requires exact evaluation to 24, but division can produce fractions. You must use floating-point numbers and compare with tolerance.

2. **Forgetting non-commutative operations**: Subtraction and division are not commutative. You must try both `a - b` and `b - a`, and both `a / b` and `b / a` (when valid).

3. **Not handling division by zero**: Always check the divisor before performing division. Use a small epsilon (like 1e-6) to avoid floating-point issues.

4. **Missing backtracking**: After trying an operation and recursing, you must remove the result from the list before trying the next operation. Otherwise, you'll have leftover values.

5. **Incorrect tolerance comparison**: Using `==` for floating-point comparison will fail. Always use `abs(a - 24) < epsilon` where epsilon is around 1e-6 to 1e-9.

## When You'll See This Pattern

This recursive combination pattern appears in problems where you need to explore all ways to combine elements:

1. **Different Ways to Add Parentheses (LeetCode 241)**: Similar recursive structure where you split expression at operators and combine results.

2. **Expression Add Operators (LeetCode 282)**: Another backtracking problem where you insert operators between digits to reach a target.

3. **Target Sum (LeetCode 494)**: Assign + or - to numbers to reach target—simpler version with only two operations.

The core pattern is: "Given a set of elements and operations, can we combine them to reach a target?" The solution is usually backtracking that tries all binary combinations.

## Key Takeaways

1. **Recursive combination solves parentheses implicitly**: When you recursively combine two elements at a time, you automatically consider all parenthesizations without explicitly generating them.

2. **Backtracking requires cleanup**: After trying an operation in recursion, always restore the state before trying the next option.

3. **Handle floating-point carefully**: Use epsilon comparisons for equality and check for near-zero values before division.

4. **Consider commutativity**: For non-commutative operations (subtraction, division), try both orders.

[Practice this problem on CodeJeet](/problem/24-game)
