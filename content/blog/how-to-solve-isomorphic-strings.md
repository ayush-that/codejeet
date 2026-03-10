---
title: "How to Solve Isomorphic Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Isomorphic Strings. Easy difficulty, 48.1% acceptance rate. Topics: Hash Table, String."
date: "2026-05-23"
category: "dsa-patterns"
tags: ["isomorphic-strings", "hash-table", "string", "easy"]
---

# How to Solve Isomorphic Strings

The problem asks us to determine if two strings are isomorphic — meaning each character in the first string can be uniquely mapped to a character in the second string while preserving the order. The tricky part is that the mapping must be **bijective**: each character in `s` maps to exactly one character in `t`, and each character in `t` is mapped from exactly one character in `s`. This prevents ambiguous mappings like `"aa"` → `"ab"` (one character mapping to two) or `"ab"` → `"aa"` (two characters mapping to one).

## Visual Walkthrough

Let's trace through an example step by step: `s = "paper"`, `t = "title"`.

We need to verify that each character in `s` consistently maps to the same character in `t`, and vice versa.

**Step 1:** Process `s[0] = 'p'`, `t[0] = 't'`

- Map `'p'` → `'t'`
- Reverse map `'t'` ← `'p'`

**Step 2:** Process `s[1] = 'a'`, `t[1] = 'i'`

- Map `'a'` → `'i'`
- Reverse map `'i'` ← `'a'`

**Step 3:** Process `s[2] = 'p'`, `t[2] = 't'`

- Check: `'p'` already maps to `'t'` ✓
- Check: `'t'` should map back to `'p'` (it does) ✓

**Step 4:** Process `s[3] = 'e'`, `t[3] = 'l'`

- Map `'e'` → `'l'`
- Reverse map `'l'` ← `'e'`

**Step 5:** Process `s[4] = 'r'`, `t[4] = 'e'`

- Map `'r'` → `'e'`
- Reverse map `'e'` ← `'r'`

All mappings are consistent, so `"paper"` and `"title"` are isomorphic.

Now consider a counterexample: `s = "foo"`, `t = "bar"`

**Step 1:** `'f'` → `'b'`, `'b'` ← `'f'`
**Step 2:** `'o'` → `'a'`, `'a'` ← `'o'`
**Step 3:** `'o'` → `'r'` — but `'o'` already maps to `'a'`! Violation.

Another counterexample: `s = "badc"`, `t = "baba"`

**Step 1:** `'b'` → `'b'`, `'b'` ← `'b'`
**Step 2:** `'a'` → `'a'`, `'a'` ← `'a'`
**Step 3:** `'d'` → `'b'`, but `'b'` already maps back to `'b'` (not `'d'`)! Violation.

## Brute Force Approach

A naive approach might try to generate all possible character mappings and test them, but that's exponential and impractical. Another brute force idea is to check each position `i` in `s` and verify that for all positions `j` where `s[j] == s[i]`, we have `t[j] == t[i]`, and vice versa. This would be O(n²) time complexity — checking each character against all others.

```python
def isIsomorphicBrute(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    for i in range(len(s)):
        for j in range(i, len(s)):
            # If characters at i and j are equal in s,
            # they must be equal in t
            if s[i] == s[j] and t[i] != t[j]:
                return False
            # If characters at i and j are equal in t,
            # they must be equal in s
            if t[i] == t[j] and s[i] != s[j]:
                return False
    return True
```

While this works, the O(n²) time complexity is inefficient for longer strings. We can do better with a single pass using hash maps.

## Optimal Solution

The optimal solution uses two hash maps (dictionaries) to track the mappings in both directions. We iterate through the strings once, checking and updating the mappings as we go. If at any point we find a conflict (a character in `s` trying to map to a different character in `t` than previously established, or a character in `t` being mapped from a different character in `s`), we return `false`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) — since character set is limited (ASCII/Unicode)
def isIsomorphic(s: str, t: str) -> bool:
    # If lengths differ, they can't be isomorphic
    if len(s) != len(t):
        return False

    # Create two dictionaries to store mappings
    # s_to_t maps characters from s to t
    # t_to_s maps characters from t to s
    s_to_t = {}
    t_to_s = {}

    # Iterate through each character pair
    for char_s, char_t in zip(s, t):
        # Check if char_s is already mapped to a different char_t
        if char_s in s_to_t:
            if s_to_t[char_s] != char_t:
                return False
        else:
            # If char_s is not mapped yet, create the mapping
            s_to_t[char_s] = char_t

        # Check if char_t is already mapped from a different char_s
        if char_t in t_to_s:
            if t_to_s[char_t] != char_s:
                return False
        else:
            # If char_t is not mapped yet, create the reverse mapping
            t_to_s[char_t] = char_s

    # If we processed all characters without conflicts, strings are isomorphic
    return True
```

```javascript
// Time: O(n) | Space: O(1) — character set is limited
function isIsomorphic(s, t) {
  // If lengths differ, they can't be isomorphic
  if (s.length !== t.length) return false;

  // Create two maps to store mappings
  // sToT maps characters from s to t
  // tToS maps characters from t to s
  const sToT = new Map();
  const tToS = new Map();

  // Iterate through each character pair
  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];

    // Check if charS is already mapped to a different charT
    if (sToT.has(charS)) {
      if (sToT.get(charS) !== charT) return false;
    } else {
      // If charS is not mapped yet, create the mapping
      sToT.set(charS, charT);
    }

    // Check if charT is already mapped from a different charS
    if (tToS.has(charT)) {
      if (tToS.get(charT) !== charS) return false;
    } else {
      // If charT is not mapped yet, create the reverse mapping
      tToS.set(charT, charS);
    }
  }

  // If we processed all characters without conflicts, strings are isomorphic
  return true;
}
```

```java
// Time: O(n) | Space: O(1) — character set is limited (ASCII/Unicode)
class Solution {
    public boolean isIsomorphic(String s, String t) {
        // If lengths differ, they can't be isomorphic
        if (s.length() != t.length()) return false;

        // Create two maps to store mappings
        // sToT maps characters from s to t
        // tToS maps characters from t to s
        Map<Character, Character> sToT = new HashMap<>();
        Map<Character, Character> tToS = new HashMap<>();

        // Iterate through each character pair
        for (int i = 0; i < s.length(); i++) {
            char charS = s.charAt(i);
            char charT = t.charAt(i);

            // Check if charS is already mapped to a different charT
            if (sToT.containsKey(charS)) {
                if (sToT.get(charS) != charT) return false;
            } else {
                // If charS is not mapped yet, create the mapping
                sToT.put(charS, charT);
            }

            // Check if charT is already mapped from a different charS
            if (tToS.containsKey(charT)) {
                if (tToS.get(charT) != charS) return false;
            } else {
                // If charT is not mapped yet, create the reverse mapping
                tToS.put(charT, charS);
            }
        }

        // If we processed all characters without conflicts, strings are isomorphic
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the strings. We make a single pass through both strings, performing constant-time operations (hash map lookups and inserts) at each step.

**Space Complexity:** O(1) in theory, or O(k) where k is the size of the character set. Since there are only a finite number of possible characters (256 for extended ASCII, 149,186 for Unicode 15.1), the space used by our hash maps is bounded by a constant. In practice, interviewers accept O(1) space complexity for this solution.

## Common Mistakes

1. **Using only one hash map:** Many candidates check the forward mapping (`s → t`) but forget to check the reverse mapping (`t → s`). This leads to false positives for cases like `s = "ab"`, `t = "aa"`. With only one map, `'a' → 'a'` and `'b' → 'a'` would be accepted, but this violates the "no two characters may map to the same character" rule.

2. **Not checking string lengths first:** If the strings have different lengths, they cannot be isomorphic. While our algorithm would eventually fail during iteration (since we can't pair all characters), checking lengths upfront is cleaner and more efficient.

3. **Confusing character positions with mappings:** Some candidates try to compare the first occurrence indices of characters using `indexOf()` or similar methods. While this can work (comparing the pattern of indices), it's less intuitive and can be O(n²) if implemented naively. The two-map approach is clearer and more efficient.

4. **Assuming ASCII-only input:** While our solution works for any Unicode characters, some candidates optimize for ASCII by using arrays of size 256. This is fine but should be mentioned as an assumption. The hash map approach is more general.

## When You'll See This Pattern

The "bijective mapping with two hash maps" pattern appears in several related problems:

1. **Word Pattern (LeetCode 290):** Almost identical to isomorphic strings but with words instead of characters. You map pattern characters to words and words back to pattern characters using two hash maps.

2. **Find and Replace Pattern (LeetCode 890):** Given a list of words and a pattern, return all words that match the pattern. The core logic is exactly the same as isomorphic strings — check if a word is isomorphic to the pattern.

3. **Isomorphic Strings variations:** Any problem requiring verification of a one-to-one correspondence between two sequences uses this pattern. This includes checking if two trees are isomorphic (though that's more complex) or if two sequences follow the same relational pattern.

## Key Takeaways

1. **Bijective mappings require two checks:** When you need to ensure a one-to-one correspondence between two sets, always maintain mappings in both directions. A single hash map isn't enough to prevent collisions in the reverse direction.

2. **Pattern recognition over content:** Isomorphic problems focus on the relational structure between elements rather than the elements themselves. Two sequences are isomorphic if they have the same "shape" or pattern of repetitions.

3. **Early validation saves time:** Check for obvious mismatches (like different lengths) before starting the main algorithm. This demonstrates attention to edge cases and can save unnecessary computation.

Related problems: [Word Pattern](/problem/word-pattern), [Find and Replace Pattern](/problem/find-and-replace-pattern)
