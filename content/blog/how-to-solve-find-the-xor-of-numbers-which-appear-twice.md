---
title: "How to Solve Find the XOR of Numbers Which Appear Twice — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the XOR of Numbers Which Appear Twice. Easy difficulty, 78.8% acceptance rate. Topics: Array, Hash Table, Bit Manipulation."
date: "2027-12-17"
category: "dsa-patterns"
tags:
  ["find-the-xor-of-numbers-which-appear-twice", "array", "hash-table", "bit-manipulation", "easy"]
---

# How to Solve Find the XOR of Numbers Which Appear Twice

This problem asks us to find the XOR of all numbers that appear exactly twice in an array, where each number appears either once or twice. While it sounds simple, the twist is that we need to identify which numbers appear twice and then compute their XOR—not just find duplicates. The challenge lies in doing this efficiently without extra passes or complex logic. This problem is interesting because it combines duplicate detection with bitwise operations, testing your ability to track state efficiently.

## Visual Walkthrough

Let’s walk through an example: `nums = [1, 2, 3, 2, 3, 4, 3]`

We need to find numbers that appear **exactly twice** and XOR them together.

**Step-by-step tracking:**

- Number 1: Appears once → ignore
- Number 2: Appears twice → include in XOR
- Number 3: Appears three times → ignore (not exactly twice)
- Number 4: Appears once → ignore

So the numbers appearing exactly twice are just `[2]`. The XOR of `[2]` is `2`.

But how do we track this efficiently? We need to know both:

1. If we've seen a number before
2. How many times we've seen it

Let's trace a better approach using a frequency hash map:

```
nums = [1, 2, 3, 2, 3, 4, 3]
freq = {}

Process each number:
1 → freq = {1: 1}           # First time seeing 1
2 → freq = {1: 1, 2: 1}    # First time seeing 2
3 → freq = {1: 1, 2: 1, 3: 1}  # First time seeing 3
2 → freq = {1: 1, 2: 2, 3: 1}  # Second time seeing 2 → XOR with result
3 → freq = {1: 1, 2: 2, 3: 2}  # Second time seeing 3 → XOR with result
4 → freq = {1: 1, 2: 2, 3: 2, 4: 1}  # First time seeing 4
3 → freq = {1: 1, 2: 2, 3: 3, 4: 1}  # Third time seeing 3 → remove from XOR

Result after each step:
Start: result = 0
After 2 (second time): result = 0 XOR 2 = 2
After 3 (second time): result = 2 XOR 3 = 1
After 3 (third time): We need to remove 3 from XOR since it no longer appears exactly twice
```

This shows we need to track not just frequency but also whether a number currently qualifies for the XOR result.

## Brute Force Approach

A naive approach would be:

1. Count frequencies of all numbers
2. Filter numbers with frequency exactly 2
3. XOR those numbers together

This works but requires two passes and extra space. Let's analyze why it's suboptimal:

**What makes it inefficient:**

- We store all frequencies even for numbers that appear once
- We need a second pass to compute the XOR
- While acceptable for this problem (it's Easy), we can do better with a single pass

Here's what the brute force looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def bruteForce(nums):
    # Step 1: Count frequencies
    freq = {}
    for num in nums:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: XOR numbers with frequency exactly 2
    result = 0
    for num, count in freq.items():
        if count == 2:
            result ^= num

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function bruteForce(nums) {
  // Step 1: Count frequencies
  const freq = new Map();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: XOR numbers with frequency exactly 2
  let result = 0;
  for (const [num, count] of freq) {
    if (count === 2) {
      result ^= num;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int bruteForce(int[] nums) {
    // Step 1: Count frequencies
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // Step 2: XOR numbers with frequency exactly 2
    int result = 0;
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        if (entry.getValue() == 2) {
            result ^= entry.getKey();
        }
    }

    return result;
}
```

</div>

This solution is actually acceptable for the problem constraints, but interviewers often want to see if you can optimize further or handle it in one pass.

## Optimal Solution

We can solve this in one pass using two sets:

1. `seen_once`: Numbers we've seen exactly once so far
2. `seen_twice`: Numbers we've seen exactly twice so far (and should be included in XOR)

The logic:

- When we see a number for the first time: add to `seen_once`
- When we see it again (second time): remove from `seen_once`, add to `seen_twice`, XOR with result
- When we see it a third time: remove from `seen_twice`, XOR with result again (which cancels it out)

This works because XOR is its own inverse: `a XOR a = 0`.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findDuplicatesXOR(nums):
    """
    Returns XOR of all numbers appearing exactly twice.

    Approach: Track numbers seen once and twice separately.
    When a number moves from once to twice, XOR it.
    When it moves from twice to thrice, XOR it again (removing it).
    """
    seen_once = set()   # Numbers seen exactly once so far
    seen_twice = set()  # Numbers seen exactly twice so far
    result = 0          # XOR of numbers currently seen exactly twice

    for num in nums:
        if num in seen_once:
            # Second occurrence: move from once to twice
            seen_once.remove(num)
            seen_twice.add(num)
            result ^= num  # Include in XOR
        elif num in seen_twice:
            # Third occurrence: move from twice to thrice (or more)
            seen_twice.remove(num)
            result ^= num  # Remove from XOR (a XOR a = 0)
        else:
            # First occurrence
            seen_once.add(num)

    return result
```

```javascript
// Time: O(n) | Space: O(n)
function findDuplicatesXOR(nums) {
  /**
   * Returns XOR of all numbers appearing exactly twice.
   *
   * Approach: Track numbers seen once and twice separately.
   * When a number moves from once to twice, XOR it.
   * When it moves from twice to thrice, XOR it again (removing it).
   */
  const seenOnce = new Set(); // Numbers seen exactly once so far
  const seenTwice = new Set(); // Numbers seen exactly twice so far
  let result = 0; // XOR of numbers currently seen exactly twice

  for (const num of nums) {
    if (seenOnce.has(num)) {
      // Second occurrence: move from once to twice
      seenOnce.delete(num);
      seenTwice.add(num);
      result ^= num; // Include in XOR
    } else if (seenTwice.has(num)) {
      // Third occurrence: move from twice to thrice (or more)
      seenTwice.delete(num);
      result ^= num; // Remove from XOR (a XOR a = 0)
    } else {
      // First occurrence
      seenOnce.add(num);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n)
public int findDuplicatesXOR(int[] nums) {
    /**
     * Returns XOR of all numbers appearing exactly twice.
     *
     * Approach: Track numbers seen once and twice separately.
     * When a number moves from once to twice, XOR it.
     * When it moves from twice to thrice, XOR it again (removing it).
     */
    Set<Integer> seenOnce = new HashSet<>();   // Numbers seen exactly once so far
    Set<Integer> seenTwice = new HashSet<>();  // Numbers seen exactly twice so far
    int result = 0;                            // XOR of numbers currently seen exactly twice

    for (int num : nums) {
        if (seenOnce.contains(num)) {
            // Second occurrence: move from once to twice
            seenOnce.remove(num);
            seenTwice.add(num);
            result ^= num;  // Include in XOR
        } else if (seenTwice.contains(num)) {
            // Third occurrence: move from twice to thrice (or more)
            seenTwice.remove(num);
            result ^= num;  // Remove from XOR (a XOR a = 0)
        } else {
            // First occurrence
            seenOnce.add(num);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing O(1) operations (set lookups/adds/removes) for each element.

**Space Complexity:** O(n)

- In the worst case, all numbers are distinct, so `seen_once` stores all n elements.
- `seen_twice` stores at most n/2 elements (if half appear twice).
- Overall O(n) space.

**Why this is optimal:**

- We must examine each element at least once → Ω(n) time
- We need to track which numbers we've seen → Ω(n) space in worst case
- Our solution achieves both lower bounds

## Common Mistakes

1. **Forgetting that numbers can appear more than twice**: Some candidates assume "appears either once or twice" means no number appears more than twice. But the problem statement says each number appears "either once or twice" in the array—this is a guarantee, not just a possibility. However, it's good practice to write code that handles more appearances gracefully.

2. **Incorrect XOR logic when numbers appear thrice**: If you simply XOR every time you see a duplicate (without tracking state), a number appearing three times would be included in the result when it shouldn't be. Example: `[1, 1, 1]` should return 0, not 1.

3. **Using arrays instead of sets for large numbers**: If numbers can be large (up to 10^9), you can't use array indexing. Always use hash-based structures (sets/maps).

4. **Not initializing result to 0**: XOR with 0 is identity (a XOR 0 = a), so starting with 0 is correct. Starting with any other value would give wrong results.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Frequency tracking with state machines**: The "seen_once/seen_twice" approach is a state machine tracking how many times we've seen each element. This pattern appears in:
   - **Single Number II**: Find the number that appears once when others appear three times
   - **First Unique Character in a String**: Track characters seen once vs. multiple times

2. **XOR for duplicate detection**: XOR's property that `a XOR a = 0` makes it perfect for canceling out pairs. This appears in:
   - **Single Number**: Find the number that appears once when others appear twice
   - **Find the Difference**: Find the extra character added to a string

## Key Takeaways

1. **XOR is reversible for pairs**: When tracking duplicates, XOR lets you add and remove numbers from a running total easily because `a XOR a XOR b = b`.

2. **State machines simplify frequency tracking**: Instead of storing exact counts, sometimes you only need to track whether you've seen an element 0, 1, or 2+ times. This reduces the information you need to store.

3. **Read problem constraints carefully**: The guarantee that numbers appear at most twice simplifies the problem. In interviews, always check if constraints allow optimizations.

Related problems: [Single Number](/problem/single-number), [Single Number II](/problem/single-number-ii), [Single Number III](/problem/single-number-iii)
