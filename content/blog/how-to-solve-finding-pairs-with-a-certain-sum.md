---
title: "How to Solve Finding Pairs With a Certain Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Finding Pairs With a Certain Sum. Medium difficulty, 61.6% acceptance rate. Topics: Array, Hash Table, Design."
date: "2026-10-09"
category: "dsa-patterns"
tags: ["finding-pairs-with-a-certain-sum", "array", "hash-table", "design", "medium"]
---

# How to Solve Finding Pairs With a Certain Sum

You're given two arrays and need to design a data structure that efficiently supports two operations: adding to elements in one array, and counting how many pairs sum to a given target. The challenge is that both operations need to be fast — a brute force count would be too slow for repeated queries, and updates to the array would invalidate precomputed results.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
nums1 = [1, 1, 2, 2, 2, 3]
nums2 = [1, 4, 5, 2, 5, 4]
```

We'll implement our data structure and see how it handles operations efficiently.

**Initial State:**

- `nums1` has frequencies: {1: 2, 2: 3, 3: 1}
- `nums2` has frequencies: {1: 1, 4: 2, 5: 2, 2: 1}

**Operation 1: Count pairs that sum to 6**
We need to find all (i, j) where nums1[i] + nums2[j] = 6.

Instead of checking all pairs (which would be 6 × 6 = 36 checks), we use the frequency maps:

- For each value `a` in nums1, we need `b = 6 - a` in nums2
- a=1 → need 5 in nums2 → count = freq1[1] × freq2[5] = 2 × 2 = 4 pairs
- a=2 → need 4 in nums2 → count = 3 × 2 = 6 pairs
- a=3 → need 3 in nums2 → count = 1 × 0 = 0 pairs
- Total = 4 + 6 + 0 = 10 pairs

**Operation 2: Add 2 to nums2[3] (value at index 3)**
Current nums2[3] = 2. We add 2 → new value = 4.
We update our frequency map:

- Decrease count of old value (2) by 1
- Increase count of new value (4) by 1
  Now freq2[2] = 0, freq2[4] = 3

**Operation 3: Count pairs that sum to 6 again**

- a=1 → need 5 → 2 × 2 = 4 pairs
- a=2 → need 4 → 3 × 3 = 9 pairs
- a=3 → need 3 → 1 × 0 = 0 pairs
  Total = 13 pairs (increased by 3 because we converted a 2 to a 4, and 2+4=6)

This shows the power of frequency maps: we can answer count queries in O(k) time where k is the number of distinct values in nums1, and updates in O(1) time.

## Brute Force Approach

The most straightforward approach would be:

- Store both arrays as-is
- For `count(tot)`: iterate through all i in nums1 and j in nums2, count where nums1[i] + nums2[j] == tot
- For `add(index, val)`: simply do nums2[index] += val

Here's what that looks like:

<div class="code-group">

```python
class FindSumPairsNaive:
    def __init__(self, nums1, nums2):
        self.nums1 = nums1[:]  # Copy arrays
        self.nums2 = nums2[:]

    def add(self, index, val):
        self.nums2[index] += val

    def count(self, tot):
        result = 0
        for i in range(len(self.nums1)):
            for j in range(len(self.nums2)):
                if self.nums1[i] + self.nums2[j] == tot:
                    result += 1
        return result
```

```javascript
class FindSumPairsNaive {
  constructor(nums1, nums2) {
    this.nums1 = [...nums1]; // Copy arrays
    this.nums2 = [...nums2];
  }

  add(index, val) {
    this.nums2[index] += val;
  }

  count(tot) {
    let result = 0;
    for (let i = 0; i < this.nums1.length; i++) {
      for (let j = 0; j < this.nums2.length; j++) {
        if (this.nums1[i] + this.nums2[j] === tot) {
          result++;
        }
      }
    }
    return result;
  }
}
```

```java
class FindSumPairsNaive {
    private int[] nums1;
    private int[] nums2;

    public FindSumPairsNaive(int[] nums1, int[] nums2) {
        this.nums1 = nums1.clone();  // Copy arrays
        this.nums2 = nums2.clone();
    }

    public void add(int index, int val) {
        nums2[index] += val;
    }

    public int count(int tot) {
        int result = 0;
        for (int i = 0; i < nums1.length; i++) {
            for (int j = 0; j < nums2.length; j++) {
                if (nums1[i] + nums2[j] == tot) {
                    result++;
                }
            }
        }
        return result;
    }
}
```

</div>

**Why this fails:**

- `count()` takes O(n × m) time where n = len(nums1), m = len(nums2)
- With constraints up to 1000 elements each, that's 1,000,000 operations per query
- If we have up to 10,000 queries (as the problem allows), we'd do 10 billion operations — far too slow
- The brute force doesn't leverage the fact that we can precompute information about the arrays

## Optimized Approach

The key insight is that we don't need to examine every pair for each count query. Instead, we can:

1. **Precompute frequency maps** for both arrays to know how many times each value appears
2. **For count queries**: For each distinct value `a` in nums1, calculate `b = tot - a`, and multiply freq1[a] × freq2[b]
3. **For add operations**: Update the frequency map for nums2 when a value changes

But wait — there's an optimization we can make! Notice that `add()` only affects nums2, not nums1. So:

- We only need a frequency map for nums2 (since it changes)
- For nums1, we can just iterate through its distinct values (which are fixed)
- This is more efficient when nums1 has fewer distinct values than nums2

**Step-by-step reasoning:**

1. **Initialization**:
   - Store nums2 as an array (for O(1) updates by index)
   - Build frequency map for nums2 (dictionary/map from value to count)
   - For nums1, we just need its values (or their frequency map)
2. **Count operation**:
   - For each value `a` in nums1 (or its distinct values), compute `needed = tot - a`
   - Look up `needed` in nums2's frequency map
   - Add `freq1[a] × freq2[needed]` to the result
3. **Add operation**:
   - Get the old value at nums2[index]
   - Decrease its count in frequency map (remove if count becomes 0)
   - Update nums2[index] with new value
   - Increase count of new value in frequency map

**Why this works:**

- Count queries become O(d) where d = number of distinct values in nums1
- Add operations are O(1) for updating the frequency map
- We trade space (for the frequency map) for massive time savings

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
class FindSumPairs:
    def __init__(self, nums1: List[int], nums2: List[int]):
        # Store nums1 as is (won't change)
        self.nums1 = nums1

        # Store nums2 as list for O(1) index-based updates
        self.nums2 = nums2

        # Build frequency map for nums2 values
        # Key: value in nums2, Value: how many times it appears
        self.freq2 = {}
        for num in nums2:
            self.freq2[num] = self.freq2.get(num, 0) + 1

        # Build frequency map for nums1 as well for efficient counting
        # This is optional but makes count() cleaner
        self.freq1 = {}
        for num in nums1:
            self.freq1[num] = self.freq1.get(num, 0) + 1

    def add(self, index: int, val: int) -> None:
        # Get the old value at the specified index
        old_val = self.nums2[index]

        # Decrease count of old value in frequency map
        self.freq2[old_val] -= 1
        if self.freq2[old_val] == 0:
            del self.freq2[old_val]  # Clean up to save space

        # Update the value in nums2 array
        new_val = old_val + val
        self.nums2[index] = new_val

        # Increase count of new value in frequency map
        self.freq2[new_val] = self.freq2.get(new_val, 0) + 1

    def count(self, tot: int) -> int:
        total_pairs = 0

        # For each distinct value in nums1
        for num1, count1 in self.freq1.items():
            # Calculate what value we need from nums2
            needed = tot - num1

            # If that value exists in nums2, add to total
            if needed in self.freq2:
                total_pairs += count1 * self.freq2[needed]

        return total_pairs
```

```javascript
class FindSumPairs {
  constructor(nums1, nums2) {
    // Store nums1 as is (won't change)
    this.nums1 = nums1;

    // Store nums2 as array for O(1) index-based updates
    this.nums2 = nums2;

    // Build frequency map for nums2 values
    // Key: value in nums2, Value: how many times it appears
    this.freq2 = new Map();
    for (const num of nums2) {
      this.freq2.set(num, (this.freq2.get(num) || 0) + 1);
    }

    // Build frequency map for nums1 as well for efficient counting
    this.freq1 = new Map();
    for (const num of nums1) {
      this.freq1.set(num, (this.freq1.get(num) || 0) + 1);
    }
  }

  add(index, val) {
    // Get the old value at the specified index
    const oldVal = this.nums2[index];

    // Decrease count of old value in frequency map
    const oldCount = this.freq2.get(oldVal);
    if (oldCount === 1) {
      this.freq2.delete(oldVal); // Remove if count becomes 0
    } else {
      this.freq2.set(oldVal, oldCount - 1);
    }

    // Update the value in nums2 array
    const newVal = oldVal + val;
    this.nums2[index] = newVal;

    // Increase count of new value in frequency map
    this.freq2.set(newVal, (this.freq2.get(newVal) || 0) + 1);
  }

  count(tot) {
    let totalPairs = 0;

    // For each distinct value in nums1
    for (const [num1, count1] of this.freq1) {
      // Calculate what value we need from nums2
      const needed = tot - num1;

      // If that value exists in nums2, add to total
      const count2 = this.freq2.get(needed);
      if (count2 !== undefined) {
        totalPairs += count1 * count2;
      }
    }

    return totalPairs;
  }
}
```

```java
class FindSumPairs {
    private int[] nums1;
    private int[] nums2;
    private Map<Integer, Integer> freq1;
    private Map<Integer, Integer> freq2;

    public FindSumPairs(int[] nums1, int[] nums2) {
        this.nums1 = nums1;
        this.nums2 = nums2;

        // Build frequency map for nums2
        this.freq2 = new HashMap<>();
        for (int num : nums2) {
            freq2.put(num, freq2.getOrDefault(num, 0) + 1);
        }

        // Build frequency map for nums1
        this.freq1 = new HashMap<>();
        for (int num : nums1) {
            freq1.put(num, freq1.getOrDefault(num, 0) + 1);
        }
    }

    public void add(int index, int val) {
        // Get the old value at the specified index
        int oldVal = nums2[index];

        // Decrease count of old value in frequency map
        int oldCount = freq2.get(oldVal);
        if (oldCount == 1) {
            freq2.remove(oldVal);  // Remove if count becomes 0
        } else {
            freq2.put(oldVal, oldCount - 1);
        }

        // Update the value in nums2 array
        int newVal = oldVal + val;
        nums2[index] = newVal;

        // Increase count of new value in frequency map
        freq2.put(newVal, freq2.getOrDefault(newVal, 0) + 1);
    }

    public int count(int tot) {
        int totalPairs = 0;

        // For each distinct value in nums1
        for (Map.Entry<Integer, Integer> entry : freq1.entrySet()) {
            int num1 = entry.getKey();
            int count1 = entry.getValue();

            // Calculate what value we need from nums2
            int needed = tot - num1;

            // If that value exists in nums2, add to total
            if (freq2.containsKey(needed)) {
                totalPairs += count1 * freq2.get(needed);
            }
        }

        return totalPairs;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Initialization**: O(n + m) where n = len(nums1), m = len(nums2)
  - We build frequency maps by iterating through both arrays once
- **add(index, val)**: O(1) average case
  - Dictionary/map operations (get, put, delete) are O(1) on average
  - We do a constant number of these operations
- **count(tot)**: O(k) where k = number of distinct values in nums1
  - We iterate through all distinct values in nums1's frequency map
  - In worst case, k = n (all values distinct), so O(n)
  - But typically k ≤ n, and often much smaller

**Space Complexity:** O(n + m)

- We store the arrays: O(n + m)
- We store frequency maps: O(k1 + k2) where k1, k2 = distinct values in each array
- In worst case, all values distinct: O(n + m)
- Total: O(n + m)

**Why this is optimal:**

- We can't do better than O(1) for updates (must modify the array)
- For count queries, we must at least look at information about nums1 values
- If nums1 has d distinct values, we need Ω(d) time to consider each
- Our solution achieves these lower bounds

## Common Mistakes

1. **Not updating the frequency map correctly in add()**
   - Forgetting to decrement the count of the old value
   - Not removing keys when count reaches 0 (wastes space, but more importantly, can lead to incorrect counts if you assume missing key = 0 count)
   - **Fix**: Always follow the pattern: decrement old, increment new, clean up zero counts

2. **Using array iteration instead of frequency map in count()**
   - Some candidates iterate through nums1 array instead of its frequency map
   - This makes count() O(n × lookup) instead of O(distinct × lookup)
   - With duplicate values, you do redundant work
   - **Fix**: Always build and use frequency maps for counting problems

3. **Not handling negative values or large numbers**
   - The problem says "positive integer" for add(), but nums1/nums2 can have any integers
   - The sum could overflow 32-bit int in some languages
   - **Fix**: Use appropriate data types (long in Java, normal int in Python handles big integers)

4. **Confusing which array needs a frequency map**
   - Building frequency maps for both arrays is fine, but only nums2's map needs updating
   - Some candidates try to update nums1's map in add() (wrong array!)
   - **Fix**: Remember: add() only affects nums2, so only update freq2

## When You'll See This Pattern

This "frequency map for pair counting" pattern appears in many problems:

1. **Two Sum** (LeetCode #1) - The classic! Instead of counting all pairs, find one pair that sums to target. Uses hash map to store "needed" values.

2. **Count Number of Pairs With Absolute Difference K** (LeetCode #2006) - Similar structure: for each number, look for (num + k) and (num - k) in frequency map.

3. **4Sum II** (LeetCode #454) - Count tuples (i, j, k, l) where A[i] + B[j] + C[k] + D[l] = 0. Solution uses frequency map for sums of pairs from A and B, then checks against C and D.

The core idea is always the same: when you need to count pairs satisfying some condition (often involving sums), precompute frequencies and use complement lookup instead of checking all pairs.

## Key Takeaways

1. **Frequency maps transform O(n²) pair problems into O(n) or O(distinct) problems** - Instead of checking all pairs, for each element, look up its complement in a frequency map.

2. **Design data structures around operation patterns** - Here, nums1 is read-only for counting, nums2 gets updated. So we optimize differently: freq1 for iteration, freq2 for updates.

3. **The complement trick is universal** - Whether it's "sum to target", "difference equals k", or other conditions, think: "For each element, what other element would make the condition true?" Then use a hash map to find those elements quickly.

Related problems: [Count Number of Pairs With Absolute Difference K](/problem/count-number-of-pairs-with-absolute-difference-k), [Number of Distinct Averages](/problem/number-of-distinct-averages), [Count the Number of Fair Pairs](/problem/count-the-number-of-fair-pairs)
