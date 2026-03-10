---
title: "How to Solve Find the Child Who Has the Ball After K Seconds — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Child Who Has the Ball After K Seconds. Easy difficulty, 62.0% acceptance rate. Topics: Math, Simulation."
date: "2028-05-02"
category: "dsa-patterns"
tags: ["find-the-child-who-has-the-ball-after-k-seconds", "math", "simulation", "easy"]
---

# How to Solve "Find the Child Who Has the Ball After K Seconds"

This problem asks us to simulate a ball being passed between children in a line, where the ball bounces back at the ends. While it seems like a simple simulation, the large constraints (k up to 10^9) make the naive approach impossible, forcing us to find a mathematical pattern. The interesting challenge is recognizing that this is essentially a bouncing ball problem that can be solved with modular arithmetic rather than simulation.

## Visual Walkthrough

Let's trace through an example with `n = 4` children and `k = 5` seconds:

**Initial state (t = 0):**

- Children: [0, 1, 2, 3]
- Ball at child 0, moving right (→)

**t = 1:** Child 0 passes to child 1 (→)

- Ball at child 1, moving right

**t = 2:** Child 1 passes to child 2 (→)

- Ball at child 2, moving right

**t = 3:** Child 2 passes to child 3 (→)

- Ball at child 3, moving right

**t = 4:** Child 3 would pass to child 4, but child 4 doesn't exist!

- Ball bounces back: child 3 passes to child 2 (←)
- Ball at child 2, moving left

**t = 5:** Child 2 passes to child 1 (←)

- Ball at child 1, moving left

After 5 seconds, the ball is with child 1.

Notice the pattern: The ball moves right until it hits the end (child n-1), then reverses direction. This creates a back-and-forth motion. For large k values, we can't simulate each second individually, but we can observe that the ball completes a full cycle every `2*(n-1)` seconds.

## Brute Force Approach

The most straightforward approach is to simulate each second exactly as described:

1. Start with position = 0 and direction = right (+1)
2. For each second from 1 to k:
   - Move the ball: position += direction
   - If position reaches 0 or n-1, reverse direction
3. Return the final position

This approach is intuitive and easy to implement, but it has a critical flaw: with k up to 10^9, simulating each second would take far too long (O(k) time complexity). Even with optimized code, this would timeout for large inputs.

<div class="code-group">

```python
# Time: O(k) - Too slow for k up to 10^9!
# Space: O(1)
def bruteForce(n, k):
    pos = 0  # Start at child 0
    direction = 1  # 1 for right, -1 for left

    for _ in range(k):
        pos += direction

        # Check if we hit a boundary
        if pos == 0 or pos == n - 1:
            direction *= -1  # Reverse direction

    return pos
```

```javascript
// Time: O(k) - Too slow for k up to 10^9!
// Space: O(1)
function bruteForce(n, k) {
  let pos = 0; // Start at child 0
  let direction = 1; // 1 for right, -1 for left

  for (let i = 0; i < k; i++) {
    pos += direction;

    // Check if we hit a boundary
    if (pos === 0 || pos === n - 1) {
      direction *= -1; // Reverse direction
    }
  }

  return pos;
}
```

```java
// Time: O(k) - Too slow for k up to 10^9!
// Space: O(1)
public int bruteForce(int n, int k) {
    int pos = 0;  // Start at child 0
    int direction = 1;  // 1 for right, -1 for left

    for (int i = 0; i < k; i++) {
        pos += direction;

        // Check if we hit a boundary
        if (pos == 0 || pos == n - 1) {
            direction *= -1;  // Reverse direction
        }
    }

    return pos;
}
```

</div>

## Optimal Solution

The key insight is recognizing the periodic nature of the ball's movement. The ball completes a full cycle (right to left and back to start) every `2*(n-1)` seconds. We can use this to reduce k to a manageable size using modulo arithmetic.

**Mathematical approach:**

1. Calculate the period: `period = 2 * (n - 1)`
2. Reduce k modulo period: `k %= period`
3. If the reduced k is less than n, the ball is moving right: `return k`
4. Otherwise, the ball is on its way back: `return period - k`

**Why this works:**

- When k < n, the ball hasn't reached the end yet, so it's simply at position k
- When k ≥ n, the ball has hit the right boundary and is coming back
- The position on the return trip can be calculated as: `period - k`

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def numberOfChild(n, k):
    # Calculate the full cycle length
    # A complete cycle is: 0 → (n-1) → 0
    period = 2 * (n - 1)

    # Reduce k to within one complete cycle
    k %= period

    # If k is in the forward journey (0 to n-1)
    if k < n:
        return k
    # Otherwise, we're on the return journey
    else:
        return period - k
```

```javascript
// Time: O(1) | Space: O(1)
function numberOfChild(n, k) {
  // Calculate the full cycle length
  // A complete cycle is: 0 → (n-1) → 0
  const period = 2 * (n - 1);

  // Reduce k to within one complete cycle
  k %= period;

  // If k is in the forward journey (0 to n-1)
  if (k < n) {
    return k;
  }
  // Otherwise, we're on the return journey
  else {
    return period - k;
  }
}
```

```java
// Time: O(1) | Space: O(1)
public int numberOfChild(int n, int k) {
    // Calculate the full cycle length
    // A complete cycle is: 0 → (n-1) → 0
    int period = 2 * (n - 1);

    // Reduce k to within one complete cycle
    k %= period;

    // If k is in the forward journey (0 to n-1)
    if (k < n) {
        return k;
    }
    // Otherwise, we're on the return journey
    else {
        return period - k;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of arithmetic operations regardless of input size
- The modulo operation and comparisons are all O(1)

**Space Complexity:** O(1)

- We only use a few integer variables
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the edge case when n = 1:**
   - When there's only one child, the ball never moves
   - Our formula handles this correctly: period = 2\*(1-1) = 0, but we need to be careful with modulo by zero
   - Actually, with n=1, k % 0 would be undefined, but the problem guarantees n ≥ 2

2. **Off-by-one errors with indices:**
   - Children are numbered 0 to n-1, not 1 to n
   - The right boundary is at n-1, not n
   - When k = n, the ball is at child n-1, not starting the return journey

3. **Not handling the return journey correctly:**
   - Some candidates try to use `n - 1 - (k - n)` which simplifies to `2n - k - 1`
   - This is mathematically equivalent to `period - k` but harder to derive
   - Our formula `period - k` is more intuitive

4. **Attempting simulation for large k:**
   - The most common mistake is trying to simulate when k is large
   - Always check constraints first: k up to 10^9 means O(k) solutions will timeout
   - Look for patterns or mathematical formulas when constraints are large

## When You'll See This Pattern

This "bouncing ball" or "zigzag" pattern appears in several problems:

1. **Find the Losers of the Circular Game (Easy):** Similar circular passing pattern, though in a circle rather than a line. Both problems benefit from recognizing periodic behavior.

2. **Robot Bounded In Circle (Medium):** A robot moving in a plane with instructions that repeat. The key insight is determining if the path is bounded by checking if it returns to the origin or changes direction after one cycle.

3. **Prison Cells After N Days (Medium):** Cells change state based on neighbors, and the pattern repeats every 14 days. Like our problem, it requires finding the cycle length to avoid simulating all N days.

The common thread is recognizing when a process repeats and using modulo arithmetic to skip unnecessary iterations.

## Key Takeaways

1. **Always check constraints first:** When k or n can be very large (10^9), simulation is not an option. Look for mathematical patterns or formulas instead.

2. **Look for periodic behavior:** Many problems involving movement or state changes have repeating cycles. Finding the cycle length allows you to use modulo arithmetic to handle large iteration counts efficiently.

3. **Test with small examples:** Tracing through small cases (like n=4, k=5) helps reveal the pattern. Draw diagrams and look for symmetry in the movement.

Related problems: [Find the Losers of the Circular Game](/problem/find-the-losers-of-the-circular-game)
