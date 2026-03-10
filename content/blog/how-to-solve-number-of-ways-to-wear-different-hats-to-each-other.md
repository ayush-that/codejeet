---
title: "How to Solve Number of Ways to Wear Different Hats to Each Other — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Wear Different Hats to Each Other. Hard difficulty, 45.7% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2029-10-10"
category: "dsa-patterns"
tags:
  [
    "number-of-ways-to-wear-different-hats-to-each-other",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve "Number of Ways to Wear Different Hats to Each Other"

This problem asks: given `n` people and 40 possible hat types, where each person has a list of preferred hats, count how many ways we can assign hats such that each person gets exactly one hat from their preference list and no two people wear the same hat. The challenge comes from the constraints: up to 10 people but 40 hat types, making brute force over hats impossible, while the "different hats" constraint requires careful counting.

What makes this problem interesting is the mismatch between the number of people (small) and hats (large). A typical assignment problem might focus on assigning people to hats, but here we need to think in reverse: assign hats to people while tracking which people have already been assigned hats.

## Visual Walkthrough

Let's trace through a small example: `hats = [[1,2,3],[2,3,4],[3,4]]` with `n = 3` people.

We need to count assignments where:

- Person 0 gets hat 1, 2, or 3
- Person 1 gets hat 2, 3, or 4
- Person 2 gets hat 3 or 4
- All hats worn must be different

Let's think step-by-step:

**Approach 1: Assign people to hats (doesn't work well)**
We could try all combinations: Person 0 chooses from 3 hats, Person 1 from 3, Person 2 from 2. That's 3×3×2 = 18 combinations, but many violate the "different hats" rule. Checking all 18 is feasible here, but with 10 people and up to 40 hats, 40¹⁰ is astronomical.

**Key insight**: Instead of assigning people to hats, assign hats to people! There are only 40 hats, and each hat can be worn by at most one person. Since n ≤ 10, we only care about which subset of people gets hats, not specifically which hats.

Let's build assignments hat by hat:

1. **Hat 1**: Can only be worn by Person 0
   - Assign to Person 0: {Person 0 has a hat}
2. **Hat 2**: Can be worn by Person 0 or Person 1
   - If Person 0 already has hat 1, assign to Person 1: {Person 0, Person 1 have hats}
   - Or don't assign hat 2 at all: {Person 0 has a hat}
   - Or assign to Person 0 (but then Person 0 would have 2 hats - not allowed)

3. **Hat 3**: Can be worn by all three people
   - Many possibilities depending on previous assignments...

This gets messy quickly. The cleaner way: use **dynamic programming with bitmasking**.

## Brute Force Approach

The most straightforward brute force would try all possible assignments of hats to people. For each person, choose one hat from their preference list. Check if all chosen hats are distinct. Count valid assignments.

```python
def numberWays(hats):
    n = len(hats)
    count = 0

    def backtrack(person, assigned_hats):
        nonlocal count
        if person == n:
            count += 1
            return

        for hat in hats[person]:
            if hat not in assigned_hats:
                assigned_hats.add(hat)
                backtrack(person + 1, assigned_hats)
                assigned_hats.remove(hat)

    backtrack(0, set())
    return count
```

**Why this fails**: With n up to 10 and each person having up to 40 preferred hats, the worst case is 40¹⁰ ≈ 1.05×10¹⁶ operations - completely infeasible. Even with pruning (checking if hat already used), the search space is enormous because early choices force later failures.

## Optimized Approach

The key insight is **dynamic programming with bitmasking**:

1. **Reverse the mapping**: Instead of "people → preferred hats", create "hat → people who like this hat". This lets us process hats one by one.

2. **State representation**: Since n ≤ 10, we can represent which people have already received hats using a bitmask (integer where bit i = 1 if person i has a hat).

3. **DP definition**: `dp[mask]` = number of ways to assign hats to the people represented by `mask` using the first `h` hats processed so far.

4. **Transition**: When processing hat `h`, for each person `p` who likes hat `h`:
   - If person `p` doesn't have a hat yet (bit `p` is 0 in mask), we can assign hat `h` to them
   - New mask = old mask with bit `p` set to 1
   - `dp[new_mask] += dp[old_mask]` (add ways from previous state)

5. **Process hats sequentially**: We iterate through hats 1 to 40, updating DP. This ensures we don't assign the same hat twice.

The time complexity becomes O(40 × 2ⁿ × n) which for n=10 is 40 × 1024 × 10 ≈ 400,000 operations - very efficient!

## Optimal Solution

<div class="code-group">

```python
# Time: O(H * 2^N * N) where H=40 hats, N≤10 people
# Space: O(2^N) for DP array
def numberWays(hats):
    n = len(hats)
    MOD = 10**9 + 7

    # Step 1: Build hat-to-people mapping
    # hat_people[h] = list of people who like hat h (1-indexed hats)
    hat_people = [[] for _ in range(41)]  # hats are 1..40
    for person in range(n):
        for hat in hats[person]:
            hat_people[hat].append(person)

    # Step 2: Initialize DP
    # dp[mask] = ways to assign hats to people in mask using processed hats
    dp = [0] * (1 << n)
    dp[0] = 1  # empty assignment: 1 way

    # Step 3: Process each hat
    for hat in range(1, 41):
        # Process in reverse to avoid overwriting states
        # We need old dp values when calculating new ones
        for mask in range((1 << n) - 1, -1, -1):
            # For each person who likes this hat
            for person in hat_people[hat]:
                # If this person doesn't have a hat in current mask
                if not (mask >> person) & 1:
                    new_mask = mask | (1 << person)
                    dp[new_mask] = (dp[new_mask] + dp[mask]) % MOD

    # Step 4: Return ways to assign hats to all n people
    return dp[(1 << n) - 1]
```

```javascript
// Time: O(H * 2^N * N) where H=40 hats, N≤10 people
// Space: O(2^N) for DP array
function numberWays(hats) {
  const n = hats.length;
  const MOD = 1e9 + 7;

  // Step 1: Build hat-to-people mapping
  // hatPeople[h] = array of people who like hat h (1-indexed hats)
  const hatPeople = Array.from({ length: 41 }, () => []);
  for (let person = 0; person < n; person++) {
    for (const hat of hats[person]) {
      hatPeople[hat].push(person);
    }
  }

  // Step 2: Initialize DP
  // dp[mask] = ways to assign hats to people in mask using processed hats
  const dp = new Array(1 << n).fill(0);
  dp[0] = 1; // empty assignment: 1 way

  // Step 3: Process each hat
  for (let hat = 1; hat <= 40; hat++) {
    // Process in reverse to avoid overwriting states
    // We need old dp values when calculating new ones
    for (let mask = (1 << n) - 1; mask >= 0; mask--) {
      // For each person who likes this hat
      for (const person of hatPeople[hat]) {
        // If this person doesn't have a hat in current mask
        if (!((mask >> person) & 1)) {
          const newMask = mask | (1 << person);
          dp[newMask] = (dp[newMask] + dp[mask]) % MOD;
        }
      }
    }
  }

  // Step 4: Return ways to assign hats to all n people
  return dp[(1 << n) - 1];
}
```

```java
// Time: O(H * 2^N * N) where H=40 hats, N≤10 people
// Space: O(2^N) for DP array
class Solution {
    public int numberWays(List<List<Integer>> hats) {
        int n = hats.size();
        int MOD = 1000000007;

        // Step 1: Build hat-to-people mapping
        // hatPeople[h] = list of people who like hat h (1-indexed hats)
        List<Integer>[] hatPeople = new List[41];
        for (int i = 0; i <= 40; i++) {
            hatPeople[i] = new ArrayList<>();
        }

        for (int person = 0; person < n; person++) {
            for (int hat : hats.get(person)) {
                hatPeople[hat].add(person);
            }
        }

        // Step 2: Initialize DP
        // dp[mask] = ways to assign hats to people in mask using processed hats
        int[] dp = new int[1 << n];
        dp[0] = 1;  // empty assignment: 1 way

        // Step 3: Process each hat
        for (int hat = 1; hat <= 40; hat++) {
            // Process in reverse to avoid overwriting states
            // We need old dp values when calculating new ones
            for (int mask = (1 << n) - 1; mask >= 0; mask--) {
                // For each person who likes this hat
                for (int person : hatPeople[hat]) {
                    // If this person doesn't have a hat in current mask
                    if ((mask >> person & 1) == 0) {
                        int newMask = mask | (1 << person);
                        dp[newMask] = (dp[newMask] + dp[mask]) % MOD;
                    }
                }
            }
        }

        // Step 4: Return ways to assign hats to all n people
        return dp[(1 << n) - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(H × 2ᴺ × N) where:

- H = 40 (maximum hat types)
- N ≤ 10 (maximum people)
- 2ᴺ = 1024 maximum states
- For each hat, we iterate through all masks (2ᴺ) and for each mask, through people who like that hat (up to N)

In worst case: 40 × 1024 × 10 ≈ 409,600 operations, which is very efficient.

**Space Complexity**: O(2ᴺ) for the DP array storing counts for each mask state. That's 1024 integers in worst case, plus O(H × N) for the hat-to-people mapping.

## Common Mistakes

1. **Processing masks in forward order**: If you iterate masks from 0 to 2ᴺ-1, you'll double-count assignments because when you update `dp[new_mask]`, you might use it again later for the same hat. Always process masks in **reverse order** when doing this type of DP.

2. **Forgetting to mod operations**: The result can be huge (up to 40!/(40-n)!), so you must take modulo 10⁹+7 at each addition. Don't wait until the end.

3. **Incorrect bitmask handling**: Remember people are 0-indexed but hats are 1-indexed. Common off-by-one: using `1 << (person+1)` instead of `1 << person`.

4. **Not reversing the mapping**: Trying to DP over people instead of hats leads to O(N! × H) complexity. The key is recognizing that hats (40) > people (10), so process hats and track people states.

## When You'll See This Pattern

This **DP with bitmasking** pattern appears in assignment problems where:

1. You need to assign items to agents
2. Each item can go to at most one agent
3. The number of agents is small enough for bitmasking (typically ≤ 20)

Related problems:

- **The Number of Good Subsets (Hard)**: Similar bitmask DP over prime factors
- **Maximum Students Taking Exam (Hard)**: Bitmask DP for seating arrangement
- **Minimum Number of Work Sessions (Medium)**: Bitmask DP for task assignment
- **Fair Distribution of Cookies (Medium)**: Bitmask DP for distributing cookies

## Key Takeaways

1. **When to use bitmask DP**: When you have a small set of agents/people (≤ 20) and need to track which ones have been assigned something. The mask efficiently represents subsets.

2. **Reverse the mapping when one dimension is much larger**: If you have many items (hats) but few agents (people), process items and track agent states, not the other way around.

3. **Process in reverse order to avoid overwriting**: In "add current item to existing states" DP, iterate masks backward so you don't use newly updated states in the same iteration.

Related problems: [The Number of Good Subsets](/problem/the-number-of-good-subsets)
