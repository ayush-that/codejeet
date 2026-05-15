def left_rotate_by_one(a):
    # TODO: rotate a left by one position in place.
    pass


n = int(input())
a = list(map(int, input().split())) if n > 0 else []
left_rotate_by_one(a)
print(" ".join(str(x) for x in a))
