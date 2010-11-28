/**
 * == Zepto ==
 * 
 * Version: <%=VERSION%>
 **/

/** section: Zepto
 * class zebedee
 *
 * creates an accordion widget
 **/

/** section: Zepto
 * new zebedee(container [, options])
 * 
 * - container (String | HTMLDOMElement | Zepto Object): The containing div for the accordion
 * - options (Object): Optional options object for overriding default configuration
 * 
 * Creates a new zebedee accordion
 **/
var zebedee = (function(container,options){
	
    /** section: Zepto
     * zebedee._scope -> zebedee
     * 
     * Internal variable to enable event handlers to be executed in the main object's scope
     **/
	var _scope = this;
		
	if(typeof container == 'string')
		container = '#' + container;
	
	if(!$(container))
		throw new Exception('Element ' + container + " does not exist!");
	
    /** section: Zepto
     * zebedee._container -> Zepto Object
     * 
     * Internal reference to container element
     **/
	this._container = $(container);
		
	//utility methods
    /** section: Zepto
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
	
    /** section: Zepto
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
    /** section: Zepto
     * zebedee.toggle(e) -> null
     * 
     * - e (Event): The trigger event for the opening/closing of the accordion
     * 
     * Event handler for opening/closing the accordion.  Checks for any opened blocks, and if they're not the one clicked, closes them.  Then
     * either opens or closes the clicked block as necessary.
     **/
	this.toggle = function(e){
		var open = $('#' + _scope._container.attr('id') + ">." + _scope.options.classNames.handleActive).get(0);
		if(open !== 'undefined' && open!=e.currentTarget)
			_scope.close($('#' + _scope._container.attr('id') + ">." + _scope.options.classNames.handleActive).get(0));
		if($(e.currentTarget).hasClass(_scope.options.classNames.handleActive))
			_scope.close(e.currentTarget);
		else
			_scope.open(e.currentTarget);
			
	};
	
    /** section: Zepto
     * zebedee.open(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Opens the content block for the handle selected
     **/
	this.open = function(el){
		$(el).addClass(this.options.classNames.handleActive).next().anim(null,this.options.duration,this.options.transition).css('height',$(el).next().attr('data-zebheight')+"px");
	};
	
	/** section: Zepto
     * zebedee.close(el) -> null
     * 
     * - el (HTMLDOMElement): The handle clicked
     * 
     * Closes the content block for the handle selected
     **/
	this.close = function(el){
		$(el).removeClass(this.options.classNames.handleActive).next().anim(null,this.options.duration,this.options.transition).css('height','0px');
	};
	
	
	//initialize options
    /** section: Zepto
     * zebedee.options
     * 
     * Contains the configuration details for the current accordion
     **/
	this.options = this._merge({
        /** section: Zepto
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
        /** section: Zepto
         * zebedee.options.duration -> Number
         * 
         * Defines the duration of the opening/closing animation.
         **/
		duration:1,
		/** section: Zepto
         * zebedee.options.transition -> String
         * 
         * Defines the animation effect used in the opening/closing animation.
         **/
		transition:'ease-out',
		/** section: Zepto
         * zebedee.options.trigger -> String
         * 
         * Defines the event that triggers the opening/closing of blocks. 
         **/
		trigger:'touchend'
	},options);
		
	//initialize accordion
		
	//set up handles
	$('#' + this._container.attr('id')+ '>.' + this.options.classNames.handle).bind(this.options.trigger,this.toggle);
	$('.' + this.options.classNames.content).each(function(i){
		$(i).attr('data-zebheight',$(i).height()).css('overflow','hidden');
	});
	$('.' + this.options.classNames.handle).each(function(i){_scope.close(i)});
	
	return this
});