---
title: "How to Solve Basic Calculator IV — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Basic Calculator IV. Hard difficulty, 49.7% acceptance rate. Topics: Hash Table, Math, String, Stack, Recursion."
date: "2030-02-10"
category: "dsa-patterns"
tags: ["basic-calculator-iv", "hash-table", "math", "string", "hard"]
---

# How to Solve Basic Calculator IV

This problem asks us to parse and simplify algebraic expressions with variables, constants, and basic arithmetic operations (addition, subtraction, multiplication). Given an expression string and optional variable substitutions, we need to output the simplified terms in a specific format. What makes this problem challenging is that it combines multiple concepts: expression parsing, polynomial manipulation, and careful handling of edge cases.

## Visual Walkthrough

Let's trace through a small example: `expression = "e + 8 - a + 5"`, `evalvars = ["e"]`, `evalints = [1]`.

1. **Parse the expression**: We need to break it down into tokens and handle operator precedence (multiplication before addition/subtraction).

2. **Substitute known values**: We have `e = 1`, so we replace `e` with `1`.

3. **Simplify the expression**: After substitution: `1 + 8 - a + 5` → `(1 + 8 + 5) - a` → `14 - a`

4. **Format the output**: We need to output terms in descending order of degree, then lexicographically:
   - `-a` has degree 1 (one variable)
   - `14` has degree 0 (constant)
   - So we output `["-1*a","14"]` (note the coefficient -1 for `a`)

The tricky part is handling multiplication: if we had `"a * b * 2 + a * c"`, we'd need to combine like terms and sort them properly.

## Brute Force Approach

A naive approach might try to:

1. Parse the expression into tokens
2. Convert to postfix notation (Reverse Polish Notation)
3. Evaluate with substitution
4. Try to reconstruct the expression

However, this fails because:

- We can't fully evaluate expressions with unknown variables
- Multiplication creates terms with multiple variables that need to be combined
- Sorting requirements are complex (degree first, then lexicographic)

The brute force approach would involve manually tracking all possible terms and their coefficients, which quickly becomes messy and error-prone. A better approach uses systematic polynomial representation.

## Optimized Approach

The key insight is to **represent each term as a polynomial** where:

- Each term is a map from variable list to coefficient
- Variables in each term are sorted (for easy comparison)
- Constants are terms with empty variable list

**Step-by-step reasoning:**

1. **Parse with operator precedence**: Use two stacks (values and operators) similar to Basic Calculator problems. Handle multiplication immediately since it has higher precedence.

2. **Represent terms as (coefficient, variables)**:
   - `5` → `(5, [])`
   - `a` → `(1, ["a"])`
   - `-3*a*b` → `(-3, ["a", "b"])`

3. **Perform operations**:
   - **Addition/Subtraction**: Merge terms with same variables
   - **Multiplication**: Multiply coefficients and concatenate+sort variables

4. **Substitute known values**: Replace variables with their values before final simplification

5. **Sort and format**: Sort by degree (variable count) descending, then lexicographically by variable names

This approach cleanly separates parsing from polynomial manipulation, making the logic much clearer.

## Optimal Solution

Here's the complete solution implementing the polynomial approach:

<div class="code-group">

```python
# Time: O(n^2 * m) where n is expression length, m is number of terms
# Space: O(n + m) for stacks and term storage
class Solution:
    def basicCalculatorIV(self, expression: str, evalvars: List[str], evalints: List[int]) -> List[str]:
        # Step 1: Create substitution map from evalvars to evalints
        env = {var: val for var, val in zip(evalvars, evalints)}

        # Step 2: Parse tokens from expression
        tokens = self.parse(expression)

        # Step 3: Convert tokens to polynomial terms using shunting-yard algorithm
        terms = self.evaluate(tokens, env)

        # Step 4: Sort terms by degree (descending) then lexicographically
        sorted_terms = sorted(terms.items(), key=lambda x: (-len(x[0]), x[0]))

        # Step 5: Format output, skipping zero coefficients
        result = []
        for vars_list, coeff in sorted_terms:
            if coeff == 0:
                continue
            if not vars_list:  # Constant term
                result.append(str(coeff))
            else:
                result.append(str(coeff) + "*" + "*".join(vars_list))
        return result

    def parse(self, expression: str) -> List[str]:
        """Convert expression string to tokens."""
        tokens = []
        i = 0
        while i < len(expression):
            if expression[i] == ' ':
                i += 1
                continue
            if expression[i] in '()+-*':
                tokens.append(expression[i])
                i += 1
            else:
                # Parse variable names or numbers
                j = i
                while j < len(expression) and expression[j] not in ' ()+-*':
                    j += 1
                tokens.append(expression[i:j])
                i = j
        return tokens

    def evaluate(self, tokens: List[str], env: dict) -> dict:
        """Evaluate tokens to polynomial terms."""
        # Terms are stored as {tuple(vars): coefficient}
        # e.g., {"a": 1, "b": 2} -> (("a", "b"), -3) for -3*a*b

        def multiply(terms1, terms2):
            """Multiply two polynomials."""
            result = {}
            for vars1, coeff1 in terms1.items():
                for vars2, coeff2 in terms2.items():
                    # Combine variables and sort
                    new_vars = tuple(sorted(vars1 + vars2))
                    result[new_vars] = result.get(new_vars, 0) + coeff1 * coeff2
            return result

        def add(terms1, terms2, sign=1):
            """Add two polynomials with optional sign."""
            result = terms1.copy()
            for vars_list, coeff in terms2.items():
                result[vars_list] = result.get(vars_list, 0) + sign * coeff
            return result

        # Stacks for values and operators
        values = []
        ops = []
        i = 0

        while i < len(tokens):
            token = tokens[i]
            if token == '(':
                ops.append(token)
            elif token == ')':
                while ops and ops[-1] != '(':
                    # Process operator
                    op = ops.pop()
                    val2 = values.pop()
                    val1 = values.pop()
                    if op == '+':
                        values.append(add(val1, val2))
                    elif op == '-':
                        values.append(add(val1, val2, -1))
                    else:  # '*'
                        values.append(multiply(val1, val2))
                ops.pop()  # Remove '('
            elif token in '+-*':
                # Handle operator precedence: * before +/-
                while ops and self.precedence(ops[-1]) >= self.precedence(token):
                    op = ops.pop()
                    val2 = values.pop()
                    val1 = values.pop()
                    if op == '+':
                        values.append(add(val1, val2))
                    elif op == '-':
                        values.append(add(val1, val2, -1))
                    else:  # '*'
                        values.append(multiply(val1, val2))
                ops.append(token)
            else:
                # Token is a variable or number
                if token.isdigit() or (token[0] == '-' and token[1:].isdigit()):
                    coeff = int(token)
                    values.append({tuple(): coeff})  # Constant term
                else:
                    # Check if variable has known value
                    if token in env:
                        values.append({tuple(): env[token]})
                    else:
                        values.append({(token,): 1})  # Variable with coefficient 1
            i += 1

        # Process remaining operators
        while ops:
            op = ops.pop()
            val2 = values.pop()
            val1 = values.pop()
            if op == '+':
                values.append(add(val1, val2))
            elif op == '-':
                values.append(add(val1, val2, -1))
            else:  # '*'
                values.append(multiply(val1, val2))

        return values[0] if values else {}

    def precedence(self, op: str) -> int:
        """Return operator precedence."""
        if op in '+-':
            return 1
        if op == '*':
            return 2
        return 0
```

```javascript
// Time: O(n^2 * m) where n is expression length, m is number of terms
// Space: O(n + m) for stacks and term storage
var basicCalculatorIV = function (expression, evalvars, evalints) {
  // Step 1: Create substitution map
  const env = {};
  for (let i = 0; i < evalvars.length; i++) {
    env[evalvars[i]] = evalints[i];
  }

  // Step 2: Parse tokens
  const tokens = parse(expression);

  // Step 3: Evaluate to polynomial terms
  const terms = evaluate(tokens, env);

  // Step 4: Sort terms
  const sortedEntries = Object.entries(terms)
    .filter(([_, coeff]) => coeff !== 0)
    .sort((a, b) => {
      const varsA = a[0] ? a[0].split(",") : [];
      const varsB = b[0] ? b[0].split(",") : [];
      if (varsA.length !== varsB.length) {
        return varsB.length - varsA.length; // Descending by degree
      }
      // Lexicographic comparison
      for (let i = 0; i < Math.min(varsA.length, varsB.length); i++) {
        if (varsA[i] !== varsB[i]) {
          return varsA[i].localeCompare(varsB[i]);
        }
      }
      return 0;
    });

  // Step 5: Format output
  const result = [];
  for (const [varsStr, coeff] of sortedEntries) {
    if (coeff === 0) continue;
    const vars = varsStr ? varsStr.split(",") : [];
    if (vars.length === 0) {
      result.push(coeff.toString());
    } else {
      result.push(coeff + "*" + vars.join("*"));
    }
  }
  return result;

  function parse(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      if (expr[i] === " ") {
        i++;
        continue;
      }
      if ("()+-*".includes(expr[i])) {
        tokens.push(expr[i]);
        i++;
      } else {
        let j = i;
        while (j < expr.length && !" ()+-*".includes(expr[j])) {
          j++;
        }
        tokens.push(expr.substring(i, j));
        i = j;
      }
    }
    return tokens;
  }

  function evaluate(tokens, env) {
    function multiply(terms1, terms2) {
      const result = {};
      for (const [vars1, coeff1] of Object.entries(terms1)) {
        for (const [vars2, coeff2] of Object.entries(terms2)) {
          const varsA = vars1 ? vars1.split(",") : [];
          const varsB = vars2 ? vars2.split(",") : [];
          const newVars = [...varsA, ...varsB].sort();
          const key = newVars.join(",");
          result[key] = (result[key] || 0) + coeff1 * coeff2;
        }
      }
      return result;
    }

    function add(terms1, terms2, sign = 1) {
      const result = { ...terms1 };
      for (const [vars, coeff] of Object.entries(terms2)) {
        result[vars] = (result[vars] || 0) + sign * coeff;
      }
      return result;
    }

    function precedence(op) {
      if (op === "+" || op === "-") return 1;
      if (op === "*") return 2;
      return 0;
    }

    const values = [];
    const ops = [];
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];
      if (token === "(") {
        ops.push(token);
      } else if (token === ")") {
        while (ops.length && ops[ops.length - 1] !== "(") {
          const op = ops.pop();
          const val2 = values.pop();
          const val1 = values.pop();
          if (op === "+") {
            values.push(add(val1, val2));
          } else if (op === "-") {
            values.push(add(val1, val2, -1));
          } else {
            // '*'
            values.push(multiply(val1, val2));
          }
        }
        ops.pop(); // Remove '('
      } else if ("+-*".includes(token)) {
        while (ops.length && precedence(ops[ops.length - 1]) >= precedence(token)) {
          const op = ops.pop();
          const val2 = values.pop();
          const val1 = values.pop();
          if (op === "+") {
            values.push(add(val1, val2));
          } else if (op === "-") {
            values.push(add(val1, val2, -1));
          } else {
            // '*'
            values.push(multiply(val1, val2));
          }
        }
        ops.push(token);
      } else {
        // Token is variable or number
        if (/^-?\d+$/.test(token)) {
          const coeff = parseInt(token);
          values.push({ "": coeff }); // Constant term
        } else {
          if (env.hasOwnProperty(token)) {
            values.push({ "": env[token] });
          } else {
            const key = token;
            values.push({ [key]: 1 });
          }
        }
      }
      i++;
    }

    while (ops.length) {
      const op = ops.pop();
      const val2 = values.pop();
      const val1 = values.pop();
      if (op === "+") {
        values.push(add(val1, val2));
      } else if (op === "-") {
        values.push(add(val1, val2, -1));
      } else {
        // '*'
        values.push(multiply(val1, val2));
      }
    }

    return values[0] || {};
  }
};
```

```java
// Time: O(n^2 * m) where n is expression length, m is number of terms
// Space: O(n + m) for stacks and term storage
class Solution {
    public List<String> basicCalculatorIV(String expression, String[] evalvars, int[] evalints) {
        // Step 1: Create substitution map
        Map<String, Integer> env = new HashMap<>();
        for (int i = 0; i < evalvars.length; i++) {
            env.put(evalvars[i], evalints[i]);
        }

        // Step 2: Parse tokens
        List<String> tokens = parse(expression);

        // Step 3: Evaluate to polynomial terms
        Map<List<String>, Integer> terms = evaluate(tokens, env);

        // Step 4: Sort terms
        List<List<String>> sortedVars = new ArrayList<>(terms.keySet());
        sortedVars.sort((a, b) -> {
            if (a.size() != b.size()) {
                return b.size() - a.size(); // Descending by degree
            }
            // Lexicographic comparison
            for (int i = 0; i < Math.min(a.size(), b.size()); i++) {
                int cmp = a.get(i).compareTo(b.get(i));
                if (cmp != 0) return cmp;
            }
            return 0;
        });

        // Step 5: Format output
        List<String> result = new ArrayList<>();
        for (List<String> vars : sortedVars) {
            int coeff = terms.get(vars);
            if (coeff == 0) continue;
            if (vars.isEmpty()) {
                result.add(String.valueOf(coeff));
            } else {
                StringBuilder sb = new StringBuilder();
                sb.append(coeff).append("*");
                for (int i = 0; i < vars.size(); i++) {
                    if (i > 0) sb.append("*");
                    sb.append(vars.get(i));
                }
                result.add(sb.toString());
            }
        }
        return result;
    }

    private List<String> parse(String expression) {
        List<String> tokens = new ArrayList<>();
        int i = 0;
        while (i < expression.length()) {
            char c = expression.charAt(i);
            if (c == ' ') {
                i++;
                continue;
            }
            if (c == '(' || c == ')' || c == '+' || c == '-' || c == '*') {
                tokens.add(String.valueOf(c));
                i++;
            } else {
                int j = i;
                while (j < expression.length() &&
                       expression.charAt(j) != ' ' &&
                       expression.charAt(j) != '(' &&
                       expression.charAt(j) != ')' &&
                       expression.charAt(j) != '+' &&
                       expression.charAt(j) != '-' &&
                       expression.charAt(j) != '*') {
                    j++;
                }
                tokens.add(expression.substring(i, j));
                i = j;
            }
        }
        return tokens;
    }

    private Map<List<String>, Integer> evaluate(List<String> tokens, Map<String, Integer> env) {
        // Helper functions for polynomial operations
        Map<List<String>, Integer> multiply(Map<List<String>, Integer> terms1,
                                           Map<List<String>, Integer> terms2) {
            Map<List<String>, Integer> result = new HashMap<>();
            for (Map.Entry<List<String>, Integer> e1 : terms1.entrySet()) {
                for (Map.Entry<List<String>, Integer> e2 : terms2.entrySet()) {
                    List<String> newVars = new ArrayList<>(e1.getKey());
                    newVars.addAll(e2.getKey());
                    Collections.sort(newVars);
                    int newCoeff = e1.getValue() * e2.getValue();
                    result.put(newVars, result.getOrDefault(newVars, 0) + newCoeff);
                }
            }
            return result;
        }

        Map<List<String>, Integer> add(Map<List<String>, Integer> terms1,
                                      Map<List<String>, Integer> terms2,
                                      int sign) {
            Map<List<String>, Integer> result = new HashMap<>(terms1);
            for (Map.Entry<List<String>, Integer> e : terms2.entrySet()) {
                List<String> vars = e.getKey();
                int coeff = e.getValue();
                result.put(vars, result.getOrDefault(vars, 0) + sign * coeff);
            }
            return result;
        }

        // Shunting-yard algorithm implementation
        Stack<Map<List<String>, Integer>> values = new Stack<>();
        Stack<Character> ops = new Stack<>();
        int i = 0;

        while (i < tokens.size()) {
            String token = tokens.get(i);
            if (token.equals("(")) {
                ops.push('(');
            } else if (token.equals(")")) {
                while (!ops.isEmpty() && ops.peek() != '(') {
                    char op = ops.pop();
                    Map<List<String>, Integer> val2 = values.pop();
                    Map<List<String>, Integer> val1 = values.pop();
                    if (op == '+') {
                        values.push(add(val1, val2, 1));
                    } else if (op == '-') {
                        values.push(add(val1, val2, -1));
                    } else { // '*'
                        values.push(multiply(val1, val2));
                    }
                }
                ops.pop(); // Remove '('
            } else if (token.equals("+") || token.equals("-") || token.equals("*")) {
                char currOp = token.charAt(0);
                while (!ops.isEmpty() && precedence(ops.peek()) >= precedence(currOp)) {
                    char op = ops.pop();
                    Map<List<String>, Integer> val2 = values.pop();
                    Map<List<String>, Integer> val1 = values.pop();
                    if (op == '+') {
                        values.push(add(val1, val2, 1));
                    } else if (op == '-') {
                        values.push(add(val1, val2, -1));
                    } else { // '*'
                        values.push(multiply(val1, val2));
                    }
                }
                ops.push(currOp);
            } else {
                // Token is variable or number
                if (token.matches("-?\\d+")) {
                    int coeff = Integer.parseInt(token);
                    Map<List<String>, Integer> term = new HashMap<>();
                    term.put(new ArrayList<>(), coeff);
                    values.push(term);
                } else {
                    if (env.containsKey(token)) {
                        Map<List<String>, Integer> term = new HashMap<>();
                        term.put(new ArrayList<>(), env.get(token));
                        values.push(term);
                    } else {
                        Map<List<String>, Integer> term = new HashMap<>();
                        List<String> vars = new ArrayList<>();
                        vars.add(token);
                        term.put(vars, 1);
                        values.push(term);
                    }
                }
            }
            i++;
        }

        while (!ops.isEmpty()) {
            char op = ops.pop();
            Map<List<String>, Integer> val2 = values.pop();
            Map<List<String>, Integer> val1 = values.pop();
            if (op == '+') {
                values.push(add(val1, val2, 1));
            } else if (op == '-') {
                values.push(add(val1, val2, -1));
            } else { // '*'
                values.push(multiply(val1, val2));
            }
        }

        return values.isEmpty() ? new HashMap<>() : values.pop();
    }

    private int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*') return 2;
        return 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² \* m) where:

- `n` is the length of the expression
- `m` is the number of unique terms in the polynomial

The quadratic factor comes from:

1. Parsing tokens: O(n)
2. Polynomial multiplication: In worst case, each multiplication combines all existing terms, potentially O(m²) per multiplication
3. Since m can be O(n) in worst case, overall O(n² \* m)

**Space Complexity:** O(n + m) where:

- O(n) for the token list and stacks during parsing
- O(m) for storing the polynomial terms

## Common Mistakes

1. **Not handling operator precedence correctly**: Forgetting that multiplication has higher precedence than addition/subtraction. Always use the shunting-yard algorithm or similar approach.

2. **Incorrect term combination**: Failing to properly combine like terms after multiplication. Remember that `a*b` and `b*a` are the same term and should be combined.

3. **Wrong sorting order**: The output must be sorted by:
   - Degree (number of variables) descending
   - Lexicographic order for same degree
     Many candidates forget one of these requirements.

4. **Not handling negative coefficients properly**: When formatting output, `-1*a` should be output as `-1*a` not `-a`, even though mathematically they're equivalent.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Expression parsing with operator precedence**: Used in Basic Calculator I, II, III and Parse Lisp Expression. The shunting-yard algorithm is key here.

2. **Polynomial manipulation**: Similar to problems that require symbolic computation or algebra simplification.

3. **Map-based term representation**: Useful when you need to group items by certain characteristics, like Group Anagrams or Design Underground System.

Related problems: [Parse Lisp Expression](/problem/parse-lisp-expression), [Basic Calculator III](/problem/basic-calculator-iii)

## Key Takeaways

1. **Represent complex data appropriately**: Using maps to represent polynomials makes operations like addition and multiplication much cleaner than trying to manipulate strings directly.

2. **Separate parsing from computation**: First parse the expression into a structured form (tokens or AST), then perform operations on that structure. This makes the code more maintainable and less error-prone.

3. **Operator precedence matters**: For expression evaluation problems, always consider operator precedence. The shunting-yard algorithm is a reliable approach that handles parentheses and precedence correctly.

Related problems: [Parse Lisp Expression](/problem/parse-lisp-expression), [Basic Calculator III](/problem/basic-calculator-iii)
