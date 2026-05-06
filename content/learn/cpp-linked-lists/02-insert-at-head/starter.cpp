#include <iostream>
using namespace std;

struct Node {
  int data;
  Node* next;
  Node(int value) : data(value), next(nullptr) {}
};

class LinkedList {
 public:
  Node* head;
  Node* tail;

  LinkedList() : head(nullptr), tail(nullptr) {}

  ~LinkedList() {
    while (head != nullptr) {
      Node* nextNode = head->next;
      delete head;
      head = nextNode;
    }
  }

  // TODO: implement insertAtHead. Pushing 1, 2, 3 should give the list
  //       3 -> 2 -> 1 -> nullptr (LIFO order).
  // hint: save the old head, point the new node's next at it, then move
  //       head onto the new node. Don't forget to set tail when the list
  //       is empty.
  void insertAtHead(int value) {
    // your code here
  }

  void print() const {
    Node* current = head;
    while (current != nullptr) {
      cout << current->data;
      if (current->next != nullptr) cout << " ";
      current = current->next;
    }
    cout << "\n";
  }
};

int main() {
  LinkedList list;
  int value;
  while (cin >> value) {
    if (value == -1) break;
    list.insertAtHead(value);
  }
  list.print();
  return 0;
}
