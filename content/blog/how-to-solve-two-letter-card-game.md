---
title: "How to Solve Two-Letter Card Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Two-Letter Card Game. Medium difficulty, 12.2% acceptance rate. Topics: Array, Hash Table, String, Counting, Enumeration."
date: "2026-05-22"
category: "dsa-patterns"
tags: ["two-letter-card-game", "array", "hash-table", "string", "medium"]
---

## How to Solve Two-Letter Card Game

This problem presents a card game where you need to pair compatible cards to earn points. Each card shows two lowercase letters, and two cards are compatible if they share exactly one letter. You're given a target letter `x`, and when you find compatible cards, you earn points equal to the number of times `x` appears across both cards. The challenge lies in efficiently counting all possible compatible pairs while tracking the appearances of the target letter.

What makes this problem interesting is that it combines combinatorial counting with careful character frequency tracking. A brute force approach would be too slow for large decks, requiring us to think about how to count compatible pairs without explicitly checking every possible pair.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
cards = ["ab", "ac", "bc", "bd"]
x = "a"
```

**Step 1: Understanding compatibility**

- "ab" and "ac" share exactly one letter ("a") → compatible
- "ab" and "bc" share exactly one letter ("b") → compatible
- "ab" and "bd" share exactly one letter ("b") → compatible
- "ac" and "bc" share exactly one letter ("c") → compatible
- "ac" and "bd" share no letters → not compatible
- "bc" and "bd" share exactly one letter ("b") → compatible

**Step 2: Counting points for each compatible pair**

- Pair ("ab", "ac"): "a" appears in both cards → 2 points
- Pair ("ab", "bc"): "a" appears only in first card → 1 point
- Pair ("ab", "bd"): "a" appears only in first card → 1 point
- Pair ("ac", "bc"): "a" appears only in first card → 1 point
- Pair ("bc", "bd"): "a" doesn't appear in either → 0 points

**Total points:** 2 + 1 + 1 + 1 + 0 = 5

The key insight is that we don't need to check every pair explicitly. Instead, we can categorize cards by their letters and count compatible combinations mathematically.

## Brute Force Approach

The most straightforward solution is to check every possible pair of cards:

1. For each card i from 0 to n-1
2. For each card j from i+1 to n-1
3. Check if cards[i] and cards[j] share exactly one letter
4. If yes, count how many times x appears in both cards and add to total

This approach has O(n²) time complexity, which becomes impractical when n is large (up to 10⁵ in constraints). For n=10⁵, we'd need to check about 5 billion pairs, which is far too slow.

## Optimized Approach

The key insight is that two cards are compatible in exactly three scenarios:

1. They share the first letter but have different second letters
2. They share the second letter but have different first letters
3. They have the same two letters but in opposite order (e.g., "ab" and "ba")

We can use hash maps to count cards efficiently:

- `firstCount[letter]`: number of cards where this letter is in first position
- `secondCount[letter]`: number of cards where this letter is in second position
- `cardCount[card]`: number of occurrences of each specific card

For compatibility case 1 (share first letter):

- If we have a card "ab", it's compatible with all cards starting with "a" that don't end with "b"
- So count = `firstCount[a] - cardCount["ab"]`

For compatibility case 2 (share second letter):

- If we have a card "ab", it's compatible with all cards ending with "b" that don't start with "a"
- So count = `secondCount[b] - cardCount["ab"]`

For compatibility case 3 (opposite order):

- If we have a card "ab", it's compatible with cards "ba"
- So count = `cardCount["ba"]`

We also need to track points contributed by each compatible pair:

- If x equals the shared letter, both cards contribute points
- If x doesn't equal the shared letter, only cards containing x contribute points

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def solve(cards, x):
    """
    Calculate maximum points in the two-letter card game.

    Args:
        cards: List of strings, each with two lowercase letters
        x: Target letter to count points for

    Returns:
        Total points earned from all compatible pairs
    """
    from collections import defaultdict

    # Step 1: Initialize frequency counters
    first_count = defaultdict(int)  # Count of cards where letter is first
    second_count = defaultdict(int) # Count of cards where letter is second
    card_count = defaultdict(int)   # Count of each specific card

    # Step 2: Count frequencies
    for card in cards:
        a, b = card[0], card[1]
        first_count[a] += 1
        second_count[b] += 1
        card_count[card] += 1

    total_points = 0

    # Step 3: Process each unique card
    for card in card_count:
        a, b = card[0], card[1]
        count = card_count[card]  # How many times this card appears

        # Case 1: Cards sharing first letter 'a'
        # All cards starting with 'a' except this exact card
        compatible_count = first_count[a] - count

        # Calculate points for these compatible pairs
        if a == x:
            # If shared letter is x, both cards in pair contain x
            # Each compatible pair contributes 2 points
            points = 2 * compatible_count
        else:
            # Only cards containing x contribute points
            # Count how many of the compatible cards contain x
            points = 0
            # We need to consider that compatible cards might be "ax" or "xa"
            # where x could be in either position
            # For cards starting with 'a', x could be in second position
            if b == x:
                # Current card contains x in second position
                # All compatible cards contribute 1 point each
                points = compatible_count

        total_points += points * count  # Multiply by count of current card

        # Case 2: Cards sharing second letter 'b'
        # All cards ending with 'b' except this exact card
        compatible_count = second_count[b] - count

        # Calculate points for these compatible pairs
        if b == x:
            # If shared letter is x, both cards contain x
            points = 2 * compatible_count
        else:
            # Only cards containing x contribute points
            points = 0
            if a == x:
                # Current card contains x in first position
                points = compatible_count

        total_points += points * count

        # Case 3: Cards with opposite letters "ba"
        # Check if reverse card exists
        reverse_card = b + a
        if reverse_card in card_count and reverse_card != card:
            compatible_count = card_count[reverse_card]

            # For opposite cards, they share both letters but in different order
            # They're compatible but don't share a single letter in the same position
            # Actually, they share both letters but in swapped positions
            # According to rules, they're compatible if they share exactly one letter
            # "ab" and "ba" share both letters, so they're NOT compatible
            # Wait, let me re-examine the compatibility rule...

            # Actually, "ab" and "ba" share both letters 'a' and 'b'
            # So they share more than one letter - they're NOT compatible
            # We should skip this case
            pass

    # Step 4: We've counted each pair twice (once from each side)
    # So divide by 2 to get the correct total
    return total_points // 2
```

```javascript
// Time: O(n) | Space: O(n)
function solve(cards, x) {
  /**
   * Calculate maximum points in the two-letter card game.
   *
   * @param {string[]} cards - Array of two-letter strings
   * @param {string} x - Target letter to count points for
   * @return {number} Total points earned from all compatible pairs
   */

  // Step 1: Initialize frequency counters
  const firstCount = new Map(); // Count of cards where letter is first
  const secondCount = new Map(); // Count of cards where letter is second
  const cardCount = new Map(); // Count of each specific card

  // Step 2: Count frequencies
  for (const card of cards) {
    const a = card[0];
    const b = card[1];

    // Update first letter count
    firstCount.set(a, (firstCount.get(a) || 0) + 1);

    // Update second letter count
    secondCount.set(b, (secondCount.get(b) || 0) + 1);

    // Update specific card count
    cardCount.set(card, (cardCount.get(card) || 0) + 1);
  }

  let totalPoints = 0;

  // Step 3: Process each unique card
  for (const [card, count] of cardCount.entries()) {
    const a = card[0];
    const b = card[1];

    // Case 1: Cards sharing first letter 'a'
    // All cards starting with 'a' except this exact card
    const firstCompatible = (firstCount.get(a) || 0) - count;

    // Calculate points for these compatible pairs
    let points;
    if (a === x) {
      // If shared letter is x, both cards in pair contain x
      points = 2 * firstCompatible;
    } else {
      // Only cards containing x contribute points
      points = 0;
      if (b === x) {
        // Current card contains x in second position
        points = firstCompatible;
      }
    }
    totalPoints += points * count;

    // Case 2: Cards sharing second letter 'b'
    // All cards ending with 'b' except this exact card
    const secondCompatible = (secondCount.get(b) || 0) - count;

    // Calculate points for these compatible pairs
    if (b === x) {
      // If shared letter is x, both cards contain x
      points = 2 * secondCompatible;
    } else {
      // Only cards containing x contribute points
      points = 0;
      if (a === x) {
        // Current card contains x in first position
        points = secondCompatible;
      }
    }
    totalPoints += points * count;

    // Note: Cards with opposite letters ("ab" and "ba") share both letters,
    // so they're NOT compatible (need exactly one shared letter)
  }

  // Step 4: We've counted each pair twice (once from each side)
  return totalPoints / 2;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int solve(String[] cards, char x) {
        /**
         * Calculate maximum points in the two-letter card game.
         *
         * @param cards Array of two-letter strings
         * @param x Target letter to count points for
         * @return Total points earned from all compatible pairs
         */

        // Step 1: Initialize frequency counters
        Map<Character, Integer> firstCount = new HashMap<>();
        Map<Character, Integer> secondCount = new HashMap<>();
        Map<String, Integer> cardCount = new HashMap<>();

        // Step 2: Count frequencies
        for (String card : cards) {
            char a = card.charAt(0);
            char b = card.charAt(1);

            // Update first letter count
            firstCount.put(a, firstCount.getOrDefault(a, 0) + 1);

            // Update second letter count
            secondCount.put(b, secondCount.getOrDefault(b, 0) + 1);

            // Update specific card count
            cardCount.put(card, cardCount.getOrDefault(card, 0) + 1);
        }

        int totalPoints = 0;

        // Step 3: Process each unique card
        for (Map.Entry<String, Integer> entry : cardCount.entrySet()) {
            String card = entry.getKey();
            int count = entry.getValue();
            char a = card.charAt(0);
            char b = card.charAt(1);

            // Case 1: Cards sharing first letter 'a'
            // All cards starting with 'a' except this exact card
            int firstCompatible = firstCount.getOrDefault(a, 0) - count;

            // Calculate points for these compatible pairs
            int points;
            if (a == x) {
                // If shared letter is x, both cards in pair contain x
                points = 2 * firstCompatible;
            } else {
                // Only cards containing x contribute points
                points = 0;
                if (b == x) {
                    // Current card contains x in second position
                    points = firstCompatible;
                }
            }
            totalPoints += points * count;

            // Case 2: Cards sharing second letter 'b'
            // All cards ending with 'b' except this exact card
            int secondCompatible = secondCount.getOrDefault(b, 0) - count;

            // Calculate points for these compatible pairs
            if (b == x) {
                // If shared letter is x, both cards contain x
                points = 2 * secondCompatible;
            } else {
                // Only cards containing x contribute points
                points = 0;
                if (a == x) {
                    // Current card contains x in first position
                    points = secondCompatible;
                }
            }
            totalPoints += points * count;

            // Note: Cards with opposite letters ("ab" and "ba") share both letters,
            // so they're NOT compatible (need exactly one shared letter)
        }

        // Step 4: We've counted each pair twice (once from each side)
        return totalPoints / 2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make a single pass through the cards to build frequency maps: O(n)
- We then process each unique card: O(u) where u ≤ n
- In worst case, all cards are unique, so O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity:** O(n)

- We store three hash maps:
  - `firstCount`: at most 26 entries (letters a-z)
  - `secondCount`: at most 26 entries (letters a-z)
  - `cardCount`: at most n entries (each unique card)
- Total space: O(n) for the cardCount map dominates

## Common Mistakes

1. **Double counting pairs**: Forgetting to divide by 2 at the end since each compatible pair is counted twice (once from each card's perspective). Always check if your counting method counts (A,B) and (B,A) as separate pairs.

2. **Incorrect compatibility check for reversed cards**: Thinking "ab" and "ba" are compatible. They share both letters 'a' and 'b', so they don't satisfy "share exactly one letter." They share two letters (just in different positions).

3. **Missing the case where x appears in non-shared position**: When cards share letter 'a' and x='b', if one card is "ab" and the other is "ac", only "ab" contributes a point. Many candidates forget that x can be in the non-shared position.

4. **Not handling duplicate cards correctly**: When subtracting to avoid pairing a card with itself, you need to subtract the count of that exact card, not just 1. If you have 3 copies of "ab", each can pair with the other 2 copies.

## When You'll See This Pattern

This problem uses **frequency counting with combinatorial mathematics**, a pattern common in problems where you need to count pairs satisfying certain conditions without checking all pairs explicitly.

Related LeetCode problems:

1. **Two Sum** - Uses hash maps to find complementary pairs efficiently
2. **Count Nice Pairs in an Array** - Requires counting pairs based on transformed values
3. **Number of Good Pairs** - Counts pairs where nums[i] == nums[j] and i < j, using frequency counting

The core technique is recognizing that instead of O(n²) pair checking, you can use frequency maps to calculate the number of valid pairs mathematically.

## Key Takeaways

1. **When you need to count compatible/valid pairs**, consider using frequency maps to calculate counts mathematically rather than checking each pair explicitly.

2. **For problems with small alphabets** (like 26 lowercase letters), hash maps with character keys are very efficient and have effectively constant-time operations.

3. **Always consider duplicate elements carefully** - when counting pairs involving an element with multiple copies, multiply by the count to account for all combinations.

[Practice this problem on CodeJeet](/problem/two-letter-card-game)
