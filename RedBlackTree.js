var chalk = require('chalk');

exports.RedBlackTree = function (){
	//Init
	var self = this;
	var rootNode;

	//Private
	function Node(value){
		var self = this;

		self.ValidColors = {
			Red: "red",
			Black: "grey"
		};

		self.Color = self.ValidColors.Red;
		self.Value = value;
		self.Parent = undefined;
		self.Left = undefined;
		self.Rgiht = undefined;

		return self;
	}

	function RotateLeft(){

	}

	function RotateRight(){

	}

	function Compare(val1, val2){
		return val1 - val2;
	}

	//Public Methods
	self.Depth = function (starterNode) {
		function DepthHelper(node){
			if(!node){
				return 0;
			} else{
				return Math.max(DepthHelper(node.Left), DepthHelper(node.Right)) + 1;
			}
		}
		if(!starterNode){
			starterNode = rootNode;
		}

		return DepthHelper(starterNode);
	}

	self.Add = function(item){
		if(rootNode == undefined){
			rootNode = new Node(item);
			rootNode.Color = rootNode.ValidColors.Black;
		} else {
			var currentNode = rootNode;
			var nextNode = undefined;
			while(true) {
				if (Compare(item, currentNode.Value) <= 0){
					nextNode = currentNode.Left;
					if(nextNode == undefined){
						currentNode.Left = new Node(item);
						break;
					}
				} else {
					nextNode = currentNode.Right;
					if(nextNode == undefined){
						currentNode.Right = new Node(item);
						break;
					}
				}
				currentNode = nextNode;
			} 
		}
	}

	self.Delete = function(item){

	}

	self.Contains = function(item){

	}

	self.PrintTree = function(){
		var queue = [];

		var currentDepth = self.Depth();
		var currDistance = 0;
		queue.push([rootNode, 0]);
		
		console.log("Current Tree");
		console.log("----");
		process.stdout.write("Level " + currDistance + ":");
		while(queue.length > 0){
			var obj = queue.shift();
			if(obj){
				var node = obj[0];
				var distance = obj[1];

				if(!node){
					process.stdout.write(" ");
					continue;
				}

				if(currDistance < distance){
					console.log("");
					currDistance = distance;
					process.stdout.write("Level " + currDistance + ":");
				}

				if(node){
					queue.push([node.Left, currDistance + 1]);
					queue.push([node.Right, currDistance + 1]);

					process.stdout.write(" " + chalk[node.Color](node.Value) + " ");
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
	foo.Add(1);
	foo.Add(2);
	foo.Add(3);
	foo.Add(-1);
	foo.Add(-2);
	foo.Add(0);
	foo.Add(2);
	foo.Add(10);
	foo.PrintTree();
	//console.log(foo.Depth());
}