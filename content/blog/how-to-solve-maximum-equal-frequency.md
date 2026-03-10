---
title: "How to Solve Maximum Equal Frequency — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Equal Frequency. Hard difficulty, 37.9% acceptance rate. Topics: Array, Hash Table."
date: "2029-12-12"
category: "dsa-patterns"
tags: ["maximum-equal-frequency", "array", "hash-table", "hard"]
---

# How to Solve Maximum Equal Frequency

This problem asks us to find the longest prefix of an array where removing exactly one element could make all remaining numbers appear with equal frequency. The challenge lies in efficiently tracking frequencies as we process the array and determining when a single removal could equalize all frequencies.

## Visual Walkthrough

Let's trace through `nums = [1, 1, 2, 2, 3, 3, 3]`:

**Step 1:** Process `nums[0] = 1`

- Frequencies: {1: 1}
- Frequency counts: {1: 1} (one number appears once)
- All numbers appear once → valid prefix length = 1

**Step 2:** Process `nums[1] = 1`

- Frequencies: {1: 2}
- Frequency counts: {2: 1} (one number appears twice)
- All numbers appear twice → valid prefix length = 2

**Step 3:** Process `nums[2] = 2`

- Frequencies: {1: 2, 2: 1}
- Frequency counts: {2: 1, 1: 1} (one number appears twice, one appears once)
- Not equal frequencies, but can we remove one element?
  - Remove one occurrence of 1: {1: 1, 2: 1} → both appear once ✓
  - Valid prefix length = 3

**Step 4:** Process `nums[3] = 2`

- Frequencies: {1: 2, 2: 2}
- Frequency counts: {2: 2} (two numbers appear twice)
- All numbers appear twice → valid prefix length = 4

**Step 5:** Process `nums[4] = 3`

- Frequencies: {1: 2, 2: 2, 3: 1}
- Frequency counts: {2: 2, 1: 1}
- Can we remove one element?
  - Remove one occurrence of 3: {1: 2, 2: 2, 3: 0} → all non-zero frequencies are 2 ✓
  - Valid prefix length = 5

**Step 6:** Process `nums[5] = 3`

- Frequencies: {1: 2, 2: 2, 3: 2}
- Frequency counts: {2: 3} (three numbers appear twice)
- All numbers appear twice → valid prefix length = 6

**Step 7:** Process `nums[6] = 3`

- Frequencies: {1: 2, 2: 2, 3: 3}
- Frequency counts: {2: 2, 3: 1}
- Can we remove one element?
  - Remove one occurrence of 3: {1: 2, 2: 2, 3: 2} → all appear twice ✓
  - Valid prefix length = 7

The answer is 7.

## Brute Force Approach

A brute force approach would check every prefix `nums[0:i]` and for each prefix, try removing each element to see if frequencies become equal:

1. For each prefix length `i` from 1 to `n`:
2. For each element `j` in the prefix:
3. Remove element `j` and count frequencies of remaining elements
4. Check if all non-zero frequencies are equal

This requires O(n³) time: O(n) prefixes × O(n) removal positions × O(n) to count frequencies. For n up to 10⁵, this is completely infeasible.

Even a slightly better O(n²) approach would still fail:

- For each prefix, count frequencies (O(n))
- Try to determine if removing one element could equalize frequencies by checking all possible frequency adjustments

The key insight we need is that we can track frequencies incrementally as we process the array, avoiding repeated work.

## Optimized Approach

We need to maintain two hash maps as we process the array:

1. `freq`: number → frequency (how many times each number appears)
2. `freqCount`: frequency → count (how many numbers have each frequency)

The critical observation: After processing each element, the prefix is valid if **one of these conditions holds**:

1. **All numbers appear exactly once** - Removing any element leaves all others appearing once
   - Example: [1, 2, 3] → all freq = 1
   - Condition: Only one frequency (1) and freqCount[1] × 1 = prefix length

2. **All numbers have the same frequency, and one number appears once more than others** - Remove one occurrence of that number
   - Example: [1, 1, 2, 2, 3, 3, 3] → freqs: 2, 2, 3
   - Condition: Two frequencies (f and f+1) where freqCount[f+1] = 1

3. **All numbers have the same frequency except one number appears once** - Remove that singleton
   - Example: [1, 1, 2, 2, 3] → freqs: 2, 2, 1
   - Condition: Two frequencies (1 and f) where freqCount[1] = 1

4. **Only one number appears** - Remove any occurrence
   - Example: [1, 1, 1] → only number 1 appears
   - Condition: Only one number total

By checking these conditions at each step, we can find the longest valid prefix in O(n) time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxEqualFreq(nums):
    """
    Find the longest prefix where removing one element makes all frequencies equal.

    Args:
        nums: List of positive integers

    Returns:
        Length of the longest valid prefix
    """
    from collections import defaultdict

    # freq[number] = frequency of that number in current prefix
    freq = defaultdict(int)

    # freqCount[frequency] = how many numbers have this frequency
    freqCount = defaultdict(int)

    max_len = 0

    for i, num in enumerate(nums):
        # Update frequency of current number
        old_freq = freq[num]
        new_freq = old_freq + 1
        freq[num] = new_freq

        # Update frequency counts
        if old_freq > 0:
            freqCount[old_freq] -= 1
            if freqCount[old_freq] == 0:
                del freqCount[old_freq]

        freqCount[new_freq] += 1

        # Check if current prefix is valid
        # Get the distinct frequencies present
        distinct_freqs = list(freqCount.keys())

        if len(distinct_freqs) == 1:
            # Case 1: All numbers have the same frequency
            f = distinct_freqs[0]
            # Valid if:
            # - All numbers appear once (f == 1), OR
            # - Only one number exists (freqCount[f] == 1)
            if f == 1 or freqCount[f] == 1:
                max_len = i + 1

        elif len(distinct_freqs) == 2:
            f1, f2 = min(distinct_freqs), max(distinct_freqs)

            # Case 2: One number appears once more than others
            # Remove one occurrence of the number with higher frequency
            if f2 == f1 + 1 and freqCount[f2] == 1:
                max_len = i + 1

            # Case 3: One number appears once
            # Remove that singleton
            if f1 == 1 and freqCount[f1] == 1:
                max_len = i + 1

    return max_len
```

```javascript
// Time: O(n) | Space: O(n)
function maxEqualFreq(nums) {
  /**
   * Find the longest prefix where removing one element makes all frequencies equal.
   *
   * @param {number[]} nums - Array of positive integers
   * @return {number} Length of the longest valid prefix
   */

  // freq[number] = frequency of that number in current prefix
  const freq = new Map();

  // freqCount[frequency] = how many numbers have this frequency
  const freqCount = new Map();

  let maxLen = 0;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Update frequency of current number
    const oldFreq = freq.get(num) || 0;
    const newFreq = oldFreq + 1;
    freq.set(num, newFreq);

    // Update frequency counts
    if (oldFreq > 0) {
      freqCount.set(oldFreq, (freqCount.get(oldFreq) || 0) - 1);
      if (freqCount.get(oldFreq) === 0) {
        freqCount.delete(oldFreq);
      }
    }

    freqCount.set(newFreq, (freqCount.get(newFreq) || 0) + 1);

    // Check if current prefix is valid
    const distinctFreqs = Array.from(freqCount.keys());

    if (distinctFreqs.length === 1) {
      // Case 1: All numbers have the same frequency
      const f = distinctFreqs[0];
      // Valid if:
      // - All numbers appear once (f === 1), OR
      // - Only one number exists (freqCount.get(f) === 1)
      if (f === 1 || freqCount.get(f) === 1) {
        maxLen = i + 1;
      }
    } else if (distinctFreqs.length === 2) {
      const f1 = Math.min(distinctFreqs[0], distinctFreqs[1]);
      const f2 = Math.max(distinctFreqs[0], distinctFreqs[1]);

      // Case 2: One number appears once more than others
      // Remove one occurrence of the number with higher frequency
      if (f2 === f1 + 1 && freqCount.get(f2) === 1) {
        maxLen = i + 1;
      }

      // Case 3: One number appears once
      // Remove that singleton
      if (f1 === 1 && freqCount.get(f1) === 1) {
        maxLen = i + 1;
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int maxEqualFreq(int[] nums) {
        /**
         * Find the longest prefix where removing one element makes all frequencies equal.
         *
         * @param nums Array of positive integers
         * @return Length of the longest valid prefix
         */

        // freq[number] = frequency of that number in current prefix
        Map<Integer, Integer> freq = new HashMap<>();

        // freqCount[frequency] = how many numbers have this frequency
        Map<Integer, Integer> freqCount = new HashMap<>();

        int maxLen = 0;

        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];

            // Update frequency of current number
            int oldFreq = freq.getOrDefault(num, 0);
            int newFreq = oldFreq + 1;
            freq.put(num, newFreq);

            // Update frequency counts
            if (oldFreq > 0) {
                freqCount.put(oldFreq, freqCount.get(oldFreq) - 1);
                if (freqCount.get(oldFreq) == 0) {
                    freqCount.remove(oldFreq);
                }
            }

            freqCount.put(newFreq, freqCount.getOrDefault(newFreq, 0) + 1);

            // Check if current prefix is valid
            // Get the distinct frequencies present
            List<Integer> distinctFreqs = new ArrayList<>(freqCount.keySet());

            if (distinctFreqs.size() == 1) {
                // Case 1: All numbers have the same frequency
                int f = distinctFreqs.get(0);
                // Valid if:
                // - All numbers appear once (f == 1), OR
                // - Only one number exists (freqCount.get(f) == 1)
                if (f == 1 || freqCount.get(f) == 1) {
                    maxLen = i + 1;
                }

            } else if (distinctFreqs.size() == 2) {
                int f1 = Math.min(distinctFreqs.get(0), distinctFreqs.get(1));
                int f2 = Math.max(distinctFreqs.get(0), distinctFreqs.get(1));

                // Case 2: One number appears once more than others
                // Remove one occurrence of the number with higher frequency
                if (f2 == f1 + 1 && freqCount.get(f2) == 1) {
                    maxLen = i + 1;
                }

                // Case 3: One number appears once
                // Remove that singleton
                if (f1 == 1 && freqCount.get(f1) == 1) {
                    maxLen = i + 1;
                }
            }
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each element exactly once
- For each element, we perform O(1) hash map operations (get, put, delete)
- The check for valid prefix involves examining at most 2 distinct frequencies, which is O(1)

**Space Complexity: O(n)**

- The `freq` map stores at most n entries (one per unique number)
- The `freqCount` map stores at most O(√n) entries since the sum of frequencies is n, and distinct frequencies are at most O(√n)
- In practice, both maps use O(n) space in worst case when all numbers are distinct

## Common Mistakes

1. **Forgetting to update both maps correctly**: When a number's frequency changes from f to f+1, you must decrement count for f and increment count for f+1. Missing either update breaks the logic.

2. **Not handling the "all frequencies equal" case properly**: When all numbers have frequency f, it's only valid if f=1 (all singletons) or there's only one number total. Candidates often miss the second condition.

3. **Incorrectly checking the two-frequency cases**: For the case with frequencies f and f+1, you need both f2 = f1 + 1 AND exactly one number has frequency f2. Similarly, for frequencies 1 and f, you need exactly one number with frequency 1.

4. **Off-by-one in prefix length**: Remember that array indices are 0-based but prefix lengths are 1-based. When we process nums[i], the current prefix length is i+1.

## When You'll See This Pattern

This frequency counting pattern appears in problems where you need to track distributions and make incremental updates:

1. **Remove Letter To Equalize Frequency (Easy)**: Similar concept of checking if removing one character can equalize frequencies, but simpler since you only check the final state.

2. **Find Original Array From Doubled Array (Medium)**: Uses frequency counting to reconstruct an array from its doubled version.

3. **Top K Frequent Elements (Medium)**: Uses frequency maps and bucket sort based on frequency counts.

4. **Sort Characters By Frequency (Medium)**: Groups characters by frequency and sorts based on frequency counts.

The key pattern is maintaining both element→frequency and frequency→count mappings to answer questions about the distribution efficiently.

## Key Takeaways

1. **Two-level frequency tracking** is powerful: When problems involve frequency distributions, maintaining both `element→frequency` and `frequency→count` maps lets you answer complex queries in O(1) time.

2. **Incremental updates beat recomputation**: By updating our data structures as we process each element, we avoid O(n²) or O(n³) brute force approaches.

3. **Break complex conditions into cases**: The four valid cases seem complex, but they're just logical combinations of frequency patterns. Breaking problems into mutually exclusive cases makes them more manageable.

Related problems: [Remove Letter To Equalize Frequency](/problem/remove-letter-to-equalize-frequency), [Count Submatrices With Equal Frequency of X and Y](/problem/count-submatrices-with-equal-frequency-of-x-and-y)
