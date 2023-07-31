(function SetupTextareaAutoResize() {
	'use strict';
	window.GetInnerText = ref => ref.innerText;
	window.GetInnerHtml = ref => ref.innerHtml;
	['input', 'focusin'].forEach(eventKey => {
		document.body.addEventListener(eventKey, ev => {
			if (!ev.target) { return; }
			autosizeTextArea(ev.target);
		});
	});
	document.body.addEventListener("keydown", (ev) => {
		if (ev.key !== 'Tab') { return; }
		if (!ev.target || ev.target.nodeName !== 'TEXTAREA') { return; }
		ev.preventDefault();
		let el = ev.target;
		let text = el.value;
		let postTab = text.slice(el.selectionEnd, text.length);
		let cursorPos = el.selectionEnd;
		if (ev.shiftKey) {
			let trimCount = 0;
			for (let i = 0; i < 4; ++i) {
				if (text.charAt(cursorPos - 1) === '\t') {
					if (i > 0) { break; }
					--cursorPos;
					break;
				}
				if (text.charAt(cursorPos - 1) === ' ') {
					--cursorPos;
					continue;
				}
				break;
			}
			if (trimCount > 0) {
				ev.target.value = text.slice(0, el.selectionStart - trimCount) + postTab;
			}
		} else {
			ev.target.value = text.slice(0, el.selectionStart) + "\t" + postTab;
			++cursorPos;
		}
		el.selectionStart = cursorPos;
		el.selectionEnd = cursorPos;
	});
	const mock = document.createElement('textarea');
	mock.style.maxHeight = '0px';
	function autosizeTextArea(target) {
		if (target.nodeName !== 'TEXTAREA') { return; }
		setTimeout(() => {
			mock.value = target.value;
			target.parentNode.insertBefore(mock, target);
			let heightOffset = 52;
			let newHeight = mock.scrollHeight + heightOffset
			target.style.height = `${(newHeight)}px`;
			mock.remove();
			let dif = target.scrollHeight - target.clientHeight;
			if (dif > 0) {
				target.style.height = `${(newHeight + heightOffset + dif)}px`;
			}
		}, 10);
	}
	function UpdateAllDisplayedTextareaSizes() {
		document.querySelectorAll('textarea').forEach(instance => {
			autosizeTextArea(instance);
		});
	}
	window.AutosizeTextarea = autosizeTextArea;
	window.RefreshTextareaSizes = () => {
		// Add slight delay to allow time for DOM rendering to complete
		setTimeout(UpdateAllDisplayedTextareaSizes, 100);
	}
})();
