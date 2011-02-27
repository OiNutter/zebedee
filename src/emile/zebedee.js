/**
 * == emile ==
 * 
 * Version: <%=VERSION%>
 **/

/** section: emile
 * class zebedee
 *
 * creates an accordion widget
 **/

/** section: emile
 * new zebedee(container [, options])
 * 
 * - container (String | HTMLDOMElement): The containing div for the accordion
 * - options (Object): Optional options object for overriding default configuration
 * 
 * Creates a new zebedee accordion
 **/
var zebedee = (function(container,options){
	
    /** section: emile
     * zebedee._scope -> zebedee
     * 
     * Internal variable to enable event handlers to be executed in the main object's scope
     **/
	var _scope = this;
		
	if(typeof container == 'string'){
		container = '#' + container;
	
		if(document.querySelector(container)==null)
			throw new Exception('Element ' + container + " does not exist!");
	}
	
    /** section: emile
     * zebedee._container -> emile Object
     * 
     * Internal reference to container element
     **/
	this._container = (typeof container == 'string') ? document.querySelector(container): container;
		
	//utility methods
    /** section: emile
     * zebedee._getObjVars(obj) -> Array
     * 
     * - obj (Object) - The object to get the properties of
     * 
     *  Utility method to get array of object properties
     **/
	this._getObjVars = function(obj){
		if (typeof obj !== 'Object')
			return [];
			
		var vars = [];
	    for (var prop in obj)
	      vars.push(obj[prop]);
	    console.log(vars)
	    return vars;
	}
	
    /** section: emile
     * zebedee._merge(destination,source) -> Object
     * 
     * - destination (Object): The object to have it's properties overridden
     * - source (Object): The object with the new properties
     * 
     * Merges two objects together, overwriting the properties of the first with the new values from the second.
     **/
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
	
	this._hasClass = function(el,className){
		var reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
		return reg.test(el.className);
	}
	
	this._addClass = function(el,className){
		return !this._hasClass(el,className) && (el.className += (el.className ? ' ':'')+ className);
	}
	
	this._removeClass = function(el,className){
		return el.className = el.className.replace(className,'');
	}
	
	//public members
    /** section: emile
     * zebedee.toggle(e) -> null
     * 
     * - e (Event): The trigger event for the opening/closing of the accordion
     * 
     * Event handler for opening/closing the accordion.  Checks for any opened blocks, and if they're not the one clicked, closes them.  Then
     * either opens or closes the clicked block as necessary.
     **/
	this.toggle = function(e){
		
		var open = _scope._container.querySelector('.' + _scope.options.classNames.handleActive);
		if(open !== null && open!=e.currentTarget)
			_scope.close(open);
		if(_scope._hasClass(e.currentTarget,_scope.options.classNames.handleActive))
			_scope.close(e.currentTarget);
		else
			_scope.open(e.currentTarget);
			
	};
	
    /** section: emile
     * zebedee.open(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Opens the content block for the handle selected
     **/
	this.open = function(el){
		this._addClass(el,this.options.classNames.handleActive);		
		var css = (this.options.direction=='vertical') ? 'height:' + el.nextElementSibling.getAttribute('data-zebheight') + 'px' : 'width:' + el.nextElementSibling.getAttribute('data-zebwidth') + 'px';  
	 	emile(el.nextElementSibling,css,{duration:this.options.duration,easing:zebTransitions[this.options.transition]});
	};
	
	/** section: emile
     * zebedee.close(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Closes the content block for the handle selected
     **/
	this.close = function(el){
	 	this._removeClass(el,this.options.classNames.handleActive);
	 	emile(el.nextElementSibling,((this.options.direction=='vertical') ? 'height' : 'width')+':0px',{duration:this.options.duration,easing:zebTransitions[this.options.transition]});
	};
	
	
	//initialize options
    /** section: emile
     * zebedee.options
     * 
     * Contains the configuration details for the current accordion
     **/
	this.options = this._merge({
        /** section: emile
         * zebedee.options.classNames -> Object
         * 
         * Defines the default css classes for the accordion components.  Has 3 properties
         * - handle: Defines the css class for the clickable section headers
         * - handleActive: Defines the css class for the currently selected handle
         * - content: Defines the css class for the content blocks.
         **/
		classNames: {
			handle: 'zebedee-handle',
			handleActive: 'zebedee-active',
			content: 'zebedee-content'
		},
		linkElement:null,
        /** section: emile
         * zebedee.options.direction -> String
         * 
         * Specifies the direction of the accordion.  Can be either vertical or horizontal
         **/
		direction: 'vertical',
        /** section: emile
         * zebedee.options.duration -> Number
         * 
         * Defines the duration of the opening/closing animation.
         **/
		duration:1,
        /** section: emile
         * zebedee.options.transition -> String
         * 
         * Defines the animation effect used in the opening/closing animation.
         **/
		transition:'sinusoidal',
        /** section: emile
         * zebedee.options.trigger -> String
         * 
         * Defines the event that triggers the opening/closing of blocks. 
         **/
		trigger:'click'
	},options);
	
	//convert duration to milliseconds for emile
	this.options.duration *= 1000;
	
	//initialize accordion
		
	//set up handles
	panels = this._container.querySelectorAll('.' + this.options.classNames.content);
	handles = this._container.querySelectorAll('.' + this.options.classNames.handle);
	for(i=0;i < panels.length;i++){
		var box = panels[i].getBoundingClientRect();
		switch(_scope.options.direction){
		  case 'vertical' : panels[i].setAttribute('data-zebheight',box.height); break;
		  case 'horizontal' : panels[i].setAttribute('data-zebwidth',box.width); break;
		}
		panels[i].style.cssText += ";overflow:'hidden'"; 
	}
	for(i=0;i<handles.length;i++){
		  if (handles[i].addEventListener)
			  handles[i].addEventListener(this.options.trigger, this.toggle, false);
		  else
			  handles[i].attachEvent("on" + this.options.trigger, this.toggle);
		  
		  this.close(handles[i]);
	}
		
	return this
});

var zebTransitions = {
		sinusoidal:function(pos) {
		    return (-Math.cos(pos*Math.PI)/2) + 0.5;
		  },
		linear: function(pos){
			return pos;
		}
};