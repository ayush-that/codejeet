---
title: "How to Solve Minimum Number of K Consecutive Bit Flips — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of K Consecutive Bit Flips. Hard difficulty, 62.2% acceptance rate. Topics: Array, Bit Manipulation, Queue, Sliding Window, Prefix Sum."
date: "2026-10-24"
category: "dsa-patterns"
tags: ["minimum-number-of-k-consecutive-bit-flips", "array", "bit-manipulation", "queue", "hard"]
---

# How to Solve Minimum Number of K Consecutive Bit Flips

This problem asks us to transform a binary array entirely to 1's using the minimum number of operations where each operation flips exactly `k` consecutive bits. What makes this problem tricky is that flips are not independent—each flip affects multiple positions, and the order matters. The challenge is finding an efficient way to track whether each position needs to be flipped without actually performing all flips explicitly.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [0,1,0]`, `k = 2`

**Goal:** Make all bits 1's using minimum k-bit flips.

**Step 1:** Look at position 0 (value = 0). It needs to be flipped to become 1. Since we can only flip subarrays of length `k=2`, we must flip positions 0 and 1 together.

- After flip: `[1,0,0]` (positions 0 and 1 flipped)

**Step 2:** Look at position 1 (value = 0). It needs to be flipped. Flip positions 1 and 2 together.

- After flip: `[1,1,1]` (positions 1 and 2 flipped)

**Total flips:** 2

But wait—could we do better? Let's try a different approach:

**Alternative:** Flip positions 0 and 1 first (same as before): `[1,0,0]`
Now position 1 is 0, but we can't flip just position 1—we must flip positions 1 and 2: `[1,1,1]`

Still 2 flips. Let's check if flipping from position 1 first helps:

- Start: `[0,1,0]`
- Flip positions 1 and 2: `[0,0,1]`
- Now position 0 is 0, flip positions 0 and 1: `[1,1,1]`

Still 2 flips. So minimum is 2.

The key insight: Once we decide to flip at position `i`, we're committed—we must flip the next `k-1` positions too. The challenge is tracking which positions have been flipped an odd vs even number of times without actually modifying the array repeatedly.

## Brute Force Approach

The most straightforward approach is to simulate the process: scan from left to right, and whenever we see a 0, flip the next `k` bits starting at that position.

<div class="code-group">

```python
# Time: O(n*k) | Space: O(1)
def minKBitFlips(nums, k):
    n = len(nums)
    flips = 0

    for i in range(n - k + 1):
        # If current bit is 0, we need to flip
        if nums[i] == 0:
            flips += 1
            # Flip the next k bits
            for j in range(i, i + k):
                nums[j] ^= 1  # XOR with 1 flips the bit

    # Check if all bits are 1
    for i in range(n):
        if nums[i] == 0:
            return -1

    return flips
```

```javascript
// Time: O(n*k) | Space: O(1)
function minKBitFlips(nums, k) {
  const n = nums.length;
  let flips = 0;

  for (let i = 0; i <= n - k; i++) {
    // If current bit is 0, we need to flip
    if (nums[i] === 0) {
      flips++;
      // Flip the next k bits
      for (let j = i; j < i + k; j++) {
        nums[j] ^= 1; // XOR with 1 flips the bit
      }
    }
  }

  // Check if all bits are 1
  for (let i = 0; i < n; i++) {
    if (nums[i] === 0) {
      return -1;
    }
  }

  return flips;
}
```

```java
// Time: O(n*k) | Space: O(1)
public int minKBitFlips(int[] nums, int k) {
    int n = nums.length;
    int flips = 0;

    for (int i = 0; i <= n - k; i++) {
        // If current bit is 0, we need to flip
        if (nums[i] == 0) {
            flips++;
            // Flip the next k bits
            for (int j = i; j < i + k; j++) {
                nums[j] ^= 1;  // XOR with 1 flips the bit
            }
        }
    }

    // Check if all bits are 1
    for (int i = 0; i < n; i++) {
        if (nums[i] == 0) {
            return -1;
        }
    }

    return flips;
}
```

</div>

**Why this is inefficient:** For each position that needs flipping, we flip `k` bits. In the worst case (array of all 0's), we flip at every position up to `n-k+1`, each time flipping `k` bits. This gives us O(n\*k) time complexity, which is too slow for large inputs (n up to 100,000).

## Optimized Approach

The key insight is that we don't need to actually flip all the bits. Instead, we just need to know whether the current bit has been flipped an odd or even number of times.

**Core idea:** Use a sliding window to track flips. When we decide to flip at position `i`, we mark that a flip started at `i` and will affect positions `i` through `i+k-1`. We need to know when that flip's effect ends.

**Two common implementations:**

1. **Queue approach:** Store indices where flips start. When we move past position `i-k`, remove flips that no longer affect current position.
2. **Difference array/prefix sum:** Maintain an array that tracks net flip count at each position using prefix sums.

**Why queue works:**

- We process array left to right
- At position `i`, we need to know if `nums[i]` has been flipped odd or even times
- Flips that started at positions `<= i-k` no longer affect position `i`
- So we maintain a queue of flip start indices, removing those that are too far left
- The queue size tells us how many active flips affect current position

**Decision logic:**

- Current value = `nums[i]`
- If flipped odd times: `nums[i]` is effectively flipped (0→1, 1→0)
- We want all bits to be 1, so effective value should be 1
- If effective value is 0, we need to flip starting at `i`

## Optimal Solution

Here's the queue-based solution that runs in O(n) time with O(k) space:

<div class="code-group">

```python
# Time: O(n) | Space: O(k)
def minKBitFlips(nums, k):
    n = len(nums)
    flips = 0
    # Queue to store starting indices of flips
    flip_queue = deque()

    for i in range(n):
        # Remove flips that no longer affect current position
        # A flip starting at j affects positions j to j+k-1
        # So when i > j+k-1, the flip no longer affects i
        while flip_queue and flip_queue[0] + k <= i:
            flip_queue.popleft()

        # Determine if current bit needs flipping
        # nums[i] is the original value
        # len(flip_queue) % 2 tells us if we've flipped odd times
        # If odd flips, nums[i] is effectively flipped
        current = nums[i] ^ (len(flip_queue) % 2)

        if current == 0:
            # Need to flip starting at i
            # But check if we have enough room
            if i + k > n:
                return -1  # Not enough elements to flip

            flips += 1
            flip_queue.append(i)

    return flips
```

```javascript
// Time: O(n) | Space: O(k)
function minKBitFlips(nums, k) {
  const n = nums.length;
  let flips = 0;
  // Queue to store starting indices of flips
  const flipQueue = [];
  let queueStart = 0; // Track start of queue for efficient removal

  for (let i = 0; i < n; i++) {
    // Remove flips that no longer affect current position
    // A flip starting at j affects positions j to j+k-1
    // So when i > j+k-1, the flip no longer affects i
    while (queueStart < flipQueue.length && flipQueue[queueStart] + k <= i) {
      queueStart++;
    }

    // Determine if current bit needs flipping
    // nums[i] is the original value
    // (flipQueue.length - queueStart) % 2 tells us if we've flipped odd times
    // If odd flips, nums[i] is effectively flipped
    const flipCount = flipQueue.length - queueStart;
    const current = nums[i] ^ (flipCount % 2);

    if (current === 0) {
      // Need to flip starting at i
      // But check if we have enough room
      if (i + k > n) {
        return -1; // Not enough elements to flip
      }

      flips++;
      flipQueue.push(i);
    }
  }

  return flips;
}
```

```java
// Time: O(n) | Space: O(k)
public int minKBitFlips(int[] nums, int k) {
    int n = nums.length;
    int flips = 0;
    // Queue to store starting indices of flips
    Queue<Integer> flipQueue = new LinkedList<>();

    for (int i = 0; i < n; i++) {
        // Remove flips that no longer affect current position
        // A flip starting at j affects positions j to j+k-1
        // So when i > j+k-1, the flip no longer affects i
        while (!flipQueue.isEmpty() && flipQueue.peek() + k <= i) {
            flipQueue.poll();
        }

        // Determine if current bit needs flipping
        // nums[i] is the original value
        // flipQueue.size() % 2 tells us if we've flipped odd times
        // If odd flips, nums[i] is effectively flipped
        int current = nums[i] ^ (flipQueue.size() % 2);

        if (current == 0) {
            // Need to flip starting at i
            // But check if we have enough room
            if (i + k > n) {
                return -1;  // Not enough elements to flip
            }

            flips++;
            flipQueue.offer(i);
        }
    }

    return flips;
}
```

</div>

**Alternative using difference array (more space efficient):**

<div class="code-group">

```python
# Time: O(n) | Space: O(1) extra space
def minKBitFlips(nums, k):
    n = len(nums)
    flips = 0
    current_flips = 0  # Track net flip count at current position
    # Use nums array itself or a separate array to mark flip endpoints
    flip_marker = [0] * n

    for i in range(n):
        # Remove effect of flips that ended before current position
        if i >= k:
            current_flips ^= flip_marker[i - k]

        # Check if current bit needs flipping
        if nums[i] == current_flips:
            # Need to flip starting at i
            if i + k > n:
                return -1

            flips += 1
            current_flips ^= 1  # Flip current position
            if i + k < n:
                flip_marker[i + k] ^= 1  # Mark where this flip ends

    return flips
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each element exactly once
- Each element is added to and removed from the queue at most once
- Queue operations are amortized O(1)

**Space Complexity:** O(k) for queue approach, O(1) for difference array approach

- In worst case, queue holds up to k elements (when flipping every position)
- Difference array uses O(n) space if we allocate new array, but can be optimized to O(1) by reusing input array

## Common Mistakes

1. **Not checking bounds before flipping:** Forgetting to verify `i + k <= n` before flipping at position `i`. This leads to array index out of bounds or incomplete flips at the end.

2. **Actually flipping bits instead of tracking flip counts:** Many candidates try to modify the array directly, which leads to O(n\*k) time. The key insight is tracking whether each position has been flipped odd/even times without actually flipping.

3. **Wrong parity calculation:** Confusing when to flip. Remember: if `nums[i] ^ (flip_count % 2) == 0`, then the effective value is 0 and we need to flip. Some candidates check `nums[i] == 0` without considering previous flips.

4. **Using stack instead of queue:** Flips need to be processed in FIFO order (first in, first out) because we remove them when they no longer affect current position. A stack would remove the wrong flips.

## When You'll See This Pattern

This "flip tracking with sliding window" pattern appears in problems where:

1. Operations affect a contiguous range of elements
2. The order of operations matters
3. You need to minimize operations or determine feasibility

**Related problems:**

1. **Bulb Switcher (Medium):** Similar concept of toggling states, though with different constraints.
2. **Minimum Time to Remove All Cars Containing Illegal Goods (Hard):** Uses similar range operation tracking with dynamic programming.
3. **Number of Distinct Binary Strings After Applying Operations (Medium):** Involves bit manipulation and operation tracking.

The core technique of using a queue or difference array to track range operations is also used in:

- Interval scheduling problems
- Problems with "lazy propagation" in segment trees
- Range update problems in competitive programming

## Key Takeaways

1. **When operations affect ranges, track start and end points:** Instead of applying operations directly, mark where they start and where their effect ends. This transforms O(n\*k) operations into O(n) tracking.

2. **Use XOR for toggle operations:** Flipping bits is equivalent to XOR with 1. More generally, toggle operations often use XOR with a mask.

3. **Left-to-right greedy often works for minimization:** For many array transformation problems, processing left to right and flipping when needed yields the minimum operations. The proof typically involves exchange arguments: any optimal solution can be transformed to match the greedy solution without increasing operations.

4. **Queue tracks active operations:** When operations have fixed length/duration, a queue naturally tracks which operations are still "active" at the current position.

**Related problems:** [Bulb Switcher](/problem/bulb-switcher), [Minimum Time to Remove All Cars Containing Illegal Goods](/problem/minimum-time-to-remove-all-cars-containing-illegal-goods), [Number of Distinct Binary Strings After Applying Operations](/problem/number-of-distinct-binary-strings-after-applying-operations)
