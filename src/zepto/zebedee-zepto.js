/**
 * 
 */
var zebedee = (function(container,options){
	
	if(typeof container == 'string')
		container = '#' + container;
	
	if(!$(container))
		throw new Exception('Element ' + container + " does not exist!");
		
	this.options = this._merge({
		classNames: {
			handle: 'zebedee-handle',
			handleActive: 'zebedee-active',
			content: 'zebedee-content'
		},
		linkElement:null,
		direction: vertical,
		duration:3,
		trigger:'touchstart'
	},options);
		
	//utility methods
	this._getObjVars = function(obj){
		var vars = [];
	    for (var prop in obj)
	      vars.push(obj[prop]);
	    return vars;
	}
	
	this._merge = function(destination,source){
		var property,prop;
		for (property in source){
			if(this._getObjVars(destination[property]).length>0 && this._getObjVars(source[property]).length>0){
				for(prop in source[property])
 			 		destination[property][prop] = source[property][prop];
 			 } else {
 			 	destination[property] = source[property];
 			 }
 		}
		return destination;
	};
	
	//initialize accordion
	//set up handles
	$('.' + this.options.classNames.handle,$(container)).live('touchend',this.open)
	
	//public members
	return {
		this.open = function(){};
		this.close = function(){};
	}
	
});