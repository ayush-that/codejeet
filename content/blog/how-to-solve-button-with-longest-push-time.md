---
title: "How to Solve Button with Longest Push Time — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Button with Longest Push Time. Easy difficulty, 41.0% acceptance rate. Topics: Array."
date: "2029-01-20"
category: "dsa-patterns"
tags: ["button-with-longest-push-time", "array", "easy"]
---

# How to Solve Button with Longest Push Time

This problem asks us to find which button was pressed for the longest continuous duration. We're given a sorted sequence of button press events, and we need to track the time between consecutive presses of the same button to find the maximum duration. The tricky part is that we need to handle multiple buttons being pressed in sequence, and we only care about the time between when a button is pressed and when it's pressed again (or when the sequence ends).

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

```
events = [[0, 2], [1, 5], [0, 7], [2, 10], [1, 15]]
```

We need to track the last time each button was pressed:

1. **Event [0, 2]**: Button 0 pressed at time 2. This is the first time we see button 0, so we just record that it was last pressed at time 2.
2. **Event [1, 5]**: Button 1 pressed at time 5. First time for button 1, record last press at time 5.
3. **Event [0, 7]**: Button 0 pressed again at time 7. Now we can calculate the push duration: current time (7) - last press time (2) = 5. Update button 0's last press to 7.
4. **Event [2, 10]**: Button 2 pressed at time 10. First time for button 2, record last press at time 10.
5. **Event [1, 15]**: Button 1 pressed again at time 15. Calculate duration: 15 - 5 = 10. Update button 1's last press to 15.

After processing all events, we have:

- Button 0: duration 5
- Button 1: duration 10
- Button 2: no duration calculated (only pressed once)

But wait! We're missing something. What about buttons that were pressed but never pressed again? Their push continues until the end of the sequence. In our example, button 2 was last pressed at time 10, and there are no more events after time 15. So button 2's push lasted from time 10 until... well, we don't have an end time. Actually, the problem doesn't specify what to do in this case, but from the context, we should consider that a button remains pressed until another button is pressed or until the sequence ends.

Looking more carefully at the problem statement: we need to find the longest push time. A "push" starts when a button is pressed and ends when either:

1. The same button is pressed again (we calculate the duration between presses)
2. OR the sequence ends (we need to handle this case)

Actually, re-examining: the events represent button presses, not releases. So when button 0 is pressed at time 2 and then button 1 is pressed at time 5, button 0 was pressed for 3 seconds (from time 2 to time 5). Let me correct my understanding:

For the example `[[0, 2], [1, 5], [0, 7], [2, 10], [1, 15]]`:

1. Button 0 pressed at time 2
2. Button 1 pressed at time 5 → button 0 was pressed for 5-2 = 3 seconds
3. Button 0 pressed at time 7 → button 1 was pressed for 7-5 = 2 seconds
4. Button 2 pressed at time 10 → button 0 was pressed for 10-7 = 3 seconds
5. Button 1 pressed at time 15 → button 2 was pressed for 15-10 = 5 seconds

And at the end, button 1 is still pressed from time 15 onward, but with no end time, we can't calculate its duration.

Actually, I need to clarify: the problem says "the button at index indexi was pressed at time timei." It doesn't say buttons are released. So when a button is pressed, it might still be pressed when another button is pressed. We need to track which button is currently being pressed.

Let me trace through correctly:

1. At time 2: Button 0 starts being pressed
2. At time 5: Button 1 starts being pressed → Button 0 was pressed for 5-2 = 3 seconds
3. At time 7: Button 0 starts being pressed → Button 1 was pressed for 7-5 = 2 seconds
4. At time 10: Button 2 starts being pressed → Button 0 was pressed for 10-7 = 3 seconds
5. At time 15: Button 1 starts being pressed → Button 2 was pressed for 15-10 = 5 seconds

So we have durations: button 0: max(3, 3) = 3, button 1: 2, button 2: 5. The longest is 5 from button 2.

But what about the final button (button 1 at time 15)? It has no end time, so we can't calculate its duration. The problem likely expects us to only calculate durations between presses.

## Brute Force Approach

A brute force approach would be to:

1. For each button, find all times it was pressed
2. For each consecutive pair of press times for that button, calculate the duration
3. Track the maximum duration for each button
4. Find the button with the maximum duration

This would require:

- Grouping all events by button index (O(n) time and space)
- For each button with k presses, calculating k-1 durations
- Overall O(n) time but with extra space for grouping

However, there's a simpler brute force: for each event (except the last), look ahead to find the next event and calculate the duration if it's a different button. This would be O(n²) in worst case and is clearly inefficient.

The key insight is that we only need to track the currently pressed button and update durations when a different button is pressed. Since the events are sorted by time, we can process them sequentially.

## Optimal Solution

The optimal solution processes events in order, tracking:

1. The currently pressed button and when it was pressed
2. The maximum duration seen for each button

When we see a new event:

- If it's a different button than the current one, calculate how long the current button was pressed (current time - press start time)
- Update that button's maximum duration if this duration is longer
- Start pressing the new button at the current time

At the end, we find which button has the maximum duration.

<div class="code-group">

```python
# Time: O(n) | Space: O(k) where k is number of unique buttons
def buttonWithLongestPushTime(events):
    """
    Find the button with the longest continuous push time.

    Args:
        events: List of [button_index, time] pairs, sorted by time

    Returns:
        The index of the button with longest push time.
        If multiple buttons have the same longest time, return the smallest index.
    """
    # Dictionary to track the maximum duration for each button
    max_duration = {}

    # Track the currently pressed button and when it started being pressed
    current_button = events[0][0]
    start_time = events[0][1]

    # Process each event starting from the second one
    for i in range(1, len(events)):
        button, time = events[i]

        # Calculate how long the current button has been pressed
        duration = time - start_time

        # Update the maximum duration for the current button
        if current_button not in max_duration:
            max_duration[current_button] = duration
        else:
            max_duration[current_button] = max(max_duration[current_button], duration)

        # The new button starts being pressed now
        current_button = button
        start_time = time

    # Note: We don't calculate duration for the last button since there's no end time
    # The problem doesn't specify what to do with the final button, so we ignore it

    # Find the button with maximum duration
    result_button = -1
    max_dur = -1

    for button, duration in max_duration.items():
        if duration > max_dur or (duration == max_dur and button < result_button):
            max_dur = duration
            result_button = button

    return result_button
```

```javascript
// Time: O(n) | Space: O(k) where k is number of unique buttons
function buttonWithLongestPushTime(events) {
  /**
   * Find the button with the longest continuous push time.
   *
   * @param {number[][]} events - Array of [button_index, time] pairs, sorted by time
   * @return {number} The index of the button with longest push time.
   *                  If multiple buttons have the same longest time, return the smallest index.
   */

  // Map to track the maximum duration for each button
  const maxDuration = new Map();

  // Track the currently pressed button and when it started being pressed
  let currentButton = events[0][0];
  let startTime = events[0][1];

  // Process each event starting from the second one
  for (let i = 1; i < events.length; i++) {
    const [button, time] = events[i];

    // Calculate how long the current button has been pressed
    const duration = time - startTime;

    // Update the maximum duration for the current button
    if (!maxDuration.has(currentButton)) {
      maxDuration.set(currentButton, duration);
    } else {
      maxDuration.set(currentButton, Math.max(maxDuration.get(currentButton), duration));
    }

    // The new button starts being pressed now
    currentButton = button;
    startTime = time;
  }

  // Note: We don't calculate duration for the last button since there's no end time

  // Find the button with maximum duration
  let resultButton = -1;
  let maxDur = -1;

  for (const [button, duration] of maxDuration.entries()) {
    if (duration > maxDur || (duration === maxDur && button < resultButton)) {
      maxDur = duration;
      resultButton = button;
    }
  }

  return resultButton;
}
```

```java
// Time: O(n) | Space: O(k) where k is number of unique buttons
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int buttonWithLongestPushTime(int[][] events) {
        /**
         * Find the button with the longest continuous push time.
         *
         * @param events Array of [button_index, time] pairs, sorted by time
         * @return The index of the button with longest push time.
         *         If multiple buttons have the same longest time, return the smallest index.
         */

        // Map to track the maximum duration for each button
        Map<Integer, Integer> maxDuration = new HashMap<>();

        // Track the currently pressed button and when it started being pressed
        int currentButton = events[0][0];
        int startTime = events[0][1];

        // Process each event starting from the second one
        for (int i = 1; i < events.length; i++) {
            int button = events[i][0];
            int time = events[i][1];

            // Calculate how long the current button has been pressed
            int duration = time - startTime;

            // Update the maximum duration for the current button
            maxDuration.put(
                currentButton,
                Math.max(duration, maxDuration.getOrDefault(currentButton, 0))
            );

            // The new button starts being pressed now
            currentButton = button;
            startTime = time;
        }

        // Note: We don't calculate duration for the last button since there's no end time

        // Find the button with maximum duration
        int resultButton = -1;
        int maxDur = -1;

        for (Map.Entry<Integer, Integer> entry : maxDuration.entrySet()) {
            int button = entry.getKey();
            int duration = entry.getValue();

            if (duration > maxDur || (duration == maxDur && button < resultButton)) {
                maxDur = duration;
                resultButton = button;
            }
        }

        return resultButton;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the number of events. We process each event exactly once in a single pass through the array. For each event, we do constant-time operations: calculating duration, updating the map, and updating tracking variables.

**Space Complexity:** O(k), where k is the number of unique buttons. In the worst case, if every event is for a different button, k could be O(n). However, typically k is much smaller than n. We use a hash map to store the maximum duration for each button that has been pressed at least once (except possibly the last button).

## Common Mistakes

1. **Forgetting to handle the tie-breaker condition**: The problem states that if multiple buttons have the same longest push time, we should return the smallest index. Candidates often return the first maximum they find without checking if there's a smaller index with the same duration.

2. **Incorrect duration calculation for consecutive presses of the same button**: Some candidates mistakenly calculate duration between presses of the same button instead of recognizing that when the same button is pressed again, it means the button was continuously pressed from the previous press time to the current time.

3. **Not initializing tracking variables properly**: The algorithm needs to track the current button and its start time. Forgetting to initialize these with the first event or resetting them incorrectly can lead to wrong calculations.

4. **Trying to calculate duration for the last button**: The last button in the sequence has no end time (unless we consider some implicit end). The problem doesn't specify what happens after the last event, so we shouldn't calculate a duration for it. Some candidates try to use the last event time or add a dummy event, which isn't necessary.

## When You'll See This Pattern

This pattern of processing sorted events and tracking state changes appears in several problems:

1. **Meeting Rooms II (LeetCode 253)**: Similar to tracking when meetings start and end to find maximum concurrent meetings. Instead of button presses, we track meeting start and end times.

2. **Car Pooling (LeetCode 1094)**: Tracking passengers getting on and off at different stops to ensure capacity isn't exceeded. The core idea is processing events in sorted order and maintaining current state.

3. **Merge Intervals (LeetCode 56)**: While not identical, it involves processing sorted intervals and tracking overlaps, which requires similar state management.

The key pattern is: when you have time-ordered events and need to track some state (which button is pressed, how many meetings are active, how many passengers are in the car), process events in order and update your state at each event.

## Key Takeaways

1. **Sorted events enable single-pass solutions**: When input is sorted by time, you can often solve problems with O(n) time complexity by processing events in order and maintaining current state.

2. **State tracking is crucial for event-based problems**: Keep track of what's currently active (which button is pressed, how many meetings are happening, etc.) and update at each event boundary.

3. **Edge cases matter**: Always consider the first event, last event, empty input, single event, and tie-breaking conditions. These often reveal flaws in the algorithm logic.

[Practice this problem on CodeJeet](/problem/button-with-longest-push-time)
