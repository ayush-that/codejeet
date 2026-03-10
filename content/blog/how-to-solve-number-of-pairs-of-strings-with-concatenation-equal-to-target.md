---
title: "How to Solve Number of Pairs of Strings With Concatenation Equal to Target — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Pairs of Strings With Concatenation Equal to Target. Medium difficulty, 75.4% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2028-04-09"
category: "dsa-patterns"
tags:
  [
    "number-of-pairs-of-strings-with-concatenation-equal-to-target",
    "array",
    "hash-table",
    "string",
    "medium",
  ]
---

# How to Solve Number of Pairs of Strings With Concatenation Equal to Target

This problem asks us to count pairs of strings from an array whose concatenation equals a target string. While it sounds straightforward, the challenge lies in efficiently checking all possible concatenations without the O(n²) brute force cost. The interesting twist is that strings are made of digits, but the solution treats them as regular strings—the digit constraint doesn't change the algorithm.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `nums = ["777", "7", "77", "77"]`
- `target = "7777"`

We need to find all index pairs `(i, j)` where `i != j` and `nums[i] + nums[j] = target`.

Let's think step by step:

1. For `nums[0] = "777"`:
   - What string would we need to complete the target? `target = "7777"`, so we need `"7777" - "777" = "7"`.
   - Are there any `"7"` strings in the array? Yes, at index 1. So `(0, 1)` is a valid pair.
   - Also check: `"777" + ""` would be `"777"`, not our target, so we only consider strings that actually exist.

2. For `nums[1] = "7"`:
   - We need `"7777" - "7" = "777"`.
   - `"777"` exists at index 0, so `(1, 0)` is valid.
   - But wait—is `(1, 0)` different from `(0, 1)`? Yes, since order matters in pairs.

3. For `nums[2] = "77"`:
   - We need `"7777" - "77" = "77"`.
   - `"77"` exists at index 3, so `(2, 3)` is valid.

4. For `nums[3] = "77"`:
   - We need `"7777" - "77" = "77"`.
   - `"77"` exists at index 2, so `(3, 2)` is valid.

Total valid pairs: `(0, 1)`, `(1, 0)`, `(2, 3)`, `(3, 2)` → 4 pairs.

The key insight: For each string `nums[i]`, we can compute what the other string must be (`target - nums[i]`), then check if that required string exists in our array.

## Brute Force Approach

The most straightforward solution checks every possible pair:

1. Initialize a counter to 0
2. For each index `i` from 0 to n-1:
   - For each index `j` from 0 to n-1:
     - If `i != j` and `nums[i] + nums[j] == target`:
       - Increment counter

This approach is simple but inefficient. For an array of size `n`, we check `n × n = n²` pairs. Each string concatenation and comparison could take up to `O(m)` time where `m` is the length of `target`, giving us `O(n² × m)` time complexity.

<div class="code-group">

```python
# Time: O(n² × m) | Space: O(1)
def numOfPairs_brute(nums, target):
    count = 0
    n = len(nums)

    for i in range(n):
        for j in range(n):
            if i != j and nums[i] + nums[j] == target:
                count += 1

    return count
```

```javascript
// Time: O(n² × m) | Space: O(1)
function numOfPairsBrute(nums, target) {
  let count = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && nums[i] + nums[j] === target) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n² × m) | Space: O(1)
public int numOfPairsBrute(String[] nums, String target) {
    int count = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i != j && (nums[i] + nums[j]).equals(target)) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

The brute force fails because with `n` up to 100 (as in typical LeetCode constraints), `n² = 10,000` operations might be acceptable, but in real interviews we should aim for better. Also, if strings are long, the concatenation cost adds up.

## Optimized Approach

The key insight is recognizing this as a variation of the **Two Sum** pattern. Instead of looking for `target - nums[i]` like in Two Sum, we're looking for `target - nums[i]` in a string concatenation sense.

Here's the step-by-step reasoning:

1. **What do we need?** For each string `nums[i]`, we need to find if there exists some `nums[j]` such that `nums[i] + nums[j] = target`.

2. **How to check efficiently?** We can pre-process the array into a frequency map (hash table) that counts how many times each string appears. This lets us check in O(1) time whether a required string exists.

3. **But there's a catch:** We need to be careful about counting pairs where `nums[i] == nums[j]`. If we have duplicate strings, we can't pair an element with itself even if it appears multiple times. We need to handle the case where the required string is the same as the current string.

4. **The algorithm:**
   - Build a frequency map of all strings
   - For each string `s` in the array:
     - Check if `target` starts with `s` (since `s` would be the first part of the concatenation)
     - If yes, compute the required second part: `required = target[len(s):]`
     - Look up `required` in our frequency map
     - If found, add the count of `required` to our total
     - But if `s == required`, we need to subtract 1 because we can't pair a string with itself

5. **Why this works:** We're essentially checking each string as a potential prefix of the target. If a string can be a prefix, we check if the corresponding suffix exists in our array.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n × m) | Space: O(n)
# n = number of strings, m = length of target
def numOfPairs(nums, target):
    """
    Counts pairs of strings whose concatenation equals target.

    Approach:
    1. Build frequency map of all strings
    2. For each string, check if it can be a prefix of target
    3. If yes, compute required suffix and check if it exists
    4. Handle special case where prefix == suffix (can't use same element)
    """
    from collections import Counter

    # Step 1: Count frequency of each string
    # This allows O(1) lookup for required suffixes
    freq = Counter(nums)

    count = 0

    # Step 2: Check each string as potential prefix
    for s in nums:
        # Step 3: Check if s can be a prefix of target
        # We use startswith() which is O(m) in worst case
        if target.startswith(s):
            # Step 4: Compute the required suffix
            # If s is prefix, target = s + required
            required = target[len(s):]

            # Step 5: Check if required suffix exists in our array
            if required in freq:
                # Step 6: Add count of required strings
                count += freq[required]

                # Step 7: Handle special case where s == required
                # We can't pair a string with itself, so subtract 1
                if s == required:
                    count -= 1

    # Each valid pair is counted twice (once from each direction)
    # So we return half of the count
    return count // 2
```

```javascript
// Time: O(n × m) | Space: O(n)
// n = number of strings, m = length of target
function numOfPairs(nums, target) {
  /**
   * Counts pairs of strings whose concatenation equals target.
   *
   * Approach:
   * 1. Build frequency map of all strings
   * 2. For each string, check if it can be a prefix of target
   * 3. If yes, compute required suffix and check if it exists
   * 4. Handle special case where prefix == suffix
   */

  // Step 1: Build frequency map
  const freq = new Map();
  for (const s of nums) {
    freq.set(s, (freq.get(s) || 0) + 1);
  }

  let count = 0;

  // Step 2: Check each string as potential prefix
  for (const s of nums) {
    // Step 3: Check if s is a prefix of target
    if (target.startsWith(s)) {
      // Step 4: Compute required suffix
      const required = target.slice(s.length);

      // Step 5: Check if required suffix exists
      if (freq.has(required)) {
        // Step 6: Add count of required strings
        count += freq.get(required);

        // Step 7: Handle special case where s == required
        // We can't pair a string with itself
        if (s === required) {
          count--;
        }
      }
    }
  }

  // Each valid pair is counted twice (once from each direction)
  // So we return half of the count
  return count / 2;
}
```

```java
// Time: O(n × m) | Space: O(n)
// n = number of strings, m = length of target
public int numOfPairs(String[] nums, String target) {
    /**
     * Counts pairs of strings whose concatenation equals target.
     *
     * Approach:
     * 1. Build frequency map of all strings
     * 2. For each string, check if it can be a prefix of target
     * 3. If yes, compute required suffix and check if it exists
     * 4. Handle special case where prefix == suffix
     */

    // Step 1: Build frequency map
    Map<String, Integer> freq = new HashMap<>();
    for (String s : nums) {
        freq.put(s, freq.getOrDefault(s, 0) + 1);
    }

    int count = 0;

    // Step 2: Check each string as potential prefix
    for (String s : nums) {
        // Step 3: Check if s is a prefix of target
        if (target.startsWith(s)) {
            // Step 4: Compute required suffix
            String required = target.substring(s.length());

            // Step 5: Check if required suffix exists
            if (freq.containsKey(required)) {
                // Step 6: Add count of required strings
                count += freq.get(required);

                // Step 7: Handle special case where s == required
                // We can't pair a string with itself
                if (s.equals(required)) {
                    count--;
                }
            }
        }
    }

    // Each valid pair is counted twice (once from each direction)
    // So we return half of the count
    return count / 2;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- Building the frequency map: O(n) where n is the number of strings
- For each of the n strings, we check if it's a prefix of target using `startsWith()` or equivalent, which takes O(m) time where m is the length of target
- Total: O(n + n × m) = O(n × m)

**Space Complexity: O(n)**

- We store a frequency map with at most n entries
- Each entry stores a string and an integer count

The O(n × m) time is much better than the brute force O(n² × m) when n is large.

## Common Mistakes

1. **Forgetting to handle the case where prefix == suffix**: When a string can be both the prefix and suffix (e.g., `"7"` with target `"77"`), you might accidentally count pairing an element with itself. Always check if `s == required` and subtract the frequency of the current element.

2. **Not dividing by 2 at the end**: Since we count each pair twice (once when `s` is the prefix and once when it's the suffix), we need to return `count // 2`. A common alternative is to only count pairs where `i < j` in the brute force, but in the optimized solution, dividing by 2 is cleaner.

3. **Using the wrong string comparison method**: In Java, always use `.equals()` for string comparison, not `==`. In Python, `==` works fine for strings. In JavaScript, use `===` for strict equality.

4. **Assuming strings are digits means they're numbers**: The problem says strings are "digit strings" but this doesn't mean we should convert to integers. Concatenation `"2" + "3" = "23"` not `5`. Treat them as regular strings.

## When You'll See This Pattern

This problem uses the **frequency map + prefix/suffix checking** pattern, which appears in several other problems:

1. **Two Sum (Easy)**: The classic hash map problem where you look for `target - nums[i]`. This problem is essentially Two Sum but with string concatenation instead of addition.

2. **Count Pairs Whose Sum is Less than Target (Easy)**: Similar counting problem but with numerical sums and typically solved with two pointers after sorting.

3. **Palindrome Pairs (Hard)**: A more complex version where you need to find all pairs that form palindromes when concatenated. It also uses prefix/suffix checking with a hash map.

The core pattern is: when you need to find pairs satisfying some condition, consider using a hash map to store what you've seen so you can quickly check if the complement exists.

## Key Takeaways

1. **Hash maps are your friend for pair-finding problems**: When you need to find pairs that satisfy some condition, a frequency map often provides the O(1) lookups needed for an efficient solution.

2. **Think in terms of complements**: Just like Two Sum looks for `target - num`, this problem looks for `target - string` (in the concatenation sense). Always ask: "What would need to exist to complete the pair?"

3. **Handle edge cases with equal elements**: When an element could pair with itself (same value at different index), you need special logic to ensure you're not counting invalid pairs.

Related problems: [Two Sum](/problem/two-sum)
