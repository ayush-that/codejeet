---
title: "How to Solve Threshold Majority Queries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Threshold Majority Queries. Hard difficulty, 21.7% acceptance rate. Topics: Array, Hash Table, Binary Search, Divide and Conquer, Counting."
date: "2026-09-04"
category: "dsa-patterns"
tags: ["threshold-majority-queries", "array", "hash-table", "binary-search", "hard"]
---

# How to Solve Threshold Majority Queries

You're given an array `nums` and queries asking: for each subarray `nums[l..r]`, is there an element that appears at least `threshold` times? If yes, return that element; otherwise return -1. The challenge is answering many queries efficiently when a naive count-per-query approach would be too slow. This problem tests your ability to combine frequency counting with clever data structures.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 1, 3, 1, 2, 1]` with queries `[[0, 6, 4], [1, 3, 2], [4, 6, 2]]`.

**Query 1: [0, 6, 4]** (entire array)

- Subarray: `[1, 2, 1, 3, 1, 2, 1]`
- Counts: 1 appears 4 times, 2 appears 2 times, 3 appears 1 time
- Threshold is 4: Only element 1 meets this (4 ≥ 4)
- **Answer: 1**

**Query 2: [1, 3, 2]**

- Subarray: `[2, 1, 3]`
- Counts: 1 appears 1 time, 2 appears 1 time, 3 appears 1 time
- No element appears ≥ 2 times
- **Answer: -1**

**Query 3: [4, 6, 2]**

- Subarray: `[1, 2, 1]`
- Counts: 1 appears 2 times, 2 appears 1 time
- Threshold is 2: Element 1 meets this (2 ≥ 2)
- **Answer: 1**

The naive approach would count frequencies for each query independently, but with `n` up to 10^5 and many queries, this O(n × q) approach is infeasible. We need a smarter way.

## Brute Force Approach

The straightforward solution processes each query independently:

1. For each query `[l, r, threshold]`, create a frequency counter
2. Count occurrences of each element in `nums[l..r]`
3. Check if any element's count ≥ threshold
4. Return that element or -1

<div class="code-group">

```python
# Time: O(q * n) | Space: O(n) for frequency map
def brute_force(nums, queries):
    ans = []
    for l, r, threshold in queries:
        freq = {}
        # Count frequencies in subarray
        for i in range(l, r + 1):
            freq[nums[i]] = freq.get(nums[i], 0) + 1

        # Check for element meeting threshold
        found = -1
        for num, count in freq.items():
            if count >= threshold:
                found = num
                break
        ans.append(found)
    return ans
```

```javascript
// Time: O(q * n) | Space: O(n) for frequency map
function bruteForce(nums, queries) {
  const ans = [];
  for (const [l, r, threshold] of queries) {
    const freq = new Map();
    // Count frequencies in subarray
    for (let i = l; i <= r; i++) {
      freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);
    }

    // Check for element meeting threshold
    let found = -1;
    for (const [num, count] of freq) {
      if (count >= threshold) {
        found = num;
        break;
      }
    }
    ans.push(found);
  }
  return ans;
}
```

```java
// Time: O(q * n) | Space: O(n) for frequency map
public List<Integer> bruteForce(int[] nums, int[][] queries) {
    List<Integer> ans = new ArrayList<>();
    for (int[] query : queries) {
        int l = query[0], r = query[1], threshold = query[2];
        Map<Integer, Integer> freq = new HashMap<>();
        // Count frequencies in subarray
        for (int i = l; i <= r; i++) {
            freq.put(nums[i], freq.getOrDefault(nums[i], 0) + 1);
        }

        // Check for element meeting threshold
        int found = -1;
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            if (entry.getValue() >= threshold) {
                found = entry.getKey();
                break;
            }
        }
        ans.add(found);
    }
    return ans;
}
```

</div>

**Why this fails:** With `n = 10^5` and `q = 10^5`, this becomes O(10^10) operations, which is far too slow. We need to answer queries faster than O(n) each.

## Optimized Approach

The key insight is the **Boyer-Moore Majority Vote algorithm** adaptation. The original algorithm finds an element appearing more than n/2 times in O(n) time with O(1) space. For our problem, we need to check if any element appears ≥ threshold times in a subarray.

**Critical observation:** If an element appears at least `threshold` times in a subarray of length `len = r-l+1`, then:

1. `threshold > len/2`: This is a classic majority element problem
2. `threshold ≤ len/2`: The element might not be a strict majority, but we can still use a similar approach

**Approach:**

1. For each query, use Boyer-Moore to find a **candidate** that _might_ appear ≥ threshold times
2. Verify the candidate by counting its actual occurrences in the subarray
3. If verified, return it; otherwise return -1

**Why this works:** If an element appears ≥ threshold times, it will be selected as the candidate by Boyer-Moore when we process the subarray. The algorithm maintains a candidate and count:

- If count == 0: set new candidate
- If num == candidate: increment count
- If num != candidate: decrement count

After finding a candidate, we must verify it because Boyer-Moore only guarantees that IF a majority exists (> n/2), it will find it. For our threshold condition (which might be ≤ n/2), we need verification.

## Optimal Solution

We process each query using Boyer-Moore to find a candidate, then verify with a frequency count. This gives us O(n + q × √n) time if we use a frequency array, or O(n + q × n) with a hash map. But we can do better with **randomized sampling** or **Mo's algorithm** for truly optimal performance.

Here's the Boyer-Moore + verification approach:

<div class="code-group">

```python
# Time: O(n + q * n) worst case, but much faster average case
# Space: O(1) excluding input/output
def thresholdMajority(nums, queries):
    ans = []

    for l, r, threshold in queries:
        # Step 1: Find candidate using Boyer-Moore
        candidate = None
        count = 0

        for i in range(l, r + 1):
            if count == 0:
                candidate = nums[i]
                count = 1
            elif nums[i] == candidate:
                count += 1
            else:
                count -= 1

        # Step 2: Verify candidate meets threshold
        if candidate is not None:
            freq = 0
            for i in range(l, r + 1):
                if nums[i] == candidate:
                    freq += 1
                    # Early exit if we already meet threshold
                    if freq >= threshold:
                        ans.append(candidate)
                        break
            else:
                # Loop completed without breaking (freq < threshold)
                ans.append(-1)
        else:
            ans.append(-1)

    return ans
```

```javascript
// Time: O(n + q * n) worst case, but much faster average case
// Space: O(1) excluding input/output
function thresholdMajority(nums, queries) {
  const ans = [];

  for (const [l, r, threshold] of queries) {
    // Step 1: Find candidate using Boyer-Moore
    let candidate = null;
    let count = 0;

    for (let i = l; i <= r; i++) {
      if (count === 0) {
        candidate = nums[i];
        count = 1;
      } else if (nums[i] === candidate) {
        count++;
      } else {
        count--;
      }
    }

    // Step 2: Verify candidate meets threshold
    if (candidate !== null) {
      let freq = 0;
      let found = false;
      for (let i = l; i <= r; i++) {
        if (nums[i] === candidate) {
          freq++;
          if (freq >= threshold) {
            ans.push(candidate);
            found = true;
            break;
          }
        }
      }
      if (!found) {
        ans.push(-1);
      }
    } else {
      ans.push(-1);
    }
  }

  return ans;
}
```

```java
// Time: O(n + q * n) worst case, but much faster average case
// Space: O(1) excluding input/output
public List<Integer> thresholdMajority(int[] nums, int[][] queries) {
    List<Integer> ans = new ArrayList<>();

    for (int[] query : queries) {
        int l = query[0], r = query[1], threshold = query[2];

        // Step 1: Find candidate using Boyer-Moore
        Integer candidate = null;
        int count = 0;

        for (int i = l; i <= r; i++) {
            if (count == 0) {
                candidate = nums[i];
                count = 1;
            } else if (nums[i] == candidate) {
                count++;
            } else {
                count--;
            }
        }

        // Step 2: Verify candidate meets threshold
        if (candidate != null) {
            int freq = 0;
            boolean found = false;
            for (int i = l; i <= r; i++) {
                if (nums[i] == candidate) {
                    freq++;
                    if (freq >= threshold) {
                        ans.add(candidate);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                ans.add(-1);
            }
        } else {
            ans.add(-1);
        }
    }

    return ans;
}
```

</div>

**Even more optimized approach:** For production use with large constraints, we'd use **Mo's algorithm** which can answer all queries in O((n+q)√n) by processing queries in a specific order and maintaining a running frequency count.

## Complexity Analysis

**Boyer-Moore + Verification approach:**

- **Time:** O(q × n) worst case, but typically much faster because:
  1. Boyer-Moore candidate finding: O(subarray length) per query
  2. Verification: O(subarray length) per query, but can exit early
- **Space:** O(1) extra space (excluding input/output storage)

**Mo's Algorithm approach (for truly optimal):**

- **Time:** O((n + q)√n) by sorting queries and using two pointers
- **Space:** O(n) for frequency array and query results

The Boyer-Moore approach is often sufficient for interviews because:

1. It demonstrates knowledge of a classic algorithm
2. It's simple to implement and explain
3. For many test cases, it performs well in practice

## Common Mistakes

1. **Forgetting to verify the candidate:** Boyer-Moore only guarantees finding the majority element if it exists with > n/2 frequency. For our threshold condition (which might be ≤ n/2), we must always verify.

2. **Off-by-one errors in subarray indices:** Remember `nums[l..r]` is inclusive, so loops should use `range(l, r+1)` in Python or `i <= r` in Java/JavaScript.

3. **Not handling empty subarrays or edge cases:** What if `l > r`? While constraints typically prevent this, robust code should handle it: `if l > r: return -1`.

4. **Using O(n) space per query:** Creating a new frequency map for each query is wasteful. The Boyer-Moore approach uses O(1) space, which is much better.

5. **Missing early exit in verification:** Once we count enough occurrences to meet threshold, we can return immediately without scanning the entire subarray.

## When You'll See This Pattern

This problem combines frequency counting with subarray queries, a common pattern in coding interviews:

1. **Majority Element II (LeetCode 229):** Find all elements that appear more than ⌊n/3⌋ times. Uses a similar Boyer-Moore extension.

2. **Range Frequency Queries (LeetCode 2080):** Implement a data structure to answer frequency queries in a subarray. Requires preprocessing with hash maps of indices.

3. **Subarray Sum Equals K (LeetCode 560):** While about sums not frequencies, it uses the prefix technique that's also useful for frequency problems.

4. **Online Majority Element In Subarray (LeetCode 1157):** Almost identical problem! Uses Boyer-Moore with verification and randomization.

The core technique—using Boyer-Moore for candidate selection followed by verification—appears whenever you need to find frequent elements in subarrays efficiently.

## Key Takeaways

1. **Boyer-Moore is versatile:** It's not just for strict majority (> n/2) problems. With verification, it can find elements meeting any frequency threshold.

2. **Candidate-verification pattern:** When an algorithm gives you a "candidate" answer that needs checking, this two-phase approach is often optimal. First find a likely answer efficiently, then verify it.

3. **Subarray problems often need preprocessing:** For multiple queries on the same array, consider if you can preprocess data (like storing indices of each value) to answer queries faster than O(n) each.

4. **Trade-offs matter:** The Boyer-Moore approach has O(n) worst case per query but often performs well. For guaranteed performance, Mo's algorithm or segment trees with frequency maps would be better but more complex.

[Practice this problem on CodeJeet](/problem/threshold-majority-queries)
