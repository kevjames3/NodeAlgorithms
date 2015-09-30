exports.RedBlackTree = function (){
	//Init
	var self = this;
	var rootNode;

	//Private
	function CreateNewNode(value){
		var self = this;

		self.Value = value;
		self.Parent = undefined;
		self.Left = undefined;
		self.Rgiht = undefined;

		return new self;
	}

	function RotateLeft(){

	}

	function RotateRight(){

	}

	function Compare(val1, val2){
		return val1 - val2;
	}

	//Public Methods
	self.Add = function(item){
		if(rootNode == undefined){
			rootNode = CreateNewNode(item);
		} else {
			var currentNode = rootNode;
			var nextNode = undefined;
			while(true) {
				if (Compare(item, currentNode.Value) <= 0){
					nextNode = currentNode.Left;
					if(nextNode == undefined){
						currentNode.Left = CreateNewNode(item);
						break;
					}
				} else {
					nextNode = currentNode.Right;
					if(nextNode == undefined){
						currentNode.Right = CreateNewNode(item);
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

	return self;
}

if (require.main === module) {

}