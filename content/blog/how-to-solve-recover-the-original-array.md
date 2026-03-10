---
title: "How to Solve Recover the Original Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Recover the Original Array. Hard difficulty, 41.3% acceptance rate. Topics: Array, Hash Table, Two Pointers, Sorting, Enumeration."
date: "2026-03-08"
category: "dsa-patterns"
tags: ["recover-the-original-array", "array", "hash-table", "two-pointers", "hard"]
---

# How to Solve Recover the Original Array

Alice had an array of positive integers, chose a positive integer `k`, and created two new arrays: `lower` where each element is `arr[i] - k`, and `higher` where each element is `arr[i] + k`. These arrays were then shuffled together into a single array `nums` of length `2n`. Your task is to recover the original array `arr` and the value `k` from `nums`. This problem is tricky because you need to simultaneously determine both `k` and which elements belong to the original array, with the added complexity that `k` must be positive and all elements must be integers.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [2, 10, 6, 4, 8, 12]`.

**Step 1: Understanding the relationship**

- If `arr = [a, b, c]` and we choose some `k > 0`, then:
  - `lower = [a-k, b-k, c-k]`
  - `higher = [a+k, b+k, c+k]`
- When shuffled together, we get `nums` containing both `a-k` and `a+k` for each original element `a`.

**Step 2: Sorting the array**
First, sort `nums`: `[2, 4, 6, 8, 10, 12]`

**Step 3: Finding candidate k values**
The smallest element must come from a `lower` array (since `arr[i] - k` is smaller than `arr[i] + k`). So `nums[0] = 2` is some `arr[i] - k`.

For each larger element `nums[j]` where `j > 0`, we can test if it could be the corresponding `arr[i] + k`:

- If `nums[j] = 4`, then `k = (4 - 2)/2 = 1`
- If `nums[j] = 6`, then `k = (6 - 2)/2 = 2`
- If `nums[j] = 8`, then `k = (8 - 2)/2 = 3`
- If `nums[j] = 10`, then `k = (10 - 2)/2 = 4`
- If `nums[j] = 12`, then `k = (12 - 2)/2 = 5`

**Step 4: Testing k = 2**
Let's test `k = 2` (from pairing `2` with `6`):

- Original elements would be `(2 + 6)/2 = 4`
- We need to find pairs where one is `x - 2` and the other is `x + 2`
- From sorted `[2, 4, 6, 8, 10, 12]`:
  - Pair 2 and 6 → original element 4
  - Pair 4 and 8 → original element 6
  - Pair 10 and 12 → original element 11
- This gives us `arr = [4, 6, 11]` and `k = 2`

**Step 5: Verification**
Check if this works:

- `4-2=2`, `4+2=6` → both in `nums` ✓
- `6-2=4`, `6+2=8` → both in `nums` ✓
- `11-2=9`, `11+2=13` → 9 not in `nums` ✗

So `k=2` doesn't work. We need to systematically test each candidate.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible `k` values from differences between elements
2. For each `k`, try to match elements into pairs `(x, x+2k)` where `x` is from lower array
3. Check if we can form `n` valid pairs

The brute force would involve:

- Considering all `O(n²)` possible `k` values (from differences between elements)
- For each `k`, trying to match elements which is `O(n log n)` with sorting
- Overall complexity: `O(n³ log n)` which is far too slow for `n` up to 1000

What makes this approach infeasible is that we can't afford to try every possible pairing combination. We need a more systematic way to test candidate `k` values.

## Optimized Approach

The key insight is that **the smallest element in `nums` must come from the `lower` array**. Why? Because `arr[i] - k < arr[i] + k` for all `i` when `k > 0`. Therefore, `nums[0]` (after sorting) is some `arr[i] - k`.

With this insight, we can:

1. Sort `nums` to bring order to the shuffled elements
2. For each element `nums[j]` where `j > 0`, calculate `k = (nums[j] - nums[0])/2`
3. Only consider `k` where:
   - `k > 0` (given in problem)
   - `(nums[j] - nums[0])` is even (so `k` is integer)
4. For each valid candidate `k`, try to reconstruct the original array using a frequency map

The reconstruction process for a candidate `k`:

- Use a hash map to count frequencies of elements in `nums`
- For each element `x` in sorted order:
  - If `freq[x] == 0`, skip (already used in a pair)
  - Otherwise, check if `x + 2*k` exists with positive frequency
  - If yes, decrement counts for both `x` and `x + 2*k`, add `(x + k)` to result (the original element)
  - If no, this `k` is invalid

This works because if `x` is from the lower array, its partner `x + 2k` must be in the higher array, and together they give us the original element `x + k`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) in worst case, but typically much faster due to early termination
# Space: O(n) for the frequency map
def recoverArray(nums):
    n = len(nums)
    nums.sort()  # Step 1: Sort to bring order

    # Try each possible partner for the smallest element
    for i in range(1, n):
        diff = nums[i] - nums[0]

        # k must be positive integer, so diff must be positive and even
        if diff == 0 or diff % 2 != 0:
            continue

        k = diff // 2
        if k == 0:
            continue

        # Frequency map to track available elements
        from collections import Counter
        freq = Counter(nums)

        result = []
        valid = True

        # Try to reconstruct using this k
        for num in nums:
            if freq[num] == 0:
                continue  # Already used in a pair

            # If num is available, its partner should be num + 2*k
            partner = num + 2 * k

            if freq[partner] == 0:
                valid = False  # No partner found
                break

            # Use this pair
            freq[num] -= 1
            freq[partner] -= 1
            result.append(num + k)  # Original element

        if valid and len(result) == n // 2:
            return result

    return []  # No valid k found
```

```javascript
// Time: O(n²) in worst case, but typically much faster due to early termination
// Space: O(n) for the frequency map
function recoverArray(nums) {
  const n = nums.length;
  nums.sort((a, b) => a - b); // Step 1: Sort to bring order

  // Try each possible partner for the smallest element
  for (let i = 1; i < n; i++) {
    const diff = nums[i] - nums[0];

    // k must be positive integer, so diff must be positive and even
    if (diff === 0 || diff % 2 !== 0) {
      continue;
    }

    const k = diff / 2;
    if (k === 0) {
      continue;
    }

    // Frequency map to track available elements
    const freq = new Map();
    for (const num of nums) {
      freq.set(num, (freq.get(num) || 0) + 1);
    }

    const result = [];
    let valid = true;

    // Try to reconstruct using this k
    for (const num of nums) {
      if (freq.get(num) === 0) {
        continue; // Already used in a pair
      }

      // If num is available, its partner should be num + 2*k
      const partner = num + 2 * k;

      if (!freq.has(partner) || freq.get(partner) === 0) {
        valid = false; // No partner found
        break;
      }

      // Use this pair
      freq.set(num, freq.get(num) - 1);
      freq.set(partner, freq.get(partner) - 1);
      result.push(num + k); // Original element
    }

    if (valid && result.length === n / 2) {
      return result;
    }
  }

  return []; // No valid k found
}
```

```java
// Time: O(n²) in worst case, but typically much faster due to early termination
// Space: O(n) for the frequency map
import java.util.*;

class Solution {
    public int[] recoverArray(int[] nums) {
        int n = nums.length;
        Arrays.sort(nums);  // Step 1: Sort to bring order

        // Try each possible partner for the smallest element
        for (int i = 1; i < n; i++) {
            int diff = nums[i] - nums[0];

            // k must be positive integer, so diff must be positive and even
            if (diff == 0 || diff % 2 != 0) {
                continue;
            }

            int k = diff / 2;
            if (k == 0) {
                continue;
            }

            // Frequency map to track available elements
            Map<Integer, Integer> freq = new HashMap<>();
            for (int num : nums) {
                freq.put(num, freq.getOrDefault(num, 0) + 1);
            }

            List<Integer> result = new ArrayList<>();
            boolean valid = true;

            // Try to reconstruct using this k
            for (int num : nums) {
                if (freq.get(num) == 0) {
                    continue;  // Already used in a pair
                }

                // If num is available, its partner should be num + 2*k
                int partner = num + 2 * k;

                if (!freq.containsKey(partner) || freq.get(partner) == 0) {
                    valid = false;  // No partner found
                    break;
                }

                // Use this pair
                freq.put(num, freq.get(num) - 1);
                freq.put(partner, freq.get(partner) - 1);
                result.add(num + k);  // Original element
            }

            if (valid && result.size() == n / 2) {
                // Convert List to array
                int[] arr = new int[result.size()];
                for (int j = 0; j < result.size(); j++) {
                    arr[j] = result.get(j);
                }
                return arr;
            }
        }

        return new int[0];  // No valid k found
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting takes `O(n log n)` where `n` is the length of `nums`
- Outer loop runs `O(n)` times (trying each possible partner for smallest element)
- For each candidate `k`, we process all elements once: `O(n)`
- Total: `O(n log n + n²) = O(n²)` in worst case

**Space Complexity:**

- `O(n)` for the frequency map storing counts of all elements
- `O(n)` for the result array (or `O(1)` if we don't count output)
- Total: `O(n)`

In practice, the algorithm often terminates early when it finds a valid `k`, so average case is better than worst case.

## Common Mistakes

1. **Forgetting that k must be positive integer**: Some candidates forget to check that `(nums[j] - nums[0])` must be even and positive. If the difference is odd, `k` wouldn't be integer.

2. **Not using a frequency map properly**: Attempting to mark elements as "used" by setting them to a special value or removing from an array leads to `O(n²)` operations. A frequency map allows `O(1)` lookups and updates.

3. **Assuming the smallest element pairs with the second smallest**: The smallest element could pair with any larger element, not necessarily the immediate next one. We need to try all possible partners.

4. **Not handling duplicate elements correctly**: When `nums` contains duplicates, we need to track how many of each value are still available. The frequency map handles this naturally.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Pair matching with constraints**: Similar to "Find Original Array From Doubled Array" where you need to match each element with its double. Here, you match `x` with `x + 2k`.

2. **Using the smallest/largest element as anchor**: Many reconstruction problems use extreme elements as starting points. For example, in "Find Array Given Subset Sums", you often start with the smallest or largest sum.

3. **Frequency maps for element availability**: When you need to track which elements are still available for pairing, frequency maps are more efficient than searching arrays.

Related problems:

- **Find Original Array From Doubled Array**: Match each element with its double to recover original array
- **Find Array Given Subset Sums**: Reconstruct array from all subset sums using similar pairing logic
- **Array of Doubled Pairs**: Similar pairing concept but with different constraints

## Key Takeaways

1. **When reconstructing from transformed data, look for invariants**: Here, the invariant is that the smallest element must come from the lower array. Finding such invariants is key to many reconstruction problems.

2. **Frequency maps efficiently track element availability**: Instead of modifying arrays or using boolean arrays, hash maps with counts provide `O(1)` operations for checking and updating availability.

3. **Test candidates systematically, not exhaustively**: We don't need to try all `O(n²)` pairings—by fixing the smallest element's partner, we reduce the search space dramatically.

Related problems: [Find Array Given Subset Sums](/problem/find-array-given-subset-sums), [Find Original Array From Doubled Array](/problem/find-original-array-from-doubled-array)
