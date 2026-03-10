---
title: "How to Solve Reveal Cards In Increasing Order — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reveal Cards In Increasing Order. Medium difficulty, 83.5% acceptance rate. Topics: Array, Queue, Sorting, Simulation."
date: "2028-06-20"
category: "dsa-patterns"
tags: ["reveal-cards-in-increasing-order", "array", "queue", "sorting", "medium"]
---

## How to Solve Reveal Cards In Increasing Order

You're given a deck of cards with unique integers, and you need to arrange them in a specific order so that when you repeatedly reveal the top card and move the next card to the bottom, the revealed cards appear in increasing order. The tricky part is working backwards from the desired reveal sequence to determine the initial deck arrangement.

## Visual Walkthrough

Let's trace through a small example: `deck = [17,13,11,2,3,5,7]`

**Step 1: Sort the deck in increasing order**
Sorted: `[2,3,5,7,11,13,17]` - these are the values we want to reveal in order.

**Step 2: Work backwards to reconstruct the initial deck**
We know the final reveal order, so let's simulate the process in reverse:

1. Start with an empty deck: `[]`
2. Take the largest card (17) and put it at the front: `[17]`
3. Take the next largest (13), move the bottom card (17) to the top, then add 13 to the bottom:
   - Move 17 to top: `[17]` (already at top)
   - Add 13 to bottom: `[17,13]`
4. Take 11, move bottom card (13) to top, then add 11 to bottom:
   - Move 13 to top: `[13,17]`
   - Add 11 to bottom: `[13,17,11]`
5. Take 7, move bottom card (11) to top, then add 7 to bottom:
   - Move 11 to top: `[11,13,17]`
   - Add 7 to bottom: `[11,13,17,7]`
6. Take 5, move bottom card (7) to top, then add 5 to bottom:
   - Move 7 to top: `[7,11,13,17]`
   - Add 5 to bottom: `[7,11,13,17,5]`
7. Take 3, move bottom card (5) to top, then add 3 to bottom:
   - Move 5 to top: `[5,7,11,13,17]`
   - Add 3 to bottom: `[5,7,11,13,17,3]`
8. Take 2, move bottom card (3) to top, then add 2 to bottom:
   - Move 3 to top: `[3,5,7,11,13,17]`
   - Add 2 to bottom: `[3,5,7,11,13,17,2]`

Wait, this gives us `[3,5,7,11,13,17,2]`, but the actual answer is `[2,13,3,11,5,17,7]`. What's wrong?

The issue is we're simulating the reverse process incorrectly. We need to use a deque and simulate the actual reveal process in reverse.

**Correct reverse simulation:**

1. Sort: `[2,3,5,7,11,13,17]`
2. Use a deque: `deque = []`
3. Process from largest to smallest:
   - Add 17: `[17]`
   - For 13: move last element to front (17→front), then add 13 to front: `[13,17]`
   - For 11: move last to front (17→front), add 11 to front: `[11,17,13]`
   - For 7: move last to front (13→front), add 7 to front: `[7,13,11,17]`
   - For 5: move last to front (17→front), add 5 to front: `[5,17,7,13,11]`
   - For 3: move last to front (11→front), add 3 to front: `[3,11,5,17,7,13]`
   - For 2: move last to front (13→front), add 2 to front: `[2,13,3,11,5,17,7]`

This matches the expected output!

## Brute Force Approach

A naive approach would be to try all permutations of the deck and simulate the reveal process for each one until we find an arrangement that produces increasing order when revealed. This is extremely inefficient:

- There are n! permutations for a deck of size n
- For each permutation, we need to simulate the reveal process which takes O(n) time
- Total complexity: O(n! × n), which is completely impractical even for small n

Another brute force attempt might be to simulate the process forward: start with a random arrangement and try to adjust it. However, without the key insight of working backwards from the sorted order, this becomes a guessing game.

## Optimized Approach

The key insight is that we know the **exact order** in which cards should be revealed (sorted order), so we can work backwards to reconstruct the initial deck arrangement.

Think about the reveal process:

1. Reveal the top card
2. Move the next card to the bottom
3. Repeat

In reverse:

1. Take the last revealed card
2. If there are cards in the deck, move the bottom card to the top
3. Place the card at the top

We use a deque (double-ended queue) because we need efficient operations at both ends:

- Add to the front (when placing a new card)
- Remove from the back (when moving bottom card to top)
- Add to the back (when putting the moved card at the top)

The algorithm:

1. Sort the deck in increasing order
2. Initialize an empty deque
3. Process cards from largest to smallest:
   - If deque is not empty, move the last element to the front
   - Add the current card to the front of the deque
4. Convert deque to list for the result

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def deckRevealedIncreasing(deck):
    """
    Reconstructs the initial deck order so that when cards are revealed
    (top card revealed, next card moved to bottom), they appear in increasing order.

    Steps:
    1. Sort the deck to know the reveal order
    2. Use a deque to simulate the process in reverse
    3. Process from largest to smallest card
    """
    from collections import deque

    # Step 1: Sort the deck to get the desired reveal order
    deck.sort()

    # Step 2: Initialize a deque to build the result
    result = deque()

    # Step 3: Process cards from largest to smallest (reverse of sorted order)
    # We work backwards because we know the last card revealed should be the largest
    for card in reversed(deck):
        # If result is not empty, we need to simulate the reverse of "move to bottom"
        # In the forward process: reveal card, then move next to bottom
        # In reverse: before adding a new card, move bottom card to top
        if result:
            # Move the last card to the front (reverse of moving top card to bottom)
            # This simulates: in forward process, after revealing, we move next to bottom
            # In reverse: before adding new card, we move bottom to top
            last_card = result.pop()
            result.appendleft(last_card)

        # Add the current card to the front
        # In the forward process, this card would be revealed next
        result.appendleft(card)

    # Convert deque back to list for the final result
    return list(result)
```

```javascript
// Time: O(n log n) | Space: O(n)
function deckRevealedIncreasing(deck) {
  /**
   * Reconstructs the initial deck order so that when cards are revealed
   * (top card revealed, next card moved to bottom), they appear in increasing order.
   */

  // Step 1: Sort the deck to get the desired reveal order
  deck.sort((a, b) => a - b);

  // Step 2: Initialize a deque (using array) to build the result
  const result = [];

  // Step 3: Process cards from largest to smallest
  for (let i = deck.length - 1; i >= 0; i--) {
    const card = deck[i];

    // If result is not empty, simulate reverse of "move to bottom"
    if (result.length > 0) {
      // Move the last card to the front
      // This is the reverse operation of moving top card to bottom
      const lastCard = result.pop();
      result.unshift(lastCard);
    }

    // Add the current card to the front
    result.unshift(card);
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] deckRevealedIncreasing(int[] deck) {
        /**
         * Reconstructs the initial deck order so that when cards are revealed
         * (top card revealed, next card moved to bottom), they appear in increasing order.
         */

        // Step 1: Sort the deck to get the desired reveal order
        Arrays.sort(deck);

        // Step 2: Use a deque to build the result
        Deque<Integer> deque = new ArrayDeque<>();

        // Step 3: Process cards from largest to smallest
        for (int i = deck.length - 1; i >= 0; i--) {
            int card = deck[i];

            // If deque is not empty, simulate reverse of "move to bottom"
            if (!deque.isEmpty()) {
                // Move the last card to the front
                // This reverses the "move next card to bottom" operation
                int lastCard = deque.removeLast();
                deque.addFirst(lastCard);
            }

            // Add the current card to the front
            deque.addFirst(card);
        }

        // Convert deque to array for the result
        int[] result = new int[deck.length];
        int index = 0;
        for (int card : deque) {
            result[index++] = card;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the deck takes O(n log n) time
- The reverse simulation loop runs O(n) times
- Each deque operation (pop/appendleft or equivalent) is O(1)
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- We need O(n) space for the sorted deck (if not sorting in-place)
- The deque uses O(n) space to store the result
- Total: O(n) additional space

## Common Mistakes

1. **Simulating forward instead of backward**: Many candidates try to simulate the reveal process forward by starting with a random arrangement and adjusting. This doesn't work because we don't know where to start. The key insight is working backwards from the known reveal order.

2. **Wrong deque operations order**: When processing in reverse, you must:
   - First move the bottom card to the top (if deque not empty)
   - Then add the new card to the top
     Doing these in the wrong order produces incorrect results.

3. **Forgetting to sort**: The problem states cards should be revealed in increasing order, so we must sort first. Without sorting, we can't determine the correct reveal sequence.

4. **Using inefficient data structures**: Using a regular list/array instead of a deque makes the "move bottom to top" operation O(n) instead of O(1), making the overall solution O(n²) instead of O(n log n).

## When You'll See This Pattern

This "reverse simulation" pattern appears in problems where you know the final state and need to reconstruct the initial state:

1. **950. Reveal Cards In Increasing Order** (this problem) - Reconstruct deck from reveal order
2. **1700. Number of Students Unable to Eat Lunch** - Similar queue simulation with moving elements
3. **2073. Time Needed to Buy Tickets** - Queue simulation with conditional operations
4. **649. Dota2 Senate** - Circular elimination simulation

The core technique is recognizing when working backwards from the known outcome is easier than working forwards from an unknown starting point. This often involves queue/deque operations and understanding the inverse of the given process.

## Key Takeaways

1. **When you know the output order, work backwards**: If a problem describes a process that transforms input to output, and you know what the output should be, try reversing the process to find the required input.

2. **Deques are ideal for circular/rotation operations**: When you need efficient operations at both ends of a sequence (like moving cards from bottom to top), use a deque instead of a list.

3. **Sorting often reveals structure**: Many array manipulation problems become clearer when you sort the input first. The sorted order often represents a desired final state or reveals a pattern.

[Practice this problem on CodeJeet](/problem/reveal-cards-in-increasing-order)
