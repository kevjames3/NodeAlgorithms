var chalk = require('chalk');

//Let's override some functionality to make my life easier.
//From http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

exports.RedBlackTree = function(userCompareFunction) {
    //Init
    var self = this;
    var rootNode;
    var compareFunction = function(val1, val2) {
        return val1 - val2;
    }

    if (userCompareFunction) {
        compareFunction = userCompareFunction;
    }

    //////////////////
    //Private
    //////////////////

    function Node(value) {
        var self = this;
        var left = undefined;
        var right = undefined;
        var parent = undefined;

        self.ValidColors = {
            Red: "red",
            Black: "grey"
        };

        self.Color = self.ValidColors.Red;
        self.Value = value;
        self.NilNode = false;

        self.IsLeftChild = function() {
            var result = false;
            if (parent != undefined && parent.Left() == self) {
                result = true;
            }
            return result;
        }

        self.IsRightChild = function() {
            var result = false;
            if ((parent != undefined && parent.Right() == self)) {
                result = true;
            }
            return result;
        }

        self.Grandparent = function() {
            var result = undefined;
            if (parent != undefined) {
                result = parent.Parent();
            }
            return result;
        }

        self.Uncle = function() {
            var result = undefined;
            if (self.IsRightChild()) {
                if (self.Grandparent() != undefined) {
                    result = self.Grandparent().Left();
                    if (result == undefined) {
                        result = new Node();
                    }
                }
            } else if (self.IsLeftChild()) {
                if (self.Grandparent() != undefined) {
                    result = self.Grandparent().Right();
                }
            }
            return result;
        }

        self.SwapColors = function() {
            if (self.Color == self.ValidColors.Red) {
                self.Color = self.ValidColors.Black;
            } else {
                self.Color = self.ValidColors.Red;
            }
        }

        //Insert as left node and have node refer to self as parent
        self.Left = function(node) {
            if (node && !node.NilNode) {
                left = node;
                node.Parent(self);
            }

            var result = undefined;
            if (left != undefined) {
                result = left;
            } else {
                result = new Node();
                result.Value = undefined;
                result.Color = self.ValidColors.Black;
                result.Parent(self);
                result.NilNode = true;

                left = result;
            }

            return result;
        }

        //Insert as right node and have node refer to self as parent
        self.Right = function(node) {
            if (node && !node.NilNode) {
                right = node;
                node.Parent(self);
            }

            var result = undefined;
            if (right != undefined) {
                result = right;
            } else {
                result = new Node();
                result.Value = undefined;
                result.Parent(self);
                result.Color = self.ValidColors.Black;
                result.NilNode = true;

                right = result;
            }

            return result;
        }

        self.Parent = function(node) {
            if (node) {
                parent = node;
            }
            return parent;
        };

        self.Sibling = function() {
            var result = undefined;
            if (self.IsRightChild()) {
                result = self.Parent().Left();
            } else if (self.IsLeftChild()) {
                result = self.Parent().Right();
            }
            return result;
        }

        self.RemoveParent = function() {
            if (self.IsRightChild()) {
                self.Parent().RemoveRight();
            } else if (self.IsLeftChild()) {
                self.Parent().RemoveLeft();
            }
            parent = undefined;
        }

        self.RemoveLeft = function() {
            left = undefined;
        }

        self.RemoveRight = function() {
            right = undefined;
        }

        return self;
    }

    function RotateLeft(node) {
        var nodeParent = node.Parent();
        var rightChild = node.Right();
        var rightChildsLeft = rightChild.Left();

        //Rotate
        if (nodeParent) {
            if (node.IsRightChild()) {
                nodeParent.Right(rightChild);
            } else {
                nodeParent.Left(rightChild);
            }
        }

        rightChild.Left(node);
        if (!rightChildsLeft.NilNode) {
            node.Right(rightChildsLeft);
        } else {
            node.RemoveRight();
        }


        if (node == rootNode) {
            rootNode = rightChild;
            rootNode.RemoveParent();
        }
    }

    function RotateRight(node) {
        var nodeParent = node.Parent();
        var leftChild = node.Left();
        var leftChildsRight = leftChild.Right();

        //Rotate
        if (nodeParent) {
            if (node.IsRightChild()) {
                nodeParent.Right(leftChild);
            } else {
                nodeParent.Left(leftChild);
            }
        }

        leftChild.Right(node);
        if (!leftChildsRight.NilNode) {
            node.Right(rightChildsLeft);
        } else {
            node.RemoveLeft();
        }

        if (node == rootNode) {
            rootNode = leftChild;
            rootNode.RemoveParent();
        }
    }

    function MinNode(startNode) {
        var node = rootNode;
        if (startNode) {
            node = startNode;
        }

        if (node.Left().NilNode) {
            return node
        } else {
            return MinNode(node.Left());
        }
    }

    function TreeInsert(item) {
        var newNode = undefined;
        if (rootNode == undefined) {
            rootNode = new Node(item);
            newNode = rootNode;
        } else {
            var currentNode = rootNode;
            var nextNode = undefined;
            while (true) {
                if (compareFunction(item, currentNode.Value) <= 0) {
                    nextNode = currentNode.Left();
                    if (nextNode.NilNode) {
                        newNode = currentNode.Left(new Node(item));
                        break;
                    }
                } else {
                    nextNode = currentNode.Right();
                    if (nextNode.NilNode) {
                        newNode = currentNode.Right(new Node(item));
                        break;
                    }
                }
                currentNode = nextNode;
            }
        }

        return newNode;
    }

    function RebalenceTreeAfterDeletion(node) {
        //Define the colors for less headache later
        var red = node.ValidColors.Red;
        var black = node.ValidColors.Black;

        while (node != rootNode) { //Case 1 check
            var parent = node.Parent();
            var sibling = node.Sibling();

            if (sibling.Color == red) { //Case 2
                //We need to rotate
                if (sibling.IsRightChild()) {
                    RotateLeft(parent);
                } else if (sibling.IsLeftChild()) {
                    RotateRight(parent);
                }

                parent.SwapColors();
                sibling.SwapColors();
            }

            if (parent.Color == black &&
                sibling.Color == black &&
                sibling.Left().Color == black &&
                sibling.Right().Color == black) { // Case 3

                sibling.Color = red;
                node = parent;
                continue; //Go back to case 1 checking against the parent
            }

            if (parent.Color == red &&
                sibling.Color == black &&
                sibling.Left().Color == black &&
                sibling.Right().Color == black) { // Case 4

                sibling.Color = red;
                parent.Color = black;
                continue; //Go back to case 1, checking with current node
            }

            if (sibling.Color == black) { // Case 5
            	debugger;
                if (sibling.Left().Color == black &&
                    sibling.Right().Color == red &&
                    node.IsLeftChild()) {

                    sibling.Color = red;
                    sibling.Right().Color = black;
                    RotateRight(sibling);
                } else if (sibling.Left().Color == red &&
                    sibling.Right().Color == black &&
                    node.IsRightChild()) {

                    sibling.Color = red;
                    sibling.Left().Color = black;
                    RotateLeft(sibling);
                }
            }

            //Case 6
            sibling.Color = parent.Color;
            parent.Color = black;
            if (node.IsLeftChild()) {
                sibling.Right().Color = black;
                RotateLeft(parent);
            } else if (node.IsRightChild()) {
                sibling.Left().Color = black;
                RotateRight(parent);
            }

            break; //if we get this far, we are done!
        }
    }

    //////////////////
    //Public Methods
    //////////////////

    self.Depth = function(starterNode) {
        function DepthHelper(node) {
            if (node.NilNode) {
                return 0;
            } else {
                return Math.max(DepthHelper(node.Left()), DepthHelper(node.Right())) + 1;
            }
        }
        if (!starterNode) {
            starterNode = rootNode;
        }

        return DepthHelper(starterNode);
    }

    self.Insert = function(item) {
        var node = TreeInsert(item);
        while (node != rootNode && (node.Parent() && node.Parent().Color == node.ValidColors.Red)) {
            if (node.Uncle() && node.Uncle().Color == node.ValidColors.Red) { //Uncle is Red
                node.Parent().SwapColors();
                node.Grandparent().SwapColors();
                node.Uncle().SwapColors();
                node = node.Grandparent();
            } else if (node.Uncle() && node.Uncle().Color == node.ValidColors.Black) { //If the uncle is black
                if (node.IsLeftChild() && node.Parent().IsRightChild()) {
                    var parent = node.Parent();
                    RotateRight(parent);
                    node = parent;
                } else if (node.IsRightChild() && node.Parent().IsLeftChild()) {
                    var parent = node.Parent();
                    RotateLeft(parent);
                    node = parent;
                } else if (node.IsLeftChild() && node.Parent().IsLeftChild()) {
                    var grandparent = node.Grandparent();
                    var parent = node.Parent();
                    RotateRight(grandparent);

                    grandparent.SwapColors();
                    parent.SwapColors();
                    node = grandparent;
                } else if (node.IsRightChild() && node.Parent().IsRightChild()) {
                    var grandparent = node.Grandparent();
                    var parent = node.Parent();
                    RotateLeft(grandparent);

                    grandparent.SwapColors();
                    parent.SwapColors();
                    node = grandparent;
                }
            } else { //No rules voilated
                node = node.Parent();
            }
        }

        if (node == rootNode) {
            node.Color = node.ValidColors.Black;
        }
    }

    self.Delete = function(item) {
        var node = rootNode;
        var movedNode = undefined;

        var result = undefined;

        while (node && !node.NilNode) {
            if (compareFunction(item, node.Value) == 0) {
                break; //Found the node
            } else if (compareFunction(item, node.Value) < 0) { //Check left tree
                node = node.Left();
            } else { // > 0 and check right tree
                node = node.Right();
            }
        }

        var parent = node.Parent();
        //Define the colors for less headache later
        var red = node.ValidColors.Red;
        var black = node.ValidColors.Black;

        //Found the node.  Now, remove it
        if (node.Left().NilNode && node.Right().NilNode) { //Leaf node
            if (node.IsRightChild()) {
                parent.RemoveRight();
                RebalenceTreeAfterDeletion(parent.Right()); //Will be a NilNode
            } else if (node.IsLeftChild()) {
                parent.RemoveLeft();
                RebalenceTreeAfterDeletion(parent.Left()); //Will be a NilNode
            }
            
        } else if (!node.Left().NilNode && node.Right().NilNode) { //Has a left child
            movedNode = node.Left();
            if (node.IsRightChild()) {
                parent.Right(node.Left());
            } else if (node.IsLeftChild()) {
                parent.Left(node.Left());
            } else { //rootNode
                rootNode = node.Left();
            }
            if(node.Color == black && movedNode != rootNode){
            	if(movedNode.Color == red){
            		movedNode.Color = black;
            	} else {
            		RebalenceTreeAfterDeletion(movedNode);
            	}
            }

        } else if (node.Left().NilNode && !node.Right().NilNode) { //Has a right child
            movedNode = node.Right();
            if (node.IsRightChild()) {
                parent.Right(node.Right());
            } else if (node.IsLeftChild()) {
                parent.Left(node.Right());
            } else { //rootNode
                rootNode = node.Right();
            }
            if(node.Color == black && movedNode != rootNode){
            	if(movedNode.Color == red){
            		movedNode.Color = black;
            	} else {
            		RebalenceTreeAfterDeletion(movedNode);
            	}
            }
        } else { //Two children
            var minRightNode = MinNode(node.Left()); //In order traversal
            minRightNode.RemoveParent();

            if (node.IsRightChild()) {
                parent.Right(minRightNode);
            } else if (node.IsLeftChild()) {
                parent.Left(minRightNode);
            } else { //rootNode
                rootNode = minRightNode;
            }

            minRightNode.Right(node.Right());
            minRightNode.Left(node.Left());
            movedNode = minRightNode;

            RebalenceTreeAfterDeletion(movedNode.Left());
        }

        if (node) { //Only return a result if we found the node to delete
            result = item;
        }

        return result;
    }

    self.Contains = function(item) {
        var result = false;
        var node = rootNode;
        while (!node.NilNode) {
            if (compareFunction(item, node.Value) == 0) {
                result = true;
                break;
            } else if (compareFunction(item, node.Value) < 0) {
                node = node.Left();
            } else { // > 0
                node = node.Right();
            }
        }
        return result;
    }

    self.PrintTree = function() {
        var queue = [];

        var currentDepth = self.Depth();
        var currDistance = 0;
        queue.push([rootNode, 0]);

        console.log("Current Tree");
        console.log("----");
        process.stdout.write("Level " + currDistance + ":");
        while (queue.length > 0) {
            var obj = queue.shift();
            if (obj) {
                var node = obj[0];
                var distance = obj[1];

                if (node.NilNode) {
                    continue;
                }

                if (currDistance < distance) {
                    console.log("");
                    currDistance = distance;
                    process.stdout.write("Level " + currDistance + ":");
                }

                if (node) {
                    queue.push([node.Left(), currDistance + 1]);
                    queue.push([node.Right(), currDistance + 1]);

                    var leftNode = ((node.Left().NilNode) ? chalk.grey("NaN") : chalk[node.Left().Color](node.Left().Value));
                    var rightNode = ((node.Right().NilNode) ? chalk.grey("NaN") : chalk[node.Right().Color](node.Right().Value));
                    var line = " {0}({1},{2}) ".format(chalk[node.Color](node.Value), leftNode, rightNode)

                    process.stdout.write(line);
                }
            }
        }
        console.log("");
        console.log("----");
    }

    return self;
}

if (require.main === module) {
    var foo = new exports.RedBlackTree();
    foo.Insert(1);
    foo.Insert(2);
    foo.Insert(3);
    foo.Insert(4);
    foo.Insert(5);
    foo.Insert(6);
    foo.Insert(7);
    foo.Insert(-1);
    // foo.Insert(-2);
    // foo.Insert(0);
    // foo.Insert(2);
    // foo.Insert(10);
    foo.PrintTree();

    foo.Delete(2);

    foo.PrintTree();
    //console.log(foo.Depth());
}