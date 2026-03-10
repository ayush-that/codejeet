---
title: "How to Solve Broken Calculator — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Broken Calculator. Medium difficulty, 55.9% acceptance rate. Topics: Math, Greedy."
date: "2027-02-06"
category: "dsa-patterns"
tags: ["broken-calculator", "math", "greedy", "medium"]
---

# How to Solve Broken Calculator

You start with a number `startValue` on a broken calculator that can only multiply by 2 or subtract 1. Your goal is to reach `target` using the minimum number of operations. This problem is tricky because the obvious approach — starting from `startValue` and trying all possible sequences of operations — explodes exponentially. The key insight is to work backwards from `target` to `startValue`, which turns a complex search problem into a simple greedy algorithm.

## Visual Walkthrough

Let's trace through an example: `startValue = 3`, `target = 10`.

**Forward thinking (intuitive but problematic):**

- From 3, we could multiply to 6, then subtract to 5, then multiply to 10 → 3 operations
- Or multiply to 6, multiply to 12, subtract to 11, subtract to 10 → 4 operations
- There are many paths, and exploring them all is inefficient

**Backward thinking (optimal approach):**
Instead of starting at 3 and trying to reach 10, let's start at 10 and try to reach 3:

1. Current: 10, Goal: 3
   - If 10 were odd, we'd add 1 (reverse of subtract 1), but it's even
   - So we divide by 2 (reverse of multiply by 2) → 5, operations = 1
2. Current: 5, Goal: 3
   - 5 is odd, so add 1 → 6, operations = 2
3. Current: 6, Goal: 3
   - Even, divide by 2 → 3, operations = 3
4. Current equals goal! Total operations = 3

Why does working backwards work? Because when we go forward, multiplying can overshoot the target, forcing many subtractions. Going backward, we always know whether to add (when odd) or divide (when even) because:

- If target > startValue and target is odd: the last operation must have been subtract 1 (so we add 1 going backward)
- If target > startValue and target is even: the last operation could have been multiply by 2 (so we divide by 2 going backward)

## Brute Force Approach

A naive candidate might try BFS (breadth-first search) starting from `startValue`:

- At each step, generate two new numbers: `current * 2` and `current - 1`
- Stop when we reach `target`
- Return the number of steps taken

This seems reasonable but has critical flaws:

1. **Exponential growth**: Each step doubles the search space
2. **No upper bound**: If `startValue` is small and `target` is large, we might explore millions of states
3. **Redundant work**: We'll revisit the same numbers through different paths

Here's what the BFS approach would look like (and why it fails for large inputs):

<div class="code-group">

```python
# Time: O(2^n) where n is operations needed - TOO SLOW!
# Space: O(2^n) for the queue
def brokenCalc(startValue, target):
    from collections import deque

    if startValue >= target:
        return startValue - target  # Only subtraction needed

    queue = deque([(startValue, 0)])  # (current_value, operations)
    visited = set([startValue])

    while queue:
        current, ops = queue.popleft()

        if current == target:
            return ops

        # Generate next states
        multiply_val = current * 2
        subtract_val = current - 1

        # We need some limit to prevent infinite growth
        # But what limit? This is the problem!
        if multiply_val <= target * 2:  # Arbitrary limit
            if multiply_val not in visited:
                visited.add(multiply_val)
                queue.append((multiply_val, ops + 1))

        if subtract_val >= 1:  # Avoid negative numbers
            if subtract_val not in visited:
                visited.add(subtract_val)
                queue.append((subtract_val, ops + 1))

    return -1  # Should never reach here
```

```javascript
// Time: O(2^n) where n is operations needed - TOO SLOW!
// Space: O(2^n) for the queue
function brokenCalc(startValue, target) {
  if (startValue >= target) {
    return startValue - target; // Only subtraction needed
  }

  const queue = [[startValue, 0]]; // [current_value, operations]
  const visited = new Set([startValue]);

  while (queue.length > 0) {
    const [current, ops] = queue.shift();

    if (current === target) {
      return ops;
    }

    // Generate next states
    const multiplyVal = current * 2;
    const subtractVal = current - 1;

    // Arbitrary limits - this is the problem!
    if (multiplyVal <= target * 2 && !visited.has(multiplyVal)) {
      visited.add(multiplyVal);
      queue.push([multiplyVal, ops + 1]);
    }

    if (subtractVal >= 1 && !visited.has(subtractVal)) {
      visited.add(subtractVal);
      queue.push([subtractVal, ops + 1]);
    }
  }

  return -1; // Should never reach here
}
```

```java
// Time: O(2^n) where n is operations needed - TOO SLOW!
// Space: O(2^n) for the queue
public int brokenCalc(int startValue, int target) {
    if (startValue >= target) {
        return startValue - target;  // Only subtraction needed
    }

    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{startValue, 0});
    Set<Integer> visited = new HashSet<>();
    visited.add(startValue);

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int val = current[0];
        int ops = current[1];

        if (val == target) {
            return ops;
        }

        // Generate next states
        int multiplyVal = val * 2;
        int subtractVal = val - 1;

        // Arbitrary limits - this is the problem!
        if (multiplyVal <= target * 2 && !visited.contains(multiplyVal)) {
            visited.add(multiplyVal);
            queue.offer(new int[]{multiplyVal, ops + 1});
        }

        if (subtractVal >= 1 && !visited.contains(subtractVal)) {
            visited.add(subtractVal);
            queue.offer(new int[]{subtractVal, ops + 1});
        }
    }

    return -1;  // Should never reach here
}
```

</div>

The brute force fails because we can't set proper bounds. If we limit to `target * 2`, we might miss optimal paths. If we don't limit, the search space explodes.

## Optimized Approach

The key insight is to **work backwards from target to startValue**. Why does this work?

1. **When target > startValue**:
   - If target is even: the last operation that reached target was likely multiplication (most efficient way to grow)
   - If target is odd: it couldn't have come from multiplication (even × 2 = even), so it must have come from subtraction
2. **When target ≤ startValue**:
   - We can only use subtraction operations: `startValue - target`

3. **Greedy proof**:
   - Dividing by 2 when possible is always optimal when going backward
   - Adding 1 when odd is forced (no alternative)
   - This greedy approach yields the minimum operations because:
     a) Dividing by 2 reduces the number faster than adding 1
     b) Any optimal solution would do the same in reverse

The algorithm:

1. Start with `current = target`, `operations = 0`
2. While `current > startValue`:
   - If `current` is odd: `current += 1` (reverse of subtract 1), `operations += 1`
   - If `current` is even: `current //= 2` (reverse of multiply by 2), `operations += 1`
3. When `current ≤ startValue`: add `(startValue - current)` to operations (remaining subtractions)

## Optimal Solution

<div class="code-group">

```python
# Time: O(log(target)) - we halve target each time when even
# Space: O(1) - only using a few variables
def brokenCalc(startValue: int, target: int) -> int:
    """
    Calculate minimum operations to go from startValue to target
    using only ×2 or -1 operations.

    Strategy: Work backwards from target to startValue.
    When going backward:
    - If target is even: last operation was ×2, so we ÷2
    - If target is odd: last operation was -1, so we +1
    """
    operations = 0

    # Work backwards from target to startValue
    while target > startValue:
        if target % 2 == 0:
            # Target is even: reverse of ×2 is ÷2
            target //= 2
        else:
            # Target is odd: reverse of -1 is +1
            target += 1
        operations += 1

    # Now target <= startValue
    # We can only subtract to reach startValue
    # Add the difference (startValue - target) to operations
    operations += (startValue - target)

    return operations
```

```javascript
// Time: O(log(target)) - we halve target each time when even
// Space: O(1) - only using a few variables
/**
 * Calculate minimum operations to go from startValue to target
 * using only ×2 or -1 operations.
 *
 * Strategy: Work backwards from target to startValue.
 * When going backward:
 * - If target is even: last operation was ×2, so we ÷2
 * - If target is odd: last operation was -1, so we +1
 */
function brokenCalc(startValue, target) {
  let operations = 0;
  let current = target;

  // Work backwards from target to startValue
  while (current > startValue) {
    if (current % 2 === 0) {
      // Current is even: reverse of ×2 is ÷2
      current = Math.floor(current / 2);
    } else {
      // Current is odd: reverse of -1 is +1
      current += 1;
    }
    operations += 1;
  }

  // Now current <= startValue
  // We can only subtract to reach startValue
  // Add the difference (startValue - current) to operations
  operations += startValue - current;

  return operations;
}
```

```java
// Time: O(log(target)) - we halve target each time when even
// Space: O(1) - only using a few variables
/**
 * Calculate minimum operations to go from startValue to target
 * using only ×2 or -1 operations.
 *
 * Strategy: Work backwards from target to startValue.
 * When going backward:
 * - If target is even: last operation was ×2, so we ÷2
 * - If target is odd: last operation was -1, so we +1
 */
public int brokenCalc(int startValue, int target) {
    int operations = 0;
    int current = target;

    // Work backwards from target to startValue
    while (current > startValue) {
        if (current % 2 == 0) {
            // Current is even: reverse of ×2 is ÷2
            current /= 2;
        } else {
            // Current is odd: reverse of -1 is +1
            current += 1;
        }
        operations++;
    }

    // Now current <= startValue
    // We can only subtract to reach startValue
    // Add the difference (startValue - current) to operations
    operations += (startValue - current);

    return operations;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log(target))**

- In the worst case, `target` is much larger than `startValue`
- Each iteration either halves `target` (when even) or adds 1 then halves (when odd)
- The number of halving operations is O(log(target))
- Adding 1 operations happen at most once between halvings

**Space Complexity: O(1)**

- We only use a constant amount of extra space (variables for current value and operation count)
- No recursion stack or data structures needed

## Common Mistakes

1. **Trying forward BFS/DFS without proper bounds**: Candidates often implement BFS from startValue, which explodes exponentially. They try to add arbitrary limits like `target * 2`, but this can miss optimal solutions.

2. **Missing the backward greedy insight**: The problem seems like a shortest path problem, which makes candidates reach for BFS/Dijkstra. The key is recognizing that working backward simplifies to a greedy algorithm.

3. **Incorrect handling of the final steps**: When `current ≤ startValue`, some candidates forget to add `(startValue - current)` to account for the remaining subtraction operations needed.

4. **Integer overflow in forward approach**: When multiplying by 2 repeatedly, numbers can exceed integer limits quickly. The backward approach avoids this by dividing instead.

5. **Not proving greedy correctness**: In an interview, you should explain why the greedy approach works: dividing when possible is always optimal because it reduces the number faster than adding.

## When You'll See This Pattern

This "work backwards" pattern appears in optimization problems where:

- Forward search has exponential complexity
- Operations have inverses
- There's a clear greedy choice when going backward

**Related problems:**

1. **2 Keys Keyboard (LeetCode 650)**: Minimum steps to get 'n' 'A's on a notepad starting with one 'A', using only "Copy All" and "Paste". The optimal solution involves factoring 'n' and working backward from the target.

2. **Minimum Operations to Make the Integer Zero (LeetCode 2749)**: Given two integers, find minimum operations to make one zero using specific operations. Often requires backward thinking or bit manipulation.

3. **Water and Jug Problem (LeetCode 365)**: Measuring specific amounts with two jugs - can be solved with number theory or BFS, but backward thinking helps understand the state space.

## Key Takeaways

1. **When forward search explodes, try working backward**: If operations have clear inverses, reversing the problem can turn exponential search into linear/greedy.

2. **Look for greedy opportunities in reverse**: When going backward, there's often an obviously optimal choice (like dividing by 2 when possible) that isn't obvious going forward.

3. **Prove your greedy choice**: In interviews, explain why your greedy approach is optimal. For this problem: dividing reduces the number fastest, and any optimal solution would make the same choice when reversed.

4. **Handle the base case separately**: When the current value becomes less than or equal to the start, the remaining operations are straightforward subtractions.

Related problems: [2 Keys Keyboard](/problem/2-keys-keyboard), [Minimum Operations to Make the Integer Zero](/problem/minimum-operations-to-make-the-integer-zero)
