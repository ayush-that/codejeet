---
title: "How to Solve Split Array into Consecutive Subsequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Split Array into Consecutive Subsequences. Medium difficulty, 52.0% acceptance rate. Topics: Array, Hash Table, Greedy, Heap (Priority Queue)."
date: "2026-09-30"
category: "dsa-patterns"
tags: ["split-array-into-consecutive-subsequences", "array", "hash-table", "greedy", "medium"]
---

## How to Solve Split Array into Consecutive Subsequences

You're given a sorted array of integers and need to determine if you can split it into subsequences where each subsequence contains at least 3 consecutive integers. The challenge is that each number can only be used in one subsequence, and you need to decide whether to start a new subsequence or extend an existing one as you process each number.

What makes this problem tricky is that you can't just greedily create subsequences from the smallest numbers—sometimes you need to save numbers for extending existing subsequences to reach the minimum length of 3. The optimal solution requires tracking both how many of each number are available and which numbers are needed to extend existing subsequences.

## Visual Walkthrough

Let's trace through example `nums = [1,2,3,3,4,4,5,5]`:

**Step 1:** Process `1`

- No existing subsequences need `1`, so start a new subsequence: `[1]`
- We'll need `2` to extend this subsequence

**Step 2:** Process `2`

- We have a subsequence needing `2`, so extend: `[1,2]`
- Now we need `3` to continue this subsequence

**Step 3:** Process first `3`

- We have a subsequence needing `3`, so extend: `[1,2,3]`
- This subsequence now has length 3 (valid!), so we don't need to track it further

**Step 4:** Process second `3`

- No existing subsequences need `3`, so start new subsequence: `[3]`
- We'll need `4` to extend this subsequence

**Step 5:** Process first `4`

- We have a subsequence needing `4`, so extend: `[3,4]`
- Now we need `5` to continue this subsequence

**Step 6:** Process second `4`

- No existing subsequences need `4`, so start new subsequence: `[4]`
- We'll need `5` to extend this subsequence

**Step 7:** Process first `5`

- We have a subsequence needing `5`, so extend: `[3,4,5]` (valid!)
- We also have another subsequence `[4]` that needs `5`

**Step 8:** Process second `5`

- We have a subsequence needing `5`, so extend: `[4,5]`
- This subsequence only has length 2 → INVALID!

The key insight: when we have multiple subsequences needing the same number, we should always extend the most "urgent" one (the one that would become invalid if not extended).

## Brute Force Approach

A naive approach would try to generate all possible subsequence combinations. For each number, you could either:

1. Start a new subsequence
2. Add to an existing subsequence that ends with `num-1`

This leads to exponential time complexity as you'd need to backtrack when a choice leads to invalid subsequences. Even with memoization, the state space is huge because you'd need to track all active subsequences and their lengths.

The brute force is impractical because with up to 10,000 numbers, you'd have far too many combinations to explore. We need a smarter way to make decisions without backtracking.

## Optimized Approach

The optimal solution uses a greedy approach with two hash maps:

1. **`count`**: Tracks how many of each number are still available
2. **`need`**: Tracks how many subsequences need a particular number as their next element

**Key Insight**: Always try to extend an existing subsequence before starting a new one. If you must start a new one, check if you have enough numbers to make it valid (at least length 3).

**Algorithm Steps**:

1. Count frequency of each number
2. For each number in sorted order:
   - If no copies of this number remain, continue
   - If some subsequence needs this number:
     - Use one copy to extend that subsequence
     - Update the need for `num+1`
   - Else if we can start a new subsequence (have `num+1` and `num+2`):
     - Start new subsequence `[num, num+1, num+2]`
     - Mark that we'll need `num+3`
   - Otherwise, we can't use this number → return false
3. If we process all numbers successfully, return true

**Why this works**: By always extending existing subsequences when possible, we ensure we don't leave short subsequences that can't reach length 3. The greedy choice is safe because if a number can extend a subsequence, it should—delaying might leave that subsequence too short.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def isPossible(nums):
    """
    Determines if nums can be split into subsequences of at least 3 consecutive integers.

    Approach: Greedy with two frequency maps:
    - count: remaining count of each number
    - need: how many subsequences need this number as next element

    We always try to extend existing subsequences before starting new ones.
    """
    from collections import defaultdict

    # Count frequency of each number
    count = defaultdict(int)
    for num in nums:
        count[num] += 1

    # Track how many subsequences need each number as next element
    need = defaultdict(int)

    for num in nums:
        # If no more copies of this number, skip
        if count[num] == 0:
            continue

        # Priority 1: Extend existing subsequence if possible
        if need[num] > 0:
            # Use this number to extend a subsequence
            count[num] -= 1
            # This subsequence no longer needs 'num'
            need[num] -= 1
            # Now it needs 'num+1' as next element
            need[num + 1] += 1

        # Priority 2: Start new subsequence if possible
        elif count[num + 1] > 0 and count[num + 2] > 0:
            # Start new subsequence [num, num+1, num+2]
            count[num] -= 1
            count[num + 1] -= 1
            count[num + 2] -= 1
            # This new subsequence will need 'num+3' next
            need[num + 3] += 1

        # Can't use this number in any valid way
        else:
            return False

    return True
```

```javascript
// Time: O(n) | Space: O(n)
function isPossible(nums) {
  /**
   * Determines if nums can be split into subsequences of at least 3 consecutive integers.
   *
   * Approach: Greedy with two frequency maps:
   * - count: remaining count of each number
   * - need: how many subsequences need this number as next element
   *
   * We always try to extend existing subsequences before starting new ones.
   */

  // Count frequency of each number
  const count = new Map();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }

  // Track how many subsequences need each number as next element
  const need = new Map();

  for (const num of nums) {
    // If no more copies of this number, skip
    if (count.get(num) === 0) continue;

    // Priority 1: Extend existing subsequence if possible
    if ((need.get(num) || 0) > 0) {
      // Use this number to extend a subsequence
      count.set(num, count.get(num) - 1);
      // This subsequence no longer needs 'num'
      need.set(num, (need.get(num) || 0) - 1);
      // Now it needs 'num+1' as next element
      need.set(num + 1, (need.get(num + 1) || 0) + 1);
    }
    // Priority 2: Start new subsequence if possible
    else if ((count.get(num + 1) || 0) > 0 && (count.get(num + 2) || 0) > 0) {
      // Start new subsequence [num, num+1, num+2]
      count.set(num, count.get(num) - 1);
      count.set(num + 1, count.get(num + 1) - 1);
      count.set(num + 2, count.get(num + 2) - 1);
      // This new subsequence will need 'num+3' next
      need.set(num + 3, (need.get(num + 3) || 0) + 1);
    }
    // Can't use this number in any valid way
    else {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public boolean isPossible(int[] nums) {
        /**
         * Determines if nums can be split into subsequences of at least 3 consecutive integers.
         *
         * Approach: Greedy with two frequency maps:
         * - count: remaining count of each number
         * - need: how many subsequences need this number as next element
         *
         * We always try to extend existing subsequences before starting new ones.
         */

        // Count frequency of each number
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.put(num, count.getOrDefault(num, 0) + 1);
        }

        // Track how many subsequences need each number as next element
        Map<Integer, Integer> need = new HashMap<>();

        for (int num : nums) {
            // If no more copies of this number, skip
            if (count.getOrDefault(num, 0) == 0) {
                continue;
            }

            // Priority 1: Extend existing subsequence if possible
            if (need.getOrDefault(num, 0) > 0) {
                // Use this number to extend a subsequence
                count.put(num, count.get(num) - 1);
                // This subsequence no longer needs 'num'
                need.put(num, need.get(num) - 1);
                // Now it needs 'num+1' as next element
                need.put(num + 1, need.getOrDefault(num + 1, 0) + 1);
            }
            // Priority 2: Start new subsequence if possible
            else if (count.getOrDefault(num + 1, 0) > 0 &&
                     count.getOrDefault(num + 2, 0) > 0) {
                // Start new subsequence [num, num+1, num+2]
                count.put(num, count.get(num) - 1);
                count.put(num + 1, count.get(num + 1) - 1);
                count.put(num + 2, count.get(num + 2) - 1);
                // This new subsequence will need 'num+3' next
                need.put(num + 3, need.getOrDefault(num + 3, 0) + 1);
            }
            // Can't use this number in any valid way
            else {
                return false;
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We make two passes through the array: one to count frequencies (O(n)), and one to process each number (O(n))
- Each number is processed exactly once, and hash map operations are O(1) on average
- Total: O(n) + O(n) = O(n)

**Space Complexity**: O(n)

- The `count` map stores at most n entries (one per unique number)
- The `need` map stores at most n entries as well
- In worst case with all distinct numbers, both maps have O(n) entries
- Total: O(n) + O(n) = O(n)

## Common Mistakes

1. **Not checking if numbers are available before using them**: When starting a new subsequence, you must verify that `num+1` and `num+2` actually exist in sufficient quantities. Forgetting to check `count[num+1] > 0` and `count[num+2] > 0` leads to incorrect results.

2. **Wrong priority order**: Always extend existing subsequences before starting new ones. If you start a new subsequence when you could have extended an existing one, you might leave a subsequence too short (length < 3).

3. **Forgetting to decrement counts**: When you use a number, you must decrement its count in the `count` map. Otherwise, you might reuse the same number in multiple subsequences.

4. **Not handling the "need" map correctly**: When you extend a subsequence, you must:
   - Decrement `need[num]` (this subsequence no longer needs `num`)
   - Increment `need[num+1]` (this subsequence now needs `num+1`)
     Missing either update breaks the algorithm.

## When You'll See This Pattern

This "greedy with need tracking" pattern appears in problems where you need to allocate resources to satisfy constraints, especially with consecutive requirements:

1. **Divide Array in Sets of K Consecutive Numbers (LeetCode 1296)**: Almost identical problem but with variable minimum length K instead of fixed 3. The same two-map approach works perfectly.

2. **Task Scheduler (LeetCode 621)**: While not about consecutive numbers, it uses similar priority-based allocation where you need to schedule tasks with cooling periods.

3. **Reorganize String (LeetCode 767)**: Requires arranging characters so no two adjacent are the same, using a priority queue to always pick the most frequent available character—similar greedy "use what's most needed" logic.

The core pattern: when you need to make sequential allocation decisions with constraints, track both what's available and what's needed next.

## Key Takeaways

1. **Greedy with validation**: This problem shows how greedy algorithms can work when paired with proper validation. The key is establishing the correct priority order (extend existing before starting new).

2. **Two-map technique**: Maintaining both availability (`count`) and demand (`need`) maps is a powerful pattern for allocation problems. It allows O(1) checks for what to do with each element.

3. **Minimum length constraints change everything**: The requirement for subsequences of at least length 3 forces the "extend first" strategy. With length 2, you could be more flexible, but length 3 creates urgency to complete subsequences.

Related problems: [Top K Frequent Elements](/problem/top-k-frequent-elements), [Divide Array in Sets of K Consecutive Numbers](/problem/divide-array-in-sets-of-k-consecutive-numbers)
