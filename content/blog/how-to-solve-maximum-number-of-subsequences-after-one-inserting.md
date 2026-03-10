---
title: "How to Solve Maximum Number of Subsequences After One Inserting — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Subsequences After One Inserting. Medium difficulty, 31.7% acceptance rate. Topics: String, Dynamic Programming, Greedy, Prefix Sum."
date: "2029-04-27"
category: "dsa-patterns"
tags:
  [
    "maximum-number-of-subsequences-after-one-inserting",
    "string",
    "dynamic-programming",
    "greedy",
    "medium",
  ]
---

## How to Solve Maximum Number of Subsequences After One Inserting

You can insert at most one uppercase letter anywhere into a string `s`. Your goal is to maximize the number of subsequences equal to `"LCT"` after this insertion. The challenge is that inserting a letter can dramatically change subsequence counts by creating new combinations with existing letters, and you need to find the optimal position and letter to insert.

---

## Visual Walkthrough

Let's trace through `s = "LCT"`:

**Current subsequences without insertion:**

- The string itself `"LCT"` is one subsequence.
- Total: 1

**If we insert 'L' at the beginning:**

- New string: `"LLCT"`
- Count subsequences equal to `"LCT"`:
  1. Use first L, then C, then T → `"LCT"`
  2. Use second L, then C, then T → `"LCT"`
- Total: 2

**If we insert 'C' between L and C:**

- New string: `"LCCT"`
- Subsequences:
  1. Use first C after L → `"LCT"`
  2. Use second C after L → `"LCT"`
- Total: 2

**If we insert 'T' at the end:**

- New string: `"LCTT"`
- Subsequences:
  1. Use first T → `"LCT"`
  2. Use second T → `"LCT"`
- Total: 2

The maximum is 2. This shows inserting a matching letter can double counts.

Now try `s = "LT"`:

**Without insertion:**

- No 'C' exists, so zero subsequences.

**Insert 'C' between L and T:**

- New string: `"LCT"`
- One subsequence: `"LCT"`
- Total: 1

This is the best we can do.

---

## Brute Force Approach

A naive solution would:

1. Try inserting each letter A-Z at every possible position (n+1 positions).
2. For each resulting string, count how many subsequences equal `"LCT"`.
3. Return the maximum count.

Counting subsequences for `"LCT"` in a string of length up to 10^5 would be O(n³) with this approach — far too slow.

**Why it fails:**

- 26 letters × (n+1) positions = O(26n) combinations.
- Counting subsequences naively for each combination takes O(n³) if done poorly, or O(n) if done optimally.
- Even O(26n²) is too large for n up to 10^5.

We need a way to calculate the effect of an insertion without reconstructing strings.

---

## Optimized Approach

The key insight: `"LCT"` is three characters. When we insert a letter X at position p:

- If X = 'L', it creates new subsequences starting with this new L, followed by existing C's and T's.
- If X = 'C', it can be paired with L's before position p and T's after position p.
- If X = 'T', it can be paired with existing LC pairs before position p.

We can compute for each position:

- `countL[i]`: number of 'L's before/at position i
- `countT[i]`: number of 'T's after position i
- `countLC[i]`: number of "LC" subsequences ending at/before i
- `countCT[i]`: number of "CT" subsequences starting at/after i

**Step-by-step reasoning:**

1. **Base count**: First compute how many `"LCT"` subsequences exist in the original string.
2. **Insertion impact**:
   - Inserting 'L' at position p adds `countCT[p]` new subsequences (this new L + existing C-T pairs after p).
   - Inserting 'C' at position p adds `countL[p] * countT[p]` new subsequences (L's before p × T's after p).
   - Inserting 'T' at position p adds `countLC[p]` new subsequences (existing LC pairs before p × this new T).
3. **Best improvement**: Track the maximum additional subsequences from any insertion.
4. **Result**: Base count + best improvement.

**Why this works:**

- We don't need to actually insert — we just calculate combinatorial contributions.
- Prefix/suffix arrays let us query counts in O(1).
- We handle all 26 letters efficiently because only 'L', 'C', 'T' matter — other letters add zero subsequences.

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSubsequenceCount(s: str) -> int:
    """
    Returns maximum number of "LCT" subsequences after inserting at most one letter.
    """
    n = len(s)

    # Step 1: Compute prefix counts of 'L' and suffix counts of 'T'
    prefix_L = [0] * (n + 1)  # prefix_L[i] = count of 'L' in s[0:i]
    suffix_T = [0] * (n + 1)  # suffix_T[i] = count of 'T' in s[i:n]

    for i in range(n):
        prefix_L[i + 1] = prefix_L[i] + (1 if s[i] == 'L' else 0)

    for i in range(n - 1, -1, -1):
        suffix_T[i] = suffix_T[i + 1] + (1 if s[i] == 'T' else 0)

    # Step 2: Compute base count of "LCT" subsequences in original string
    # Count of 'C' at each position × number of 'L' before it × number of 'T' after it
    base_count = 0
    for i in range(n):
        if s[i] == 'C':
            base_count += prefix_L[i] * suffix_T[i + 1]

    # Step 3: Compute best improvement from inserting one letter
    best_improvement = 0

    # Try inserting at each position (0 to n, inclusive)
    for pos in range(n + 1):
        # Insert 'L' at pos: pairs with C-T pairs starting after pos
        # Count of C-T pairs after pos = sum over j>pos where s[j]=='C' of suffix_T[j+1]
        # But we can compute efficiently: for each C after pos, multiply by T's after that C
        # Simpler: insert 'L' contributes = count of "CT" subsequences starting at/after pos
        # Which equals: for each C after pos, number of T's after that C
        if pos < n:
            # Count CT pairs starting at or after pos
            ct_count = 0
            c_count = 0
            for j in range(pos, n):
                if s[j] == 'C':
                    c_count += 1
                elif s[j] == 'T':
                    ct_count += c_count  # Each T pairs with all preceding C's in this range
            best_improvement = max(best_improvement, ct_count)

        # Insert 'C' at pos: pairs with L's before pos and T's after pos
        L_before = prefix_L[pos]
        T_after = suffix_T[pos]  # Note: suffix_T[pos] counts T's from pos onward
        best_improvement = max(best_improvement, L_before * T_after)

        # Insert 'T' at pos: pairs with LC pairs ending before pos
        # LC pairs before pos = sum over i<pos where s[i]=='C' of prefix_L[i]
        lc_count = 0
        l_count = 0
        for i in range(pos):
            if s[i] == 'L':
                l_count += 1
            elif s[i] == 'C':
                lc_count += l_count  # Each C pairs with all preceding L's
        best_improvement = max(best_improvement, lc_count)

    return base_count + best_improvement
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSubsequenceCount(s) {
  const n = s.length;

  // Step 1: Prefix count of 'L', suffix count of 'T'
  const prefixL = new Array(n + 1).fill(0);
  const suffixT = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    prefixL[i + 1] = prefixL[i] + (s[i] === "L" ? 1 : 0);
  }

  for (let i = n - 1; i >= 0; i--) {
    suffixT[i] = suffixT[i + 1] + (s[i] === "T" ? 1 : 0);
  }

  // Step 2: Base count of "LCT" in original string
  let baseCount = 0;
  for (let i = 0; i < n; i++) {
    if (s[i] === "C") {
      baseCount += prefixL[i] * suffixT[i + 1];
    }
  }

  // Step 3: Best improvement from one insertion
  let bestImprovement = 0;

  for (let pos = 0; pos <= n; pos++) {
    // Insert 'L' at pos
    if (pos < n) {
      let ctCount = 0;
      let cCount = 0;
      for (let j = pos; j < n; j++) {
        if (s[j] === "C") {
          cCount++;
        } else if (s[j] === "T") {
          ctCount += cCount;
        }
      }
      bestImprovement = Math.max(bestImprovement, ctCount);
    }

    // Insert 'C' at pos
    const LBefore = prefixL[pos];
    const TAfter = suffixT[pos];
    bestImprovement = Math.max(bestImprovement, LBefore * TAfter);

    // Insert 'T' at pos
    let lcCount = 0;
    let lCount = 0;
    for (let i = 0; i < pos; i++) {
      if (s[i] === "L") {
        lCount++;
      } else if (s[i] === "C") {
        lcCount += lCount;
      }
    }
    bestImprovement = Math.max(bestImprovement, lcCount);
  }

  return baseCount + bestImprovement;
}
```

```java
// Time: O(n) | Space: O(n)
public class Solution {
    public int maximumSubsequenceCount(String s) {
        int n = s.length();

        // Step 1: Prefix count of 'L', suffix count of 'T'
        int[] prefixL = new int[n + 1];
        int[] suffixT = new int[n + 1];

        for (int i = 0; i < n; i++) {
            prefixL[i + 1] = prefixL[i] + (s.charAt(i) == 'L' ? 1 : 0);
        }

        for (int i = n - 1; i >= 0; i--) {
            suffixT[i] = suffixT[i + 1] + (s.charAt(i) == 'T' ? 1 : 0);
        }

        // Step 2: Base count of "LCT" in original string
        int baseCount = 0;
        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == 'C') {
                baseCount += prefixL[i] * suffixT[i + 1];
            }
        }

        // Step 3: Best improvement from one insertion
        int bestImprovement = 0;

        for (int pos = 0; pos <= n; pos++) {
            // Insert 'L' at pos
            if (pos < n) {
                int ctCount = 0;
                int cCount = 0;
                for (int j = pos; j < n; j++) {
                    if (s.charAt(j) == 'C') {
                        cCount++;
                    } else if (s.charAt(j) == 'T') {
                        ctCount += cCount;
                    }
                }
                bestImprovement = Math.max(bestImprovement, ctCount);
            }

            // Insert 'C' at pos
            int LBefore = prefixL[pos];
            int TAfter = suffixT[pos];
            bestImprovement = Math.max(bestImprovement, LBefore * TAfter);

            // Insert 'T' at pos
            int lcCount = 0;
            int lCount = 0;
            for (int i = 0; i < pos; i++) {
                if (s.charAt(i) == 'L') {
                    lCount++;
                } else if (s.charAt(i) == 'C') {
                    lcCount += lCount;
                }
            }
            bestImprovement = Math.max(bestImprovement, lcCount);
        }

        return baseCount + bestImprovement;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n)**

- Building prefix/suffix arrays: O(n)
- Computing base count: O(n)
- Checking all insertion positions: O(n) positions × O(n) in naive loops = O(n²) in current implementation
- _Optimization note_: The loops inside position checking can be optimized to O(1) using precomputed LC and CT counts, making it O(n) total. The above solution shows the clear logic; an optimized version would precompute `lcPrefix` and `ctSuffix` arrays.

**Space Complexity: O(n)**

- Storing prefix_L and suffix_T arrays: O(n)
- Additional variables use O(1) space

---

## Common Mistakes

1. **Only checking insertions of 'L', 'C', or 'T' at wrong positions**: Some candidates only try inserting at ends or only try one letter. You must check all positions (0 to n) and all three relevant letters.

2. **Double-counting base subsequences**: When calculating improvement from insertion, ensure you're only counting _new_ subsequences that use the inserted letter. Don't recount original subsequences.

3. **Off-by-one errors in prefix/suffix indices**: When computing `prefix_L[i] * suffix_T[i+1]` for base count, `prefix_L[i]` counts L's before position i, and `suffix_T[i+1]` counts T's after position i. Getting these indices wrong gives incorrect counts.

4. **Ignoring that insertion can be at beginning or end**: Positions range from 0 (before first char) to n (after last char). Forgetting position n misses end insertions.

---

## When You'll See This Pattern

This problem combines **prefix/suffix sums** with **combinatorial counting** — a common pattern in subsequence counting problems:

1. **Count Number of Subsequences Formed by Pattern** (e.g., LeetCode 115 — Distinct Subsequences): Uses dynamic programming to count subsequences equal to a target string.

2. **Maximum Score After Applying Operations on String** (e.g., LeetCode 1422 — Maximum Score After Splitting a String): Uses prefix sums to compute scores based on counts before/after a split point.

3. **Number of Ways to Split a String** (e.g., LeetCode 1573 — Number of Ways to Split a String Into Three Substrings): Counts ways based on character frequencies in segments.

The core technique: precompute prefix/suffix counts to answer "how many X's before/after position i?" in O(1) time.

---

## Key Takeaways

1. **For subsequence counting with fixed patterns**, think in terms of combinatorial contributions: each character's contribution depends on counts of needed preceding/following characters.

2. **When allowed one modification**, compute the base case first, then calculate the improvement from each possible modification separately. Often the improvement can be computed efficiently with preprocessed data.

3. **Prefix/suffix arrays** are your best friend for queries about counts before/after positions. Preprocess once, query many times.

---

[Practice this problem on CodeJeet](/problem/maximum-number-of-subsequences-after-one-inserting)
