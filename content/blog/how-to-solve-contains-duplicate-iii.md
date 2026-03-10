---
title: "How to Solve Contains Duplicate III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Contains Duplicate III. Hard difficulty, 24.5% acceptance rate. Topics: Array, Sliding Window, Sorting, Bucket Sort, Ordered Set."
date: "2027-12-17"
category: "dsa-patterns"
tags: ["contains-duplicate-iii", "array", "sliding-window", "sorting", "hard"]
---

# How to Solve Contains Duplicate III

This problem asks us to find if there exist two indices `i` and `j` where: 1) they're not the same index, 2) their positions differ by at most `indexDiff`, and 3) their values differ by at most `valueDiff`. What makes this problem tricky is that we need to satisfy both constraints simultaneously — we can't just check for nearby duplicates (like in Contains Duplicate II) or just check for value differences. The "hard" difficulty comes from efficiently checking both constraints together without O(n²) comparisons.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 5, 9, 1, 5, 9]`, `indexDiff = 2`, `valueDiff = 3`

We need to find two indices within 2 positions of each other whose values differ by at most 3.

**Step-by-step:**

1. Start with index 0 (value 1). We can compare with indices 1 and 2 (within indexDiff=2):
   - Compare with index 1 (value 5): |1-5| = 4 > 3 ❌
   - Compare with index 2 (value 9): |1-9| = 8 > 3 ❌

2. Move to index 1 (value 5). Compare with indices 0, 2, 3:
   - Already checked index 0
   - Compare with index 2 (value 9): |5-9| = 4 > 3 ❌
   - Compare with index 3 (value 1): |5-1| = 4 > 3 ❌

3. Move to index 2 (value 9). Compare with indices 1, 3, 4:
   - Already checked index 1
   - Compare with index 3 (value 1): |9-1| = 8 > 3 ❌
   - Compare with index 4 (value 5): |9-5| = 4 > 3 ❌

4. Move to index 3 (value 1). Compare with indices 2, 4, 5:
   - Already checked index 2
   - Compare with index 4 (value 5): |1-5| = 4 > 3 ❌
   - Compare with index 5 (value 9): |1-9| = 8 > 3 ❌

5. Move to index 4 (value 5). Compare with indices 3, 5:
   - Already checked index 3
   - Compare with index 5 (value 9): |5-9| = 4 > 3 ❌

No pair found, so return `false`.

The brute force approach would check all these pairs, but we can do better by maintaining a sliding window and using a data structure that lets us quickly check if any value in the window is within `valueDiff` of the current value.

## Brute Force Approach

The most straightforward solution is to check every pair `(i, j)` where `i < j` and `j - i <= indexDiff`. For each such pair, check if `abs(nums[i] - nums[j]) <= valueDiff`. This gives us O(n × indexDiff) comparisons, which is O(n²) in the worst case when `indexDiff` is large.

<div class="code-group">

```python
# Time: O(n × indexDiff) | Space: O(1)
def containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff):
    n = len(nums)
    for i in range(n):
        # Only check j up to i + indexDiff, but don't go past array bounds
        for j in range(i + 1, min(n, i + indexDiff + 1)):
            if abs(nums[i] - nums[j]) <= valueDiff:
                return True
    return False
```

```javascript
// Time: O(n × indexDiff) | Space: O(1)
function containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    // Only check j up to i + indexDiff, but don't go past array bounds
    const end = Math.min(n, i + indexDiff + 1);
    for (let j = i + 1; j < end; j++) {
      if (Math.abs(nums[i] - nums[j]) <= valueDiff) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(n × indexDiff) | Space: O(1)
public boolean containsNearbyAlmostDuplicate(int[] nums, int indexDiff, int valueDiff) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        // Only check j up to i + indexDiff, but don't go past array bounds
        int end = Math.min(n, i + indexDiff + 1);
        for (int j = i + 1; j < end; j++) {
            if (Math.abs((long)nums[i] - (long)nums[j]) <= valueDiff) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

**Why this is insufficient:** When `indexDiff` is large (up to 2×10⁹ in constraints), this becomes O(n²), which is too slow for n up to 2×10⁴. We need a way to check the value condition faster than scanning the entire window.

## Optimized Approach

The key insight is that we need to maintain a sliding window of size `indexDiff + 1` (since `abs(i - j) <= indexDiff` means indices can differ by at most `indexDiff`). Within this window, we need to quickly check if there's any value within `valueDiff` of the current value.

**Two main approaches:**

1. **Bucket Sort Method:** Divide numbers into buckets of size `valueDiff + 1`. If two numbers fall into the same bucket, their difference is ≤ `valueDiff`. If they fall into adjacent buckets, we need to check the actual difference. This gives us O(1) lookup time.

2. **Balanced Binary Search Tree (Ordered Set):** Maintain a sorted set of values in the current window. For each new value, find the closest value in the set (floor and ceiling) and check if the difference is ≤ `valueDiff`. This gives us O(log k) operations where k is the window size.

The bucket approach is more efficient (O(1) vs O(log k)) and is what we'll implement. Here's the reasoning:

- Each bucket has size `bucket_size = valueDiff + 1`
- For a value `x`, its bucket ID is `floor(x / bucket_size)`
- If two values are in the same bucket, their difference is ≤ `valueDiff`
- If they're in adjacent buckets, we need to check the actual difference
- We only need to maintain buckets for the current sliding window

## Optimal Solution

We'll implement the bucket sort approach with a sliding window. The algorithm:

1. Create buckets of size `valueDiff + 1`
2. For each number, calculate its bucket ID
3. Check if the same bucket already exists in the window (direct match)
4. Check adjacent buckets (bucket-1 and bucket+1) for potential matches
5. Maintain only the current window by removing old buckets

<div class="code-group">

```python
# Time: O(n) | Space: O(min(n, indexDiff))
def containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff):
    # Edge case: valueDiff can't be negative
    if valueDiff < 0:
        return False

    # Create bucket dictionary: bucket_id -> value
    buckets = {}
    bucket_size = valueDiff + 1

    for i, num in enumerate(nums):
        # Calculate which bucket this number belongs to
        bucket_id = num // bucket_size

        # Check if we already have a number in the same bucket
        if bucket_id in buckets:
            return True

        # Check the left adjacent bucket
        if bucket_id - 1 in buckets and abs(num - buckets[bucket_id - 1]) <= valueDiff:
            return True

        # Check the right adjacent bucket
        if bucket_id + 1 in buckets and abs(num - buckets[bucket_id + 1]) <= valueDiff:
            return True

        # Add current number to its bucket
        buckets[bucket_id] = num

        # Maintain sliding window: remove bucket that's out of range
        if i >= indexDiff:
            # The number to remove is at position i - indexDiff
            old_bucket_id = nums[i - indexDiff] // bucket_size
            del buckets[old_bucket_id]

    return False
```

```javascript
// Time: O(n) | Space: O(min(n, indexDiff))
function containsNearbyAlmostDuplicate(nums, indexDiff, valueDiff) {
  // Edge case: valueDiff can't be negative
  if (valueDiff < 0) return false;

  // Create bucket map: bucket_id -> value
  const buckets = new Map();
  const bucketSize = valueDiff + 1;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    // Calculate which bucket this number belongs to
    const bucketId = Math.floor(num / bucketSize);

    // Check if we already have a number in the same bucket
    if (buckets.has(bucketId)) return true;

    // Check the left adjacent bucket
    if (buckets.has(bucketId - 1) && Math.abs(num - buckets.get(bucketId - 1)) <= valueDiff) {
      return true;
    }

    // Check the right adjacent bucket
    if (buckets.has(bucketId + 1) && Math.abs(num - buckets.get(bucketId + 1)) <= valueDiff) {
      return true;
    }

    // Add current number to its bucket
    buckets.set(bucketId, num);

    // Maintain sliding window: remove bucket that's out of range
    if (i >= indexDiff) {
      // The number to remove is at position i - indexDiff
      const oldBucketId = Math.floor(nums[i - indexDiff] / bucketSize);
      buckets.delete(oldBucketId);
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(min(n, indexDiff))
public boolean containsNearbyAlmostDuplicate(int[] nums, int indexDiff, int valueDiff) {
    // Edge case: valueDiff can't be negative
    if (valueDiff < 0) return false;

    // Create bucket map: bucket_id -> value
    Map<Long, Long> buckets = new HashMap<>();
    long bucketSize = (long)valueDiff + 1;

    for (int i = 0; i < nums.length; i++) {
        long num = (long)nums[i];
        // Calculate which bucket this number belongs to
        long bucketId = getBucketId(num, bucketSize);

        // Check if we already have a number in the same bucket
        if (buckets.containsKey(bucketId)) return true;

        // Check the left adjacent bucket
        if (buckets.containsKey(bucketId - 1) &&
            Math.abs(num - buckets.get(bucketId - 1)) <= valueDiff) {
            return true;
        }

        // Check the right adjacent bucket
        if (buckets.containsKey(bucketId + 1) &&
            Math.abs(num - buckets.get(bucketId + 1)) <= valueDiff) {
            return true;
        }

        // Add current number to its bucket
        buckets.put(bucketId, num);

        // Maintain sliding window: remove bucket that's out of range
        if (i >= indexDiff) {
            // The number to remove is at position i - indexDiff
            long oldBucketId = getBucketId((long)nums[i - indexDiff], bucketSize);
            buckets.remove(oldBucketId);
        }
    }

    return false;
}

// Helper function to calculate bucket ID
private long getBucketId(long num, long bucketSize) {
    // For negative numbers, we need special handling
    // Example: -1 / 3 = 0 in Java, but we want it in bucket -1
    // So we adjust: if num < 0, subtract 1 before division
    return num < 0 ? (num + 1) / bucketSize - 1 : num / bucketSize;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) — We process each element once. Each operation (bucket calculation, map lookup/insert/delete) is O(1) on average.

**Space Complexity:** O(min(n, indexDiff)) — We store at most `indexDiff + 1` buckets in our map (one per element in the sliding window). In the worst case when `indexDiff ≥ n`, we store O(n) buckets.

**Why it's efficient:** The bucket approach transforms the problem from "find if any two numbers in the window differ by ≤ valueDiff" to "find if any number falls into the same or adjacent bucket," which is an O(1) check per element.

## Common Mistakes

1. **Not handling negative numbers correctly in bucket calculation:** In Java/Python, `-1 // 3 = -1` (Python) or `-1 / 3 = 0` (Java). We need consistent bucket assignment. The Java solution includes a helper function to handle this.

2. **Forgetting to remove old elements from the sliding window:** If we don't remove elements beyond `indexDiff` distance, we'll compare with values that are too far away, violating the index constraint.

3. **Not checking adjacent buckets:** Two numbers could be in adjacent buckets but still have a difference ≤ valueDiff (e.g., bucket 0: value 3, bucket 1: value 4 with valueDiff=1).

4. **Integer overflow when calculating differences:** When values can be up to 2³¹ - 1, their difference can overflow a 32-bit integer. Always use 64-bit integers (long in Java, no issue in Python).

5. **Missing the edge case when valueDiff < 0:** The problem doesn't explicitly forbid negative valueDiff, but mathematically, absolute difference can't be negative, so we should return false immediately.

## When You'll See This Pattern

This "bucket sort with sliding window" pattern appears in problems where you need to find elements satisfying both value and index constraints:

1. **Contains Duplicate II (Easy):** Find duplicates within a distance k. This is a simpler version where valueDiff = 0.

2. **Maximum Gap (Hard):** Uses bucket sort to find maximum difference between successive elements in sorted order.

3. **Longest Repeating Character Replacement (Medium):** Uses sliding window with character counts, similar to maintaining a window of elements.

4. **Sliding Window Maximum (Hard):** Maintains a data structure (deque) to efficiently track max in a sliding window.

The core idea is: when you need to maintain a window and quickly query something about the elements in it, consider bucketization or balanced trees for O(1) or O(log n) operations.

## Key Takeaways

1. **Bucketization converts range queries into equality checks:** By dividing numbers into buckets of size `valueDiff + 1`, we transform "difference ≤ D" into "same or adjacent buckets."

2. **Sliding window + efficient lookup is a powerful combo:** Many array problems become tractable when you maintain a window and use a hash map or tree for fast queries.

3. **Handle edge cases early:** Check for negative valueDiff, integer overflow, and proper bucket calculation for negative numbers before diving into the main logic.

4. **The two-pointer/sliding window pattern often works with other data structures:** Don't just think of sliding window as two pointers; it can work with sets, maps, deques, or trees to maintain window properties efficiently.

Related problems: [Contains Duplicate](/problem/contains-duplicate), [Contains Duplicate II](/problem/contains-duplicate-ii)
