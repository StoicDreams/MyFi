/*
 * This file performs some preliminary setup for Stoic Dreams websites.
 * Steps include:
 * - Assure URL is using SSL (https) security, and redirect to SSL if not.
 * - Setup window.DomInterop with methods to be accessed from C# processes.
 * */
window.DomInterop = (() => {
	'use strict';

	window.DebugEnabled = false;
	window.GetActiveElementName = () => document.activeElement.nodeName;
	if (!(function RedirectIfNotSecure() {
		if (location.protocol === 'https:') { return true; }
		location = location.href.replace('http:', 'https:');
		return false;
	})()) {
		return;
	}
	const origin = location.origin.toLowerCase();
	const parentDomain = (() => {
		let segments = location.host.split('.')
		while (segments.length > 2) { segments.shift(); }
		return segments.join('.');
	})();
	const cdnhost = parentDomain == 'myfi.ws' ? origin : `https://cdn.${parentDomain}`;
	(function LoadCSSFilesFromCDN() {
		[
			'i/framework.css',
			'fa/css/all.css'
		].forEach(url => {
			let link = document.createElement('link');
			link.rel = "stylesheet";
			link.href = `${cdnhost}/${url}`;
			document.head.appendChild(link);
		});
	})();
	setTimeout(function LoadOtherIndependentJavascriptComponentsFromCDN() {
		[
			'i/tooltips.js',
			'i/mermaid.js',
			'i/prism.js'
		].forEach(url => {
			let script = document.createElement('script');
			script.src = `${cdnhost}/${url}`;
			script.async = true;
			document.head.appendChild(script);
		});
		setTimeout(InitializeMermaid, 1000);
	}, 0);

	function InitializeMermaid() {
		mermaid.initialize({
			'securityLevel': 'loose',
			'theme': 'base',
			'themeVariables': {
				'darkMode': true,
				'background': '#2626A8',
				'primaryColor': '#1f910d'
			}
		});
		(function WatchForMermaidUpdates() {
			'use strict';
			document.querySelectorAll('.mermaid:not([data-processed])').forEach(e => {
				mermaid.init({ 'theme': 'base', 'themeVariables': { 'darkMode': true } }, e);
			});
			setTimeout(WatchForMermaidUpdates, 1000);
		})();
		(function WatchForPrismUpdates(){
			'use strict';
			document.querySelectorAll('pre:not([class*=language]) > code[class*=language]').forEach(e => {
				Prism.highlightElement(e);
			});
			setTimeout(WatchForPrismUpdates, 1000);
		})();
	}

	(function DisableHrefClickFromLoading() {
		'use strict';
		document.body.addEventListener("click", (ev) => {
			try {
				let anchor = ev.target.closest('a');
				if (anchor == null) { return; }
				let href = anchor.href;
				if (href == null) { return; }
				if (href === 'javascript:void(0)') {
					ev.preventDefault();
					return false;
				}
				if (href[0] === '/' || href.slice(0, origin.length).toLowerCase() === origin) {
					ev.preventDefault();
					DotNet.invokeMethodAsync("StoicDreams.BlazorFramework", "CallNavigation", href);
					return false;
				}
				if (href.slice(0, 4) === 'http') {
					anchor.target = "_blank";
					return true;
				}
			} catch (ex) {
				return false;
			}
		});
		document.getElementById('app').className = '';
	})();

	// The rest of the code in this file is in the process of being deprecated and will be removed once all functionality has been replace by Blazor components.

	function LogDebug() {
		if (!DebugEnabled) { return; }
		if (arguments.length < 2) { return; }
		let writer = console.log, args = [], startIndex = 0;
		if (typeof arguments[0] === 'function') {
			writer = arguments[0];
			startIndex = 1;
		}
		for (let i = startIndex; i < arguments.length; ++i) {
			args.push(arguments[i]);
		}
		writer(args);
	}

	const SeverityLevel = {
		Verbose: 0,
		Information: 1,
		Warning: 2,
		Error: 3,
		Critical: 4
	};

	let Popup = null;
	const PopupProcessor = {
		Open: (url) => {
			if (Popup == null || Popup.closed) {
				Popup = open(url, '_blank', 'width=800;height=500');
			} else {
				Popup.location.href = url;
			}
		},
		Close: () => {
			if (Popup === null) { return; }
			Popup.close();
		},
		IsOpen: () => {
			return Popup != null && !Popup.closed;
		}
	};

	let domScript = null;

	const addedLinks = {};
	const DotNetRef = {};
	function ClassesContainClass(classes, subClass) {
		for (let i = 0; i < classes.length; ++i) {
			if (classes[i] === subClass) {
				return true;
			}
		}
		return false;
	}
	let scriptTags = {};
	function uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	(function checkForScriptTags() {
		let results = document.querySelectorAll('.page script:not([id])');
		results.forEach(scriptTag => {
			try {
				let key = scriptTag.src + scriptTag.innerText;
				if (!key) { return; }
				scriptTag.remove();
				if (key in scriptTags && scriptTags[key].parentElement) {
					scriptTags[key].remove();
				}
				let ele = document.createElement('script');
				if (scriptTag.src) { ele.src = scriptTag.src; }
				if (scriptTag.innerText) { ele.innerText = scriptTag.innerText; }
				ele.id = uuid();
				scriptTags[key] = ele;
				document.querySelector('.page').append(ele);
			} catch {}
		});
		setTimeout(checkForScriptTags, 300);
	})();
	class Interop {
		constructor() {
		}
		// Used to map C# methods to be accessible from Javascript
		ApplyReference = function (dotNetObjRef, key) {
			console.log("Apply Reference", key, dotNetObjRef);
			DotNetRef[key] = dotNetObjRef;
		}
		AddAlert(message, severity, requireAcknowledgment) {
			let sevId = parseInt(severity) || 0;
			//DotNet.invokeMethodAsync("StoicDreams.TaskProxy.Maui", "AddAlert", message, sevId, !!requireAcknowledgment);
			DotNetRef['AddAlert'].invokeMethodAsync("Add", message, sevId, !!requireAcknowledgment);
		}
		InvokeMethod(key, method, ...args) {
			if (!DotNetRef[key]) { return; }
			return DotNetRef[key].invokeMethodAsync(method, ...args);
		}
		AddLink(href) {
			if (addedLinks[href]) { return; }
			addedLinks[href] = true;
			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = href;
			document.body.appendChild(link);
		}
		UpdateTitle(title) {
			document.title = title;
		}
		ScrollTo(selector, position, smooth = false) {
			let els = document.querySelector(selector);
			if (els === null) { return false; }
			if (smooth) { els.scrollTo({ top: position, behavior: 'smooth' }); }
			else { els.scrollTop = position; }
			return true;
		}
		AddClass(selector, value) {
			console.log(`Add Class ${selector} ${value}`);
			let els = document.querySelectorAll(selector);
			if (els.length === 0) { return false; }
			els.forEach(el => {
				if (!ClassesContainClass(el.className, value)) {
					let classes = el.className.split(' ');
					classes.push(value);
					el.className = classes.join(' ');
				}
			});
			return true;
		}
		RemoveClass(selector, value) {
			let els = document.querySelectorAll(selector);
			if (els.length === 0) { return false; }
			els.forEach(el => {
				if (ClassesContainClass(el.className, value)) {
					let classes = el.className.split(' ');
					for (let i = 0; i < classes.length; ++i) {
						if (classes === value) {
							classes.splice(i--, 1);
						}
					}
					el.className = classes.join(' ');
				}
			});
			return true;
		}
		SetClass(selector, value) {
			let els = document.querySelectorAll(selector);
			if (els.length === 0) { return false; }
			els.forEach(el => {
				el.className = value;
			});
			return true;
		}
		SetupAppInsightsLogging(appInsightSettings) {
			try {
				if (!appInsightSettings || appInsightSettings === 'null') { return; }
				const settings = JSON.parse(appInsightSettings);
				if (!settings.instrumentationKey) { return; }
				const sdkInstance = "appInsightsSDK";
				window[sdkInstance] = "appInsights";
				const aiName = window[sdkInstance], aisdk = window[aiName] || function (e) { function n(e) { t[e] = function () { var n = arguments; t.queue.push(function () { t[e].apply(t, n) }) } } var t = { config: e }; t.initialize = !0; var i = document, a = window; setTimeout(function () { var n = i.createElement("script"); n.src = e.url || "https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js", i.getElementsByTagName("script")[0].parentNode.appendChild(n) }); try { t.cookie = i.cookie } catch (e) { } t.queue = [], t.version = 2; for (var r = ["Event", "PageView", "Exception", "Trace", "DependencyData", "Metric", "PageViewPerformance"]; r.length;)n("track" + r.pop()); n("startTrackPage"), n("stopTrackPage"); var s = "Track" + r[0]; if (n("start" + s), n("stop" + s), n("addTelemetryInitializer"), n("setAuthenticatedUserContext"), n("clearAuthenticatedUserContext"), n("flush"), t.SeverityLevel = { Verbose: 0, Information: 1, Warning: 2, Error: 3, Critical: 4 }, !(!0 === e.disableExceptionTracking || e.extensionConfig && e.extensionConfig.ApplicationInsightsAnalytics && !0 === e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)) { n("_" + (r = "onerror")); var o = a[r]; a[r] = function (e, n, i, a, s) { var c = o && o(e, n, i, a, s); return !0 !== c && t["_" + r]({ message: e, url: n, lineNumber: i, columnNumber: a, error: s }), c }, e.autoExceptionInstrumented = !0 } return t }(settings);
				window[aiName] = aisdk, aisdk.queue && 0 === aisdk.queue.length && aisdk.trackPageView({});
			} catch (ex) {
				console.error('Failed to load App Insights settings', appInsightSettings, ex);
			}
		}
		Log = {
			Console: (json) => {
				const decoded = JSON.parse(json);
				console.log(decoded);
			},
			TrackTrace: (message, mappedData, severityLevel = SeverityLevel.Information) => {
				LogDebug(console.log, message, JSON.parse(mappedData), severityLevel);
				if (!window || !window.appInsights || !window.appInsights.trackTrace) { return; }
				window.appInsights.trackTrace({ message: message, properties: JSON.parse(mappedData), severityLevel: severityLevel });
			},
			TrackException: (message, mappedData) => {
				LogDebug(console.error, message, JSON.parse(mappedData));
				if (!window || !window.appInsights || !window.appInsights.trackException) { return; }
				window.appInsights.trackException({ exception: new Error(message), properties: JSON.parse(mappedData) });
			},
			TrackEvent: (name, mappedData) => {
				LogDebug(console.info, name, JSON.parse(mappedData));
				if (!window || !window.appInsights || !window.appInsights.trackEvent) { return; }
				window.appInsights.trackEvent({ name: name, properties: JSON.parse(mappedData) });
			},
			SetAuthenticatedUser: (loginId) => {
				if (!window || !window.appInsights || !window.appInsights.setAuthenticatedUser) { return; }
				let validatedId = loginId.replace(/[,;=| ]+/g, "_");
				window.appInsights.setAuthenticatedUser(validatedId);
			}

		}
		RunScript(scriptToRun) {
			if (domScript != null) {
				domScript.parentElement.removeChild(domScript);
				domScript = null;
			}
			if (scriptToRun == null) { return; }
			domScript = document.createElement('script');
			domScript.innerHTML = scriptToRun;
			document.head.append(domScript);
		}
		Popup = PopupProcessor
	}
	return new Interop();
})();
