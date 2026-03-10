---
title: "How to Solve Number of Equivalent Domino Pairs — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Equivalent Domino Pairs. Easy difficulty, 60.6% acceptance rate. Topics: Array, Hash Table, Counting."
date: "2028-10-01"
category: "dsa-patterns"
tags: ["number-of-equivalent-domino-pairs", "array", "hash-table", "counting", "easy"]
---

# How to Solve Number of Equivalent Domino Pairs

This problem asks us to count pairs of dominoes that are equivalent — meaning they have the same numbers in either the same order or reversed order. What makes this interesting is that we need to handle both orientations of each domino while efficiently counting pairs without checking every possible combination.

## Visual Walkthrough

Let's trace through an example: `dominoes = [[1,2],[2,1],[3,4],[2,1]]`

We need to count pairs `(i, j)` where `i < j` and dominoes are equivalent. Let's think about what this means:

1. `[1,2]` is equivalent to `[2,1]` because we can rotate the second domino
2. `[2,1]` appears twice, so those two dominoes form a pair
3. `[3,4]` has no equivalent dominoes

Let's count systematically:

- `[1,2]` with `[2,1]` → 1 pair
- `[1,2]` with second `[2,1]` → 1 pair
- `[2,1]` with second `[2,1]` → 1 pair
- Total: 3 pairs

But checking every pair would mean comparing 4×3/2 = 6 pairs. For n dominoes, that's O(n²) comparisons. We need a smarter way: instead of comparing dominoes to each other, we can normalize each domino to a standard form and count how many times each normalized form appears.

For normalization, we can always put the smaller number first: `[1,2]` stays `[1,2]`, `[2,1]` becomes `[1,2]`. Now all equivalent dominoes have the same normalized form!

After normalization:

- `[1,2]` → `[1,2]` (appears 3 times)
- `[3,4]` → `[3,4]` (appears 1 time)

If we have k dominoes with the same normalized form, they form k×(k-1)/2 pairs. So:

- For `[1,2]`: 3×2/2 = 3 pairs
- For `[3,4]`: 1×0/2 = 0 pairs
- Total: 3 pairs ✓

## Brute Force Approach

The brute force solution checks every pair `(i, j)` where `i < j` and tests if they're equivalent:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numEquivDominoPairs(dominoes):
    count = 0
    n = len(dominoes)

    for i in range(n):
        for j in range(i + 1, n):
            a, b = dominoes[i]
            c, d = dominoes[j]
            # Check both orientations
            if (a == c and b == d) or (a == d and b == c):
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numEquivDominoPairs(dominoes) {
  let count = 0;
  const n = dominoes.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const [a, b] = dominoes[i];
      const [c, d] = dominoes[j];
      // Check both orientations
      if ((a === c && b === d) || (a === d && b === c)) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numEquivDominoPairs(int[][] dominoes) {
    int count = 0;
    int n = dominoes.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int a = dominoes[i][0], b = dominoes[i][1];
            int c = dominoes[j][0], d = dominoes[j][1];
            // Check both orientations
            if ((a == c && b == d) || (a == d && b == c)) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** For n = 10⁴ dominoes, we'd need to check about 50 million pairs (10⁴ × 10⁴ / 2), which is too slow. The problem constraints require O(n) or O(n log n) time.

## Optimal Solution

The key insight is to normalize each domino to a canonical form, then use combinatorics to count pairs. We can:

1. Normalize each domino by putting the smaller number first
2. Count occurrences of each normalized domino using a hash map
3. For each count k, add k×(k-1)/2 to the total (number of pairs from k items)

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def numEquivDominoPairs(dominoes):
    # Step 1: Create a dictionary to count normalized dominoes
    # We'll use a tuple (min, max) as the key
    count_map = {}

    # Step 2: Process each domino
    for a, b in dominoes:
        # Normalize: always put smaller number first
        key = (min(a, b), max(a, b))

        # Step 3: Update count in dictionary
        count_map[key] = count_map.get(key, 0) + 1

    # Step 4: Calculate total pairs
    total_pairs = 0

    # Step 5: For each count, calculate number of pairs
    for count in count_map.values():
        # Formula: n choose 2 = n*(n-1)/2
        total_pairs += count * (count - 1) // 2

    return total_pairs
```

```javascript
// Time: O(n) | Space: O(n)
function numEquivDominoPairs(dominoes) {
  // Step 1: Create a map to count normalized dominoes
  const countMap = new Map();

  // Step 2: Process each domino
  for (const [a, b] of dominoes) {
    // Step 3: Normalize: always put smaller number first
    const key = `${Math.min(a, b)},${Math.max(a, b)}`;

    // Step 4: Update count in map
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  // Step 5: Calculate total pairs
  let totalPairs = 0;

  // Step 6: For each count, calculate number of pairs
  for (const count of countMap.values()) {
    // Formula: n choose 2 = n*(n-1)/2
    totalPairs += (count * (count - 1)) / 2;
  }

  return totalPairs;
}
```

```java
// Time: O(n) | Space: O(n)
public int numEquivDominoPairs(int[][] dominoes) {
    // Step 1: Create a map to count normalized dominoes
    // Use an array since domino values are 1-9, so we can map to 0-99
    int[] count = new int[100];

    // Step 2: Process each domino
    for (int[] domino : dominoes) {
        int a = domino[0], b = domino[1];

        // Step 3: Normalize: always put smaller number first
        int key = Math.min(a, b) * 10 + Math.max(a, b);

        // Step 4: Update count
        count[key]++;
    }

    // Step 5: Calculate total pairs
    int totalPairs = 0;

    // Step 6: For each count, calculate number of pairs
    for (int c : count) {
        if (c > 1) {
            // Formula: n choose 2 = n*(n-1)/2
            totalPairs += c * (c - 1) / 2;
        }
    }

    return totalPairs;
}
```

</div>

**Step-by-step explanation:**

1. **Normalization**: By putting the smaller number first, both `[1,2]` and `[2,1]` become `[1,2]`. This ensures equivalent dominoes have identical keys.
2. **Counting**: We track how many times each normalized domino appears.
3. **Pair calculation**: If k dominoes share the same normalized form, they form k×(k-1)/2 pairs (choose 2 from k).
4. **Efficiency**: We process each domino once (O(n)) and use O(n) space for the counts.

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the dominoes list once: O(n)
- For each domino, normalization takes O(1) time (just min/max operations)
- Final pair calculation iterates through unique normalized forms: at most O(n) but typically much less
- Total: O(n)

**Space Complexity: O(n)**

- In the worst case, all dominoes are unique, so we store n entries in our count map
- The Java array solution uses O(100) = O(1) space since values are limited to 1-9
- Python/JavaScript: O(u) where u is number of unique normalized dominoes

## Common Mistakes

1. **Forgetting to handle both orientations**: Some candidates only check `(a==c and b==d)` but forget `(a==d and b==c)`. Always read the equivalence definition carefully.

2. **Double counting pairs**: When using the combinatorial formula, remember it's k×(k-1)/2, not k² or k×(k+1)/2. For 3 items: pairs are (1,2), (1,3), (2,3) = 3 pairs = 3×2/2.

3. **Inefficient key generation**: Using the domino array itself as a key (like `[min, max]`) can work but may be slower. In Python, convert to tuple; in JavaScript, use string concatenation; in Java, consider integer encoding.

4. **Not handling empty or single-element lists**: The formula k×(k-1)/2 correctly gives 0 for k=0 or k=1, but make sure your loop doesn't crash on empty input.

## When You'll See This Pattern

This "normalize and count" pattern appears in many grouping/counting problems:

1. **Group Anagrams (LeetCode 49)**: Normalize each word by sorting its letters, then group words with the same normalized form.

2. **Valid Anagram (LeetCode 242)**: Count character frequencies - similar to counting domino occurrences.

3. **Two Sum (LeetCode 1)**: While not identical, it also uses a hash map to avoid O(n²) comparisons by storing what we've seen so far.

4. **Find All Duplicates in an Array (LeetCode 442)**: Uses counting/grouping techniques to identify duplicates efficiently.

The core idea: when you need to find pairs/groups based on some equivalence relation, define a canonical representation that all equivalent items map to, then count occurrences.

## Key Takeaways

1. **Normalization is powerful**: When dealing with equivalence relations (like domino rotation), find a canonical form that all equivalent items share. This transforms the problem into simple counting.

2. **Combinatorics beats brute force**: Instead of checking all O(n²) pairs, count occurrences and use combinatorial formulas. k items form k×(k-1)/2 unordered pairs.

3. **Choose the right data structure**: Hash maps are ideal for counting frequencies. When values have small ranges (like 1-9), arrays can be even more efficient.

[Practice this problem on CodeJeet](/problem/number-of-equivalent-domino-pairs)
