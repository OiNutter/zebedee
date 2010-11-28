/**
 * 
 */
var zebedee = (function(container,options){
	
	var _scope = this;
		
	if(typeof container == 'string')
		container = '#' + container;
	
	if(!$(container))
		throw new Exception('Element ' + container + " does not exist!");
	
	this._container = $(container);
		
	//utility methods
	this._getObjVars = function(obj){
		if (typeof obj !== 'Object')
			return [];
			
		var vars = [];
	    for (var prop in obj)
	      vars.push(obj[prop]);
	    console.log(vars)
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
	
	//public members
	this.toggle = function(e){
		var open = $('#' + _scope._container.attr('id') + ">." + _scope.options.classNames.handleActive).get(0);
		if(open !== 'undefined' && open!=e.currentTarget)
			_scope.close($('#' + _scope._container.attr('id') + ">." + _scope.options.classNames.handleActive).get(0));
		if($(e.currentTarget).hasClass(_scope.options.classNames.handleActive))
			_scope.close(e.currentTarget);
		else
			_scope.open(e.currentTarget);
			
	};
	
	this.open = function(el){
		$(el).addClass(this.options.classNames.handleActive).next().anim(null,this.options.duration,this.options.transition).css('height',$(el).next().attr('origHeight')+"px");
	};
	
	this.close = function(el){
		$(el).removeClass(this.options.classNames.handleActive).next().anim(null,this.options.duration,this.options.transition).css('height','0px');
	};
	
	//initialize options
	this.options = this._merge({
		classNames: {
			handle: 'zebedee-handle',
			handleActive: 'zebedee-active',
			content: 'zebedee-content'
		},
		linkElement:null,
		direction: 'vertical',
		duration:1,
		transition:'ease-out',
		trigger:'touchend'
	},options);
		
	//initialize accordion
		
	//set up handles
	$('#' + this._container.attr('id')+ '>.' + this.options.classNames.handle).bind(this.options.trigger,this.toggle);
	$('.' + this.options.classNames.content).each(function(i){
		$(i).attr('origHeight',$(i).height());
	});
	$('.' + this.options.classNames.handle).each(function(i){_scope.close(i)});
	
	return this
});