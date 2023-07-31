(function SetupTooltips() {
	'use strict';
	const Tooltip = document.createElement('div');
	Tooltip.className = 'tooltip closed';
	let capturedElement = null;
	document.body.appendChild(Tooltip);
	let isShowing = false;
	function CloseIfOpen() {
		if (!isShowing) { return; }
		isShowing = false;
		capturedElement = null;
		Tooltip.className = 'tooltip closed';
	}
	function CheckContainersForAriaLabel(target) {
		while (target !== null) {
			if (target.ariaLabel) { return target; }
			target = target.parentNode;
		}
		return target;
	}
	let tooltipDistancePadding = 30;
	document.body.addEventListener('click', CloseIfOpen);
	document.body.addEventListener('input', CloseIfOpen);
	document.body.addEventListener('mouseover', ev => {
		let target = CheckContainersForAriaLabel(ev.target);
		if (!target) { CloseIfOpen(); return; }
		if (target === capturedElement) { return; }
		let client = target.getBoundingClientRect();
		isShowing = true;
		capturedElement = target;
		Tooltip.innerText = target.ariaLabel;
		Tooltip.className = 'tooltip open';
		let myposition = {
			x: client.left + (client.width / 2) - (Tooltip.clientWidth / 2),
			y: client.top - tooltipDistancePadding
		};
		if (myposition.x + Tooltip.clientWidth > window.innerWidth) { myposition.x = window.innerWidth - Tooltip.clientWidth - 5; }
		if (myposition.x < 0) { myposition.x = 5; }
		if (myposition.y < 0) { myposition.y = client.top + client.height; }

		Tooltip.style.left = `${myposition.x}px`;
		Tooltip.style.top = `${myposition.y}px`;
	});
})();
