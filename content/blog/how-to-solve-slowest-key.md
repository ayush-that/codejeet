---
title: "How to Solve Slowest Key — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Slowest Key. Easy difficulty, 59.5% acceptance rate. Topics: Array, String."
date: "2027-03-11"
category: "dsa-patterns"
tags: ["slowest-key", "array", "string", "easy"]
---

# How to Solve Slowest Key

This problem asks us to find which key took the longest time to press in a sequence of keypresses. While conceptually simple, it requires careful handling of duration calculations and tie-breaking logic. The tricky part isn't the algorithm itself, but getting all the edge cases right—particularly when multiple keys have the same maximum duration.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
releaseTimes = [9, 29, 49, 50]
keysPressed = "cbcd"
```

**Step-by-step calculation:**

1. **First key 'c':** Duration = releaseTimes[0] - 0 = 9 - 0 = 9
   - Current longest duration = 9, slowest key = 'c'

2. **Second key 'b':** Duration = releaseTimes[1] - releaseTimes[0] = 29 - 9 = 20
   - 20 > 9, so update: longest duration = 20, slowest key = 'b'

3. **Third key 'c':** Duration = releaseTimes[2] - releaseTimes[1] = 49 - 29 = 20
   - 20 == 20 (tie), compare keys: 'c' > 'b' alphabetically? No, 'c' comes after 'b', so 'c' is lexicographically larger. Keep 'b'

4. **Fourth key 'd':** Duration = releaseTimes[3] - releaseTimes[2] = 50 - 49 = 1
   - 1 < 20, no change

**Result:** 'b' is the slowest key with duration 20.

The key insight: we need to calculate each key's duration by subtracting consecutive release times, track the maximum duration, and when we find a tie, choose the lexicographically larger key.

## Brute Force Approach

A naive approach might involve:

1. Calculate all durations and store them in an array
2. Find the maximum duration in that array
3. Collect all keys with that maximum duration
4. Find the lexicographically largest among them

While this approach would work, it's unnecessarily complex. We don't need to store all durations—we can process the data in a single pass. The brute force would use O(n) extra space for the durations array when we could solve it with O(1) space.

More importantly, candidates might try to overcomplicate the tie-breaking by collecting all candidates first. This adds unnecessary complexity and potential for bugs.

## Optimal Solution

The optimal solution processes the array in a single pass, calculating each duration on the fly and updating our answer when we find a longer duration or an equal duration with a lexicographically larger key.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def slowestKey(releaseTimes, keysPressed):
    """
    Find the key with the longest press duration.

    Args:
        releaseTimes: List[int] - times when keys were released
        keysPressed: str - sequence of keys pressed

    Returns:
        str - the lexicographically largest key among those with max duration
    """
    # Initialize with the first key's duration
    max_duration = releaseTimes[0]
    result_key = keysPressed[0]

    # Iterate through remaining keys
    for i in range(1, len(releaseTimes)):
        # Calculate duration for current key
        # Current release time minus previous release time
        current_duration = releaseTimes[i] - releaseTimes[i - 1]

        # Get current key character
        current_key = keysPressed[i]

        # Check if we found a new maximum duration
        if current_duration > max_duration:
            max_duration = current_duration
            result_key = current_key
        # Handle tie: choose lexicographically larger key
        elif current_duration == max_duration and current_key > result_key:
            result_key = current_key

    return result_key
```

```javascript
// Time: O(n) | Space: O(1)
function slowestKey(releaseTimes, keysPressed) {
  /**
   * Find the key with the longest press duration.
   *
   * @param {number[]} releaseTimes - times when keys were released
   * @param {string} keysPressed - sequence of keys pressed
   * @return {string} - the lexicographically largest key among those with max duration
   */

  // Initialize with the first key's duration
  let maxDuration = releaseTimes[0];
  let resultKey = keysPressed[0];

  // Iterate through remaining keys
  for (let i = 1; i < releaseTimes.length; i++) {
    // Calculate duration for current key
    // Current release time minus previous release time
    const currentDuration = releaseTimes[i] - releaseTimes[i - 1];

    // Get current key character
    const currentKey = keysPressed[i];

    // Check if we found a new maximum duration
    if (currentDuration > maxDuration) {
      maxDuration = currentDuration;
      resultKey = currentKey;
    }
    // Handle tie: choose lexicographically larger key
    else if (currentDuration === maxDuration && currentKey > resultKey) {
      resultKey = currentKey;
    }
  }

  return resultKey;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public char slowestKey(int[] releaseTimes, String keysPressed) {
        /**
         * Find the key with the longest press duration.
         *
         * @param releaseTimes - times when keys were released
         * @param keysPressed - sequence of keys pressed
         * @return the lexicographically largest key among those with max duration
         */

        // Initialize with the first key's duration
        int maxDuration = releaseTimes[0];
        char resultKey = keysPressed.charAt(0);

        // Iterate through remaining keys
        for (int i = 1; i < releaseTimes.length; i++) {
            // Calculate duration for current key
            // Current release time minus previous release time
            int currentDuration = releaseTimes[i] - releaseTimes[i - 1];

            // Get current key character
            char currentKey = keysPressed.charAt(i);

            // Check if we found a new maximum duration
            if (currentDuration > maxDuration) {
                maxDuration = currentDuration;
                resultKey = currentKey;
            }
            // Handle tie: choose lexicographically larger key
            else if (currentDuration == maxDuration && currentKey > resultKey) {
                resultKey = currentKey;
            }
        }

        return resultKey;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array exactly once, performing constant-time operations for each element
- The loop runs n-1 times (starting from index 1), which simplifies to O(n)

**Space Complexity: O(1)**

- We only use a fixed number of variables (maxDuration, resultKey, loop counter)
- No additional data structures that grow with input size
- Even the input parameters are not counted toward space complexity in standard analysis

## Common Mistakes

1. **Incorrect duration calculation for first key:** Forgetting that the first key's duration is simply `releaseTimes[0] - 0`, not `releaseTimes[0] - releaseTimes[-1]`. Always handle the first element separately or initialize your loop correctly.

2. **Wrong tie-breaking logic:** Using `<` instead of `>` when comparing characters for lexicographic order. Remember: in most languages, character comparison uses ASCII values, so `'b' > 'a'` is true. Also, some candidates forget to handle ties altogether.

3. **Off-by-one errors in the loop:** Starting the loop at index 0 instead of 1, which would cause index out of bounds when calculating `releaseTimes[i] - releaseTimes[i - 1]`. Always verify your loop boundaries with a small test case.

4. **Assuming keys are lowercase only:** While the problem examples use lowercase letters, the constraints don't guarantee this. The character comparison `currentKey > resultKey` works correctly for any characters because it compares ASCII values.

## When You'll See This Pattern

This problem uses a **single-pass tracking pattern** where we maintain running state (maximum value and associated data) while iterating through an array. You'll see this pattern in:

1. **Maximum Subarray (LeetCode 53):** Similar tracking of maximum sum while iterating through the array, updating when we find a better sum.

2. **Best Time to Buy and Sell Stock (LeetCode 121):** Tracking minimum price and maximum profit in a single pass through prices.

3. **Majority Element (LeetCode 169):** The Boyer-Moore algorithm tracks a candidate and count in a single pass.

The common theme: instead of storing all intermediate results, we maintain just enough state to answer the question by the end of the iteration.

## Key Takeaways

1. **Single-pass solutions are often optimal for tracking problems:** When you need to find a maximum/minimum with associated data, consider whether you can track it in one pass without storing all intermediate values.

2. **Initialize with first element:** For problems where you need to compare consecutive elements, handle the first element separately to avoid index errors and establish initial state.

3. **Tie-breaking requires careful comparison:** When multiple elements can have the same "score" (like duration here), clearly define the tie-breaking rule and implement it correctly—often this involves comparing additional properties.

[Practice this problem on CodeJeet](/problem/slowest-key)
