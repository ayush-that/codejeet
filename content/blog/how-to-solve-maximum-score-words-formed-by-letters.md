---
title: "How to Solve Maximum Score Words Formed by Letters — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Score Words Formed by Letters. Hard difficulty, 81.5% acceptance rate. Topics: Array, Hash Table, String, Dynamic Programming, Backtracking."
date: "2026-11-29"
category: "dsa-patterns"
tags: ["maximum-score-words-formed-by-letters", "array", "hash-table", "string", "hard"]
---

# How to Solve Maximum Score Words Formed by Letters

You're given a list of words, a collection of letters (with possible repeats), and a scoring table for each letter. Your task is to find the maximum score achievable by forming words from the given letters, where each word can be used at most once. The challenge lies in efficiently exploring all possible combinations of words while respecting the letter supply constraints—this is essentially a constrained combinatorial optimization problem.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- Words: `["dog", "cat", "dad", "good"]`
- Letters: `["a", "a", "c", "d", "d", "d", "g", "o", "o"]`
- Scores: `[1,3,3,2,1,4,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]` (a=1, b=3, c=3, d=2, e=1, etc.)

**Step 1: Count available letters**
We have: a:2, c:1, d:3, g:1, o:2

**Step 2: Check each word's feasibility and score**

- "dog": needs d:1, o:1, g:1 → score = 2+1+2 = 5 ✓
- "cat": needs c:1, a:1, t:1 → t not available ✗
- "dad": needs d:2, a:1 → score = 2+2+1 = 5 ✓
- "good": needs g:1, o:2, d:1 → score = 2+1+1+2 = 6 ✓

**Step 3: Explore combinations**
We can't take all words because letters are limited. Let's try combinations:

- Just "good": score = 6, uses g:1, o:2, d:1
- "dog" + "dad": needs d:3, o:1, g:1, a:1 → score = 5+5 = 10 ✓
- "dog" + "good": needs d:2, o:3, g:2 → o insufficient ✗
- "dad" + "good": needs d:3, a:1, g:1, o:2 → score = 5+6 = 11 ✓

The maximum score is 11 from ["dad", "good"].

## Brute Force Approach

The most straightforward approach is to generate all possible subsets of words (2^n possibilities), check if each subset can be formed with the available letters, calculate the score, and track the maximum.

**Why this fails:**
For n words, there are 2^n subsets. With n up to 14 in the problem constraints, that's 16,384 subsets—manageable for subset generation. However, the real issue is that for each subset, we need to:

1. Count letters needed by all words in the subset
2. Compare against available letters
3. Calculate the total score

While 2^14 operations is acceptable, the letter counting for each subset becomes expensive. More importantly, this approach doesn't scale well conceptually—it's essentially brute force without optimization.

## Optimized Approach

The key insight is that we can use **backtracking with pruning** to efficiently explore the solution space. Here's the step-by-step reasoning:

1. **Preprocessing**: Convert the words into a more efficient format. For each word, we need:
   - Its letter frequency count (to check feasibility)
   - Its precomputed score (to avoid recalculating)

2. **Backtracking strategy**: We explore words one by one, with two choices at each step:
   - Skip the current word
   - Take the current word (if we have enough letters)

3. **State management**: We maintain:
   - Current letter counts (remaining letters)
   - Current score
   - Current word index

4. **Pruning opportunities**:
   - If taking a word would exceed available letters, skip it
   - We can compute the maximum possible remaining score to prune unpromising paths

5. **Optimization**: Precompute word scores and letter requirements so we don't recalculate them during backtracking.

The backtracking approach is more efficient than brute force because it prunes invalid branches early—we don't generate subsets that would require more letters than available.

## Optimal Solution

Here's the complete solution using backtracking with pruning:

<div class="code-group">

```python
# Time: O(2^n * L) where n = number of words, L = max word length
# Space: O(n + 26) for recursion stack and frequency arrays
class Solution:
    def maxScoreWords(self, words: List[str], letters: List[str], score: List[int]) -> int:
        # Step 1: Count available letters
        letter_count = [0] * 26
        for letter in letters:
            letter_count[ord(letter) - ord('a')] += 1

        # Step 2: Precompute word scores and letter requirements
        word_scores = []
        word_letter_counts = []

        for word in words:
            # Calculate score for this word
            word_score = 0
            word_letter_count = [0] * 26
            for char in word:
                idx = ord(char) - ord('a')
                word_letter_count[idx] += 1
                word_score += score[idx]

            word_scores.append(word_score)
            word_letter_counts.append(word_letter_count)

        # Step 3: Backtracking function
        def backtrack(idx, current_count, current_score):
            # Base case: processed all words
            if idx == len(words):
                return current_score

            # Option 1: Skip current word
            max_score = backtrack(idx + 1, current_count[:], current_score)

            # Option 2: Take current word if possible
            can_take = True
            new_count = current_count[:]
            additional_score = 0

            # Check if we have enough letters for this word
            for i in range(26):
                if word_letter_counts[idx][i] > new_count[i]:
                    can_take = False
                    break
                new_count[i] -= word_letter_counts[idx][i]
                additional_score += word_letter_counts[idx][i] * score[i]

            # If we can take the word, explore this path
            if can_take:
                max_score = max(max_score, backtrack(idx + 1, new_count, current_score + additional_score))

            return max_score

        # Step 4: Start backtracking from first word
        return backtrack(0, letter_count, 0)
```

```javascript
// Time: O(2^n * L) where n = number of words, L = max word length
// Space: O(n + 26) for recursion stack and frequency arrays
var maxScoreWords = function (words, letters, score) {
  // Step 1: Count available letters
  const letterCount = new Array(26).fill(0);
  for (const letter of letters) {
    letterCount[letter.charCodeAt(0) - 97]++;
  }

  // Step 2: Precompute word scores and letter requirements
  const wordScores = [];
  const wordLetterCounts = [];

  for (const word of words) {
    // Calculate score for this word
    let wordScore = 0;
    const wordLetterCount = new Array(26).fill(0);

    for (const char of word) {
      const idx = char.charCodeAt(0) - 97;
      wordLetterCount[idx]++;
      wordScore += score[idx];
    }

    wordScores.push(wordScore);
    wordLetterCounts.push(wordLetterCount);
  }

  // Step 3: Backtracking function
  function backtrack(idx, currentCount, currentScore) {
    // Base case: processed all words
    if (idx === words.length) {
      return currentScore;
    }

    // Option 1: Skip current word
    let maxScore = backtrack(idx + 1, [...currentCount], currentScore);

    // Option 2: Take current word if possible
    let canTake = true;
    const newCount = [...currentCount];

    // Check if we have enough letters for this word
    for (let i = 0; i < 26; i++) {
      if (wordLetterCounts[idx][i] > newCount[i]) {
        canTake = false;
        break;
      }
      newCount[i] -= wordLetterCounts[idx][i];
    }

    // If we can take the word, explore this path
    if (canTake) {
      const newScore = currentScore + wordScores[idx];
      maxScore = Math.max(maxScore, backtrack(idx + 1, newCount, newScore));
    }

    return maxScore;
  }

  // Step 4: Start backtracking from first word
  return backtrack(0, letterCount, 0);
};
```

```java
// Time: O(2^n * L) where n = number of words, L = max word length
// Space: O(n + 26) for recursion stack and frequency arrays
class Solution {
    public int maxScoreWords(String[] words, char[] letters, int[] score) {
        // Step 1: Count available letters
        int[] letterCount = new int[26];
        for (char letter : letters) {
            letterCount[letter - 'a']++;
        }

        // Step 2: Precompute word scores and letter requirements
        int[] wordScores = new int[words.length];
        int[][] wordLetterCounts = new int[words.length][26];

        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            int wordScore = 0;

            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                wordLetterCounts[i][idx]++;
                wordScore += score[idx];
            }

            wordScores[i] = wordScore;
        }

        // Step 3: Backtracking function
        return backtrack(0, letterCount, 0, words, wordScores, wordLetterCounts, score);
    }

    private int backtrack(int idx, int[] currentCount, int currentScore,
                         String[] words, int[] wordScores, int[][] wordLetterCounts, int[] score) {
        // Base case: processed all words
        if (idx == words.length) {
            return currentScore;
        }

        // Option 1: Skip current word
        int maxScore = backtrack(idx + 1, currentCount.clone(), currentScore,
                                words, wordScores, wordLetterCounts, score);

        // Option 2: Take current word if possible
        boolean canTake = true;
        int[] newCount = currentCount.clone();

        // Check if we have enough letters for this word
        for (int i = 0; i < 26; i++) {
            if (wordLetterCounts[idx][i] > newCount[i]) {
                canTake = false;
                break;
            }
            newCount[i] -= wordLetterCounts[idx][i];
        }

        // If we can take the word, explore this path
        if (canTake) {
            int newScore = currentScore + wordScores[idx];
            maxScore = Math.max(maxScore, backtrack(idx + 1, newCount, newScore,
                                                   words, wordScores, wordLetterCounts, score));
        }

        return maxScore;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(2^n \* L)

- We explore up to 2^n subsets of words through backtracking
- For each word we consider taking, we check up to 26 letters (constant) and each word has length L
- The pruning reduces the actual number of explored paths, but worst-case is still exponential

**Space Complexity:** O(n + 26)

- We store precomputed word information: O(n \* 26) but 26 is constant, so O(n)
- Recursion stack depth: O(n) in worst case
- Letter frequency arrays: O(26) constant space
- Total: O(n + 26) = O(n)

## Common Mistakes

1. **Not preprocessing word information**: Recalculating letter counts and scores for each word during backtracking leads to O(2^n _ L^2) complexity instead of O(2^n _ L).

2. **Forgetting to clone/copy frequency arrays**: In backtracking, when we explore the "take word" branch, we need to work with a copy of the letter counts. Modifying the original array affects the "skip word" branch.

3. **Incorrect letter counting**: Using a hashmap instead of a fixed-size array of 26 elements for letter frequencies. While both work, the array is more efficient and simpler for this problem.

4. **Missing the "skip word" option**: Some candidates only explore paths where they take words, forgetting that skipping a word might lead to a better overall score with different word combinations.

## When You'll See This Pattern

This constrained subset selection pattern appears in several combinatorial optimization problems:

1. **Subset Sum / Knapsack Problems**: Like "Partition Equal Subset Sum" (LeetCode 416) or "Target Sum" (LeetCode 494), where you select elements to reach a target under constraints.

2. **Maximum Compatibility Score Sum** (LeetCode 1947): Similar backtracking with pruning to match students and mentors optimally.

3. **Matchsticks to Square** (LeetCode 473): Distributing items into groups with capacity constraints, using backtracking with pruning.

The pattern involves: exploring subsets, maintaining resource constraints, pruning invalid paths early, and often using memoization or DP when the state space allows.

## Key Takeaways

1. **Backtracking with pruning** is powerful for combinatorial problems with constraints. Always look for opportunities to prune unpromising branches early.

2. **Precomputation is crucial**: Calculate expensive operations (like word scores and letter counts) once upfront rather than repeatedly during search.

3. **State representation matters**: Using fixed-size arrays for character frequencies (when alphabet size is fixed) is more efficient than hash maps for this problem.

4. **Think in terms of choices**: At each step, you typically have a choice to include or exclude an element. Frame your backtracking around these decisions.

Related problems: [Maximum Good People Based on Statements](/problem/maximum-good-people-based-on-statements)
