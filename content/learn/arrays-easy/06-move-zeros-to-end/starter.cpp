#include <iostream>
#include <vector>
using namespace std;

void moveZerosToEnd(vector<int>& a) {
    // TODO: move all zeros to the end of a in place, preserving non-zero order.
}

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    moveZerosToEnd(a);
    for (int i = 0; i < n; i++) {
        if (i) cout << " ";
        cout << a[i];
    }
    cout << "\n";
    return 0;
}
