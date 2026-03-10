---
title: "How to Solve Minimum Number of Operations to Move All Balls to Each Box — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Move All Balls to Each Box. Medium difficulty, 90.1% acceptance rate. Topics: Array, String, Prefix Sum."
date: "2027-11-02"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-move-all-balls-to-each-box",
    "array",
    "string",
    "prefix-sum",
    "medium",
  ]
---

# How to Solve Minimum Number of Operations to Move All Balls to Each Box

You're given a binary string representing boxes, where '1' means a ball is present. For each box, you need to calculate the total number of operations required to move all balls to that box, where moving a ball one position counts as one operation. The challenge is doing this efficiently for all boxes without recalculating distances from scratch for each position.

## Visual Walkthrough

Let's trace through a concrete example: `boxes = "1101"` (n=4)

We need to calculate for each position i (0-indexed):

- How many operations to move all balls to position i

**Position 0:** Balls at positions 0, 1, and 3

- Ball at 0: 0 operations (already there)
- Ball at 1: 1 operation (move left)
- Ball at 3: 3 operations (move left 3 times)
  Total: 0 + 1 + 3 = 4

**Position 1:** Balls at positions 0, 1, and 3

- Ball at 0: 1 operation (move right)
- Ball at 1: 0 operations
- Ball at 3: 2 operations (move left 2 times)
  Total: 1 + 0 + 2 = 3

**Position 2:** Balls at positions 0, 1, and 3

- Ball at 0: 2 operations
- Ball at 1: 1 operation
- Ball at 3: 1 operation
  Total: 2 + 1 + 1 = 4

**Position 3:** Balls at positions 0, 1, and 3

- Ball at 0: 3 operations
- Ball at 1: 2 operations
- Ball at 3: 0 operations
  Total: 3 + 2 + 0 = 5

Result: `[4, 3, 4, 5]`

The brute force approach would calculate these sums directly, but we can do better by noticing patterns in how the sums change between adjacent positions.

## Brute Force Approach

The most straightforward solution is to calculate the answer for each box independently. For each target position i, we iterate through all boxes, and for every box j that contains a ball (boxes[j] == '1'), we add the distance |i - j| to the answer for position i.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n) for output
def minOperations_brute(boxes):
    n = len(boxes)
    answer = [0] * n

    for i in range(n):
        total = 0
        for j in range(n):
            if boxes[j] == '1':
                total += abs(i - j)
        answer[i] = total

    return answer
```

```javascript
// Time: O(n²) | Space: O(n) for output
function minOperationsBrute(boxes) {
  const n = boxes.length;
  const answer = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let total = 0;
    for (let j = 0; j < n; j++) {
      if (boxes[j] === "1") {
        total += Math.abs(i - j);
      }
    }
    answer[i] = total;
  }

  return answer;
}
```

```java
// Time: O(n²) | Space: O(n) for output
public int[] minOperationsBrute(String boxes) {
    int n = boxes.length();
    int[] answer = new int[n];

    for (int i = 0; i < n; i++) {
        int total = 0;
        for (int j = 0; j < n; j++) {
            if (boxes.charAt(j) == '1') {
                total += Math.abs(i - j);
            }
        }
        answer[i] = total;
    }

    return answer;
}
```

</div>

**Why this is inefficient:** For n boxes, we're doing O(n) work for each of n positions, resulting in O(n²) time complexity. With n up to 2000 in typical constraints, this could mean up to 4 million operations, which might be acceptable but isn't optimal. We can do better with O(n) time.

## Optimized Approach

The key insight is that we can compute the answer incrementally using prefix sums. When we move from position i to i+1:

1. **Balls to the left of i+1:** Each of these balls now needs one **more** operation to reach i+1 compared to reaching i (since they're farther away).
2. **Balls to the right of i+1:** Each of these balls now needs one **less** operation to reach i+1 compared to reaching i (since they're closer).

We can track:

- `leftCount`: Number of balls to the left of current position
- `leftCost`: Total operations needed to move all left balls to current position
- `rightCount`: Number of balls to the right of current position
- `rightCost`: Total operations needed to move all right balls to current position

For position i:

- `answer[i] = leftCost + rightCost`

When moving from i to i+1:

- `leftCost += leftCount` (each left ball needs 1 more operation)
- `rightCost -= rightCount` (each right ball needs 1 less operation)
- Update `leftCount` and `rightCount` based on whether there's a ball at position i

We can compute this in two passes:

1. Left-to-right pass: Calculate contributions from balls on the left
2. Right-to-left pass: Calculate contributions from balls on the right

## Optimal Solution

Here's the O(n) time, O(n) space solution using prefix sums:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def minOperations(boxes):
    n = len(boxes)
    answer = [0] * n

    # First pass: calculate cost from left balls
    count = 0  # number of balls encountered so far
    cost = 0   # total cost to move all left balls to current position

    for i in range(n):
        # Current answer gets contribution from left balls
        answer[i] = cost

        # Update count and cost for next position
        if boxes[i] == '1':
            count += 1

        # For next position, all left balls (including current if it has one)
        # will need one more operation to reach it
        cost += count

    # Second pass: calculate cost from right balls
    count = 0  # number of balls encountered from right
    cost = 0   # total cost to move all right balls to current position

    for i in range(n - 1, -1, -1):
        # Add contribution from right balls to current answer
        answer[i] += cost

        # Update count and cost for next position (moving left)
        if boxes[i] == '1':
            count += 1

        # For next position (to the left), all right balls (including current if it has one)
        # will need one more operation to reach it
        cost += count

    return answer
```

```javascript
// Time: O(n) | Space: O(n)
function minOperations(boxes) {
  const n = boxes.length;
  const answer = new Array(n).fill(0);

  // First pass: left to right
  let count = 0; // balls seen so far
  let cost = 0; // total cost from left balls

  for (let i = 0; i < n; i++) {
    // Add cost from left balls to current position
    answer[i] = cost;

    // Update for next position
    if (boxes[i] === "1") {
      count++;
    }

    // All left balls need one more step for next position
    cost += count;
  }

  // Second pass: right to left
  count = 0; // balls seen from right
  cost = 0; // total cost from right balls

  for (let i = n - 1; i >= 0; i--) {
    // Add cost from right balls to current position
    answer[i] += cost;

    // Update for next position (moving left)
    if (boxes[i] === "1") {
      count++;
    }

    // All right balls need one more step for next position (to the left)
    cost += count;
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(n)
public int[] minOperations(String boxes) {
    int n = boxes.length();
    int[] answer = new int[n];

    // Left to right pass
    int count = 0;  // balls encountered so far
    int cost = 0;   // cost from left balls

    for (int i = 0; i < n; i++) {
        answer[i] = cost;  // cost from left balls

        if (boxes.charAt(i) == '1') {
            count++;
        }

        // For next position, all left balls need one more operation
        cost += count;
    }

    // Right to left pass
    count = 0;  // balls encountered from right
    cost = 0;   // cost from right balls

    for (int i = n - 1; i >= 0; i--) {
        answer[i] += cost;  // add cost from right balls

        if (boxes.charAt(i) == '1') {
            count++;
        }

        // For next position (to the left), all right balls need one more operation
        cost += count;
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the array: one left-to-right and one right-to-left
- Each pass does constant work per element (updating counts and costs)
- Total operations: 2n = O(n)

**Space Complexity:** O(n)

- We need to store the answer array of size n
- We use only a few extra variables (count, cost) for O(1) additional space
- Total: O(n) for output + O(1) extra = O(n)

## Common Mistakes

1. **Off-by-one errors in the prefix sum updates:** When updating `cost` for the next position, it's easy to add `count` before or after checking the current box. Remember: current position's answer uses current `cost`, then we update `count` if current box has a ball, then update `cost` for the next position.

2. **Forgetting to reset variables for the second pass:** After the left-to-right pass, you must reset `count` and `cost` to 0 before the right-to-left pass. Otherwise, you'll carry over values from the first pass.

3. **Incorrectly handling the right-to-left pass:** In the second pass, we're moving from right to left, so "next position" means i-1, not i+1. The logic is symmetric but reversed.

4. **Using integer division incorrectly:** Some candidates try to use mathematical formulas involving sums of indices, but this gets complicated with the binary nature of the problem. The two-pass prefix approach is cleaner and less error-prone.

## When You'll See This Pattern

This "prefix sum with incremental updates" pattern appears in problems where you need to compute a value for each position based on distances to other positions with certain properties.

**Related problems:**

1. **Minimum Cost to Move Chips to The Same Position (LeetCode 1217):** Similar concept of moving items with different costs based on distance, though with a simpler parity-based solution.
2. **Minimum Moves to Spread Stones Over Grid (LeetCode 2850):** Another distribution problem where you need to calculate movement costs.
3. **Product of Array Except Self (LeetCode 238):** Uses similar two-pass prefix technique, but with multiplication instead of addition.
4. **Trapping Rain Water (LeetCode 42):** Uses prefix maximums from both directions to compute water at each position.

## Key Takeaways

1. **When you need to compute a value for each position based on distances to other positions**, consider using prefix sums to avoid O(n²) time. The key insight is that moving from position i to i+1 changes the total distance in a predictable way.

2. **Two-pass solutions are powerful:** Many array problems can be solved by processing the array from left to right, then from right to left, accumulating information along the way.

3. **Think incrementally:** Instead of recalculating from scratch for each position, ask: "How does the answer change when I move one position to the right/left?" This incremental thinking often leads to optimal solutions.

Related problems: [Minimum Cost to Move Chips to The Same Position](/problem/minimum-cost-to-move-chips-to-the-same-position), [Minimum Moves to Spread Stones Over Grid](/problem/minimum-moves-to-spread-stones-over-grid)
