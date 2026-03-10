---
title: "How to Solve Online Majority Element In Subarray — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Online Majority Element In Subarray. Hard difficulty, 40.1% acceptance rate. Topics: Array, Binary Search, Design, Binary Indexed Tree, Segment Tree."
date: "2029-10-30"
category: "dsa-patterns"
tags: ["online-majority-element-in-subarray", "array", "binary-search", "design", "hard"]
---

# How to Solve Online Majority Element In Subarray

This problem asks us to design a data structure that can efficiently answer queries about whether a subarray has a "majority element" — an element that appears at least `threshold` times within a given range. The challenge comes from needing to handle multiple queries efficiently, where a naive approach would be far too slow for large arrays and many queries.

What makes this problem interesting is that we need to balance two competing requirements: we must preprocess the array to answer queries quickly, but we also need to be memory-efficient since the array can be large (up to 20,000 elements). The optimal solution combines randomization with binary search to achieve a good balance.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have the array `[1, 1, 2, 2, 1, 2]` and we initialize a `MajorityChecker` with it.

**Query 1:** `query(0, 5, 3)` — Check if any element appears at least 3 times between indices 0 and 5.

The subarray is `[1, 1, 2, 2, 1, 2]`. Element 1 appears 3 times, element 2 appears 3 times. Since threshold is 3, both qualify as majority elements. We should return 1 (the smallest index where a qualifying element appears, or any qualifying element).

**Query 2:** `query(0, 3, 3)` — Check indices 0 to 3: `[1, 1, 2, 2]`.

Element 1 appears 2 times, element 2 appears 2 times. Neither appears 3 times, so we return -1.

**Query 3:** `query(2, 5, 2)` — Check indices 2 to 5: `[2, 2, 1, 2]`.

Element 2 appears 3 times, which meets the threshold of 2. We return 2.

The key insight: if an element appears at least `threshold` times in a subarray, then if we randomly sample elements from that subarray, we have a good chance of picking that element. If we sample enough times, we can be confident we'll find it if it exists.

## Brute Force Approach

The most straightforward approach would be to store the array and, for each query, count frequencies of elements in the subarray:

1. For each query `(left, right, threshold)`:
2. Create a frequency counter (hash map)
3. Iterate through `arr[left:right+1]`, counting each element
4. Check if any element's count ≥ threshold
5. Return that element (or -1 if none)

<div class="code-group">

```python
# Brute Force Solution - Too Slow!
class MajorityChecker:
    def __init__(self, arr):
        self.arr = arr

    def query(self, left, right, threshold):
        freq = {}
        # Count frequencies in the subarray
        for i in range(left, right + 1):
            num = self.arr[i]
            freq[num] = freq.get(num, 0) + 1

        # Check if any element meets threshold
        for num, count in freq.items():
            if count >= threshold:
                return num

        return -1
```

```javascript
// Brute Force Solution - Too Slow!
class MajorityChecker {
  constructor(arr) {
    this.arr = arr;
  }

  query(left, right, threshold) {
    const freq = new Map();
    // Count frequencies in the subarray
    for (let i = left; i <= right; i++) {
      const num = this.arr[i];
      freq.set(num, (freq.get(num) || 0) + 1);
    }

    // Check if any element meets threshold
    for (const [num, count] of freq) {
      if (count >= threshold) {
        return num;
      }
    }

    return -1;
  }
}
```

```java
// Brute Force Solution - Too Slow!
class MajorityChecker {
    private int[] arr;

    public MajorityChecker(int[] arr) {
        this.arr = arr;
    }

    public int query(int left, int right, int threshold) {
        Map<Integer, Integer> freq = new HashMap<>();
        // Count frequencies in the subarray
        for (int i = left; i <= right; i++) {
            int num = arr[i];
            freq.put(num, freq.getOrDefault(num, 0) + 1);
        }

        // Check if any element meets threshold
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            if (entry.getValue() >= threshold) {
                return entry.getKey();
            }
        }

        return -1;
    }
}
```

</div>

**Why this fails:** Each query takes O(n) time where n is the subarray length. With up to 10^4 queries and array size up to 2×10^4, this could take O(10^8) operations, which is too slow. We need to answer queries much faster, ideally in O(log n) or similar.

## Optimized Approach

The key insight comes from the Boyer-Moore Majority Vote algorithm, which can find a potential majority candidate in O(n) time with O(1) space. However, we need to verify if this candidate actually meets the threshold, and we need to do this efficiently for arbitrary subarrays.

Here's the optimized strategy:

1. **Preprocessing:** For each unique element in the array, store all indices where it appears in sorted order. This gives us a map: `element → [sorted indices]`.

2. **Query processing:**
   - Randomly sample k elements from the subarray (k ≈ 20 works well in practice)
   - For each sampled element, use binary search on its index list to count how many times it appears in `[left, right]`
   - If any sampled element appears ≥ threshold times, return it
   - If no sampled element qualifies, return -1

**Why randomization works:** If an element appears at least `threshold` times in a subarray of length L, then its probability in that subarray is at least `threshold/L`. If we sample k elements randomly, the probability of missing this element is at most `(1 - threshold/L)^k`. With k=20 and worst-case threshold/L=0.5, this probability is about 1 in a million — small enough for practical purposes.

**Verification with binary search:** Given an element's sorted index list, we can find how many occurrences fall in `[left, right]` using:

- `bisect_right(list, right)` gives count of indices ≤ right
- `bisect_left(list, left)` gives count of indices < left
- The difference gives the count in `[left, right]`

## Optimal Solution

Here's the complete implementation using randomization and binary search:

<div class="code-group">

```python
# Time: O(n) preprocessing, O(k log n) per query where k=20
# Space: O(n) for storing index lists
import random
import bisect
from collections import defaultdict

class MajorityChecker:
    def __init__(self, arr):
        """
        Initialize the data structure with the given array.
        Preprocess by storing indices for each element.
        """
        self.arr = arr
        self.index_map = defaultdict(list)

        # Build map from element to list of indices where it appears
        for i, num in enumerate(arr):
            self.index_map[num].append(i)

        # Store elements for random sampling
        self.elements = list(self.index_map.keys())

    def query(self, left, right, threshold):
        """
        Query for majority element in arr[left:right+1].
        Returns the element if it appears at least threshold times, else -1.
        """
        # Randomly sample elements from the subarray
        for _ in range(20):  # 20 samples gives high probability of success
            # Pick a random index in [left, right]
            rand_idx = random.randint(left, right)
            candidate = self.arr[rand_idx]

            # Get the index list for this candidate
            indices = self.index_map[candidate]

            # Count occurrences in [left, right] using binary search
            # bisect_right finds first index > right
            # bisect_left finds first index >= left
            count = bisect.bisect_right(indices, right) - bisect.bisect_left(indices, left)

            # If count meets threshold, return candidate
            if count >= threshold:
                return candidate

        # If no candidate found after sampling, return -1
        return -1
```

```javascript
// Time: O(n) preprocessing, O(k log n) per query where k=20
// Space: O(n) for storing index lists
class MajorityChecker {
  constructor(arr) {
    /**
     * Initialize the data structure with the given array.
     * Preprocess by storing indices for each element.
     */
    this.arr = arr;
    this.indexMap = new Map();

    // Build map from element to list of indices where it appears
    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      if (!this.indexMap.has(num)) {
        this.indexMap.set(num, []);
      }
      this.indexMap.get(num).push(i);
    }

    // Store elements for random sampling
    this.elements = Array.from(this.indexMap.keys());
  }

  query(left, right, threshold) {
    /**
     * Query for majority element in arr[left:right+1].
     * Returns the element if it appears at least threshold times, else -1.
     */
    // Randomly sample elements from the subarray
    for (let i = 0; i < 20; i++) {
      // 20 samples gives high probability of success
      // Pick a random index in [left, right]
      const randIdx = Math.floor(Math.random() * (right - left + 1)) + left;
      const candidate = this.arr[randIdx];

      // Get the index list for this candidate
      const indices = this.indexMap.get(candidate);

      // Count occurrences in [left, right] using binary search
      const leftIdx = this.lowerBound(indices, left);
      const rightIdx = this.upperBound(indices, right);
      const count = rightIdx - leftIdx;

      // If count meets threshold, return candidate
      if (count >= threshold) {
        return candidate;
      }
    }

    // If no candidate found after sampling, return -1
    return -1;
  }

  // Helper: binary search for first index >= target
  lowerBound(arr, target) {
    let left = 0,
      right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }

  // Helper: binary search for first index > target
  upperBound(arr, target) {
    let left = 0,
      right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  }
}
```

```java
// Time: O(n) preprocessing, O(k log n) per query where k=20
// Space: O(n) for storing index lists
import java.util.*;

class MajorityChecker {
    private int[] arr;
    private Map<Integer, List<Integer>> indexMap;
    private Random random;

    public MajorityChecker(int[] arr) {
        /**
         * Initialize the data structure with the given array.
         * Preprocess by storing indices for each element.
         */
        this.arr = arr;
        this.indexMap = new HashMap<>();
        this.random = new Random();

        // Build map from element to list of indices where it appears
        for (int i = 0; i < arr.length; i++) {
            int num = arr[i];
            indexMap.putIfAbsent(num, new ArrayList<>());
            indexMap.get(num).add(i);
        }
    }

    public int query(int left, int right, int threshold) {
        /**
         * Query for majority element in arr[left:right+1].
         * Returns the element if it appears at least threshold times, else -1.
         */
        // Randomly sample elements from the subarray
        for (int i = 0; i < 20; i++) {  // 20 samples gives high probability of success
            // Pick a random index in [left, right]
            int randIdx = left + random.nextInt(right - left + 1);
            int candidate = arr[randIdx];

            // Get the index list for this candidate
            List<Integer> indices = indexMap.get(candidate);

            // Count occurrences in [left, right] using binary search
            int leftIdx = lowerBound(indices, left);
            int rightIdx = upperBound(indices, right);
            int count = rightIdx - leftIdx;

            // If count meets threshold, return candidate
            if (count >= threshold) {
                return candidate;
            }
        }

        // If no candidate found after sampling, return -1
        return -1;
    }

    // Helper: binary search for first index >= target
    private int lowerBound(List<Integer> list, int target) {
        int left = 0, right = list.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (list.get(mid) < target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }

    // Helper: binary search for first index > target
    private int upperBound(List<Integer> list, int target) {
        int left = 0, right = list.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (list.get(mid) <= target) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Preprocessing (constructor):** O(n) where n is the array length. We iterate through the array once to build the index map.
- **Query:** O(k log m) where k is the number of samples (20) and m is the maximum frequency of any element. The binary search on the index list takes O(log m) time.

**Space Complexity:** O(n) for storing the index map. Each index appears exactly once in the map, so total storage is proportional to the array size.

**Why this is efficient:** With k=20, each query takes about 20 × O(log n) ≈ O(log n) operations. For 10^4 queries, this is about 2×10^5 operations, which is very efficient.

## Common Mistakes

1. **Not handling the case where no majority exists:** Always return -1 when no element meets the threshold after all samples. Some candidates forget this edge case.

2. **Incorrect binary search bounds:** The most common error is using `bisect_right` and `bisect_left` incorrectly. Remember:
   - `bisect_right(list, right)` counts indices ≤ right
   - `bisect_left(list, left)` counts indices < left
   - The difference gives indices in [left, right]

3. **Not sampling enough times:** With only 10 samples, the probability of missing a true majority element might be too high. 20 samples gives a failure probability of about 1 in a million for worst-case scenarios.

4. **Sampling from wrong distribution:** You must sample uniformly from the subarray indices, not from all elements. Sampling from the subarray ensures each position has equal chance, which maintains the probability analysis.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Randomized algorithms:** When deterministic solutions are too complex, randomization can provide simple, efficient solutions with high probability of correctness. See also:
   - **QuickSelect** (finding kth smallest element)
   - **Randomized quicksort**

2. **Preprocessing with index maps:** Storing indices for each value enables efficient range queries. Similar patterns appear in:
   - **Range Frequency Queries** (LeetCode 2080) - Direct application of this technique
   - **Find Servers That Handled Most Number of Requests** (LeetCode 1606) - Uses similar data structures

3. **Binary search on sorted lists:** Once you have sorted indices, binary search enables O(log n) range counting. This pattern appears in:
   - **Count of Range Sum** (LeetCode 327)
   - **Reverse Pairs** (LeetCode 493)

## Key Takeaways

1. **Randomization is a powerful tool** for optimization problems where exact solutions are complex. When you can tolerate a tiny error probability, randomization often leads to simpler, faster solutions.

2. **Preprocessing is key for multiple queries.** When you need to answer many queries on the same data, invest in preprocessing to make each query fast. The index map pattern (element → sorted indices) is versatile for range queries.

3. **Binary search transforms O(n) to O(log n).** Whenever you have sorted data and need to count elements in a range, binary search is your go-to tool. Remember the `upper_bound`/`lower_bound` pattern for inclusive/exclusive bounds.

[Practice this problem on CodeJeet](/problem/online-majority-element-in-subarray)
