---
title: "How to Solve Count Distinct Integers After Removing Zeros — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Distinct Integers After Removing Zeros. Medium difficulty, 22.4% acceptance rate. Topics: Math, Dynamic Programming."
date: "2030-03-11"
category: "dsa-patterns"
tags: ["count-distinct-integers-after-removing-zeros", "math", "dynamic-programming", "medium"]
---

# How to Solve Count Distinct Integers After Removing Zeros

This problem asks: given a positive integer `n`, we process every number from 1 to `n` by removing all zero digits from its decimal representation, then count how many **distinct** results we get. For example, with `n = 20`, we process numbers 1 through 20. Removing zeros from 10 gives 1, from 20 gives 2, and so on. The challenge is that `n` can be as large as 10⁹, making a literal simulation too slow. The core difficulty lies in recognizing that many numbers map to the same zero-removed value, and we need to count these mappings efficiently without brute force enumeration.

## Visual Walkthrough

Let's trace through `n = 20` manually to build intuition:

Numbers 1-9: No zeros exist, so they map to themselves: {1, 2, 3, 4, 5, 6, 7, 8, 9}

Numbers 10-19:

- 10 → remove '0' → 1
- 11 → 11
- 12 → 12
- 13 → 13
- 14 → 14
- 15 → 15
- 16 → 16
- 17 → 17
- 18 → 18
- 19 → 19

Numbers 20: 20 → remove '0' → 2

Now collect all distinct results: {1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19}

That's 18 distinct integers. Notice something important: numbers like 10 and 1 both map to 1, but 1 was already counted. The key insight is that **every number from 1 to n maps to some zero-free number**, and we need to count how many zero-free numbers can be reached from numbers ≤ n.

## Brute Force Approach

A naive solution would literally iterate `x` from 1 to `n`, remove zeros from each `x` by converting to string and filtering, store results in a set, and return the set size.

<div class="code-group">

```python
# Time: O(n * d) where d is average digits per number ≈ log10(n)
# Space: O(n) for the set
def brute_force(n):
    distinct = set()
    for x in range(1, n + 1):
        # Convert to string, remove '0's, convert back to int
        # If all zeros removed results in empty string, treat as 0
        num_str = str(x).replace('0', '')
        if num_str == '':
            distinct.add(0)
        else:
            distinct.add(int(num_str))
    return len(distinct)
```

```javascript
// Time: O(n * d) | Space: O(n)
function bruteForce(n) {
  const distinct = new Set();
  for (let x = 1; x <= n; x++) {
    const numStr = x.toString().replace(/0/g, "");
    if (numStr === "") {
      distinct.add(0);
    } else {
      distinct.add(parseInt(numStr, 10));
    }
  }
  return distinct.size;
}
```

```java
// Time: O(n * d) | Space: O(n)
public int bruteForce(int n) {
    Set<Integer> distinct = new HashSet<>();
    for (int x = 1; x <= n; x++) {
        String numStr = Integer.toString(x).replace("0", "");
        if (numStr.isEmpty()) {
            distinct.add(0);
        } else {
            distinct.add(Integer.parseInt(numStr));
        }
    }
    return distinct.size();
}
```

</div>

**Why this fails:** For `n = 10⁹`, we'd need to process a billion numbers, each requiring string conversion and manipulation. At ~10⁹ operations, this would take seconds or minutes — far too slow for typical coding interview constraints (usually 1-2 seconds). We need a smarter approach that doesn't depend on `n` linearly.

## Optimized Approach

The breakthrough realization is that we don't need to check every number from 1 to `n`. Instead, we can think **backwards**: every zero-free number `y` can be "expanded" by inserting zeros into its digits to generate numbers ≤ `n`. The count of distinct `y` equals the count of zero-free numbers that can be expanded to some number ≤ `n`.

Consider zero-free number 123. We can insert zeros between digits to create numbers like 1023, 1203, 1230, 10023, etc. The question becomes: for each zero-free number `y`, can we insert zeros to create a number ≤ `n`?

But checking all zero-free numbers is also infinite. The key optimization: **only zero-free numbers with at most the same number of digits as `n` matter**. Why? Because inserting zeros only increases the digit count or keeps it same. If `y` has more digits than `n`, even without zeros it's already larger than `n`.

So we can:

1. Let `k` = number of digits in `n`
2. Generate all zero-free numbers with up to `k` digits
3. For each such number `y`, check if we can insert zeros between its digits (including at ends) to create a number ≤ `n`

But how to check efficiently? We can use **dynamic programming** with digit DP. The state tracks:

- Current position in `n` (from most significant digit)
- Current position in `y` (the zero-free number we're building)
- Whether we're still matching `n` exactly (tight bound)

However, there's an even cleaner approach: **DFS generation of all zero-free numbers ≤ n** directly. We recursively build numbers by appending digits 1-9, and at each step we can either stop (count this number) or insert zeros (by multiplying by 10, which adds a zero digit). But we must ensure the resulting number ≤ n.

Wait — multiplying by 10 adds a zero at the end, but zeros can be inserted anywhere. Actually, there's a simpler pattern: removing zeros is equivalent to taking the digits of `x` in order, skipping zeros. So the mapping `x → y` is deterministic. The reverse mapping `y → possible x` means: take digits of `y`, insert zeros in any positions (including before first digit) to create `x ≤ n`.

This leads to a **DFS solution**: generate all zero-free numbers `y` by DFS (digits 1-9), and for each `y`, count how many numbers ≤ `n` can be formed by inserting zeros between `y`'s digits. The count for each `y` is the product of choices for each gap between digits.

Let's formalize: Given zero-free number `y` with `m` digits: d₁ d₂ ... dₘ. There are `m+1` gaps (before first digit, between digits, after last digit). In each gap, we can insert 0 to `k` zeros, where `k` depends on the remaining allowed digits to stay ≤ `n`. This becomes complex.

Actually, the cleanest approach is to directly **simulate the zero-removal process via DFS on `n`'s digits**. We traverse the digits of `n` from most to least significant. At each digit position, we either:

- Take the current digit (if non-zero) as part of `y`
- Skip it (if it's zero in `n`, we must skip it in `y`)
- But wait — zeros in `n` are removed when forming `y`, so `y` must match non-zero digits of some prefix of `n`.

The standard solution uses a clever DP: Let `f(pos, tight, started)` = count of distinct `y` that can be formed from digits[pos:] given whether we're still matching `n` (tight) and whether we've started taking non-zero digits (to handle leading zeros). We'll implement this.

## Optimal Solution

The optimal solution uses **digit dynamic programming** with memoization. We process `n` from most significant digit to least, tracking:

- `pos`: current digit position (0 to len(n))
- `tight`: whether we're still exactly matching `n`'s prefix (limits digit choices)
- `started`: whether we've started taking non-zero digits (to avoid counting empty number)

At each step, we can choose digits 0-9, but with constraints:

1. If `tight` is true, we cannot exceed `n`'s current digit
2. If we choose 0 and haven't started, we're still not started (leading zeros)
3. If we choose a non-zero digit, we mark started=true
4. We only add to result when we choose a non-zero digit (or 0 if started=false? Actually we never add 0 since we start from 1)

But we're counting distinct `y`, not numbers ≤ n. Wait — every `y` corresponds to some x ≤ n after adding zeros. Actually, the standard solution is simpler: **Count all numbers from 1 to n that don't contain zero digits**. Why? Because if x has no zeros, removing zeros leaves x itself. If x has zeros, removing zeros gives some y that has no zeros. So the set of distinct results is exactly all numbers with no zero digits that are ≤ some number we can get from n by removing zeros.

The insight: The set {removeZeros(x) for 1 ≤ x ≤ n} equals {y : y has no zero digits and y ≤ f(n)} where f(n) is n with zeros removed? Not exactly — consider n=20, removeZeros(20)=2, but 11 has no zeros and 11 ≤ 20, yet 11 is in the set. So all zero-free numbers ≤ n are in the set. But also numbers > n can be in the set if they come from removing zeros from a larger number? No, if y > n, then any x with removeZeros(x)=y must have x ≥ y > n, so x > n. So y cannot come from any x ≤ n.

Therefore: **The distinct results are exactly all zero-free numbers ≤ n**. Because:

1. If y has no zeros and y ≤ n, then x=y itself gives removeZeros(x)=y
2. If y has zeros, removeZeros(y) gives some z with no zeros, and z ≤ y ≤ n
3. If y has no zeros and y > n, then no x ≤ n can map to y (since removeZeros(x) ≤ x ≤ n < y)

So the problem reduces to: **Count all positive integers ≤ n that contain no zero digit**.

Now we can solve with digit DP counting numbers with digits 1-9 only.

<div class="code-group">

```python
# Time: O(d) where d = number of digits in n (max 10)
# Space: O(d) for recursion depth and memoization
class Solution:
    def countDistinctIntegers(self, n: int) -> int:
        s = str(n)
        # Memoization dictionary: (pos, tight) -> count
        # pos: current digit position (0 to len(s))
        # tight: 1 if we're still matching n's prefix, else 0
        memo = {}

        def dfs(pos, tight):
            """Return count of valid numbers from position pos onward."""
            if pos == len(s):
                # Reached end of number - count this valid number
                return 1

            if (pos, tight) in memo:
                return memo[(pos, tight)]

            limit = int(s[pos]) if tight else 9
            total = 0

            # Try all possible digits at this position
            # For zero-free numbers, digits are 1-9 only
            # But we must also consider the case of having fewer digits than n
            # That's handled by allowing digit 0 only when not tight and we're not at start?
            # Actually simpler: we're counting numbers with digits 1-9 only
            # So we iterate 1-9, and also 0 only if we're allowed to skip this digit
            # But skipping a digit means having fewer digits - that's allowed

            # Actually, the standard approach: at each position, we can choose:
            # 1. Place a digit 1-9 (if ≤ limit when tight)
            # 2. Or place nothing (if not tight, meaning we can have fewer digits)
            # But counting variable-length numbers is tricky.

            # Let's use the standard digit DP for numbers with digits 1-9 only:
            for digit in range(1, 10):
                if digit > limit and tight:
                    break
                new_tight = tight and (digit == limit)
                total += dfs(pos + 1, new_tight)

            # Also count the case where we stop here (have fewer digits)
            # But only if we're not in tight mode (otherwise we'd be missing required digits)
            if not tight:
                # We can stop here - count as 1 valid number (the empty suffix)
                # Actually, we need to be careful: stopping means we've built a complete number
                # with fewer digits than n. That's valid.
                # But we already count that when pos reaches len(s) in base case.
                # So we don't need extra handling.
                pass

            memo[(pos, tight)] = total
            return total

        # Start DFS from position 0, tight=True
        return dfs(0, True)
```

```javascript
// Time: O(d) | Space: O(d) where d = digits in n
function countDistinctIntegers(n) {
  const s = n.toString();
  const memo = new Map();

  function dfs(pos, tight) {
    if (pos === s.length) {
      return 1; // Valid number completed
    }

    const key = `${pos},${tight}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    const limit = tight ? parseInt(s[pos]) : 9;
    let total = 0;

    // Try digits 1-9 at this position
    for (let digit = 1; digit <= 9; digit++) {
      if (digit > limit && tight) break;
      const newTight = tight && digit === limit;
      total += dfs(pos + 1, newTight);
    }

    memo.set(key, total);
    return total;
  }

  return dfs(0, true);
}
```

```java
// Time: O(d) | Space: O(d) where d = digits in n
class Solution {
    public int countDistinctIntegers(int n) {
        String s = Integer.toString(n);
        int[][][] memo = new int[s.length()][2][2];
        for (int i = 0; i < s.length(); i++) {
            for (int j = 0; j < 2; j++) {
                Arrays.fill(memo[i][j], -1);
            }
        }

        return dfs(0, 1, 0, s, memo);
    }

    private int dfs(int pos, int tight, int started, String s, int[][][] memo) {
        if (pos == s.length()) {
            return started == 1 ? 1 : 0;  // Count only if we've started a number
        }

        if (memo[pos][tight][started] != -1) {
            return memo[pos][tight][started];
        }

        int limit = tight == 1 ? s.charAt(pos) - '0' : 9;
        int total = 0;

        // Option 1: Place a digit 1-9
        for (int digit = 1; digit <= 9; digit++) {
            if (digit > limit && tight == 1) break;
            int newTight = (tight == 1 && digit == limit) ? 1 : 0;
            total += dfs(pos + 1, newTight, 1, s, memo);
        }

        // Option 2: Place digit 0 (only if we've already started a number)
        if (started == 1) {
            // Can place 0 only if 0 ≤ limit
            if (0 <= limit) {
                int newTight = (tight == 1 && 0 == limit) ? 1 : 0;
                total += dfs(pos + 1, newTight, 1, s, memo);
            }
        } else {
            // Haven't started yet - skip this digit (equivalent to placing leading 0)
            total += dfs(pos + 1, 0, 0, s, memo);
        }

        memo[pos][tight][started] = total;
        return total;
    }
}
```

</div>

Actually, I made an error in reasoning. Let me correct: The distinct results are NOT simply zero-free numbers ≤ n. Consider n=101. Zero-free numbers ≤ 101 are 1-9, 11-19, ..., 91-99, 101 (but 101 has 0). Actually 101 has zero, so not zero-free. So zero-free numbers ≤ 101 are 1-99 except numbers with 0. But removeZeros(101)=11, which is zero-free and ≤ 101. So all zero-free numbers ≤ 101 are indeed in the set. But also removeZeros(100)=1, which is already counted. So indeed, the set equals all zero-free numbers ≤ n.

Proof: Let S = {removeZeros(x) | 1 ≤ x ≤ n}. Let T = {y | y has no zero digit and y ≤ n}.

1. T ⊆ S: For any y ∈ T, take x=y. Then removeZeros(x)=y since y has no zeros, and x=y ≤ n.
2. S ⊆ T: For any y ∈ S, ∃ x ≤ n with removeZeros(x)=y. Then y has no zeros (by definition of removeZeros). Also y ≤ x ≤ n (since removing digits can't increase value).

Thus S = T. So we just need to count numbers ≤ n with no zero digits.

The corrected simpler solution:

<div class="code-group">

```python
# Time: O(d) where d = digits in n (≤ 10)
# Space: O(d) for recursion
class Solution:
    def countDistinctIntegers(self, n: int) -> int:
        s = str(n)
        memo = {}

        def dfs(pos, tight, started):
            """
            pos: current digit position (0 to len(s))
            tight: whether we're still matching n's prefix
            started: whether we've placed any non-zero digit yet
            Returns count of valid numbers from this state.
            """
            if pos == len(s):
                # Valid if we've started a number (non-empty)
                return 1 if started else 0

            key = (pos, tight, started)
            if key in memo:
                return memo[key]

            limit = int(s[pos]) if tight else 9
            total = 0

            # We can place digits 1-9 at this position
            for digit in range(1, 10):
                if digit > limit:
                    break
                total += dfs(pos + 1, tight and digit == limit, True)

            # We can place digit 0, but only if we've already started a number
            # (to avoid leading zeros)
            if started:
                if 0 <= limit:
                    total += dfs(pos + 1, tight and 0 == limit, True)
            else:
                # Haven't started yet - skip this position (place nothing)
                total += dfs(pos + 1, False, False)

            memo[key] = total
            return total

        return dfs(0, True, False)
```

```javascript
// Time: O(d) | Space: O(d)
function countDistinctIntegers(n) {
  const s = n.toString();
  const memo = new Map();

  function dfs(pos, tight, started) {
    if (pos === s.length) {
      return started ? 1 : 0;
    }

    const key = `${pos},${tight},${started}`;
    if (memo.has(key)) return memo.get(key);

    const limit = tight ? parseInt(s[pos]) : 9;
    let total = 0;

    // Place digits 1-9
    for (let digit = 1; digit <= 9; digit++) {
      if (digit > limit && tight) break;
      total += dfs(pos + 1, tight && digit === limit, true);
    }

    // Place digit 0 or skip
    if (started) {
      if (0 <= limit) {
        total += dfs(pos + 1, tight && 0 === limit, true);
      }
    } else {
      // Skip this digit (leading zero)
      total += dfs(pos + 1, false, false);
    }

    memo.set(key, total);
    return total;
  }

  return dfs(0, true, false);
}
```

```java
// Time: O(d) | Space: O(d)
class Solution {
    public int countDistinctIntegers(int n) {
        String s = Integer.toString(n);
        // memo[pos][tight][started]
        Integer[][][] memo = new Integer[s.length()][2][2];
        return dfs(0, 1, 0, s, memo);
    }

    private int dfs(int pos, int tight, int started, String s, Integer[][][] memo) {
        if (pos == s.length()) {
            return started == 1 ? 1 : 0;
        }

        if (memo[pos][tight][started] != null) {
            return memo[pos][tight][started];
        }

        int limit = tight == 1 ? s.charAt(pos) - '0' : 9;
        int total = 0;

        // Digits 1-9
        for (int digit = 1; digit <= 9; digit++) {
            if (digit > limit && tight == 1) break;
            total += dfs(pos + 1, tight == 1 && digit == limit ? 1 : 0, 1, s, memo);
        }

        // Digit 0 or skip
        if (started == 1) {
            if (0 <= limit) {
                total += dfs(pos + 1, tight == 1 && 0 == limit ? 1 : 0, 1, s, memo);
            }
        } else {
            // Skip (leading zero)
            total += dfs(pos + 1, 0, 0, s, memo);
        }

        memo[pos][tight][started] = total;
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(d × 2 × 2) = O(d) where d is the number of digits in n. Since n ≤ 10⁹, d ≤ 10. The DFS visits each state (pos, tight, started) once, and there are d × 2 × 2 = 4d states. For each state, we iterate through up to 9 digits, but tight limits this. Overall it's O(d).

**Space Complexity:** O(d) for the recursion depth and memoization storage. The memo stores O(d) states, and recursion goes d levels deep.

## Common Mistakes

1. **Brute forcing up to 10⁹:** Candidates often start with the obvious simulation approach without considering constraints. Always check constraints first — if n can be 10⁹, O(n) is usually unacceptable.

2. **Incorrect problem reduction:** Some candidates think the answer is simply n minus count of numbers with zeros, or try to compute n with zeros removed. The key insight that "distinct results = all zero-free numbers ≤ n" needs careful proof.

3. **Digit DP state errors:** Forgetting the `started` flag leads to counting numbers with leading zeros as valid. For example, with n=5, number "05" (which is just 5) might be double-counted. The `started` flag ensures we count each number once.

4. **Off-by-one with zero:** The problem says positive integers from 1 to n. Some candidates include 0 in the count. Our DFS correctly counts only numbers with `started=true`.

## When You'll See This Pattern

Digit dynamic programming appears in many counting problems where you need to count numbers with certain digit properties up to a limit n:

1. **LeetCode 2376 - Count Special Integers**: Count numbers with all distinct digits. Similar digit DP with an additional mask for used digits.

2. **LeetCode 902 - Numbers At Most N Given Digit Set**: Count numbers that can be formed using a given set of digits. Very similar DP structure.

3. **LeetCode 1012 - Numbers With Repeated Digits**: Complement of "numbers with all distinct digits" — another digit DP with mask.

The pattern: When you need to count numbers ≤ n satisfying some digit-based property, and n is large (up to 10⁹ or more), digit DP with state (pos, tight, additional_flags) is the standard approach.

## Key Takeaways

1. **Transform the problem:** Instead of simulating the process on all numbers 1..n, recognize that removing zeros creates a mapping to zero-free numbers. The distinct results are exactly the zero-free numbers ≤ n.

2. **Digit DP for counting:** When counting numbers with digit constraints up to n, use digit DP with state tracking position, tight bound, and any additional needed flags (like `started` for non-empty numbers).

3. **Check constraints first:** With n up to 10⁹, O(n) is impossible. Look for mathematical insights or DP solutions that depend only on the number of digits (log n).

[Practice this problem on CodeJeet](/problem/count-distinct-integers-after-removing-zeros)
