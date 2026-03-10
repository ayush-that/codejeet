---
title: "How to Solve Calculate Score After Performing Instructions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Calculate Score After Performing Instructions. Medium difficulty, 56.9% acceptance rate. Topics: Array, Hash Table, String, Simulation."
date: "2028-11-22"
category: "dsa-patterns"
tags: ["calculate-score-after-performing-instructions", "array", "hash-table", "string", "medium"]
---

# How to Solve "Calculate Score After Performing Instructions"

This problem asks you to simulate a process where you follow instructions that can either add to your score, jump to a different instruction, or skip ahead. The tricky part is that jumps can create cycles, and you need to detect when you're stuck in an infinite loop. The challenge lies in efficiently tracking visited states while handling the jump mechanics correctly.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
instructions = ["add", "jump", "add", "skip"]
values = [5, 2, 3, 1]
```

**Step-by-step simulation:**

1. **i = 0, score = 0**: Instruction is "add", value is 5. Add 5 to score → score = 5. Move to next instruction (i = 1).

2. **i = 1, score = 5**: Instruction is "jump", value is 2. Jump to index 2 (i = 2). Move to instruction at index 2.

3. **i = 2, score = 5**: Instruction is "add", value is 3. Add 3 to score → score = 8. Move to next instruction (i = 3).

4. **i = 3, score = 8**: Instruction is "skip", value is 1. Skip 1 instruction → i = 3 + 1 + 1 = 5. Since 5 ≥ n (n=4), we terminate.

**Final score: 8**

Now let's consider a case with a cycle:

**Input:**

```
instructions = ["jump", "jump", "add"]
values = [1, 0, 5]
```

1. **i = 0, score = 0**: "jump" to index 1 (i = 1)
2. **i = 1, score = 0**: "jump" to index 0 (i = 0)
3. **i = 0, score = 0**: "jump" to index 1 (i = 1) ← We're in a cycle!

We need to detect this cycle and return the current score when we first detect it.

## Brute Force Approach

The most straightforward approach is to simply simulate the process without any cycle detection:

1. Start at i = 0 with score = 0
2. While i is within bounds (0 ≤ i < n):
   - If instruction is "add": add value[i] to score, then i += 1
   - If instruction is "jump": set i = values[i]
   - If instruction is "skip": set i = i + values[i] + 1
3. Return the final score

The problem with this approach is that it can get stuck in an infinite loop if there's a cycle in the jump instructions. Without cycle detection, the program would never terminate for such inputs.

**Why this fails:** The instructions can create cycles where you revisit the same index multiple times. Without tracking visited states, you can't detect when you're stuck in an infinite loop.

## Optimized Approach

The key insight is that we need to detect cycles to avoid infinite loops. We can do this by tracking which indices we've visited. However, there's a subtlety: the same index can be visited with different scores, and we only have a cycle if we visit the same index **with the same score**.

Think about it: if you visit index i with score s, and later visit index i again with a different score, that's not necessarily a cycle - the different score might lead to different future behavior. But if you visit index i with the exact same score s, you're guaranteed to repeat the exact same sequence of instructions, creating an infinite loop.

Therefore, we need to track (index, score) pairs. When we encounter a pair we've seen before, we've detected a cycle and should return the current score.

**Step-by-step reasoning:**

1. Use a set to store visited (index, score) pairs
2. Start at i = 0 with score = 0
3. While i is within bounds:
   - If (i, score) is in visited set: return score (cycle detected)
   - Add (i, score) to visited set
   - Process current instruction:
     - "add": score += values[i], i += 1
     - "jump": i = values[i]
     - "skip": i = i + values[i] + 1
4. If we exit the loop (i ≥ n), return the final score

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) - In worst case, we visit each index once
# Space: O(n) - We might store up to n (index, score) pairs in the visited set
def calculateScore(instructions, values):
    """
    Calculate the final score after processing instructions.

    Args:
        instructions: List of strings, each is "add", "jump", or "skip"
        values: List of integers corresponding to each instruction

    Returns:
        The final score after processing all instructions or when a cycle is detected
    """
    n = len(instructions)
    score = 0
    i = 0  # Current instruction index

    # Set to track visited (index, score) pairs
    # We use a tuple (i, score) as the key
    visited = set()

    # Process instructions while we're within bounds
    while i < n:
        # Check if we've seen this exact state before
        # If we have, we're in a cycle - return current score
        if (i, score) in visited:
            return score

        # Mark current state as visited
        visited.add((i, score))

        # Process current instruction
        if instructions[i] == "add":
            # Add value to score and move to next instruction
            score += values[i]
            i += 1
        elif instructions[i] == "jump":
            # Jump to the instruction at index values[i]
            i = values[i]
        elif instructions[i] == "skip":
            # Skip values[i] instructions
            # The +1 is because we also skip the current instruction
            i = i + values[i] + 1

    # If we exit the loop, we've processed all instructions
    return score
```

```javascript
// Time: O(n) - In worst case, we visit each index once
// Space: O(n) - We might store up to n (index, score) pairs in the visited set
function calculateScore(instructions, values) {
  /**
   * Calculate the final score after processing instructions.
   *
   * @param {string[]} instructions - Array of "add", "jump", or "skip"
   * @param {number[]} values - Array of integers corresponding to each instruction
   * @return {number} The final score after processing all instructions or when a cycle is detected
   */
  const n = instructions.length;
  let score = 0;
  let i = 0; // Current instruction index

  // Set to track visited (index, score) pairs
  // We use a string key "i,score" since JavaScript Sets compare object references
  const visited = new Set();

  // Process instructions while we're within bounds
  while (i < n) {
    // Create a unique key for the current state
    const stateKey = `${i},${score}`;

    // Check if we've seen this exact state before
    // If we have, we're in a cycle - return current score
    if (visited.has(stateKey)) {
      return score;
    }

    // Mark current state as visited
    visited.add(stateKey);

    // Process current instruction
    if (instructions[i] === "add") {
      // Add value to score and move to next instruction
      score += values[i];
      i += 1;
    } else if (instructions[i] === "jump") {
      // Jump to the instruction at index values[i]
      i = values[i];
    } else if (instructions[i] === "skip") {
      // Skip values[i] instructions
      // The +1 is because we also skip the current instruction
      i = i + values[i] + 1;
    }
  }

  // If we exit the loop, we've processed all instructions
  return score;
}
```

```java
// Time: O(n) - In worst case, we visit each index once
// Space: O(n) - We might store up to n (index, score) pairs in the visited set
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int calculateScore(String[] instructions, int[] values) {
        /**
         * Calculate the final score after processing instructions.
         *
         * @param instructions: Array of "add", "jump", or "skip"
         * @param values: Array of integers corresponding to each instruction
         * @return The final score after processing all instructions or when a cycle is detected
         */
        int n = instructions.length;
        int score = 0;
        int i = 0;  // Current instruction index

        // Set to track visited (index, score) pairs
        // We use a custom State class to store the pair
        Set<State> visited = new HashSet<>();

        // Process instructions while we're within bounds
        while (i < n) {
            // Create state object for current position
            State currentState = new State(i, score);

            // Check if we've seen this exact state before
            // If we have, we're in a cycle - return current score
            if (visited.contains(currentState)) {
                return score;
            }

            // Mark current state as visited
            visited.add(currentState);

            // Process current instruction
            if (instructions[i].equals("add")) {
                // Add value to score and move to next instruction
                score += values[i];
                i += 1;
            } else if (instructions[i].equals("jump")) {
                // Jump to the instruction at index values[i]
                i = values[i];
            } else if (instructions[i].equals("skip")) {
                // Skip values[i] instructions
                // The +1 is because we also skip the current instruction
                i = i + values[i] + 1;
            }
        }

        // If we exit the loop, we've processed all instructions
        return score;
    }

    // Helper class to represent (index, score) pairs
    private static class State {
        int index;
        int score;

        State(int index, int score) {
            this.index = index;
            this.score = score;
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            State state = (State) obj;
            return index == state.index && score == state.score;
        }

        @Override
        public int hashCode() {
            // Combine both fields to create a unique hash code
            return 31 * index + score;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we visit each index exactly once before either terminating or detecting a cycle
- Each visit involves O(1) operations: set lookup, set insertion, and instruction processing
- Even with cycles, we detect them as soon as we revisit a state, so we never process more than n unique states

**Space Complexity: O(n)**

- We store visited (index, score) pairs in a set
- In the worst case, we might store all n indices before terminating
- Each state requires constant space, so total space is O(n)

## Common Mistakes

1. **Not tracking score in visited states**: Only tracking the index isn't enough. Consider: you visit index i with score 10, process an "add" instruction, then later visit index i again with score 15. These are different states that could lead to different outcomes. Only when both index AND score match are you guaranteed to be in a cycle.

2. **Off-by-one error in "skip" instruction**: The problem says to skip `values[i]` instructions. Since you're already at the current instruction, you need to skip it plus `values[i]` more. That's why we do `i = i + values[i] + 1`, not `i = i + values[i]`.

3. **Forgetting to check array bounds for jumps**: While the problem guarantees valid indices for jumps (0 ≤ values[i] < n), in a real interview you might want to mention this assumption or add a bounds check.

4. **Using the wrong data structure for visited states**: A list or array would be inefficient for lookups. A set (hash table) gives us O(1) lookups, which is crucial for efficiency.

## When You'll See This Pattern

This problem combines **state machine simulation** with **cycle detection**, a pattern that appears in several other problems:

1. **Linked List Cycle Detection (LeetCode 141)**: Uses fast/slow pointers to detect cycles in linked lists. While the technique differs, the core concept of detecting repetition is the same.

2. **Find the Duplicate Number (LeetCode 287)**: Can be solved by treating the array as a linked list and detecting cycles, similar to how we track visited states here.

3. **Robot Bounded In Circle (LeetCode 1041)**: Determines if a robot's path is bounded by checking if it returns to the origin or faces a different direction after a sequence of instructions - another form of cycle detection in state machines.

The key pattern is: when simulating a process where the next state depends on the current state, and you need to detect if you'll repeat states indefinitely, track visited states in a hash set.

## Key Takeaways

1. **Track complete state for cycle detection**: When detecting cycles in state machines, you need to track all variables that affect future states. In this case, both the index AND the score determine what happens next.

2. **Hash sets are ideal for state tracking**: For O(1) lookups when checking if you've seen a state before, use a hash set. In Python/Java, you can use tuples/objects; in JavaScript, convert to string keys.

3. **Simulation problems often need termination conditions**: When instructions can create cycles, always consider how to detect and handle infinite loops. The visited states pattern is a reliable approach.

[Practice this problem on CodeJeet](/problem/calculate-score-after-performing-instructions)
