---
title: "How to Solve Count the Number of Good Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Good Subarrays. Medium difficulty, 65.9% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2026-12-26"
category: "dsa-patterns"
tags: ["count-the-number-of-good-subarrays", "array", "hash-table", "sliding-window", "medium"]
---

# How to Solve Count the Number of Good Subarrays

This problem asks us to count all contiguous subarrays where there are at least `k` pairs of equal elements. A "pair" here means two indices `(i, j)` with `i < j` and `arr[i] == arr[j]`. What makes this problem interesting is that we need to count pairs within subarrays, not just count frequencies. The brute force approach would be too slow, so we need a clever way to track how many pairs we have as we expand and contract our window.

## Visual Walkthrough

Let's trace through `nums = [1, 1, 1, 1, 1]` with `k = 3`:

**Understanding the pair counting:**

- In a subarray with `n` identical elements, the number of pairs equals `n * (n-1) / 2` (choose any 2 from n)
- For `[1, 1, 1]`: 3 elements → `3 * 2 / 2 = 3` pairs
- For `[1, 1, 1, 1]`: 4 elements → `4 * 3 / 2 = 6` pairs

**Counting good subarrays:**

1. Start with left = 0, right = 0: `[1]` has 0 pairs (not enough)
2. Expand right: `[1, 1]` has 1 pair (not enough)
3. Expand right: `[1, 1, 1]` has 3 pairs (enough! k=3)
   - All subarrays ending at index 2 that start at or before index 0 are good
   - That's `[1, 1, 1]` only for now
4. Expand right: `[1, 1, 1, 1]` has 6 pairs
   - All subarrays ending at index 3 that start at or before index 0 are good
   - That's `[1, 1, 1, 1]`, `[1, 1, 1]` (starting at 1), `[1, 1]` (starting at 2) - wait, check carefully

Actually, we need to be systematic. Let's use a sliding window approach:

- When we have enough pairs in our window, we know ALL subarrays that start at our current `left` and end anywhere from `right` to the end of array will be good
- But we need to count ALL good subarrays, not just those starting at current left

The key insight: For each `right`, find the smallest `left` such that `window[left:right+1]` has at least k pairs. Then ALL subarrays ending at `right` that start at or before this `left` are good.

## Brute Force Approach

The brute force solution would check every possible subarray:

1. Generate all O(n²) subarrays
2. For each subarray, count pairs of equal elements
3. Count how many have at least k pairs

This is O(n³) time (O(n²) subarrays × O(n) to count pairs) or O(n²) with optimization (precomputing frequencies). Even O(n²) is too slow for n up to 10⁵.

<div class="code-group">

```python
# Brute Force - Too Slow for Large Inputs
# Time: O(n³) | Space: O(1)
def countGoodBruteForce(nums, k):
    n = len(nums)
    count = 0

    # Check all possible subarrays
    for i in range(n):
        for j in range(i, n):
            # Count pairs in subarray nums[i:j+1]
            freq = {}
            pairs = 0

            # Count frequencies in current subarray
            for idx in range(i, j + 1):
                num = nums[idx]
                freq[num] = freq.get(num, 0) + 1

            # Calculate pairs from frequencies
            for f in freq.values():
                pairs += f * (f - 1) // 2

            if pairs >= k:
                count += 1

    return count
```

```javascript
// Brute Force - Too Slow for Large Inputs
// Time: O(n³) | Space: O(1)
function countGoodBruteForce(nums, k) {
  const n = nums.length;
  let count = 0;

  // Check all possible subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count pairs in subarray nums[i..j]
      const freq = new Map();
      let pairs = 0;

      // Count frequencies in current subarray
      for (let idx = i; idx <= j; idx++) {
        const num = nums[idx];
        freq.set(num, (freq.get(num) || 0) + 1);
      }

      // Calculate pairs from frequencies
      for (const f of freq.values()) {
        pairs += (f * (f - 1)) / 2;
      }

      if (pairs >= k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Brute Force - Too Slow for Large Inputs
// Time: O(n³) | Space: O(1)
public int countGoodBruteForce(int[] nums, int k) {
    int n = nums.length;
    int count = 0;

    // Check all possible subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count pairs in subarray nums[i..j]
            Map<Integer, Integer> freq = new HashMap<>();
            int pairs = 0;

            // Count frequencies in current subarray
            for (int idx = i; idx <= j; idx++) {
                int num = nums[idx];
                freq.put(num, freq.getOrDefault(num, 0) + 1);
            }

            // Calculate pairs from frequencies
            for (int f : freq.values()) {
                pairs += f * (f - 1) / 2;
            }

            if (pairs >= k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is to use a **sliding window with pair counting**:

1. **Track pairs dynamically**: When we add/remove an element from our window, we can update the pair count in O(1) time using frequency counts
   - Adding element `x`: If it already has `freq[x]` occurrences, we gain `freq[x]` new pairs (new element pairs with each existing one)
   - Removing element `x`: If it has `freq[x]` occurrences before removal, we lose `freq[x] - 1` pairs

2. **Sliding window logic**: For each `right` (end of window), find the smallest `left` such that `window[left:right+1]` has at least k pairs
   - Once we find such a `left`, ALL subarrays ending at `right` that start at `0, 1, ..., left` are good
   - So we add `left + 1` to our answer (since left is 0-indexed)

3. **Why this works**: As we move `right` forward, the minimum valid `left` can only stay the same or increase (monotonic property). This gives us O(n) time.

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution using Sliding Window
# Time: O(n) | Space: O(n)
def countGood(nums, k):
    n = len(nums)
    freq = {}  # Track frequency of elements in current window
    pairs = 0  # Track number of pairs in current window
    left = 0   # Left pointer of sliding window
    count = 0  # Final answer

    for right in range(n):
        # Add nums[right] to the window
        # When adding an element x, it forms pairs with all existing occurrences of x
        # If x appears f times already, adding it creates f new pairs
        x = nums[right]
        freq[x] = freq.get(x, 0) + 1
        pairs += freq[x] - 1  # Each existing occurrence forms a pair with the new one

        # While we have enough pairs, try to shrink window from left
        # This finds the smallest left such that window[left:right+1] has >= k pairs
        while pairs >= k:
            # All subarrays ending at 'right' that start at or before 'left' are good
            # That's (left + 1) subarrays: starting at 0, 1, ..., left
            count += left + 1

            # Remove nums[left] from window
            # When removing an element y, we lose pairs with all remaining occurrences
            # If y appears f times before removal, removing it removes (f-1) pairs
            y = nums[left]
            pairs -= freq[y] - 1  # Remove pairs formed with this element
            freq[y] -= 1
            left += 1  # Move left pointer forward

    return count
```

```javascript
// Optimal Solution using Sliding Window
// Time: O(n) | Space: O(n)
function countGood(nums, k) {
  const n = nums.length;
  const freq = new Map(); // Track frequency of elements in current window
  let pairs = 0; // Track number of pairs in current window
  let left = 0; // Left pointer of sliding window
  let count = 0; // Final answer

  for (let right = 0; right < n; right++) {
    // Add nums[right] to the window
    // When adding an element x, it forms pairs with all existing occurrences of x
    // If x appears f times already, adding it creates f new pairs
    const x = nums[right];
    const currentFreq = (freq.get(x) || 0) + 1;
    freq.set(x, currentFreq);
    pairs += currentFreq - 1; // Each existing occurrence forms a pair with the new one

    // While we have enough pairs, try to shrink window from left
    // This finds the smallest left such that window[left:right+1] has >= k pairs
    while (pairs >= k) {
      // All subarrays ending at 'right' that start at or before 'left' are good
      // That's (left + 1) subarrays: starting at 0, 1, ..., left
      count += left + 1;

      // Remove nums[left] from window
      // When removing an element y, we lose pairs with all remaining occurrences
      // If y appears f times before removal, removing it removes (f-1) pairs
      const y = nums[left];
      const yFreq = freq.get(y);
      pairs -= yFreq - 1; // Remove pairs formed with this element
      freq.set(y, yFreq - 1);
      left++; // Move left pointer forward
    }
  }

  return count;
}
```

```java
// Optimal Solution using Sliding Window
// Time: O(n) | Space: O(n)
public int countGood(int[] nums, int k) {
    int n = nums.length;
    Map<Integer, Integer> freq = new HashMap<>();  // Track frequency of elements in current window
    int pairs = 0;     // Track number of pairs in current window
    int left = 0;      // Left pointer of sliding window
    int count = 0;     // Final answer

    for (int right = 0; right < n; right++) {
        // Add nums[right] to the window
        // When adding an element x, it forms pairs with all existing occurrences of x
        // If x appears f times already, adding it creates f new pairs
        int x = nums[right];
        int currentFreq = freq.getOrDefault(x, 0) + 1;
        freq.put(x, currentFreq);
        pairs += currentFreq - 1;  // Each existing occurrence forms a pair with the new one

        // While we have enough pairs, try to shrink window from left
        // This finds the smallest left such that window[left:right+1] has >= k pairs
        while (pairs >= k) {
            // All subarrays ending at 'right' that start at or before 'left' are good
            // That's (left + 1) subarrays: starting at 0, 1, ..., left
            count += left + 1;

            // Remove nums[left] from window
            // When removing an element y, we lose pairs with all remaining occurrences
            // If y appears f times before removal, removing it removes (f-1) pairs
            int y = nums[left];
            int yFreq = freq.get(y);
            pairs -= yFreq - 1;  // Remove pairs formed with this element
            freq.put(y, yFreq - 1);
            left++;  // Move left pointer forward
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once with the `right` pointer (O(n))
- The `left` pointer only moves forward and never backward, so total left movements are O(n)
- Each element is added once and removed once from the window
- All hash map operations are O(1) on average

**Space Complexity: O(n)**

- In the worst case, all elements are distinct, and our frequency map stores n entries
- We use O(1) additional variables for pointers and counters

## Common Mistakes

1. **Incorrect pair counting when adding/removing elements**:
   - Mistake: Adding `freq[x]` pairs instead of `freq[x] - 1` when adding element `x`
   - Why: If `x` appears `f` times before adding, the new element pairs with each existing one, creating `f` pairs, not `f-1`
   - Fix: When adding: `pairs += freq[x]` (before incrementing freq), when removing: `pairs -= freq[x] - 1` (after decrementing freq)

2. **Wrong count increment**:
   - Mistake: Adding `1` instead of `left + 1` when window has enough pairs
   - Why: For fixed `right`, ALL subarrays starting at `0..left` and ending at `right` are good, not just the current window
   - Fix: Add `left + 1` to count (or `left` if using 1-indexed)

3. **Using while loop instead of if**:
   - Mistake: Using `if (pairs >= k)` instead of `while (pairs >= k)`
   - Why: We need to shrink window as much as possible to find minimum valid `left`
   - Fix: Use `while` to keep shrinking until we no longer have enough pairs

4. **Off-by-one in frequency updates**:
   - Mistake: Updating frequency before calculating pair changes
   - Why: Pair calculation depends on frequency BEFORE addition/removal
   - Fix: Calculate pair change using old frequency, THEN update frequency

## When You'll See This Pattern

This sliding window pattern with pair/frequency tracking appears in problems where you need to count subarrays satisfying some condition based on element frequencies:

1. **Subarrays with K Different Integers** (LeetCode 992): Count subarrays with exactly K distinct integers
2. **Count Number of Nice Subarrays** (LeetCode 1248): Count subarrays with exactly K odd numbers
3. **Fruit Into Baskets** (LeetCode 904): Find longest subarray with at most 2 distinct values
4. **Longest Substring Without Repeating Characters** (LeetCode 3): Uses similar sliding window with frequency tracking

The core pattern: Maintain a window that satisfies some condition, use two pointers to find all valid subarrays ending at each position, and update counts efficiently as window changes.

## Key Takeaways

1. **Sliding window with pair counting**: When you need to track "pairs of equal elements" in a subarray, maintain frequency counts and update pair counts in O(1) when adding/removing elements
2. **Count all valid subarrays trick**: For each ending position `right`, find the smallest starting position `left` that makes the subarray valid. Then ALL subarrays `[0..left, right]`, `[1..left, right]`, ..., `[left, right]` are valid
3. **Monotonic property**: As `right` increases, the minimum valid `left` never decreases. This allows O(n) time with two pointers

Related problems: [Count Number of Homogenous Substrings](/problem/count-number-of-homogenous-substrings), [Maximum Sum of Distinct Subarrays With Length K](/problem/maximum-sum-of-distinct-subarrays-with-length-k)
