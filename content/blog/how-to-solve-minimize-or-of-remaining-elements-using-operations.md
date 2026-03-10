---
title: "How to Solve Minimize OR of Remaining Elements Using Operations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimize OR of Remaining Elements Using Operations. Hard difficulty, 30.2% acceptance rate. Topics: Array, Greedy, Bit Manipulation."
date: "2026-09-11"
category: "dsa-patterns"
tags:
  [
    "minimize-or-of-remaining-elements-using-operations",
    "array",
    "greedy",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Minimize OR of Remaining Elements Using Operations

You're given an array `nums` and an integer `k`. In each operation, you can replace two adjacent elements with their bitwise AND, reducing the array size by 1. After performing exactly `k` operations, you need to minimize the bitwise OR of the remaining elements. The challenge lies in understanding how bitwise operations interact and finding which pairs to combine to achieve the minimal OR result.

What makes this problem tricky is that operations are irreversible (AND reduces bits), and the order matters since you're always combining adjacent elements. The OR of the final array depends on which bits remain set across any element, so we need to strategically eliminate bits through AND operations.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [7, 3, 5]`, `k = 2`.

**Initial array:** `[7, 3, 5]`  
Binary: `[111, 011, 101]`  
Current OR: `111 | 011 | 101 = 111` (decimal 7)

We need to perform 2 operations (reducing from 3 elements to 1 element).

**Option 1:** Combine first two elements, then combine result with last

- Step 1: `7 & 3 = 3` (binary: `111 & 011 = 011`)
- Array becomes: `[3, 5]`
- Step 2: `3 & 5 = 1` (binary: `011 & 101 = 001`)
- Final array: `[1]`
- Final OR: `1`

**Option 2:** Combine last two elements first, then combine with first

- Step 1: `3 & 5 = 1` (binary: `011 & 101 = 001`)
- Array becomes: `[7, 1]`
- Step 2: `7 & 1 = 1` (binary: `111 & 001 = 001`)
- Final array: `[1]`
- Final OR: `1`

**Option 3:** What if we could choose different pairs? Actually, with `k=2` and `n=3`, we must combine all elements into one. The AND of all elements is `7 & 3 & 5 = 1`, so any sequence of operations that ends with one element gives us `1`.

Now let's try a more interesting example: `nums = [1, 2, 4, 8]`, `k = 2`

**Initial array:** `[1, 2, 4, 8]` (binary: `0001, 0010, 0100, 1000`)  
Initial OR: `1111` (decimal 15)

We need to reduce from 4 elements to 2 elements (since `k=2` operations).

**Key insight:** Each operation combines two adjacent elements into their AND. The AND operation can only clear bits (turn 1→0), never set bits (0→1). So to minimize the final OR, we want to clear as many bits as possible across all remaining elements.

Think about bit positions independently. For a bit to be 1 in the final OR, it must be 1 in at least one remaining element. To clear a bit position, we need to ensure that in every remaining segment (group of elements that weren't combined together), that bit is 0 in all elements of that segment.

This leads to the core realization: We're partitioning the array into `n-k` segments (since we perform `k` operations, reducing `n` elements to `n-k` elements). Within each segment, we take the AND of all elements in that segment. The final OR is the OR of these segment ANDs. Our goal is to choose segment boundaries to minimize this OR.

## Brute Force Approach

A naive approach would try all possible sequences of `k` operations. At each step, we have `n-1` choices (which adjacent pair to combine), leading to an exponential number of possibilities. Even for moderate `n` and `k`, this is infeasible.

Another brute force would be to consider all ways to partition the array into `n-k` segments. For each partition, compute the AND within each segment, then OR those results together, and take the minimum. The number of ways to choose `k` split points in an array of length `n` is `C(n-1, k)`, which is still exponential.

Let's see why this doesn't work efficiently:

<div class="code-group">

```python
# Brute force - tries all partitions (exponential time)
def minOrBruteForce(nums, k):
    n = len(nums)
    target_len = n - k  # We'll have this many segments after k operations

    # We need to choose target_len-1 split points from n-1 possible positions
    # This is combinatorial explosion
    min_val = float('inf')

    # Generate all combinations of split positions
    from itertools import combinations

    # Try all ways to choose (target_len-1) split points
    for splits in combinations(range(1, n), target_len - 1):
        splits = [0] + list(splits) + [n]
        current_or = 0

        # For each segment
        for i in range(len(splits) - 1):
            segment_and = nums[splits[i]]
            for j in range(splits[i] + 1, splits[i + 1]):
                segment_and &= nums[j]
            current_or |= segment_and

        min_val = min(min_val, current_or)

    return min_val

# This is O(2^n) time - completely impractical for n > 20
```

```javascript
// Brute force - exponential time
function minOrBruteForce(nums, k) {
  const n = nums.length;
  const targetLen = n - k;
  let minVal = Infinity;

  // Helper to generate all combinations
  function* combinations(arr, r) {
    if (r === 0) yield [];
    else {
      for (let i = 0; i <= arr.length - r; i++) {
        for (let rest of combinations(arr.slice(i + 1), r - 1)) {
          yield [arr[i], ...rest];
        }
      }
    }
  }

  // All possible positions for splits (1 to n-1)
  const positions = Array.from({ length: n - 1 }, (_, i) => i + 1);

  // Try all combinations of targetLen-1 split points
  for (let splits of combinations(positions, targetLen - 1)) {
    splits = [0, ...splits, n];
    let currentOr = 0;

    for (let i = 0; i < splits.length - 1; i++) {
      let segmentAnd = nums[splits[i]];
      for (let j = splits[i] + 1; j < splits[i + 1]; j++) {
        segmentAnd &= nums[j];
      }
      currentOr |= segmentAnd;
    }

    minVal = Math.min(minVal, currentOr);
  }

  return minVal;
}
```

```java
// Brute force - exponential time
import java.util.*;

public class Solution {
    public int minOrBruteForce(int[] nums, int k) {
        int n = nums.length;
        int targetLen = n - k;
        int minVal = Integer.MAX_VALUE;

        // Generate all combinations of split positions
        List<List<Integer>> allSplits = new ArrayList<>();
        generateCombinations(1, n - 1, targetLen - 1, new ArrayList<>(), allSplits);

        for (List<Integer> splits : allSplits) {
            List<Integer> boundaries = new ArrayList<>();
            boundaries.add(0);
            boundaries.addAll(splits);
            boundaries.add(n);

            int currentOr = 0;
            for (int i = 0; i < boundaries.size() - 1; i++) {
                int segmentAnd = nums[boundaries.get(i)];
                for (int j = boundaries.get(i) + 1; j < boundaries.get(i + 1); j++) {
                    segmentAnd &= nums[j];
                }
                currentOr |= segmentAnd;
            }

            minVal = Math.min(minVal, currentOr);
        }

        return minVal;
    }

    private void generateCombinations(int start, int end, int r,
                                      List<Integer> current,
                                      List<List<Integer>> result) {
        if (r == 0) {
            result.add(new ArrayList<>(current));
            return;
        }

        for (int i = start; i <= end - r + 1; i++) {
            current.add(i);
            generateCombinations(i + 1, end, r - 1, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

</div>

The brute force is clearly impractical. We need a smarter approach that doesn't explore all partitions.

## Optimized Approach

The key insight is to think **bit-by-bit** from the most significant bit to the least significant. For each bit position (from highest to lowest), we ask: "Can we clear this bit in the final OR?"

Remember: A bit is 1 in the final OR if it's 1 in at least one segment's AND. To clear a bit, we need every segment to have that bit as 0 in its AND result.

For a segment to have a bit as 0 in its AND, **every element in that segment must have that bit as 0**. So if we want to clear bit `b`, we need to partition the array such that each segment contains only elements where bit `b` is 0.

This leads to a greedy strategy:

1. Start with answer = 0 (all bits cleared)
2. For each bit from most significant (bit 30 for 32-bit integers) to least significant (bit 0):
   - Try to keep this bit cleared in our answer (set it to 0)
   - Check if we can partition the array into at most `n-k` segments where each segment contains only elements with this bit (and all higher bits we've already decided on) as 0
   - If yes, we can keep this bit as 0
   - If no, we must set this bit to 1 in our answer

How do we check if we can partition with certain bits cleared?

- We iterate through the array, accumulating elements into the current segment
- We can only include an element in the current segment if it doesn't have any of the "forbidden" bits set (bits we're trying to keep as 0)
- When we encounter an element with a forbidden bit, we must end the current segment and start a new one
- If we need more than `n-k` segments, it's impossible

This works because we process bits from most to least significant. Once we decide a bit must be 1 in the answer, we allow it in future segments. This greedy approach is optimal because clearing a higher bit gives us more benefit than clearing any combination of lower bits.

## Optimal Solution

Here's the implementation of the greedy bit-by-bit approach:

<div class="code-group">

```python
# Time: O(n * B) where B = 31 (bits in integer)
# Space: O(1)
def minOr(nums, k):
    n = len(nums)
    answer = 0

    # Process bits from most significant (30) to least significant (0)
    for bit in range(30, -1, -1):
        # Try to keep this bit as 0 in our answer
        candidate = answer  # Bits we've already decided must be 1

        # Count how many segments we need if we try to avoid this bit
        segments = 0
        current_and = (1 << 31) - 1  # All bits set initially

        for num in nums:
            current_and &= num

            # Check if current_and has any of the bits we're trying to avoid
            # We're trying to avoid bits where candidate has 0 (we want them 0)
            # Actually, we need to check: if we include this num in current segment,
            # will it cause any "forbidden" bit to appear in the segment's AND?
            # Forbidden bits are those where (candidate >> bit) & 1 == 0
            # But simpler: we check if (current_and & ~candidate) != 0
            # Actually, we want to check if current segment would have bit 'bit' set
            # if we're currently testing bit 'bit'

            # Better approach: We're testing if we can avoid setting bit 'bit'
            # So we check if current segment, when ANDed with all elements so far,
            # would have bit 'bit' set. If it would, we need to end the segment.

            # Actually, the clean way: We want each segment to have bit 'bit' = 0
            # So we can't include any element with bit 'bit' = 1 in a segment
            # that already has elements with bit 'bit' = 0

            # Let's use mask to check forbidden bits
            mask = candidate | (1 << bit)  # Bits we allow (either already 1 in answer or current bit)
            # We want to avoid bits not in mask (bits we want to keep as 0)

            if (current_and & ~mask) != 0:
                # Current segment would have a forbidden bit in its AND
                # End current segment and start new one
                segments += 1
                current_and = num

        # Don't forget the last segment
        if current_and != ((1 << 31) - 1):  # If we started a segment
            segments += 1

        # Check if we can partition into at most n-k segments
        if segments > n - k:
            # We need too many segments, so we must set this bit to 1
            answer |= (1 << bit)

    return answer

# More intuitive implementation
def minOrOptimized(nums, k):
    n = len(nums)
    answer = 0
    remaining = n - k  # Number of segments we can have

    # Check each bit from most to least significant
    for bit in range(30, -1, -1):
        # Try to keep this bit as 0
        # Count how many segments we need if we avoid elements with this bit set
        count = 0
        current = -1  # All bits set (AND identity)

        for num in nums:
            current &= num
            # If current segment would have bit 'bit' set in its AND
            # (meaning all elements in segment have bit 'bit' = 1)
            # Actually, we need to check if we can add this num to current segment
            # without causing the segment's AND to have any bit we're avoiding

            # Simpler: We're testing if we can avoid bit 'bit'
            # So we end a segment before we include an element with bit 'bit' = 0
            # Wait, that's backwards...

            # Correct logic: We want each segment's AND to have bit 'bit' = 0
            # So we must end a segment when we encounter an element with bit 'bit' = 1
            # because including it would make the segment's AND potentially have bit 'bit' = 1

            if (current >> bit) & 1 == 0:
                # Current segment's AND has bit 'bit' = 0, good, continue
                continue
            else:
                # Current segment would have bit 'bit' = 1 in its AND
                # End this segment and start new one
                count += 1
                current = num

        # Don't forget last segment
        if current != -1:
            count += 1

        # If we need more segments than allowed, we must set this bit to 1
        if count > remaining:
            answer |= (1 << bit)
        # Otherwise, we keep it as 0

    return answer

# Even cleaner implementation
def minimumOr(nums, k):
    n = len(nums)
    answer = 0
    m = n - k  # We'll have m segments after k operations

    # Check each bit position
    for b in range(30, -1, -1):
        # Try to keep this bit 0
        test_mask = answer | (1 << b)  # Bits we're allowing

        # Count segments needed
        segments = 0
        current = -1  # Start with all 1s

        for x in nums:
            current &= x
            # If current segment, when masked, is not all 0s
            # (meaning it has bits outside our allowed mask)
            if (current & ~test_mask) != 0:
                # This segment would have forbidden bits
                segments += 1
                current = x  # Start new segment

        # Check last segment
        if current != -1:
            segments += 1

        # If we need too many segments, we must set this bit
        if segments > m:
            answer |= (1 << b)

    return answer
```

```javascript
// Time: O(n * 31) = O(n)
// Space: O(1)
function minimumOr(nums, k) {
  const n = nums.length;
  let answer = 0;
  const m = n - k; // Number of segments we can have

  // Check each bit from most significant to least
  for (let b = 30; b >= 0; b--) {
    // Try to keep this bit as 0
    const testMask = answer | (1 << b);

    // Count how many segments we need
    let segments = 0;
    let current = -1; // All bits set (AND identity)

    for (let x of nums) {
      current &= x;

      // Check if current segment has any forbidden bits
      // Forbidden bits are those NOT in testMask
      if ((current & ~testMask) !== 0) {
        // This segment would have bits we're trying to avoid
        segments++;
        current = x; // Start new segment with current element
      }
    }

    // Don't forget the last segment
    if (current !== -1) {
      segments++;
    }

    // If we need more segments than allowed, we must set this bit
    if (segments > m) {
      answer |= 1 << b;
    }
  }

  return answer;
}
```

```java
// Time: O(n * 31) = O(n)
// Space: O(1)
class Solution {
    public int minimumOr(int[] nums, int k) {
        int n = nums.length;
        int answer = 0;
        int m = n - k;  // Number of segments we can have

        // Check each bit from most significant (30) to least (0)
        for (int b = 30; b >= 0; b--) {
            // Try to keep this bit as 0 in the answer
            int testMask = answer | (1 << b);

            // Count how many segments we would need
            int segments = 0;
            int current = -1;  // All bits set (AND identity)

            for (int x : nums) {
                current &= x;

                // Check if current segment has any forbidden bits
                // Forbidden bits are those NOT in testMask
                if ((current & ~testMask) != 0) {
                    // This segment would contain bits we want to avoid
                    segments++;
                    current = x;  // Start new segment
                }
            }

            // Don't forget the last segment
            if (current != -1) {
                segments++;
            }

            // If we need more segments than allowed, we must set this bit
            if (segments > m) {
                answer |= (1 << b);
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* B) where B is the number of bits (31 for 32-bit integers). We iterate through all bits from 30 down to 0, and for each bit, we make a pass through the array to count segments. This simplifies to O(n) since B is constant.

**Space Complexity:** O(1). We only use a few integer variables regardless of input size.

The algorithm is efficient because:

1. We process bits independently, leveraging the property that higher bits dominate lower bits in value
2. Each bit check requires a single linear scan of the array
3. We make optimal local decisions (clearing higher bits when possible) that lead to the global optimum

## Common Mistakes

1. **Trying to simulate operations directly:** Some candidates try to simulate the actual AND operations in different orders. This leads to exponential complexity. Remember that the order doesn't matter for the final segments - only which elements end up in the same segment matters.

2. **Wrong bit processing order:** Processing bits from least to most significant won't work. We need to prioritize clearing higher bits first because they contribute more to the OR value. A higher bit set to 1 is worse than all lower bits set to 1 combined.

3. **Incorrect segment counting:** Forgetting to count the last segment or incorrectly determining when to end a segment. The logic "end segment when adding an element would cause the segment's AND to have a forbidden bit" is subtle but crucial.

4. **Misunderstanding the relationship between k and segments:** After k operations, we have n-k elements remaining, which means we have n-k segments. Some candidates think in terms of "operations left" rather than "segments needed."

## When You'll See This Pattern

This "bit-by-bit greedy with feasibility check" pattern appears in several optimization problems involving bitwise operations:

1. **Maximum XOR After Operations (Medium):** Similar bit-by-bit reasoning but for maximizing XOR instead of minimizing OR. You decide bit-by-bit whether you can achieve a 1 in each position.

2. **Minimum OR After Removals (similar pattern):** Problems where you remove elements to minimize OR often use similar bitwise greedy approaches.

3. **Bitmask DP problems:** While this solution uses greedy, similar problems might use DP over bitmasks when the greedy approach doesn't work.

The key insight is that for bitwise OR/AND/XOR optimization, you can often consider bits independently from most to least significant, making a greedy choice at each step.

## Key Takeaways

1. **Bitwise problems often allow independent bit consideration:** When optimizing OR, AND, or XOR, you can frequently process bits from most to least significant, making decisions independently for each bit position.

2. **Greedy with feasibility check is powerful:** For each bit, try to achieve the better outcome (0 for OR minimization), then check if it's possible. If not, settle for the worse outcome (1). This works when higher bits dominate lower bits.

3. **Transform operation problems into partitioning problems:** Instead of thinking about sequences of operations, think about the final state. Here, k operations mean partitioning into n-k segments, which is much easier to reason about.

**Related problems:** [Maximum XOR After Operations](/problem/maximum-xor-after-operations), [Apply Operations on Array to Maximize Sum of Squares](/problem/apply-operations-on-array-to-maximize-sum-of-squares)
