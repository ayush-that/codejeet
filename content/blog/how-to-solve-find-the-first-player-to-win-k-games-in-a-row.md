---
title: "How to Solve Find The First Player to win K Games in a Row — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find The First Player to win K Games in a Row. Medium difficulty, 40.1% acceptance rate. Topics: Array, Simulation."
date: "2029-01-16"
category: "dsa-patterns"
tags: ["find-the-first-player-to-win-k-games-in-a-row", "array", "simulation", "medium"]
---

# How to Solve "Find The First Player to win K Games in a Row"

This problem simulates a tournament where players compete in a queue, with the winner staying to face the next challenger. The challenge is to efficiently determine which player first achieves **k consecutive wins** without simulating every single match when k could be large. The tricky part is that a naive simulation could become extremely slow when k is large, requiring us to find a smarter way to track wins.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `skills = [4, 2, 6, 3, 9]`
- `k = 3`

**Initial queue:** Players 0 through 4 with skills [4, 2, 6, 3, 9]

**Round 1:** Player 0 (skill 4) vs Player 1 (skill 2)

- Player 0 wins (4 > 2)
- Player 0's consecutive wins: 1
- Queue becomes: [0, 2, 3, 4] (winner stays at front, loser goes to back)

**Round 2:** Player 0 (skill 4) vs Player 2 (skill 6)

- Player 2 wins (6 > 4)
- Player 2's consecutive wins: 1
- Player 0's win streak resets to 0
- Queue becomes: [2, 3, 4, 0]

**Round 3:** Player 2 (skill 6) vs Player 3 (skill 3)

- Player 2 wins (6 > 3)
- Player 2's consecutive wins: 2
- Queue becomes: [2, 4, 0, 3]

**Round 4:** Player 2 (skill 6) vs Player 4 (skill 9)

- Player 4 wins (9 > 6)
- Player 4's consecutive wins: 1
- Player 2's win streak resets to 0
- Queue becomes: [4, 0, 3, 2]

**Round 5:** Player 4 (skill 9) vs Player 0 (skill 4)

- Player 4 wins (9 > 4)
- Player 4's consecutive wins: 2
- Queue becomes: [4, 3, 2, 0]

**Round 6:** Player 4 (skill 9) vs Player 3 (skill 3)

- Player 4 wins (9 > 3)
- Player 4's consecutive wins: 3 ✓

Player 4 has reached 3 consecutive wins! The answer is player 4.

Notice that once the most skilled player reaches the front of the queue, they will never lose (since all skills are unique). This is a key insight for optimization.

## Brute Force Approach

The most straightforward approach is to simulate the tournament exactly as described:

1. Use a queue to maintain player order
2. Keep track of each player's current consecutive wins
3. For each match:
   - Compare the front two players
   - Winner stays at front, loser goes to back
   - Update win streaks
   - Check if any player reaches k wins

The problem with this approach is time complexity. In the worst case, if k is very large (up to n² as per constraints), we might need to simulate O(n²) matches before the most skilled player reaches the front. With n up to 10⁵, this could mean simulating up to 10¹⁰ matches, which is far too slow.

Here's what the brute force code would look like:

<div class="code-group">

```python
# Time: O(n²) in worst case | Space: O(n)
def findWinningPlayer_brute(skills, k):
    n = len(skills)
    if k >= n:  # Quick optimization: if k >= n, max skill player wins
        return skills.index(max(skills))

    from collections import deque

    # Initialize queue with player indices
    queue = deque(range(n))
    win_streak = [0] * n

    while True:
        # Get the two players at front
        player1 = queue[0]
        player2 = queue[1]

        # Determine winner
        if skills[player1] > skills[player2]:
            winner = player1
            loser = player2
        else:
            winner = player2
            loser = player1

        # Update win streak
        win_streak[winner] += 1
        win_streak[loser] = 0  # Reset loser's streak

        # Check if winner has k consecutive wins
        if win_streak[winner] == k:
            return winner

        # Move players: winner stays at front, loser goes to back
        queue.popleft()  # Remove player1
        queue.popleft()  # Remove player2
        queue.appendleft(winner)  # Put winner back at front
        queue.append(loser)  # Put loser at back
```

```javascript
// Time: O(n²) in worst case | Space: O(n)
function findWinningPlayerBrute(skills, k) {
  const n = skills.length;
  if (k >= n) {
    // If k >= n, the player with max skill will win
    return skills.indexOf(Math.max(...skills));
  }

  // Initialize queue with player indices
  const queue = Array.from({ length: n }, (_, i) => i);
  const winStreak = new Array(n).fill(0);

  while (true) {
    const player1 = queue[0];
    const player2 = queue[1];

    // Determine winner
    let winner, loser;
    if (skills[player1] > skills[player2]) {
      winner = player1;
      loser = player2;
    } else {
      winner = player2;
      loser = player1;
    }

    // Update win streak
    winStreak[winner]++;
    winStreak[loser] = 0;

    // Check if winner has k consecutive wins
    if (winStreak[winner] === k) {
      return winner;
    }

    // Move players: winner stays at front, loser goes to back
    queue.shift(); // Remove player1
    queue.shift(); // Remove player2
    queue.unshift(winner); // Put winner back at front
    queue.push(loser); // Put loser at back
  }
}
```

```java
// Time: O(n²) in worst case | Space: O(n)
public int findWinningPlayerBrute(int[] skills, int k) {
    int n = skills.length;
    if (k >= n) {
        // If k >= n, find player with max skill
        int maxIdx = 0;
        for (int i = 1; i < n; i++) {
            if (skills[i] > skills[maxIdx]) {
                maxIdx = i;
            }
        }
        return maxIdx;
    }

    // Initialize queue with player indices
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < n; i++) {
        queue.offer(i);
    }

    int[] winStreak = new int[n];

    while (true) {
        int player1 = queue.poll();
        int player2 = queue.poll();

        int winner, loser;
        if (skills[player1] > skills[player2]) {
            winner = player1;
            loser = player2;
        } else {
            winner = player2;
            loser = player1;
        }

        // Update win streak
        winStreak[winner]++;
        winStreak[loser] = 0;

        // Check if winner has k consecutive wins
        if (winStreak[winner] == k) {
            return winner;
        }

        // Move players: winner stays at front, loser goes to back
        queue.offer(winner);
        queue.offer(loser);
        // Rotate to put winner at front
        int front = queue.poll();
        queue.offer(front);
    }
}
```

</div>

## Optimized Approach

The key insight is that **once the most skilled player reaches the front of the queue, they will never lose** (since all skills are unique). This means:

1. If `k` is very large (≥ n-1), the most skilled player will eventually win
2. For smaller `k`, we only need to simulate until either:
   - A player reaches `k` consecutive wins, OR
   - The most skilled player reaches the front (at which point they will win)

This optimization reduces the worst-case number of matches from O(n²) to O(n), since we only need to simulate until the most skilled player reaches the front, which happens after at most n-1 matches.

**Why at most n-1 matches?** In the worst case, the most skilled player starts at the very back of the queue. They need to defeat every other player once to reach the front, which takes n-1 matches.

**Algorithm:**

1. If `k ≥ n-1`, return the index of the player with maximum skill
2. Otherwise, simulate matches with a queue
3. Keep track of current winner and their consecutive wins
4. Stop when either:
   - Consecutive wins reach `k`, OR
   - We've simulated enough matches that the most skilled player must be at the front

## Optimal Solution

Here's the optimized solution that runs in O(n) time:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findWinningPlayer(skills, k):
    """
    Find the first player to win k consecutive games.

    Args:
        skills: List of unique skill values for each player
        k: Number of consecutive wins required

    Returns:
        Index of the first player to achieve k consecutive wins
    """
    n = len(skills)

    # Special case: if k is large enough, the player with max skill wins
    # The most skilled player needs at most n-1 wins to defeat everyone
    if k >= n - 1:
        # Find index of player with maximum skill
        max_skill_idx = 0
        for i in range(1, n):
            if skills[i] > skills[max_skill_idx]:
                max_skill_idx = i
        return max_skill_idx

    # Initialize queue with all players
    from collections import deque
    queue = deque(range(n))

    current_winner = queue.popleft()  # First player in queue
    consecutive_wins = 0

    # We only need to simulate at most n-1 matches
    # because after that, the most skilled player will be at front
    for _ in range(n - 1):
        # Get next challenger from queue
        challenger = queue.popleft()

        # Determine winner of this match
        if skills[current_winner] > skills[challenger]:
            # Current winner stays as winner
            consecutive_wins += 1
            # Loser goes to back of queue
            queue.append(challenger)
        else:
            # Challenger becomes new winner
            consecutive_wins = 1  # Reset streak for new winner
            # Previous winner goes to back of queue
            queue.append(current_winner)
            current_winner = challenger

        # Check if current winner has reached k consecutive wins
        if consecutive_wins == k:
            return current_winner

    # If we've simulated n-1 matches without reaching k wins,
    # the current winner must be the most skilled player
    return current_winner
```

```javascript
// Time: O(n) | Space: O(n)
function findWinningPlayer(skills, k) {
  const n = skills.length;

  // Special case: if k is large enough, the player with max skill wins
  if (k >= n - 1) {
    let maxSkillIdx = 0;
    for (let i = 1; i < n; i++) {
      if (skills[i] > skills[maxSkillIdx]) {
        maxSkillIdx = i;
      }
    }
    return maxSkillIdx;
  }

  // Initialize queue with all players
  const queue = Array.from({ length: n }, (_, i) => i);

  let currentWinner = queue.shift(); // First player in queue
  let consecutiveWins = 0;

  // We only need to simulate at most n-1 matches
  for (let i = 0; i < n - 1; i++) {
    const challenger = queue.shift();

    // Determine winner of this match
    if (skills[currentWinner] > skills[challenger]) {
      // Current winner stays as winner
      consecutiveWins++;
      // Loser goes to back of queue
      queue.push(challenger);
    } else {
      // Challenger becomes new winner
      consecutiveWins = 1; // Reset streak for new winner
      // Previous winner goes to back of queue
      queue.push(currentWinner);
      currentWinner = challenger;
    }

    // Check if current winner has reached k consecutive wins
    if (consecutiveWins === k) {
      return currentWinner;
    }
  }

  // If we've simulated n-1 matches without reaching k wins,
  // the current winner must be the most skilled player
  return currentWinner;
}
```

```java
// Time: O(n) | Space: O(n)
public int findWinningPlayer(int[] skills, int k) {
    int n = skills.length;

    // Special case: if k is large enough, the player with max skill wins
    if (k >= n - 1) {
        int maxSkillIdx = 0;
        for (int i = 1; i < n; i++) {
            if (skills[i] > skills[maxSkillIdx]) {
                maxSkillIdx = i;
            }
        }
        return maxSkillIdx;
    }

    // Initialize queue with all players
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < n; i++) {
        queue.offer(i);
    }

    int currentWinner = queue.poll();  // First player in queue
    int consecutiveWins = 0;

    // We only need to simulate at most n-1 matches
    for (int i = 0; i < n - 1; i++) {
        int challenger = queue.poll();

        // Determine winner of this match
        if (skills[currentWinner] > skills[challenger]) {
            // Current winner stays as winner
            consecutiveWins++;
            // Loser goes to back of queue
            queue.offer(challenger);
        } else {
            // Challenger becomes new winner
            consecutiveWins = 1;  // Reset streak for new winner
            // Previous winner goes to back of queue
            queue.offer(currentWinner);
            currentWinner = challenger;
        }

        // Check if current winner has reached k consecutive wins
        if (consecutiveWins == k) {
            return currentWinner;
        }
    }

    // If we've simulated n-1 matches without reaching k wins,
    // the current winner must be the most skilled player
    return currentWinner;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the maximum skill player (when k ≥ n-1) takes O(n)
- Simulating matches takes at most O(n-1) iterations
- Each iteration performs O(1) operations (comparisons and queue operations)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store a queue of up to n player indices
- We use a few integer variables for tracking current state
- Total auxiliary space: O(n)

## Common Mistakes

1. **Not handling the k ≥ n-1 case separately**: This leads to unnecessary simulation and potential timeouts. Remember that once the most skilled player reaches the front, they can't be beaten.

2. **Incorrect queue management after a match**: A common error is putting players back in the wrong order. The winner should stay at the front, and the loser should go to the back. Double-check the order of queue operations.

3. **Forgetting to reset win streaks**: When a new player wins, you must reset the consecutive wins counter to 1 (not 0, since they just won their first match).

4. **Infinite loop with incorrect termination condition**: Without the n-1 limit on simulations, you could get stuck in an infinite loop when k is very large. Always include the insight that after n-1 matches, the most skilled player must be at the front.

## When You'll See This Pattern

This problem combines **queue simulation** with **early termination optimization**. Similar patterns appear in:

1. **Design Circular Queue (LeetCode 622)**: Both problems require efficient queue operations and understanding of circular behavior.

2. **Reveal Cards In Increasing Order (LeetCode 950)**: Involves simulating a process with a queue and requires understanding the pattern of operations.

3. **Dota2 Senate (LeetCode 649)**: Another simulation problem where understanding when the process terminates early is key to optimization.

The core pattern is recognizing when a process has a guaranteed outcome after a certain point, allowing you to stop early rather than simulating to completion.

## Key Takeaways

1. **Look for termination conditions**: In simulation problems, always ask: "When can I stop early?" Here, once the most skilled player is at the front, the outcome is determined.

2. **Understand worst-case bounds**: Analyzing that the most skilled player needs at most n-1 matches to reach the front gives us the O(n) bound, not O(n²).

3. **Queue operations matter**: Practice the precise sequence of enqueue/dequeue operations needed to maintain the correct order after each match.

[Practice this problem on CodeJeet](/problem/find-the-first-player-to-win-k-games-in-a-row)
