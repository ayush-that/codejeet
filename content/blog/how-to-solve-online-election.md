---
title: "How to Solve Online Election — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Online Election. Medium difficulty, 52.7% acceptance rate. Topics: Array, Hash Table, Binary Search, Design."
date: "2027-12-04"
category: "dsa-patterns"
tags: ["online-election", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Online Election

You're tracking election results where votes come in at specific times, and you need to answer queries about who was leading at any given time. The challenge is handling queries efficiently when votes arrive in chronological order but queries can be for arbitrary times. The tricky part is that the leader can change over time, and you need to quickly find the correct leader for any query time.

## Visual Walkthrough

Let's trace through a concrete example:

**Input:**

- persons = [0, 1, 1, 0, 0, 1, 0]
- times = [0, 5, 10, 15, 20, 25, 30]

**Vote timeline:**

- Time 0: Person 0 gets 1 vote → Leader: Person 0
- Time 5: Person 1 gets 1 vote → Tie! Person 0 still leads (most recent tie-breaker)
- Time 10: Person 1 gets 2 votes → Leader: Person 1
- Time 15: Person 0 gets 2 votes → Tie again! Person 1 still leads
- Time 20: Person 0 gets 3 votes → Leader: Person 0
- Time 25: Person 1 gets 3 votes → Tie! Person 0 still leads
- Time 30: Person 0 gets 4 votes → Leader: Person 0

**Key insight:** The leader only changes at vote times. Between vote times, the leader remains the same. So for query time `t = 12`, we look at the most recent vote time ≤ 12, which is time 10, where Person 1 was leading.

## Brute Force Approach

A naive approach would be to process each query independently:

1. For each query time `t`, scan through all votes up to time `t`
2. Count votes for each candidate
3. Find the candidate with maximum votes (breaking ties by most recent vote)
4. Return that candidate

This approach has O(q × n) time complexity where q is number of queries and n is number of votes. With up to 5000 queries and 5000 votes, this could be 25 million operations — too slow.

The brute force fails because it recomputes vote counts from scratch for each query, even though votes come in chronological order and we could precompute leaders at each vote time.

## Optimized Approach

The optimal solution uses **preprocessing + binary search**:

1. **Preprocessing phase:** Process votes in chronological order and track:
   - Current vote counts for each candidate
   - Current leader at each vote time

   Store the leaders in an array `leaders` where `leaders[i]` is the leader at time `times[i]`.

2. **Query phase:** For a query time `t`:
   - Use **binary search** to find the largest index `i` where `times[i] ≤ t`
   - Return `leaders[i]` (the leader at that vote time)

**Why this works:**

- Leaders only change at vote times
- Between vote times, the leader remains constant
- Binary search gives us O(log n) query time instead of O(n)

**Tie-breaking:** When candidates tie, the one who got the most recent vote wins. Since we process votes in order, we naturally handle this by updating the leader whenever the current candidate's votes ≥ current leader's votes.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + q log n) where n = len(persons), q = number of queries
# Space: O(n) for storing leaders and times
class TopVotedCandidate:
    def __init__(self, persons: List[int], times: List[int]):
        # Store times for binary search
        self.times = times

        # Track current vote counts
        votes = {}

        # Track current leader
        current_leader = -1
        current_max_votes = 0

        # Precompute leaders at each vote time
        self.leaders = []

        for person in persons:
            # Update vote count for this person
            votes[person] = votes.get(person, 0) + 1

            # Check if this person becomes the new leader
            # >= ensures tie goes to most recent vote
            if votes[person] >= current_max_votes:
                current_leader = person
                current_max_votes = votes[person]

            # Store leader at this vote time
            self.leaders.append(current_leader)

    def q(self, t: int) -> int:
        # Binary search to find the rightmost time <= t
        left, right = 0, len(self.times) - 1

        while left <= right:
            mid = left + (right - left) // 2

            if self.times[mid] <= t:
                # This time is valid, but maybe we can find a later one
                left = mid + 1
            else:
                # This time is too late, search earlier times
                right = mid - 1

        # After loop, right points to largest index with time <= t
        # left = right + 1
        return self.leaders[right]
```

```javascript
// Time: O(n + q log n) where n = persons.length, q = number of queries
// Space: O(n) for storing leaders and times
class TopVotedCandidate {
  constructor(persons, times) {
    // Store times for binary search
    this.times = times;

    // Track current vote counts
    const votes = new Map();

    // Track current leader
    let currentLeader = -1;
    let currentMaxVotes = 0;

    // Precompute leaders at each vote time
    this.leaders = [];

    for (let i = 0; i < persons.length; i++) {
      const person = persons[i];

      // Update vote count for this person
      votes.set(person, (votes.get(person) || 0) + 1);

      // Check if this person becomes the new leader
      // >= ensures tie goes to most recent vote
      if (votes.get(person) >= currentMaxVotes) {
        currentLeader = person;
        currentMaxVotes = votes.get(person);
      }

      // Store leader at this vote time
      this.leaders.push(currentLeader);
    }
  }

  q(t) {
    // Binary search to find the rightmost time <= t
    let left = 0;
    let right = this.times.length - 1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (this.times[mid] <= t) {
        // This time is valid, but maybe we can find a later one
        left = mid + 1;
      } else {
        // This time is too late, search earlier times
        right = mid - 1;
      }
    }

    // After loop, right points to largest index with time <= t
    // left = right + 1
    return this.leaders[right];
  }
}
```

```java
// Time: O(n + q log n) where n = persons.length, q = number of queries
// Space: O(n) for storing leaders and times
class TopVotedCandidate {
    private int[] times;
    private int[] leaders;

    public TopVotedCandidate(int[] persons, int[] times) {
        this.times = times;
        this.leaders = new int[persons.length];

        // Track current vote counts
        Map<Integer, Integer> votes = new HashMap<>();

        // Track current leader
        int currentLeader = -1;
        int currentMaxVotes = 0;

        // Precompute leaders at each vote time
        for (int i = 0; i < persons.length; i++) {
            int person = persons[i];

            // Update vote count for this person
            votes.put(person, votes.getOrDefault(person, 0) + 1);

            // Check if this person becomes the new leader
            // >= ensures tie goes to most recent vote
            if (votes.get(person) >= currentMaxVotes) {
                currentLeader = person;
                currentMaxVotes = votes.get(person);
            }

            // Store leader at this vote time
            leaders[i] = currentLeader;
        }
    }

    public int q(int t) {
        // Binary search to find the rightmost time <= t
        int left = 0;
        int right = times.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (times[mid] <= t) {
                // This time is valid, but maybe we can find a later one
                left = mid + 1;
            } else {
                // This time is too late, search earlier times
                right = mid - 1;
            }
        }

        // After loop, right points to largest index with time <= t
        // left = right + 1
        return leaders[right];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Preprocessing (constructor):** O(n) where n is the number of votes. We process each vote once to compute leaders.
- **Each query:** O(log n) for binary search on the times array.
- **Overall:** O(n + q log n) where q is the number of queries.

**Space Complexity:** O(n) for storing:

- The `times` array (n elements)
- The `leaders` array (n elements)
- The vote counts hash map (at most n distinct candidates)

## Common Mistakes

1. **Forgetting tie-breaking rule:** The problem states that in case of a tie, the candidate with the most recent vote wins. Using `>` instead of `>=` when comparing vote counts would give the wrong answer for ties.

2. **Binary search off-by-one errors:** When implementing binary search to find "largest time ≤ t", it's easy to get the indices wrong. Test with:
   - Query time before first vote
   - Query time exactly at a vote time
   - Query time between votes
   - Query time after last vote

3. **Not storing leaders at each vote time:** Some candidates try to recompute leaders during queries by processing votes up to time t. This defeats the purpose of preprocessing and gives O(n) query time.

4. **Assuming times are sorted:** While the problem states times are strictly increasing, always verify this assumption. If times weren't sorted, we'd need to sort them first.

## When You'll See This Pattern

This problem combines **preprocessing with binary search** — a common pattern for problems where:

1. Data arrives in chronological order
2. You need to answer queries about state at arbitrary times
3. State only changes at specific event times

**Related problems:**

1. **Time Based Key-Value Store (LeetCode 981)** — Similar pattern: store values with timestamps, use binary search to find value at given time.
2. **Snapshot Array (LeetCode 1146)** — Maintain versions of array state, use binary search to find state at given snapshot ID.
3. **Find Right Interval (LeetCode 436)** — Sort intervals and use binary search to find the "next" interval.

## Key Takeaways

1. **When state changes at discrete events**, you only need to store the state at those event times. Between events, state remains constant.

2. **Binary search is your friend for time-based queries** when data is sorted. The "find largest value ≤ target" pattern appears frequently.

3. **Preprocessing amortizes cost** across multiple queries. Spending O(n) time upfront to enable O(log n) queries is often worthwhile when q ≈ n or larger.

Related problems: [Rank Teams by Votes](/problem/rank-teams-by-votes)
