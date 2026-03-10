---
title: "How to Solve Maximum Number of Removable Characters — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Removable Characters. Medium difficulty, 46.9% acceptance rate. Topics: Array, Two Pointers, String, Binary Search."
date: "2028-10-24"
category: "dsa-patterns"
tags: ["maximum-number-of-removable-characters", "array", "two-pointers", "string", "medium"]
---

# How to Solve Maximum Number of Removable Characters

You’re given two strings `s` and `p`, where `p` is a subsequence of `s`, and an array `removable` containing indices of `s` that can be removed. You need to find the maximum `k` such that after removing the first `k` elements from `removable`, `p` remains a subsequence of `s`. The challenge is that checking each possible `k` directly would be too slow — the key insight is that the property "p is still a subsequence" is monotonic with respect to `k`, allowing binary search to drastically reduce the number of checks.

## Visual Walkthrough

Let’s trace through a small example to build intuition:

**Input:**

```
s = "abcacb"
p = "ab"
removable = [3, 1, 0]
```

We want the largest `k` (0 ≤ k ≤ 3) such that if we mark the first `k` indices in `removable` as "removed" in `s`, `p` is still a subsequence.

**Step-by-step reasoning:**

- **k = 0:** No characters removed. `s` = "abcacb", `p` = "ab". Clearly `p` is a subsequence (take indices 0 and 1). ✅ Works.
- **k = 1:** Remove index 3 (first element of `removable`). Removed characters are marked as unavailable: `s` = "abcXcb" where X means removed. Check if "ab" is subsequence: we can take index 0 ('a') and index 1 ('b'). ✅ Works.
- **k = 2:** Remove indices 3 and 1. `s` = "aXcXcb". Check "ab": find 'a' at index 0, next find 'b' — index 1 is removed, index 4 is 'c', index 5 is 'b' ✅ Works.
- **k = 3:** Remove indices 3, 1, and 0. `s` = "XbcXcb". Check "ab": find 'a' — index 0 removed, index 1 is 'b' (not 'a'), index 2 is 'c', index 4 is 'c', index 5 is 'b'. No 'a' found. ❌ Fails.

Thus, maximum `k` = 2.

The pattern: if `p` is a subsequence for `k = 2`, it’s also a subsequence for all smaller `k`. If it fails for `k = 3`, it will fail for all larger `k`. This **monotonicity** (works up to some point, then fails) is what enables binary search.

## Brute Force Approach

A brute force solution would try every possible `k` from 0 up to `len(removable)`, and for each `k`:

1. Mark the first `k` indices in `removable` as removed in `s`.
2. Check if `p` is still a subsequence of the remaining available characters.

The subsequence check for a given `k` takes O(|s| + |p|) time (using two pointers). Since we might check up to `len(removable)` values of `k`, the total time becomes O(m \* (n + p)) where m = len(removable), n = |s|, p = |p|. In the worst case, m ≈ n, giving O(n²) — too slow for constraints where n can be up to 10⁵.

**Why brute force fails:** It does unnecessary work. Checking each `k` independently repeats the subsequence check from scratch, even though adjacent `k` values differ by only one removed character. More importantly, it misses the monotonicity property that allows binary search.

## Optimized Approach

The key insight is **monotonicity**: if `p` is a subsequence after removing the first `k` characters from `removable`, then it’s also a subsequence after removing the first `k-1` characters (since we’re removing fewer characters). Conversely, if it fails for some `k`, it will fail for all larger `k` (since we’re removing more characters). This creates a scenario:

- For k = 0, 1, 2, ... up to some point, the check passes ✅
- After that point, the check fails ❌

We want the **last k** where the check passes — this is exactly a "find the maximum valid k" problem that can be solved with **binary search** on the answer space `[0, len(removable)]`.

**Algorithm outline:**

1. Perform binary search on `k` from 0 to `len(removable)`.
2. For each candidate `k`, mark the first `k` indices in `removable` as removed (e.g., using a boolean array or set).
3. Check if `p` is a subsequence of `s` ignoring removed characters (standard two-pointer subsequence check).
4. If `p` is a subsequence, search the right half for a larger valid `k`; otherwise, search the left half.
5. The search converges to the maximum valid `k`.

**Why this works:** Binary search reduces the number of subsequence checks from O(m) to O(log m). Each check is O(n + p), giving total O((n + p) log m) — efficient enough for n up to 10⁵.

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + p) * log m) where n = len(s), p = len(p), m = len(removable)
# Space: O(n) for the removed marker array
class Solution:
    def maximumRemovals(self, s: str, p: str, removable: List[int]) -> int:
        # Helper: check if p is subsequence of s when first k indices in removable are removed
        def is_subsequence(k: int) -> bool:
            # Mark removed indices for this k
            removed = [False] * len(s)
            for i in range(k):
                removed[removable[i]] = True

            # Standard two-pointer subsequence check
            j = 0  # pointer in p
            for i in range(len(s)):
                # Skip removed characters
                if removed[i]:
                    continue
                # If current character matches p[j], move pointer in p
                if s[i] == p[j]:
                    j += 1
                    # Early exit: found all characters of p
                    if j == len(p):
                        return True
            return j == len(p)

        # Binary search for maximum valid k
        left, right = 0, len(removable)
        answer = 0

        while left <= right:
            mid = left + (right - left) // 2
            if is_subsequence(mid):
                # If p is subsequence with mid removals, try for more removals
                answer = mid
                left = mid + 1
            else:
                # Otherwise, try fewer removals
                right = mid - 1

        return answer
```

```javascript
// Time: O((n + p) * log m) where n = s.length, p = p.length, m = removable.length
// Space: O(n) for the removed marker array
/**
 * @param {string} s
 * @param {string} p
 * @param {number[]} removable
 * @return {number}
 */
var maximumRemovals = function (s, p, removable) {
  // Helper: check if p is subsequence of s when first k indices in removable are removed
  const isSubsequence = (k) => {
    // Mark removed indices for this k
    const removed = new Array(s.length).fill(false);
    for (let i = 0; i < k; i++) {
      removed[removable[i]] = true;
    }

    // Standard two-pointer subsequence check
    let j = 0; // pointer in p
    for (let i = 0; i < s.length; i++) {
      // Skip removed characters
      if (removed[i]) continue;
      // If current character matches p[j], move pointer in p
      if (s[i] === p[j]) {
        j++;
        // Early exit: found all characters of p
        if (j === p.length) return true;
      }
    }
    return j === p.length;
  };

  // Binary search for maximum valid k
  let left = 0,
    right = removable.length;
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (isSubsequence(mid)) {
      // If p is subsequence with mid removals, try for more removals
      answer = mid;
      left = mid + 1;
    } else {
      // Otherwise, try fewer removals
      right = mid - 1;
    }
  }

  return answer;
};
```

```java
// Time: O((n + p) * log m) where n = s.length(), p = p.length(), m = removable.length
// Space: O(n) for the removed marker array
class Solution {
    public int maximumRemovals(String s, String p, int[] removable) {
        // Helper: check if p is subsequence of s when first k indices in removable are removed
        private boolean isSubsequence(String s, String p, int[] removable, int k) {
            // Mark removed indices for this k
            boolean[] removed = new boolean[s.length()];
            for (int i = 0; i < k; i++) {
                removed[removable[i]] = true;
            }

            // Standard two-pointer subsequence check
            int j = 0;  // pointer in p
            for (int i = 0; i < s.length(); i++) {
                // Skip removed characters
                if (removed[i]) continue;
                // If current character matches p.charAt(j), move pointer in p
                if (s.charAt(i) == p.charAt(j)) {
                    j++;
                    // Early exit: found all characters of p
                    if (j == p.length()) return true;
                }
            }
            return j == p.length();
        }

        // Binary search for maximum valid k
        int left = 0, right = removable.length;
        int answer = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (isSubsequence(s, p, removable, mid)) {
                // If p is subsequence with mid removals, try for more removals
                answer = mid;
                left = mid + 1;
            } else {
                // Otherwise, try fewer removals
                right = mid - 1;
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + p) log m)

- Binary search runs O(log m) iterations where m = len(removable)
- Each iteration calls `is_subsequence(k)` which:
  - Marks removed indices: O(k) ≤ O(m) operations
  - Performs subsequence check: O(n + p) where n = len(s), p = len(p)
- Total: O((n + p + m) log m) = O((n + p) log m) since m ≤ n

**Space Complexity:** O(n)

- We create a `removed` boolean array of size n to mark removed indices
- The recursion stack for binary search is O(1) (iterative implementation)
- No other significant data structures

## Common Mistakes

1. **Not recognizing monotonicity:** Candidates often try linear scan or other approaches without realizing the "works up to a point then fails" pattern that enables binary search. Always ask: "If it works for k, does it work for all smaller k? If it fails for k, does it fail for all larger k?"

2. **Inefficient subsequence check for each k:** Some candidates rebuild the string after removals (O(n) string operations) instead of marking removed indices and checking in-place. This adds unnecessary O(n) overhead per check.

3. **Binary search off-by-one errors:** The search space is [0, len(removable)] inclusive. Common errors:
   - Using `left < right` instead of `left <= right` and missing the final answer
   - Not updating `answer` correctly when `mid` is valid
   - Using `mid = (left + right) / 2` without integer floor in languages like Java/JavaScript

4. **Forgetting that p is guaranteed to be subsequence initially:** The problem states p is a subsequence of s, so k=0 always works. Some candidates overcomplicate by handling the case where p isn't a subsequence initially.

## When You'll See This Pattern

This problem combines **binary search on answer** with a **validation function**. You'll see this pattern whenever:

1. You need to find the maximum/minimum value satisfying some condition
2. The condition is monotonic (if value X works, then all smaller/larger values work)
3. Checking the condition for a given value is expensive, so you want to minimize checks

**Related problems:**

- **Maximum Candies Allocated to K Children** (Medium): Find maximum candy pile size such that you can allocate to k children — binary search on pile size, with validation function checking if allocation is possible.
- **Capacity To Ship Packages Within D Days** (Medium): Find minimum ship capacity to ship packages within D days — binary search on capacity, with validation checking if shipping is possible.
- **Split Array Largest Sum** (Hard): Find minimum largest sum when splitting array into m subarrays — binary search on the sum, with validation checking if splitting is possible.

## Key Takeaways

1. **Look for monotonicity when searching for maximum/minimum values:** If you can answer "if X works, do all values ≤ X work?" and "if X fails, do all values ≥ X fail?", binary search on the answer space is applicable.

2. **Separate validation from search:** Design a function `isValid(k)` that checks the condition for a specific k, then use binary search to find the optimal k. This keeps logic clean and reusable.

3. **Binary search on answer space vs. binary search on array:** Here we're not searching in `removable` array itself, but searching for the optimal k in the range [0, len(removable)]. Recognize when the search space is a range of integers rather than indices in a sorted array.

Related problems: [Maximum Candies Allocated to K Children](/problem/maximum-candies-allocated-to-k-children)
