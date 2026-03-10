---
title: "How to Solve Successful Pairs of Spells and Potions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Successful Pairs of Spells and Potions. Medium difficulty, 49.5% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2027-08-28"
category: "dsa-patterns"
tags: ["successful-pairs-of-spells-and-potions", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Successful Pairs of Spells and Potions

You’re given two arrays: `spells` (length `n`) and `potions` (length `m`), plus an integer `success`. For each spell, you need to count how many potions, when multiplied by that spell, produce a product at least `success`. The challenge is that a brute‑force check of all `n * m` pairs is too slow for large inputs. The key insight is that if you sort the potions array, you can use binary search to find the first potion that makes a successful pair, turning an O(n·m) problem into O((n+m) log m).

## Visual Walkthrough

Let’s walk through a small example to build intuition.

**Input:**

```
spells = [3, 1, 2]
potions = [8, 5, 8]
success = 16
```

We want, for each spell, the number of potions where `spell * potion >= success`.

**Step 1 – Sort the potions array**  
Potions sorted: `[5, 8, 8]`  
Why sort? Because once sorted, if a potion at index `j` works with a given spell, then every potion to its right (higher strength) will also work. This monotonic property lets us use binary search.

**Step 2 – Process each spell**

- **Spell 3**: We need `3 * potion >= 16` → `potion >= 16/3 ≈ 5.33`.  
  In the sorted potions `[5, 8, 8]`, the first potion that meets this is `8` at index 1.  
  All potions from index 1 to the end (2 potions) are successful.  
  Result for spell 3: `2`.

- **Spell 1**: Need `1 * potion >= 16` → `potion >= 16`.  
  In `[5, 8, 8]`, no potion is ≥ 16. Binary search would tell us the insertion point is index 3 (end of array).  
  Successful potions count = `3 - 3 = 0`.

- **Spell 2**: Need `2 * potion >= 16` → `potion >= 8`.  
  First potion ≥ 8 is at index 1.  
  Successful potions = `3 - 1 = 2`.

**Output:** `[2, 0, 2]`

This example shows how sorting + binary search avoids checking every spell‑potion combination.

## Brute Force Approach

The straightforward solution is to iterate through each spell and, for each spell, iterate through every potion, counting how many satisfy `spell * potion >= success`.

<div class="code-group">

```python
# Time: O(n * m) | Space: O(1) excluding output
def successfulPairs(spells, potions, success):
    n = len(spells)
    m = len(potions)
    result = [0] * n

    for i in range(n):
        count = 0
        for j in range(m):
            if spells[i] * potions[j] >= success:
                count += 1
        result[i] = count

    return result
```

```javascript
// Time: O(n * m) | Space: O(1) excluding output
function successfulPairs(spells, potions, success) {
  const n = spells.length;
  const m = potions.length;
  const result = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < m; j++) {
      if (spells[i] * potions[j] >= success) {
        count++;
      }
    }
    result[i] = count;
  }

  return result;
}
```

```java
// Time: O(n * m) | Space: O(1) excluding output
public int[] successfulPairs(int[] spells, int[] potions, long success) {
    int n = spells.length;
    int m = potions.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        int count = 0;
        for (int j = 0; j < m; j++) {
            if ((long) spells[i] * potions[j] >= success) {
                count++;
            }
        }
        result[i] = count;
    }

    return result;
}
```

</div>

**Why this fails:**  
Constraints can be up to `n = 10^5` and `m = 10^5`, making `n * m = 10^10` operations, which is far too slow. We need a solution that scales better.

## Optimized Approach

The bottleneck is checking every potion for every spell. Notice that for a fixed spell, we’re counting potions that satisfy `potion >= success / spell`. If the potions array were sorted, we could **binary search** for the first potion that meets this condition. All potions to the right of that index will also work.

**Key steps:**

1. Sort the `potions` array.
2. For each spell:
   - Compute the minimum potion strength needed: `minPotion = ceil(success / spell)`.
   - Use binary search to find the leftmost index where `potions[index] >= minPotion`.
   - The number of successful pairs = `m - index`.
3. Return the results array.

**Why binary search works:**  
Sorting costs O(m log m), but then each spell only requires O(log m) time, giving total O(m log m + n log m) = O((n+m) log m), which is efficient even for large inputs.

**Handling large numbers:**  
Since `success` can be up to `10^10` and values up to `10^5`, the product `spell * potion` can exceed 32‑bit integer range. Use 64‑bit integers (Python `int` is unbounded, JavaScript `BigInt` or careful multiplication, Java `long`) to avoid overflow.

## Optimal Solution

Here’s the complete implementation with detailed comments.

<div class="code-group">

```python
# Time: O((n + m) log m) | Space: O(1) excluding output
def successfulPairs(spells, potions, success):
    # Step 1: Sort the potions array to enable binary search
    potions.sort()
    m = len(potions)
    result = []

    # Step 2: For each spell, find how many potions work
    for spell in spells:
        # Minimum potion strength needed for success
        # Use integer ceiling: (success + spell - 1) // spell
        min_potion = (success + spell - 1) // spell

        # Binary search for the first potion >= min_potion
        left, right = 0, m
        while left < right:
            mid = left + (right - left) // 2
            if potions[mid] >= min_potion:
                right = mid   # Move right boundary leftward
            else:
                left = mid + 1  # Move left boundary rightward

        # 'left' is the index of first potion that works
        # All potions from 'left' to end are successful
        successful_count = m - left
        result.append(successful_count)

    return result
```

```javascript
// Time: O((n + m) log m) | Space: O(1) excluding output
function successfulPairs(spells, potions, success) {
  // Step 1: Sort potions ascending
  potions.sort((a, b) => a - b);
  const m = potions.length;
  const result = [];

  // Step 2: Process each spell
  for (const spell of spells) {
    // Minimum potion needed: ceil(success / spell)
    // Use Math.ceil with careful handling of integer division
    const minPotion = Math.ceil(success / spell);

    // Binary search for first potion >= minPotion
    let left = 0,
      right = m;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (potions[mid] >= minPotion) {
        right = mid; // Search left half
      } else {
        left = mid + 1; // Search right half
      }
    }

    // All potions from 'left' to end work
    result.push(m - left);
  }

  return result;
}
```

```java
// Time: O((n + m) log m) | Space: O(1) excluding output
public int[] successfulPairs(int[] spells, int[] potions, long success) {
    // Step 1: Sort potions array
    Arrays.sort(potions);
    int n = spells.length;
    int m = potions.length;
    int[] result = new int[n];

    // Step 2: For each spell, binary search in potions
    for (int i = 0; i < n; i++) {
        int spell = spells[i];
        // Minimum potion needed: ceil(success / spell)
        // Using integer math: (success + spell - 1) / spell
        long minPotion = (success + spell - 1) / spell;

        // Binary search for first index where potions[idx] >= minPotion
        int left = 0, right = m;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (potions[mid] >= minPotion) {
                right = mid;   // Move right boundary left
            } else {
                left = mid + 1; // Move left boundary right
            }
        }

        // All potions from 'left' to end are successful
        result[i] = m - left;
    }

    return result;
}
```

</div>

## Complexity Analysis

- **Time complexity:** O((n + m) log m)  
  Sorting `potions` takes O(m log m). Then for each of the `n` spells, we perform a binary search taking O(log m). Total = O(m log m + n log m) = O((n+m) log m).

- **Space complexity:** O(1) extra space (excluding the output array)  
  We sort `potions` in‑place (O(1) extra for Timsort in Python, O(log m) stack space for quicksort in Java/JavaScript, but typically considered O(1) for analysis). The result array is required output, not counted in auxiliary space.

## Common Mistakes

1. **Not handling integer overflow**  
   Multiplying two numbers up to 10^5 can exceed 32‑bit integer range (≈2×10^9). In Java, always cast to `long` before multiplication. In JavaScript, use `BigInt` or ensure numbers stay within safe integer range (≤2^53‑1). Python handles big integers natively.

2. **Incorrect binary search boundaries**  
   Using `right = m - 1` instead of `right = m` can miss cases where the minimum potion is larger than all potions. With `right = m`, the search returns `m` (no successful potions), which is correct.

3. **Wrong ceiling division formula**  
   `ceil(success / spell)` is not `success / spell + 1` when there’s no remainder. The correct integer formula is `(success + spell - 1) // spell` (Python/Java) or `Math.ceil(success / spell)` (JavaScript).

4. **Forgetting to sort potions**  
   Binary search only works on sorted arrays. If you skip sorting, the count will be wrong. Remember: sort once, reuse for all spells.

## When You'll See This Pattern

This “sort one array + binary search per query” pattern appears whenever you need to count how many elements in one collection satisfy a condition relative to each element in another collection.

**Related problems:**

- **Most Profit Assigning Work** – Sort jobs by difficulty, then for each worker, binary search to find the best profit.
- **Longest Subsequence With Limited Sum** – Sort nums, create prefix sums, then for each query, binary search to find how many numbers fit within the limit.
- **Maximum Matching of Players With Trainers** – Sort both arrays, then use two pointers or binary search to match players with adequate trainers.

In each case, sorting enables efficient searching (binary search or two pointers) instead of nested loops.

## Key Takeaways

1. **When you need to count pairs satisfying a condition, consider sorting one array** to turn O(n²) into O(n log n) via binary search.
2. **Binary search isn’t just for finding exact matches** – it’s perfect for finding the first element that meets a threshold (lower bound).
3. **Watch for overflow in product‑based conditions** – use 64‑bit integers or big integers when multiplying large numbers.

**Related problems:** [Most Profit Assigning Work](/problem/most-profit-assigning-work), [Longest Subsequence With Limited Sum](/problem/longest-subsequence-with-limited-sum), [Maximum Matching of Players With Trainers](/problem/maximum-matching-of-players-with-trainers)
