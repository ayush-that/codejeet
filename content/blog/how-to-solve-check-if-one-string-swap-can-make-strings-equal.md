---
title: "How to Solve Check if One String Swap Can Make Strings Equal — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if One String Swap Can Make Strings Equal. Easy difficulty, 49.5% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-12-20"
category: "dsa-patterns"
tags:
  ["check-if-one-string-swap-can-make-strings-equal", "hash-table", "string", "counting", "easy"]
---

# How to Solve "Check if One String Swap Can Make Strings Equal"

This problem asks whether we can make two equal-length strings identical by swapping at most one pair of characters in one of them. What makes it interesting is that we need to detect not just if the strings are already equal, but whether a single swap can fix their differences. The challenge lies in efficiently identifying the exact conditions under which one swap is sufficient.

## Visual Walkthrough

Let's trace through an example: `s1 = "bank"`, `s2 = "kanb"`.

1. **Compare characters position by position:**
   - Position 0: `s1[0] = 'b'`, `s2[0] = 'k'` → mismatch
   - Position 1: `s1[1] = 'a'`, `s2[1] = 'a'` → match
   - Position 2: `s1[2] = 'n'`, `s2[2] = 'n'` → match
   - Position 3: `s1[3] = 'k'`, `s2[3] = 'b'` → mismatch

2. **Collect mismatches:** We find mismatches at indices 0 and 3.

3. **Check swap condition:** For a single swap to fix both strings, we need exactly two mismatches where `s1[0] == s2[3]` and `s1[3] == s2[0]`. Let's verify:
   - `s1[0] = 'b'` equals `s2[3] = 'b'` ✓
   - `s1[3] = 'k'` equals `s2[0] = 'k'` ✓

4. **Conclusion:** Swapping positions 0 and 3 in either string would make them equal, so we return `true`.

Now consider `s1 = "attack"`, `s2 = "defend"`:

- We find many mismatches (more than 2), so no single swap can fix all differences → return `false`.

## Brute Force Approach

A naive approach would be to actually try all possible swaps in one string and check if it equals the other string. For each pair of indices `(i, j)` in `s1`, we could swap `s1[i]` and `s1[j]`, compare with `s2`, then swap back. This would require O(n²) swaps and O(n) comparisons for each, resulting in O(n³) time complexity — far too slow for longer strings.

Even a slightly better brute force would be to find all mismatched indices, then try swapping every pair of mismatched characters. But this still has unnecessary complexity when we can solve the problem with a single pass.

## Optimal Solution

The optimal solution uses a single pass to collect mismatches and then checks specific conditions. Here's the reasoning:

1. **If strings are already equal:** Return `true` immediately (0 swaps needed).
2. **Find all indices where characters differ:** Store them in a list.
3. **Check mismatch count:**
   - If there are exactly 2 mismatches: Check if swapping them would make strings equal (i.e., `s1[i] == s2[j]` and `s1[j] == s2[i]`).
   - If there are 0 mismatches: Already equal (return `true`).
   - If there are more than 2 mismatches: Cannot fix with one swap (return `false`).
4. **Edge case:** What if there are exactly 2 mismatches but swapping doesn't fix them? Then return `false`.

Here's the implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) (mismatches list has at most 2 elements)
def areAlmostEqual(s1: str, s2: str) -> bool:
    # If strings are already identical, we need 0 swaps
    if s1 == s2:
        return True

    # Find all indices where characters differ
    mismatches = []
    for i in range(len(s1)):
        if s1[i] != s2[i]:
            mismatches.append(i)
            # Early exit: if we have more than 2 mismatches, one swap can't fix it
            if len(mismatches) > 2:
                return False

    # For one swap to work, we need exactly 2 mismatches
    if len(mismatches) != 2:
        return False

    # Get the two mismatch indices
    i, j = mismatches[0], mismatches[1]

    # Check if swapping these positions would make strings equal
    # This requires: s1[i] == s2[j] AND s1[j] == s2[i]
    return s1[i] == s2[j] and s1[j] == s2[i]
```

```javascript
// Time: O(n) | Space: O(1) (mismatches array has at most 2 elements)
function areAlmostEqual(s1, s2) {
  // If strings are already identical, we need 0 swaps
  if (s1 === s2) return true;

  // Find all indices where characters differ
  const mismatches = [];
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      mismatches.push(i);
      // Early exit: if we have more than 2 mismatches, one swap can't fix it
      if (mismatches.length > 2) return false;
    }
  }

  // For one swap to work, we need exactly 2 mismatches
  if (mismatches.length !== 2) return false;

  // Get the two mismatch indices
  const [i, j] = mismatches;

  // Check if swapping these positions would make strings equal
  // This requires: s1[i] === s2[j] AND s1[j] === s2[i]
  return s1[i] === s2[j] && s1[j] === s2[i];
}
```

```java
// Time: O(n) | Space: O(1) (mismatches list has at most 2 elements)
class Solution {
    public boolean areAlmostEqual(String s1, String s2) {
        // If strings are already identical, we need 0 swaps
        if (s1.equals(s2)) return true;

        // Find all indices where characters differ
        List<Integer> mismatches = new ArrayList<>();
        for (int i = 0; i < s1.length(); i++) {
            if (s1.charAt(i) != s2.charAt(i)) {
                mismatches.add(i);
                // Early exit: if we have more than 2 mismatches, one swap can't fix it
                if (mismatches.size() > 2) return false;
            }
        }

        // For one swap to work, we need exactly 2 mismatches
        if (mismatches.size() != 2) return false;

        // Get the two mismatch indices
        int i = mismatches.get(0);
        int j = mismatches.get(1);

        // Check if swapping these positions would make strings equal
        // This requires: s1[i] == s2[j] AND s1[j] == s2[i]
        return s1.charAt(i) == s2.charAt(j) && s1.charAt(j) == s2.charAt(i);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the strings. We make a single pass through the strings to find mismatches. The early exit when we find more than 2 mismatches doesn't change the worst-case big-O, but improves practical performance.

**Space Complexity:** O(1). We only store at most 2 indices in the mismatches list/array, regardless of input size. Some might argue it's O(n) if we don't early exit, but with the early exit optimization, we guarantee at most 3 elements in the collection.

## Common Mistakes

1. **Forgetting the "already equal" case:** Some candidates jump straight into finding mismatches without checking if `s1 == s2`. This returns `false` for identical strings, which is wrong since 0 swaps is allowed.

2. **Not checking the swap condition properly:** With exactly 2 mismatches at indices `i` and `j`, candidates might check `s1[i] == s1[j]` and `s2[i] == s2[j]` instead of the correct cross-check: `s1[i] == s2[j]` and `s1[j] == s2[i]`.

3. **Missing the early exit optimization:** Without checking `if len(mismatches) > 2: return false`, the code continues scanning the entire string even after finding 3+ mismatches. This doesn't affect correctness but shows less efficient thinking.

4. **Assuming indices must be different:** The problem states "choose two indices in a string (not necessarily different)", meaning swapping a character with itself is allowed. However, this case is already covered by the "strings are equal" check, so no special handling is needed.

## When You'll See This Pattern

This "mismatch tracking and validation" pattern appears in several string comparison problems:

1. **Buddy Strings (LeetCode 859):** Almost identical to this problem but with an additional twist: when strings are equal, you need to check if there's a duplicate character that could be swapped with itself.

2. **Make Number of Distinct Characters Equal (LeetCode 2531):** Requires comparing character frequencies and considering swaps between strings, using similar mismatch analysis.

3. **One Edit Distance (LeetCode 161):** While not about swaps, it uses similar single-pass comparison with early exit when differences exceed a threshold.

The core pattern is: **scan while tracking differences, validate against constraints, and early exit when constraints are violated.**

## Key Takeaways

1. **Single pass with early exit is key:** For problems with constraints like "at most one operation", you can often scan once and exit early when you exceed the constraint.

2. **Cross-validation for swaps:** When checking if a swap fixes mismatches, remember to cross-check: `s1[i]` with `s2[j]` AND `s1[j]` with `s2[i]`.

3. **Consider all constraint cases:** Always check the boundary cases: 0 differences (already equal), exactly the right number of differences (validate fix), and too many differences (impossible).

Related problems: [Buddy Strings](/problem/buddy-strings), [Make Number of Distinct Characters Equal](/problem/make-number-of-distinct-characters-equal), [Count Almost Equal Pairs I](/problem/count-almost-equal-pairs-i)
