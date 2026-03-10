---
title: "How to Solve Minimum Length of Anagram Concatenation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Length of Anagram Concatenation. Medium difficulty, 39.8% acceptance rate. Topics: Hash Table, String, Counting."
date: "2029-03-06"
category: "dsa-patterns"
tags: ["minimum-length-of-anagram-concatenation", "hash-table", "string", "counting", "medium"]
---

## How to Solve Minimum Length of Anagram Concatenation

You’re given a string `s` that was built by concatenating multiple copies of an anagram of some unknown string `t`. Your task is to find the smallest possible length of `t`. The tricky part is that `s` could be made from many different possible `t` lengths — you need to find the one that divides the string evenly and where every chunk is an anagram of the others.

**Why this is interesting:** It looks like a string problem, but it’s really about finding the smallest repeating _pattern_ in terms of character frequency, not exact characters. You can’t just check substrings directly — you need to think in terms of frequency counts and divisors.

---

## Visual Walkthrough

Let’s take `s = "abababab"`.

We know `s` is made by concatenating anagrams of `t`. That means if we split `s` into chunks of length `len(t)`, each chunk must have the same character counts.

**Step 1 – Try possible lengths**  
Possible `t` lengths must divide `s.length` evenly. Lengths of `s` = 8. Divisors: 1, 2, 4, 8.

**Step 2 – Check length 1**  
Chunks: `"a"`, `"b"`, `"a"`, `"b"`, `"a"`, `"b"`, `"a"`, `"b"`.  
All chunks of length 1 are single characters. Are they anagrams? `"a"` and `"b"` are not anagrams (different characters). So length 1 fails.

**Step 3 – Check length 2**  
Chunks: `"ab"`, `"ab"`, `"ab"`, `"ab"`.  
Each chunk has 1 `'a'` and 1 `'b'`. Same frequency → anagrams. Works!

Since 2 is the smallest divisor that works, the answer is 2.

Another example: `s = "abcabcabcabc"` (length 12).  
Divisors: 1, 2, 3, 4, 6, 12.

- Length 1 fails (`"a"` vs `"b"`).
- Length 2 fails (`"ab"` vs `"ca"` → different counts).
- Length 3: chunks `"abc"`, `"abc"`, `"abc"`, `"abc"` → all same counts. Works. Answer = 3.

---

## Brute Force Approach

A brute force way:

1. For each divisor `k` of `n` (where `n = len(s)`), split `s` into `n/k` chunks of length `k`.
2. For each chunk, count character frequencies.
3. Compare if all chunk frequency maps are equal.
4. Return the smallest `k` that satisfies this.

Why this is slow:

- For each `k`, we process `n/k` chunks, each of length `k`, so time per `k` is roughly `O(n)`.
- Number of divisors of `n` is about `O(√n)` in worst case.
- Total could be `O(n√n)`, which is too slow for `n` up to `10^5`.

Also, comparing frequency maps for each chunk is heavy if done naively.

---

## Optimized Approach

Key insight:  
If `s` is made from anagrams of `t` of length `k`, then **every chunk of length `k` must have the same character frequency**.  
But instead of comparing all chunks directly, note:  
The frequency of each character in the _whole string_ must be divisible by the number of chunks (`n/k`). Why?  
Because if each chunk has identical counts, then total count of a character = (count in one chunk) × (number of chunks). So total count must be divisible by number of chunks.

Thus:

1. Compute frequency of each char in `s`.
2. For each divisor `k` of `n`, let `numChunks = n/k`.
3. Check if for every character, `freq[char] % numChunks == 0`.
4. If yes, then `k` is valid.
5. Return smallest valid `k`.

This avoids splitting strings and comparing chunks — just math on frequencies.

---

## Optimal Solution

We implement the insight:

- First, count character frequencies.
- Find all divisors of `n` (efficiently up to `√n`).
- For each divisor `k`, compute `numChunks = n/k`, check if all frequencies are divisible by `numChunks`.
- Smallest valid `k` is the answer.

<div class="code-group">

```python
# Time: O(n * d) where d = number of divisors of n, but since we break early on failures,
#       in practice closer to O(n√n) worst case but fast in practice.
# Space: O(1) because alphabet size is fixed (26 lowercase letters).
def minAnagramLength(s: str) -> int:
    n = len(s)

    # Step 1: Count frequency of each character in s
    freq = [0] * 26
    for ch in s:
        freq[ord(ch) - ord('a')] += 1

    # Step 2: Try all possible lengths k that divide n
    # We check from smallest to largest to find minimum quickly
    for k in range(1, n + 1):
        if n % k != 0:
            continue  # k must divide n evenly

        num_chunks = n // k

        # Step 3: Check if all character counts are divisible by num_chunks
        valid = True
        for count in freq:
            if count % num_chunks != 0:
                valid = False
                break

        if valid:
            return k

    return n  # fallback, whole string itself works

```

```javascript
// Time: O(n√n) worst case, but early break makes it fast.
// Space: O(1) fixed size array for 26 letters.
function minAnagramLength(s) {
  const n = s.length;

  // Step 1: Frequency count
  const freq = new Array(26).fill(0);
  for (let i = 0; i < n; i++) {
    freq[s.charCodeAt(i) - 97]++; // 'a' = 97
  }

  // Step 2: Try all possible k from 1 to n
  for (let k = 1; k <= n; k++) {
    if (n % k !== 0) continue;

    const numChunks = n / k;

    // Step 3: Check divisibility condition
    let valid = true;
    for (let count of freq) {
      if (count % numChunks !== 0) {
        valid = false;
        break;
      }
    }

    if (valid) return k;
  }

  return n; // fallback
}
```

```java
// Time: O(n√n) worst case, early break helps.
// Space: O(1) fixed 26-size array.
public class Solution {
    public int minAnagramLength(String s) {
        int n = s.length();

        // Step 1: Frequency count
        int[] freq = new int[26];
        for (int i = 0; i < n; i++) {
            freq[s.charAt(i) - 'a']++;
        }

        // Step 2: Try all possible k
        for (int k = 1; k <= n; k++) {
            if (n % k != 0) continue;

            int numChunks = n / k;

            // Step 3: Check if all counts divisible by numChunks
            boolean valid = true;
            for (int count : freq) {
                if (count % numChunks != 0) {
                    valid = false;
                    break;
                }
            }

            if (valid) return k;
        }

        return n; // fallback
    }
}
```

</div>

---

## Complexity Analysis

**Time complexity:**

- Frequency counting: `O(n)`.
- Loop over `k` from 1 to `n`: `O(n)` iterations, but we skip non-divisors quickly.
- Inside loop: check 26 frequencies → `O(1)` per `k`.
- Total: `O(n)` for counting + `O(n * 1)` for checks = `O(n)` in practice, but strictly `O(n√n)` if we consider divisor iteration.
- Since alphabet size is fixed (26), it's effectively `O(n√n)` worst-case but very fast.

**Space complexity:** `O(1)` because we use a fixed-size array of 26 integers.

---

## Common Mistakes

1. **Not checking all divisors** — Some candidates only check divisors up to `√n` but forget the corresponding larger divisors. You must check all possible `k` from 1 to `n` that divide `n`.  
   _Fix:_ Loop `k` from 1 to `n`, skip if `n % k != 0`.

2. **Misunderstanding anagram condition** — Thinking chunks must be identical strings, not just same character counts.  
   _Fix:_ Remember anagram means same frequency of characters, not same order.

3. **Inefficient chunk comparison** — Splitting string into substrings and comparing frequency maps for each chunk is `O(n²)` worst case.  
   _Fix:_ Use the divisibility trick on total frequencies.

4. **Forgetting early termination** — Once you find smallest valid `k`, return immediately. No need to check larger `k`.

---

## When You'll See This Pattern

This problem combines:

- **Frequency counting** (like in `Valid Anagram`, `Group Anagrams`)
- **Divisor-based iteration** (like in problems about repeating patterns, e.g., `Repeated Substring Pattern`)
- **Math on frequencies** to avoid explicit comparisons.

Related LeetCode problems:

1. **Repeated Substring Pattern (LeetCode 459)** — Also checks if string can be built from repeating a substring, but here we allow anagrams.
2. **Find All Anagrams in a String (LeetCode 438)** — Uses sliding window with frequency maps.
3. **Smallest Substring With All Characters** — Frequency counting and substring validation.

---

## Key Takeaways

- When dealing with anagrams, think in terms of **character frequency counts**, not exact strings.
- If a string is built from repeated blocks (anagrams or not), the block length must divide the total length — always consider **divisors**.
- Use **divisibility checks on total frequencies** to validate possible lengths without expensive substring operations.

---

[Practice this problem on CodeJeet](/problem/minimum-length-of-anagram-concatenation)
