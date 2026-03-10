---
title: "How to Solve Maximum Frequency Stack — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Frequency Stack. Hard difficulty, 66.6% acceptance rate. Topics: Hash Table, Stack, Design, Ordered Set."
date: "2028-07-21"
category: "dsa-patterns"
tags: ["maximum-frequency-stack", "hash-table", "stack", "design", "hard"]
---

## How to Solve Maximum Frequency Stack

This problem asks you to design a stack-like data structure where you can push elements, but when you pop, you remove the most frequent element. If there are ties (multiple elements with the same highest frequency), you remove the one that was most recently pushed among those ties. This "most recent among ties" requirement is what makes this problem tricky—it's not just about tracking frequencies, but also about maintaining the push order within each frequency level.

## Visual Walkthrough

Let's trace through an example to build intuition. We'll perform these operations:

```
push(5), push(7), push(5), push(7), push(4), push(5), pop(), pop(), pop(), pop()
```

**Step 1: push(5)**

- Frequency of 5 becomes 1
- Add 5 to stack for frequency 1: `{1: [5]}`

**Step 2: push(7)**

- Frequency of 7 becomes 1
- Add 7 to stack for frequency 1: `{1: [5, 7]}`

**Step 3: push(5)**

- Frequency of 5 becomes 2
- Add 5 to stack for frequency 2: `{2: [5]}`

**Step 4: push(7)**

- Frequency of 7 becomes 2
- Add 7 to stack for frequency 2: `{2: [5, 7]}`

**Step 5: push(4)**

- Frequency of 4 becomes 1
- Add 4 to stack for frequency 1: `{1: [5, 7, 4]}`

**Step 6: push(5)**

- Frequency of 5 becomes 3
- Add 5 to stack for frequency 3: `{3: [5]}`

Now let's pop:

**Step 7: pop()**

- Current max frequency = 3
- Get element from frequency 3 stack: `5` (removed from `{3: [5]}`)
- Decrease frequency of 5 to 2
- Max frequency remains 3 (since we still have elements at frequency 3? No, stack for frequency 3 is now empty, so max frequency becomes 2)

**Step 8: pop()**

- Current max frequency = 2
- Get element from frequency 2 stack: `7` (most recent at frequency 2)
- Decrease frequency of 7 to 1
- Max frequency remains 2 (stack for frequency 2 still has `5`)

**Step 9: pop()**

- Current max frequency = 2
- Get element from frequency 2 stack: `5`
- Decrease frequency of 5 to 1
- Max frequency becomes 1 (frequency 2 stack is now empty)

**Step 10: pop()**

- Current max frequency = 1
- Get element from frequency 1 stack: `4` (most recent at frequency 1)
- Decrease frequency of 4 to 0

This example shows why we need two data structures: one to track each element's current frequency, and another to group elements by frequency while maintaining their push order within each frequency group.

## Brute Force Approach

A naive approach might be to:

1. Store all elements in an array or stack
2. For each pop, scan through all elements to count frequencies
3. Find the element with highest frequency
4. If there are ties, find the most recent one among them
5. Remove that element from the data structure

The problem with this approach is that both push and pop would be O(n) operations, where n is the number of elements. For push, we'd need to update frequency counts. For pop, we'd need to scan all elements to find the most frequent one. With up to 10⁴ operations (as per typical constraints), this would be too slow.

Even if we maintain a frequency map separately, we still face the challenge of finding "the most recent among ties" efficiently. We could store timestamps, but then we'd need to scan all elements with the maximum frequency to find the most recent one.

## Optimized Approach

The key insight is that we need to organize elements by their frequency while preserving the push order within each frequency level. Think of it as having multiple stacks:

- **Stack 1**: Contains all elements that have appeared exactly once, in push order
- **Stack 2**: Contains all elements that have appeared exactly twice, in push order
- **Stack 3**: Contains all elements that have appeared exactly three times, in push order
- And so on...

When we push an element with current frequency `f`, we add it to the stack for frequency `f+1`. When we pop, we always pop from the highest frequency stack available. This automatically gives us the "most recent among ties" property because the last element pushed to a frequency stack is the most recent element that reached that frequency.

We need two main data structures:

1. `freq`: A hash map to track the current frequency of each element
2. `group`: A hash map where keys are frequencies and values are stacks containing elements with that frequency

We also track `maxFreq` to know which stack to pop from.

## Optimal Solution

<div class="code-group">

```python
# Time: O(1) for both push and pop | Space: O(n) where n is number of elements
class FreqStack:
    def __init__(self):
        # freq maps each value to its current frequency
        self.freq = {}
        # group maps frequency to a stack of values with that frequency
        self.group = {}
        # Track the current maximum frequency
        self.max_freq = 0

    def push(self, val: int) -> None:
        # Step 1: Update frequency of val
        # If val is new, set frequency to 1, otherwise increment
        self.freq[val] = self.freq.get(val, 0) + 1

        # Step 2: Get the new frequency after increment
        current_freq = self.freq[val]

        # Step 3: Update max_freq if needed
        if current_freq > self.max_freq:
            self.max_freq = current_freq

        # Step 4: Add val to the stack for its current frequency
        # If this frequency doesn't have a stack yet, create one
        if current_freq not in self.group:
            self.group[current_freq] = []
        self.group[current_freq].append(val)

    def pop(self) -> int:
        # Step 1: Get the stack for the current maximum frequency
        # This stack contains all values that have appeared max_freq times
        stack = self.group[self.max_freq]

        # Step 2: Pop the most recent value from this stack
        # This gives us the most recent value with frequency max_freq
        val = stack.pop()

        # Step 3: Update the frequency of the popped value
        self.freq[val] -= 1

        # Step 4: If the stack for current max_freq is now empty,
        # we need to decrease max_freq
        if not stack:
            # Remove the empty stack to save space (optional)
            del self.group[self.max_freq]
            # Decrease max_freq
            self.max_freq -= 1

        return val
```

```javascript
// Time: O(1) for both push and pop | Space: O(n) where n is number of elements
class FreqStack {
  constructor() {
    // freq maps each value to its current frequency
    this.freq = new Map();
    // group maps frequency to a stack of values with that frequency
    this.group = new Map();
    // Track the current maximum frequency
    this.maxFreq = 0;
  }

  push(val) {
    // Step 1: Update frequency of val
    // If val is new, set frequency to 1, otherwise increment
    const newFreq = (this.freq.get(val) || 0) + 1;
    this.freq.set(val, newFreq);

    // Step 2: Update maxFreq if needed
    if (newFreq > this.maxFreq) {
      this.maxFreq = newFreq;
    }

    // Step 3: Add val to the stack for its current frequency
    // If this frequency doesn't have a stack yet, create one
    if (!this.group.has(newFreq)) {
      this.group.set(newFreq, []);
    }
    this.group.get(newFreq).push(val);
  }

  pop() {
    // Step 1: Get the stack for the current maximum frequency
    // This stack contains all values that have appeared maxFreq times
    const stack = this.group.get(this.maxFreq);

    // Step 2: Pop the most recent value from this stack
    // This gives us the most recent value with frequency maxFreq
    const val = stack.pop();

    // Step 3: Update the frequency of the popped value
    this.freq.set(val, this.freq.get(val) - 1);

    // Step 4: If the stack for current maxFreq is now empty,
    // we need to decrease maxFreq
    if (stack.length === 0) {
      // Remove the empty stack to save space (optional)
      this.group.delete(this.maxFreq);
      // Decrease maxFreq
      this.maxFreq--;
    }

    return val;
  }
}
```

```java
// Time: O(1) for both push and pop | Space: O(n) where n is number of elements
class FreqStack {
    // freq maps each value to its current frequency
    private Map<Integer, Integer> freq;
    // group maps frequency to a stack of values with that frequency
    private Map<Integer, Stack<Integer>> group;
    // Track the current maximum frequency
    private int maxFreq;

    public FreqStack() {
        freq = new HashMap<>();
        group = new HashMap<>();
        maxFreq = 0;
    }

    public void push(int val) {
        // Step 1: Update frequency of val
        // If val is new, set frequency to 1, otherwise increment
        int newFreq = freq.getOrDefault(val, 0) + 1;
        freq.put(val, newFreq);

        // Step 2: Update maxFreq if needed
        if (newFreq > maxFreq) {
            maxFreq = newFreq;
        }

        // Step 3: Add val to the stack for its current frequency
        // If this frequency doesn't have a stack yet, create one
        group.putIfAbsent(newFreq, new Stack<>());
        group.get(newFreq).push(val);
    }

    public int pop() {
        // Step 1: Get the stack for the current maximum frequency
        // This stack contains all values that have appeared maxFreq times
        Stack<Integer> stack = group.get(maxFreq);

        // Step 2: Pop the most recent value from this stack
        // This gives us the most recent value with frequency maxFreq
        int val = stack.pop();

        // Step 3: Update the frequency of the popped value
        freq.put(val, freq.get(val) - 1);

        // Step 4: If the stack for current maxFreq is now empty,
        // we need to decrease maxFreq
        if (stack.isEmpty()) {
            // Remove the empty stack to save space (optional)
            group.remove(maxFreq);
            // Decrease maxFreq
            maxFreq--;
        }

        return val;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1) for both `push()` and `pop()`

- `push()`: We do a constant number of hash map operations (get, put, update)
- `pop()`: We do a constant number of hash map operations and stack operations
- All operations are O(1) on average for hash maps and stacks

**Space Complexity:** O(n) where n is the total number of elements pushed

- The `freq` map stores at most n entries (one per unique value)
- The `group` map stores all elements across different frequency stacks
- In the worst case, if all elements are unique, we have n entries in `freq` and n elements distributed across frequency stacks

## Common Mistakes

1. **Forgetting to update `maxFreq` when a frequency stack becomes empty**: This is crucial. After popping the last element from the current max frequency stack, you must decrement `maxFreq`. Otherwise, you'll try to access an empty or non-existent stack on the next pop.

2. **Not handling the "most recent among ties" correctly**: Some candidates try to use a single stack and track frequencies, but then struggle to find which of the max-frequency elements is most recent. The key insight is that by having separate stacks for each frequency level, the most recent element at each frequency is always at the top of that frequency's stack.

3. **Using a priority queue/heap incorrectly**: Some candidates think of using a max-heap ordered by frequency, but then struggle with how to break ties by recency. You'd need to store timestamps and update them, which makes operations O(log n) instead of O(1).

4. **Not decrementing frequency after pop**: Remember that when you pop an element, its frequency decreases by 1. If you forget this, the element might incorrectly stay in higher frequency stacks.

## When You'll See This Pattern

This "frequency grouping" pattern appears in several problems:

1. **LFU Cache (LeetCode 460)**: Similar concept of grouping by frequency, but with the additional complexity of cache eviction and O(1) operations. Both problems use the idea of organizing elements by frequency.

2. **Top K Frequent Elements (LeetCode 347)**: While solved differently (usually with bucket sort or heap), it also involves grouping elements by frequency. The bucket sort solution is conceptually similar to our frequency stacks.

3. **Design Twitter (LeetCode 355)**: This design problem combines multiple data structures (like we do here) to efficiently handle different types of operations.

The core pattern is: when you need to track elements by some metric (frequency, timestamp, priority) while maintaining order within each metric level, consider using a map of stacks or lists.

## Key Takeaways

1. **Group by metric, then maintain order**: When you need to track elements by some property (like frequency) while preserving insertion order within each group, use a map where keys are the property values and values are stacks or lists.

2. **Separate tracking from grouping**: Keep one data structure to track the current state of each element (like frequency map) and another to organize elements by that state (like frequency stacks). This separation of concerns makes the logic cleaner.

3. **Stacks naturally preserve recency**: When you need "most recent" behavior, stacks are your friend. By pushing to and popping from the end, you automatically get LIFO (Last-In-First-Out) behavior.

[Practice this problem on CodeJeet](/problem/maximum-frequency-stack)
