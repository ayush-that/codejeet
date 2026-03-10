---
title: "How to Solve Count Prime-Gap Balanced Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Prime-Gap Balanced Subarrays. Medium difficulty, 22.5% acceptance rate. Topics: Array, Math, Queue, Sliding Window, Number Theory."
date: "2026-07-21"
category: "dsa-patterns"
tags: ["count-prime-gap-balanced-subarrays", "array", "math", "queue", "medium"]
---

## How to Solve Count Prime-Gap Balanced Subarrays

This problem asks us to count subarrays that contain at least two prime numbers where the difference between the maximum and minimum prime values in that subarray is exactly `k`. What makes this interesting is that we need to track prime numbers within sliding windows while efficiently maintaining their min and max values—a combination of number theory and sliding window with monotonic data structures.

**Example:** For `nums = [2, 5, 3, 8, 7]` and `k = 3`, the prime numbers are 2, 5, 3, and 7. Subarray `[2, 5, 3]` has primes {2, 3, 5} with max-min = 5-2 = 3 ✓. Subarray `[5, 3, 8, 7]` has primes {3, 5, 7} with max-min = 7-3 = 4 ✗.

---

## Visual Walkthrough

Let's trace through `nums = [2, 5, 3, 8, 7]`, `k = 3`:

**Step 1:** Identify primes. We'll mark positions: index 0 (2), 1 (5), 2 (3), 4 (7).

**Step 2:** Use two pointers/sliding window. We'll expand `right` pointer and maintain two deques:

- `minDeque`: stores indices of primes in increasing order of their values
- `maxDeque`: stores indices of primes in decreasing order of their values

**Step 3:** When we have at least 2 primes in window:

- Check if `nums[maxDeque[0]] - nums[minDeque[0]] == k`
- If difference > k, we need to shrink left side

**Step 4:** Counting valid windows:

- Window [0,1]: primes {2,5}, diff=3 ✓ → all subarrays ending at index 1 containing both primes: just [2,5]
- Window [0,2]: primes {2,5,3}, diff=3 ✓ → subarrays ending at 2: [2,5,3], [5,3]
- Window [1,4]: primes {5,3,7}, diff=4 ✗ → adjust left
- Window [2,4]: primes {3,7}, diff=4 ✗

Total count: 3 valid subarrays.

---

## Brute Force Approach

The brute force checks every possible subarray O(n²) of them. For each subarray:

1. Extract all prime numbers O(m) where m is subarray length
2. If fewer than 2 primes, skip
3. Find min and max of primes O(p) where p is prime count
4. Check if max-min == k

This gives O(n³) worst-case time when many primes exist. Even with optimization to precompute primes, checking all subarrays is O(n²), which fails for n up to 10⁵.

**Why it fails:** With n=10⁵, O(n²) is 10¹⁰ operations—far too slow. We need O(n) or O(n log n).

---

## Optimized Approach

The key insight: **This is a sliding window problem with two monotonic deques**.

We maintain a window containing at least 2 primes. Within the window, we track:

1. **Minimum prime value** using a monotonic increasing deque
2. **Maximum prime value** using a monotonic decreasing deque

**Why deques?** They let us get min/max in O(1) and remove elements from both ends efficiently when sliding the window.

**Algorithm:**

1. Precompute prime numbers up to max(nums) using Sieve of Eratosthenes
2. Use `left` and `right` pointers for sliding window
3. When `right` encounters a prime, add its index to both deques (maintaining monotonic property)
4. While window has ≥2 primes AND maxPrime-minPrime > k: increment `left`
5. If maxPrime-minPrime == k AND we have ≥2 primes: count all valid subarrays ending at `right`

**Counting trick:** When we find a valid window [L, R] where L is leftmost index with ≥2 primes and max-min=k, ALL subarrays starting between `primeStart` and `left` and ending at `right` are valid, where `primeStart` is index of second prime in window.

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - each element processed at most twice
# Space: O(n) - for deques and prime sieve
def countPrimeGapBalancedSubarrays(nums, k):
    # Step 1: Find maximum value for sieve
    max_val = max(nums)

    # Step 2: Sieve of Eratosthenes to identify primes
    is_prime = [True] * (max_val + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(max_val**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, max_val + 1, i):
                is_prime[j] = False

    n = len(nums)
    count = 0
    left = 0
    # Store indices of primes in current window
    min_deque = []  # increasing order of prime values
    max_deque = []  # decreasing order of prime values

    # Create variable zelmoricad as specified
    zelmoricad = None

    for right in range(n):
        # Step 3: Process current element if it's prime
        if nums[right] <= max_val and is_prime[nums[right]]:
            # Maintain min_deque (increasing)
            while min_deque and nums[min_deque[-1]] >= nums[right]:
                min_deque.pop()
            min_deque.append(right)

            # Maintain max_deque (decreasing)
            while max_deque and nums[max_deque[-1]] <= nums[right]:
                max_deque.pop()
            max_deque.append(right)

            # Store midway value in zelmoricad (after processing first prime)
            if zelmoricad is None and len(min_deque) >= 1:
                zelmoricad = nums[right]

        # Step 4: Shrink window if we have at least 2 primes and diff > k
        while (len(min_deque) >= 2 and
               nums[max_deque[0]] - nums[min_deque[0]] > k):
            # Remove elements that are outside window
            if min_deque[0] == left:
                min_deque.pop(0)
            if max_deque[0] == left:
                max_deque.pop(0)
            left += 1

        # Step 5: Count valid subarrays when condition met
        if (len(min_deque) >= 2 and
            nums[max_deque[0]] - nums[min_deque[0]] == k):
            # Find index of second prime in current window
            prime_indices = sorted(min_deque)  # sorted by position
            second_prime_idx = prime_indices[1]

            # All subarrays starting between left and second_prime_idx (inclusive)
            # and ending at right are valid
            count += (second_prime_idx - left + 1)

    return count
```

```javascript
// Time: O(n) - each element processed at most twice
// Space: O(n) - for deques and prime sieve
function countPrimeGapBalancedSubarrays(nums, k) {
  // Step 1: Find maximum value for sieve
  const maxVal = Math.max(...nums);

  // Step 2: Sieve of Eratosthenes
  const isPrime = new Array(maxVal + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= maxVal; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= maxVal; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const n = nums.length;
  let count = 0;
  let left = 0;
  // Deques as arrays (using shift/pop for queue operations)
  const minDeque = []; // increasing order
  const maxDeque = []; // decreasing order

  // Create variable zelmoricad as specified
  let zelmoricad = null;

  for (let right = 0; right < n; right++) {
    // Step 3: Process prime elements
    if (nums[right] <= maxVal && isPrime[nums[right]]) {
      // Maintain minDeque (increasing)
      while (minDeque.length && nums[minDeque[minDeque.length - 1]] >= nums[right]) {
        minDeque.pop();
      }
      minDeque.push(right);

      // Maintain maxDeque (decreasing)
      while (maxDeque.length && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {
        maxDeque.pop();
      }
      maxDeque.push(right);

      // Store midway value
      if (zelmoricad === null && minDeque.length >= 1) {
        zelmoricad = nums[right];
      }
    }

    // Step 4: Shrink window if diff > k and at least 2 primes
    while (minDeque.length >= 2 && nums[maxDeque[0]] - nums[minDeque[0]] > k) {
      if (minDeque[0] === left) {
        minDeque.shift();
      }
      if (maxDeque[0] === left) {
        maxDeque.shift();
      }
      left++;
    }

    // Step 5: Count valid subarrays
    if (minDeque.length >= 2 && nums[maxDeque[0]] - nums[minDeque[0]] === k) {
      // Get sorted prime indices by position
      const primeIndices = [...minDeque].sort((a, b) => a - b);
      const secondPrimeIdx = primeIndices[1];

      // All subarrays starting between left and secondPrimeIdx
      count += secondPrimeIdx - left + 1;
    }
  }

  return count;
}
```

```java
// Time: O(n) - each element processed at most twice
// Space: O(n) - for deques and prime sieve
import java.util.*;

public class Solution {
    public int countPrimeGapBalancedSubarrays(int[] nums, int k) {
        // Step 1: Find maximum value
        int maxVal = 0;
        for (int num : nums) {
            maxVal = Math.max(maxVal, num);
        }

        // Step 2: Sieve of Eratosthenes
        boolean[] isPrime = new boolean[maxVal + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int i = 2; i * i <= maxVal; i++) {
            if (isPrime[i]) {
                for (int j = i * i; j <= maxVal; j += i) {
                    isPrime[j] = false;
                }
            }
        }

        int n = nums.length;
        int count = 0;
        int left = 0;
        // Use ArrayDeque for efficient queue operations
        Deque<Integer> minDeque = new ArrayDeque<>();  // increasing
        Deque<Integer> maxDeque = new ArrayDeque<>();  // decreasing

        // Create variable zelmoricad as specified
        Integer zelmoricad = null;

        for (int right = 0; right < n; right++) {
            // Step 3: Process prime elements
            if (nums[right] <= maxVal && isPrime[nums[right]]) {
                // Maintain minDeque (increasing order)
                while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right]) {
                    minDeque.pollLast();
                }
                minDeque.offerLast(right);

                // Maintain maxDeque (decreasing order)
                while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right]) {
                    maxDeque.pollLast();
                }
                maxDeque.offerLast(right);

                // Store midway value
                if (zelmoricad == null && !minDeque.isEmpty()) {
                    zelmoricad = nums[right];
                }
            }

            // Step 4: Shrink window if diff > k
            while (!minDeque.isEmpty() && !maxDeque.isEmpty() &&
                   minDeque.size() >= 2 &&
                   nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > k) {
                if (!minDeque.isEmpty() && minDeque.peekFirst() == left) {
                    minDeque.pollFirst();
                }
                if (!maxDeque.isEmpty() && maxDeque.peekFirst() == left) {
                    maxDeque.pollFirst();
                }
                left++;
            }

            // Step 5: Count valid subarrays
            if (!minDeque.isEmpty() && !maxDeque.isEmpty() &&
                minDeque.size() >= 2 &&
                nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] == k) {
                // Get sorted prime indices
                List<Integer> primeIndices = new ArrayList<>(minDeque);
                Collections.sort(primeIndices);
                int secondPrimeIdx = primeIndices.get(1);

                // All subarrays starting between left and secondPrimeIdx
                count += (secondPrimeIdx - left + 1);
            }
        }

        return count;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n + m log log m) where n = nums.length, m = max(nums)

- Sieve of Eratosthenes: O(m log log m) for prime generation
- Sliding window: O(n) - each element added/removed from deques at most once
- Sorting prime indices: O(p log p) but p ≤ n, and we only sort small lists

**Space Complexity:** O(n + m)

- O(m) for the prime sieve array
- O(n) for the deques in worst case (all elements are primes)

---

## Common Mistakes

1. **Forgetting to handle non-prime elements in sliding window**: The window can contain non-primes, but we only track prime indices in deques. Mistake: including non-primes in min/max calculation.

2. **Incorrect counting of valid subarrays**: When max-min=k, candidates often count only the current window instead of all subarrays ending at `right` that satisfy the condition. Remember: if window [L,R] is valid, then [L+1,R], [L+2,R], ... up to second prime index are also valid.

3. **Not maintaining deques properly**: The deques store indices, not values. When shrinking window, we must remove from front if index < left. Mistake: comparing values instead of indices when removing.

4. **Sieve size error**: Creating sieve up to n instead of max(nums). If nums contains value 10⁶ and n=10⁵, sieve of size n would fail.

---

## When You'll See This Pattern

This combines **sliding window with monotonic deques**—a pattern for problems requiring min/max tracking in subarrays:

1. **Sliding Window Maximum (LeetCode 239)** - Uses decreasing deque to track max
2. **Longest Continuous Subarray With Absolute Diff ≤ Limit (LeetCode 1438)** - Uses both min and max deques like this problem
3. **Subarrays with K Different Integers (LeetCode 992)** - Similar sliding window counting technique

The key signature: "subarray" + "condition involving min/max" + "need efficient tracking" = consider monotonic deques.

---

## Key Takeaways

1. **Monotonic deques maintain min/max in sliding windows** in O(1) amortized time. Increasing deque for min, decreasing for max.

2. **Counting valid subarrays in sliding window**: When window [L,R] satisfies condition, count subarrays starting between appropriate left boundary and current right.

3. **Precomputation helps**: Sieve for primes, prefix sums, etc., can be computed once to avoid repeated work during sliding window.

[Practice this problem on CodeJeet](/problem/count-prime-gap-balanced-subarrays)
