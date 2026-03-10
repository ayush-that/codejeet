---
title: "How to Solve Find the Town Judge — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Town Judge. Easy difficulty, 50.5% acceptance rate. Topics: Array, Hash Table, Graph Theory."
date: "2027-01-07"
category: "dsa-patterns"
tags: ["find-the-town-judge", "array", "hash-table", "graph-theory", "easy"]
---

# How to Solve Find the Town Judge

This problem asks us to identify a special person in a town: the judge. The judge is defined by two key properties: they trust nobody, and everyone else trusts them. While the problem is categorized as "Easy," it's interesting because it tests your ability to translate real-world constraints into efficient computational logic using simple data structures. The tricky part is handling the "trusts nobody" condition while simultaneously verifying that everyone trusts the judge.

## Visual Walkthrough

Let's walk through an example with n = 4 people and trust relationships: [[1,3], [2,3], [4,3]]

**Step 1: Understanding the trust array**
Each pair [a, b] means "person a trusts person b"

- [1,3] → Person 1 trusts person 3
- [2,3] → Person 2 trusts person 3
- [4,3] → Person 4 trusts person 3

**Step 2: Tracking trust counts**
We need to track two things for each person:

1. How many people they trust (outgoing trust)
2. How many people trust them (incoming trust)

Let's build this step by step:

Person 1: trusts person 3 → outgoing: 1, incoming: 0
Person 2: trusts person 3 → outgoing: 1, incoming: 0  
Person 3: trusts nobody → outgoing: 0, incoming: 3 (from 1, 2, and 4)
Person 4: trusts person 3 → outgoing: 1, incoming: 0

**Step 3: Checking judge conditions**
The judge must have:

1. Outgoing trust = 0 (trusts nobody)
2. Incoming trust = n-1 = 3 (everyone else trusts them)

Only person 3 satisfies both conditions:

- Outgoing: 0 ✓
- Incoming: 3 ✓

Therefore, person 3 is the judge.

## Brute Force Approach

A naive approach would be to check each person against all trust relationships. For each person i (1 to n):

1. Check if i doesn't appear as the first element in any trust pair (trusts nobody)
2. Count how many times i appears as the second element (everyone trusts them)
3. Verify the count equals n-1

This requires O(n × t) time where t is the number of trust relationships, which could be O(n²) in the worst case. While this might pass for small n, it's inefficient and doesn't demonstrate good algorithmic thinking.

The key insight is that we don't need to repeatedly scan the trust array. We can process it once and track the necessary counts.

## Optimal Solution

The optimal solution uses a simple counting approach. We maintain two counters for each person:

- `trusts_count[i]`: how many people person i trusts (outgoing)
- `trusted_by_count[i]`: how many people trust person i (incoming)

After processing all trust relationships, we look for a person who has `trusts_count[i] = 0` and `trusted_by_count[i] = n-1`.

<div class="code-group">

```python
# Time: O(t + n) where t = len(trust) | Space: O(n)
def findJudge(n, trust):
    """
    Find the town judge if one exists.

    Args:
        n: Number of people in town (1 to n)
        trust: List of trust relationships [a, b] where a trusts b

    Returns:
        The label of the judge (1 to n) or -1 if no judge exists
    """
    # Initialize arrays to track trust relationships
    # Index 0 is unused since people are labeled 1 to n
    trusts_count = [0] * (n + 1)  # How many people each person trusts
    trusted_by_count = [0] * (n + 1)  # How many people trust each person

    # Process each trust relationship
    for a, b in trust:
        # Person a trusts person b
        trusts_count[a] += 1  # a's outgoing trust count increases
        trusted_by_count[b] += 1  # b's incoming trust count increases

    # Check each person to see if they're the judge
    for person in range(1, n + 1):
        # Judge conditions:
        # 1. Trusts nobody (trusts_count[person] == 0)
        # 2. Everyone else trusts them (trusted_by_count[person] == n-1)
        if trusts_count[person] == 0 and trusted_by_count[person] == n - 1:
            return person

    # No judge found
    return -1
```

```javascript
// Time: O(t + n) where t = trust.length | Space: O(n)
function findJudge(n, trust) {
  /**
   * Find the town judge if one exists.
   *
   * @param {number} n - Number of people in town (1 to n)
   * @param {number[][]} trust - Array of trust relationships [a, b] where a trusts b
   * @return {number} The label of the judge (1 to n) or -1 if no judge exists
   */

  // Initialize arrays to track trust relationships
  // Index 0 is unused since people are labeled 1 to n
  const trustsCount = new Array(n + 1).fill(0); // How many people each person trusts
  const trustedByCount = new Array(n + 1).fill(0); // How many people trust each person

  // Process each trust relationship
  for (const [a, b] of trust) {
    // Person a trusts person b
    trustsCount[a] += 1; // a's outgoing trust count increases
    trustedByCount[b] += 1; // b's incoming trust count increases
  }

  // Check each person to see if they're the judge
  for (let person = 1; person <= n; person++) {
    // Judge conditions:
    // 1. Trusts nobody (trustsCount[person] === 0)
    // 2. Everyone else trusts them (trustedByCount[person] === n-1)
    if (trustsCount[person] === 0 && trustedByCount[person] === n - 1) {
      return person;
    }
  }

  // No judge found
  return -1;
}
```

```java
// Time: O(t + n) where t = trust.length | Space: O(n)
class Solution {
    public int findJudge(int n, int[][] trust) {
        /**
         * Find the town judge if one exists.
         *
         * @param n Number of people in town (1 to n)
         * @param trust Array of trust relationships [a, b] where a trusts b
         * @return The label of the judge (1 to n) or -1 if no judge exists
         */

        // Initialize arrays to track trust relationships
        // Index 0 is unused since people are labeled 1 to n
        int[] trustsCount = new int[n + 1];  // How many people each person trusts
        int[] trustedByCount = new int[n + 1];  // How many people trust each person

        // Process each trust relationship
        for (int[] relationship : trust) {
            int a = relationship[0];  // Person who trusts
            int b = relationship[1];  // Person being trusted

            // Person a trusts person b
            trustsCount[a] += 1;  // a's outgoing trust count increases
            trustedByCount[b] += 1;  // b's incoming trust count increases
        }

        // Check each person to see if they're the judge
        for (int person = 1; person <= n; person++) {
            // Judge conditions:
            // 1. Trusts nobody (trustsCount[person] == 0)
            // 2. Everyone else trusts them (trustedByCount[person] == n-1)
            if (trustsCount[person] == 0 && trustedByCount[person] == n - 1) {
                return person;
            }
        }

        // No judge found
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(t + n)**

- We iterate through all trust relationships once: O(t) where t = len(trust)
- We then iterate through all n people to find the judge: O(n)
- Total: O(t + n)

**Space Complexity: O(n)**

- We use two arrays of size n+1 to track trust counts
- This is O(n) space, which is optimal for this approach

## Common Mistakes

1. **Forgetting that people are labeled 1 to n, not 0 to n-1**: This leads to off-by-one errors. Always remember to create arrays of size n+1 and ignore index 0.

2. **Only checking one condition**: Some candidates check only that the judge is trusted by n-1 people but forget to verify they trust nobody. The judge could trust someone and still be trusted by everyone (though this violates condition 1).

3. **Using inefficient data structures**: Using nested loops or repeatedly scanning the trust array leads to O(n²) time. The optimal solution processes the trust array only once.

4. **Not handling edge cases**:
   - n = 1 with empty trust array → Person 1 is the judge (they trust nobody, and everyone else [0 people] trusts them)
   - Empty trust array with n > 1 → No judge exists (nobody trusts anyone)
   - Multiple people with 0 outgoing trust → Need to check incoming trust count to find the unique judge

## When You'll See This Pattern

This problem uses **degree counting in directed graphs**, where we track incoming and outgoing edges. This pattern appears in various graph and relationship problems:

1. **Find the Celebrity (Medium)**: Similar concept but with an API that tells you if person A knows person B. The optimal solution uses a two-pointer approach to eliminate candidates.

2. **Course Schedule (Medium)**: Uses indegree counting for topological sorting to detect cycles in course prerequisites.

3. **Minimum Height Trees (Medium)**: Uses degree counting on trees to find center nodes by repeatedly removing leaves.

The core idea is tracking relationships between entities and using those counts to identify special nodes based on their connection patterns.

## Key Takeaways

1. **Think in terms of graph degrees**: When you see problems about relationships or dependencies, consider representing them as a graph and tracking incoming/outgoing connections.

2. **Process data once, then analyze**: Instead of repeatedly scanning the input, process it once into a summary structure (like count arrays), then analyze that summary.

3. **Verify all constraints**: Don't assume one condition implies another. The judge must satisfy BOTH conditions: trusts nobody AND is trusted by everyone else.

Related problems: [Find the Celebrity](/problem/find-the-celebrity)
