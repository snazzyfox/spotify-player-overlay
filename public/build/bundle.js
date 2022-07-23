
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    (function() {
        const env = {"CLIENT_ID":"0c72a96c58924386aa404c5deb33946b"};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    // eslint-disable-next-line func-names
    var kindOf = (function(cache) {
      // eslint-disable-next-line func-names
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    })(Object.create(null));

    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return Array.isArray(val);
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    var isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (kindOf(val) !== 'object') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    var isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    var isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} thing The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(thing) {
      var pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    }

    /**
     * Determine if a value is a URLSearchParams object
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    var isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     */

    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function} [filter]
     * @returns {Object}
     */

    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};

      destObj = destObj || {};

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    }

    /*
     * determines whether a string ends with the characters of a specified string
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     * @returns {boolean}
     */
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }


    /**
     * Returns new array from array like object
     * @param {*} [thing]
     * @returns {Array}
     */
    function toArray(thing) {
      if (!thing) return null;
      var i = thing.length;
      if (isUndefined(i)) return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }

    // eslint-disable-next-line func-names
    var isTypedArray = (function(TypedArray) {
      // eslint-disable-next-line func-names
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM,
      inherits: inherits,
      toFlatObject: toFlatObject,
      kindOf: kindOf,
      kindOfTest: kindOfTest,
      endsWith: endsWith,
      toArray: toArray,
      isTypedArray: isTypedArray,
      isFileList: isFileList
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    var prototype = AxiosError.prototype;
    var descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED'
    // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    var AxiosError_1 = AxiosError;

    var transitional = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    /**
     * Convert a data object to FormData
     * @param {Object} obj
     * @param {?Object} [formData]
     * @returns {Object}
     **/

    function toFormData(obj, formData) {
      // eslint-disable-next-line no-param-reassign
      formData = formData || new FormData();

      var stack = [];

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error('Circular reference detected in ' + parentKey);
          }

          stack.push(data);

          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value)) return;
            var fullKey = parentKey ? parentKey + '.' + key : key;
            var arr;

            if (value && !parentKey && typeof value === 'object') {
              if (utils.endsWith(key, '{}')) {
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
                // eslint-disable-next-line func-names
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }

            build(value, fullKey);
          });

          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }

      build(obj);

      return formData;
    }

    var toFormData_1 = toFormData;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError_1(
          'Request failed with status code ' + response.status,
          [AxiosError_1.ERR_BAD_REQUEST, AxiosError_1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function CanceledError(message) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError_1.call(this, message == null ? 'canceled' : message, AxiosError_1.ERR_CANCELED);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError_1, {
      __CANCEL__: true
    });

    var CanceledError_1 = CanceledError;

    var parseProtocol = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    };

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError_1('Request aborted', AxiosError_1.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError_1('Network Error', AxiosError_1.ERR_NETWORK, config, request, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional$1 = config.transitional || transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError_1(
            timeoutErrorMessage,
            transitional$1.clarifyTimeoutError ? AxiosError_1.ETIMEDOUT : AxiosError_1.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new CanceledError_1() : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        var protocol = parseProtocol(fullPath);

        if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
          reject(new AxiosError_1('Unsupported protocol ' + protocol + ':', AxiosError_1.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData);
      });
    };

    // eslint-disable-next-line strict
    var _null = null;

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: transitional,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }

        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers['Content-Type'];

        var isFileList;

        if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
          var _FormData = this.env && this.env.FormData;
          return toFormData_1(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === 'application/json') {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError_1.from(e, AxiosError_1.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: _null
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError_1();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var data = {
      "version": "0.27.2"
    };

    var VERSION = data.version;


    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError_1(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError_1.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError_1('options must be an object', AxiosError_1.ERR_BAD_OPTION_VALUE);
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError_1('option ' + opt + ' must be ' + result, AxiosError_1.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError_1('Unknown option ' + opt, AxiosError_1.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions: assertOptions,
      validators: validators$1
    };

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method: method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url: url,
            data: data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios_1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Expose Cancel & CancelToken
    axios$1.CanceledError = CanceledError_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;
    axios$1.VERSION = data.version;
    axios$1.toFormData = toFormData_1;

    // Expose AxiosError class
    axios$1.AxiosError = AxiosError_1;

    // alias for CanceledError for backward compatibility
    axios$1.Cancel = axios$1.CanceledError;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default = axios$1;
    axios_1.default = _default;

    var axios = axios_1;

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function storedWritable(key) {
        const storeVar = writable(JSON.parse(localStorage.getItem(key)));
        storeVar.subscribe((newValue) => {
            if (newValue !== null) {
                localStorage.setItem(key, JSON.stringify(newValue));
            }
            else {
                localStorage.removeItem(key);
            }
        });
        return storeVar;
    }
    const spotifyAuthToken = storedWritable('SPOTIFY_TOKEN');
    const spotifyAuthState = storedWritable('SPOTIFY_AUTH_STATE');
    const spotifyAuthCode = storedWritable('SPOTIFY_AUTH_CODE');
    const spotifyAuthVerifier = storedWritable('SPOTIFY_CODE_VERIFIER');
    const spotifyTokenExpires = storedWritable('SPOTIFY_AUTH_TOKEN_EXPIRES');
    const spotifyRefreshToken = storedWritable('SPOTIFY_REFRESH_TOKEN');
    const signedIn = derived(spotifyAuthToken, $spotifyAuthToken => $spotifyAuthToken !== null);
    const marqueeAnimateCounter = writable(0);

    const REDIRECT_URI = location.origin + location.pathname; // strip off hash & querystring etc
    const CLIENT_ID = process.env.CLIENT_ID;
    async function initLogin() {
        const verifier = cryptoRandomString(72);
        const codeChallenge = await hashCodeChallenge(verifier);
        const state = (Math.random() * 1e24).toString(36);
        spotifyAuthToken.set(null);
        spotifyTokenExpires.set(null);
        spotifyAuthCode.set(null);
        spotifyAuthState.set(state);
        spotifyAuthVerifier.set(verifier);
        const loginUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: 'user-read-playback-position user-read-playback-state user-read-currently-playing',
            redirect_uri: REDIRECT_URI,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            show_dialog: 'false',
        }).toString();
        window.location.replace(loginUrl);
    }
    async function getToken(params) {
        const formData = new URLSearchParams(params);
        const response = await axios.post('https://accounts.spotify.com/api/token', formData);
        spotifyAuthToken.set(response.data.access_token);
        if (response.data.refresh_token) {
            spotifyRefreshToken.set(response.data.refresh_token);
        }
        spotifyTokenExpires.set(new Date().getTime() + response.data.expires_in * 1000 - 10000); // 10 second buffer
    }
    async function refreshToken() {
        const token = get_store_value(spotifyRefreshToken);
        if (token) {
            try {
                await getToken({
                    grant_type: 'refresh_token',
                    refresh_token: get_store_value(spotifyRefreshToken),
                    client_id: CLIENT_ID,
                });
            }
            catch (e) {
                // something's wrong with the refresh token, try auth code instead
                await requestToken();
            }
        }
        else {
            await requestToken();
        }
    }
    async function requestToken() {
        var _a, _b, _c, _d;
        try {
            await getToken({
                grant_type: 'authorization_code',
                code: get_store_value(spotifyAuthCode),
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                code_verifier: get_store_value(spotifyAuthVerifier),
            });
        }
        catch (err) {
            if (((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === 'invalid_grant') {
                initLogin();
            }
            else {
                throw ((_d = (_c = err.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.error_description) || 'failed to get token';
            }
        }
    }
    async function handleAuth() {
        const qs = new URLSearchParams(location.search);
        history.replaceState(null, '', location.pathname); // wipe off auth code from url
        if (qs.get('state') && qs.get('state') === get_store_value(spotifyAuthState)) {
            // always remove state from storage - it's single use
            spotifyAuthState.set(null);
            if (qs.has('code')) {
                spotifyAuthCode.set(qs.get('code'));
                await requestToken();
            }
            else {
                spotifyAuthCode.set(null);
                spotifyAuthToken.set(null);
                spotifyAuthVerifier.set(null);
                spotifyRefreshToken.set(null);
                if (qs.has('error')) {
                    throw qs.get('error');
                }
                else {
                    throw 'unknown error';
                }
            }
        }
        // not coming back from spotify, dont do anything
    }
    function cryptoRandomString(length) {
        const array = new Uint8Array((length || 40) / 2);
        crypto.getRandomValues(array);
        return Array.from(array, (decimal) => decimal.toString(16)).join('');
    }
    async function hashCodeChallenge(message) {
        const bytes = new TextEncoder().encode(message);
        const hash = await crypto.subtle.digest('SHA-256', bytes);
        return btoa(String.fromCharCode.apply(null, new Uint8Array(hash))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    const file$2 = "src\\components\\Login.svelte";

    // (2:4) {#if !navigator.userAgent.match(/\bOBS\b/)}
    function create_if_block_1(ctx) {
    	let div;
    	let t0;
    	let em;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("It looks like you are not visiting this page in OBS.  This tool ");
    			em = element("em");
    			em.textContent = "will not";
    			t2 = text(" work if you sign in with a\r\n        desktop browser and then add this source to OBS.");
    			add_location(em, file$2, 3, 72, 174);
    			attr_dev(div, "class", "info-box svelte-1ggrjlw");
    			add_location(div, file$2, 2, 4, 78);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, em);
    			append_dev(div, t2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(2:4) {#if !navigator.userAgent.match(/\\bOBS\\b/)}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#if error}
    function create_if_block$2(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Failed to sign in to Spotify: ");
    			t1 = text(/*error*/ ctx[0]);
    			t2 = text(".");
    			attr_dev(div, "class", "info-box svelte-1ggrjlw");
    			add_location(div, file$2, 11, 4, 405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 1) set_data_dev(t1, /*error*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(11:4) {#if error}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let show_if = !navigator.userAgent.match(/\bOBS\b/);
    	let t0;
    	let div0;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block0 = show_if && create_if_block_1(ctx);
    	let if_block1 = /*error*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Sign In with Spotify";
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "class", "login-button svelte-1ggrjlw");
    			add_location(div0, file$2, 8, 4, 307);
    			attr_dev(div1, "class", "container svelte-1ggrjlw");
    			add_location(div1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", initLogin, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*error*/ ctx[0]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let { error = null } = $$props;

    	onMount(async () => {
    		try {
    			await handleAuth();
    		} catch(err) {
    			$$invalidate(0, error = err);
    		}
    	});

    	const writable_props = ['error'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({ onMount, handleAuth, initLogin, error });

    	$$self.$inject_state = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [error];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { error: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get error() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var spotifyWebApi = createCommonjsModule(function (module) {

    /**
     * Class representing the API
     */
    var SpotifyWebApi = (function () {
      var _baseUri = 'https://api.spotify.com/v1';
      var _accessToken = null;
      var _promiseImplementation = null;

      var WrapPromiseWithAbort = function (promise, onAbort) {
        promise.abort = onAbort;
        return promise;
      };

      var _promiseProvider = function (promiseFunction, onAbort) {
        var returnedPromise;
        if (_promiseImplementation !== null) {
          var deferred = _promiseImplementation.defer();
          promiseFunction(
            function (resolvedResult) {
              deferred.resolve(resolvedResult);
            },
            function (rejectedResult) {
              deferred.reject(rejectedResult);
            }
          );
          returnedPromise = deferred.promise;
        } else {
          if (window.Promise) {
            returnedPromise = new window.Promise(promiseFunction);
          }
        }

        if (returnedPromise) {
          return new WrapPromiseWithAbort(returnedPromise, onAbort);
        } else {
          return null;
        }
      };

      var _extend = function () {
        var args = Array.prototype.slice.call(arguments);
        var target = args[0];
        var objects = args.slice(1);
        target = target || {};
        objects.forEach(function (object) {
          for (var j in object) {
            if (object.hasOwnProperty(j)) {
              target[j] = object[j];
            }
          }
        });
        return target;
      };

      var _buildUrl = function (url, parameters) {
        var qs = '';
        for (var key in parameters) {
          if (parameters.hasOwnProperty(key)) {
            var value = parameters[key];
            qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
          }
        }
        if (qs.length > 0) {
          // chop off last '&'
          qs = qs.substring(0, qs.length - 1);
          url = url + '?' + qs;
        }
        return url;
      };

      var _performRequest = function (requestData, callback) {
        var req = new XMLHttpRequest();

        var promiseFunction = function (resolve, reject) {
          function success(data) {
            if (resolve) {
              resolve(data);
            }
            if (callback) {
              callback(null, data);
            }
          }

          function failure() {
            if (reject) {
              reject(req);
            }
            if (callback) {
              callback(req, null);
            }
          }

          var type = requestData.type || 'GET';
          req.open(type, _buildUrl(requestData.url, requestData.params));
          if (_accessToken) {
            req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);
          }

          req.onreadystatechange = function () {
            if (req.readyState === 4) {
              var data = null;
              try {
                data = req.responseText ? JSON.parse(req.responseText) : '';
              } catch (e) {
                console.error(e);
              }

              if (req.status >= 200 && req.status < 300) {
                success(data);
              } else {
                failure();
              }
            }
          };

          if (type === 'GET') {
            req.send(null);
          } else {
            var postData = null;
            if (requestData.postData) {
              if (requestData.contentType === 'image/jpeg') {
                postData = requestData.postData;
                req.setRequestHeader('Content-Type', requestData.contentType);
              } else {
                postData = JSON.stringify(requestData.postData);
                req.setRequestHeader('Content-Type', 'application/json');
              }
            }
            req.send(postData);
          }
        };

        if (callback) {
          promiseFunction();
          return null;
        } else {
          return _promiseProvider(promiseFunction, function () {
            req.abort();
          });
        }
      };

      var _checkParamsAndPerformRequest = function (
        requestData,
        options,
        callback,
        optionsAlwaysExtendParams
      ) {
        var opt = {};
        var cb = null;

        if (typeof options === 'object') {
          opt = options;
          cb = callback;
        } else if (typeof options === 'function') {
          cb = options;
        }

        // options extend postData, if any. Otherwise they extend parameters sent in the url
        var type = requestData.type || 'GET';
        if (type !== 'GET' && requestData.postData && !optionsAlwaysExtendParams) {
          requestData.postData = _extend(requestData.postData, opt);
        } else {
          requestData.params = _extend(requestData.params, opt);
        }
        return _performRequest(requestData, cb);
      };

      /**
       * Creates an instance of the wrapper
       * @constructor
       */
      var Constr = function () {};

      Constr.prototype = {
        constructor: SpotifyWebApi
      };

      /**
       * Fetches a resource through a generic GET request.
       *
       * @param {string} url The URL to be fetched
       * @param {function(Object,Object)} callback An optional callback
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getGeneric = function (url, callback) {
        var requestData = {
          url: url
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Fetches information about the current user.
       * See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMe = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches current user's saved tracks.
       * See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMySavedTracks = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/tracks'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Adds a list of tracks to the current user's saved tracks.
       * See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
       * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.addToMySavedTracks = function (trackIds, options, callback) {
        var requestData = {
          url: _baseUri + '/me/tracks',
          type: 'PUT',
          postData: trackIds
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Remove a list of tracks from the current user's saved tracks.
       * See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
       * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.removeFromMySavedTracks = function (
        trackIds,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/me/tracks',
          type: 'DELETE',
          postData: trackIds
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Checks if the current user's saved tracks contains a certain list of tracks.
       * See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
       * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.containsMySavedTracks = function (
        trackIds,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/me/tracks/contains',
          params: { ids: trackIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get a list of the albums saved in the current Spotify user's "Your Music" library.
       * See [Get Current User's Saved Albums](https://developer.spotify.com/web-api/get-users-saved-albums/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMySavedAlbums = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/albums'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Save one or more albums to the current user's "Your Music" library.
       * See [Save Albums for Current User](https://developer.spotify.com/web-api/save-albums-user/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
       * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.addToMySavedAlbums = function (albumIds, options, callback) {
        var requestData = {
          url: _baseUri + '/me/albums',
          type: 'PUT',
          postData: albumIds
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Remove one or more albums from the current user's "Your Music" library.
       * See [Remove Albums for Current User](https://developer.spotify.com/web-api/remove-albums-user/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
       * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.removeFromMySavedAlbums = function (
        albumIds,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/me/albums',
          type: 'DELETE',
          postData: albumIds
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Check if one or more albums is already saved in the current Spotify user's "Your Music" library.
       * See [Check User's Saved Albums](https://developer.spotify.com/web-api/check-users-saved-albums/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI, it is easy
       * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.containsMySavedAlbums = function (
        albumIds,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/me/albums/contains',
          params: { ids: albumIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get the current user’s top artists based on calculated affinity.
       * See [Get a User’s Top Artists](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMyTopArtists = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/top/artists'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get the current user’s top tracks based on calculated affinity.
       * See [Get a User’s Top Tracks](https://developer.spotify.com/web-api/get-users-top-artists-and-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMyTopTracks = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/top/tracks'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get tracks from the current user’s recently played tracks.
       * See [Get Current User’s Recently Played Tracks](https://developer.spotify.com/web-api/web-api-personalization-endpoints/get-recently-played/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMyRecentlyPlayedTracks = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/player/recently-played'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Adds the current user as a follower of one or more other Spotify users.
       * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
       * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an empty value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.followUsers = function (userIds, callback) {
        var requestData = {
          url: _baseUri + '/me/following/',
          type: 'PUT',
          params: {
            ids: userIds.join(','),
            type: 'user'
          }
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Adds the current user as a follower of one or more artists.
       * See [Follow Artists or Users](https://developer.spotify.com/web-api/follow-artists-users/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
       * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an empty value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.followArtists = function (artistIds, callback) {
        var requestData = {
          url: _baseUri + '/me/following/',
          type: 'PUT',
          params: {
            ids: artistIds.join(','),
            type: 'artist'
          }
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Add the current user as a follower of one playlist.
       * See [Follow a Playlist](https://developer.spotify.com/web-api/follow-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Object} options A JSON object with options that can be passed. For instance,
       * whether you want the playlist to be followed privately ({public: false})
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an empty value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.followPlaylist = function (playlistId, options, callback) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/followers',
          type: 'PUT',
          postData: {}
        };

        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Removes the current user as a follower of one or more other Spotify users.
       * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
       * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an empty value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.unfollowUsers = function (userIds, callback) {
        var requestData = {
          url: _baseUri + '/me/following/',
          type: 'DELETE',
          params: {
            ids: userIds.join(','),
            type: 'user'
          }
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Removes the current user as a follower of one or more artists.
       * See [Unfollow Artists or Users](https://developer.spotify.com/web-api/unfollow-artists-users/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
       * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an empty value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.unfollowArtists = function (artistIds, callback) {
        var requestData = {
          url: _baseUri + '/me/following/',
          type: 'DELETE',
          params: {
            ids: artistIds.join(','),
            type: 'artist'
          }
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Remove the current user as a follower of one playlist.
       * See [Unfollow a Playlist](https://developer.spotify.com/web-api/unfollow-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an empty value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.unfollowPlaylist = function (playlistId, callback) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/followers',
          type: 'DELETE'
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Checks to see if the current user is following one or more other Spotify users.
       * See [Check if Current User Follows Users or Artists](https://developer.spotify.com/web-api/check-current-user-follows/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
       * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an array of boolean values that indicate
       * whether the user is following the users sent in the request.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.isFollowingUsers = function (userIds, callback) {
        var requestData = {
          url: _baseUri + '/me/following/contains',
          type: 'GET',
          params: {
            ids: userIds.join(','),
            type: 'user'
          }
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Checks to see if the current user is following one or more artists.
       * See [Check if Current User Follows](https://developer.spotify.com/web-api/check-current-user-follows/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
       * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an array of boolean values that indicate
       * whether the user is following the artists sent in the request.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.isFollowingArtists = function (artistIds, callback) {
        var requestData = {
          url: _baseUri + '/me/following/contains',
          type: 'GET',
          params: {
            ids: artistIds.join(','),
            type: 'artist'
          }
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Check to see if one or more Spotify users are following a specified playlist.
       * See [Check if Users Follow a Playlist](https://developer.spotify.com/web-api/check-user-following-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Array<string>} userIds The ids of the users. If you know their Spotify URI it is easy
       * to find their user id (e.g. spotify:user:<here_is_the_user_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an array of boolean values that indicate
       * whether the users are following the playlist sent in the request.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.areFollowingPlaylist = function (
        playlistId,
        userIds,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/followers/contains',
          type: 'GET',
          params: {
            ids: userIds.join(',')
          }
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Get the current user's followed artists.
       * See [Get User's Followed Artists](https://developer.spotify.com/web-api/get-followed-artists/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} [options] Options, being after and limit.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is an object with a paged object containing
       * artists.
       * @returns {Promise|undefined} A promise that if successful, resolves to an object containing a paging object which contains
       * artists objects. Not returned if a callback is given.
       */
      Constr.prototype.getFollowedArtists = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/following',
          type: 'GET',
          params: {
            type: 'artist'
          }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches information about a specific user.
       * See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} userId The id of the user. If you know the Spotify URI it is easy
       * to find the id (e.g. spotify:user:<here_is_the_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getUser = function (userId, options, callback) {
        var requestData = {
          url: _baseUri + '/users/' + encodeURIComponent(userId)
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a list of the current user's playlists.
       * See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} userId An optional id of the user. If you know the Spotify URI it is easy
       * to find the id (e.g. spotify:user:<here_is_the_id>). If not provided, the id of the user that granted
       * the permissions will be used.
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getUserPlaylists = function (userId, options, callback) {
        var requestData;
        if (typeof userId === 'string') {
          requestData = {
            url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists'
          };
        } else {
          requestData = {
            url: _baseUri + '/me/playlists'
          };
          callback = options;
          options = userId;
        }
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a specific playlist.
       * See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getPlaylist = function (playlistId, options, callback) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches the tracks from a specific playlist.
       * See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getPlaylistTracks = function (
        playlistId,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/tracks'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Gets the current image associated with a specific playlist.
       * See [Get a Playlist Cover Image](https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlist-cover/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:playlist:<here_is_the_playlist_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getPlaylistCoverImage = function (playlistId, callback) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/images'
        };
        return _checkParamsAndPerformRequest(requestData, callback);
      };

      /**
       * Creates a playlist and stores it in the current user's library.
       * See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} userId The id of the user. If you know the Spotify URI it is easy
       * to find the id (e.g. spotify:user:<here_is_the_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.createPlaylist = function (userId, options, callback) {
        var requestData = {
          url: _baseUri + '/users/' + encodeURIComponent(userId) + '/playlists',
          type: 'POST',
          postData: options
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Change a playlist's name and public/private state
       * See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Object} data A JSON object with the data to update. E.g. {name: 'A new name', public: true}
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.changePlaylistDetails = function (
        playlistId,
        data,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId,
          type: 'PUT',
          postData: data
        };
        return _checkParamsAndPerformRequest(requestData, data, callback);
      };

      /**
       * Add tracks to a playlist.
       * See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Array<string>} uris An array of Spotify URIs for the tracks
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.addTracksToPlaylist = function (
        playlistId,
        uris,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/tracks',
          type: 'POST',
          postData: {
            uris: uris
          }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback, true);
      };

      /**
       * Replace the tracks of a playlist
       * See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Array<string>} uris An array of Spotify URIs for the tracks
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.replaceTracksInPlaylist = function (
        playlistId,
        uris,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/tracks',
          type: 'PUT',
          postData: { uris: uris }
        };
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Reorder tracks in a playlist
       * See [Reorder a Playlist’s Tracks](https://developer.spotify.com/web-api/reorder-playlists-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {number} rangeStart The position of the first track to be reordered.
       * @param {number} insertBefore The position where the tracks should be inserted. To reorder the tracks to
       * the end of the playlist, simply set insert_before to the position after the last track.
       * @param {Object} options An object with optional parameters (range_length, snapshot_id)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.reorderTracksInPlaylist = function (
        playlistId,
        rangeStart,
        insertBefore,
        options,
        callback
      ) {
        /* eslint-disable camelcase */
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/tracks',
          type: 'PUT',
          postData: {
            range_start: rangeStart,
            insert_before: insertBefore
          }
        };
        /* eslint-enable camelcase */
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Remove tracks from a playlist
       * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
       * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
       * string) and `positions` (which is an array of integers).
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.removeTracksFromPlaylist = function (
        playlistId,
        uris,
        callback
      ) {
        var dataToBeSent = uris.map(function (uri) {
          if (typeof uri === 'string') {
            return { uri: uri };
          } else {
            return uri;
          }
        });

        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/tracks',
          type: 'DELETE',
          postData: { tracks: dataToBeSent }
        };
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Remove tracks from a playlist, specifying a snapshot id.
       * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a
       * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a
       * string) and `positions` (which is an array of integers).
       * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.removeTracksFromPlaylistWithSnapshotId = function (
        playlistId,
        uris,
        snapshotId,
        callback
      ) {
        var dataToBeSent = uris.map(function (uri) {
          if (typeof uri === 'string') {
            return { uri: uri };
          } else {
            return uri;
          }
        });
        /* eslint-disable camelcase */
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/tracks',
          type: 'DELETE',
          postData: {
            tracks: dataToBeSent,
            snapshot_id: snapshotId
          }
        };
        /* eslint-enable camelcase */
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Remove tracks from a playlist, specifying the positions of the tracks to be removed.
       * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {Array<number>} positions array of integers containing the positions of the tracks to remove
       * from the playlist.
       * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.removeTracksFromPlaylistInPositions = function (
        playlistId,
        positions,
        snapshotId,
        callback
      ) {
        /* eslint-disable camelcase */
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/tracks',
          type: 'DELETE',
          postData: {
            positions: positions,
            snapshot_id: snapshotId
          }
        };
        /* eslint-enable camelcase */
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Upload a custom playlist cover image.
       * See [Upload A Custom Playlist Cover Image](https://developer.spotify.com/web-api/upload-a-custom-playlist-cover-image/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy
       * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)
       * @param {string} imageData Base64 encoded JPEG image data, maximum payload size is 256 KB.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.uploadCustomPlaylistCoverImage = function (
        playlistId,
        imageData,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/playlists/' + playlistId + '/images',
          type: 'PUT',
          postData: imageData.replace(/^data:image\/jpeg;base64,/, ''),
          contentType: 'image/jpeg'
        };
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Fetches an album from the Spotify catalog.
       * See [Get an Album](https://developer.spotify.com/web-api/get-album/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
       * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getAlbum = function (albumId, options, callback) {
        var requestData = {
          url: _baseUri + '/albums/' + albumId
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches the tracks of an album from the Spotify catalog.
       * See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} albumId The id of the album. If you know the Spotify URI it is easy
       * to find the album id (e.g. spotify:album:<here_is_the_album_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getAlbumTracks = function (albumId, options, callback) {
        var requestData = {
          url: _baseUri + '/albums/' + albumId + '/tracks'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches multiple albums from the Spotify catalog.
       * See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI it is easy
       * to find their album id (e.g. spotify:album:<here_is_the_album_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getAlbums = function (albumIds, options, callback) {
        var requestData = {
          url: _baseUri + '/albums/',
          params: { ids: albumIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a track from the Spotify catalog.
       * See [Get a Track](https://developer.spotify.com/web-api/get-track/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
       * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getTrack = function (trackId, options, callback) {
        var requestData = {};
        requestData.url = _baseUri + '/tracks/' + trackId;
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches multiple tracks from the Spotify catalog.
       * See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
       * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getTracks = function (trackIds, options, callback) {
        var requestData = {
          url: _baseUri + '/tracks/',
          params: { ids: trackIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches an artist from the Spotify catalog.
       * See [Get an Artist](https://developer.spotify.com/web-api/get-artist/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
       * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getArtist = function (artistId, options, callback) {
        var requestData = {
          url: _baseUri + '/artists/' + artistId
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches multiple artists from the Spotify catalog.
       * See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy
       * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getArtists = function (artistIds, options, callback) {
        var requestData = {
          url: _baseUri + '/artists/',
          params: { ids: artistIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches the albums of an artist from the Spotify catalog.
       * See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
       * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getArtistAlbums = function (artistId, options, callback) {
        var requestData = {
          url: _baseUri + '/artists/' + artistId + '/albums'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.
       * See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
       * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {string} countryId The id of the country (e.g. ES for Spain or US for United States)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getArtistTopTracks = function (
        artistId,
        countryId,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/artists/' + artistId + '/top-tracks',
          params: { country: countryId }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a list of artists related with a given one from the Spotify catalog.
       * See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy
       * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getArtistRelatedArtists = function (
        artistId,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/artists/' + artistId + '/related-artists'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).
       * See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getFeaturedPlaylists = function (options, callback) {
        var requestData = {
          url: _baseUri + '/browse/featured-playlists'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).
       * See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getNewReleases = function (options, callback) {
        var requestData = {
          url: _baseUri + '/browse/new-releases'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
       * See [Get a List of Categories](https://developer.spotify.com/web-api/get-list-categories/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getCategories = function (options, callback) {
        var requestData = {
          url: _baseUri + '/browse/categories'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).
       * See [Get a Category](https://developer.spotify.com/web-api/get-category/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} categoryId The id of the category. These can be found with the getCategories function
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getCategory = function (categoryId, options, callback) {
        var requestData = {
          url: _baseUri + '/browse/categories/' + categoryId
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get a list of Spotify playlists tagged with a particular category.
       * See [Get a Category's Playlists](https://developer.spotify.com/web-api/get-categorys-playlists/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} categoryId The id of the category. These can be found with the getCategories function
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getCategoryPlaylists = function (
        categoryId,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/browse/categories/' + categoryId + '/playlists'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get Spotify catalog information about artists, albums, tracks or playlists that match a keyword string.
       * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} query The search query
       * @param {Array<string>} types An array of item types to search across.
       * Valid types are: 'album', 'artist', 'playlist', and 'track'.
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.search = function (query, types, options, callback) {
        var requestData = {
          url: _baseUri + '/search/',
          params: {
            q: query,
            type: types.join(',')
          }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches albums from the Spotify catalog according to a query.
       * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} query The search query
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.searchAlbums = function (query, options, callback) {
        return this.search(query, ['album'], options, callback);
      };

      /**
       * Fetches artists from the Spotify catalog according to a query.
       * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} query The search query
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.searchArtists = function (query, options, callback) {
        return this.search(query, ['artist'], options, callback);
      };

      /**
       * Fetches tracks from the Spotify catalog according to a query.
       * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} query The search query
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.searchTracks = function (query, options, callback) {
        return this.search(query, ['track'], options, callback);
      };

      /**
       * Fetches playlists from the Spotify catalog according to a query.
       * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} query The search query
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.searchPlaylists = function (query, options, callback) {
        return this.search(query, ['playlist'], options, callback);
      };

      /**
       * Fetches shows from the Spotify catalog according to a query.
       * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} query The search query
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.searchShows = function (query, options, callback) {
        return this.search(query, ['show'], options, callback);
      };

      /**
       * Fetches episodes from the Spotify catalog according to a query.
       * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} query The search query
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.searchEpisodes = function (query, options, callback) {
        return this.search(query, ['episode'], options, callback);
      };

      /**
       * Get audio features for a single track identified by its unique Spotify ID.
       * See [Get Audio Features for a Track](https://developer.spotify.com/web-api/get-audio-features/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
       * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getAudioFeaturesForTrack = function (trackId, callback) {
        var requestData = {};
        requestData.url = _baseUri + '/audio-features/' + trackId;
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Get audio features for multiple tracks based on their Spotify IDs.
       * See [Get Audio Features for Several Tracks](https://developer.spotify.com/web-api/get-several-audio-features/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy
       * to find their track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getAudioFeaturesForTracks = function (trackIds, callback) {
        var requestData = {
          url: _baseUri + '/audio-features',
          params: { ids: trackIds }
        };
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Get audio analysis for a single track identified by its unique Spotify ID.
       * See [Get Audio Analysis for a Track](https://developer.spotify.com/web-api/get-audio-analysis/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} trackId The id of the track. If you know the Spotify URI it is easy
       * to find the track id (e.g. spotify:track:<here_is_the_track_id>)
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getAudioAnalysisForTrack = function (trackId, callback) {
        var requestData = {};
        requestData.url = _baseUri + '/audio-analysis/' + trackId;
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Create a playlist-style listening experience based on seed artists, tracks and genres.
       * See [Get Recommendations Based on Seeds](https://developer.spotify.com/web-api/get-recommendations/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getRecommendations = function (options, callback) {
        var requestData = {
          url: _baseUri + '/recommendations'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Retrieve a list of available genres seed parameter values for recommendations.
       * See [Available Genre Seeds](https://developer.spotify.com/web-api/get-recommendations/#available-genre-seeds) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getAvailableGenreSeeds = function (callback) {
        var requestData = {
          url: _baseUri + '/recommendations/available-genre-seeds'
        };
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Get information about a user’s available devices.
       * See [Get a User’s Available Devices](https://developer.spotify.com/web-api/get-a-users-available-devices/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMyDevices = function (callback) {
        var requestData = {
          url: _baseUri + '/me/player/devices'
        };
        return _checkParamsAndPerformRequest(requestData, {}, callback);
      };

      /**
       * Get information about the user’s current playback state, including track, track progress, and active device.
       * See [Get Information About The User’s Current Playback](https://developer.spotify.com/web-api/get-information-about-the-users-current-playback/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMyCurrentPlaybackState = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/player'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Get the object currently being played on the user’s Spotify account.
       * See [Get the User’s Currently Playing Track](https://developer.spotify.com/web-api/get-the-users-currently-playing-track/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMyCurrentPlayingTrack = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/player/currently-playing'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Transfer playback to a new device and determine if it should start playing.
       * See [Transfer a User’s Playback](https://developer.spotify.com/web-api/transfer-a-users-playback/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} deviceIds A JSON array containing the ID of the device on which playback should be started/transferred.
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.transferMyPlayback = function (
        deviceIds,
        options,
        callback
      ) {
        var postData = options || {};
        postData.device_ids = deviceIds;
        var requestData = {
          type: 'PUT',
          url: _baseUri + '/me/player',
          postData: postData
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Play a track on the user's active device
       * See [Start/Resume a User's Playback](https://developer.spotify.com/documentation/web-api/reference/player/start-a-users-playback/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.play = function (options, callback) {
        options = options || {};
        var params =
          'device_id' in options ? { device_id: options.device_id } : null;
        var postData = {};
        ['context_uri', 'uris', 'offset', 'position_ms'].forEach(function (field) {
          if (field in options) {
            postData[field] = options[field];
          }
        });
        var requestData = {
          type: 'PUT',
          url: _baseUri + '/me/player/play',
          params: params,
          postData: postData
        };

        // need to clear options so it doesn't add all of them to the query params
        var newOptions = typeof options === 'function' ? options : {};
        return _checkParamsAndPerformRequest(requestData, newOptions, callback);
      };

      /**
       * Add an item to the end of the user’s current playback queue.
       * See [Add an Item to the User's Playback Queue](https://developer.spotify.com/documentation/web-api/reference/player/add-to-queue/) on
       * the Spotify Developer site for more information about the endpoint.
       * @param {string} uri The uri of the item to add to the queue. Must be a track or an episode uri.
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.queue = function (uri, options, callback) {
        options = options || {};
        var params =
          'device_id' in options
            ? { uri: uri, device_id: options.device_id }
            : { uri: uri };
        var requestData = {
          type: 'POST',
          url: _baseUri + '/me/player/queue',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Pause playback on the user’s account.
       * See [Pause a User’s Playback](https://developer.spotify.com/web-api/pause-a-users-playback/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.pause = function (options, callback) {
        options = options || {};
        var params =
          'device_id' in options ? { device_id: options.device_id } : null;
        var requestData = {
          type: 'PUT',
          url: _baseUri + '/me/player/pause',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Skips to next track in the user’s queue.
       * See [Skip User’s Playback To Next Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.skipToNext = function (options, callback) {
        options = options || {};
        var params =
          'device_id' in options ? { device_id: options.device_id } : null;
        var requestData = {
          type: 'POST',
          url: _baseUri + '/me/player/next',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Skips to previous track in the user’s queue.
       * Note that this will ALWAYS skip to the previous track, regardless of the current track’s progress.
       * Returning to the start of the current track should be performed using `.seek()`
       * See [Skip User’s Playback To Previous Track](https://developer.spotify.com/web-api/skip-users-playback-to-next-track/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.skipToPrevious = function (options, callback) {
        options = options || {};
        var params =
          'device_id' in options ? { device_id: options.device_id } : null;
        var requestData = {
          type: 'POST',
          url: _baseUri + '/me/player/previous',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Seeks to the given position in the user’s currently playing track.
       * See [Seek To Position In Currently Playing Track](https://developer.spotify.com/web-api/seek-to-position-in-currently-playing-track/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {number} position_ms The position in milliseconds to seek to. Must be a positive number.
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.seek = function (position_ms, options, callback) {
        options = options || {};
        var params = {
          position_ms: position_ms
        };
        if ('device_id' in options) {
          params.device_id = options.device_id;
        }
        var requestData = {
          type: 'PUT',
          url: _baseUri + '/me/player/seek',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Set the repeat mode for the user’s playback. Options are repeat-track, repeat-context, and off.
       * See [Set Repeat Mode On User’s Playback](https://developer.spotify.com/web-api/set-repeat-mode-on-users-playback/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {String} state A string set to 'track', 'context' or 'off'.
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.setRepeat = function (state, options, callback) {
        options = options || {};
        var params = {
          state: state
        };
        if ('device_id' in options) {
          params.device_id = options.device_id;
        }
        var requestData = {
          type: 'PUT',
          url: _baseUri + '/me/player/repeat',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Set the volume for the user’s current playback device.
       * See [Set Volume For User’s Playback](https://developer.spotify.com/web-api/set-volume-for-users-playback/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {number} volume_percent The volume to set. Must be a value from 0 to 100 inclusive.
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.setVolume = function (volume_percent, options, callback) {
        options = options || {};
        var params = {
          volume_percent: volume_percent
        };
        if ('device_id' in options) {
          params.device_id = options.device_id;
        }
        var requestData = {
          type: 'PUT',
          url: _baseUri + '/me/player/volume',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Toggle shuffle on or off for user’s playback.
       * See [Toggle Shuffle For User’s Playback](https://developer.spotify.com/web-api/toggle-shuffle-for-users-playback/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {bool} state Whether or not to shuffle user's playback.
       * @param {Object} options A JSON object with options that can be passed.
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.setShuffle = function (state, options, callback) {
        options = options || {};
        var params = {
          state: state
        };
        if ('device_id' in options) {
          params.device_id = options.device_id;
        }
        var requestData = {
          type: 'PUT',
          url: _baseUri + '/me/player/shuffle',
          params: params
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches a show from the Spotify catalog.
       * See [Get a Show](https://developer.spotify.com/documentation/web-api/reference/shows/get-a-show/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} showId The id of the show. If you know the Spotify URI it is easy
       * to find the show id (e.g. spotify:show:<here_is_the_show_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getShow = function (showId, options, callback) {
        var requestData = {};
        requestData.url = _baseUri + '/shows/' + showId;
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches multiple shows from the Spotify catalog.
       * See [Get Several Shows](https://developer.spotify.com/documentation/web-api/reference/shows/get-several-shows/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
       * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getShows = function (showIds, options, callback) {
        var requestData = {
          url: _baseUri + '/shows/',
          params: { ids: showIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches current user's saved shows.
       * See [Get Current User's Saved Shows](https://developer.spotify.com/documentation/web-api/reference/library/get-users-saved-shows/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getMySavedShows = function (options, callback) {
        var requestData = {
          url: _baseUri + '/me/shows'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Adds a list of shows to the current user's saved shows.
       * See [Save Shows for Current User](https://developer.spotify.com/documentation/web-api/reference/library/save-shows-user/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
       * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.addToMySavedShows = function (showIds, options, callback) {
        var requestData = {
          url: _baseUri + '/me/shows',
          type: 'PUT',
          postData: showIds
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Remove a list of shows from the current user's saved shows.
       * See [Remove Shows for Current User](https://developer.spotify.com/documentation/web-api/reference/library/remove-shows-user/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
       * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.removeFromMySavedShows = function (
        showIds,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/me/shows',
          type: 'DELETE',
          postData: showIds
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Checks if the current user's saved shows contains a certain list of shows.
       * See [Check Current User's Saved Shows](https://developer.spotify.com/documentation/web-api/reference/library/check-users-saved-shows/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} showIds The ids of the shows. If you know their Spotify URI it is easy
       * to find their show id (e.g. spotify:show:<here_is_the_show_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.containsMySavedShows = function (
        showIds,
        options,
        callback
      ) {
        var requestData = {
          url: _baseUri + '/me/shows/contains',
          params: { ids: showIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches the episodes of a show from the Spotify catalog.
       * See [Get a Show's Episodes](https://developer.spotify.com/documentation/web-api/reference/shows/get-shows-episodes/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} showId The id of the show. If you know the Spotify URI it is easy
       * to find the show id (e.g. spotify:show:<here_is_the_show_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getShowEpisodes = function (showId, options, callback) {
        var requestData = {
          url: _baseUri + '/shows/' + showId + '/episodes'
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches an episode from the Spotify catalog.
       * See [Get an Episode](https://developer.spotify.com/documentation/web-api/reference/episodes/get-an-episode/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {string} episodeId The id of the episode. If you know the Spotify URI it is easy
       * to find the episode id (e.g. spotify:episode:<here_is_the_episode_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getEpisode = function (episodeId, options, callback) {
        var requestData = {};
        requestData.url = _baseUri + '/episodes/' + episodeId;
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Fetches multiple episodes from the Spotify catalog.
       * See [Get Several Episodes](https://developer.spotify.com/documentation/web-api/reference/episodes/get-several-episodes/) on
       * the Spotify Developer site for more information about the endpoint.
       *
       * @param {Array<string>} episodeIds The ids of the episodes. If you know their Spotify URI it is easy
       * to find their episode id (e.g. spotify:episode:<here_is_the_episode_id>)
       * @param {Object} options A JSON object with options that can be passed
       * @param {function(Object,Object)} callback An optional callback that receives 2 parameters. The first
       * one is the error object (null if no error), and the second is the value if the request succeeded.
       * @return {Object} Null if a callback is provided, a `Promise` object otherwise
       */
      Constr.prototype.getEpisodes = function (episodeIds, options, callback) {
        var requestData = {
          url: _baseUri + '/episodes/',
          params: { ids: episodeIds.join(',') }
        };
        return _checkParamsAndPerformRequest(requestData, options, callback);
      };

      /**
       * Gets the access token in use.
       *
       * @return {string} accessToken The access token
       */
      Constr.prototype.getAccessToken = function () {
        return _accessToken;
      };

      /**
       * Sets the access token to be used.
       * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on
       * the Spotify Developer site for more information about obtaining an access token.
       *
       * @param {string} accessToken The access token
       * @return {void}
       */
      Constr.prototype.setAccessToken = function (accessToken) {
        _accessToken = accessToken;
      };

      /**
       * Sets an implementation of Promises/A+ to be used. E.g. Q, when.
       * See [Conformant Implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)
       * for a list of some available options
       *
       * @param {Object} PromiseImplementation A Promises/A+ valid implementation
       * @throws {Error} If the implementation being set doesn't conform with Promises/A+
       * @return {void}
       */
      Constr.prototype.setPromiseImplementation = function (PromiseImplementation) {
        var valid = false;
        try {
          var p = new PromiseImplementation(function (resolve) {
            resolve();
          });
          if (typeof p.then === 'function' && typeof p.catch === 'function') {
            valid = true;
          }
        } catch (e) {
          console.error(e);
        }
        if (valid) {
          _promiseImplementation = PromiseImplementation;
        } else {
          throw new Error('Unsupported implementation of Promises/A+');
        }
      };

      return Constr;
    })();

    {
      module.exports = SpotifyWebApi;
    }
    });

    const spotify = new spotifyWebApi();
    spotifyAuthToken.subscribe((token) => spotify.setAccessToken(token));
    spotifyTokenExpires.subscribe((expires) => {
        if (expires) {
            const now = new Date().getTime();
            if (expires <= now) {
                refreshToken();
            }
            else {
                setTimeout(refreshToken, expires - now);
            }
        }
    });
    async function getNowPlaying() {
        const playbackState = await spotify.getMyCurrentPlaybackState();
        if (!playbackState.is_playing || !playbackState.item) {
            return null;
        }
        return {
            albumName: playbackState.item.album.name,
            albumArtUrl: playbackState.item.album.images[0].url || null,
            artistNames: playbackState.item.artists.map(a => a.name),
            trackName: playbackState.item.name,
            trackLengthMs: playbackState.item.duration_ms,
            progressMs: playbackState.progress_ms,
        };
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    function slideOut(node, { duration = 2000, pixels = 100 }) {
        let top = node.offsetTop - parseFloat(getComputedStyle(node).marginTop);
        let left = node.offsetLeft;
        return {
            duration,
            css(t, u) {
                // Remove the element from the normal flow so that it doesn't interfere with the
                // placement of the new element, but position it exactly where it was.
                return `position:absolute;top:${top}px;left:${left}px;opacity:${t};transform:translateX(-${Math.floor(pixels * u)}px)`;
            }
        };
    }
    function slideIn(node, { duration = 2000, pixels = 100 }) {
        return {
            duration,
            css(t, u) {
                return `transform:translateX(${Math.floor(pixels * u)}px);opacity:${t}`;
            }
        };
    }

    const file$1 = "src\\components\\MarqueeTextLine.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "marquee-text svelte-2sxk4e");
    			set_style(div0, "left", "calc(var(--text-fade-width) + " + /*position*/ ctx[1] + "%)");
    			add_location(div0, file$1, 1, 4, 32);
    			attr_dev(div1, "class", "marquee-mask svelte-2sxk4e");
    			add_location(div1, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[4](div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*position*/ 2) {
    				set_style(div0, "left", "calc(var(--text-fade-width) + " + /*position*/ ctx[1] + "%)");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const SPEED = 0.25;

    function instance$2($$self, $$props, $$invalidate) {
    	let $marqueeAnimateCounter;
    	validate_store(marqueeAnimateCounter, 'marqueeAnimateCounter');
    	component_subscribe($$self, marqueeAnimateCounter, $$value => $$invalidate(6, $marqueeAnimateCounter = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MarqueeTextLine', slots, ['default']);
    	let textElement;
    	let position = 0; // must match the left gradient level in CSS
    	let isInCounter = false;

    	onMount(() => {
    		setTimeout(animate, 2000);
    	});

    	function animate() {
    		if (!textElement) {
    			return;
    		}

    		if (textElement.offsetWidth < textElement.parentElement.offsetWidth) {
    			// fits on screen, no animation
    			if (isInCounter) {
    				set_store_value(marqueeAnimateCounter, $marqueeAnimateCounter -= 1, $marqueeAnimateCounter);
    				isInCounter = false;
    			}

    			$$invalidate(1, position = 0);
    			requestAnimationFrame(animate);
    		} else if (textElement.offsetLeft + textElement.offsetWidth < 0) {
    			// off screen to the left
    			if (isInCounter) {
    				set_store_value(marqueeAnimateCounter, $marqueeAnimateCounter -= 1, $marqueeAnimateCounter);
    				isInCounter = false;
    			}

    			if ($marqueeAnimateCounter === 0) {
    				$$invalidate(1, position = 100);
    			}

    			requestAnimationFrame(animate);
    		} else if (Math.abs(position) < 0.001) {
    			// pause for a few secs when at left end
    			setTimeout(
    				() => {
    					set_store_value(marqueeAnimateCounter, $marqueeAnimateCounter += 1, $marqueeAnimateCounter);
    					isInCounter = true;
    					$$invalidate(1, position -= SPEED);
    					requestAnimationFrame(animate);
    				},
    				2000
    			);
    		} else {
    			$$invalidate(1, position -= SPEED);
    			requestAnimationFrame(animate);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MarqueeTextLine> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textElement = $$value;
    			$$invalidate(0, textElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		marqueeAnimateCounter,
    		SPEED,
    		textElement,
    		position,
    		isInCounter,
    		animate,
    		$marqueeAnimateCounter
    	});

    	$$self.$inject_state = $$props => {
    		if ('textElement' in $$props) $$invalidate(0, textElement = $$props.textElement);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('isInCounter' in $$props) isInCounter = $$props.isInCounter;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [textElement, position, $$scope, slots, div0_binding];
    }

    class MarqueeTextLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MarqueeTextLine",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const file = "src\\components\\NowPlaying.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (2:0) {#if nowPlaying}
    function create_if_block$1(ctx) {
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let img;
    	let img_src_value;
    	let main_transition;
    	let current;
    	let each_value = [/*nowPlaying*/ ctx[1]];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*nowPlaying*/ ctx[1].trackName;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < 1; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			img = element("img");
    			attr_dev(img, "class", "spotify-logo svelte-u6i1zo");
    			if (!src_url_equal(img.src, img_src_value = "/assets/spotify_logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Spotify Logo");
    			add_location(img, file, 20, 4, 1187);
    			attr_dev(main, "class", "svelte-u6i1zo");
    			add_location(main, file, 2, 0, 20);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t);
    			append_dev(main, img);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formatTime, nowPlaying, computedProgressMs*/ 7) {
    				each_value = [/*nowPlaying*/ ctx[1]];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, outro_and_destroy_block, create_each_block, t, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < 1; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!main_transition) main_transition = create_bidirectional_transition(main, fade, { duration: 500 }, true);
    				main_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 1; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!main_transition) main_transition = create_bidirectional_transition(main, fade, { duration: 500 }, false);
    			main_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < 1; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching && main_transition) main_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(2:0) {#if nowPlaying}",
    		ctx
    	});

    	return block;
    }

    // (8:36) <MarqueeTextLine>
    function create_default_slot_2(ctx) {
    	let t_value = /*nowPlaying*/ ctx[1].trackName + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nowPlaying*/ 2 && t_value !== (t_value = /*nowPlaying*/ ctx[1].trackName + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(8:36) <MarqueeTextLine>",
    		ctx
    	});

    	return block;
    }

    // (9:36) <MarqueeTextLine>
    function create_default_slot_1(ctx) {
    	let t_value = /*nowPlaying*/ ctx[1].albumName + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nowPlaying*/ 2 && t_value !== (t_value = /*nowPlaying*/ ctx[1].albumName + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(9:36) <MarqueeTextLine>",
    		ctx
    	});

    	return block;
    }

    // (10:37) <MarqueeTextLine>
    function create_default_slot(ctx) {
    	let t_value = /*nowPlaying*/ ctx[1].artistNames.join(", ") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*nowPlaying*/ 2 && t_value !== (t_value = /*nowPlaying*/ ctx[1].artistNames.join(", ") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(10:37) <MarqueeTextLine>",
    		ctx
    	});

    	return block;
    }

    // (4:4) {#each [nowPlaying] as nowPlaying (nowPlaying.trackName)}
    function create_each_block(key_1, ctx) {
    	let div9;
    	let img;
    	let img_src_value;
    	let t0;
    	let div8;
    	let div0;
    	let marqueetextline0;
    	let t1;
    	let div1;
    	let marqueetextline1;
    	let t2;
    	let div2;
    	let marqueetextline2;
    	let t3;
    	let div7;
    	let div3;
    	let t4_value = formatTime(/*computedProgressMs*/ ctx[0]) + "";
    	let t4;
    	let t5;
    	let div5;
    	let div4;
    	let t6;
    	let div6;
    	let t7_value = formatTime(/*nowPlaying*/ ctx[1].trackLengthMs) + "";
    	let t7;
    	let div9_intro;
    	let div9_outro;
    	let current;

    	marqueetextline0 = new MarqueeTextLine({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	marqueetextline1 = new MarqueeTextLine({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	marqueetextline2 = new MarqueeTextLine({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div9 = element("div");
    			img = element("img");
    			t0 = space();
    			div8 = element("div");
    			div0 = element("div");
    			create_component(marqueetextline0.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(marqueetextline1.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(marqueetextline2.$$.fragment);
    			t3 = space();
    			div7 = element("div");
    			div3 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t6 = space();
    			div6 = element("div");
    			t7 = text(t7_value);
    			attr_dev(img, "class", "album-art svelte-u6i1zo");
    			if (!src_url_equal(img.src, img_src_value = /*nowPlaying*/ ctx[1].albumArtUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Album Art");
    			add_location(img, file, 5, 8, 271);
    			attr_dev(div0, "class", "track-name svelte-u6i1zo");
    			add_location(div0, file, 7, 12, 393);
    			attr_dev(div1, "class", "album-name svelte-u6i1zo");
    			add_location(div1, file, 8, 12, 496);
    			attr_dev(div2, "class", "artist-name svelte-u6i1zo");
    			add_location(div2, file, 9, 12, 599);
    			attr_dev(div3, "class", "time elapsed svelte-u6i1zo");
    			add_location(div3, file, 11, 16, 770);
    			attr_dev(div4, "class", "progress-bar-elapsed svelte-u6i1zo");
    			set_style(div4, "width", /*computedProgressMs*/ ctx[0] / /*nowPlaying*/ ctx[1].trackLengthMs * 100 + "%");
    			add_location(div4, file, 13, 20, 902);
    			attr_dev(div5, "class", "progress-bar svelte-u6i1zo");
    			add_location(div5, file, 12, 16, 854);
    			attr_dev(div6, "class", "time total svelte-u6i1zo");
    			add_location(div6, file, 15, 16, 1050);
    			attr_dev(div7, "class", "progress-bar-container svelte-u6i1zo");
    			add_location(div7, file, 10, 12, 716);
    			attr_dev(div8, "class", "text-container svelte-u6i1zo");
    			add_location(div8, file, 6, 8, 351);
    			attr_dev(div9, "class", "nowplaying-container svelte-u6i1zo");
    			add_location(div9, file, 4, 4, 133);
    			this.first = div9;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, img);
    			append_dev(div9, t0);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			mount_component(marqueetextline0, div0, null);
    			append_dev(div8, t1);
    			append_dev(div8, div1);
    			mount_component(marqueetextline1, div1, null);
    			append_dev(div8, t2);
    			append_dev(div8, div2);
    			mount_component(marqueetextline2, div2, null);
    			append_dev(div8, t3);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, t4);
    			append_dev(div7, t5);
    			append_dev(div7, div5);
    			append_dev(div5, div4);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, t7);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*nowPlaying*/ 2 && !src_url_equal(img.src, img_src_value = /*nowPlaying*/ ctx[1].albumArtUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const marqueetextline0_changes = {};

    			if (dirty & /*$$scope, nowPlaying*/ 66) {
    				marqueetextline0_changes.$$scope = { dirty, ctx };
    			}

    			marqueetextline0.$set(marqueetextline0_changes);
    			const marqueetextline1_changes = {};

    			if (dirty & /*$$scope, nowPlaying*/ 66) {
    				marqueetextline1_changes.$$scope = { dirty, ctx };
    			}

    			marqueetextline1.$set(marqueetextline1_changes);
    			const marqueetextline2_changes = {};

    			if (dirty & /*$$scope, nowPlaying*/ 66) {
    				marqueetextline2_changes.$$scope = { dirty, ctx };
    			}

    			marqueetextline2.$set(marqueetextline2_changes);
    			if ((!current || dirty & /*computedProgressMs*/ 1) && t4_value !== (t4_value = formatTime(/*computedProgressMs*/ ctx[0]) + "")) set_data_dev(t4, t4_value);

    			if (!current || dirty & /*computedProgressMs, nowPlaying*/ 3) {
    				set_style(div4, "width", /*computedProgressMs*/ ctx[0] / /*nowPlaying*/ ctx[1].trackLengthMs * 100 + "%");
    			}

    			if ((!current || dirty & /*nowPlaying*/ 2) && t7_value !== (t7_value = formatTime(/*nowPlaying*/ ctx[1].trackLengthMs) + "")) set_data_dev(t7, t7_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(marqueetextline0.$$.fragment, local);
    			transition_in(marqueetextline1.$$.fragment, local);
    			transition_in(marqueetextline2.$$.fragment, local);

    			add_render_callback(() => {
    				if (div9_outro) div9_outro.end(1);
    				div9_intro = create_in_transition(div9, slideIn, { pixels: 150, duration: 400 });
    				div9_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(marqueetextline0.$$.fragment, local);
    			transition_out(marqueetextline1.$$.fragment, local);
    			transition_out(marqueetextline2.$$.fragment, local);
    			if (div9_intro) div9_intro.invalidate();
    			div9_outro = create_out_transition(div9, slideOut, { pixels: 200, duration: 300 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_component(marqueetextline0);
    			destroy_component(marqueetextline1);
    			destroy_component(marqueetextline2);
    			if (detaching && div9_outro) div9_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(4:4) {#each [nowPlaying] as nowPlaying (nowPlaying.trackName)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*nowPlaying*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*nowPlaying*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*nowPlaying*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const MAX_POLL_INTERVAL = 5000;
    const PROGRESS_UPDATE_INTERVAL = 500;

    function formatTime(millis) {
    	let result = '';
    	const hours = Math.floor(millis / 3600000);

    	if (hours > 0) {
    		result += hours.toString() + ':';
    	}

    	let minutes = Math.floor(millis % 3600000 / 60000).toString();

    	if (hours > 0) {
    		minutes = minutes.padStart(2, '0');
    	}

    	result += minutes + ':';
    	const seconds = Math.floor(millis % 60000 / 1000);
    	result += seconds.toString().padStart(2, '0');
    	return result;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NowPlaying', slots, []);
    	let { nowPlaying = null } = $$props;
    	let { computedProgressMs = 0 } = $$props;

    	onMount(async () => {
    		await updateNowPlaying();

    		setInterval(
    			() => {
    				$$invalidate(0, computedProgressMs = Math.min(computedProgressMs + PROGRESS_UPDATE_INTERVAL, (nowPlaying === null || nowPlaying === void 0
    				? void 0
    				: nowPlaying.trackLengthMs) || 0));
    			},
    			PROGRESS_UPDATE_INTERVAL
    		);
    	});

    	async function updateNowPlaying() {
    		$$invalidate(1, nowPlaying = await getNowPlaying());
    		let nextUpdateIn;

    		if (nowPlaying) {
    			nextUpdateIn = Math.min(MAX_POLL_INTERVAL, nowPlaying.trackLengthMs - nowPlaying.progressMs + 2000);

    			if (Math.abs(computedProgressMs - nowPlaying.progressMs) > 1000) {
    				$$invalidate(0, computedProgressMs = nowPlaying.progressMs);
    			}
    		} else {
    			$$invalidate(0, computedProgressMs = 0);
    			nextUpdateIn = MAX_POLL_INTERVAL;
    		}

    		// refresh playback status 1 sec after the current track ends, or in 10 secs, whichever is shorter
    		setTimeout(updateNowPlaying, nextUpdateIn);
    	}

    	const writable_props = ['nowPlaying', 'computedProgressMs'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NowPlaying> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('nowPlaying' in $$props) $$invalidate(1, nowPlaying = $$props.nowPlaying);
    		if ('computedProgressMs' in $$props) $$invalidate(0, computedProgressMs = $$props.computedProgressMs);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getNowPlaying,
    		fade,
    		slideOut,
    		slideIn,
    		MarqueeTextLine,
    		nowPlaying,
    		computedProgressMs,
    		MAX_POLL_INTERVAL,
    		PROGRESS_UPDATE_INTERVAL,
    		updateNowPlaying,
    		formatTime
    	});

    	$$self.$inject_state = $$props => {
    		if ('nowPlaying' in $$props) $$invalidate(1, nowPlaying = $$props.nowPlaying);
    		if ('computedProgressMs' in $$props) $$invalidate(0, computedProgressMs = $$props.computedProgressMs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [computedProgressMs, nowPlaying, formatTime];
    }

    class NowPlaying extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			nowPlaying: 1,
    			computedProgressMs: 0,
    			formatTime: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NowPlaying",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get nowPlaying() {
    		throw new Error("<NowPlaying>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nowPlaying(value) {
    		throw new Error("<NowPlaying>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get computedProgressMs() {
    		throw new Error("<NowPlaying>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set computedProgressMs(value) {
    		throw new Error("<NowPlaying>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTime() {
    		return formatTime;
    	}

    	set formatTime(value) {
    		throw new Error("<NowPlaying>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // (8:0) {:else}
    function create_else_block(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if $signedIn}
    function create_if_block(ctx) {
    	let nowplaying;
    	let current;
    	nowplaying = new NowPlaying({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(nowplaying.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(nowplaying, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nowplaying.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nowplaying.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(nowplaying, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(6:0) {#if $signedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$signedIn*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $signedIn;
    	validate_store(signedIn, 'signedIn');
    	component_subscribe($$self, signedIn, $$value => $$invalidate(0, $signedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Login, NowPlaying, signedIn, $signedIn });
    	return [$signedIn];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
