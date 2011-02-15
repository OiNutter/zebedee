/**
 * == Scriptaculous ==
 * 
 * Version: <%=VERSION%>
 **/

/** section: Scriptaculous
 * class zebedee
 *
 * creates an accordion widget
 **/

/** section: Scriptaculous
 * new zebedee(container [, options])
 * 
 * - container (String | HTMLDOMElement | Prototype Object): The containing div for the accordion
 * - options (Object): Optional options object for overriding default configuration
 * 
 * Creates a new zebedee accordion
 **/
var zebedee = (function(container,options){
	/** section: Scriptaculous
     * zebedee._scope -> zebedee
     * 
     * Internal variable to enable event handlers to be executed in the main object's scope
     **/
	var _scope = this;
			
	if(!$(container))
		throw new Exception('Element ' + container + " does not exist!");
	
    /** section: Scriptaculous
     * zebedee._container -> Scriptaculous Object
     * 
     * Internal reference to container element
     **/
	this._container = $(container);
		
	//utility methods
    /** section: Scriptaculous
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
	
    /** section: Scriptaculous
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
	
	//public members
    /** section: Scriptaculous
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
		if($(e.findElement()).hasClassName(_scope.options.classNames.handleActive))
			_scope.close(e.findElement());
		else
			_scope.open(e.findElement());
	};
	
    /** section: Scriptaculous
     * zebedee.open(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Opens the content block for the handle selected
     **/
	this.open = function(el){
		$(el).addClassName(this.options.classNames.handleActive);
		 
		var scaleMode = this.options.direction == 'vertical' ? {originalHeight:$(el).next().readAttribute('data-zebheight')} : {originalWidth:$(el).next().readAttribute('data-zebwidth')};
		new Effect.Scale($(el).next(),100,{
			duration:this.options.duration,
			transition: Effect.Transitions[this.options.transition],
			scaleX: this.options.direction=='horizontal' ? true : false,
			scaleY: this.options.direction == 'vertical' ? true : false,
			scaleFrom:0,
			scaleContent:false,
			scaleMode:scaleMode
	 	});
	};
	
	/** section: Scriptaculous
     * zebedee.close(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Closes the content block for the handle selected
     **/
	this.close = function(el){
	 	
	 	$(el).removeClassName(this.options.classNames.handleActive);
	 		 	 
		new Effect.Scale($(el).next(),0,{
			duration:this.options.duration,
			transition: Effect.Transitions[this.options.transition],
			scaleX: this.options.direction=='horizontal' ? true : false,
			scaleY: this.options.direction == 'vertical' ? true : false,
			scaleContent:false,
			scaleFrom:100,
			scaleMode:{originalHeight:$(el).next().getHeight(),originalWidth:$(el).next().getWidth()}
	 	});
	 
	};
	
	
	//initialize options
    /** section: Scriptaculous
     * zebedee.options
     * 
     * Contains the configuration details for the current accordion
     **/
	this.options = this._merge({
        /** section: Scriptaculous
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
        /** section: Scriptaculous
         * zebedee.options.duration -> Number
         * 
         * Defines the duration of the opening/closing animation.
         **/
		duration:1,
		/** section: Scriptaculous
         * zebedee.options.transition -> String
         * 
         * Defines the animation effect used in the opening/closing animation.
         **/
		transition:'sinoidal',
		/** section: Scriptaculous
         * zebedee.options.trigger -> String
         * 
         * Defines the event that triggers the opening/closing of blocks. 
         **/
		trigger:'touchend'
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
	$$('.' + this.options.classNames.handle).each(function(el,i){this.close(el)},this);
	
	return this
});