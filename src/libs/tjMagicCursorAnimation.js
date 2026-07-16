// ─────────────────────────────────────────────────────────────────────────────
// tjMagicCursorAnimation — RAF-throttled custom cursor
//
// Main-thread improvement: the `mousemove` handler now only writes style
// inside a requestAnimationFrame callback. This means:
//   • DOM style writes are batched with the browser's paint cycle
//   • The handler never blocks the main thread between frames
//   • `transform` stays on the compositor thread (no layout/paint triggered)
// ─────────────────────────────────────────────────────────────────────────────

const tjMagicCursorAnimation = () => {
	if (typeof window === "undefined") return;

	// Keep track of all listeners we add for cleanup
	const listeners = [];

	// Utility: add and track event listeners
	function onAll(selector, event, handler) {
		document.querySelectorAll(selector).forEach(el => {
			el.addEventListener(event, handler, { passive: true });
			listeners.push({ el, event, handler });
		});
	}

	// ── Slider drag cursor size ───────────────────────────────────────────────
	onAll(".slider-drag", "mouseenter", () => {
		document.querySelectorAll(".mouseCursor").forEach(el => el.classList.add("cursor-big"));
	});
	onAll(".slider-drag", "mouseleave", () => {
		document.querySelectorAll(".mouseCursor").forEach(el => el.classList.remove("cursor-big"));
	});

	// ── Hide cursor on links and submenu ─────────────────────────────────────
	onAll("a, .sub-menu", "mouseenter", () => {
		document.querySelectorAll(".mouseCursor, .tj-cursor").forEach(el => el.classList.add("d-none"));
	});
	onAll("a, .sub-menu", "mouseleave", () => {
		document.querySelectorAll(".mouseCursor, .tj-cursor").forEach(el => el.classList.remove("d-none"));
	});

	// ── Hide cursor on project slider ────────────────────────────────────────
	onAll(".project-slider-one", "mouseenter", () => {
		document.querySelectorAll(".mouseCursor").forEach(el => el.classList.add("d-none"));
	});
	onAll(".project-slider-one", "mouseleave", () => {
		document.querySelectorAll(".mouseCursor").forEach(el => el.classList.remove("d-none"));
	});

	// ── Project cursor style ─────────────────────────────────────────────────
	onAll(".view-project", "mouseenter", () => {
		document.querySelectorAll(".mouseCursor").forEach(el => el.classList.add("project-cursor"));
	});
	onAll(".view-project", "mouseleave", () => {
		document.querySelectorAll(".mouseCursor").forEach(el => el.classList.remove("project-cursor"));
	});

	// ── Custom cursor with RAF-throttled mousemove ───────────────────────────
	function itCursor() {
		const myCursor = document.querySelector(".mouseCursor");
		if (!myCursor) return;

		const inner = document.querySelector(".cursor-inner");
		const outer = document.querySelector(".cursor-outer");
		if (!inner || !outer) return;

		let isHovering = false;
		let rafId = null;
		// Latest mouse coords — updated on every event, applied in RAF
		let pendingX = 0;
		let pendingY = 0;

		// RAF-throttled handler: reads coords in the event, writes in RAF
		const mouseMoveHandler = e => {
			pendingX = e.clientX;
			pendingY = e.clientY;

			if (rafId) return; // already scheduled — skip
			rafId = requestAnimationFrame(() => {
				rafId = null;
				if (!isHovering) {
					outer.style.transform = `translate(${pendingX}px, ${pendingY}px)`;
				}
				inner.style.transform = `translate(${pendingX}px, ${pendingY}px)`;
			});
		};

		window.addEventListener("mousemove", mouseMoveHandler, { passive: true });
		listeners.push({ el: window, event: "mousemove", handler: mouseMoveHandler });

		// Hover effect on interactive elements
		onAll("button, a, .cursor-pointer", "mouseenter", () => {
			inner.classList.add("cursor-hover");
			outer.classList.add("cursor-hover");
			isHovering = true;
		});
		onAll("button, a, .cursor-pointer", "mouseleave", ev => {
			if (
				!(ev.target.closest("a") || ev.target.closest("button")) &&
				!ev.target.closest(".cursor-pointer")
			) {
				inner.classList.remove("cursor-hover");
				outer.classList.remove("cursor-hover");
			}
			isHovering = false;
		});

		inner.style.visibility = "visible";
		outer.style.visibility = "visible";
	}

	itCursor();

	// ── Cleanup ──────────────────────────────────────────────────────────────
	return () => {
		listeners.forEach(({ el, event, handler }) => {
			el.removeEventListener(event, handler);
		});
	};
};

export default tjMagicCursorAnimation;
