---
title: "How to Solve Minimum Number of Chairs in a Waiting Room — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Number of Chairs in a Waiting Room. Easy difficulty, 79.2% acceptance rate. Topics: String, Simulation."
date: "2028-02-01"
category: "dsa-patterns"
tags: ["minimum-number-of-chairs-in-a-waiting-room", "string", "simulation", "easy"]
---

# How to Solve Minimum Number of Chairs in a Waiting Room

This problem asks us to simulate people entering and leaving a waiting room over time, tracking the maximum number of chairs needed at any moment. While conceptually simple, it's interesting because it requires careful tracking of concurrent occupancy rather than just counting total entries. The key insight is that we need to find the peak occupancy, not the total number of people who ever visited.

## Visual Walkthrough

Let's trace through an example: `s = "ELEELEELL"`

We'll simulate second by second, tracking current occupancy and maximum seen:

- **Second 0 (E)**: Person enters. Current chairs: 1, Max chairs: 1
- **Second 1 (L)**: Person leaves. Current chairs: 0, Max chairs: 1
- **Second 2 (E)**: Person enters. Current chairs: 1, Max chairs: 1
- **Second 3 (E)**: Person enters. Current chairs: 2, Max chairs: 2
- **Second 4 (L)**: Person leaves. Current chairs: 1, Max chairs: 2
- **Second 5 (E)**: Person enters. Current chairs: 2, Max chairs: 2
- **Second 6 (E)**: Person enters. Current chairs: 3, Max chairs: 3
- **Second 7 (L)**: Person leaves. Current chairs: 2, Max chairs: 3
- **Second 8 (L)**: Person leaves. Current chairs: 1, Max chairs: 3

The minimum chairs needed is 3, which is the maximum concurrent occupancy we observed.

## Brute Force Approach

A naive approach might try to track all individual people or simulate complex scenarios, but the simplest brute force is actually quite close to optimal. We could:

1. Initialize current chairs to 0
2. Iterate through each character in the string
3. For each 'E', increment current chairs; for each 'L', decrement
4. Track the maximum value of current chairs during the iteration

The reason this is essentially optimal is that we must examine each character at least once to know what happens at each second. Any approach that doesn't examine each character could miss critical events.

However, some candidates might try to overcomplicate this by:

- Using a queue to track individual people (unnecessary overhead)
- Trying to pre-compute without simulation (can't handle interleaved enters/leaves)
- Using two passes (one for enters, one for leaves) which fails because order matters

The simple simulation approach is already O(n) time and O(1) space, which is optimal.

## Optimal Solution

The optimal solution is straightforward simulation. We maintain a running count of current occupants and track the maximum value it reaches. This works because:

- Each 'E' represents a new person needing a chair
- Each 'L' represents a person freeing a chair
- The order of operations ensures we never have negative chairs
- The maximum concurrent occupancy equals the minimum chairs needed

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(1) - only using a few integer variables
def minimumChairs(s: str) -> int:
    """
    Calculate minimum chairs needed in waiting room.

    Args:
        s: String containing 'E' (enter) and 'L' (leave) events

    Returns:
        Minimum number of chairs needed
    """
    current_chairs = 0  # Track current number of occupied chairs
    max_chairs = 0      # Track maximum chairs needed at any time

    # Iterate through each event in chronological order
    for event in s:
        if event == 'E':
            # Person enters - need one more chair
            current_chairs += 1
            # Update maximum if current exceeds previous maximum
            max_chairs = max(max_chairs, current_chairs)
        else:  # event == 'L'
            # Person leaves - free up one chair
            current_chairs -= 1

    return max_chairs
```

```javascript
// Time: O(n) where n is length of string
// Space: O(1) - only using a few variables
/**
 * Calculate minimum chairs needed in waiting room.
 * @param {string} s - String containing 'E' (enter) and 'L' (leave) events
 * @return {number} Minimum number of chairs needed
 */
function minimumChairs(s) {
  let currentChairs = 0; // Track current number of occupied chairs
  let maxChairs = 0; // Track maximum chairs needed at any time

  // Iterate through each event in chronological order
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "E") {
      // Person enters - need one more chair
      currentChairs++;
      // Update maximum if current exceeds previous maximum
      maxChairs = Math.max(maxChairs, currentChairs);
    } else {
      // s[i] === 'L'
      // Person leaves - free up one chair
      currentChairs--;
    }
  }

  return maxChairs;
}
```

```java
// Time: O(n) where n is length of string
// Space: O(1) - only using a few variables
class Solution {
    /**
     * Calculate minimum chairs needed in waiting room.
     * @param s String containing 'E' (enter) and 'L' (leave) events
     * @return Minimum number of chairs needed
     */
    public int minimumChairs(String s) {
        int currentChairs = 0;  // Track current number of occupied chairs
        int maxChairs = 0;      // Track maximum chairs needed at any time

        // Iterate through each event in chronological order
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == 'E') {
                // Person enters - need one more chair
                currentChairs++;
                // Update maximum if current exceeds previous maximum
                maxChairs = Math.max(maxChairs, currentChairs);
            } else {  // s.charAt(i) == 'L'
                // Person leaves - free up one chair
                currentChairs--;
            }
        }

        return maxChairs;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string exactly once, performing constant-time operations (comparisons, increments, decrements, max updates) for each character.
- `n` is the length of the input string.

**Space Complexity: O(1)**

- We only use a fixed number of integer variables (`current_chairs`, `max_chairs`, loop index) regardless of input size.
- No additional data structures that grow with input size.

## Common Mistakes

1. **Forgetting to track maximum properly**: Some candidates only return the final `current_chairs` value, which could be 0 if everyone leaves. Remember: we need the peak occupancy, not the ending occupancy.

2. **Not handling the update order correctly**: When processing 'E', you must update `max_chairs` AFTER incrementing `current_chairs`. If you update before incrementing, you'll miss counting the current person.

3. **Assuming equal numbers of E and L**: While the problem guarantees the room ends empty (equal Es and Ls), don't assume this during simulation. Always handle each event independently.

4. **Overcomplicating with data structures**: Some candidates use stacks, queues, or arrays to track individuals. This adds unnecessary O(n) space complexity when O(1) suffices.

## When You'll See This Pattern

This "running count with peak tracking" pattern appears in many problems involving resource allocation or concurrent events:

1. **Maximum Depth of Parentheses** (LeetCode 1614): Similar concept of tracking depth as you traverse, looking for maximum depth.

2. **Find the Highest Altitude** (LeetCode 1732): Track cumulative sum and find maximum value, just like tracking cumulative chair changes.

3. **Meeting Rooms II** (LeetCode 253): A more complex version where you need to find maximum overlapping intervals, often solved by sorting start/end times and using similar counting logic.

The core pattern is: maintain a counter that increments/decrements based on events, and track the maximum value it reaches during the entire sequence.

## Key Takeaways

1. **Simulation beats precomputation for sequence problems**: When events happen in a specific order, simulating step-by-step is often the cleanest solution.

2. **Track peaks, not just final states**: Many problems ask for maximum/minimum values during a process, not just the ending value. Always consider if you need to track extremes throughout.

3. **O(1) space is often possible**: Even when tracking complex sequences, you might only need to maintain a running counter and peak value rather than storing all intermediate states.

Related problems: [Consecutive Characters](/problem/consecutive-characters)
