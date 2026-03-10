---
title: "Medium Atlassian Interview Questions: Strategy Guide"
description: "How to tackle 43 medium difficulty questions from Atlassian — patterns, time targets, and practice tips."
date: "2032-07-28"
category: "tips"
tags: ["atlassian", "medium", "interview prep"]
---

Atlassian’s Medium interview questions are where the real interview begins. While their Easy problems often test basic data structure familiarity, Medium problems are designed to assess your problem-solving process under realistic constraints. What separates Atlassian’s Medium tier is a distinct focus on **practical, real-world adjacent problems**—think designing a rate limiter, parsing a log file, or implementing a feature flag system—rather than purely academic algorithm puzzles. You’ll still see classic LeetCode patterns, but they’re often dressed in domain-specific clothing that tests your ability to translate a business requirement into clean, efficient code.

## Common Patterns and Templates

Atlassian’s Medium problems heavily favor a few core patterns that mirror backend and systems engineering work. The most prevalent is **Simulation with State Tracking**. You’re often asked to model a process (like a queue, a cache, or a workflow) step-by-step, maintaining and updating internal state correctly. This requires careful handling of edge cases and a clear mental model of the system’s lifecycle.

A common template for these simulation problems involves initializing a data structure to hold state, processing inputs in a sequence, and applying business rules at each step. Here’s a generic template for a class-based simulation, which is a frequent pattern:

<div class="code-group">

```python
class StatefulSimulation:
    def __init__(self, capacity: int):
        # Initialize all necessary state variables
        self.capacity = capacity
        self.state = {}  # or a list, queue, etc.
        # Often a time or order tracker
        self.timestamp = 0

    def process(self, input_val: int) -> int:
        # 1. Update internal time/order if needed
        self.timestamp += 1
        # 2. Clean up expired or invalid state based on rules
        self._cleanup()
        # 3. Apply business logic to the new input
        if self._is_valid(input_val):
            self._update_state(input_val)
            return self._generate_output(input_val)
        # 4. Handle invalid/edge cases
        return -1

    def _cleanup(self):
        # Remove state entries that no longer satisfy constraints
        # e.g., remove items older than a time window
        to_remove = [k for k, v in self.state.items()
                     if self.timestamp - v > self.capacity]
        for k in to_remove:
            del self.state[k]

    def _is_valid(self, input_val: int) -> bool:
        # Check capacity, rate limits, or other business rules
        return len(self.state) < self.capacity

    def _update_state(self, input_val: int):
        # Add or modify state
        self.state[input_val] = self.timestamp

    def _generate_output(self, input_val: int) -> int:
        # Compute the required return value
        return len(self.state)

# Time complexity per operation: O(n) for cleanup in worst case, often amortized O(1)
# Space complexity: O(capacity) for stored state
```

```javascript
class StatefulSimulation {
  constructor(capacity) {
    this.capacity = capacity;
    this.state = new Map(); // or object, array
    this.timestamp = 0;
  }

  process(inputVal) {
    this.timestamp++;
    this._cleanup();
    if (this._isValid(inputVal)) {
      this._updateState(inputVal);
      return this._generateOutput(inputVal);
    }
    return -1;
  }

  _cleanup() {
    for (let [key, val] of this.state.entries()) {
      if (this.timestamp - val > this.capacity) {
        this.state.delete(key);
      }
    }
  }

  _isValid(inputVal) {
    return this.state.size < this.capacity;
  }

  _updateState(inputVal) {
    this.state.set(inputVal, this.timestamp);
  }

  _generateOutput(inputVal) {
    return this.state.size;
  }
}

// Time per operation: O(n) worst-case, often amortized O(1)
// Space: O(capacity)
```

```java
import java.util.*;

class StatefulSimulation {
    private int capacity;
    private Map<Integer, Integer> state;
    private int timestamp;

    public StatefulSimulation(int capacity) {
        this.capacity = capacity;
        this.state = new HashMap<>();
        this.timestamp = 0;
    }

    public int process(int inputVal) {
        timestamp++;
        cleanup();
        if (isValid(inputVal)) {
            updateState(inputVal);
            return generateOutput(inputVal);
        }
        return -1;
    }

    private void cleanup() {
        Iterator<Map.Entry<Integer, Integer>> it = state.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<Integer, Integer> entry = it.next();
            if (timestamp - entry.getValue() > capacity) {
                it.remove();
            }
        }
    }

    private boolean isValid(int inputVal) {
        return state.size() < capacity;
    }

    private void updateState(int inputVal) {
        state.put(inputVal, timestamp);
    }

    private int generateOutput(int inputVal) {
        return state.size();
    }
}

// Time per operation: O(n) worst-case, often amortized O(1)
// Space: O(capacity)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Atlassian, you should aim to reach a working, brute-force solution within 10-12 minutes. The optimal solution, with all edge cases handled, should be coded and verified within 25-30 minutes total, leaving 5-10 minutes for discussion. The interviewer is evaluating several signals beyond correctness:

1.  **Code Quality and Readability:** They expect production-like code. Use meaningful variable names, helper functions for distinct logical steps (like `_cleanup` in the template), and consistent formatting. A messy, monolithic function is a red flag.
2.  **Edge Case Identification:** Proactively discuss boundary conditions—empty input, maximum capacity, duplicate values, timeouts, or concurrent access hints. Mentioning these before coding shows systematic thinking.
3.  **Trade-off Justification:** Be prepared to explain your choice of data structure. Why a HashMap over an array? Why a min-heap for that operation? Articulating the time/space trade-off is crucial.
4.  **Communication of State Transitions:** For simulation problems, verbally walking through how your state evolves with an example input is highly valued. It proves you understand the _process_, not just the answer.

## Key Differences from Easy Problems

Easy problems at Atlassian often have a one-step mapping from problem statement to a standard data structure operation. Medium problems introduce **multiple moving parts** that must be coordinated. The key mindset shift is from _finding the right tool_ to _orchestrating several tools together_.

New techniques required:

- **State Management:** You must design a data model that represents the system's current condition and update it correctly across operations. This often involves combining a primary data structure (like a queue or map) with auxiliary variables (timestamps, counters, pointers).
- **Amortized Analysis:** Many Medium solutions rely on operations that are O(n) in the worst case but O(1) on average because elements are added and removed once (e.g., the sliding window cleanup in the template above). You need to recognize and explain this amortization.
- **Algorithmic Optimization:** While Easy problems might accept a brute-force O(n²) solution, Medium problems almost always require you to find an O(n log n) or O(n) approach. This often involves sorting as a preprocessing step or using a hash map to trade space for time.

## Specific Patterns for Medium

1.  **Ordered Map / Heap for Priority Scheduling:** Problems like designing a ticket backlog or task scheduler often require retrieving the "next" item by priority or timestamp. A combination of a hash map (for O(1) lookup) and a min-heap (for O(log n) retrieval of the next item) is common. This appears in variations of "Merge K Sorted Lists" or "Task Scheduler."

2.  **Sliding Window with Deque for Rate Limiting:** A classic Atlassian-relevant pattern. To count requests in the last 5 minutes, you maintain a deque of timestamps. On each new request, pop expired timestamps from the left, append the new timestamp to the right, and the deque length is the count. This is the core of problems like "Design Hit Counter" or any rate-limiting simulation.

3.  **Union-Find for Access Control Groups:** For problems involving merging user groups, permissions, or connected components in a system (like determining if two users share a team), Union-Find (Disjoint Set Union) is the efficient go-to. The pattern involves `find` (with path compression) and `union` (by rank) operations. It turns O(n) group lookups into nearly O(1).

## Practice Strategy

Don't just solve these problems; simulate the interview. For each Atlassian Medium question:

1.  **First 5 minutes:** Read the problem aloud, restate it in your own words, and write down 2-3 concrete examples, including edge cases.
2.  **Next 10 minutes:** Derive a brute-force solution, then optimize. Sketch the key data structures and their interactions on paper or a whiteboard.
3.  **15 minutes to code:** Implement the solution verbosely, using helper functions. Talk through your logic as you write.
4.  **Final 5 minutes:** Walk through your example with the code, then discuss time/space complexity and potential scaling issues.

Recommended order: Start with high-frequency patterns. Do 1-2 Sliding Window/Simulation problems (like "Design Underground System" or "Time Based Key-Value Store"), then 1-2 Heap/Priority Queue problems, then a Union-Find problem. Aim for 2-3 Medium problems per day, with at least one being from Atlassian's tagged list. Quality of analysis beats quantity of solved problems.

[Practice Medium Atlassian questions](/company/atlassian/medium)
