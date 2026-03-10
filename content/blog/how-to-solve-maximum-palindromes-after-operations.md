---
title: "How to Solve Maximum Palindromes After Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Palindromes After Operations. Medium difficulty, 45.6% acceptance rate. Topics: Array, Hash Table, String, Greedy, Sorting."
date: "2029-10-27"
category: "dsa-patterns"
tags: ["maximum-palindromes-after-operations", "array", "hash-table", "string", "medium"]
---

# How to Solve Maximum Palindromes After Operations

This problem asks us to maximize the number of palindromes we can form from an array of strings by repeatedly swapping characters between any two strings at any positions. The tricky part is that we can swap characters arbitrarily many times, which essentially means we can rearrange all characters across all strings freely. The challenge is determining how many complete palindromes we can construct from this global pool of characters.

## Visual Walkthrough

Let's trace through a concrete example: `words = ["ab", "ba", "cd"]`

**Step 1: Understand what operations allow**
We can swap any character from any position in any string with any character from any position in any other string. This means after enough operations, we can rearrange all characters across all strings however we want.

**Step 2: Count all characters**

- String "ab": a=1, b=1
- String "ba": a=1, b=1
- String "cd": c=1, d=1
  Total: a=2, b=2, c=1, d=1

**Step 3: Determine palindrome construction rules**
A palindrome can be formed if:

1. All characters except possibly one have even counts (for the symmetric pairs)
2. The odd-count character goes in the middle

From our character counts:

- a: 2 (even) → can form 1 pair
- b: 2 (even) → can form 1 pair
- c: 1 (odd) → can be middle character
- d: 1 (odd) → can be middle character

**Step 4: Calculate maximum palindromes**
Each palindrome needs:

- Some number of character pairs (even counts)
- At most one middle character (odd count)

We have:

- Total pairs available: (2 + 2) / 2 = 2 pairs
- Total odd characters: 2 (c and d)

We can form:

- Palindrome 1: Use 2 pairs (e.g., "abba") → no middle needed
- Palindrome 2: Use the 2 odd characters? Wait, each palindrome can only use ONE odd character at most.

Actually, let's think differently: Each palindrome needs pairs. With 2 pairs total, we can make at most 2 palindromes if we had enough middle characters. But we only have 2 odd characters, so we can make 2 palindromes:

- Palindrome 1: "abcba" (pairs: a,b + middle c)
- Palindrome 2: "badab" (pairs: a,b + middle d)

But wait, we used 2 pairs for each? No, that's 4 pairs total but we only have 2. Let's recalculate properly...

**Correct approach:**
Total character pairs = sum(even_counts) / 2 + sum(odd_counts // 2)

- a:2 → 1 pair
- b:2 → 1 pair
- c:1 → 0 pairs (1//2 = 0)
- d:1 → 0 pairs
  Total pairs = 2

Odd characters remaining after using them for pairs:

- c:1 → 1 odd remaining
- d:1 → 1 odd remaining
  Total odd = 2

Each palindrome needs some pairs + at most 1 odd character.
With 2 pairs and 2 odd characters, we can make:

- Option 1: 2 palindromes (1 pair + 1 odd each)
- Option 2: 1 palindrome (2 pairs + 0 or 1 odd)

Maximum is 2 palindromes.

## Brute Force Approach

A brute force approach would try all possible rearrangements of characters across all strings to form palindromes. This is clearly infeasible because:

1. We have n strings with varying lengths
2. We'd need to consider all permutations of character assignments
3. We'd need to check all ways to group characters into palindromes

The search space grows factorially with the total number of characters, making any brute force solution impractical for the constraints (n up to 10^5, total characters up to 10^5).

## Optimized Approach

The key insight is that since we can swap characters arbitrarily, we don't care which string originally contained which characters. We only care about the global count of each character across all strings.

**Step-by-step reasoning:**

1. **Character Counting**: Count all characters across all strings. Since we can rearrange freely, only the total counts matter.

2. **Palindrome Requirements**: A palindrome needs:
   - Character pairs for the symmetric positions
   - At most one "middle" character with odd count

3. **Calculate Available Resources**:
   - Each character with count `c` contributes `c // 2` pairs (integer division)
   - After taking pairs, each character has `c % 2` leftover (0 or 1)
   - Total pairs = sum of all `c // 2`
   - Total odd characters = sum of all `c % 2`

4. **Maximize Palindrome Count**:
   - Each palindrome needs at least one pair (minimum length 2)
   - Each palindrome can use at most one odd character
   - If we have `p` pairs and `o` odd characters:
     - We can make at most `p` palindromes (using 1 pair each)
     - But we're limited by odd characters: each palindrome needs at most 1 odd
     - So maximum = min(p, o) if o > 0? Not quite...

   Actually, consider:
   - If we have more pairs than odd characters: We can make `o` palindromes (using 1 odd each) + some palindromes without odds
   - If we have more odd characters than pairs: We can make `p` palindromes (using 1 pair each)

   Wait, let's derive the formula properly...

**Correct Formula Derivation**:
Let `pairs = total_pairs`, `odds = total_odd_chars`

Each palindrome needs:

- At least 1 pair (2 characters minimum)
- At most 1 odd character

Case analysis:

1. If `pairs >= odds`: We can assign one odd to each palindrome until odds run out, then use remaining pairs to make palindromes without odds.
   - Number of palindromes = odds + (pairs - odds) // 2? No, that's not right...

   Actually: Each palindrome with an odd uses 1 pair + 1 odd. Each palindrome without odd uses at least 1 pair.
   So maximum = min(odds, pairs) + (pairs - min(odds, pairs)) // 2?

   Let's test: pairs=5, odds=2
   - Make 2 palindromes with odds: uses 2 pairs, 2 odds
   - Remaining: 3 pairs, 0 odds
   - Can make floor(3/2) = 1 more palindrome (needs 2 pairs)
   - Total: 3 palindromes

   Formula: odds + (pairs - odds) // 2 = 2 + (5-2)//2 = 2 + 1 = 3 ✓

2. If `pairs < odds`: We can only make `pairs` palindromes (each needs at least 1 pair)
   - We'll use `pairs` odds (one per palindrome)
   - Remaining odds unused
   - Total = pairs

So formula: `min(odds, pairs) + max(0, pairs - odds) // 2` when pairs >= odds
Actually simpler: The maximum is `pairs` when `pairs <= odds`, otherwise it's `odds + (pairs - odds) // 2`

Wait, check pairs=2, odds=4: formula gives min(4,2) + max(0,2-4)//2 = 2 + 0 = 2 ✓

Actually, there's an even cleaner way: Each palindrome needs at least 2 characters (1 pair). So with `p` pairs total, maximum palindromes is at most `p`. But if we have many odds, we might not reach `p` because each palindrome can only use one odd.

Let `x` = number of palindromes we make.
Each palindrome uses at least 1 pair, so `x <= pairs`.
Each palindrome can use at most 1 odd, so `x <= odds + (pairs - x)`? This is getting messy.

**Simpler thinking**:
We need to distribute `pairs` pairs and `odds` odds into `x` palindromes where:

1. Each palindrome gets ≥ 1 pair
2. Each palindrome gets ≤ 1 odd

So `x <= pairs` and `x <= odds + floor((pairs - x) / 1)`? No...

Actually, the known solution: maximum = `pairs + min(1, odds)`? Let me check with examples...

Test cases:

1. pairs=0, odds=0 → 0 palindromes
2. pairs=1, odds=0 → 0 palindromes (need at least 2 pairs for palindrome without odd)
3. pairs=1, odds=1 → 1 palindrome ("aa" with middle 'b'? No, that's 1 pair + 1 odd = 2 chars)
4. pairs=2, odds=0 → 1 palindrome (needs 2 pairs, like "abba")

I think I've been overcomplicating. Let me look at the actual known solution...

The correct formula is actually simpler than I've been making it. Since we can always put an odd character in the middle, the limiting factor is the number of pairs. Each palindrome needs at least one pair. So maximum is at most `pairs`.

But what if we have fewer odds than pairs? We can still make palindromes without middle characters (even-length palindromes). So actually, the number of odds doesn't limit us except... wait, if we have 0 odds and 1 pair, we can't make a palindrome (needs at least 2 pairs for even-length).

Actually, the known solution:

- Let `pairs` = total pairs available
- Let `odds` = total odd characters
- Answer = `pairs + (1 if odds > 0 else 0)`? No, that's not right for pairs=1, odds=1.

Let me derive properly...

Each palindrome needs:

- Option A (odd length): 1+ pairs and 1 odd (e.g., "aba" has 1 pair + 1 odd)
- Option B (even length): 2+ pairs and 0 odds (e.g., "abba" has 2 pairs)

So with `p` pairs and `o` odds:

- We can make at most `o` palindromes of type A (if `p >= o`)
- After that, we have `p - o` pairs left for type B palindromes
- Each type B needs at least 2 pairs, so we can make `(p - o) // 2` more

Thus: if `p >= o`, answer = `o + (p - o) // 2`
If `p < o`, answer = `p` (use all pairs for type A palindromes)

So formula: `min(p, o) + max(0, p - o) // 2` when `p >= o`, else `p`

Actually, `min(p, o) + max(0, p - o) // 2` works for all cases!

Check:

- p=2, o=4: min(2,4)=2, max(0,2-4)//2=0 → 2 ✓
- p=5, o=2: min(5,2)=2, max(0,5-2)//2=3//2=1 → 3 ✓
- p=1, o=1: min(1,1)=1, max(0,1-1)//2=0 → 1 ✓
- p=1, o=0: min(1,0)=0, max(0,1-0)//2=1//2=0 → 0 ✓ (can't make palindrome with 1 pair and no odd)
- p=2, o=0: min(2,0)=0, max(0,2-0)//2=2//2=1 → 1 ✓ ("abba")

Perfect!

## Optimal Solution

<div class="code-group">

```python
# Time: O(N * L) where N = len(words), L = avg word length
# Space: O(1) for the character count array (fixed size 26)
def maxPalindromesAfterOperations(words):
    """
    Calculate maximum number of palindromes that can be formed
    by rearranging characters across all words.
    """
    # Step 1: Count all characters across all words
    char_count = [0] * 26  # 26 lowercase letters

    for word in words:
        for ch in word:
            # Convert character to index 0-25
            char_count[ord(ch) - ord('a')] += 1

    # Step 2: Calculate total pairs and odd characters
    total_pairs = 0
    total_odds = 0

    for count in char_count:
        # Each character contributes count // 2 pairs
        total_pairs += count // 2
        # After taking pairs, remainder is 0 or 1
        total_odds += count % 2

    # Step 3: Calculate maximum palindromes using derived formula
    # Formula: min(pairs, odds) + max(0, pairs - odds) // 2
    # This covers all cases:
    # - If pairs <= odds: we can make 'pairs' palindromes (each with 1 pair + 1 odd)
    # - If pairs > odds: we make 'odds' palindromes with odds, then use remaining
    #   pairs to make palindromes without odds (needing 2 pairs each)
    return min(total_pairs, total_odds) + max(0, total_pairs - total_odds) // 2
```

```javascript
// Time: O(N * L) where N = words.length, L = avg word length
// Space: O(1) for the character count array (fixed size 26)
function maxPalindromesAfterOperations(words) {
  /**
   * Calculate maximum number of palindromes that can be formed
   * by rearranging characters across all words.
   */
  // Step 1: Count all characters across all words
  const charCount = new Array(26).fill(0); // 26 lowercase letters

  for (const word of words) {
    for (const ch of word) {
      // Convert character to index 0-25
      charCount[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
    }
  }

  // Step 2: Calculate total pairs and odd characters
  let totalPairs = 0;
  let totalOdds = 0;

  for (const count of charCount) {
    // Each character contributes Math.floor(count / 2) pairs
    totalPairs += Math.floor(count / 2);
    // After taking pairs, remainder is 0 or 1
    totalOdds += count % 2;
  }

  // Step 3: Calculate maximum palindromes using derived formula
  // Formula: min(pairs, odds) + max(0, pairs - odds) // 2
  // This covers all cases:
  // - If pairs <= odds: we can make 'pairs' palindromes (each with 1 pair + 1 odd)
  // - If pairs > odds: we make 'odds' palindromes with odds, then use remaining
  //   pairs to make palindromes without odds (needing 2 pairs each)
  return Math.min(totalPairs, totalOdds) + Math.max(0, Math.floor((totalPairs - totalOdds) / 2));
}
```

```java
// Time: O(N * L) where N = words.length, L = avg word length
// Space: O(1) for the character count array (fixed size 26)
class Solution {
    public int maxPalindromesAfterOperations(String[] words) {
        /**
         * Calculate maximum number of palindromes that can be formed
         * by rearranging characters across all words.
         */
        // Step 1: Count all characters across all words
        int[] charCount = new int[26]; // 26 lowercase letters

        for (String word : words) {
            for (char ch : word.toCharArray()) {
                // Convert character to index 0-25
                charCount[ch - 'a']++;
            }
        }

        // Step 2: Calculate total pairs and odd characters
        int totalPairs = 0;
        int totalOdds = 0;

        for (int count : charCount) {
            // Each character contributes count / 2 pairs
            totalPairs += count / 2;
            // After taking pairs, remainder is 0 or 1
            totalOdds += count % 2;
        }

        // Step 3: Calculate maximum palindromes using derived formula
        // Formula: min(pairs, odds) + max(0, pairs - odds) / 2
        // This covers all cases:
        // - If pairs <= odds: we can make 'pairs' palindromes (each with 1 pair + 1 odd)
        // - If pairs > odds: we make 'odds' palindromes with odds, then use remaining
        //   pairs to make palindromes without odds (needing 2 pairs each)
        return Math.min(totalPairs, totalOdds) + Math.max(0, (totalPairs - totalOdds) / 2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(T) where T is the total number of characters across all words. We iterate through each character once to count frequencies, then iterate through the 26-character frequency array to calculate pairs and odds.

**Space Complexity**: O(1) since we use a fixed-size array of 26 integers to count characters, regardless of input size. The input itself is not counted toward space complexity per typical interview conventions.

## Common Mistakes

1. **Forgetting that swaps are unlimited**: Some candidates try to track which characters are in which string, not realizing that unlimited swaps mean we can treat all characters as a single pool.

2. **Incorrect palindrome counting formula**: The most common error is not deriving the correct formula for maximum palindromes. Candidates might try:
   - `total_pairs + (1 if total_odds > 0 else 0)` - wrong, doesn't handle cases like 1 pair, 1 odd
   - `min(total_pairs, total_odds)` - wrong, doesn't use excess pairs
   - `total_pairs // 2` - wrong, doesn't account for odd characters enabling more palindromes

3. **Off-by-one in pair calculation**: Using `(count - 1) // 2` instead of `count // 2` for pairs, or similar integer division errors.

4. **Not handling the "no palindrome possible" case**: When `total_pairs = 0`, answer should be 0 regardless of `total_odds`. A single odd character cannot form a palindrome alone.

## When You'll See This Pattern

This problem combines character frequency counting with combinatorial optimization, a pattern seen in:

1. **Valid Palindrome (Easy)**: While simpler, it introduces the concept that palindromes have symmetric character counts.

2. **Longest Palindrome (Easy)**: Asks for the longest palindrome that can be built from a string's characters - uses similar character counting and pair calculation.

3. **Palindrome Pairs (Hard)**: More complex but builds on understanding palindrome properties.

4. **Rearrange Characters to Make Palindrome (variations)**: Many problems involve rearranging characters to form palindromes or maximize palindrome-related properties.

The core technique is: when you can rearrange freely, only character frequencies matter, not their original positions.

## Key Takeaways

1. **Unlimited swaps = global pool**: When operations allow unlimited character swaps/rearrangements, you can ignore original positions and work with aggregate character counts.

2. **Palindrome = pairs + optional middle**: A palindrome requires character pairs for symmetry and at most one odd-count character for the middle.

3. **Combinatorial optimization with constraints**: The solution involves distributing limited resources (pairs and odds) to maximize count subject to constraints (each palindrome needs ≥1 pair and ≤1 odd).

4. **Derive formulas systematically**: Don't guess the formula - derive it from constraints:
   - Let x = number of palindromes
   - Each needs ≥1 pair: x ≤ pairs
   - Each needs ≤1 odd: x ≤ odds + remaining_pairs? Actually, think in terms of constructing palindromes step by step.

Related problems: [Valid Palindrome](/problem/valid-palindrome), [Longest Palindrome](/problem/longest-palindrome)
