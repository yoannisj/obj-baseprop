'use strict';

// Universal Module defined using the 'returnExportsGlobal' patten:
// https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js

// Uses Node, AMD or browser globals to create a module. This pattern creates
// a global even when AMD is used. This is useful if you have some scripts
// that are loaded by an AMD loader, but they still want access to globals.

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return (root.CrossRefObject = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals
        root.CrossRefObject = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

// ============================================================================
// =ObjBaseProp
// ============================================================================

var defaults = {};

// =Constructor
// ============================================================================

var ObjBaseProp = function( props, options ) {
    this.options = Object.assign({}, defaults, options || {});
    this.props = props;
};

// =Static API
// ============================================================================

// =has( props, keypath[, options ])
// ----------------------------------------------------------------------------

ObjBaseProp.has = function( props, keypath, options )
{
    // inject option defaults
    options = Object.assign({}, defaults, options || {});

    return has(props, keypath, options);
};

// =get( props, keypath[, options ])
// ----------------------------------------------------------------------------

ObjBaseProp.get = function( props, keypath, options )
{
    // inject option defaults
    options = Object.assign({}, defaults, options || {});

    return get(props, keypath, options);
};

// =set( props, keypath, value[, options ])
// ----------------------------------------------------------------------------

ObjBaseProp.set function( props, keypath, value, options )
{
    // inject option defaults
    options = Object.assign({}, defaults, options || {});

    return set(props, keypath, value, options);
};

// =Instance API
// ============================================================================


// =has( keypath )
// ----------------------------------------------------------------------------

ObjBaseProp.prototype.has = function( keypath )
{
    return has(this.props, keypath, this.options);
};

// =get( keypath )
// ----------------------------------------------------------------------------

ObjBaseProp.prototype.get = function( keypath )
{
    return get(this.props, keypath, this.options);
};

// =set( keypath )
// ----------------------------------------------------------------------------

ObjBaseProp.prototype.set = function( keypath, value )
{
    return set(this.props, keypath, value, this.options);
};

// =Utils
// ============================================================================

ObjBaseProp.utils = {};

// =assignDeep( props, keypath, value[, options ])
// ----------------------------------------------------------------------------

ObjBaseProp.utils.assignDeep = function()
{
    var objs = Array.prototype.slice.call(arguments, 0),
        res = objs.shift(),
        obj, keys, key, val, curr;

    // make sure we start with an object
    if (!res || typeof res != 'object') res = {};

    while (objs.length)
    {
        obj = objs.shift();

        // ignore non-object-like arguments
        if (obj && typeof obj == 'object')
        {
            keys = Object.keys(obj);
            for (var i = 0, ln = keys.length; i<ln; i++)
            {
                key = keys[i];
                // ignore enumerable, none-own keyerties
                if (obj.hasOwnProperty(key))
                {
                    val = obj[key];

                    // recursively assign deep object keyerty values
                    if (val && typeof val == 'object' && res.hasOwnProperty(key) && (curr = res[key]) && typeof curr == 'object') {
                        res[key] = objectMerge(curr, val);
                    } else {
                        res[key] = val;
                    }
                }
            }
        }
    }

    // return resulting object
    return res;
};

// =Private API
// ============================================================================

// =has( props, keypath, options )
// ----------------------------------------------------------------------------

var has = function( props, keypath, options )
{
    // verify keypath argument
    if (typeof keypath != 'string') {
        throw new Error('ObjBaseProp.has(): Given `keypath` argument must be a string');
    }

    // inject option defaults
    options = Object.assign({}, defaults, options || {});

    var keys = keypath.split( options.splitChar ),
        // keep the last key aside
        key = keys.pop(),
        // get config value at fore-last level
        obj = get(props, keys, options);

    // return whether keypath leads to an object containing the last key
    return (obj && typeof obj == 'object' && key in obj);
};

// =get( props, keypath, options )
// ----------------------------------------------------------------------------

var get = function( props, keypath, options )
{
    var obj = props,
        key, df;

    while (obj && typeof obj == 'object' && keys.length)
    {
        // get defaults from current level
        df = obj[ options.baseKey ] || null;

        // get value from next level
        key = keys.shift();

        if (key in obj)
        {
            obj = obj[key];

            // inject defaults into retained value
            if (obj && typeof obj == 'object' && df && typeof df == 'object') {
                obj = ObjBaseProp.utils.assignDeep({}, df, obj);
            }
        }

        else {
            obj = null;
        }

    }

    return obj;
};

// =set( props, keypath, value, options )
// ----------------------------------------------------------------------------

var set = function( props, keypath, value, options )
{
    // verify keypath argument
    if (typeof keypath != 'string') {
        throw new Error('ObjBaseProp.set(): Given `keypath` argument must be a string');
    }
 
    var keys = keypath.split( options.splitChar ),
        lastKey = keys.pop(),
        obj = lvl = {},
        key;

    // build object for deep property to include
    while (obj && typeof obj == 'object' && keys.length)
    {
        key = keys.shift();
        if (!(key in lvl)) {
            lvl[key] = {};
        }

        lvl = lvl[key];
    }

    // set property value
    lvl[lastKey] = value;

    // update cached value for prop reference
    if (xObj.__refs__[keypath]) xObj.__refs__[keypath] = value;

    // and merge into existing values
    ObjBaseProp.utils.assignDeep(this.values, obj);

    return value;
};

// Export the CrossRefObject constructor
return ObjBaseProp;

}));