/**
 * == Scripty 2 ==
 * 
 * Version: <%=VERSION%>
 **/

/** section: Scripty 2
 * class zebedee
 *
 * creates an accordion widget
 **/

/** section: Scripty 2
 * new zebedee(container [, options])
 * 
 * - container (String | HTMLDOMElement | Prototype Object): The containing div for the accordion
 * - options (Object): Optional options object for overriding default configuration
 * 
 * Creates a new zebedee accordion
 **/
var zebedee = (function(container,options){
	/** section: Scripty 2
     * zebedee._scope -> zebedee
     * 
     * Internal variable to enable event handlers to be executed in the main object's scope
     **/
	var _scope = this;
			
	if(!$(container))
		throw new Exception('Element ' + container + " does not exist!");
	
    /** section:  Scripty 2
     * zebedee._container -> Scriptaculous Object
     * 
     * Internal reference to container element
     **/
	this._container = $(container);
		
	//utility methods
    /** section: Scripty 2
     * zebedee._getObjVars(obj) -> Array
     * 
     * - obj (Object) - The object to get the properties of
     * 
     *  Utility method to get array of object properties
     **/
	this._getObjVars = function(obj){
		if (typeof obj !== 'Object')
			return [];
			
		return Object.values(obj);
	}
	
    /** section: Scripty 2
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
    
    /** section: Scripty 2
     * zebedee._getTransition() -> Object
     * 
     *  Returns the correct transition object based on the configured option.  Will 
     *  use CSS transitions where available and supported.
     */
	this._getTransition = function(){
		
		if(!S2.Extensions.CSSTransitions)
			return S2.FX.Transitions[this.options.transition];
		else
			return S2.FX.Operators.CssTransition[this.options.transition]
		
	}
	
	//public members
    /** section: Scripty 2
     * zebedee.toggle(e) -> null
     * 
     * - e (Event): The trigger event for the opening/closing of the accordion
     * 
     * Event handler for opening/closing the accordion.  Checks for any opened blocks, and if they're not the one clicked, closes them.  Then
     * either opens or closes the clicked block as necessary.
     **/
	this.toggle = function(e){
		var open = $$('#' + _scope._container.identify() + ">." + _scope.options.classNames.handleActive)[0];
		if(!Object.isUndefined(open) && open!=e.findElement())
			_scope.close($$('#' + _scope._container.identify() + ">." + _scope.options.classNames.handleActive)[0]);
		if($(e.findElement('.'+_scope.options.classNames.handle)).hasClassName(_scope.options.classNames.handleActive))
			_scope.close(e.findElement('.'+_scope.options.classNames.handle));
		else
			_scope.open(e.findElement('.'+_scope.options.classNames.handle));
	};
	
    /** section: Scripty 2
     * zebedee.open(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Opens the content block for the handle selected
     **/
	this.open = function(el){
		$(el).addClassName(this.options.classNames.handleActive);
		 
		var css = (this.options.direction == 'vertical') ? 'height:' + $(el).next().readAttribute('data-zebheight') + "px;" : 'width:' + $(el).next().readAttribute('data-zebwidth') + "px;";
		$(el).next().morph(css,{duration:this.options.duration,transition:this._getTransition()});
	};
	
	/** section: Scripty 2
     * zebedee.close(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Closes the content block for the handle selected
     **/
	this.close = function(el){
	 	$(el).removeClassName(this.options.classNames.handleActive);
	 		 	 
	 	$(el).next().morph(((this.options.direction=='vertical') ? 'height' : 'width') + ":0px" ,{duration:this.options.duration,transition:this._getTransition()});
	 
	};
	
	
	//initialize options
    /** section: Scripty 2
     * zebedee.options
     * 
     * Contains the configuration details for the current accordion
     **/
	this.options = this._merge({
        /** section: Scripty 2
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
		direction: 'vertical',
        /** section: Scripty 2
         * zebedee.options.duration -> Number
         * 
         * Defines the duration of the opening/closing animation.
         **/
		duration:1,
		/** section: Scripty 2
         * zebedee.options.transition -> String
         * 
         * Defines the animation effect used in the opening/closing animation.
         **/
		transition:'sinusoidal',
		/** section: Scripty 2
         * zebedee.options.trigger -> String
         * 
         * Defines the event that triggers the opening/closing of blocks. 
         **/
		trigger:'click',
		start:false
	},options);
		
	//initialize accordion
		
	//set up handles
	
	$$('#' + this._container.identify()+ '>.' + this.options.classNames.handle).each(function(el,i){
		$(el).observe(this.options.trigger,this.toggle);
		
	},this);

	$$('.' + this.options.classNames.content).each(function(el,i){
		switch(this.options.direction){
		  case 'vertical' : $(el).writeAttribute('data-zebheight',$(el).getHeight()).setStyle({'overflow':'hidden'}); break;
		  case 'horizontal' : $(el).writeAttribute('data-zebwidth',$(el).getWidth()).setStyle({'overflow':'hidden'}); break;
		}
		
	},this);
	$$('.' + this.options.classNames.handle).each(function(el,i){
		if(this.options.start && i==(this.options.start-1))
			$(el).addClassName(this.options.classNames.handleActive);
		else
			this.close(el);
		},this);
	
	return this
});