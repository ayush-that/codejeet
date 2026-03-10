---
title: "How to Solve Reduce Array Size to The Half — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reduce Array Size to The Half. Medium difficulty, 69.3% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting, Heap (Priority Queue)."
date: "2028-06-28"
category: "dsa-patterns"
tags: ["reduce-array-size-to-the-half", "array", "hash-table", "greedy", "medium"]
---

## How to Solve "Reduce Array Size to The Half"

You're given an array of integers and can remove all occurrences of selected numbers. The goal is to find the smallest set of numbers to remove so that at least half the array is gone. What makes this interesting is that it's not about removing specific elements but entire values — and some values appear many times while others appear rarely. The optimal strategy is clearly to target the most frequent numbers first.

---

## Visual Walkthrough

Let's trace through `arr = [3,3,3,3,5,5,5,2,2,7]`:

**Step 1: Count frequencies**

- 3 appears 4 times
- 5 appears 3 times
- 2 appears 2 times
- 7 appears 1 time

**Step 2: Sort by frequency (descending)**  
Frequencies: [4, 3, 2, 1]

**Step 3: Remove starting from largest frequency**  
Total elements: 10. We need to remove at least 5.

- Remove all 3's (4 elements removed, set size = 1) → still need 1 more
- Remove all 5's (3 more elements, total removed = 7) → now removed ≥5, set size = 2

We could also check:

- Remove 3's (4) + 2's (2) = 6 removed, set size = 2
- Remove 3's (4) + 5's (3) = 7 removed, set size = 2

The minimum set size is 2.

---

## Brute Force Approach

A brute force approach would try all possible subsets of distinct numbers from the array. For each subset, sum the frequencies of those numbers and check if it reaches at least half the array length, tracking the smallest subset size that works.

Why this fails:  
If there are `m` distinct numbers, there are `2^m` possible subsets. In the worst case where all numbers are distinct, `m = n`, giving `2^n` subsets — impossibly slow for `n` up to 10^5.

Even for smaller cases, this is inefficient because we're redoing work — the contribution of each number depends only on its frequency, not which other numbers are chosen.

---

## Optimized Approach

The key insight is **greedy selection by frequency**:

1. Count how many times each number appears (use a hash map).
2. Sort the frequencies in descending order.
3. Take frequencies from largest to smallest until the sum of taken frequencies ≥ half the array length.
4. The answer is how many frequencies we took.

Why greedy works:  
Each number we choose to remove contributes its entire frequency to the total removed count. To minimize the number of chosen numbers, we should pick those with the largest frequencies first. This is optimal because if we ever skip a large frequency to pick a smaller one later, we could swap them and get the same total removed with fewer numbers (or the same count but larger margin).

Example: Frequencies [5,3,2], need ≥5 removed.

- Greedy: pick 5 → done, set size = 1
- Non-greedy: pick 3+2=5 → set size = 2  
  Greedy is better.

---

## Optimal Solution

We count frequencies, sort them descending, then accumulate until we reach the target.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minSetSize(arr):
    """
    Returns minimum number of distinct integers to remove
    so at least half the array is removed.
    """
    n = len(arr)
    target = n // 2  # We need to remove at least this many elements

    # Step 1: Count frequencies of each number
    freq_map = {}
    for num in arr:
        freq_map[num] = freq_map.get(num, 0) + 1

    # Step 2: Get frequencies and sort in descending order
    # We only care about frequencies, not the numbers themselves
    frequencies = list(freq_map.values())
    frequencies.sort(reverse=True)  # Largest frequencies first

    # Step 3: Greedily take largest frequencies until we remove enough
    removed_count = 0
    set_size = 0

    for freq in frequencies:
        removed_count += freq  # Remove all occurrences of this number
        set_size += 1          # We've chosen one more number for our set
        if removed_count >= target:
            break  # We've removed at least half the array

    return set_size
```

```javascript
// Time: O(n log n) | Space: O(n)
function minSetSize(arr) {
  const n = arr.length;
  const target = Math.floor(n / 2); // Need to remove at least this many

  // Step 1: Count frequencies
  const freqMap = new Map();
  for (const num of arr) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Get frequencies and sort descending
  const frequencies = Array.from(freqMap.values());
  frequencies.sort((a, b) => b - a); // Descending order

  // Step 3: Greedy selection
  let removedCount = 0;
  let setSize = 0;

  for (const freq of frequencies) {
    removedCount += freq;
    setSize++;
    if (removedCount >= target) {
      break;
    }
  }

  return setSize;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int minSetSize(int[] arr) {
        int n = arr.length;
        int target = n / 2; // Need to remove at least half

        // Step 1: Count frequencies
        Map<Integer, Integer> freqMap = new HashMap<>();
        for (int num : arr) {
            freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
        }

        // Step 2: Get frequencies and sort descending
        List<Integer> frequencies = new ArrayList<>(freqMap.values());
        Collections.sort(frequencies, Collections.reverseOrder());

        // Step 3: Greedy selection
        int removedCount = 0;
        int setSize = 0;

        for (int freq : frequencies) {
            removedCount += freq;
            setSize++;
            if (removedCount >= target) {
                break;
            }
        }

        return setSize;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting frequencies: O(n) to iterate through array
- Sorting frequencies: O(m log m) where m = number of distinct elements
- In worst case, m ≈ n (all elements distinct), so O(n log n)
- Greedy accumulation: O(m) which is O(n) in worst case

**Space Complexity: O(n)**

- Frequency map stores up to n key-value pairs (if all distinct)
- Frequencies list stores m values, m ≤ n

---

## Common Mistakes

1. **Not sorting in descending order** — Sorting ascending and taking from the end works, but it's easier to sort descending and take from front. Candidates sometimes forget to reverse sort and get wrong answers.

2. **Off-by-one with half calculation** — For odd-length arrays, need to remove at least `ceil(n/2)` elements. Using integer division `n // 2` or `Math.floor(n/2)` correctly gives the minimum to remove because if n=9, half=4.5, we need ≥5 removed, and `9//2 = 4` means we need >4, so ≥5.

3. **Counting instead of summing frequencies** — Some candidates count how many numbers they've selected but forget to track the actual sum of removed elements, leading to early termination.

4. **Using a priority queue unnecessarily** — While a max-heap works, sorting is simpler and has the same complexity. But candidates sometimes overcomplicate by maintaining a heap when a simple sort suffices.

---

## When You'll See This Pattern

This **frequency-based greedy selection** pattern appears in problems where:

1. You need to select items based on their occurrence counts
2. The goal is to optimize selection (minimize count, maximize coverage, etc.)

Related LeetCode problems:

- **Top K Frequent Elements** (LeetCode 347) — Same frequency counting, but you want the top k frequencies
- **Sort Characters By Frequency** (LeetCode 451) — Sort characters by frequency, similar counting approach
- **Least Number of Unique Integers after K Removals** (LeetCode 1481) — Remove k elements to minimize distinct counts, uses frequency sorting

---

## Key Takeaways

1. **When removal is by value (not position), think in terms of frequencies** — Counting frequencies transforms the problem from element-level to value-level reasoning.

2. **Greedy by frequency is often optimal** — When you can remove all occurrences of chosen values, always start with the most frequent ones to minimize the number of values needed.

3. **The pattern: Count → Sort → Greedy accumulate** — This three-step approach works for many frequency-based optimization problems.

[Practice this problem on CodeJeet](/problem/reduce-array-size-to-the-half)
