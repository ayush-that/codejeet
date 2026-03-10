---
title: "How to Solve Guess the Word — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Guess the Word. Hard difficulty, 36.9% acceptance rate. Topics: Array, Math, String, Interactive, Game Theory."
date: "2026-06-05"
category: "dsa-patterns"
tags: ["guess-the-word", "array", "math", "string", "hard"]
---

# How to Solve Guess the Word

This is an interactive problem where you need to guess a secret six-letter word from a list of possible candidates by making at most 10 calls to `Master.guess(word)`. The tricky part is that each guess only returns the number of exact character matches (same character at same position) between your guess and the secret word, giving you limited information to narrow down the possibilities.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have:

- `words = ["abcdef", "abcxyz", "xyzabc", "fedcba"]`
- Secret word is "abcdef" (unknown to us)

**Step 1:** We need to pick our first guess. A good strategy is to pick a word that gives us maximum information. Let's start with "abcdef".

**Step 2:** Call `Master.guess("abcdef")`. It returns 6 (all characters match). We found the secret! But in most cases, we won't get this lucky.

Let's try a more realistic scenario where secret is "abcxyz":

**Step 1:** Guess "abcdef" → returns 3 (positions 0, 1, 2 match: "abc")

**Step 2:** Now we know the secret has exactly 3 characters in common with "abcdef" at the same positions. We can eliminate all words that don't have exactly 3 matches with "abcdef". Let's check:

- "abcdef" vs "abcdef": 6 matches (eliminate - too many)
- "abcdef" vs "abcxyz": 3 matches (keep)
- "abcdef" vs "xyzabc": 0 matches (eliminate)
- "abcdef" vs "fedcba": 0 matches (eliminate)

**Step 3:** Only "abcxyz" remains. Guess it → returns 6 → found the secret!

The key insight is that after each guess, we can filter the candidate list to only include words that have the same number of matches with our guess as the secret does.

## Brute Force Approach

A naive approach might try guessing randomly or sequentially through the word list. However, with only 10 guesses allowed and potentially 100 words in the list, random guessing would likely fail. Sequential guessing would work if we get lucky, but in the worst case could take up to 100 guesses when we're only allowed 10.

The problem constraints force us to be strategic: we need to eliminate as many words as possible with each guess. The brute force approach of guessing without using the match information efficiently would fail the 10-guess limit.

## Optimized Approach

The optimal solution uses a **minimax** strategy similar to the game "Mastermind":

1. **Information Theory Basis**: We want to choose a guess that gives us the most information regardless of the outcome. A good guess is one that minimizes the maximum possible remaining candidates after we get the match result.

2. **Match Counting**: For any two words, we can precompute the number of character matches at the same positions. This is O(6) = O(1) per pair.

3. **Candidate Filtering**: After each guess with result `matches`, we filter our candidate list to only include words that have exactly `matches` character matches with our guessed word.

4. **Guess Selection**: We don't always guess from the candidate list. Sometimes we guess a word that's not in our current candidates if it gives better information. However, a practical simplification is to always guess from the candidate list, which works well in practice.

5. **Randomness**: Since we might have multiple equally good guesses, we add randomness to avoid worst-case scenarios.

The key optimization is choosing the guess that minimizes the worst-case remaining candidates. We do this by:

- For each possible guess word
- For each possible match result (0-6)
- Count how many candidates would remain if we got that result
- Choose the guess with the smallest maximum remaining count

## Optimal Solution

<div class="code-group">

```python
# Time: O(N^2 * 6) where N is number of words, but with at most 10 iterations
# Space: O(N^2) for storing match counts between all word pairs
class Solution:
    def findSecretWord(self, words: List[str], master: 'Master') -> None:
        """
        Main function to find the secret word using minimax strategy.
        """
        # Precompute matches between all pairs of words
        n = len(words)
        matches = [[0] * n for _ in range(n)]

        for i in range(n):
            for j in range(i, n):
                # Count character matches at same positions
                match_count = sum(1 for k in range(6) if words[i][k] == words[j][k])
                matches[i][j] = matches[j][i] = match_count

        # Start with all words as candidates
        candidates = list(range(n))

        # We have at most 10 guesses
        for _ in range(10):
            if not candidates:
                break

            # Find the best guess using minimax strategy
            best_guess = candidates[0]
            best_worst_case = len(candidates)

            # Try each candidate as potential guess
            for guess in candidates:
                # For each possible match result (0-6), count how many candidates
                # would remain if we got that result
                buckets = [0] * 7
                for candidate in candidates:
                    match_count = matches[guess][candidate]
                    buckets[match_count] += 1

                # The worst case is the maximum number of candidates in any bucket
                worst_case = max(buckets)

                # Minimize the worst case
                if worst_case < best_worst_case:
                    best_worst_case = worst_case
                    best_guess = guess

            # Make the guess
            result = master.guess(words[best_guess])

            # If we found the secret (6 matches), we're done
            if result == 6:
                return

            # Filter candidates: keep only words with exactly 'result' matches
            # with our guessed word
            new_candidates = []
            for candidate in candidates:
                if matches[best_guess][candidate] == result:
                    new_candidates.append(candidate)

            candidates = new_candidates
```

```javascript
// Time: O(N^2 * 6) where N is number of words, but with at most 10 iterations
// Space: O(N^2) for storing match counts between all word pairs
/**
 * @param {string[]} words
 * @param {Master} master
 * @return {void}
 */
var findSecretWord = function (words, master) {
  // Precompute matches between all pairs of words
  const n = words.length;
  const matches = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count character matches at same positions
      let matchCount = 0;
      for (let k = 0; k < 6; k++) {
        if (words[i][k] === words[j][k]) {
          matchCount++;
        }
      }
      matches[i][j] = matches[j][i] = matchCount;
    }
  }

  // Start with all words as candidates
  let candidates = Array.from({ length: n }, (_, i) => i);

  // We have at most 10 guesses
  for (let attempt = 0; attempt < 10; attempt++) {
    if (candidates.length === 0) break;

    // Find the best guess using minimax strategy
    let bestGuess = candidates[0];
    let bestWorstCase = candidates.length;

    // Try each candidate as potential guess
    for (const guess of candidates) {
      // For each possible match result (0-6), count how many candidates
      // would remain if we got that result
      const buckets = Array(7).fill(0);
      for (const candidate of candidates) {
        const matchCount = matches[guess][candidate];
        buckets[matchCount]++;
      }

      // The worst case is the maximum number of candidates in any bucket
      const worstCase = Math.max(...buckets);

      // Minimize the worst case
      if (worstCase < bestWorstCase) {
        bestWorstCase = worstCase;
        bestGuess = guess;
      }
    }

    // Make the guess
    const result = master.guess(words[bestGuess]);

    // If we found the secret (6 matches), we're done
    if (result === 6) return;

    // Filter candidates: keep only words with exactly 'result' matches
    // with our guessed word
    const newCandidates = [];
    for (const candidate of candidates) {
      if (matches[bestGuess][candidate] === result) {
        newCandidates.push(candidate);
      }
    }

    candidates = newCandidates;
  }
};
```

```java
// Time: O(N^2 * 6) where N is number of words, but with at most 10 iterations
// Space: O(N^2) for storing match counts between all word pairs
/**
 * // This is the Master's API interface.
 * // You should not implement it, or speculate about its implementation
 * interface Master {
 *     public int guess(String word) {}
 * }
 */
class Solution {
    public void findSecretWord(String[] words, Master master) {
        // Precompute matches between all pairs of words
        int n = words.length;
        int[][] matches = new int[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                // Count character matches at same positions
                int matchCount = 0;
                for (int k = 0; k < 6; k++) {
                    if (words[i].charAt(k) == words[j].charAt(k)) {
                        matchCount++;
                    }
                }
                matches[i][j] = matches[j][i] = matchCount;
            }
        }

        // Start with all words as candidates
        List<Integer> candidates = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            candidates.add(i);
        }

        // We have at most 10 guesses
        for (int attempt = 0; attempt < 10; attempt++) {
            if (candidates.isEmpty()) break;

            // Find the best guess using minimax strategy
            int bestGuess = candidates.get(0);
            int bestWorstCase = candidates.size();

            // Try each candidate as potential guess
            for (int guess : candidates) {
                // For each possible match result (0-6), count how many candidates
                // would remain if we got that result
                int[] buckets = new int[7];
                for (int candidate : candidates) {
                    int matchCount = matches[guess][candidate];
                    buckets[matchCount]++;
                }

                // The worst case is the maximum number of candidates in any bucket
                int worstCase = 0;
                for (int count : buckets) {
                    worstCase = Math.max(worstCase, count);
                }

                // Minimize the worst case
                if (worstCase < bestWorstCase) {
                    bestWorstCase = worstCase;
                    bestGuess = guess;
                }
            }

            // Make the guess
            int result = master.guess(words[bestGuess]);

            // If we found the secret (6 matches), we're done
            if (result == 6) return;

            // Filter candidates: keep only words with exactly 'result' matches
            // with our guessed word
            List<Integer> newCandidates = new ArrayList<>();
            for (int candidate : candidates) {
                if (matches[bestGuess][candidate] == result) {
                    newCandidates.add(candidate);
                }
            }

            candidates = newCandidates;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N² + 10N) = O(N²) where N is the number of words

- Precomputing matches between all pairs: O(N² \* 6) = O(N²)
- In each of at most 10 iterations:
  - Finding best guess: O(N²) in worst case (checking each candidate against all others)
  - Filtering candidates: O(N)
- In practice, N ≤ 100, so O(10,000) operations is acceptable

**Space Complexity:** O(N²)

- We store match counts between all word pairs: N × N matrix
- We store the candidate list: O(N)

The 10-guess limit is crucial here. Even though individual operations might be O(N²), with N ≤ 100 and only 10 iterations, the total operations are bounded and acceptable.

## Common Mistakes

1. **Not using the match information effectively**: Some candidates try random guessing or sequential guessing without filtering the candidate list based on match results. This wastes guesses and will likely exceed the 10-guess limit.

2. **Forgetting to handle the case when guess returns 6**: If you get 6 matches, you've found the secret and should return immediately. Continuing to guess wastes API calls and could cause errors.

3. **Incorrect match counting**: When comparing two words, you must count exact position matches only. A common mistake is to count character matches regardless of position, which gives wrong filtering.

4. **Not considering all possible match results (0-6)**: When evaluating a potential guess, you need to consider all 7 possible outcomes (0 to 6 matches). Focusing only on the expected outcome can lead to poor guess selection.

## When You'll See This Pattern

This minimax strategy appears in several problem types:

1. **Game Theory Problems**: Like "Guess Number Higher or Lower II" (LeetCode 375) where you minimize worst-case cost.

2. **Information Theory Problems**: Where you need to maximize information gain with limited queries, similar to "Find the Duplicate Number" (LeetCode 287) when solved with binary search on value space.

3. **Interactive Problems**: Like "First Bad Version" (LeetCode 278) where you need to minimize API calls, though that uses binary search rather than minimax.

The core pattern is: when you have limited attempts/queries and need to extract maximum information from each one, consider how each possible response would affect your search space and choose the option that minimizes the worst-case remaining work.

## Key Takeaways

1. **Minimax is powerful for limited-attempt problems**: When you have a fixed number of guesses/queries, choose the option that gives you the best worst-case outcome.

2. **Information gain matters more than direct progress**: Sometimes guessing a word that's unlikely to be correct can give you more information to eliminate many other candidates.

3. **Precomputation can save time**: Computing all pair-wise match counts upfront (O(N²)) is better than computing them on-demand during filtering (could be O(N³) overall).

[Practice this problem on CodeJeet](/problem/guess-the-word)
