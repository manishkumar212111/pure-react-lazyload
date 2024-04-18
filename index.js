'use strict';

import React, { useEffect, useState, useRef } from 'react';

/**
 * useElementOnScreen
 *
 * Hook to lazy load an element on screen.
 *
 * @param {Object} options Options
 * @param {Object} options.root Element that is used as the viewport for checking visibility of the target.
 * @param {String} options.rootMargin Margin around the root.
 * @param {Number} options.threshold Indicates at what percentage of the target's visibility the observer's callback should be executed.
 * @param {Object} options.rest Other options for the IntersectionObserver.
 *
 * @returns {Array} Ref, isVisible
 */
const useElementOnScreen = (options = {}) => {
	const ref = useRef(null); // Reference to the element that should be observed
	const [isVisible, setIsVisible] = useState(false); // Whether the element is visible

	/**
	 * Callback function for the IntersectionObserver
	 *
	 * @param {Array} entries Array of intersection observer entries
	 */
	const callbackFunction = entries => {
		const [entry] = entries;
		if (entry) {
			setIsVisible(entry.isIntersecting); // Update the isVisible state
		} else {
			console.warn('useElementOnScreen: entry not provided');
		}
	}

	useEffect(() => {
		// Destructure the options object
		const {
			root = null,
			rootMargin = '0px',
			threshold = 0.75,
			...rest
		} = options;

		// Check if we have a ref to an element
		if (ref.current) {
			const observer = new IntersectionObserver(callbackFunction, { root, rootMargin, threshold, rest }); // Create an intersection observer
			observer.observe(ref.current); // Observe the element
		} else {
			console.warn('useElementOnScreen: no ref.current found');
		}

		// Unobserve the element when the component is unmounted
		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			} else {
				console.warn('useElementOnScreen: no ref.current found');
			}
		}
	}, [ref, options]); // eslint-disable-line react-hooks/exhaustive-deps

	return [ref, isVisible];
}

export default useElementOnScreen;