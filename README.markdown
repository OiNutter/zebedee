zebedee
=========

Zebedee is an accordion widget for use on multiple platforms.  The intention is to build three versions.  
one using [Scriptaculous 1.8](http://script.aculo.us), one using [Scripty2](http://scripty2.com) and one using [zepto](http://zeptojs.org)

Usage
-----

To use zebedee simply add the required combination of libraries to your page

* Scriptaculous - Prototype 1.7,Scriptaculous 1.8,zebedee-scriptaculous
* Scripty2 - Prototype 1.7, Scripty2, zebedee-s2
* Zepto - Zepto,zebedee-zepto

Set up your accordion as follows:

	<div id="container">
		<h1 class="zebedee-handle">Block 1</h1>
		<div class="zebedee-content">
			Content 1
		</div>
		<h1 class="zebedee-handle">Block 2</h1>
		<div class="zebedee-content">
			Content 2
		</div>
		<h1 class="zebedee-handle">Block 3</h1>
		<div class="zebedee-content">
			Content 3
		</div>
	</div>

then call

	var zbd = new zebedee('container');

You will need to add the following styles to your css `zebedee-handle`, `zebedee-active` and `zebedee-content`.  These can be overridden in 
the options.

Options
-------

Zebedee has the following configurable options:

* classNames
	+ handle \- `'zebedee-handle'`
	+ handleActive \- `'zebedee-active'`
	+ content \- `'zebedee-content'` 
* duration \- `1`
* transition \- `'ease-out'`
* trigger \- `'touchend'`

Versions
--------

### Scriptaculous ###
Coming Soon

### Scripty 2 ###
Coming Soon

### Zepto ###
The zepto version of zebedee uses Thomas Fuchs' lightweight, mobile targeting, [zepto](http://zeptojs.org) library.  I'm primarily taking 
advantage of the dom functions and the chaining to keep my code down.  The event functions also came in handy for dealing with the toggling 
of the accordion blocks.

Because this is using zepto and I'm intending it for the Mobile, Webkit based browsers, I was able to take advantage of the `anim()` function
in zepto and use css3 animations for the opening and closing of the content blocks.

One thing to note is that I'm using a custom attribute to store the original height of the content blocks before they're shrunk to use the 
animation. I've called this data-zebheight so it should be allowed by the HTML5 spec when that gets implemented on Safari.  Until then, unless 
a better solution presents itself, it's something I'm going to have to live with.
  
Notes
-----

Currently only the zepto version had been written and it's still very much in the beta stage.  Any tips/suggestions/constructive criticism 
would be greatly received 