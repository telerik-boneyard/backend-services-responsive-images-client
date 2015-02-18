/**
 * @fileOverview Telerik Backend Services Responsive Images JavaScript API
 * @author Telerik Backend Services
 * @version: 0.1.0
 */
;
(function (ns, window, document, undefined) {
    /**
     * @class EverliveImages
     * @classdesc The Responsive Images JavaScript component provides a JavaScript API to quickly make your JavaScript applications responsive.
     */

    'use strict';

    /**
     * An object that will receive the new properties in
     * result of extending API default settings.
     * @type {Object}
     */
    var options = {};

    /**
     * Private API settings.
     *
     * @constant
     * @member settings
     * @property {String}  dataSrc        Image data-src attribute name
     * @property {String}  dataDpi        Image data-resimg-dpi attribute name
     * @property {String}  urlTemplate    URL template
     */
    var settings = {
        dataSrc: 'data-src',
        dataDpi: 'data-resimg-dpi',
        urlTemplate: '[protocol][hostname][apikey]/[operations][url]'
    };

    /**
     * Configurations defaults, can be overridden at initialization time.
     *
     * @member defaults
     * @property {String}    server        Image server URL
     * @property {String}    apiKey        Backend Services API Key
     * @property {Boolean}   resOnLoad     Resize images automatically once the page has fully loaded
     * @property {Boolean}   resOnResize   Resize images automatically on browser resize / device rotation
     * @property {Boolean}   ssl           Generates https requests
     * @property {String}    resClass      The class name that identifies which elements to be processed
     * @property {Function}  onReady       A function to execute after images processing are ready
     * @property {Function}  onError       A function to execute when image loading error occurred
     * @property {Boolean}   debug         Run in debugging mode
     */
    var defaults = {
        server: 'bs1.cdn.telerik.com/image/v1/',
        apiKey: '',
        resOnLoad: true,
        resOnResize: true,
        ssl: false,
        resClass: 'resimgs',
        onReady: null,
        onError: null,
        debug: false
    };

    var _ = {
        /**
         * Check if an element exists in array using a comparer function.
         *
         * @private
         * @method inArray
         * @param {Array} array the array of items
         * @param  {Function} comparer The function to process each item against.
         * @return {Boolean}           True if item is in Array
         */
        inArray: function inArray(array, comparer) {
            var i = 0,
                ii = array.length;
            for (; i < ii; i++) {
                if (comparer(array[i])) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Executes a provided function once per array element.
         *
         * @private
         * @method each
         * @param {Array} array of elements to iterate over.
         * @param  {Function} fn Function to execute for each element
         */
        each: function each(array, fn) {
            if (array === void 0 || array === null) {
                throw new TypeError();
            }
            var t = Object(array);
            var len = t.length >>> 0;
            if (typeof fn !== 'function') {
                throw new TypeError();
            }
            var thisArg = arguments.length >= 3 ? arguments[2] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t)
                    fn.call(thisArg, t[i], i, t);
            }
        },
        /**
         * Determines whether its argument represents a numeric value.
         *
         * @private
         * @method isStringNumber
         * @return {Boolean} If argument is a number, it returns true. Otherwise it returns false.
         */
        isStringNumber: function (string) {
            return !isNaN(parseFloat(string)) && isFinite(string);
        },

        /**
         * Returns an array of a given object's own enumerable properties,
         * in the same order as that provided by a for...in loop.
         *
         * @private
         * @method keys
         * @return {Array} Array whose elements are strings corresponding to the enumerable properties found directly upon object.
         */
        keys: (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({
                    toString: null
                }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
                var result = [];
                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }
                if (hasDontEnumBug) {
                    for (var i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    }
                }
                return result;
            };
        })(),

        /**
         * Merge the contents of two or more objects together.
         *
         * @private
         * @method extend
         * @param  {Object} out An object that will receive the new properties if additional objects are passed in.
         * @return {Object}     Merged object
         */
        extend: function (out) {
            out = out || {};
            var i = 1,
                ii = arguments.length;
            for (; i < ii; i++) {
                if (!arguments[i]) {
                    continue;
                }
                for (var key in arguments[i]) {

                    if (arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }
            return out;
        },


        /**
         * Check if given string is undefined, null, or empty string.
         *
         * @private
         * @method isNullOrEmpty
         * @param  {String}  value Tested string
         * @return {Boolean}       Return true if string is null, empty or undefined
         */
        isNullOrEmpty: function (value) {
            return typeof value === 'undefined' || value === null || value === '';
        },

        /**
         * Returns a function, that, as long as it continues to be invoked, will not
         * be triggered. The function will be called after it stops being called for
         * N milliseconds. If `execAsap` is passed, trigger the function on the
         * leading edge, instead of the trailing.
         *
         * @private
         * @method debounce
         * @param  {Function} fn         Function to be invoked
         * @param  {Number}   threshold  Detection period
         * @param  {Boolean}  execAsap   indicating whether the signal should happen at the beginning of the detection period (true) or the end.
         */
        debounce: function (fn, threshold, execAsap) {
            var timeout;

            return function debounced() {
                var obj = this,
                    args = arguments;

                function delayed() {
                    if (!execAsap) fn.apply(obj, args);
                    timeout = null;
                }

                if (timeout) {
                    clearTimeout(timeout);
                } else if (execAsap) {
                    fn.apply(obj, args);
                }
                timeout = setTimeout(delayed, threshold || 100);
            };
        }

    };

    /**
     * Gives the values of all the CSS properties of an element after applying the active stylesheets
     * and resolving any basic computation those values may contain.
     *
     * @private
     * @method getComputedStyle
     * @param  {Object} el     An HTML element for which to get the computed style.
     * @param  {String} pseudo A string specifying the pseudo-element to match. Must be omitted (or null) for regular elements.
     * @return {Object}        CSSStyleDeclaration object.
     */
    window.getComputedStyle = window.getComputedStyle || function (el, pseudo) {
        this.el = el;
        this.getPropertyValue = function (prop) {
            var re = /(\-([a-z]){1})/g;
            if (prop == 'float') {
                prop = 'styleFloat';
            }
            if (re.test(prop)) {
                prop = prop.replace(re, function () {
                    return arguments[2].toUpperCase();
                });
            }
            return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        return this;
    };

    /**
     * Returns an array of all child elements which have all of the given class names.
     * When called on the document object, the complete document is searched, including the root node.
     *
     * @private
     * @method getElementByClassName
     * @param  {String} search Class name to match.
     * @return {Array}         All found elements.
     */
    document.getElementsByClassName = document.getElementsByClassName || function (search) {
        var elements,
            pattern,
            i,
            results = [];
        if (document.querySelectorAll) { // IE8
            return document.querySelectorAll('.' + search);
        }
        if (document.evaluate) { // IE6, IE7
            pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
            elements = document.evaluate(pattern, document, null, 0, null);
            while ((i = elements.iterateNext())) {
                results.push(i);
            }
        } else {
            elements = document.getElementsByTagName('*');
            pattern = new RegExp('(^|\\s)' + search + '(\\s|$)');
            for (i = 0; i < elements.length; i++) {
                if (pattern.test(elements[i].className)) {
                    results.push(elements[i]);
                }
            }
        }
        return results;
    };

    /**
     * Check if given string is equal to 'img'.
     *
     * @private
     * @method isImageTag
     * @param  {String}  tag Tested string
     * @return {Boolean}     Return true if string is 'img'
     */
    var isImageTag = function (tag) {
        return tag === 'img';
    };

    /**
     * Check if API Key is set by user.
     *
     * @private
     * @method isApiKey
     * @return {Boolean} Return true if API Key is set
     */
    var isApiKey = function () {
        var apiKey = options.apiKey,
            isApiKeyEmpty = _.isNullOrEmpty(apiKey);

        if (isApiKeyEmpty) {
            console.log('Backend Services API Key is not set.');
            return false;
        }
        if (!isApiKeyEmpty && typeof apiKey !== 'string') {
            console.log('Backend Services API Key should be a String');
            return false;
        }
        return true;
    };

    var Logger = {
        log: function () {
            if (options.debug && console && typeof console.log === 'function') {
                var i = 0,
                    ii = arguments.length;
                for (; i < ii; i++) {
                    console.log(arguments[i]);
                }
            }
        }
    };

    /**
     * Get protocol type based on user configuration.
     *
     * @private
     * @method getProtocol
     * @param  {Boolean} ssl
     * @return {String}      Protocol type
     */
    var getProtocol = function (ssl) {
        return ssl ? 'https://' : 'http://';
    };

    /**
     * Get device pixel ratio.
     *
     * @private
     * @method getDevicePixelRatio
     * @return {Number} Device pixel ratio
     */
    var getDevicePixelRatio = function () {
        return window.devicePixelRatio ? window.devicePixelRatio : 1;
    };

    /**
     * Get image pixel ratio based on element data-resimg-dpi attribute.
     *
     * @private
     * @method getPixelRatio
     * @param  {Object} el An HTML element
     * @return {Number|Boolean}
     */
    var getPixelRatio = function (el) {
        var pixelDensity = getAttr(el, settings.dataDpi) || '';
        return pixelDensity !== '' ? _.isNumber(pixelDensity) ? parseFloat(pixelDensity) : false : getDevicePixelRatio();
    };

    /**
     * Get all images from DOM by Responsive images class name.
     *
     * @private
     * @method getImagesByClassName
     * @return {Object} A list of elements
     */
    var getImagesByClassName = function () {
        return document.getElementsByClassName(options.resClass);
    };

    /**
     * Get element data attribute.
     *
     * @private
     * @method getAttr
     * @param  {Object} el   An HTML element
     * @param  {String} attr Name of data attribute
     * @return {String|Boolean}   Value of data attribute or `false` if there is no data attribute
     */
    var getAttr = function (el, attr) {
        var elAttr = el.getAttribute(attr);
        return elAttr || false;
    };

    /**
     * Check if element contains specific class name.
     *
     * @private
     * @method hasClass
     * @param  {Object}  el An HTML element
     * @param  {String}  cl Class name
     * @return {Boolean}    True if element already contains class name
     */
    var hasClass = function (el, cl) {
        var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
        return !!el.className.match(regex);
    };

    var convertToDomObject = function (items) {
        var newItems = [];
        _.each(items, function (item, i) {
            newItems.push(item[0]);
        });

        return newItems;
    };

    /**
     * Calculate width of the image container.
     *
     * @private
     * @method getImageWidth
     * @param  {Object} el An HTML element
     * @return {Number}    Calculated width
     */
    var getImageWidth = function (el) {
        var parentEl = el.parentNode,
            parentWidth = parentEl.offsetWidth,
            itemStyle = window.getComputedStyle(parentEl, null),
            pl = parseFloat(itemStyle.getPropertyValue('padding-left')),
            pr = parseFloat(itemStyle.getPropertyValue('padding-right')),
            bl = parseFloat(itemStyle.getPropertyValue('border-left-width')),
            br = parseFloat(itemStyle.getPropertyValue('border-right-width'));
        return Math.abs(parentWidth - Math.ceil(pl + pr + bl + br));
    };

    /**
     * Get element width in case of responsive background image.
     *
     * @private
     * @method getBackgroundWidth
     * @param  {Object} el An HTML element
     * @return {Number}    Element width
     */
    var getBackgroundWidth = function (el) {
        return Math.ceil(el.offsetWidth);
    };

    /**
     * Get background image src from computed element style.
     *
     * @private
     * @method getBackgroundSrc
     * @param  {Object} el An HTML element
     * @return {String}      URL string
     */
    var getBackgroundSrc = function (el) {
        var elStyle = window.getComputedStyle(el, null),
            backgrImage = elStyle.getPropertyValue('background-image');
        return backgrImage !== 'none' ? backgrImage : false;
    };

    /**
     * Extract user operations parameters from given string.
     *
     * @private
     * @method parseParamsString
     * @param  {String} str URL string
     * @return {Object}     Operations parameters
     */
    var parseParamsString = function (str) {
        if (!str || typeof str === 'undefined' || str.length <= 1) {
            return false;
        }
        var isUserResize = false,
            params = [],
            tmp = str.split('/'),
            ii = tmp.length,
            i = 0;
        for (; i < ii; i++) {
            var item = tmp[i].split('='),
                tmpObj = {};
            if (typeof item[1] === 'undefined') {
                item[1] = false;
            } else {
                item[1] = unescape(item[1].replace(/\+/g, ' '));
            }
            tmpObj[item[0]] = item[1];
            params.push(tmpObj);
            if (item[0] === 'resize') {
                isUserResize = true;
            }
        }
        return {
            params: params,
            isUserResize: isUserResize
        };
    };

    /**
     * Parse image SRC
     *
     * @private
     * @method getImgParams
     * @param  {String} src Image SRC
     * @return {Object}     Original image URL and Image operations
     */
    var getImgParams = function (src) {
        var operations = '',
            imgUrl = src.replace(/.*?resize=[^//]*\//gi, ''), //src.replace(/.*?:\/\//g, ''),
            protocolRe = new RegExp('https?://', 'gi'),
            serverRe = new RegExp(options.server, 'gi'),
            apiKeyRe = new RegExp(options.apiKey + '/', 'gi');

        operations = src.replace(imgUrl, '').replace(protocolRe, '').replace(serverRe, '').replace(apiKeyRe, '').toLowerCase();
        if (operations !== '') {
            operations = operations.indexOf('/') ? operations.substring(0, operations.length - 1) : operations;
        } else {
            operations = false;
        }
        operations = parseParamsString(operations);
        // If it's a user resize operation, use the passed url in the data-src property
        if (operations.isUserResize) {
            imgUrl = src;
        }

        return {
            imgUrl: imgUrl,
            operations: operations.params,
            isUserResize: operations.isUserResize
        };
    };

    /**
     * Convert Image parameters object to string.
     *
     * @private
     * @method getImgParamsString
     * @param  {Object} params Image parameters object
     * @return {String}        Image parameters as string
     */
    var getImgParamsString = function (image, params) {
        var paramsStr = '',
            i = 0,
            ii = params.length;
        for (; i < ii; i++) {
            var item = params[i],
                key = _.keys(item)[0],
                value;
            if (!isImageTag(image.tag) && key === 'resize') {
                continue;
            }
            var pixelDensity = getPixelRatio(image.item);
            pixelDensity = (pixelDensity) ? ',pd:' + pixelDensity : '';
            for (var k in item) {
                value = (key === 'resize') ? item[k] + pixelDensity : item[k];
            }
            paramsStr += key + '=' + value + '/';
        }
        return paramsStr;
    };

    /**
     * Get Image URL with included resize parameters and pixel density.
     *
     * @private
     * @method getImgSrc
     * @param  {Object} image The image object
     * @param  {Number} imgWidth Image container width
     * @return {String}          Image SRC (Image server URL, API Key, operations parameters and Image URL)
     */
    var getImgSrc = function (image, imgWidth) {
        var protocol = getProtocol(options.ssl),
            server = options.server,
            apiKey = options.apiKey,
            url = settings.urlTemplate,
            pixelDensity = getPixelRatio(image.item);

        pixelDensity = pixelDensity ? ',pd:' + pixelDensity : '';

        url = url.replace('[protocol]', protocol);
        url = url.replace('[apikey]', apiKey ? apiKey : '');
        url = url.replace('[hostname]', server);

        var params = image.operations || false;
        if (params) {
            var operations = '';
            params = getImgParamsString(image, params);
            if (isImageTag(image.tag)) {
                operations = imgWidth ? 'resize=w:' + imgWidth + pixelDensity + '/' + params : params;
            } else {
                operations = 'resize=w:' + imgWidth + pixelDensity + '/' + params;
            }
            url = url.replace('[operations]', operations);
        } else {
            url = url.replace('[operations]', 'resize=w:' + imgWidth + pixelDensity + '/');
        }
        url = url.replace('[url]', image.imgUrl);

        return url;
    };

    /**
     * Set Image SRC attribute.
     *
     * @private
     * @method setImageSrc
     * @param {Object}   el       An HTML element
     * @param {String}   src      Image SRC
     * @param {String}   tag      Element tag name
     * @param {Function} callback Invoke callback after SRC is set to element
     */
    var setImageSrc = function (el, src, tag, callback) {
        var img = new Image();

        img.onerror = function () {
            Logger.log('ERROR: Can\'t be loaded: ' + this.src);
            var isOnError = options.onError && typeof options.onError === 'function';
            if (isOnError) {
                options.onError(el);
            }

            var isCallback = callback && typeof callback === 'function';
            if (isCallback) {
                callback(el); // pass element with error.
            }
        };
        img.onload = function () {
            if (isImageTag(tag)) {
                el.src = src;
                el.style.visibility = 'visible';
            } else {
                el.style.backgroundImage = 'url(' + src + ')';
            }
            var isCallback = callback && typeof callback === 'function';
            if (isCallback) {
                callback();
            }
        };
        img.src = src;
    };

    /**
     * Get all HTML elements with responsive image class.
     *
     * @private
     * @method getAllImages
     * @param  {Object} items HTML elements
     */
    var getAllImages = function (items) {
        if (!isApiKey()) return;

        items = items || getImagesByClassName();

        return items;
    };

    var wrapImages = function(images) {
        var imageItems = [];
        _.each(images, function (item, i) {
            var tag = item.tagName.toLowerCase();
            imageItems.push({
                item: item,
                tag: tag
            });
        });

        return imageItems;
    };

    /**
     * Loop trough and process all selected.
     *
     * @private
     * @method processAllImages
     */
    var processImages = function (images) {
        var processedImagesCount = 0;
        var imagesCount = images.length;

        var successfullyProcessedImages = [];
        _.each(images, function (item) {
            processSingleImage(item, function imageProcessedCallback(err, element, src, tag) {
                processedImagesCount++;

                if (!err) {
                    successfullyProcessedImages.push(element);
                }

                if (processedImagesCount === imagesCount) {
                    _triggerOnReady(successfullyProcessedImages, options);
                }
            });
        });
    };

    /**
     * Collects the processed images and triggers onReady event.
     *
     * @private
     * @method processSingleImage
     * @param  {Object} object Component options object
     */
    var _triggerOnReady = function (successfullyProcessedImages, options) {
        var isOnReady = options.onReady && typeof options.onReady === 'function';
        if (isOnReady) {
            options.onReady({
                count: successfullyProcessedImages.length,
                items: successfullyProcessedImages
            });
        }
    };

    /**
     * Check if image is already processed.
     * If not, the image will be processed.
     *
     * @private
     * @method processSingleImage
     * @param  {Object} image  The image for processing
     * @return {Boolean}   Return true if image is processed
     */
    var processSingleImage = function (image, imageProcessedCallback) {
        var element = image.item,
            tag = image.tag;

        var isImage = isImageTag(tag),
            dataSrc,
            imgParams,
            imgWidth;

        if (isImage) {
            dataSrc = getAttr(element, settings.dataSrc);
        } else {
            dataSrc = getBackgroundSrc(element);
            dataSrc = dataSrc.replace(/url\(('?"?)(.*?)\1\)/gi, '$2');
        }

        if (dataSrc) {
            imgParams = getImgParams(dataSrc);
            image.operations = imgParams.operations;
            image.imgUrl = imgParams.imgUrl;
            image.isUserResize = imgParams.isUserResize;
        } else {
            if (isImage) {
                Logger.log('ERROR: No data-src attribute: ' + element.outerHTML);
            } else {
                Logger.log('ERROR: No background-image: ' + element.outerHTML);
            }
            return;
        }

        if (!image.isUserResize) {
            imgWidth = (!isImage) ? getBackgroundWidth(element) : getImageWidth(element);
        }

        imgWidth = imgWidth ? imgWidth : false;

        if (!imgWidth && !image.isUserResize) { // we don't have the width of the user image either.
            // if this element is not visible, we don't have to process it.
            if (imageProcessedCallback && typeof imageProcessedCallback === 'function') {
                imageProcessedCallback("element is skipped, because it's not visible.", element, src, tag);
            }

            return false;
        }

        var src = image.isUserResize ? image.imgUrl : getImgSrc(image, imgWidth);

        setImageSrc(element, src, tag, function (err) {
            if (imageProcessedCallback && typeof imageProcessedCallback === 'function') {
                imageProcessedCallback(err, element, src, tag);
            }
        });
        return true;
    };

    /**
     * Listen for window resize event.
     *
     * @private
     * @method onWindowResize
     * @param  {Function} fn Function to be invoked on resize event
     */
    var onWindowResize = function (fn) {
        if (window.addEventListener) {
            window.addEventListener('resize', _.debounce(fn), false);
        } else if (window.attachEvent) {
            window.attachEvent('onresize', _.debounce(fn));
        }
    };

    /**
     * Check if API Key is set, trigger Responsive images and extends configuration object.
     *
     * @public
     * @method init
     * @name init
     * @memberof EverliveImages
     * @param {String} apiKey API Key is a unique identifier for the Telerik Backend Services application.
     */
    /**
     * Check if API Key is set, trigger Responsive images and extends configuration object.
     *
     * @public
     * @method init
     * @memberof EverliveImages
     * @param {Object} config User configuration object
     * @param {String} config.apiKey API Key is a unique identifier for the Telerik Backend Services application.
     * @param {Boolean} [config.resOnLoad=true] Resize images automatically once the page has fully loaded.
     * @param {Boolean} [config.resOnResize=true] Resize images automatically on browser resize or device rotation.
     * @param {Boolean} [config.ssl=false] The URI scheme to be used when making requests. Change it to "true" in order to have encrypted communication between the client and the server.
     * @param {String} [config.resClass='resimgs'] User configuration object
     * @param {Function} [config.onReady=null] A function to be invoked after all selected images are processed. Returns an object with the processed images.
     * @param {Function} [config.onError=null] You can configure a custom error handler to be invoked if an error occurs when loading an image. Returns the image that failed to load.
     * @param {Boolean} [config.debug=false] When the debug flag is set to true, Responsive Images JavaScript component prints helpful log statements to the browser console about the images detected on your page.
     */
    ns.init = function (config) {
        config = config || {};

        if (typeof config === 'string') {
            config = {apiKey: config};
        }

        options = _.extend({}, defaults, config);

        if (!isApiKey()) return;

        if (options.resOnLoad) {
            ns.responsiveAll();
        }
        if (options.resOnResize) {
            onWindowResize(ns.responsiveAll);
        }
    };

    /**
     * Give control over an image or set of images.
     * Any image element will be effected.
     *
     * @public
     * @method responsive
     * @memberof EverliveImages
     * @param {Object} items A HTMLElement or a HTMLCollection of elements
     */
    ns.responsive = function (items) {
        if (!items) {
            items = getAllImages();
        } else {
            if (!items.length && items.nodeType) {
                items = [items];
            } else if (items.length > 1 && !items[0].nodeType) {
                items = convertToDomObject(items);
            }
        }

        items = wrapImages(items);
        processImages(items);
    };

    /**
     * Trigger Responsive images manually.
     *
     * @public
     * @memberof EverliveImages
     * @method responsiveAll
     */
    ns.responsiveAll = function responsiveAll() {
        var images = getAllImages();
        images = wrapImages(images);
        processImages(images);
    }

}(window.everliveImages = window.everliveImages || {}, window, document));
