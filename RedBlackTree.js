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
    var compareFunction = function(val1, val2){
    	return val1 - val2;
    }

    if(userCompareFunction){
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
                result.NilNode = true;
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
                result.Color = self.ValidColors.Black;
                result.NilNode = true;
            }

            return result;
        }

        self.Parent = function(node) {
            if (node) {
                parent = node;
            }
            return parent;
        };

        self.RemoveParent = function(){
        	parent = undefined;
        }

        self.RemoveLeft = function(){
        	left = undefined;
        }

        self.RemoveRight = function(){
        	right = undefined;
        }

        return self;
    }

    function RotateLeft(node) {
    	var nodeParent = node.Parent();
    	var rightChild = node.Right();
    	var rightChildsLeft = rightChild.Left();

    	//Rotate
    	if(nodeParent){
    		if(node.IsRightChild()){
    			nodeParent.Right(rightChild); 
	    	} else {
	    		nodeParent.Left(rightChild);
	    	}
    	}
    	
    	rightChild.Left(node);
    	if(!rightChildsLeft.NilNode){
    		node.Right(rightChildsLeft);
    	} else {
    		node.RemoveRight();
    	}
    	

    	if(node == rootNode){
    		rootNode = rightChild;
    		rootNode.RemoveParent();
    	}
    }

    function RotateRight(node) {
    	var nodeParent = node.Parent();
    	var leftChild = node.Left();
    	var leftChildsRight = leftChild.Right();

    	//Rotate
    	if(nodeParent){
    		if(node.IsRightChild()){
    			nodeParent.Right(leftChild); 
	    	} else {
	    		nodeParent.Left(leftChild);
	    	}
    	}

    	leftChild.Right(node);
    	if(!leftChildsRight.NilNode){
    		node.Right(rightChildsLeft);
    	} else {
    		node.RemoveLeft();
    	}

    	if(node == rootNode){
    		rootNode = leftChild;
    		rootNode.RemoveParent();
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

    function RebalenceTree(node){
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
        RebalenceTree(node);
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
    foo.Insert(-2);
    foo.Insert(0);
    foo.Insert(2);
    foo.Insert(10);
    foo.PrintTree();
    //console.log(foo.Depth());
}