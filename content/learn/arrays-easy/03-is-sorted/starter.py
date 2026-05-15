def is_sorted(a):
    # TODO: return True iff a is non-decreasing.
    return False


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
print("true" if is_sorted(a) else "false")
