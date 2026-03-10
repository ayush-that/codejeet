---
title: "How to Solve Naming a Company — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Naming a Company. Hard difficulty, 46.5% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation, Enumeration."
date: "2028-03-07"
category: "dsa-patterns"
tags: ["naming-a-company", "array", "hash-table", "string", "hard"]
---

# How to Solve Naming a Company

This problem asks us to count valid company names formed by taking two distinct strings from an array, swapping their first letters, and ensuring both resulting strings are not already in the original list. The challenge lies in efficiently checking millions of potential pairs without brute force enumeration.

## Visual Walkthrough

Let's trace through a small example: `ideas = ["coffee","donuts","time","toffee"]`

We need to find pairs `(ideaA, ideaB)` where:

1. `ideaA` and `ideaB` are different
2. After swapping first letters, both new names are not in `ideas`

Let's try a systematic approach. First, group ideas by their first letter:

- c: ["offee"]
- d: ["onuts"]
- t: ["ime", "offee"]

Now consider swapping letters between groups. For groups `c` and `d`:

- Swap 'c' and 'd': "coffee" → "doffee" (not in ideas), "donuts" → "conuts" (not in ideas)
- This gives 1 valid pair: ("coffee", "donuts")

For groups `c` and `t`:

- "coffee" with "time": "toffee" (in ideas!) → invalid
- "coffee" with "toffee": "toffee" → "coffee" (both already in ideas) → invalid
- No valid pairs

For groups `d` and `t`:

- "donuts" with "time": "tonuts" (not in ideas), "dime" (not in ideas) → valid
- "donuts" with "toffee": "tonuts" (not in ideas), "doffee" (not in ideas) → valid
- This gives 2 valid pairs

Total valid company names: 1 + 0 + 2 = 3

Notice the pattern: We need to compare groups of suffixes (everything after first letter) for each pair of starting letters.

## Brute Force Approach

The brute force solution would check all pairs of ideas directly:

1. For each pair of distinct ideas `(ideaA, ideaB)`
2. Swap their first letters to create `newA` and `newB`
3. Check if both `newA` and `newB` are not in the original list
4. Count valid pairs

<div class="code-group">

```python
# Time: O(n³) | Space: O(n)
def distinctNames_brute(ideas):
    ideas_set = set(ideas)
    count = 0
    n = len(ideas)

    for i in range(n):
        for j in range(i + 1, n):
            # Swap first letters
            new_a = ideas[j][0] + ideas[i][1:]
            new_b = ideas[i][0] + ideas[j][1:]

            # Check if both new names are valid
            if new_a not in ideas_set and new_b not in ideas_set:
                count += 2  # (i,j) and (j,i) are distinct

    return count
```

```javascript
// Time: O(n³) | Space: O(n)
function distinctNamesBrute(ideas) {
  const ideasSet = new Set(ideas);
  let count = 0;
  const n = ideas.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Swap first letters
      const newA = ideas[j][0] + ideas[i].slice(1);
      const newB = ideas[i][0] + ideas[j].slice(1);

      // Check if both new names are valid
      if (!ideasSet.has(newA) && !ideasSet.has(newB)) {
        count += 2; // (i,j) and (j,i) are distinct
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(n)
public long distinctNamesBrute(String[] ideas) {
    Set<String> ideasSet = new HashSet<>();
    for (String idea : ideas) {
        ideasSet.add(idea);
    }

    long count = 0;
    int n = ideas.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Swap first letters
            String newA = ideas[j].charAt(0) + ideas[i].substring(1);
            String newB = ideas[i].charAt(0) + ideas[j].substring(1);

            // Check if both new names are valid
            if (!ideasSet.contains(newA) && !ideasSet.contains(newB)) {
                count += 2;  // (i,j) and (j,i) are distinct
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 50,000, checking O(n²) ≈ 2.5 billion pairs is impossible. Even with O(1) set lookups, this is O(n²) time, which is 2.5 × 10⁹ operations — far too slow.

## Optimized Approach

The key insight is that we only care about the **first letter** and the **suffix** (everything after the first letter). Let's think about what makes a pair invalid:

For ideas `ideaA = c1 + suffix1` and `ideaB = c2 + suffix2`:

- After swapping: `newA = c2 + suffix1` and `newB = c1 + suffix2`
- The pair is invalid if either `newA` or `newB` already exists in `ideas`

This happens when:

1. `c2 + suffix1` exists in `ideas` (suffix1 is already paired with c2)
2. `c1 + suffix2` exists in `ideas` (suffix2 is already paired with c1)

So we need to track, for each starting letter, which suffixes are already "taken" by that letter. Then for each pair of letters (c1, c2), we need to count how many suffixes are:

- In c1's group but NOT in c2's group (can use c1's suffix with c2)
- In c2's group but NOT in c1's group (can use c2's suffix with c1)

The number of valid pairs between groups c1 and c2 is:
`(size1 - overlap) × (size2 - overlap) × 2`

Where:

- `size1` = number of suffixes in c1's group
- `size2` = number of suffixes in c2's group
- `overlap` = number of suffixes in BOTH groups
- Multiply by 2 because (ideaA, ideaB) and (ideaB, ideaA) are distinct

## Optimal Solution

We implement this by:

1. Group ideas by first letter into sets of suffixes
2. For each pair of letters, count the overlap (suffixes in both groups)
3. Calculate valid pairs using the formula above

<div class="code-group">

```python
# Time: O(26×26×n) = O(n) | Space: O(n)
def distinctNames(ideas):
    # Step 1: Group ideas by their first letter
    # We use sets for O(1) lookups when checking overlaps
    groups = [set() for _ in range(26)]

    for idea in ideas:
        first_char = idea[0]
        suffix = idea[1:]
        idx = ord(first_char) - ord('a')
        groups[idx].add(suffix)

    # Step 2: Count valid pairs between all letter pairs
    answer = 0

    # Compare each pair of letters (i, j)
    for i in range(25):  # Only need to go to 25 since j starts from i+1
        for j in range(i + 1, 26):
            # Count suffixes that appear in BOTH groups i and j
            # These suffixes cannot be used in valid swaps
            overlap = 0
            for suffix in groups[i]:
                if suffix in groups[j]:
                    overlap += 1

            # Calculate valid pairs between groups i and j
            # (size_i - overlap): suffixes in i that are NOT in j
            # (size_j - overlap): suffixes in j that are NOT in i
            # Multiply by 2 because (A,B) and (B,A) are distinct
            valid_pairs = (len(groups[i]) - overlap) * (len(groups[j]) - overlap) * 2
            answer += valid_pairs

    return answer
```

```javascript
// Time: O(26×26×n) = O(n) | Space: O(n)
function distinctNames(ideas) {
  // Step 1: Group ideas by their first letter
  // Array of 26 sets, one for each letter a-z
  const groups = Array(26)
    .fill()
    .map(() => new Set());

  for (const idea of ideas) {
    const firstChar = idea[0];
    const suffix = idea.slice(1);
    const idx = firstChar.charCodeAt(0) - "a".charCodeAt(0);
    groups[idx].add(suffix);
  }

  // Step 2: Count valid pairs between all letter pairs
  let answer = 0;

  // Compare each pair of letters (i, j)
  for (let i = 0; i < 25; i++) {
    for (let j = i + 1; j < 26; j++) {
      // Count suffixes that appear in BOTH groups i and j
      let overlap = 0;
      for (const suffix of groups[i]) {
        if (groups[j].has(suffix)) {
          overlap++;
        }
      }

      // Calculate valid pairs between groups i and j
      // (size_i - overlap): suffixes in i that are NOT in j
      // (size_j - overlap): suffixes in j that are NOT in i
      // Multiply by 2 because (A,B) and (B,A) are distinct
      const validPairs = (groups[i].size - overlap) * (groups[j].size - overlap) * 2;
      answer += validPairs;
    }
  }

  return answer;
}
```

```java
// Time: O(26×26×n) = O(n) | Space: O(n)
public long distinctNames(String[] ideas) {
    // Step 1: Group ideas by their first letter
    // Array of 26 HashSets, one for each letter a-z
    Set<String>[] groups = new Set[26];
    for (int i = 0; i < 26; i++) {
        groups[i] = new HashSet<>();
    }

    for (String idea : ideas) {
        char firstChar = idea.charAt(0);
        String suffix = idea.substring(1);
        int idx = firstChar - 'a';
        groups[idx].add(suffix);
    }

    // Step 2: Count valid pairs between all letter pairs
    long answer = 0;

    // Compare each pair of letters (i, j)
    for (int i = 0; i < 25; i++) {
        for (int j = i + 1; j < 26; j++) {
            // Count suffixes that appear in BOTH groups i and j
            long overlap = 0;
            for (String suffix : groups[i]) {
                if (groups[j].contains(suffix)) {
                    overlap++;
                }
            }

            // Calculate valid pairs between groups i and j
            // (size_i - overlap): suffixes in i that are NOT in j
            // (size_j - overlap): suffixes in j that are NOT in i
            // Multiply by 2 because (A,B) and (B,A) are distinct
            long validPairs = (groups[i].size() - overlap) * (groups[j].size() - overlap) * 2;
            answer += validPairs;
        }
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + 26² × m)**

- `n`: Number of ideas (for initial grouping)
- `26²`: Pairs of letters (constant 325 pairs)
- `m`: Average number of suffixes per group (≤ n/26 in worst case)
- In practice, this simplifies to O(n) since 26² is constant

**Space Complexity: O(n)**

- We store all suffixes in the 26 sets
- Total storage is the sum of all suffix lengths, which is O(n) in terms of number of ideas

The key optimization is reducing from O(n²) to O(n) by:

1. Grouping by first letter (26 groups max)
2. Only comparing between groups, not within groups
3. Using the overlap calculation to avoid checking individual pairs

## Common Mistakes

1. **Forgetting to multiply by 2**: Each valid pair (A,B) has a symmetric counterpart (B,A). Many candidates forget this and return half the correct answer.

2. **Incorrect overlap calculation**: Counting overlap requires checking which suffixes are in BOTH groups. Using lists instead of sets makes this O(m²) instead of O(m).

3. **Integer overflow with large counts**: With n=50,000, the answer can exceed 2³¹. Use `long` in Java, `int` is fine in Python, and `Number` in JavaScript (but be aware of precision limits).

4. **Not handling empty groups**: Some letters might have no ideas. The formula still works correctly since `size - overlap = 0` for empty groups.

## When You'll See This Pattern

This problem uses **grouping by prefix/suffix** and **counting valid combinations between groups**:

1. **Group Anagrams (LeetCode 49)**: Group strings by their sorted version or character count.
2. **Palindrome Pairs (LeetCode 336)**: Group words by their prefixes/suffixes to find palindrome pairs.
3. **Count Pairs Of Similar Strings (LeetCode 2506)**: Group by character set, then count pairs between groups.

The core pattern: When direct pair checking is O(n²), look for a way to group elements by some property, then reason about interactions between groups.

## Key Takeaways

1. **Grouping reduces complexity**: When faced with O(n²) pair checking, consider if you can group elements by a key property (first letter, sorted version, etc.) to reduce the search space.

2. **Symmetry in counting problems**: Many counting problems have symmetric cases. Always check if (A,B) and (B,A) should be counted separately.

3. **Overlap exclusion principle**: When counting valid combinations between sets, the formula is often: `(total in A - overlap) × (total in B - overlap)`.

[Practice this problem on CodeJeet](/problem/naming-a-company)
