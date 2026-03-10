---
title: "How to Solve Minimum Operations to Equalize Binary String — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Equalize Binary String. Hard difficulty, 45.6% acceptance rate. Topics: Math, String, Breadth-First Search, Union-Find, Ordered Set."
date: "2028-05-09"
category: "dsa-patterns"
tags:
  ["minimum-operations-to-equalize-binary-string", "math", "string", "breadth-first-search", "hard"]
---

# How to Solve Minimum Operations to Equalize Binary String

You're given a binary string `s` and an integer `k`. In each operation, you must choose exactly `k` different indices and flip their bits (0→1, 1→0). Your goal is to find the minimum number of operations needed to make all characters '1'. If it's impossible, return -1.

What makes this problem tricky is that you can't just flip individual bits—you must flip exactly `k` bits at once, and they must all be different indices. This creates dependencies between operations that make the problem non-trivial.

## Visual Walkthrough

Let's trace through an example: `s = "01010"`, `k = 3`.

**Initial state:** `0 1 0 1 0` (positions 0-4)

**Goal:** Make all characters '1'

**Step 1:** Look at position 0. It's '0', so we need to flip it. But we must flip exactly 3 different indices. Let's choose positions 0, 1, and 2:

- Position 0: 0 → 1 ✓
- Position 1: 1 → 0 (oops, now it's wrong)
- Position 2: 0 → 1 ✓

Result: `1 0 1 1 0`

**Step 2:** Now position 1 is '0'. We need to flip it. Choose positions 1, 3, and 4:

- Position 1: 0 → 1 ✓
- Position 3: 1 → 0 (oops again)
- Position 4: 0 → 1 ✓

Result: `1 1 1 0 1`

**Step 3:** Position 3 is '0'. Choose positions 3, 0, and 2:

- Position 3: 0 → 1 ✓
- Position 0: 1 → 0 (oops)
- Position 2: 1 → 0 (oops)

Result: `0 1 0 1 1`

We're going in circles! This shows we need a systematic approach. The key insight: each operation flips exactly `k` bits, so if we track the number of flips at each position modulo 2 (since two flips cancel out), we can determine whether a position ends up as '1'.

## Brute Force Approach

A naive approach would try all possible sequences of operations using BFS. Each state would be the current string, and we'd try all possible combinations of `k` indices to flip. However, this is astronomically slow:

- For a string of length `n`, there are `C(n, k)` possible moves from each state
- The state space has size `2^n` (all possible binary strings)
- Even for moderate `n` (like 20), this becomes impossible

The brute force would look something like this (conceptual):

```python
def min_operations_brute(s, k):
    from collections import deque

    target = '1' * len(s)
    queue = deque([(s, 0)])
    visited = set([s])

    while queue:
        current, steps = queue.popleft()
        if current == target:
            return steps

        # Generate all combinations of k indices
        for indices in combinations(range(len(s)), k):
            next_str = list(current)
            for i in indices:
                next_str[i] = '1' if next_str[i] == '0' else '0'
            next_str = ''.join(next_str)

            if next_str not in visited:
                visited.add(next_str)
                queue.append((next_str, steps + 1))

    return -1
```

This approach fails because:

1. The number of combinations `C(n, k)` grows factorially
2. The state space is exponential (`2^n`)
3. Even for `n=10, k=3`, we'd have 120 moves from each state and 1024 states

## Optimized Approach

The key insight comes from realizing that flipping a bit twice cancels out. So we only care about whether each position is flipped an odd or even number of times. Let's think about it differently:

1. **Parity matters:** Since two flips cancel, we only care if a position is flipped an odd number of times (changes) or even number of times (stays same).

2. **Greedy left-to-right:** We can process the string from left to right. When we encounter a '0' at position `i`, we must flip it. But we must flip exactly `k` positions, so we flip positions `i` through `i+k-1`.

3. **Impossibility condition:** If we reach a point where there aren't enough positions left to flip (i.e., `i + k > n`), then it's impossible.

4. **Efficient tracking:** Instead of actually flipping the string (which would be O(nk)), we can track the cumulative effect of flips using a difference array or prefix sum technique.

Here's the reasoning step-by-step:

- Initialize a counter to track the net effect of previous flips
- For each position `i`:
  - Account for flips that started earlier and affect current position
  - If current bit (after accounting for flips) is '0', we need to flip starting at `i`
  - Record this flip and update our counter
- If we need to flip near the end but don't have `k` positions left, return -1

## Optimal Solution

The optimal solution uses a greedy approach with prefix sums to efficiently track flips. We process the string from left to right, flipping whenever we encounter a '0' (after accounting for previous flips).

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minOperations(s: str, k: int) -> int:
    n = len(s)
    # Convert string to list of integers for easier manipulation
    bits = [int(c) for c in s]

    # Track the net effect of flips at each position
    # flip_effect[i] = 1 if position i is affected by an odd number of flips
    flip_effect = [0] * n
    current_flips = 0  # Running total of active flips
    operations = 0

    for i in range(n):
        # Update current_flips to account for flips that end before i
        if i >= k:
            current_flips ^= flip_effect[i - k]

        # Determine the current bit value after accounting for flips
        current_bit = bits[i] ^ current_flips

        # If current bit is 0, we need to flip starting from i
        if current_bit == 0:
            # Check if we have enough positions left to flip
            if i + k > n:
                return -1

            # Record this flip operation
            operations += 1
            current_flips ^= 1  # Flip the current position
            flip_effect[i] = 1  # Mark that a flip started here

    return operations
```

```javascript
// Time: O(n) | Space: O(n)
function minOperations(s, k) {
  const n = s.length;
  // Convert string to array of integers
  const bits = Array.from(s, (c) => parseInt(c));

  // Track flip effects
  const flipEffect = new Array(n).fill(0);
  let currentFlips = 0; // Running total of active flips
  let operations = 0;

  for (let i = 0; i < n; i++) {
    // Remove flips that are no longer affecting current position
    if (i >= k) {
      currentFlips ^= flipEffect[i - k];
    }

    // Calculate current bit after accounting for flips
    const currentBit = bits[i] ^ currentFlips;

    // If bit is 0, we need to flip
    if (currentBit === 0) {
      // Check if we have enough positions left
      if (i + k > n) {
        return -1;
      }

      operations++;
      currentFlips ^= 1; // Flip current position
      flipEffect[i] = 1; // Mark flip start
    }
  }

  return operations;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int minOperations(String s, int k) {
        int n = s.length();
        // Convert string to integer array
        int[] bits = new int[n];
        for (int i = 0; i < n; i++) {
            bits[i] = s.charAt(i) - '0';
        }

        // Track flip effects
        int[] flipEffect = new int[n];
        int currentFlips = 0;  // Running total of active flips
        int operations = 0;

        for (int i = 0; i < n; i++) {
            // Remove flips that are no longer affecting current position
            if (i >= k) {
                currentFlips ^= flipEffect[i - k];
            }

            // Calculate current bit after accounting for flips
            int currentBit = bits[i] ^ currentFlips;

            // If bit is 0, we need to flip
            if (currentBit == 0) {
                // Check if we have enough positions left
                if (i + k > n) {
                    return -1;
                }

                operations++;
                currentFlips ^= 1;  // Flip current position
                flipEffect[i] = 1;  // Mark flip start
            }
        }

        return operations;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the string of length `n`
- Each iteration does constant-time operations (XOR, comparisons)
- The check `i >= k` and array access are O(1)

**Space Complexity:** O(n)

- We store the `bits` array of size `n` (could be optimized to O(1) by processing characters directly)
- We store the `flipEffect` array of size `n` to track where flips started
- The rest of the variables use O(1) space

## Common Mistakes

1. **Not checking the impossibility condition early enough:** Candidates often realize too late that they can't flip when there aren't enough positions left. Always check `if i + k > n` before attempting to flip.

2. **Forgetting that flips affect multiple positions:** Each operation flips exactly `k` consecutive positions (starting from current index). A common mistake is to only flip the current position or to flip arbitrary positions.

3. **Not using XOR for tracking flips:** Since two flips cancel, we need to track parity. XOR (^) is perfect for this because:
   - `0 ^ 1 = 1` (odd number of flips)
   - `1 ^ 1 = 0` (even number of flips, back to original)
     Using addition/modulo 2 works but is less elegant.

4. **Off-by-one errors with array indices:** When accessing `flipEffect[i - k]`, remember that `i` is 0-indexed. The condition should be `i >= k`, not `i > k`.

## When You'll See This Pattern

This problem uses a **greedy algorithm with prefix sums/difference array** pattern, which appears in several other problems:

1. **Minimum Number of K-Consecutive Bit Flips (LeetCode 995)** - Almost identical problem! The only difference is the goal (all 1s vs. all 0s or all 1s).

2. **Bulb Switcher IV (LeetCode 1529)** - Similar concept of flipping bulbs with a toggle effect, though with different constraints.

3. **Minimum Operations to Make the Array Alternating (LeetCode 2170)** - Uses similar parity and greedy thinking, though with different operations.

The core pattern is: when operations affect a range/segment of elements, and you need to minimize operations, consider:

- Processing left to right
- Using a difference array or prefix sum to efficiently track cumulative effects
- Making greedy decisions at each step

## Key Takeaways

1. **Range operations often benefit from difference arrays:** When an operation affects a contiguous range of elements, track the net effect using a prefix sum or difference array rather than updating each element individually.

2. **Parity matters for toggle operations:** When operations toggle states (like flipping bits), two operations cancel out. Track whether each element has been affected an odd or even number of times using XOR.

3. **Greedy left-to-right works for many string transformation problems:** If making a change early never hurts later decisions, a greedy approach from left to right is often optimal. Always check if you have enough "room" to complete operations before committing.

[Practice this problem on CodeJeet](/problem/minimum-operations-to-equalize-binary-string)
