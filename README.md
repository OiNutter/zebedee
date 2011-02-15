zebedee
=========

Zebedee is an accordion widget for use on multiple platforms.  The intention is to build three versions.  
one using [Scriptaculous 1.8](http://script.aculo.us), one using [Scripty2](http://scripty2.com) and one using [zepto](http://zeptojs.org)

Usage
-----

To use zebedee simply add the required combination of libraries to your page

* Scriptaculous - Prototype 1.7,Scriptaculous 1.8,scriptaculous/zebedee
* Scripty2 - Prototype 1.7, Scripty2, scripty2/zebedee
* Zepto - Zepto,zepto/zebedee

Set up your accordion as follows:

	<div id="container">
		<h1 class="zebedee-handle">Block 1</h1>
		<div class="zebedee-content">
			<div>
				Content 1
			</div>
		</div>
		<h1 class="zebedee-handle">Block 2</h1>
		<div class="zebedee-content">
			<div>
				Content 2
			</div>
		</div>
		<h1 class="zebedee-handle">Block 3</h1>
		<div class="zebedee-content">
			<div>
				Content 3
			</div>
		</div>
	</div>

then call

	var zbd = new zebedee('container');

You will need to add the following styles to your css `zebedee-handle`, `zebedee-active` and `zebedee-content`.  These can be overridden in 
the options.  The extra nested helps smooth the animations in scriptaculous.

Options
-------

Zebedee has the following configurable options:

* classNames
	+ handle \- `'zebedee-handle'`
	+ handleActive \- `'zebedee-active'`
	+ content \- `'zebedee-content'` 
* duration \- `1`
* transition \- `'ease-out'` | `'sinoidal'` (The defaults and valid options depend on which library version you are using.  See the version notes below for more details)
* trigger \- `'touchend'`

Versions
--------

### Scriptaculous ###
The scriptaculuos version is using Prototype 1.7 and Scriptaculous 1.9.  I've kept the code much the same as the zepto version, but replaced the anim() calls with Effect.Scale.
I've also used some of Prototype's built in utility functions to keep my code base down and avoid repeating things.  However I have kept my _merge function rather than using 
Object.extend as my version only overwrites the final variables, rather than whole branches.

The transition option takes any valid Effect.Transitions type from Scriptaculous.  Just use the last part eg. sinoidal, linear.

### Scripty 2 ###
Coming Soon

### Zepto ###
The zepto version of zebedee uses Thomas Fuchs' lightweight, mobile targeting, [zepto](http://zeptojs.org) library.  I'm primarily taking 
advantage of the dom functions and the chaining to keep my code down.  The event functions also came in handy for dealing with the toggling 
of the accordion blocks.

Because this is using zepto and I'm intending it for the Mobile, Webkit based browsers, I was able to take advantage of the `anim()` function
in zepto and use css3 animations for the opening and closing of the content blocks.

The transition option takes valid CSS3 transition types.
  
Notes
-----

I'm using a custom attribute to store the original height of the content blocks before they're shrunk to use the animation. I've called this data-zebheight so it should be allowed by the HTML5 spec when that gets implemented.  Until then, unless 
a better solution presents itself, it's something I'm going to have to live with. 

Zebedee is still very much in the beta stage so any tips/suggestions/constructive criticism would be greatly received. 