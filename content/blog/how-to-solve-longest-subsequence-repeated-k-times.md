---
title: "How to Solve Longest Subsequence Repeated k Times — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Subsequence Repeated k Times. Hard difficulty, 71.3% acceptance rate. Topics: Hash Table, Two Pointers, String, Backtracking, Counting."
date: "2027-12-30"
category: "dsa-patterns"
tags: ["longest-subsequence-repeated-k-times", "hash-table", "two-pointers", "string", "hard"]
---

# How to Solve Longest Subsequence Repeated k Times

This problem asks us to find the longest subsequence that appears at least `k` times in string `s`. A subsequence is different from a substring—it doesn't need to be contiguous, just maintain order. What makes this tricky is that we need to find subsequences that repeat multiple times, and we want the longest possible one. The "hard" difficulty comes from needing to efficiently search through possible subsequences while ensuring each candidate actually appears `k` times.

## Visual Walkthrough

Let's trace through `s = "abacb", k = 2`:

1. First, we count character frequencies: `a:2, b:2, c:1`
2. Since we need subsequences that appear at least 2 times, `c` can't be in our answer (frequency < k)
3. Valid characters are `a` and `b`, so possible subsequences include: `"a"`, `"b"`, `"ab"`, `"ba"`, `"aa"`, `"bb"`, `"aba"`, etc.
4. We need to check which of these actually appear as subsequences at least 2 times:
   - `"a"`: appears at indices 0 and 2 → valid
   - `"b"`: appears at indices 1 and 4 → valid
   - `"ab"`: can we find `"ab"` twice? Yes: (0,1) and (2,4) → valid
   - `"ba"`: appears at (1,2) and (1,2)? Wait, we need distinct occurrences. Actually `"ba"` only appears once → invalid
   - `"aa"`: appears at (0,2) → only once → invalid
   - `"bb"`: doesn't exist → invalid
   - `"aba"`: appears at (0,1,2) → only once → invalid
5. The longest valid subsequence is `"ab"` with length 2.

The key insight: we need to systematically generate candidate subsequences from characters that appear at least `k` times, then verify if each candidate appears `k` times as a subsequence.

## Brute Force Approach

A naive approach would be:

1. Generate all possible subsequences of `s` (there are 2^n possibilities)
2. For each subsequence, check if it appears at least `k` times in `s`
3. Track the longest valid subsequence

The checking step itself is expensive—verifying if a subsequence `t` appears `k` times in `s` requires O(n \* |t|) time using greedy matching. With 2^n subsequences, this becomes astronomically slow.

Even if we only consider subsequences made from characters with frequency ≥ k, there could still be many possibilities. For example, if all characters appear ≥ k times, we'd have 2^n candidates.

<div class="code-group">

```python
# Brute force - too slow for n > 20
def longestSubsequenceRepeatedK_brute(s: str, k: int) -> str:
    from itertools import combinations

    n = len(s)
    best = ""

    # Generate all subsequences
    for length in range(1, n + 1):
        for combo in combinations(range(n), length):
            # Create subsequence from indices
            candidate = ''.join(s[i] for i in combo)

            # Check if it appears k times
            count = 0
            pos = 0
            for i in range(n):
                if s[i] == candidate[pos]:
                    pos += 1
                    if pos == len(candidate):
                        count += 1
                        pos = 0
                        if count >= k:
                            break
            if count >= k and len(candidate) > len(best):
                best = candidate

    return best
```

```javascript
// Brute force - too slow for n > 20
function longestSubsequenceRepeatedKBrute(s, k) {
  let best = "";
  const n = s.length;

  // Helper to generate all combinations
  function* generateCombinations(start, length, current) {
    if (current.length === length) {
      yield current.join("");
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(s[i]);
      yield* generateCombinations(i + 1, length, current);
      current.pop();
    }
  }

  // Try all lengths from longest to shortest
  for (let length = n; length > 0; length--) {
    for (let candidate of generateCombinations(0, length, [])) {
      // Check if candidate appears k times
      let count = 0;
      let pos = 0;
      for (let i = 0; i < n; i++) {
        if (s[i] === candidate[pos]) {
          pos++;
          if (pos === candidate.length) {
            count++;
            pos = 0;
            if (count >= k) break;
          }
        }
      }
      if (count >= k) {
        return candidate; // First found at this length is valid
      }
    }
  }

  return best;
}
```

```java
// Brute force - too slow for n > 20
public String longestSubsequenceRepeatedKBrute(String s, int k) {
    String best = "";
    int n = s.length();

    // Generate all subsequences using bitmask
    for (int mask = 1; mask < (1 << n); mask++) {
        StringBuilder candidate = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                candidate.append(s.charAt(i));
            }
        }

        // Check if candidate appears k times
        int count = 0;
        int pos = 0;
        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == candidate.charAt(pos)) {
                pos++;
                if (pos == candidate.length()) {
                    count++;
                    pos = 0;
                    if (count >= k) break;
                }
            }
        }

        if (count >= k && candidate.length() > best.length()) {
            best = candidate.toString();
        }
    }

    return best;
}
```

</div>

This brute force is O(2^n \* n) which is completely impractical for n > 20. We need a smarter approach.

## Optimized Approach

The key insights for optimization:

1. **Character filtering**: Only characters appearing at least `k` times in `s` can be part of the answer. This dramatically reduces the search space.

2. **BFS search with pruning**: We can use BFS to generate candidate subsequences from valid characters, starting from shorter to longer. Since we want the longest valid subsequence, we explore longer candidates first (like BFS level by level).

3. **Efficient validation**: To check if a candidate `t` appears `k` times in `s`, we use a greedy matching algorithm that runs in O(n) time.

4. **Pruning**: If a candidate `t` is invalid (doesn't appear `k` times), then any longer candidate containing `t` as a prefix will also be invalid. This allows us to prune the search tree.

The algorithm:

1. Count character frequencies, keep only those with freq ≥ k
2. Sort these characters (for consistent ordering)
3. Use BFS queue starting with empty string
4. For each candidate in queue, try appending each valid character
5. Check if new candidate appears ≥ k times
6. If valid, add to next level of BFS
7. Keep track of the longest valid candidate found

## Optimal Solution

<div class="code-group">

```python
# Time: O(26^L * n) where L is answer length, but heavily pruned in practice
# Space: O(26^L) for BFS queue
def longestSubsequenceRepeatedK(s: str, k: int) -> str:
    from collections import Counter, deque

    # Step 1: Count frequencies and filter characters
    freq = Counter(s)
    # Only keep characters that appear at least k times
    valid_chars = sorted([ch for ch, count in freq.items() if count >= k])

    # Step 2: BFS to find longest valid subsequence
    queue = deque([""])
    answer = ""

    while queue:
        current = queue.popleft()

        # Try to extend current candidate with each valid character
        for ch in valid_chars:
            candidate = current + ch

            # Check if candidate appears at least k times
            count = 0
            j = 0  # pointer in candidate

            # Greedy matching: find k occurrences of candidate
            for i in range(len(s)):
                if s[i] == candidate[j]:
                    j += 1
                    # Found one complete occurrence
                    if j == len(candidate):
                        count += 1
                        j = 0
                        # Early stop if we found k occurrences
                        if count == k:
                            break

            # If valid, update answer and add to queue for further extension
            if count == k:
                answer = candidate  # Since BFS explores shorter first, this is the longest at this level
                queue.append(candidate)

    return answer
```

```javascript
// Time: O(26^L * n) where L is answer length, but heavily pruned in practice
// Space: O(26^L) for BFS queue
function longestSubsequenceRepeatedK(s, k) {
  // Step 1: Count frequencies and filter characters
  const freq = new Map();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  // Only keep characters that appear at least k times
  const validChars = Array.from(freq.entries())
    .filter(([ch, count]) => count >= k)
    .map(([ch]) => ch)
    .sort();

  // Step 2: BFS to find longest valid subsequence
  const queue = [""];
  let answer = "";

  while (queue.length > 0) {
    const current = queue.shift();

    // Try to extend current candidate with each valid character
    for (const ch of validChars) {
      const candidate = current + ch;

      // Check if candidate appears at least k times
      let count = 0;
      let j = 0; // pointer in candidate

      // Greedy matching: find k occurrences of candidate
      for (let i = 0; i < s.length; i++) {
        if (s[i] === candidate[j]) {
          j++;
          // Found one complete occurrence
          if (j === candidate.length) {
            count++;
            j = 0;
            // Early stop if we found k occurrences
            if (count === k) {
              break;
            }
          }
        }
      }

      // If valid, update answer and add to queue for further extension
      if (count === k) {
        answer = candidate; // Since BFS explores shorter first, this is the longest at this level
        queue.push(candidate);
      }
    }
  }

  return answer;
}
```

```java
// Time: O(26^L * n) where L is answer length, but heavily pruned in practice
// Space: O(26^L) for BFS queue
public String longestSubsequenceRepeatedK(String s, int k) {
    // Step 1: Count frequencies and filter characters
    int[] freq = new int[26];
    for (char ch : s.toCharArray()) {
        freq[ch - 'a']++;
    }

    // Build list of valid characters (appear at least k times)
    StringBuilder validCharsBuilder = new StringBuilder();
    for (int i = 0; i < 26; i++) {
        if (freq[i] >= k) {
            validCharsBuilder.append((char)('a' + i));
        }
    }
    String validChars = validCharsBuilder.toString();

    // Step 2: BFS to find longest valid subsequence
    Queue<String> queue = new LinkedList<>();
    queue.offer("");
    String answer = "";

    while (!queue.isEmpty()) {
        String current = queue.poll();

        // Try to extend current candidate with each valid character
        for (int idx = 0; idx < validChars.length(); idx++) {
            char ch = validChars.charAt(idx);
            String candidate = current + ch;

            // Check if candidate appears at least k times
            int count = 0;
            int j = 0;  // pointer in candidate

            // Greedy matching: find k occurrences of candidate
            for (int i = 0; i < s.length(); i++) {
                if (s.charAt(i) == candidate.charAt(j)) {
                    j++;
                    // Found one complete occurrence
                    if (j == candidate.length()) {
                        count++;
                        j = 0;
                        // Early stop if we found k occurrences
                        if (count == k) {
                            break;
                        }
                    }
                }
            }

            // If valid, update answer and add to queue for further extension
            if (count == k) {
                answer = candidate;  // Since BFS explores shorter first, this is the longest at this level
                queue.offer(candidate);
            }
        }
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(26^L \* n) in worst case, where L is the length of the answer. However:

- The 26^L term is the maximum number of candidates BFS would explore if all characters were valid
- In practice, pruning eliminates most candidates early
- The `n` factor comes from checking each candidate against the string
- Since L ≤ n/k (can't have more than n/k repetitions of a length-L subsequence), this is manageable

**Space Complexity**: O(26^L) for the BFS queue. In worst case, we store all candidates at the current level. Since we process level by level and discard previous levels, the actual memory usage is proportional to the number of valid candidates at the current level.

## Common Mistakes

1. **Confusing subsequence with substring**: Candidates often try to find contiguous substrings instead of subsequences. Remember: subsequences don't need to be contiguous, just maintain order.

2. **Not filtering characters first**: Trying to use characters that appear less than `k` times wastes time. Always filter first: `if freq[ch] < k: ch cannot be in answer`.

3. **Inefficient candidate validation**: The naive check for whether `t` appears `k` times as a subsequence is O(2^n) if done recursively. The greedy O(n) approach is crucial:
   - Scan `s` once
   - Match characters of `t` in order
   - Reset when complete match found
   - Stop after `k` matches

4. **Wrong BFS order**: Processing longer candidates before shorter ones can miss the longest valid subsequence. BFS naturally explores shorter candidates first, ensuring we find the longest possible.

## When You'll See This Pattern

This problem combines several important patterns:

1. **BFS for combinatorial search**: When you need to explore all combinations/permutations with pruning. Similar to:
   - **Word Ladder**: BFS through word space
   - **Letter Combinations of a Phone Number**: BFS/DFS through all combinations

2. **Subsequence matching with greedy algorithm**: The O(n) greedy match appears in:
   - **Is Subsequence**: Check if t is subsequence of s
   - **Number of Matching Subsequences**: Count how many words are subsequences

3. **Pruning search space with frequency counts**: Using character frequencies to limit search appears in:
   - **Longest Substring with At Least K Repeating Characters**: Divide and conquer based on character frequencies
   - **Find All Anagrams in a String**: Use frequency counts to validate anagrams

## Key Takeaways

1. **Filter then search**: When dealing with repetition constraints, first filter elements that can't possibly satisfy the requirement (characters with freq < k). This dramatically reduces search space.

2. **BFS with pruning for "longest valid" problems**: When searching for the longest object satisfying constraints, BFS from shorter to longer with pruning is often optimal. Invalid shorter candidates prune entire branches of longer candidates.

3. **Greedy subsequence matching**: To check if string `t` appears as a subsequence in `s` multiple times, use linear greedy scan: match characters in order, reset after complete match, count occurrences.

Related problems: [Longest Substring with At Least K Repeating Characters](/problem/longest-substring-with-at-least-k-repeating-characters)
