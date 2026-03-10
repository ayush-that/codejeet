---
title: "How to Solve Count of Matches in Tournament — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count of Matches in Tournament. Easy difficulty, 86.3% acceptance rate. Topics: Math, Simulation."
date: "2027-12-06"
category: "dsa-patterns"
tags: ["count-of-matches-in-tournament", "math", "simulation", "easy"]
---

# How to Solve Count of Matches in Tournament

This problem asks you to calculate the total number of matches played in a tournament with specific rules: when there are `n` teams, if `n` is even, `n/2` matches are played and `n/2` teams advance; if `n` is odd, `(n-1)/2` matches are played and `(n-1)/2 + 1` teams advance. The tournament continues until only one team remains. While this seems straightforward, the interesting part is recognizing that there's a mathematical shortcut that makes the solution much more elegant than brute simulation.

## Visual Walkthrough

Let's trace through an example with `n = 7` teams to understand how the tournament progresses:

**Round 1:** 7 teams (odd)

- Matches played: (7-1)/2 = 3 matches
- Teams advancing: 3 winners + 1 team that got a bye = 4 teams

**Round 2:** 4 teams (even)

- Matches played: 4/2 = 2 matches
- Teams advancing: 2 teams

**Round 3:** 2 teams (even)

- Matches played: 2/2 = 1 match
- Teams advancing: 1 team (champion)

**Total matches:** 3 + 2 + 1 = 6 matches

Notice something interesting: with 7 teams, we need to eliminate 6 teams to have a champion, and each match eliminates exactly 1 team. This gives us a key insight: **total matches = n - 1** regardless of the specific tournament rules!

Let's verify with another example, `n = 14`:

- Each match eliminates 1 team
- Need to eliminate 13 teams to have 1 champion
- Total matches = 13 = 14 - 1

This pattern holds because every match produces exactly 1 loser who is eliminated, and we need to eliminate all but 1 team.

## Brute Force Approach

The most intuitive approach is to simulate the tournament round by round, exactly as described in the problem statement. While this approach works and is easy to understand, it's less efficient than the mathematical solution.

Here's what the brute force simulation looks like:

1. Start with `n` teams
2. While `n > 1`:
   - If `n` is even: add `n/2` to total matches, set `n = n/2`
   - If `n` is odd: add `(n-1)/2` to total matches, set `n = (n-1)/2 + 1`
3. Return total matches

This approach has O(log n) time complexity since we roughly halve the number of teams each round. While this is efficient enough for the problem constraints, the mathematical solution is O(1) in terms of actual computation.

## Optimal Solution

The optimal solution recognizes the key insight: each match eliminates exactly one team, and we need to eliminate `n-1` teams to have a single champion. Therefore, the total number of matches is always `n-1`.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def numberOfMatches(n: int) -> int:
    """
    Calculate total matches in tournament.

    Key insight: Each match eliminates exactly one team.
    To have one champion, we need to eliminate n-1 teams.
    Therefore, total matches = n-1.

    Args:
        n: Number of teams in the tournament

    Returns:
        Total number of matches played
    """
    # Each match eliminates one team, need to eliminate n-1 teams
    return n - 1
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Calculate total matches in tournament.
 *
 * Key insight: Each match eliminates exactly one team.
 * To have one champion, we need to eliminate n-1 teams.
 * Therefore, total matches = n-1.
 *
 * @param {number} n - Number of teams in the tournament
 * @return {number} Total number of matches played
 */
function numberOfMatches(n) {
  // Each match eliminates one team, need to eliminate n-1 teams
  return n - 1;
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Calculate total matches in tournament.
     *
     * Key insight: Each match eliminates exactly one team.
     * To have one champion, we need to eliminate n-1 teams.
     * Therefore, total matches = n-1.
     *
     * @param n Number of teams in the tournament
     * @return Total number of matches played
     */
    public int numberOfMatches(int n) {
        // Each match eliminates one team, need to eliminate n-1 teams
        return n - 1;
    }
}
```

</div>

For completeness, here's the simulation approach that some interviewers might expect to see if they want to test your ability to implement the rules as described:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def numberOfMatchesSimulation(n: int) -> int:
    """
    Simulation approach: Follow the tournament rules exactly.

    While more than 1 team remains:
    - If even teams: n/2 matches, n/2 teams advance
    - If odd teams: (n-1)/2 matches, (n-1)/2 + 1 teams advance

    Args:
        n: Number of teams in the tournament

    Returns:
        Total number of matches played
    """
    total_matches = 0

    # Continue until we have a champion
    while n > 1:
        if n % 2 == 0:  # Even number of teams
            matches = n // 2
            n = n // 2  # Teams advancing
        else:  # Odd number of teams
            matches = (n - 1) // 2
            n = (n - 1) // 2 + 1  # Teams advancing (winners + bye)

        total_matches += matches

    return total_matches
```

```javascript
// Time: O(log n) | Space: O(1)
function numberOfMatchesSimulation(n) {
  /**
   * Simulation approach: Follow the tournament rules exactly.
   *
   * While more than 1 team remains:
   * - If even teams: n/2 matches, n/2 teams advance
   * - If odd teams: (n-1)/2 matches, (n-1)/2 + 1 teams advance
   *
   * @param {number} n - Number of teams in the tournament
   * @return {number} Total number of matches played
   */
  let totalMatches = 0;

  // Continue until we have a champion
  while (n > 1) {
    if (n % 2 === 0) {
      // Even number of teams
      const matches = n / 2;
      n = n / 2; // Teams advancing
      totalMatches += matches;
    } else {
      // Odd number of teams
      const matches = (n - 1) / 2;
      n = (n - 1) / 2 + 1; // Teams advancing (winners + bye)
      totalMatches += matches;
    }
  }

  return totalMatches;
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    public int numberOfMatchesSimulation(int n) {
        /**
         * Simulation approach: Follow the tournament rules exactly.
         *
         * While more than 1 team remains:
         * - If even teams: n/2 matches, n/2 teams advance
         * - If odd teams: (n-1)/2 matches, (n-1)/2 + 1 teams advance
         *
         * @param n Number of teams in the tournament
         * @return Total number of matches played
         */
        int totalMatches = 0;

        // Continue until we have a champion
        while (n > 1) {
            if (n % 2 == 0) {  // Even number of teams
                int matches = n / 2;
                n = n / 2;  // Teams advancing
                totalMatches += matches;
            } else {  // Odd number of teams
                int matches = (n - 1) / 2;
                n = (n - 1) / 2 + 1;  // Teams advancing (winners + bye)
                totalMatches += matches;
            }
        }

        return totalMatches;
    }
}
```

</div>

## Complexity Analysis

**Mathematical Solution (n-1):**

- **Time Complexity:** O(1) - Just a single subtraction operation
- **Space Complexity:** O(1) - No extra space needed beyond the input

**Simulation Solution:**

- **Time Complexity:** O(log n) - Each iteration roughly halves the number of teams
- **Space Complexity:** O(1) - Only a few variables needed

The mathematical solution is clearly superior, but both approaches are acceptable given the problem constraints (n ≤ 200). The simulation approach demonstrates that you can implement the rules as described, while the mathematical solution shows deeper problem-solving insight.

## Common Mistakes

1. **Forgetting the base case:** When n = 1, there should be 0 matches. Some candidates might return 1 or get stuck in an infinite loop if they don't handle this properly in the simulation approach.

2. **Integer division errors:** In languages like Java, using `/` instead of `//` or proper integer division can lead to floating-point results. Always use integer division (`//` in Python, `/` with `Math.floor()` in JavaScript, or `/` with integer types in Java).

3. **Incorrect odd case handling:** When n is odd, the number of teams advancing is `(n-1)/2 + 1`, not `(n-1)/2`. The extra `+1` accounts for the team that gets a bye.

4. **Overcomplicating the solution:** Some candidates might try to use recursion or complex data structures when a simple loop or mathematical formula suffices. Always look for the simplest solution first.

## When You'll See This Pattern

This problem teaches the important skill of **looking for invariants** - quantities that remain constant throughout a process. Here, the invariant is "each match eliminates exactly one team."

Similar problems that use this pattern:

1. **Count Distinct Numbers on Board (Easy)** - You repeatedly apply an operation to numbers, and need to find how many distinct numbers remain. Like this problem, it often has a mathematical shortcut rather than requiring simulation.

2. **Bulb Switcher (Medium)** - At first glance it seems like you need to simulate all n rounds of toggling bulbs, but there's a mathematical pattern involving perfect squares.

3. **Nim Game (Easy)** - While not exactly the same, it teaches looking for winning/losing positions mathematically rather than simulating all possible moves.

These problems all share the characteristic that brute force simulation works but recognizing a mathematical pattern leads to a more elegant and efficient solution.

## Key Takeaways

1. **Look for invariants:** When solving problems involving processes or transformations, ask yourself: "What quantity remains constant throughout this process?" In this case, it's the fact that each match eliminates exactly one team.

2. **Simple problems often have simple solutions:** If you find yourself writing complex code for an "Easy" problem, step back and reconsider. There's often a mathematical insight that simplifies everything.

3. **Verify with small examples:** Tracing through concrete examples (like n=7) helped reveal the pattern. Always test your reasoning with small, manageable cases before jumping to code.

Related problems: [Count Distinct Numbers on Board](/problem/count-distinct-numbers-on-board)
