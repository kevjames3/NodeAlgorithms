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

exports.RedBlackTree = function() {
    //Init
    var self = this;
    var rootNode;

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

        self.IsLeftChild = function() {
            var result = false;
            if (parent != undefined && parent.Left() == self) {
                result = true;
            }
            return result;
        }

        self.IsRightChild = function() {
            var result = false;
            if (parent != undefined && parent.Right() == self) {
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
            if (self.Color == ValidColors.Red) {
                self.Color = ValidColors.Black;
            } else {
                self.Color = ValidColors.Red;
            }
        }

        self.Left = function(node) {
            if (node) {
                left = node;
            }

            var result = undefined;
            if (left != undefined) {
                result = left;
            } else {
                result = new Node();
                result.Value = undefined;
                result.Color = self.ValidColors.Black;
            }

            return result;
        }

        self.Right = function(node) {
            if (node) {
                right = node;
            }

            var result = undefined;
            if (right != undefined) {
                result = right;
            } else {
                result = new Node();
                result.Value = undefined;
                result.Color = self.ValidColors.Black;
            }

            return result;
        }

        self.Parent = function(node) {
            if (node) {
                parent = node;
            }
            return parent;
        };

        return self;
    }



    function RotateLeft() {

    }

    function RotateRight() {

    }

    function Compare(val1, val2) {
        return val1 - val2;
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
                if (Compare(item, currentNode.Value) <= 0) {
                    nextNode = currentNode.Left();
                    if (nextNode.Value == undefined) {
                        newNode = currentNode.Left(new Node(item));
                        newNode.Parent(currentNode);
                        break;
                    }
                } else {
                    nextNode = currentNode.Right();
                    if (nextNode.Value == undefined) {
                        newNode = currentNode.Right(new Node(item));
                        newNode.Parent(currentNode);
                        break;
                    }
                }
                currentNode = nextNode;
            }
        }

        return newNode;
    }

    //////////////////
    //Public Methods
    //////////////////

    self.Depth = function(starterNode) {
        function DepthHelper(node) {
            if (node.Value == undefined) {
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


    //    Case 1:
    // 1. Uncle is Red

    // Solution for Case 1:
    // 1. Swap colors of Parent, Uncle, and Grandparent
    // 2. Grandparent becomes the new node to check for violations

    // Case 2:
    // 1. Uncle is Black
    // 2a. Node is a Left Child of a Right Child
    // 2b. Node is a Right Child of a Left Child

    // Solution for Case 2:
    // 1a. Right rotate around Parent for 2a = Case 3
    // 1b. Left rotate around Parent for 2b = Case 3
    // 2. Parent becomes the new node to check for violations

    // Case 3:
    // 1. Uncle is Black
    // 2a. Node is a Right Child of a Right Child
    // 2b. Node is a Left Child of a Left Child

    // Solution for Case 3:
    // 1a. Left rotate around Grandparent for 2a
    // 1b. Right rotate around Grandparent for 2b
    // 2. Swap colors of Parent and Grandparent
    // 3. Grandparent becomes the new node to check for violations
    self.Insert = function(item) {
        var node = TreeInsert(item);
        while (node != rootNode) {
            if (node.Uncle() && node.Uncle().Color == node.ValidColors.Red) { //Uncle is Red
                node.Parent().SwapColors();
                node.Grandparent().SwapColors();
                node = node.Grandparent();
            } else if (node.Uncle() &&
                node.Uncle().Color == node.ValidColors.Black) { //If the uncle is black
                if (node.IsLeftChild() && node.Parent().IsRightChild()) {
                    break;
                } else if (node.IsRightChild() && node.Parent().IsLeftChild()) {
                    break;
                } else if (node.IsLeftChild() && node.Parent().IsLeftChild()) {
                    break;
                } else if (node.IsRightChild() && node.Parent().IsRightChild()) {
                    break;
                }
            } else { //No rules voilated
                break;
            }
        }

        if (node == rootNode) {
            node.Color = node.ValidColors.Black;
        }
    }

    self.Delete = function(item) {

    }

    self.Contains = function(item) {

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

                if (!node.Value) {
                    process.stdout.write(" ");
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

                    var leftNode = ((node.Left().Value == undefined) ? chalk.grey("NaN") : chalk[node.Left().Color](node.Left().Value));
                    var rightNode = ((node.Right().Value == undefined) ? chalk.grey("NaN") : chalk[node.Right().Color](node.Right().Value));
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
    // foo.Insert(-1);
    // foo.Insert(-2);
    // foo.Insert(0);
    // foo.Insert(2);
    // foo.Insert(10);
    foo.PrintTree();
    //console.log(foo.Depth());
}