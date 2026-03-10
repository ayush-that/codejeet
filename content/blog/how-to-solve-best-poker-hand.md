---
title: "How to Solve Best Poker Hand — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Best Poker Hand. Easy difficulty, 61.6% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-06-19"
category: "dsa-patterns"
tags: ["best-poker-hand", "array", "hash-table", "counting", "easy"]
---

# How to Solve Best Poker Hand

You're given two arrays representing 5 playing cards: `ranks` (integers) and `suits` (characters). Your task is to determine the best poker hand possible from these cards, choosing between only two possible hands: "Flush" (all same suit) or "Three of a Kind" (three cards of same rank). The problem is interesting because it's a simplified poker hand classification that tests your ability to count frequencies efficiently while handling multiple conditions in the right order.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Example Input:**

```
ranks = [10, 10, 2, 12, 9]
suits = ['a', 'a', 'a', 'a', 'a']
```

**Step 1: Check for Flush**

- Look at all suits: 'a', 'a', 'a', 'a', 'a'
- All 5 suits are the same → This is a Flush!
- Since Flush is the best possible hand, we can immediately return "Flush"

**Example Input 2:**

```
ranks = [10, 10, 10, 12, 9]
suits = ['a', 'b', 'c', 'd', 'e']
```

**Step 1: Check for Flush**

- Suits: 'a', 'b', 'c', 'd', 'e' → all different
- Not a Flush

**Step 2: Check for Three of a Kind**

- Count rank frequencies:
  - 10 appears 3 times
  - 12 appears 1 time
  - 9 appears 1 time
- Since we have a rank that appears 3 or more times → "Three of a Kind"

**Example Input 3:**

```
ranks = [2, 3, 4, 5, 6]
suits = ['a', 'b', 'c', 'd', 'e']
```

**Step 1: Check for Flush** → No (all different suits)
**Step 2: Check for Three of a Kind** → No (all ranks appear once)

- Return "High Card" (though not explicitly named in problem, it's the default)

The key insight: Always check for Flush first since it's the highest-ranking hand. Only if it's not a Flush do we check for Three of a Kind.

## Brute Force Approach

A naive approach might try to check all possible combinations or sort the arrays unnecessarily. However, since we only have 5 cards and two specific conditions to check, even a brute force approach would be efficient enough. The real "brute force" thinking here would be:

1. Check if all suits are the same by comparing each suit to the first one
2. Count rank frequencies by comparing each rank with every other rank

While this approach would work (O(n²) for the rank counting), it's inefficient and doesn't scale well if we had more cards. More importantly, it misses the opportunity to use efficient data structures like hash tables for counting.

Here's what inefficient rank counting might look like:

```python
# Inefficient O(n²) approach
def is_three_of_a_kind_naive(ranks):
    for i in range(len(ranks)):
        count = 0
        for j in range(len(ranks)):
            if ranks[i] == ranks[j]:
                count += 1
        if count >= 3:
            return True
    return False
```

The problem with this approach is the nested loop which gives us O(n²) time complexity. With 5 cards it's fine, but the pattern doesn't generalize well to larger problems.

## Optimal Solution

The optimal solution uses hash tables (dictionaries/objects/maps) to count frequencies efficiently. We check for Flush first (O(n) time), then use a frequency counter to check for Three of a Kind (also O(n) time).

<div class="code-group">

```python
# Time: O(n) | Space: O(n) where n = 5 (constant)
def bestHand(ranks, suits):
    """
    Determine the best poker hand from given ranks and suits.

    Args:
        ranks: List[int] - card ranks (1-13 typically)
        suits: List[str] - card suits

    Returns:
        str: "Flush", "Three of a Kind", or "High Card"
    """
    # Step 1: Check for Flush - all cards have same suit
    # Compare all suits to the first suit
    if all(suit == suits[0] for suit in suits):
        return "Flush"

    # Step 2: Count frequency of each rank using a dictionary
    rank_count = {}
    for rank in ranks:
        # Increment count for this rank, defaulting to 0 if not seen
        rank_count[rank] = rank_count.get(rank, 0) + 1

    # Step 3: Check if any rank appears 3 or more times
    # We only need to know if max frequency >= 3
    if max(rank_count.values()) >= 3:
        return "Three of a Kind"

    # Step 4: Default case - none of the above conditions met
    return "High Card"
```

```javascript
// Time: O(n) | Space: O(n) where n = 5 (constant)
/**
 * Determine the best poker hand from given ranks and suits.
 * @param {number[]} ranks - card ranks (1-13 typically)
 * @param {character[]} suits - card suits
 * @return {string} "Flush", "Three of a Kind", or "High Card"
 */
function bestHand(ranks, suits) {
  // Step 1: Check for Flush - all cards have same suit
  // Use every() to check if all suits equal the first suit
  if (suits.every((suit) => suit === suits[0])) {
    return "Flush";
  }

  // Step 2: Count frequency of each rank using a Map
  const rankCount = new Map();
  for (const rank of ranks) {
    // Get current count or 0, then increment
    rankCount.set(rank, (rankCount.get(rank) || 0) + 1);
  }

  // Step 3: Check if any rank appears 3 or more times
  // Convert Map values to array and find max
  const maxCount = Math.max(...rankCount.values());
  if (maxCount >= 3) {
    return "Three of a Kind";
  }

  // Step 4: Default case - none of the above conditions met
  return "High Card";
}
```

```java
// Time: O(n) | Space: O(n) where n = 5 (constant)
import java.util.*;

class Solution {
    /**
     * Determine the best poker hand from given ranks and suits.
     * @param ranks - card ranks (1-13 typically)
     * @param suits - card suits
     * @return "Flush", "Three of a Kind", or "High Card"
     */
    public String bestHand(int[] ranks, char[] suits) {
        // Step 1: Check for Flush - all cards have same suit
        // Compare all suits to the first suit
        boolean isFlush = true;
        for (int i = 1; i < suits.length; i++) {
            if (suits[i] != suits[0]) {
                isFlush = false;
                break;
            }
        }
        if (isFlush) {
            return "Flush";
        }

        // Step 2: Count frequency of each rank using HashMap
        Map<Integer, Integer> rankCount = new HashMap<>();
        for (int rank : ranks) {
            // Increment count for this rank, defaulting to 0 if not present
            rankCount.put(rank, rankCount.getOrDefault(rank, 0) + 1);
        }

        // Step 3: Check if any rank appears 3 or more times
        // Iterate through values to find maximum frequency
        int maxCount = 0;
        for (int count : rankCount.values()) {
            maxCount = Math.max(maxCount, count);
        }
        if (maxCount >= 3) {
            return "Three of a Kind";
        }

        // Step 4: Default case - none of the above conditions met
        return "High Card";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Checking for Flush: O(n) - we compare each suit to the first one
- Counting ranks: O(n) - we iterate through all ranks once
- Finding max frequency: O(n) - we check all counts in the frequency map
- Total: O(n) + O(n) + O(n) = O(n), where n = 5 (constant)

**Space Complexity: O(n)**

- The frequency map stores at most n entries (one for each unique rank)
- In worst case, all ranks are different → O(n) space
- Since n = 5, this is effectively O(1) constant space, but we express it as O(n) for generalization

The key observation: While n is fixed at 5 for this problem, our solution scales linearly for any number of cards, making it a good general pattern.

## Common Mistakes

1. **Checking conditions in wrong order**: Some candidates check for Three of a Kind before Flush. Remember: Flush is the highest-ranking hand, so it must be checked first. A hand that's both a Flush and has three of a kind is still just a Flush.

2. **Overcomplicating the flush check**: No need for sets or complex logic. Since we only have 5 cards, simply check if all suits equal the first suit. Using `all(suit == suits[0] for suit in suits)` in Python or similar in other languages is clean and efficient.

3. **Inefficient rank counting**: Using nested loops (O(n²)) instead of a hash table. Even with only 5 cards, interviewers want to see you recognize the pattern of frequency counting and reach for the right tool (hash table) instinctively.

4. **Forgetting edge cases**:
   - All ranks different and suits different → should return "High Card"
   - Exactly 2 cards of same rank (a pair) → still returns "High Card" (not "Three of a Kind")
   - Empty input (not in constraints but good to consider) → would need additional handling

## When You'll See This Pattern

This problem combines two common patterns:

1. **Frequency Counting with Hash Tables**: Whenever you need to count occurrences of elements, think hash table. This pattern appears in:
   - [Majority Element](https://leetcode.com/problems/majority-element/) - Find element appearing more than n/2 times
   - [Single Number](https://leetcode.com/problems/single-number/) - Find the only non-duplicate in an array
   - [Valid Anagram](https://leetcode.com/problems/valid-anagram/) - Check if two strings have same character frequencies

2. **Conditional Classification**: Problems where you classify input based on multiple conditions in priority order:
   - [Categorize Box According to Criteria](https://leetcode.com/problems/categorize-box-according-to-criteria/) - Similar structure: check conditions in specific order
   - [Integer to Roman](https://leetcode.com/problems/integer-to-roman/) - Apply rules in descending order of value
   - [Fizz Buzz](https://leetcode.com/problems/fizz-buzz/) - Check divisibility conditions in specific order

## Key Takeaways

1. **Frequency problems → Hash tables**: When you need to count how many times elements appear, a hash table (dictionary, map, object) is almost always the right choice. It gives O(1) lookups and O(n) total time.

2. **Check conditions in priority order**: When multiple exclusive conditions exist with different priorities, always check the highest priority first and return immediately when satisfied. This makes code cleaner and more efficient.

3. **Simple checks for uniformity**: To check if all elements are the same, compare each to the first element. No need for sets or other data structures unless you need additional information.

4. **Even "Easy" problems test fundamentals**: This problem seems simple but tests your understanding of hash tables, conditional logic, and problem decomposition—all essential skills for harder problems.

Related problems: [Categorize Box According to Criteria](/problem/categorize-box-according-to-criteria)
