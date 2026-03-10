---
title: "How to Solve Find the Winner of the Circular Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Winner of the Circular Game. Medium difficulty, 82.2% acceptance rate. Topics: Array, Math, Recursion, Queue, Simulation."
date: "2027-09-06"
category: "dsa-patterns"
tags: ["find-the-winner-of-the-circular-game", "array", "math", "recursion", "medium"]
---

# How to Solve Find the Winner of the Circular Game

This problem presents a classic Josephus problem: `n` friends numbered 1 to `n` sit in a circle, and every `k`th person is eliminated until only one remains. The challenge is determining the winner efficiently. What makes this interesting is that while a simulation approach is intuitive, the mathematical recurrence relation provides an O(n) time and O(1) space solution that's perfect for interviews.

## Visual Walkthrough

Let's trace through `n = 5, k = 2` step by step to build intuition:

**Initial circle:** [1, 2, 3, 4, 5] (positions 1-indexed)

**Round 1:** Start at position 1. Count 2 positions: 1 → 2. Friend 2 is eliminated.
Remaining: [1, 3, 4, 5]
Next start: The person after eliminated friend 2 is friend 3.

**Round 2:** Start at friend 3. Count 2 positions: 3 → 4. Friend 4 is eliminated.
Remaining: [1, 3, 5]
Next start: The person after eliminated friend 4 is friend 5.

**Round 3:** Start at friend 5. Count 2 positions: 5 → 1. Friend 1 is eliminated.
Remaining: [3, 5]
Next start: The person after eliminated friend 1 is friend 3.

**Round 4:** Start at friend 3. Count 2 positions: 3 → 5. Friend 5 is eliminated.
**Winner:** Friend 3

The key observation: After each elimination, we effectively have a smaller Josephus problem with the same `k` but different starting position.

## Brute Force Approach

The most intuitive solution is to simulate the elimination process using an array or list. We maintain the current position and repeatedly:

1. Calculate the next elimination index: `(current + k - 1) % n`
2. Remove that element
3. Update current position to the index of the next person

This approach works but has a critical flaw: removing elements from an array takes O(n) time in the worst case, making the overall time complexity O(n²). For large `n` (up to 500 in typical constraints), this could be too slow.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def findTheWinnerBrute(n: int, k: int) -> int:
    """
    Brute force simulation using list removal.
    Each removal takes O(n) time, leading to O(n²) overall.
    """
    # Create list of friends [1, 2, ..., n]
    friends = list(range(1, n + 1))

    # Start at index 0 (first friend)
    current = 0

    # Continue until only one friend remains
    while len(friends) > 1:
        # Calculate index to eliminate: move k-1 steps from current
        # Modulo ensures we wrap around the circle
        eliminate_idx = (current + k - 1) % len(friends)

        # Remove the eliminated friend
        friends.pop(eliminate_idx)

        # Next round starts at the position of the friend
        # who was immediately after the eliminated one
        # Since we removed an element, current index already points
        # to the next person if eliminate_idx was before it
        current = eliminate_idx if eliminate_idx < len(friends) else 0

    # Return the last remaining friend
    return friends[0]
```

```javascript
// Time: O(n²) | Space: O(n)
function findTheWinnerBrute(n, k) {
  /**
   * Brute force simulation using array removal.
   * Each splice() takes O(n) time, leading to O(n²) overall.
   */
  // Create array of friends [1, 2, ..., n]
  const friends = Array.from({ length: n }, (_, i) => i + 1);

  // Start at index 0 (first friend)
  let current = 0;

  // Continue until only one friend remains
  while (friends.length > 1) {
    // Calculate index to eliminate: move k-1 steps from current
    // Modulo ensures we wrap around the circle
    const eliminateIdx = (current + k - 1) % friends.length;

    // Remove the eliminated friend
    friends.splice(eliminateIdx, 1);

    // Next round starts at the position of the friend
    // who was immediately after the eliminated one
    current = eliminateIdx < friends.length ? eliminateIdx : 0;
  }

  // Return the last remaining friend
  return friends[0];
}
```

```java
// Time: O(n²) | Space: O(n)
public int findTheWinnerBrute(int n, int k) {
    /**
     * Brute force simulation using ArrayList removal.
     * Each remove() takes O(n) time, leading to O(n²) overall.
     */
    // Create list of friends [1, 2, ..., n]
    List<Integer> friends = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        friends.add(i);
    }

    // Start at index 0 (first friend)
    int current = 0;

    // Continue until only one friend remains
    while (friends.size() > 1) {
        // Calculate index to eliminate: move k-1 steps from current
        // Modulo ensures we wrap around the circle
        int eliminateIdx = (current + k - 1) % friends.size();

        // Remove the eliminated friend
        friends.remove(eliminateIdx);

        // Next round starts at the position of the friend
        // who was immediately after the eliminated one
        current = eliminateIdx < friends.size() ? eliminateIdx : 0;
    }

    // Return the last remaining friend
    return friends.get(0);
}
```

</div>

## Optimized Approach

The key insight comes from the Josephus recurrence relation. Let's think recursively:

If we know the winner's position in a circle of `n-1` people (0-indexed), we can find the winner's position in a circle of `n` people. After eliminating the `k`th person in the `n`-person circle, we have `n-1` people left, and the elimination process continues from the next person.

Mathematically:

- `J(n, k)` = position of winner with `n` people, counting every `k`th person
- After first elimination, we have `n-1` people starting from position `k % n`
- The winner in the smaller circle is at position `J(n-1, k)` (0-indexed in the smaller circle)
- To map this back to the original circle: `J(n, k) = (J(n-1, k) + k) % n`

This gives us a beautiful recurrence:

- Base case: `J(1, k) = 0` (with 1 person, the winner is at position 0)
- Recurrence: `J(n, k) = (J(n-1, k) + k) % n`

We can solve this iteratively in O(n) time and O(1) space by starting from the base case and building up to `n`.

## Optimal Solution

Here's the efficient implementation using the Josephus recurrence relation:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findTheWinner(n: int, k: int) -> int:
    """
    Optimal solution using Josephus recurrence relation.
    J(n, k) = (J(n-1, k) + k) % n, with J(1, k) = 0.
    Returns 1-indexed result as required by the problem.
    """
    # winner_position stores the 0-indexed position of the winner
    # Start with base case: 1 person, winner at position 0
    winner_position = 0

    # Build up from 2 people to n people
    # For each i from 2 to n, calculate winner for i people
    for i in range(2, n + 1):
        # Apply recurrence: new winner = (old winner + k) % i
        # This gives 0-indexed position in circle of i people
        winner_position = (winner_position + k) % i

    # Convert from 0-indexed to 1-indexed as required
    return winner_position + 1
```

```javascript
// Time: O(n) | Space: O(1)
function findTheWinner(n, k) {
  /**
   * Optimal solution using Josephus recurrence relation.
   * J(n, k) = (J(n-1, k) + k) % n, with J(1, k) = 0.
   * Returns 1-indexed result as required by the problem.
   */
  // winnerPosition stores the 0-indexed position of the winner
  // Start with base case: 1 person, winner at position 0
  let winnerPosition = 0;

  // Build up from 2 people to n people
  // For each i from 2 to n, calculate winner for i people
  for (let i = 2; i <= n; i++) {
    // Apply recurrence: new winner = (old winner + k) % i
    // This gives 0-indexed position in circle of i people
    winnerPosition = (winnerPosition + k) % i;
  }

  // Convert from 0-indexed to 1-indexed as required
  return winnerPosition + 1;
}
```

```java
// Time: O(n) | Space: O(1)
public int findTheWinner(int n, int k) {
    /**
     * Optimal solution using Josephus recurrence relation.
     * J(n, k) = (J(n-1, k) + k) % n, with J(1, k) = 0.
     * Returns 1-indexed result as required by the problem.
     */
    // winnerPosition stores the 0-indexed position of the winner
    // Start with base case: 1 person, winner at position 0
    int winnerPosition = 0;

    // Build up from 2 people to n people
    // For each i from 2 to n, calculate winner for i people
    for (int i = 2; i <= n; i++) {
        // Apply recurrence: new winner = (old winner + k) % i
        // This gives 0-indexed position in circle of i people
        winnerPosition = (winnerPosition + k) % i;
    }

    // Convert from 0-indexed to 1-indexed as required
    return winnerPosition + 1;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate from 2 to `n`, performing constant-time operations (addition and modulo) at each step
- This is significantly faster than the O(n²) brute force approach

**Space Complexity:** O(1)

- We only use a single integer variable to track the winner's position
- No additional data structures scale with input size

## Common Mistakes

1. **Off-by-one errors with indexing:** The problem uses 1-indexed friends, but the mathematical recurrence uses 0-indexed positions. Forgetting to convert between these (adding/subtracting 1 at the wrong time) is the most common error. Always clarify whether you're working with 0-indexed or 1-indexed positions.

2. **Incorrect modulo operation:** Using `% n` instead of `% i` in the recurrence. Remember that as we build up the solution, the circle size changes at each iteration, so we need `% i` not `% n`.

3. **Starting the loop from 1 instead of 2:** The base case handles `n = 1`, so we should start building from `i = 2`. Starting from `i = 1` would incorrectly apply the recurrence for the base case.

4. **Using recursion without memoization:** While the recurrence suggests recursion, a naive recursive implementation would have O(n) space for the call stack and risk stack overflow for large `n`. The iterative approach is preferred.

## When You'll See This Pattern

The Josephus problem pattern appears in various elimination games and circular buffer problems:

1. **Josephus Problem (LeetCode 1823)** - This is the exact problem we just solved.

2. **Design Circular Queue (LeetCode 622)** - While not an elimination problem, it uses similar circular indexing techniques with modulo arithmetic.

3. **Elimination Game (LeetCode 390)** - A variation where elimination alternates between left-to-right and right-to-left directions.

4. **Find the Winner on the Tic Tac Toe Game (LeetCode 1275)** - Different game but similar "determine winner after moves" pattern.

The core technique of using modulo arithmetic for circular structures and building solutions incrementally from smaller subproblems is widely applicable.

## Key Takeaways

1. **Circular problems often use modulo arithmetic:** When dealing with circular structures, `% n` (where `n` is the size) is your friend for wrapping around.

2. **Recurrence relations can optimize simulation problems:** If you can express the solution for size `n` in terms of the solution for size `n-1`, you can often achieve O(n) time instead of simulating the entire process.

3. **Clarify indexing conventions:** Always check whether the problem uses 0-indexed or 1-indexed positions and convert consistently throughout your solution.

[Practice this problem on CodeJeet](/problem/find-the-winner-of-the-circular-game)
