---
title: "How to Solve Smallest Sufficient Team — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Smallest Sufficient Team. Hard difficulty, 55.4% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Bitmask."
date: "2028-01-13"
category: "dsa-patterns"
tags: ["smallest-sufficient-team", "array", "dynamic-programming", "bit-manipulation", "hard"]
---

# How to Solve Smallest Sufficient Team

You're given a list of required skills and a list of people with their skills. Your task is to find the smallest team (minimum number of people) that collectively possesses all required skills. This problem is tricky because it's essentially a set cover problem, which is NP-hard, but we can solve it efficiently using bitmask dynamic programming since the number of required skills is small enough (≤ 16) to represent skill sets as integers.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
req_skills = ["java","nodejs","reactjs"]
people = [
    ["java"],
    ["nodejs"],
    ["nodejs","reactjs"]
]
```

**Step 1: Map skills to bit positions**
We assign each skill a unique bit position:

- "java" → bit 0 (value 1)
- "nodejs" → bit 1 (value 2)
- "reactjs" → bit 2 (value 4)

**Step 2: Convert people to bitmasks**

- Person 0: ["java"] → 001₂ = 1
- Person 1: ["nodejs"] → 010₂ = 2
- Person 2: ["nodejs","reactjs"] → 110₂ = 6

**Step 3: Dynamic programming approach**
We want to cover all skills (111₂ = 7). Let's track the smallest team for each skill subset:

- Start with dp[0] = [] (empty team covers no skills)
- Add person 0: dp[1] = [0] (covers java)
- Add person 1: dp[2] = [1] (covers nodejs)
- Add person 2: dp[6] = [2] (covers nodejs and reactjs)

Now combine:

- From dp[1] + person 1 → covers 011₂ = 3 → dp[3] = [0,1]
- From dp[1] + person 2 → covers 111₂ = 7 → dp[7] = [0,2]
- From dp[2] + person 2 → covers 110₂ = 6 (but we already have [2] which is smaller)

The smallest team covering all skills (7) is [0,2] with 2 people.

## Brute Force Approach

The brute force approach would try all possible subsets of people (2^n subsets where n is number of people). For each subset:

1. Combine all skills from selected people
2. Check if all required skills are covered
3. Track the smallest subset that works

This approach has exponential time complexity O(2^n × m) where m is the average number of skills per person. For n=60 (maximum in constraints), 2^60 ≈ 1.15×10^18 operations is completely infeasible.

Even if we try to optimize by pruning (stopping when current subset size exceeds best found), in worst case we still need to explore most subsets. The key insight is that while there can be many people (up to 60), there are relatively few required skills (≤ 16), so we can use dynamic programming over skill subsets instead of people subsets.

## Optimized Approach

The optimal solution uses **bitmask dynamic programming**:

**Key Insight:** Since there are at most 16 required skills, there are only 2^16 = 65,536 possible skill subsets. We can use dynamic programming where dp[mask] stores the smallest team that covers exactly the skills represented by `mask`.

**Step-by-step reasoning:**

1. **Map skills to bits:** Create a dictionary mapping each skill to a unique bit position (0 to len(req_skills)-1).
2. **Convert people to bitmasks:** For each person, create an integer where bit i is 1 if the person has skill i.
3. **Initialize DP array:** Create dp array of size 2^skill_count, where dp[mask] stores the smallest team (as list of person indices) that covers exactly the skills in mask. Initialize dp[0] as empty list.
4. **Iterate through people:** For each person, try to add them to existing teams:
   - For each current mask where we have a team, create new_mask = mask | person_mask
   - If dp[new_mask] doesn't exist or the new team (dp[mask] + [person]) is smaller than current dp[new_mask], update it
5. **Result:** The answer is dp[(1 << skill_count) - 1], which represents all skills covered.

**Optimization:** Instead of storing full lists in dp, we can store just the team size and the last person added, then reconstruct the team at the end. This reduces space usage.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * 2^m) where n = number of people, m = number of required skills
# Space: O(2^m) for the DP array
class Solution:
    def smallestSufficientTeam(self, req_skills: List[str], people: List[List[str]]) -> List[int]:
        # Step 1: Map each skill to a unique bit position
        skill_to_bit = {skill: i for i, skill in enumerate(req_skills)}
        m = len(req_skills)  # Number of required skills

        # Step 2: Convert each person's skills to a bitmask
        person_masks = []
        for person in people:
            mask = 0
            for skill in person:
                if skill in skill_to_bit:
                    mask |= 1 << skill_to_bit[skill]  # Set the bit for this skill
            person_masks.append(mask)

        # Step 3: Initialize DP array
        # dp[mask] will store the smallest team (as list of indices) for that mask
        # We use None to represent "no team found yet"
        full_mask = (1 << m) - 1  # All bits set (all skills covered)
        dp = [None] * (1 << m)
        dp[0] = []  # Empty team covers no skills

        # Step 4: Dynamic programming - try adding each person to existing teams
        for i, person_mask in enumerate(person_masks):
            if person_mask == 0:
                continue  # Person with no relevant skills, skip

            # Iterate through all current masks (need to copy keys since we'll modify dp)
            # We iterate from 0 to full_mask to ensure we don't process newly added masks
            # in the same iteration (which would use the same person multiple times)
            for mask in range(full_mask, -1, -1):
                if dp[mask] is None:
                    continue  # No team for this mask yet

                new_mask = mask | person_mask
                if new_mask == mask:
                    continue  # Person doesn't add any new skills

                # Check if we found a smaller team for new_mask
                new_team = dp[mask] + [i]
                if dp[new_mask] is None or len(new_team) < len(dp[new_mask]):
                    dp[new_mask] = new_team

        # Step 5: Return the team that covers all skills
        return dp[full_mask]
```

```javascript
// Time: O(n * 2^m) where n = number of people, m = number of required skills
// Space: O(2^m) for the DP array
/**
 * @param {string[]} req_skills
 * @param {string[][]} people
 * @return {number[]}
 */
var smallestSufficientTeam = function (req_skills, people) {
  // Step 1: Map each skill to a unique bit position
  const skillToBit = new Map();
  for (let i = 0; i < req_skills.length; i++) {
    skillToBit.set(req_skills[i], i);
  }
  const m = req_skills.length; // Number of required skills

  // Step 2: Convert each person's skills to a bitmask
  const personMasks = new Array(people.length).fill(0);
  for (let i = 0; i < people.length; i++) {
    let mask = 0;
    for (const skill of people[i]) {
      if (skillToBit.has(skill)) {
        mask |= 1 << skillToBit.get(skill); // Set the bit for this skill
      }
    }
    personMasks[i] = mask;
  }

  // Step 3: Initialize DP array
  // dp[mask] will store the smallest team (as array of indices) for that mask
  // We use null to represent "no team found yet"
  const fullMask = (1 << m) - 1; // All bits set (all skills covered)
  const dp = new Array(1 << m).fill(null);
  dp[0] = []; // Empty team covers no skills

  // Step 4: Dynamic programming - try adding each person to existing teams
  for (let i = 0; i < personMasks.length; i++) {
    const personMask = personMasks[i];
    if (personMask === 0) {
      continue; // Person with no relevant skills, skip
    }

    // Iterate from fullMask down to 0 to avoid using the same person multiple times
    // in the same iteration (like 0-1 knapsack)
    for (let mask = fullMask; mask >= 0; mask--) {
      if (dp[mask] === null) {
        continue; // No team for this mask yet
      }

      const newMask = mask | personMask;
      if (newMask === mask) {
        continue; // Person doesn't add any new skills
      }

      // Check if we found a smaller team for newMask
      const newTeam = [...dp[mask], i];
      if (dp[newMask] === null || newTeam.length < dp[newMask].length) {
        dp[newMask] = newTeam;
      }
    }
  }

  // Step 5: Return the team that covers all skills
  return dp[fullMask];
};
```

```java
// Time: O(n * 2^m) where n = number of people, m = number of required skills
// Space: O(2^m) for the DP array
class Solution {
    public int[] smallestSufficientTeam(String[] req_skills, List<List<String>> people) {
        // Step 1: Map each skill to a unique bit position
        Map<String, Integer> skillToBit = new HashMap<>();
        int m = req_skills.length;  // Number of required skills
        for (int i = 0; i < m; i++) {
            skillToBit.put(req_skills[i], i);
        }

        // Step 2: Convert each person's skills to a bitmask
        int n = people.size();
        int[] personMasks = new int[n];
        for (int i = 0; i < n; i++) {
            int mask = 0;
            for (String skill : people.get(i)) {
                if (skillToBit.containsKey(skill)) {
                    mask |= 1 << skillToBit.get(skill);  // Set the bit for this skill
                }
            }
            personMasks[i] = mask;
        }

        // Step 3: Initialize DP array
        // dp[mask] will store the smallest team (as list of indices) for that mask
        // We use null to represent "no team found yet"
        int fullMask = (1 << m) - 1;  // All bits set (all skills covered)
        List<Integer>[] dp = new List[1 << m];
        dp[0] = new ArrayList<>();  // Empty team covers no skills

        // Step 4: Dynamic programming - try adding each person to existing teams
        for (int i = 0; i < n; i++) {
            int personMask = personMasks[i];
            if (personMask == 0) {
                continue;  // Person with no relevant skills, skip
            }

            // Iterate from fullMask down to 0 to avoid using the same person multiple times
            // in the same iteration (like 0-1 knapsack)
            for (int mask = fullMask; mask >= 0; mask--) {
                if (dp[mask] == null) {
                    continue;  // No team for this mask yet
                }

                int newMask = mask | personMask;
                if (newMask == mask) {
                    continue;  // Person doesn't add any new skills
                }

                // Check if we found a smaller team for newMask
                List<Integer> newTeam = new ArrayList<>(dp[mask]);
                newTeam.add(i);
                if (dp[newMask] == null || newTeam.size() < dp[newMask].size()) {
                    dp[newMask] = newTeam;
                }
            }
        }

        // Step 5: Convert result to array and return
        List<Integer> resultList = dp[fullMask];
        int[] result = new int[resultList.size()];
        for (int i = 0; i < result.length; i++) {
            result[i] = resultList.get(i);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 2^m)

- n = number of people (up to 60)
- m = number of required skills (up to 16)
- We iterate through all people (n) and for each person, we iterate through all possible masks (2^m)
- 2^16 = 65,536, so n × 2^m ≤ 60 × 65,536 ≈ 3.9 million operations, which is efficient

**Space Complexity:** O(2^m)

- We store a DP array of size 2^m
- Each entry stores a list of person indices (worst case: all n people)
- Total space: O(2^m × n) in worst case, but typically much less since most masks don't have teams

## Common Mistakes

1. **Not iterating masks in reverse order:** When updating dp in-place, if we iterate masks from 0 to fullMask, we might use the same person multiple times in the same iteration (like counting coins problem vs 0-1 knapsack). Always iterate backward when each person can be used at most once.

2. **Forgetting to skip irrelevant skills:** People might have skills not in req_skills. These should be ignored when creating bitmasks, otherwise we might think a person covers more than they actually do.

3. **Not handling empty dp[mask] entries:** We need to check if dp[mask] exists before trying to extend from it. Using null/None checks is cleaner than initializing with large placeholder values.

4. **Incorrect bit manipulation:** Remember that `1 << skill_to_bit[skill]` creates a mask with only that skill's bit set. Using the wrong shift direction or forgetting to use bitwise OR (`|`) to combine masks is a common error.

## When You'll See This Pattern

This **bitmask dynamic programming** pattern appears in problems where:

1. You need to track subsets of a small set (typically ≤ 20 elements)
2. The problem involves selecting elements to cover certain properties
3. The state can be represented as a combination of binary choices

**Related LeetCode problems:**

1. **The Number of Good Subsets (Hard):** Similar bitmask DP where each number contributes certain prime factors, and we track which primes have been covered.
2. **Minimum Number of Work Sessions to Finish the Tasks (Medium):** Uses bitmask to represent which tasks have been completed, then DP to find minimum sessions.
3. **Maximum Rows Covered by Columns (Medium):** Select columns to maximize covered rows, using bitmask to represent row coverage patterns.

## Key Takeaways

1. **Bitmask DP is powerful for subset problems:** When you need to track combinations of up to ~20 elements, representing subsets as integers (bitmasks) enables efficient DP solutions.

2. **Look for the smaller dimension:** In this problem, the number of skills (≤ 16) is much smaller than the number of people (≤ 60). The DP state should be based on the smaller dimension.

3. **Iteration order matters in knapsack-style DP:** When each element can be used at most once (0-1 knapsack), iterate backward through the DP array. When elements can be reused (unbounded knapsack), iterate forward.

**Related problems:** [The Number of Good Subsets](/problem/the-number-of-good-subsets), [Minimum Number of Work Sessions to Finish the Tasks](/problem/minimum-number-of-work-sessions-to-finish-the-tasks), [Maximum Rows Covered by Columns](/problem/maximum-rows-covered-by-columns)
