---
title: "How to Solve Elimination Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Elimination Game. Medium difficulty, 46.0% acceptance rate. Topics: Math, Recursion."
date: "2027-05-17"
category: "dsa-patterns"
tags: ["elimination-game", "math", "recursion", "medium"]
---

## How to Solve Elimination Game

You're given a list of numbers from 1 to `n` in increasing order. You repeatedly eliminate numbers by alternating direction: first left-to-right (removing every other number starting with the first), then right-to-left (removing every other number starting with the last), and so on. The challenge is to find the last number remaining after all eliminations.

What makes this problem tricky is that the naive simulation approach becomes extremely inefficient for large `n` (up to 10⁹). The optimal solution requires mathematical reasoning rather than brute force simulation.

## Visual Walkthrough

Let's trace through `n = 9` step by step:

**Initial list:** [1, 2, 3, 4, 5, 6, 7, 8, 9]

**Step 1 (left-to-right):** Remove every other number starting from the first:

- Keep 1? ❌ Remove (first number always removed in left-to-right pass)
- Keep 2? ✅
- Keep 3? ❌ Remove
- Keep 4? ✅
- Keep 5? ❌ Remove
- Keep 6? ✅
- Keep 7? ❌ Remove
- Keep 8? ✅
- Keep 9? ❌ Remove

**Remaining:** [2, 4, 6, 8]

**Step 2 (right-to-left):** Remove every other number starting from the last:

- Keep 8? ❌ Remove (last number always removed in right-to-left pass)
- Keep 6? ✅
- Keep 4? ❌ Remove
- Keep 2? ✅

**Remaining:** [6, 2]

**Step 3 (left-to-right):** Remove every other number starting from the first:

- Keep 6? ❌ Remove
- Keep 2? ✅

**Remaining:** [2]

The last remaining number is **2**.

Notice the pattern: after each pass, the remaining numbers form an arithmetic sequence. The key insight is we don't need to track all numbers—we just need to track the first element, the last element, the step size between numbers, and the count of remaining numbers.

## Brute Force Approach

The most straightforward approach is to simulate the entire process:

1. Create an array/list of numbers from 1 to `n`
2. While the array has more than 1 element:
   - Remove every other element starting from index 0 (left-to-right)
   - If still more than 1 element, remove every other element starting from the end (right-to-left)
3. Return the single remaining element

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def lastRemaining_brute(n):
    # Create initial list
    arr = list(range(1, n + 1))

    # Track direction: True for left-to-right, False for right-to-left
    left_to_right = True

    while len(arr) > 1:
        if left_to_right:
            # Remove every other element starting from index 0
            arr = [arr[i] for i in range(len(arr)) if i % 2 == 1]
        else:
            # Remove every other element starting from the end
            arr = [arr[i] for i in range(len(arr)) if i % 2 == 0]
            arr.reverse()  # Maintain increasing order
        left_to_right = not left_to_right

    return arr[0]
```

```javascript
// Time: O(n log n) | Space: O(n)
function lastRemainingBrute(n) {
  // Create initial array
  let arr = [];
  for (let i = 1; i <= n; i++) {
    arr.push(i);
  }

  // Track direction: true for left-to-right, false for right-to-left
  let leftToRight = true;

  while (arr.length > 1) {
    if (leftToRight) {
      // Remove every other element starting from index 0
      arr = arr.filter((_, index) => index % 2 === 1);
    } else {
      // Remove every other element starting from the end
      arr = arr.filter((_, index) => index % 2 === 0);
      arr.reverse(); // Maintain increasing order
    }
    leftToRight = !leftToRight;
  }

  return arr[0];
}
```

```java
// Time: O(n log n) | Space: O(n)
public int lastRemainingBrute(int n) {
    // Create initial list
    List<Integer> arr = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        arr.add(i);
    }

    // Track direction: true for left-to-right, false for right-to-left
    boolean leftToRight = true;

    while (arr.size() > 1) {
        List<Integer> newArr = new ArrayList<>();
        if (leftToRight) {
            // Remove every other element starting from index 0
            for (int i = 1; i < arr.size(); i += 2) {
                newArr.add(arr.get(i));
            }
        } else {
            // Remove every other element starting from the end
            for (int i = arr.size() - 2; i >= 0; i -= 2) {
                newArr.add(arr.get(i));
            }
            // Reverse to maintain increasing order
            Collections.reverse(newArr);
        }
        arr = newArr;
        leftToRight = !leftToRight;
    }

    return arr.get(0);
}
```

</div>

**Why this fails:** The time complexity is O(n log n) because each pass removes about half the elements, and we need log₂(n) passes. For `n = 10⁹`, this would require creating massive arrays and performing billions of operations—completely impractical.

## Optimized Approach

The key insight is that we don't need to track all numbers. After each elimination pass, the remaining numbers form an arithmetic sequence. We only need to track:

- `first`: The first number in the current sequence
- `last`: The last number in the current sequence
- `step`: The difference between consecutive numbers
- `count`: How many numbers remain
- `direction`: Whether we're eliminating left-to-right or right-to-left

**Step-by-step reasoning:**

1. **Initial state:** `first = 1`, `last = n`, `step = 1`, `count = n`, `left_to_right = True`

2. **Left-to-right elimination:**
   - The first number is always eliminated
   - New first = old first + step
   - If count is odd, the last number is also eliminated (new last = old last - step)
   - If count is even, the last number survives (new last unchanged)
   - Step doubles (step = step × 2)
   - Count halves (count = count // 2)

3. **Right-to-left elimination:**
   - The last number is always eliminated
   - New last = old last - step
   - If count is odd, the first number is also eliminated (new first = old first + step)
   - If count is even, the first number survives (new first unchanged)
   - Step doubles (step = step × 2)
   - Count halves (count = count // 2)

4. **Repeat** until count == 1, then return `first`

This approach runs in O(log n) time because we halve the count each iteration.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def lastRemaining(n):
    """
    Find the last remaining number after alternating elimination.

    Args:
        n: The maximum number in the initial sequence [1, n]

    Returns:
        The last number remaining after all eliminations
    """
    # Initialize the first and last numbers in our current sequence
    first = 1
    last = n

    # Step size between consecutive numbers in the sequence
    step = 1

    # Count of numbers remaining in the sequence
    count = n

    # Direction: True for left-to-right, False for right-to-left
    left_to_right = True

    # Continue until only one number remains
    while count > 1:
        if left_to_right:
            # Left-to-right elimination: first number is always removed
            first += step

            # If count is odd, last number is also removed
            if count % 2 == 1:
                last -= step
            # If count is even, last number survives (no change needed)

        else:
            # Right-to-left elimination: last number is always removed
            last -= step

            # If count is odd, first number is also removed
            if count % 2 == 1:
                first += step
            # If count is even, first number survives (no change needed)

        # After each pass:
        # - Step size doubles (distance between remaining numbers increases)
        step *= 2

        # - Count halves (we remove roughly half the numbers)
        count //= 2

        # - Switch direction for next pass
        left_to_right = not left_to_right

    # When count == 1, first and last point to the same number
    return first
```

```javascript
// Time: O(log n) | Space: O(1)
function lastRemaining(n) {
  // Initialize the first and last numbers in our current sequence
  let first = 1;
  let last = n;

  // Step size between consecutive numbers in the sequence
  let step = 1;

  // Count of numbers remaining in the sequence
  let count = n;

  // Direction: true for left-to-right, false for right-to-left
  let leftToRight = true;

  // Continue until only one number remains
  while (count > 1) {
    if (leftToRight) {
      // Left-to-right elimination: first number is always removed
      first += step;

      // If count is odd, last number is also removed
      if (count % 2 === 1) {
        last -= step;
      }
      // If count is even, last number survives (no change needed)
    } else {
      // Right-to-left elimination: last number is always removed
      last -= step;

      // If count is odd, first number is also removed
      if (count % 2 === 1) {
        first += step;
      }
      // If count is even, first number survives (no change needed)
    }

    // After each pass:
    // - Step size doubles (distance between remaining numbers increases)
    step *= 2;

    // - Count halves (we remove roughly half the numbers)
    count = Math.floor(count / 2);

    // - Switch direction for next pass
    leftToRight = !leftToRight;
  }

  // When count === 1, first and last point to the same number
  return first;
}
```

```java
// Time: O(log n) | Space: O(1)
public int lastRemaining(int n) {
    // Initialize the first and last numbers in our current sequence
    int first = 1;
    int last = n;

    // Step size between consecutive numbers in the sequence
    int step = 1;

    // Count of numbers remaining in the sequence
    int count = n;

    // Direction: true for left-to-right, false for right-to-left
    boolean leftToRight = true;

    // Continue until only one number remains
    while (count > 1) {
        if (leftToRight) {
            // Left-to-right elimination: first number is always removed
            first += step;

            // If count is odd, last number is also removed
            if (count % 2 == 1) {
                last -= step;
            }
            // If count is even, last number survives (no change needed)

        } else {
            // Right-to-left elimination: last number is always removed
            last -= step;

            // If count is odd, first number is also removed
            if (count % 2 == 1) {
                first += step;
            }
            // If count is even, first number survives (no change needed)
        }

        // After each pass:
        // - Step size doubles (distance between remaining numbers increases)
        step *= 2;

        // - Count halves (we remove roughly half the numbers)
        count /= 2;

        // - Switch direction for next pass
        leftToRight = !leftToRight;
    }

    // When count == 1, first and last point to the same number
    return first;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- Each iteration reduces the count by half (count //= 2)
- For n = 10⁹, we need only about 30 iterations (log₂(10⁹) ≈ 30)
- Each iteration does constant work (O(1) operations)

**Space Complexity:** O(1)

- We only store a few integer variables (first, last, step, count, direction)
- No arrays or data structures that grow with n

## Common Mistakes

1. **Forgetting to update `last` when count is odd during left-to-right elimination:**
   - When eliminating left-to-right with odd count, the last element gets removed too
   - Example: [1,2,3] → after LTR elimination → [2] (both 1 and 3 removed)
   - Fix: Always check `if count % 2 == 1: last -= step`

2. **Forgetting to update `first` when count is odd during right-to-left elimination:**
   - When eliminating right-to-left with odd count, the first element gets removed too
   - Example: [2,4,6] → after RTL elimination → [4] (both 2 and 6 removed)
   - Fix: Always check `if count % 2 == 1: first += step`

3. **Not doubling the step size after each pass:**
   - After each elimination, the gap between remaining numbers doubles
   - Example: [1,2,3,4,5,6,7,8,9] → [2,4,6,8] (step from 1 to 2)
   - Fix: Always do `step *= 2` after each pass

4. **Using integer division incorrectly for count:**
   - When count is odd, count // 2 correctly gives the floor
   - Example: 9 // 2 = 4 (correct, since we remove 5 numbers: 1,3,5,7,9)
   - In JavaScript, use `Math.floor(count / 2)` instead of just `count / 2`

## When You'll See This Pattern

This "elimination with pattern" technique appears in problems where:

1. You're repeatedly removing elements according to a pattern
2. The remaining elements follow a predictable sequence
3. The problem constraints make simulation impractical

**Related problems:**

1. **Min Max Game (Easy)** - Similar alternating elimination pattern but with min/max operations instead of simple removal
2. **Josephus Problem (variations)** - Circular elimination problems often use similar mathematical reasoning
3. **Bulb Switcher (Medium)** - Toggle pattern that can be solved mathematically rather than by simulation

The core technique is recognizing when you can track only the boundaries of the sequence rather than all elements, and when mathematical relationships let you skip directly to the final state.

## Key Takeaways

1. **Look for patterns in elimination problems:** When elements are removed according to a regular pattern, the survivors often form a predictable sequence (like arithmetic progression here).

2. **Track boundaries, not all elements:** Instead of simulating the entire array, track just the first element, last element, step size, and count. This reduces O(n) space to O(1).

3. **Mathematical reasoning beats simulation:** For large constraints (like n up to 10⁹), always ask: "Can I find a formula or recurrence instead of simulating?"

Related problems: [Min Max Game](/problem/min-max-game)
