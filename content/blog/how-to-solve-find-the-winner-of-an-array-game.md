---
title: "How to Solve Find the Winner of an Array Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Winner of an Array Game. Medium difficulty, 56.8% acceptance rate. Topics: Array, Simulation."
date: "2027-01-15"
category: "dsa-patterns"
tags: ["find-the-winner-of-an-array-game", "array", "simulation", "medium"]
---

# How to Solve "Find the Winner of an Array Game"

This problem simulates a tournament-style game where two numbers compete, the winner stays at the front, and the loser goes to the back. The tricky part is that `k` can be up to 10^9, making direct simulation impossible — we need a clever observation to avoid simulating billions of rounds.

## Visual Walkthrough

Let's trace through `arr = [2,1,3,5,4,6,7]` with `k = 2`:

**Round 1:** Compare 2 vs 1 → 2 wins (1 goes to back)  
Array becomes: [2,3,5,4,6,7,1]  
Current winner: 2 with 1 win

**Round 2:** Compare 2 vs 3 → 3 wins (2 goes to back)  
Array becomes: [3,5,4,6,7,1,2]  
Current winner: 3 with 1 win (2's streak ends)

Since `k = 2`, we need a player to win 2 consecutive games. No one has done that yet, so we continue.

**Round 3:** Compare 3 vs 5 → 5 wins  
Array becomes: [5,4,6,7,1,2,3]  
Current winner: 5 with 1 win

**Round 4:** Compare 5 vs 4 → 5 wins  
Array becomes: [5,6,7,1,2,3,4]  
Current winner: 5 with 2 wins

5 has won 2 consecutive games, so 5 is the winner! Notice we didn't need to simulate all possible rounds — once a number beats `k` consecutive opponents, it must be the maximum element in the array.

## Brute Force Approach

The most straightforward approach is to literally simulate the game:

1. While no player has `k` wins:
   - Compare the first two elements
   - Move the loser to the back
   - Track consecutive wins for the winner
2. Return the first element when someone reaches `k` wins

The problem? With `k` up to 10^9 and array length up to 10^5, we could need to simulate billions of operations. Even with efficient array operations (using a deque), this is O(k) time, which is completely infeasible.

## Optimized Approach

The key insight: **Once an element beats `k` consecutive opponents, it must be the maximum element in the array.** Why? Because:

1. All elements are distinct
2. The maximum element can never lose
3. If any element beats `k` others in a row, it must have beaten every other element

This leads to our optimization:

- We only need to simulate until we find an element that wins `k` times
- But there's an even better observation: we don't need to physically move elements
- We can simply track the current champion and their win count
- If the champion loses, the new element becomes champion with 1 win
- If we reach the maximum element, it will eventually win `k` times

Actually, there's an even simpler realization: **We only need to check the first `k+1` elements (or until we find the maximum)**. Once we find the maximum element, it will win all remaining games.

## Optimal Solution

The optimal approach uses a single pass through the array:

1. Track the current champion and their consecutive wins
2. Compare each new element to the champion
3. If champion wins, increment their win count
4. If new element wins, it becomes the new champion with 1 win
5. Stop when win count reaches `k` OR we find the maximum element

Why does this work? Because once we've seen all elements, the maximum will be the champion, and it will eventually win `k` times. We don't need to simulate the circular behavior explicitly.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def getWinner(arr, k):
    """
    Find the element that wins k consecutive games in the array game.

    The key insight: if an element wins k games before we've seen all
    elements, it's the answer. Otherwise, the maximum element in the
    entire array will eventually win k games.
    """
    # Current champion starts as the first element
    current_winner = arr[0]
    consecutive_wins = 0

    # Start comparing from the second element
    for i in range(1, len(arr)):
        # If current champion beats the next element
        if current_winner > arr[i]:
            consecutive_wins += 1
        else:
            # New element becomes champion
            current_winner = arr[i]
            consecutive_wins = 1  # Reset win count for new champion

        # Early exit: if champion has k wins, we found our answer
        if consecutive_wins == k:
            return current_winner

    # If we've gone through the entire array without reaching k wins,
    # the current champion must be the maximum element (since it beat
    # everything else). It will eventually win k games.
    return current_winner
```

```javascript
// Time: O(n) | Space: O(1)
function getWinner(arr, k) {
  /**
   * Find the element that wins k consecutive games in the array game.
   *
   * The key insight: if an element wins k games before we've seen all
   * elements, it's the answer. Otherwise, the maximum element in the
   * entire array will eventually win k games.
   */
  // Current champion starts as the first element
  let currentWinner = arr[0];
  let consecutiveWins = 0;

  // Start comparing from the second element
  for (let i = 1; i < arr.length; i++) {
    // If current champion beats the next element
    if (currentWinner > arr[i]) {
      consecutiveWins++;
    } else {
      // New element becomes champion
      currentWinner = arr[i];
      consecutiveWins = 1; // Reset win count for new champion
    }

    // Early exit: if champion has k wins, we found our answer
    if (consecutiveWins === k) {
      return currentWinner;
    }
  }

  // If we've gone through the entire array without reaching k wins,
  // the current champion must be the maximum element (since it beat
  // everything else). It will eventually win k games.
  return currentWinner;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int getWinner(int[] arr, int k) {
        /**
         * Find the element that wins k consecutive games in the array game.
         *
         * The key insight: if an element wins k games before we've seen all
         * elements, it's the answer. Otherwise, the maximum element in the
         * entire array will eventually win k games.
         */
        // Current champion starts as the first element
        int currentWinner = arr[0];
        int consecutiveWins = 0;

        // Start comparing from the second element
        for (int i = 1; i < arr.length; i++) {
            // If current champion beats the next element
            if (currentWinner > arr[i]) {
                consecutiveWins++;
            } else {
                // New element becomes champion
                currentWinner = arr[i];
                consecutiveWins = 1;  // Reset win count for new champion
            }

            // Early exit: if champion has k wins, we found our answer
            if (consecutiveWins == k) {
                return currentWinner;
            }
        }

        // If we've gone through the entire array without reaching k wins,
        // the current champion must be the maximum element (since it beat
        // everything else). It will eventually win k games.
        return currentWinner;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array
- Each element is compared exactly once
- Early exit possible if we find a winner before reaching the end

**Space Complexity: O(1)**

- We only use a few variables to track the current winner and win count
- No additional data structures needed

## Common Mistakes

1. **Actually simulating the array rotations**: Some candidates try to use a deque to physically move elements. This becomes O(k \* n) in worst case when k is large. Remember: we only need to track who wins, not actually rearrange the array.

2. **Forgetting that k can be larger than array length**: When k > n, the maximum element will always win. Our solution handles this correctly because if we go through the entire array, we return the maximum element.

3. **Incorrect win counting when a new champion emerges**: When a new element wins, it starts with 1 win (for beating the previous champion), not 0 wins. This is a subtle but important detail.

4. **Not handling the edge case where k = 0**: If k = 0, the first element is immediately the winner. Our solution handles this because consecutive_wins starts at 0, and if k = 0, we'd return on the first check (though in practice k ≥ 1 in the problem constraints).

## When You'll See This Pattern

This problem teaches the **"early termination with state tracking"** pattern, where you:

1. Maintain some state (current champion, win count)
2. Update it as you process elements
3. Terminate early when a condition is met

Similar problems include:

1. **Majority Element (LeetCode 169)**: Find the element that appears more than n/2 times. Like our problem, you can track a "candidate" and count, updating as you go.

2. **Find the Celebrity (LeetCode 277)**: You eliminate candidates one by one based on comparisons, similar to how we update our champion.

3. **Game of Life (LeetCode 289)**: While different in topic, it also involves simulating rules but with clever optimizations to avoid unnecessary work.

## Key Takeaways

1. **Look for mathematical insights before coding**: The realization that we don't need to simulate rotations came from understanding that once we find the maximum, it wins forever.

2. **Track state, not the entire system**: Instead of maintaining the full array state, we only needed to know the current champion and their win count.

3. **Early termination is powerful**: We can stop as soon as we find an element with k wins, which often happens long before processing all elements.

[Practice this problem on CodeJeet](/problem/find-the-winner-of-an-array-game)
