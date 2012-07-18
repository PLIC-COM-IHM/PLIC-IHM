var rotate = false;

function rotateBody()
{
	if (rotate == false)
	{
		$("body").css("-webkit-transform", "translate(00px) rotate(180deg)")
		$("body").css("-webkit-transform-origin", "50% 100%")
		rotate = true;
		
		
		 var h=0; 
  		 if (window.innerHeight) h = window.innerHeight; 
		 else if (document.body && document.body.offsetHeight) h = window.document.body.offsetHeight; 
		 else if (document.documentElement && document.documentElement.clientHeight) h = document.documentElement.clientHeight; 
		this.scroll(1,h);

		// store state
		createCookie("rotateBody", "true");
	}
	else
	{
		$("body").css("-webkit-transform", "translate(00px) rotate(0deg)")
		$("body").css("-webkit-transform-origin", "50% 100%")
		rotate = false;
		
		
		// store state
		eraseCookie("rotateBody");
	}
	
}

function initRotate()
{
	rotate = readCookie("rotateBody") == "true";
	if (rotate)
	{
		$("body").css("-webkit-transform", "translate(00px) rotate(180deg)")
		$("body").css("-webkit-transform-origin", "50% 100%")
		
		var h=0; 
  		if (window.innerHeight) h = window.innerHeight; 
		else if (document.body && document.body.offsetHeight) h = window.document.body.offsetHeight; 
		else if (document.documentElement && document.documentElement.clientHeight) h = document.documentElement.clientHeight; 
		this.scroll(1,h); 
	}
	else
	{
		$("body").css("-webkit-transform", "translate(00px) rotate(0deg)")
		$("body").css("-webkit-transform-origin", "50% 100%")
	}
}

/*
	Propriete de rotation
	
	-webkit-transform: translate(00px) rotate(180deg);
	-webkit-transform-origin: 50% 100%;
*/