---
title: "How to Solve Find the Minimum Possible Sum of a Beautiful Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Minimum Possible Sum of a Beautiful Array. Medium difficulty, 35.2% acceptance rate. Topics: Math, Greedy."
date: "2029-03-18"
category: "dsa-patterns"
tags: ["find-the-minimum-possible-sum-of-a-beautiful-array", "math", "greedy", "medium"]
---

# How to Solve Find the Minimum Possible Sum of a Beautiful Array

This problem asks us to construct an array of length `n` with distinct positive integers, where no two distinct indices `i` and `j` satisfy `nums[i] + nums[j] == target`. Our goal is to minimize the sum of this array. The challenge lies in strategically choosing numbers to avoid forbidden pairs while keeping the sum as small as possible.

## Visual Walkthrough

Let's walk through an example with `n = 5` and `target = 6`:

**Step 1: Start with the smallest numbers**
We want to minimize the sum, so we should use the smallest possible numbers starting from 1.

**Step 2: Identify forbidden pairs**
The condition says we cannot have `nums[i] + nums[j] == target`. For `target = 6`, the forbidden pairs are:

- 1 + 5 = 6
- 2 + 4 = 6
- 3 + 3 = 6 (but since numbers must be distinct, this doesn't matter)

**Step 3: Build the array systematically**

1. Start with 1 → array: [1]
2. Add 2 → array: [1, 2]
3. Add 3 → array: [1, 2, 3]
4. Add 4 → Can we add 4? Check if 2 + 4 = 6 exists. Since we already have 2, adding 4 would create a forbidden pair. Skip 4.
5. Add 5 → Can we add 5? Check if 1 + 5 = 6 exists. Since we already have 1, adding 5 would create a forbidden pair. Skip 5.
6. Add 6 → array: [1, 2, 3, 6] (6 doesn't pair with any existing number to make 6, since we don't have 0)
7. Add 7 → array: [1, 2, 3, 6, 7]

Our final array is [1, 2, 3, 6, 7] with sum = 19.

**Key insight**: For each number `x` we consider adding, we need to check if `target - x` has already been added. If it has, we must skip `x` and use a larger number instead.

## Brute Force Approach

A naive approach would be to generate all possible arrays of length `n` with distinct positive integers, check if they satisfy the condition, calculate their sums, and return the minimum. This is clearly infeasible because:

1. There are infinite possible numbers to choose from (all positive integers)
2. Even if we limit to some range, the number of combinations grows factorially

A slightly better but still inefficient approach would be:

1. Start with the smallest numbers 1, 2, 3, ...
2. For each new candidate number, check if it forms a forbidden pair with any existing number
3. If it does, skip to the next number

The problem with this approach is the checking step: for each candidate, we'd need to check all existing numbers to see if `target - candidate` exists. While we could use a hash set for O(1) lookups, the real issue is determining when to stop skipping numbers and how to efficiently find the next valid number.

## Optimized Approach

The key insight is that we can think in terms of **complementary pairs**. For a given `target`, numbers come in complementary pairs `(x, target - x)` where `x < target - x`. For example, with `target = 6`:

- Pair 1: (1, 5)
- Pair 2: (2, 4)
- Number 3 stands alone (its complement is itself, but numbers must be distinct)

**Strategy**:

1. We can take the smaller number from each complementary pair
2. We must avoid taking both numbers from any pair
3. For numbers ≥ target, they don't have complements in the positive integers (since `target - x ≤ 0`), so we can take them freely

**Implementation plan**:

1. Start with the smallest numbers 1, 2, 3, ...
2. For each number `x`:
   - If `x < target` and `target - x` hasn't been taken yet, take `x`
   - If `x < target` and `target - x` has been taken, skip `x`
   - If `x ≥ target`, always take `x` (no complement in positive integers)
3. Continue until we have `n` numbers

We need a way to track which complements have been "blocked" when we take a number.

## Optimal Solution

The efficient solution uses a greedy approach with a set to track blocked numbers. We iterate through numbers starting from 1, taking numbers when possible, and marking their complements as blocked.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minimumPossibleSum(n: int, target: int) -> int:
    """
    Constructs a beautiful array of length n with minimum sum.

    The key insight is that for numbers x where x < target,
    we cannot have both x and (target - x) in the array.
    We greedily choose the smaller number from each complementary pair.
    Numbers >= target have no complement in positive integers, so we can take them freely.
    """
    total_sum = 0
    taken = set()  # Track numbers we've added to the array
    blocked = set()  # Track numbers that are blocked because their complement was taken
    current_num = 1

    while len(taken) < n:
        # If current_num is blocked (its complement was taken), skip it
        if current_num in blocked:
            current_num += 1
            continue

        # Add current_num to the array
        taken.add(current_num)
        total_sum += current_num

        # If current_num < target, block its complement
        # Note: target - current_num could be <= 0, but we only care about positive integers
        complement = target - current_num
        if complement > 0 and complement != current_num:  # complement != current_num ensures distinctness
            blocked.add(complement)

        current_num += 1

    return total_sum
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Constructs a beautiful array of length n with minimum sum.
 *
 * The key insight is that for numbers x where x < target,
 * we cannot have both x and (target - x) in the array.
 * We greedily choose the smaller number from each complementary pair.
 * Numbers >= target have no complement in positive integers, so we can take them freely.
 */
function minimumPossibleSum(n, target) {
  let totalSum = 0;
  const taken = new Set(); // Track numbers we've added to the array
  const blocked = new Set(); // Track numbers that are blocked because their complement was taken
  let currentNum = 1;

  while (taken.size < n) {
    // If currentNum is blocked (its complement was taken), skip it
    if (blocked.has(currentNum)) {
      currentNum++;
      continue;
    }

    // Add currentNum to the array
    taken.add(currentNum);
    totalSum += currentNum;

    // If currentNum < target, block its complement
    // Note: target - currentNum could be <= 0, but we only care about positive integers
    const complement = target - currentNum;
    if (complement > 0 && complement !== currentNum) {
      // complement !== currentNum ensures distinctness
      blocked.add(complement);
    }

    currentNum++;
  }

  return totalSum;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashSet;
import java.util.Set;

class Solution {
    /**
     * Constructs a beautiful array of length n with minimum sum.
     *
     * The key insight is that for numbers x where x < target,
     * we cannot have both x and (target - x) in the array.
     * We greedily choose the smaller number from each complementary pair.
     * Numbers >= target have no complement in positive integers, so we can take them freely.
     */
    public long minimumPossibleSum(int n, int target) {
        long totalSum = 0;
        Set<Integer> taken = new HashSet<>();  // Track numbers we've added to the array
        Set<Integer> blocked = new HashSet<>(); // Track numbers that are blocked because their complement was taken
        int currentNum = 1;

        while (taken.size() < n) {
            // If currentNum is blocked (its complement was taken), skip it
            if (blocked.contains(currentNum)) {
                currentNum++;
                continue;
            }

            // Add currentNum to the array
            taken.add(currentNum);
            totalSum += currentNum;

            // If currentNum < target, block its complement
            // Note: target - currentNum could be <= 0, but we only care about positive integers
            int complement = target - currentNum;
            if (complement > 0 && complement != currentNum) {  // complement != currentNum ensures distinctness
                blocked.add(complement);
            }

            currentNum++;
        }

        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate at most `2n` times in the worst case (when we skip about half the numbers)
- Each iteration performs O(1) operations (set lookups and additions)
- The while loop continues until we have `n` numbers in our array

**Space Complexity: O(n)**

- We maintain two sets: `taken` and `blocked`
- In the worst case, each set can contain up to `n` elements
- The total space is proportional to `n`

**Why this is optimal**: We must consider at least `n` numbers to build our array, so O(n) time is optimal. The O(n) space comes from needing to track which numbers we've taken and which are blocked.

## Common Mistakes

1. **Forgetting that numbers must be distinct**: Some candidates might consider pairs like (3, 3) for target = 6, but the problem requires distinct integers. The complement check `complement != currentNum` handles this.

2. **Not handling the case when complement ≤ 0**: When `currentNum ≥ target`, `target - currentNum ≤ 0`. Since we only work with positive integers, we shouldn't add non-positive numbers to the blocked set. Always check `complement > 0`.

3. **Infinite loop with incorrect skipping logic**: If you forget to increment `currentNum` in the skip branch, you'll get stuck in an infinite loop. Always ensure `currentNum` increments in both branches.

4. **Using int instead of long for sum (Java specific)**: The sum can be large (up to ~n²/2 when n=10⁹), which exceeds 32-bit integer limits. Always use `long` for the sum in Java.

## When You'll See This Pattern

This problem uses a **greedy selection with constraint tracking** pattern, which appears in several other problems:

1. **Two Sum**: The complement relationship `x + y = target` is the core of the classic Two Sum problem, though that problem asks for finding an existing pair rather than avoiding them.

2. **Avoid Floors in Array (similar constraints)**: Problems where you need to construct arrays avoiding certain sums or products often use similar complement-based reasoning.

3. **Task Scheduling with Constraints**: When you need to schedule tasks with pairwise constraints (certain pairs can't be scheduled together), similar graph coloring or constraint tracking approaches apply.

The key pattern is recognizing when elements come in complementary pairs and that you can only choose one from each pair when trying to optimize some objective.

## Key Takeaways

1. **Think in terms of complements**: When a problem involves pairs that sum to a target, consider the complement relationship `y = target - x`. This often reveals a symmetry you can exploit.

2. **Greedy works with proper tracking**: For minimization problems, taking the smallest available elements is often optimal, but you need to track which elements become unavailable due to constraints.

3. **Distinctness changes pair considerations**: When elements must be distinct, self-complements (where `x = target - x`) don't create constraints since you can't have two identical elements anyway.

[Practice this problem on CodeJeet](/problem/find-the-minimum-possible-sum-of-a-beautiful-array)
