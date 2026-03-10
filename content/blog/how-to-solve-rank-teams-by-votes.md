---
title: "How to Solve Rank Teams by Votes — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rank Teams by Votes. Medium difficulty, 60.0% acceptance rate. Topics: Array, Hash Table, String, Sorting, Counting."
date: "2027-06-10"
category: "dsa-patterns"
tags: ["rank-teams-by-votes", "array", "hash-table", "string", "medium"]
---

# How to Solve Rank Teams by Votes

This problem asks us to rank teams based on voting data where each voter ranks all teams from first to last. The tricky part is the tie-breaking mechanism: we compare teams first by their number of first-place votes, then second-place votes if tied, and so on, with a final alphabetical tie-breaker. This creates a multi-level comparison that requires careful sorting logic.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have votes: `["ABC","ACB","ABC","ACB","ACB"]` and teams: `"A"`, `"B"`, `"C"`.

**Step 1: Count votes at each position**

- For team A: 5 votes at position 1 (all votes have A first)
- For team B: 0 votes at position 1, 3 votes at position 2 (in "ABC" votes), 2 votes at position 3 (in "ACB" votes)
- For team C: 0 votes at position 1, 2 votes at position 2 (in "ACB" votes), 3 votes at position 3 (in "ABC" votes)

**Step 2: Compare teams level by level**

1. First compare by position 1 votes: A(5) > B(0) = C(0) → A wins
2. B and C tie at position 1 (both 0), so check position 2: B(3) > C(2) → B beats C
3. Final order: A > B > C

**Step 3: What about alphabetical tie-breaker?**
If two teams had identical vote counts at every position (e.g., `["AB","BA"]`), we'd sort them alphabetically: A comes before B.

The key insight is that we need to create a custom sorting function that compares teams based on their vote counts at each position, with alphabetical order as the final tie-breaker.

## Brute Force Approach

A naive approach might try to manually implement all comparisons:

1. For each team, count votes at each position (O(n×m) where n=votes, m=teams)
2. Compare every pair of teams (O(m²)) by checking positions one by one
3. Build the ranking through bubble-sort-like comparisons

This O(m²) comparison approach is inefficient when m=26 (all letters A-Z), giving 325 comparisons with complex logic each time. More importantly, it's error-prone to implement manually when most programming languages provide efficient sorting with custom comparators.

The real issue with a truly naive approach is that it doesn't leverage the power of built-in sorting algorithms. A candidate might try to implement their own sorting algorithm with the custom comparison logic, which is unnecessary and bug-prone.

## Optimized Approach

The optimal solution uses these key insights:

1. **Precompute vote counts**: Create a 2D structure where `counts[team][position]` stores how many votes that team received at that position.
2. **Custom comparator**: Define a comparison function that:
   - First compares by votes at position 0 (most important)
   - If tied, compares by votes at position 1
   - Continues through all positions
   - Finally compares alphabetically if still tied
3. **Leverage built-in sort**: Use the language's efficient sorting with our custom comparator.

The clever part is realizing we can represent each team's voting profile as a tuple or array of integers, and we can compare these arrays lexicographically (element by element). Since we want descending order for vote counts but ascending order for team names, we need to handle the sign carefully.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * (n + log m)) where m = number of teams, n = number of votes
# Space: O(m^2) for the vote count matrix (m teams × m positions)
def rankTeams(self, votes: List[str]) -> str:
    # If only one vote, the ranking is just that vote
    if len(votes) == 1:
        return votes[0]

    # Get all unique teams from the first vote (all votes rank all teams)
    teams = list(votes[0])
    m = len(teams)  # Number of teams/positions

    # Initialize vote count matrix: team -> [count_at_position_0, count_at_position_1, ...]
    # We'll use a dictionary with team as key and list of counts as value
    counts = {team: [0] * m for team in teams}

    # Count votes for each position
    for vote in votes:
        for position, team in enumerate(vote):
            # Increment the count for this team at this position
            counts[team][position] += 1

    # Sort teams using custom comparator
    # The key insight: we compare vote counts position by position
    # We want descending order for counts, but ascending for team names if tied
    def compare_teams(a, b):
        # Compare vote counts at each position
        for i in range(m):
            # If counts differ at position i, the team with higher count wins
            if counts[a][i] != counts[b][i]:
                # Return negative if a should come before b (higher count = better)
                return counts[b][i] - counts[a][i]
        # If all counts are equal, sort alphabetically (ascending)
        return 1 if a > b else -1

    # Python 3 requires key function or converting to tuple comparison
    # Alternative: sort by tuple comparison
    sorted_teams = sorted(teams, key=lambda team: [-counts[team][i] for i in range(m)] + [team])

    # Join the sorted teams into final ranking string
    return ''.join(sorted_teams)
```

```javascript
// Time: O(m * (n + log m)) where m = number of teams, n = number of votes
// Space: O(m^2) for the vote count matrix
/**
 * @param {string[]} votes
 * @return {string}
 */
var rankTeams = function (votes) {
  // Edge case: single vote
  if (votes.length === 1) {
    return votes[0];
  }

  // Get all teams from first vote (all votes have same teams)
  const teams = votes[0].split("");
  const m = teams.length; // Number of teams/positions

  // Initialize vote count map: team -> array of counts per position
  const counts = new Map();
  for (const team of teams) {
    counts.set(team, new Array(m).fill(0));
  }

  // Count votes for each position
  for (const vote of votes) {
    for (let i = 0; i < m; i++) {
      const team = vote[i];
      const teamCounts = counts.get(team);
      teamCounts[i]++; // Increment count at position i
    }
  }

  // Sort teams with custom comparator
  teams.sort((a, b) => {
    const countsA = counts.get(a);
    const countsB = counts.get(b);

    // Compare vote counts position by position
    for (let i = 0; i < m; i++) {
      if (countsA[i] !== countsB[i]) {
        // Higher count should come first, so b - a for descending
        return countsB[i] - countsA[i];
      }
    }

    // All counts equal, sort alphabetically (ascending)
    return a.localeCompare(b);
  });

  // Join teams into final ranking string
  return teams.join("");
};
```

```java
// Time: O(m * (n + log m)) where m = number of teams, n = number of votes
// Space: O(m^2) for the vote count matrix
class Solution {
    public String rankTeams(String[] votes) {
        // Edge case: single vote
        if (votes.length == 1) {
            return votes[0];
        }

        // Get all teams from first vote
        String firstVote = votes[0];
        int m = firstVote.length();  // Number of teams/positions

        // Initialize vote count matrix: 26 teams (A-Z) × m positions
        // We'll use a 2D array indexed by team character
        int[][] counts = new int[26][m];

        // Count votes for each position
        for (String vote : votes) {
            for (int i = 0; i < m; i++) {
                char team = vote.charAt(i);
                counts[team - 'A'][i]++;  // Increment count for team at position i
            }
        }

        // Convert first vote to character array for sorting
        Character[] teams = new Character[m];
        for (int i = 0; i < m; i++) {
            teams[i] = firstVote.charAt(i);
        }

        // Sort teams with custom comparator
        Arrays.sort(teams, new Comparator<Character>() {
            @Override
            public int compare(Character a, Character b) {
                // Compare vote counts position by position
                for (int i = 0; i < m; i++) {
                    int countA = counts[a - 'A'][i];
                    int countB = counts[b - 'A'][i];
                    if (countA != countB) {
                        // Higher count should come first (descending order)
                        return countB - countA;
                    }
                }
                // All counts equal, sort alphabetically (ascending)
                return a - b;
            }
        });

        // Build result string from sorted teams
        StringBuilder result = new StringBuilder();
        for (Character team : teams) {
            result.append(team);
        }
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × (n + log m))**

- Counting votes: O(n × m) where n = number of votes, m = number of teams
- Sorting: O(m log m) comparisons, each comparison takes O(m) time in worst case
- Total: O(n×m + m² log m) but since m ≤ 26, this simplifies to O(n×m)

**Space Complexity: O(m²)**

- Vote count matrix: m teams × m positions = O(m²)
- Since m ≤ 26 (only uppercase letters), this is effectively O(1) constant space
- Additional O(m) for storing teams and result

The constraints make this efficient: with m ≤ 26 and n ≤ 1000, even O(n×m²) would be acceptable, but our solution is optimal.

## Common Mistakes

1. **Forgetting the alphabetical tie-breaker**: Many candidates correctly implement the position-by-position comparison but forget that teams should be sorted alphabetically when all vote counts are equal. Always check the final tie-breaking condition.

2. **Incorrect comparison direction**: When comparing vote counts, higher counts should come first (descending order), but when comparing team names alphabetically, 'A' should come before 'B' (ascending). Getting this sign wrong reverses the ranking.

3. **Assuming all votes have same length**: While the problem states each voter ranks all teams, it's good practice to verify or handle edge cases. Our solution uses the first vote to determine teams, which is safe given the problem constraints.

4. **Inefficient data structures**: Using a list of dictionaries or nested loops for each comparison can make the code slower and harder to read. The 2D array (or map of arrays) approach provides direct O(1) access to any team's vote count at any position.

## When You'll See This Pattern

This problem combines **counting/frequency analysis** with **custom sorting** based on multiple criteria. You'll see similar patterns in:

1. **Online Election (Medium)**: Also involves ranking based on votes over time, though with different tie-breaking rules. Both require tracking vote counts and comparing candidates.

2. **Sort Characters By Frequency (Medium)**: Sort based on character frequencies, with alphabetical tie-breaking. The custom comparator pattern is similar but with single-level comparison.

3. **Reorder Data in Log Files (Medium)**: Sort logs with multiple comparison criteria (letter-logs vs digit-logs, then lexicographically). The multi-level comparison logic is very similar.

The core pattern is: when you need to sort entities based on multiple hierarchical criteria, precompute the comparison values and use a custom comparator that checks criteria in priority order.

## Key Takeaways

1. **Multi-criteria sorting** problems often require custom comparators that check conditions in priority order. Implement these by comparing the most important criterion first, then moving to less important ones if tied.

2. **Precomputation is key**: Before sorting, gather all the data you'll need for comparisons (like vote counts at each position). This avoids repeated calculations during sorting.

3. **Lexicographic comparison extends beyond strings**: You can compare tuples/lists of numbers lexicographically too. This is useful when you have multiple numeric criteria with different priorities.

Remember: when you see ranking based on multiple levels of tie-breaking, think "custom comparator with precomputed statistics."

Related problems: [Online Election](/problem/online-election)
