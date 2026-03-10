---
title: "How to Solve Rabbits in Forest — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rabbits in Forest. Medium difficulty, 58.1% acceptance rate. Topics: Array, Hash Table, Math, Greedy."
date: "2026-03-11"
category: "dsa-patterns"
tags: ["rabbits-in-forest", "array", "hash-table", "math", "medium"]
---

# How to Solve Rabbits in Forest

This problem asks us to find the minimum number of rabbits in a forest based on survey responses. Each rabbit tells us how many _other_ rabbits share its color, and we need to determine the smallest possible total rabbit population consistent with all answers. The tricky part is that rabbits with the same answer might not necessarily be the same color—they could belong to different groups that coincidentally have the same size.

## Visual Walkthrough

Let's trace through an example: `answers = [1, 1, 2]`

**Step 1:** First rabbit says "1 other rabbit has my color." This means if it's telling the truth, there must be at least 2 rabbits of that color (itself + 1 other).

**Step 2:** Second rabbit also says "1 other rabbit has my color." Could it be the same color as the first rabbit? If so, we'd have 2 rabbits claiming there's 1 other of their color. But in a group of 2 rabbits, each would truthfully say "1 other" (since there's exactly 1 other rabbit of that color). So these 2 rabbits could be the same color, forming a complete group of 2.

**Step 3:** Third rabbit says "2 other rabbits have my color." This means it needs at least 3 rabbits of its color (itself + 2 others). Since we don't have any other rabbits saying "2", this rabbit must be in a new color group of at least 3 rabbits.

**Minimum total:** Group 1 (color A): 2 rabbits, Group 2 (color B): 3 rabbits. Total = 5 rabbits.

What if we had `answers = [1, 1, 1, 1]`?

- First two rabbits saying "1" can form one group of 2
- Third rabbit saying "1" cannot join the existing group of 2 (that group is already full—each rabbit in a group of size 2 truthfully says "1")
- So third and fourth rabbits saying "1" form a second group of 2
- Total: 2 + 2 = 4 rabbits

The pattern: For rabbits giving the same answer `k`, we can group up to `k+1` of them together (since a rabbit saying "k others" means total group size is `k+1`). Once we have more than `k+1` rabbits giving answer `k`, they must belong to multiple groups of that color.

## Brute Force Approach

A naive approach might try to assign rabbits to colors while checking all possible groupings. We could:

1. Sort the answers
2. Try to group rabbits with the same answer together
3. When we exceed the group size for an answer, start a new group

However, the real brute force would involve trying all possible color assignments, which is exponential in complexity. Even a greedy grouping approach needs careful counting. The naive mistake would be to simply count unique answers and multiply by `(answer + 1)`, but this fails for cases like `[1, 1, 1, 1]` where we need multiple groups for the same answer value.

Here's what the incorrect naive solution might look like:

```python
# INCORRECT naive approach
def numRabbits(answers):
    count = 0
    for ans in set(answers):
        count += (ans + 1)
    return count
```

This fails for `[1, 1, 1, 1]` because it would return `2` instead of `4`. The problem requires us to handle multiple groups for the same answer value.

## Optimized Approach

The key insight is that rabbits giving the same answer `k` can be grouped together, but each group can have at most `k+1` members. If we have `n` rabbits all saying "k", then:

- The first `k+1` rabbits can form one group
- The next `k+1` rabbits form another group
- And so on...

Mathematically, if `count` rabbits give answer `k`, we need `ceil(count / (k+1))` groups of size `k+1`.

This leads to a clean solution:

1. Count how many rabbits give each answer using a hash map
2. For each answer `k` with count `c`:
   - Calculate groups needed = `ceil(c / (k+1))`
   - Each group has `k+1` rabbits
   - Total rabbits for this answer = `groups_needed × (k+1)`
3. Sum across all answers

The ceiling division can be computed as: `(c + k) // (k + 1)` which is equivalent to `ceil(c / (k+1))`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numRabbits(answers):
    """
    Calculate minimum number of rabbits in the forest.

    Args:
        answers: List of integers where answers[i] is the ith rabbit's answer

    Returns:
        Minimum possible total number of rabbits
    """
    from collections import defaultdict

    # Step 1: Count frequency of each answer
    # Key: answer k (number of other rabbits with same color)
    # Value: how many rabbits gave this answer
    count_map = defaultdict(int)
    for ans in answers:
        count_map[ans] += 1

    total_rabbits = 0

    # Step 2: For each unique answer, calculate minimum rabbits needed
    for k, count in count_map.items():
        # Each group of rabbits with answer k can have at most (k+1) members
        # If we have 'count' rabbits saying k, we need ceil(count / (k+1)) groups
        # Each group contributes (k+1) rabbits to the total

        # Calculate groups needed using ceiling division
        groups_needed = (count + k) // (k + 1)

        # Add rabbits from these groups to total
        total_rabbits += groups_needed * (k + 1)

    return total_rabbits
```

```javascript
// Time: O(n) | Space: O(n)
function numRabbits(answers) {
  /**
   * Calculate minimum number of rabbits in the forest.
   *
   * @param {number[]} answers - Array where answers[i] is the ith rabbit's answer
   * @return {number} Minimum possible total number of rabbits
   */

  // Step 1: Count frequency of each answer
  // Key: answer k (number of other rabbits with same color)
  // Value: how many rabbits gave this answer
  const countMap = new Map();

  for (const ans of answers) {
    countMap.set(ans, (countMap.get(ans) || 0) + 1);
  }

  let totalRabbits = 0;

  // Step 2: For each unique answer, calculate minimum rabbits needed
  for (const [k, count] of countMap.entries()) {
    // Each group of rabbits with answer k can have at most (k+1) members
    // If we have 'count' rabbits saying k, we need ceil(count / (k+1)) groups
    // Each group contributes (k+1) rabbits to the total

    // Calculate groups needed using ceiling division
    const groupsNeeded = Math.ceil(count / (k + 1));

    // Add rabbits from these groups to total
    totalRabbits += groupsNeeded * (k + 1);
  }

  return totalRabbits;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int numRabbits(int[] answers) {
        /**
         * Calculate minimum number of rabbits in the forest.
         *
         * @param answers Array where answers[i] is the ith rabbit's answer
         * @return Minimum possible total number of rabbits
         */

        // Step 1: Count frequency of each answer
        // Key: answer k (number of other rabbits with same color)
        // Value: how many rabbits gave this answer
        Map<Integer, Integer> countMap = new HashMap<>();

        for (int ans : answers) {
            countMap.put(ans, countMap.getOrDefault(ans, 0) + 1);
        }

        int totalRabbits = 0;

        // Step 2: For each unique answer, calculate minimum rabbits needed
        for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
            int k = entry.getKey();
            int count = entry.getValue();

            // Each group of rabbits with answer k can have at most (k+1) members
            // If we have 'count' rabbits saying k, we need ceil(count / (k+1)) groups
            // Each group contributes (k+1) rabbits to the total

            // Calculate groups needed using ceiling division
            // (count + k) / (k + 1) gives us ceil(count / (k+1))
            int groupsNeeded = (count + k) / (k + 1);

            // Add rabbits from these groups to total
            totalRabbits += groupsNeeded * (k + 1);
        }

        return totalRabbits;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make one pass through the `answers` array to build the frequency map: O(n)
- We then iterate through the unique answers in the map: O(u) where u ≤ n
- In worst case, all answers are unique, so u = n
- Total: O(n + u) = O(n)

**Space Complexity:** O(n)

- We store a frequency map that, in the worst case, contains an entry for each rabbit when all answers are unique
- Thus, the map can have up to n entries: O(n)

## Common Mistakes

1. **Forgetting that rabbits saying "0" are valid**: A rabbit saying "0" means it's the only rabbit of its color. Some candidates mistakenly think "0" means no rabbits exist. Remember: answer `k` means "k other rabbits", so `k=0` means the rabbit is alone in its color group.

2. **Incorrect ceiling division**: Using integer division `count // (k+1)` instead of ceiling division underestimates the number of groups needed. For example, with 3 rabbits saying "1", we need 2 groups (not 1). The formula `(count + k) // (k + 1)` correctly implements ceiling division.

3. **Assuming all rabbits with same answer are same color**: This leads to underestimating the total. For `[1, 1, 1, 1]`, if we assume all 4 rabbits are the same color, we'd calculate 2 rabbits total (since each says "1 other"), but in a group of 4 rabbits, each would say "3 others", not "1 other". They must be in two separate groups of 2.

4. **Off-by-one errors with group size**: Remember that if a rabbit says "k others", the total group size is `k+1` (itself + k others). A common mistake is to use `k` instead of `k+1` when calculating group size.

## When You'll See This Pattern

This problem uses a **frequency counting with grouping** pattern that appears in several other problems:

1. **Group the People Given the Group Size They Belong To (LeetCode 1282)**: Very similar concept—you're given group sizes and need to form valid groups. The main difference is that in "Group the People", you need to output the actual groupings, not just count the minimum.

2. **Hand of Straights (LeetCode 846)**: While not identical, it involves grouping elements with constraints on group sizes, requiring similar grouping logic.

3. **Divide Array in Sets of K Consecutive Numbers (LeetCode 1296)**: Another grouping problem where you need to form groups of specific sizes from a collection of numbers.

The core pattern is: when you need to partition elements into groups with size constraints, and you have a frequency count of elements, use ceiling division to determine how many groups are needed.

## Key Takeaways

1. **Group size vs. answer value**: When a rabbit says "k others", the actual group size is `k+1`. This "+1" is crucial and easy to forget.

2. **Ceiling division for grouping**: When you have `count` items that need to be placed in groups of size `size`, you need `ceil(count / size)` groups. The formula `(count + size - 1) // size` is a handy way to compute this without floating-point arithmetic.

3. **Frequency maps solve grouping problems**: Many grouping problems become straightforward once you count frequencies. The map tells you "how many of each type" you have, and from there you can apply grouping logic.

Related problems: [Group the People Given the Group Size They Belong To](/problem/group-the-people-given-the-group-size-they-belong-to)
