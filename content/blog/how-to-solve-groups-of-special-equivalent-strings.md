---
title: "How to Solve Groups of Special-Equivalent Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Groups of Special-Equivalent Strings. Medium difficulty, 73.5% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2028-05-06"
category: "dsa-patterns"
tags: ["groups-of-special-equivalent-strings", "array", "hash-table", "string", "medium"]
---

# How to Solve Groups of Special-Equivalent Strings

This problem asks us to count how many unique "special-equivalent" groups exist in an array of equal-length strings. Two strings are special-equivalent if you can rearrange their characters at even indices with each other, and odd indices with each other, to make them identical. What makes this tricky is recognizing that we're essentially comparing the **multisets** of characters at even positions and odd positions separately, not the strings directly.

## Visual Walkthrough

Let's trace through a small example: `words = ["abcd", "cbad", "bdac", "acbd"]`

**Step 1:** For each string, we need to understand what makes it special-equivalent to others.

Take `"abcd"`:

- Even indices (0, 2): characters are `'a'` and `'c'`
- Odd indices (1, 3): characters are `'b'` and `'d'`

**Step 2:** The key insight: We can rearrange even-position characters among themselves, and odd-position characters among themselves. So `"abcd"` can become `"cbad"` by swapping the `'a'` and `'c'` at even positions.

**Step 3:** For `"bdac"`:

- Even indices: `'b'` and `'a'`
- Odd indices: `'d'` and `'c'`

Even though `"bdac"` looks different from `"abcd"`, let's check if they're special-equivalent:

- Even positions in `"abcd"`: `{'a', 'c'}`
- Even positions in `"bdac"`: `{'b', 'a'}`
  These sets don't match, so they're NOT special-equivalent.

**Step 4:** For `"acbd"`:

- Even indices: `'a'` and `'b'`
- Odd indices: `'c'` and `'d'`

Compare with `"abcd"`:

- Even: `{'a', 'c'}` vs `{'a', 'b'}` → Different
  So `"acbd"` is in a different group.

**Step 5:** We find that `"abcd"` and `"cbad"` are in one group, while `"bdac"` and `"acbd"` are each in their own groups. That's 3 total groups.

## Brute Force Approach

A naive approach would be to try all possible swaps within even and odd indices for each string, generating all reachable permutations, then grouping strings that share any permutation.

Why this fails:

1. **Combinatorial explosion**: For a string of length `n`, there are `(n/2)! × (n/2)!` possible permutations (if `n` is even). That's factorial growth!
2. **Comparison overhead**: We'd need to compare each string's set of permutations with others, which is `O(m² × P)` where `m` is number of strings and `P` is number of permutations.
3. **Memory blowup**: Storing all permutations for each string would use enormous memory.

Even for modest `n=10`, we'd have `5! × 5! = 120 × 120 = 14,400` permutations per string. With 100 strings, that's 1.44 million permutations to store and compare.

## Optimized Approach

The key insight is that **two strings are special-equivalent if and only if they have the same multiset of characters at even indices AND the same multiset of characters at odd indices**.

Why? Because:

1. We can freely rearrange characters within even indices → only the collection matters, not their order
2. Same for odd indices
3. Even and odd indices can't mix → they must be considered separately

Therefore, we can create a **signature** for each string that captures:

- The sorted characters at even indices
- The sorted characters at odd indices

Strings with the same signature belong to the same group. The number of unique signatures equals the number of groups.

**Step-by-step reasoning:**

1. For each string, separate characters at even and odd indices
2. Sort each group (even and odd) alphabetically
3. Combine them into a canonical form like `"even_chars|odd_chars"`
4. Use a set to track unique signatures
5. The size of the set is our answer

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k log k) where n = len(words), k = len(words[0])
# Space: O(n) for the set of signatures
def numSpecialEquivGroups(words):
    """
    Count groups of special-equivalent strings.

    Two strings are special-equivalent if we can swap characters
    at even indices with each other, and characters at odd indices
    with each other, to make them identical.

    Approach: Create a signature for each string by sorting
    its even-index characters and odd-index characters separately,
    then combining them. Strings with the same signature are
    in the same group.
    """
    # Set to store unique signatures
    signatures = set()

    for word in words:
        # Step 1: Separate even and odd index characters
        # Using list comprehensions for clarity
        even_chars = [word[i] for i in range(0, len(word), 2)]
        odd_chars = [word[i] for i in range(1, len(word), 2)]

        # Step 2: Sort each group to create canonical form
        # Sorting eliminates the effect of allowed swaps
        even_chars.sort()
        odd_chars.sort()

        # Step 3: Create signature by combining sorted groups
        # Using tuple for hashability, '|' separator for clarity
        signature = (''.join(even_chars), ''.join(odd_chars))

        # Step 4: Add to set (duplicates automatically ignored)
        signatures.add(signature)

    # Number of unique signatures = number of groups
    return len(signatures)
```

```javascript
// Time: O(n * k log k) where n = words.length, k = words[0].length
// Space: O(n) for the set of signatures
function numSpecialEquivGroups(words) {
  /**
   * Count groups of special-equivalent strings.
   *
   * Approach: For each word, extract characters at even and odd indices,
   * sort them separately, and create a signature string. Strings with
   * the same signature are in the same group.
   */
  const signatures = new Set();

  for (const word of words) {
    // Step 1: Collect even and odd index characters
    const evenChars = [];
    const oddChars = [];

    for (let i = 0; i < word.length; i++) {
      if (i % 2 === 0) {
        evenChars.push(word[i]);
      } else {
        oddChars.push(word[i]);
      }
    }

    // Step 2: Sort each group to create canonical form
    evenChars.sort();
    oddChars.sort();

    // Step 3: Create signature by combining sorted groups
    // Using template literal with separator for clarity
    const signature = `${evenChars.join("")}|${oddChars.join("")}`;

    // Step 4: Add to set (duplicates automatically ignored)
    signatures.add(signature);
  }

  // Number of unique signatures = number of groups
  return signatures.size;
}
```

```java
// Time: O(n * k log k) where n = words.length, k = words[0].length()
// Space: O(n) for the set of signatures
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;

class Solution {
    public int numSpecialEquivGroups(String[] words) {
        /**
         * Count groups of special-equivalent strings.
         *
         * Approach: For each word, separate characters at even and odd indices,
         * sort them separately, and create a signature. Strings with the same
         * signature belong to the same group.
         */
        Set<String> signatures = new HashSet<>();

        for (String word : words) {
            // Step 1: Separate even and odd index characters
            // Using StringBuilder for efficient character collection
            StringBuilder evenChars = new StringBuilder();
            StringBuilder oddChars = new StringBuilder();

            for (int i = 0; i < word.length(); i++) {
                if (i % 2 == 0) {
                    evenChars.append(word.charAt(i));
                } else {
                    oddChars.append(word.charAt(i));
                }
            }

            // Step 2: Convert to char array, sort, and back to string
            char[] evenArray = evenChars.toString().toCharArray();
            char[] oddArray = oddChars.toString().toCharArray();
            Arrays.sort(evenArray);
            Arrays.sort(oddArray);

            // Step 3: Create signature by combining sorted groups
            // Using "|" separator to ensure uniqueness
            String signature = new String(evenArray) + "|" + new String(oddArray);

            // Step 4: Add to set (duplicates automatically ignored)
            signatures.add(signature);
        }

        // Number of unique signatures = number of groups
        return signatures.size;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n × k log k)` where:

- `n` is the number of strings in `words`
- `k` is the length of each string (all strings have same length)

Why? For each of the `n` strings:

1. We iterate through all `k` characters to separate even/odd: `O(k)`
2. We sort the even characters (at most `k/2` elements) and odd characters (at most `k/2` elements): `O((k/2) log(k/2) + (k/2) log(k/2)) = O(k log k)`
3. Creating the signature and adding to set: `O(k)`

Total: `O(n × (k + k log k + k)) = O(n × k log k)`

**Space Complexity:** `O(n × k)` in the worst case where:

- Each string has a unique signature
- We store all `n` signatures in the set
- Each signature has length `k` (or slightly less)

The auxiliary space for sorting is `O(k)` per string, but this is reused.

## Common Mistakes

1. **Forgetting that characters can repeat**: Some candidates use sets instead of multisets, failing on inputs like `["aa", "bb"]`. These should be in different groups because `'a'` appears twice at even indices in the first string, while `'b'` appears twice at even indices in the second. Sorting handles this correctly.

2. **Mixing even and odd positions in the signature**: Creating a signature by sorting the entire string would incorrectly group `"abcd"` and `"acbd"` together. Remember: even and odd positions can't swap with each other!

3. **Not handling odd-length strings correctly**: When a string has odd length, there's one more even-index character than odd-index character. The solution handles this naturally because we collect indices with step 2 (Python) or modulo check (JS/Java).

4. **Using inefficient data structures for the signature**: Some candidates try to use lists or unsorted strings as signatures, which won't work correctly because `["ac", "ca"]` should be in the same group (even positions: `'a'` and `'c'`, odd positions: none).

## When You'll See This Pattern

This problem uses the **"canonical form"** or **"normalization"** pattern, where we transform each element into a standard representation that captures equivalence under allowed operations.

Related problems:

1. **Group Anagrams (LeetCode 49)**: Similar idea - anagrams are equivalent under character rearrangement, so we use sorted string as canonical form.
2. **Isomorphic Strings (LeetCode 205)**: Uses character mapping to create canonical forms for comparison.
3. **Bulls and Cows (LeetCode 299)**: Requires counting character frequencies separately for different conditions.

The core technique: When elements are equivalent under certain transformations, find an invariant property that's preserved by those transformations but differs between non-equivalent elements. Use that invariant as a signature.

## Key Takeaways

1. **Look for invariants**: When a problem allows certain operations (like swapping), ask: "What properties remain unchanged?" Here, the multiset of even-index characters and multiset of odd-index characters are invariants.

2. **Canonical forms simplify grouping**: Instead of comparing all pairs directly, transform each element to a canonical form that makes equivalence checking trivial (just check equality).

3. **Separate constraints**: When different parts of the problem have independent constraints (even vs odd indices here), handle them separately in your solution.

[Practice this problem on CodeJeet](/problem/groups-of-special-equivalent-strings)
