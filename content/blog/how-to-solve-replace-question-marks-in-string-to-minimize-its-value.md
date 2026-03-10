---
title: "How to Solve Replace Question Marks in String to Minimize Its Value — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Replace Question Marks in String to Minimize Its Value. Medium difficulty, 29.0% acceptance rate. Topics: Hash Table, String, Greedy, Sorting, Heap (Priority Queue)."
date: "2030-01-06"
category: "dsa-patterns"
tags:
  [
    "replace-question-marks-in-string-to-minimize-its-value",
    "hash-table",
    "string",
    "greedy",
    "medium",
  ]
---

# How to Solve "Replace Question Marks in String to Minimize Its Value"

This problem asks us to replace all `'?'` characters in a string with lowercase English letters to minimize the total "cost" of the resulting string. The cost is defined as the sum of `cost(i)` for all indices, where `cost(i)` counts how many times the character at position `i` has appeared before it in the string. What makes this problem interesting is that we need to balance two competing goals: minimizing immediate cost while also considering how our choices affect future positions. It's essentially an optimization problem with a greedy flavor.

## Visual Walkthrough

Let's trace through a small example: `s = "a?b?c"`

**Step 1: Understand the cost calculation**
For a string `t`, `cost(i)` counts occurrences of `t[i]` in positions `0` to `i-1`. So:

- Position 0 always has cost 0 (no characters before it)
- Position 1's cost = count of `t[1]` in positions 0-0
- Position 2's cost = count of `t[2]` in positions 0-1
- And so on...

**Step 2: Count fixed characters**
First, let's count the existing (non-'?') characters:

- 'a': appears at position 0
- 'b': appears at position 2
- 'c': appears at position 4

**Step 3: Strategy for '?' positions**
We have '?' at positions 1 and 3. To minimize total cost, we should assign letters that:

1. Have appeared the fewest times so far (to minimize immediate cost)
2. If multiple letters have the same minimum count, choose the smallest lexicographically

**Step 4: Process position 1**
Current counts: a=1, b=0, c=0 (and all other letters = 0)
Minimum count = 0 (b, c, and all other letters except 'a')
Choose smallest lexicographically among those with count 0 → 'a'? Wait, 'a' has count 1, not 0.
Actually, 'b' is the smallest with count 0.
So position 1 becomes 'b', counts become: a=1, b=1, c=0

**Step 5: Process position 3**
Current counts: a=1, b=1, c=0
Minimum count = 0 (c and all other letters except a,b)
Smallest with count 0 → 'a'? No, 'a' has count 1. 'c' has count 0.
So position 3 becomes 'c', counts become: a=1, b=1, c=1

**Step 6: Calculate final cost**
Result: `t = "abbcc"`

- Position 0 ('a'): cost = 0
- Position 1 ('b'): cost = count of 'b' before pos1 = 0
- Position 2 ('b'): cost = count of 'b' before pos2 = 1
- Position 3 ('c'): cost = count of 'c' before pos3 = 0
- Position 4 ('c'): cost = count of 'c' before pos4 = 1
  Total cost = 0 + 0 + 1 + 0 + 1 = 2

## Brute Force Approach

A naive approach would try all possible letter assignments for each '?'. Since there are 26 possible letters for each '?' and up to 10⁵ '?' characters in the worst case, this gives 26^(10⁵) possibilities — astronomically large and completely infeasible.

Even a smarter brute force that tries to minimize cost at each position independently would fail because it doesn't consider the global optimization. For example, always choosing the letter with minimum current count might seem good locally, but we need to prove it's optimal globally.

The key insight is that this problem has a **greedy optimal structure**: at each '?' position, choosing the letter with the smallest current count (and smallest lexicographically if tied) yields the globally minimal total cost. This works because:

1. The cost function only cares about previous occurrences
2. Adding a character increases its count for all future positions
3. By always picking the least frequent character, we distribute counts evenly

## Optimized Approach

The optimal solution follows these steps:

1. **Count existing characters**: First pass through the string to count how many times each letter (a-z) appears in the fixed positions (non-'?').

2. **Process '?' positions**: For each '?' in the string:
   - Find the letter with the smallest current count
   - If multiple letters have the same minimum count, choose the smallest lexicographically
   - Replace the '?' with that letter
   - Increment that letter's count

3. **Calculate total cost**: Make a second pass through the final string to compute the total cost according to the problem definition.

The critical optimization is that we need to efficiently find the minimum count letter at each step. We could:

- Scan all 26 letters each time (O(26n) which is O(n) and acceptable)
- Use a min-heap to get O(log 26) = O(1) operations, though with constant factors

Since 26 is a constant, the O(26n) approach is simpler and efficient enough.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n = len(s) - we make two passes through the string
# Space: O(1) - we store counts for 26 letters (constant space)
def minimizeStringValue(s: str) -> str:
    # Convert string to list for mutable operations
    chars = list(s)
    n = len(chars)

    # Step 1: Count occurrences of each letter in the original string
    # We'll use this to track frequencies as we replace '?'
    counts = [0] * 26

    # First pass: count fixed characters (non-'?')
    for i in range(n):
        if chars[i] != '?':
            idx = ord(chars[i]) - ord('a')
            counts[idx] += 1

    # Step 2: Replace each '?' with optimal letter
    for i in range(n):
        if chars[i] == '?':
            # Find letter with minimum current count
            min_count = float('inf')
            min_letter = -1

            # Check all 26 letters
            for letter_idx in range(26):
                if counts[letter_idx] < min_count:
                    min_count = counts[letter_idx]
                    min_letter = letter_idx

            # Replace '?' with the chosen letter
            chars[i] = chr(ord('a') + min_letter)

            # Update count for the chosen letter
            counts[min_letter] += 1

    # Step 3: Calculate total cost
    total_cost = 0
    # Reset counts for cost calculation
    counts = [0] * 26

    for i in range(n):
        letter_idx = ord(chars[i]) - ord('a')
        # cost(i) = number of times this letter appeared before position i
        total_cost += counts[letter_idx]
        # Update count for this letter
        counts[letter_idx] += 1

    return total_cost
```

```javascript
// Time: O(n) where n = s.length - we make two passes through the string
// Space: O(1) - we store counts for 26 letters (constant space)
function minimizeStringValue(s) {
  // Convert string to array for mutable operations
  const chars = s.split("");
  const n = chars.length;

  // Step 1: Count occurrences of each letter in the original string
  // We'll use this to track frequencies as we replace '?'
  const counts = new Array(26).fill(0);

  // First pass: count fixed characters (non-'?')
  for (let i = 0; i < n; i++) {
    if (chars[i] !== "?") {
      const idx = chars[i].charCodeAt(0) - "a".charCodeAt(0);
      counts[idx]++;
    }
  }

  // Step 2: Replace each '?' with optimal letter
  for (let i = 0; i < n; i++) {
    if (chars[i] === "?") {
      // Find letter with minimum current count
      let minCount = Infinity;
      let minLetter = -1;

      // Check all 26 letters
      for (let letterIdx = 0; letterIdx < 26; letterIdx++) {
        if (counts[letterIdx] < minCount) {
          minCount = counts[letterIdx];
          minLetter = letterIdx;
        }
      }

      // Replace '?' with the chosen letter
      chars[i] = String.fromCharCode("a".charCodeAt(0) + minLetter);

      // Update count for the chosen letter
      counts[minLetter]++;
    }
  }

  // Step 3: Calculate total cost
  let totalCost = 0;
  // Reset counts for cost calculation
  const costCounts = new Array(26).fill(0);

  for (let i = 0; i < n; i++) {
    const letterIdx = chars[i].charCodeAt(0) - "a".charCodeAt(0);
    // cost(i) = number of times this letter appeared before position i
    totalCost += costCounts[letterIdx];
    // Update count for this letter
    costCounts[letterIdx]++;
  }

  return totalCost;
}
```

```java
// Time: O(n) where n = s.length() - we make two passes through the string
// Space: O(1) - we store counts for 26 letters (constant space)
public int minimizeStringValue(String s) {
    // Convert string to char array for processing
    char[] chars = s.toCharArray();
    int n = chars.length;

    // Step 1: Count occurrences of each letter in the original string
    // We'll use this to track frequencies as we replace '?'
    int[] counts = new int[26];

    // First pass: count fixed characters (non-'?')
    for (int i = 0; i < n; i++) {
        if (chars[i] != '?') {
            int idx = chars[i] - 'a';
            counts[idx]++;
        }
    }

    // Step 2: Replace each '?' with optimal letter
    for (int i = 0; i < n; i++) {
        if (chars[i] == '?') {
            // Find letter with minimum current count
            int minCount = Integer.MAX_VALUE;
            int minLetter = -1;

            // Check all 26 letters
            for (int letterIdx = 0; letterIdx < 26; letterIdx++) {
                if (counts[letterIdx] < minCount) {
                    minCount = counts[letterIdx];
                    minLetter = letterIdx;
                }
            }

            // Replace '?' with the chosen letter
            chars[i] = (char)('a' + minLetter);

            // Update count for the chosen letter
            counts[minLetter]++;
        }
    }

    // Step 3: Calculate total cost
    int totalCost = 0;
    // Reset counts for cost calculation
    int[] costCounts = new int[26];

    for (int i = 0; i < n; i++) {
        int letterIdx = chars[i] - 'a';
        // cost(i) = number of times this letter appeared before position i
        totalCost += costCounts[letterIdx];
        // Update count for this letter
        costCounts[letterIdx]++;
    }

    return totalCost;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- First pass to count fixed characters: O(n)
- Second pass to replace '?' characters: O(26n) = O(n) since 26 is constant
- Third pass to calculate cost: O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We use a fixed-size array of 26 integers for letter counts
- The character array modification is done in-place (though some languages create new arrays)
- No additional data structures scale with input size

## Common Mistakes

1. **Not handling lexicographic tie-breaking correctly**: When multiple letters have the same minimum count, you must choose the smallest one alphabetically. Some candidates forget this and pick arbitrarily, which can lead to wrong answers on test cases designed to catch this.

2. **Calculating cost incorrectly**: The cost at position i counts occurrences **before** i, not including i itself. A common off-by-one error is to include the current position or use 1-based indexing.

3. **Modifying the string while counting**: If you try to count letters and replace '?' in the same pass, you might use updated counts for decisions that should be based on original counts only. Always do two separate passes: one to count fixed characters, then another to replace '?'.

4. **Assuming all letters start with count 0**: Remember that fixed characters in the input string contribute to the initial counts. Starting all letters at 0 and only incrementing as you replace '?' will give wrong results.

## When You'll See This Pattern

This problem combines **frequency counting** with **greedy selection**, which appears in many optimization problems:

1. **Task Scheduler (LeetCode 621)**: Similar concept of scheduling tasks to minimize idle time by always choosing the task with highest remaining frequency.

2. **Rearrange String k Distance Apart (LeetCode 358)**: Requires maintaining character frequencies and selecting characters while maintaining distance constraints.

3. **Maximum Number of Occurrences of a Substring (LeetCode 1297)**: Involves counting character frequencies to determine valid substrings.

The core pattern is: when you need to make a series of choices to optimize a cumulative metric (like total cost), and each choice affects future options (by changing frequencies), a greedy approach that always picks the "least costly" option often works if you can prove optimal substructure.

## Key Takeaways

1. **Greedy with frequency tracking**: When a problem involves distributing items (like letters) to minimize some accumulation metric, tracking frequencies and always choosing the least frequent option is often optimal.

2. **Separate analysis from modification**: First analyze the current state (count fixed characters), then make modifications based on that analysis. Don't mix the two phases.

3. **Constant factors matter**: Even though we check 26 letters at each step, 26 is a constant, so O(26n) is still O(n). Don't over-optimize constant factors prematurely.

Related problems: [Lexicographically Smallest String After Substring Operation](/problem/lexicographically-smallest-string-after-substring-operation)
