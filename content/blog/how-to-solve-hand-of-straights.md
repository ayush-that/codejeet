---
title: "How to Solve Hand of Straights — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Hand of Straights. Medium difficulty, 57.8% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting."
date: "2027-06-20"
category: "dsa-patterns"
tags: ["hand-of-straights", "array", "hash-table", "greedy", "medium"]
---

## Brief Problem Restatement

We’re given an array of card values and a group size. We need to determine if we can split all cards into groups where each group has exactly `groupSize` cards with consecutive values (like 3,4,5). The challenge is that cards can appear multiple times, and we must use every card exactly once.

---

## Visual Walkthrough

Let’s trace through `hand = [1,2,3,6,2,3,4,7,8]`, `groupSize = 3`.

**Step 1 – Sort and count cards**  
Sorted: `[1,2,2,3,3,4,6,7,8]`  
Counts: `{1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}`

**Step 2 – Start forming groups**  
Look at smallest card: `1`. Need `2` and `3` to form `[1,2,3]`.  
Check counts: `1` (1 left), `2` (2 left), `3` (2 left).  
Use one of each → decrement: `1:0, 2:1, 3:1`.

**Step 3 – Next smallest with remaining cards**  
Next is `2` (count 1). Need `3` and `4`.  
Check: `2` (1 left), `3` (1 left), `4` (1 left).  
Use them → `2:0, 3:0, 4:0`.

**Step 4 – Continue**  
Next is `6`. Need `7` and `8`.  
Check: `6:1, 7:1, 8:1`.  
Use them → `6:0, 7:0, 8:0`.

All cards used → `true`.  
If at any step a needed card was missing (e.g., needed `5` but had none), we’d return `false`.

---

## Brute Force Approach

A brute force method would repeatedly scan the array to find the smallest available card, then try to build a consecutive group of size `groupSize` by searching for each needed card. This requires:

- Sorting the array: O(n log n)
- For each group, for each card in the group, linear scan to find and remove that card from the list.

The removal operation alone could be O(n) per card, leading to O(n²) time in worst case. Also, repeatedly scanning and removing elements is messy and inefficient.

**Why it’s insufficient:**  
Large inputs (n up to 10⁴) make O(n²) too slow. We need faster lookups and updates for card counts.

---

## Optimized Approach

The key insight:

1. **Sorting** lets us always start a group with the smallest remaining card.
2. **Hash map counts** track how many copies of each card we have left.
3. **Greedy formation** – once we pick a start card, the next `groupSize-1` cards must be consecutive values. If any is missing, we fail immediately.

**Step-by-step reasoning:**

- First, check if total cards are divisible by `groupSize`. If not, return `false`.
- Sort the hand and build a frequency map.
- Iterate through sorted cards. For each card that still has count > 0:
  - Try to form a group starting with that card.
  - For `k = 0` to `groupSize-1`, check if `card + k` exists in frequency map with count > 0.
  - If yes, decrement its count; if no, return `false`.
- If we finish, return `true`.

This ensures we use cards in sorted order and always form valid consecutive groups.

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n * groupSize) for group building → O(n log n) if groupSize is small
# Space: O(n) for the frequency map
from collections import Counter

def isNStraightHand(hand, groupSize):
    # If total cards not divisible by groupSize, impossible
    if len(hand) % groupSize != 0:
        return False

    # Count frequency of each card
    count = Counter(hand)

    # Sort unique card values
    sorted_cards = sorted(count.keys())

    # Try to form groups starting from smallest card
    for card in sorted_cards:
        # While there are still copies of this card left
        while count[card] > 0:
            # Try to build a consecutive group of size groupSize
            for next_card in range(card, card + groupSize):
                # If needed card is missing, cannot form group
                if count[next_card] <= 0:
                    return False
                # Use one copy of this card
                count[next_card] -= 1

    return True
```

```javascript
// Time: O(n log n) | Space: O(n)
function isNStraightHand(hand, groupSize) {
  // If total cards not divisible by groupSize, impossible
  if (hand.length % groupSize !== 0) return false;

  // Count frequency of each card
  const count = new Map();
  for (const card of hand) {
    count.set(card, (count.get(card) || 0) + 1);
  }

  // Sort unique card values
  const sortedCards = [...count.keys()].sort((a, b) => a - b);

  // Try to form groups starting from smallest card
  for (const card of sortedCards) {
    // While there are still copies of this card left
    while (count.get(card) > 0) {
      // Try to build a consecutive group of size groupSize
      for (let nextCard = card; nextCard < card + groupSize; nextCard++) {
        // If needed card is missing, cannot form group
        if (!count.has(nextCard) || count.get(nextCard) <= 0) {
          return false;
        }
        // Use one copy of this card
        count.set(nextCard, count.get(nextCard) - 1);
      }
    }
  }

  return true;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        // If total cards not divisible by groupSize, impossible
        if (hand.length % groupSize != 0) return false;

        // Count frequency of each card
        Map<Integer, Integer> count = new HashMap<>();
        for (int card : hand) {
            count.put(card, count.getOrDefault(card, 0) + 1);
        }

        // Get sorted unique card values
        List<Integer> sortedCards = new ArrayList<>(count.keySet());
        Collections.sort(sortedCards);

        // Try to form groups starting from smallest card
        for (int card : sortedCards) {
            // While there are still copies of this card left
            while (count.get(card) > 0) {
                // Try to build a consecutive group of size groupSize
                for (int nextCard = card; nextCard < card + groupSize; nextCard++) {
                    // If needed card is missing, cannot form group
                    if (!count.containsKey(nextCard) || count.get(nextCard) <= 0) {
                        return false;
                    }
                    // Use one copy of this card
                    count.put(nextCard, count.get(nextCard) - 1);
                }
            }
        }

        return true;
    }
}
```

</div>

---

## Complexity Analysis

- **Time:** O(n log n) where n is number of cards.  
  Sorting unique keys takes O(m log m) where m ≤ n.  
  The nested loops: outer runs O(m) times, inner runs `groupSize` times, but each card is processed exactly once when we decrement counts. So total O(n) for the group building. Dominant term is O(n log n) from sorting.
- **Space:** O(n) for the frequency map storing counts of each card value.

---

## Common Mistakes

1. **Not checking divisibility first** – If total cards aren’t divisible by `groupSize`, answer is immediately `false`. Missing this wastes time.
2. **Forgetting to sort** – Without sorting, you might start a group with a card that’s not the smallest remaining, causing unnecessary failures.
3. **Incorrect count updates** – When building a group, you must decrement counts for _all_ cards in the group. Missing one leads to incorrect reuse of cards.
4. **Using array instead of hash map for sparse values** – Card values can be up to 10⁹, so array of size `max(hand)` is infeasible. Always use a hash map.

---

## When You’ll See This Pattern

This “greedy grouping with frequency map” pattern appears in problems where you need to partition items into consecutive or ordered groups:

- **Divide Array in Sets of K Consecutive Numbers** (LeetCode 1296) – literally the same problem.
- **Split Array into Consecutive Subsequences** (LeetCode 659) – harder variant where groups can be of varying sizes.
- **Task Scheduler** (LeetCode 621) – similar greedy scheduling with frequency counts.

The core technique: sort, count frequencies, then greedily form groups starting from the smallest available element.

---

## Key Takeaways

1. **Sort + Greedy + Frequency Map** is a powerful combo for grouping problems with ordering constraints.
2. Always check basic impossibility conditions first (like divisibility) to short-circuit.
3. When you need to track counts of items that can be sparse or large, hash maps are better than arrays.

---

[Practice this problem on CodeJeet](/problem/hand-of-straights)
