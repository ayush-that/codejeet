---
title: "Medium Capital One Interview Questions: Strategy Guide"
description: "How to tackle 36 medium difficulty questions from Capital One — patterns, time targets, and practice tips."
date: "2032-08-09"
category: "tips"
tags: ["capital-one", "medium", "interview prep"]
---

Capital One's Medium interview questions represent the core of their technical assessment. While Easy problems test basic competency, Medium questions determine whether you can handle the type of work you'll actually do. At Capital One, Medium problems often involve **data transformation, business logic simulation, and string/array manipulation with one or two conceptual twists.** The key differentiator from Easy problems isn't raw algorithmic complexity (you won't find many advanced graph or DP problems here), but rather the need to manage multiple steps, maintain state correctly, and handle edge cases that mirror real-world financial data scenarios—like invalid transactions, account validation, or date parsing.

## Common Patterns and Templates

Capital One's Medium questions heavily favor **iterative processing with hash maps and arrays.** You'll frequently see problems where you need to:

1. Process a list of transactions or records
2. Group or filter them based on multiple conditions
3. Transform or aggregate the results

The most common template involves **sorting followed by a single pass with state tracking.** Here's the foundational pattern:

<div class="code-group">

```python
# Template: Sort + Single Pass with State Tracking
# Common in Capital One Medium problems like "Invalid Transactions" (#1169)
def process_records(records):
    """
    Process financial records with time-based constraints.
    """
    # 1. Often need to enrich data with original indices
    enriched = [(record, i) for i, record in enumerate(records)]

    # 2. Sort by primary key (often time or amount)
    enriched.sort(key=lambda x: x[0].time)  # Example sort

    # 3. Single pass with state
    result = []
    active_transactions = {}  # State tracking

    for record, original_idx in enriched:
        # Business logic checks
        if is_invalid(record, active_transactions):
            result.append(original_idx)  # Or transformed data

        # Update state for future iterations
        update_state(active_transactions, record)

    # 4. May need to transform result back to original order
    result.sort()  # If returning indices
    return [records[i] for i in result]  # If returning records

# Time: O(n log n) for sort + O(n) for pass = O(n log n)
# Space: O(n) for enriched data and state tracking
```

```javascript
// Template: Sort + Single Pass with State Tracking
function processRecords(records) {
  // 1. Enrich with indices
  const enriched = records.map((record, idx) => ({ record, idx }));

  // 2. Sort by key property
  enriched.sort((a, b) => a.record.time - b.record.time);

  // 3. Single pass with state
  const result = [];
  const activeTransactions = new Map();

  for (const { record, idx } of enriched) {
    if (isInvalid(record, activeTransactions)) {
      result.push(idx);
    }
    updateState(activeTransactions, record);
  }

  // 4. Return in required format
  result.sort((a, b) => a - b);
  return result.map((idx) => records[idx]);
}
// Time: O(n log n) | Space: O(n)
```

```java
// Template: Sort + Single Pass with State Tracking
public List<String> processRecords(List<String> records) {
    // 1. Create indexed objects
    class RecordWithIndex {
        String record;
        int index;
        RecordWithIndex(String r, int i) { record = r; index = i; }
    }

    List<RecordWithIndex> enriched = new ArrayList<>();
    for (int i = 0; i < records.size(); i++) {
        enriched.add(new RecordWithIndex(records.get(i), i));
    }

    // 2. Sort by parsed criteria
    enriched.sort((a, b) -> parseTime(a.record) - parseTime(b.record));

    // 3. Single pass
    List<Integer> resultIndices = new ArrayList<>();
    Map<String, Integer> state = new HashMap<>();

    for (RecordWithIndex item : enriched) {
        if (isInvalid(item.record, state)) {
            resultIndices.add(item.index);
        }
        updateState(state, item.record);
    }

    // 4. Format output
    Collections.sort(resultIndices);
    List<String> result = new ArrayList<>();
    for (int idx : resultIndices) {
        result.add(records.get(idx));
    }
    return result;
}
// Time: O(n log n) | Space: O(n)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Capital One Medium problem, you should aim to:

- **5-7 minutes:** Understand the problem, ask clarifying questions, and outline your approach
- **10-15 minutes:** Write clean, working code with proper variable names
- **3-5 minutes:** Test with edge cases and discuss optimizations

Beyond correctness, interviewers watch for:

1. **Business logic translation:** Can you turn vague requirements into precise conditions? (e.g., "transactions within 60 minutes" → `abs(time1 - time2) <= 60`)
2. **Data modeling choices:** Do you create appropriate data structures? Using a class/object for transaction data is better than parallel arrays.
3. **Edge case proactivity:** Mention timezone issues (though not required to solve), negative amounts, empty inputs, and duplicate records before being asked.
4. **Code readability:** Capital One engineers maintain financial systems—they value code that other engineers can understand six months later.

## Key Differences from Easy Problems

Easy problems at Capital One typically require:

- Single-pass solutions (O(n) time, O(1) space)
- Basic string/array manipulation
- Straightforward condition checks

Medium problems introduce:

1. **Multiple constraints:** Instead of "find all transactions above $1000," it's "find transactions above $1000 _AND_ within 60 minutes of another same-city transaction."
2. **State maintenance:** You need to track previous transactions in a data structure, not just process each item independently.
3. **Sorting requirements:** Many solutions become O(n log n) because you need chronological or categorical ordering.
4. **Output transformation:** The result might need re-sorting or mapping back to original indices.

The mindset shift: **Think in transactions, not just algorithms.** Imagine you're actually writing production code for their banking systems.

## Specific Patterns for Medium

**Pattern 1: Time-Window Grouping** (LeetCode #1169 - Invalid Transactions)
Problems where transactions within a time window affect each other. Solution: sort by time, use sliding window or hash map tracking recent transactions.

**Pattern 2: Multi-Field Validation** (Similar to LeetCode #1366 - Rank Teams by Votes)
Validation across multiple dimensions (amount, time, location, name). Solution: create transaction objects, filter with compound conditions.

**Pattern 3: Stepwise String Building** (Similar to LeetCode #394 - Decode String)
Building financial identifiers or account numbers with rules. Solution: iterative parsing with stack or pointer tracking.

<div class="code-group">

```python
# Pattern 2 Example: Multi-Field Validation
def find_invalid_transactions(transactions):
    invalid = []
    trans_objects = []

    # Parse into structured data
    for i, t in enumerate(transactions):
        name, time, amount, city = t.split(',')
        trans_objects.append({
            'name': name,
            'time': int(time),
            'amount': int(amount),
            'city': city,
            'original': t,
            'index': i
        })

    # Sort by time for time-window checks
    trans_objects.sort(key=lambda x: x['time'])

    # Check each transaction against others in window
    for i, t in enumerate(trans_objects):
        if t['amount'] > 1000:
            invalid.append(t['original'])
            continue

        # Check surrounding transactions in time window
        j = i - 1
        while j >= 0 and t['time'] - trans_objects[j]['time'] <= 60:
            if (trans_objects[j]['name'] == t['name'] and
                trans_objects[j]['city'] != t['city']):
                invalid.append(t['original'])
                break
            j -= 1

    return invalid
# Time: O(n log n + n^2) in worst case, but typically O(n log n + n*k) where k is window size
# Space: O(n)
```

</div>

## Practice Strategy

1. **Start with the classics:** Solve #1169 (Invalid Transactions) and #1481 (Least Number of Unique Integers after K Removals)—these embody Capital One's style.

2. **Daily target:** 2-3 Medium problems with 30 minutes each. Spend the first 5 minutes planning without coding.

3. **Progressive ordering:**
   - Week 1: String/array manipulation with constraints
   - Week 2: Hash map grouping problems
   - Week 3: Sorting-based solutions
   - Week 4: Mixed practice under time pressure

4. **Capital One specificity:** When practicing, ask yourself: "Could this logic validate a financial transaction?" If yes, you're on the right track.

5. **Mock interview focus:** Practice explaining your thought process aloud, especially when translating business rules to code conditions.

Remember: Capital One's Medium questions test whether you can write **maintainable, business-logic code** more than whether you know esoteric algorithms. Your solution should look like code you'd actually commit to their repositories.

[Practice Medium Capital One questions](/company/capital-one/medium)
