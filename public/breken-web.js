/*!
 * breken-web.js 1.0.0 (MIT) — Breken's web sensor. https://breken.ai
 *
 * WHAT IT RECORDS: the STRUCTURE of what people do on this site — which control they pressed (its
 * role, its accessible label, a stable selector), which screen they were on (the path with ids
 * folded to :id), whether a request that followed failed (method, path template, status, time,
 * the server's request id), that a script error or an error message appeared (its class, and a
 * hash of the message — never the message on screen), and how long the page was busy or frozen.
 *
 * WHAT IT NEVER RECORDS: what anyone types, the values of any field, page text beyond a control's
 * own label, query strings, cookies, storage, screenshots or recordings. Search boxes are compared
 * by a hash salted per page load, which never leaves the page.
 *
 * WHAT IT SENDS: nothing, most of the time. Only when it sees someone clearly stuck — pressing the
 * same button three times with nothing happening, going round the same steps again and again,
 * an action that fails, a wait that never ends — does it send that one moment, with the steps
 * that led to it, so Breken can replay them against the code and fix what broke.
 *
 * THE ONE PROMPT (off unless the site turns it on with data-prompt="on"): when someone is clearly
 * stuck, once per session, a small card asks "Something not working? Tell us in one line." Their
 * line is the only text this file ever sends, and only because they chose to write it.
 *
 * OFF SWITCHES: data-off on the script tag; window.BREKEN_WEB_OFF = true before it loads;
 * BrekenWeb.stop() at any time; BrekenWeb.optOut() (remembered in this browser); a browser that
 * sends Do Not Track or Global Privacy Control is never recorded.
 *
 * NEVER IN THE WAY: listeners are passive, the work per event is bounded, sends are batched and
 * go out with sendBeacon or a keepalive fetch, and a budget switches the sensor off for the page
 * if it ever costs more than a few milliseconds a second. Every handler is wrapped; an error in
 * this file stops this file, never the page.
 */
(function (root) {
  'use strict';

  var VERSION = '1.0.0';

  /* The thresholds, in one place. Tuned against false alarms: each is past the point where the
   * ordinary version of the behaviour stops (a double-click, a quick tab back and forth, a normal
   * save) — see test/real-world-web-detectors.test.ts for the streams they were tuned on. */
  var T = {
    EFFECT_MS: 1000,        // how long after a press something must visibly happen
    RAGE_MIN: 3,            // presses on one control ...
    RAGE_WINDOW: 2000,      // ... within this long ...
    RAGE_GAP: 1000,         // ... none further apart than this
    ERROR_JS_MS: 1000,      // a script error this soon after a press is the press's
    ERROR_REQ_MS: 1000,     // a request started this soon after a press is the press's
    ERROR_UI_MS: 1500,      // an error message this soon after a press (or its request) is the press's
    EARLY_MS: 2000,         // presses this soon after load are hydration, not the product
    LOOP_MAX_PERIOD: 6,     // the longest workflow compared
    LOOP_REPEATS: 3,        // round the same steps this many times
    LOOP_WINDOW: 10 * 60 * 1000,
    RESUBMIT_WINDOW: 10 * 60 * 1000,
    WAIT_MS: 8000,          // the press's own request still going this long after it
    OWN_REQ_MS: 300,        // a request this soon after a press is the press's own (a new screen's polls start later)
    WAIT_LONG_MS: 15000,
    WAIT_REPORT_ONGOING: 20000,
    FREEZE_MS: 2000,        // the main thread blocked this long after a press
    FREEZE_LONG_MS: 5000,
    LEAVE_MS: 30000,        // gone this soon after an error
    HIDDEN_LEAVE_MS: 60000, // hidden this long counts as gone
    IDLE_MS: 60000,         // no input this long, right after an error, counts as gone
    SEARCH_MIN: 3,          // distinct searches ...
    SEARCH_WINDOW: 2 * 60 * 1000, // ... all empty, within this long
    SCORE_WINDOW: 3 * 60 * 1000,
    PROMPT_AT: 4,
    MAX_EVENTS: 400,
    MAX_SIGNALS: 40,
    MAX_STEPS: 12,
    STEP_WINDOW: 2 * 60 * 1000
  };

  var SIGNALS = ['rage-click', 'dead-click', 'error-click', 'repeated-workflow', 'nav-loop', 'form-resubmit',
    'long-wait', 'freeze', 'leave-after-error', 'search-thrash'];

  /* ------------------------------------------------------------------------------------------ *
   * The pure core: no DOM, no clock of its own. Everything below reads an ordered list of events
   * and answers what it means. The browser half only records events; this half decides.
   * ------------------------------------------------------------------------------------------ */

  // A segment after one of these is a search, not a screen: `/search/red dress` is `/search/:q`.
  var SEARCHY = /^(search|q|query|find|s|lookup|results|tag|tags|topic|topics)$/i;
  // A segment after one of these names somebody: `/patients/jane-doe/records` is `/patients/:id/records`.
  var PEOPLE = /^(users?|u|people|persons?|patients?|customers?|members?|contacts?|profiles?|accounts?|clients?|employees?|students?|authors?|owners?|by)$/i;

  /** A path with the ids folded out, so one screen is one screen whichever record it shows. */
  function foldPath(path) {
    var clean = String(path || '/').replace(/[?#].*$/, '');
    var parts = clean.split('/');
    var out = [];
    var prev = '';
    for (var i = 0; i < parts.length && out.length < 12; i++) {
      var s = parts[i];
      if (!s) continue;
      var d = s;
      try { d = decodeURIComponent(s); } catch (e) { d = s; }
      var after = prev;
      prev = d;
      if (SEARCHY.test(after) || /[\s+%]/.test(d)) { out.push(':q'); continue; }
      if (PEOPLE.test(after) && !/^\[.*\]$|^:/.test(d)) { out.push(':id'); continue; }
      if (/^\[.*\]$|^:/.test(d)) out.push(d.slice(0, 60));
      else if (/^\d+$/.test(d) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d)
        || /^[0-9a-f]{12,}$/i.test(d) || (d.length >= 16 && /\d/.test(d) && /^[A-Za-z0-9_-]+$/.test(d))
        || /@/.test(d) || /^[A-Za-z0-9_-]{20,}$/.test(d) || /\d{4,}/.test(d)) out.push(':id');
      else out.push(d.replace(/[^A-Za-z0-9._~!$&'()*+,;=:-]/g, '_').slice(0, 60));
    }
    return '/' + out.join('/');
  }

  /** FNV-1a, 32 bits, hex. Cheap, stable, and too small to be anything but a grouping key. */
  function fnv(text) {
    var h = 0x811c9dc5;
    var s = String(text);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  /** A script error's message with anything that could be a value taken out. */
  function scrubMessage(message) {
    return String(message || '')
      .replace(/(["'`])(?:(?!\1)[^\\]|\\.){0,400}\1/g, '"…"')
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]')
      .replace(/\bhttps?:\/\/[^\s)]+/g, '[url]')
      .replace(/\b[0-9a-f]{8,}\b/gi, '[id]')
      .replace(/\d{3,}/g, '#')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);
  }

  /** The words a person might type, scrubbed before they leave: the line is theirs, not their data. */
  function scrubLine(text) {
    return String(text || '')
      .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]')
      .replace(/\b(?:\d[ -]?){12,18}\d\b/g, '[number]')
      .replace(/\+?\d[\d\s().-]{7,}\d/g, '[number]')
      .replace(/\b(?=[A-Za-z0-9_-]*\d)(?=[A-Za-z0-9_-]*[A-Za-z])[A-Za-z0-9_-]{24,}\b/g, '[token]')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 280);
  }

  /** A status a person would call a failure: the server broke, or the request could not work. */
  function failStatus(status) {
    if (status === 0) return 'network';
    if (status >= 500) return 'server';
    if (status === 400 || status === 404 || status === 405 || status === 410 || status === 413 || status === 415) return 'client';
    if (status === 409 || status === 412 || status === 422) return 'rejected';
    return null;
  }

  /**
   * Requests the page makes on its own — polling, heartbeats — are named once and then never
   * credited to, or blamed on, whatever the person pressed when one of them happened to land.
   */
  function pollingRoutes(evs) {
    var seen = {};
    for (var i = 0; i < evs.length; i++) if (evs[i].k === 'net' && evs[i].bg) seen[evs[i].m + ' ' + evs[i].r] = true;
    return seen;
  }

  function firstParty(n, polling) { return !n.tp && !polling[n.m + ' ' + n.r]; }

  /** Everything that answered a press, in words. Empty means nothing a person could notice happened. */
  function effectOf(evs, i, polling) {
    var c = evs[i];
    var why = [];
    var x = c.x || {};
    if (x.dom) why.push('the page changed');
    if (x.state) why.push('the control changed state');
    if (x.focus) why.push('focus moved');
    if (x.input) why.push('a form control changed');
    if (x.scroll) why.push('the page scrolled');
    if (x.open) why.push('a window or download opened');
    if (x.clip) why.push('something was copied');
    if (x.dialog) why.push('a dialog opened');
    if (c.c && c.c.ext) why.push('it leaves this page');
    // A handler that held the page for half a second or more did something; if it froze the page,
    // that is the freeze detector's to say, not a dead click.
    if (c.lag) why.push('the page was busy handling it');
    var until = c.end || (c.t + T.EFFECT_MS);
    for (var j = i + 1; j < evs.length && evs[j].t <= until; j++) {
      var e = evs[j];
      if (e.k === 'route') why.push('the screen changed');
      else if (e.k === 'net' && firstParty(e, polling)) why.push('a request was sent');
      else if (e.k === 'eui') why.push('a message appeared');
      else if (e.k === 'busy' && e.on) why.push('it started loading');
      else if (e.k === 'submit') why.push('a form was submitted');
      else if (e.k === 'leave' || e.k === 'hide') why.push('the page was left');
      else if (e.k === 'long' && e.t >= c.t - 50) why.push('the page was busy handling it');
    }
    return why;
  }

  /** What went wrong after an action, if anything: the first script error, failed request and error message that belong to it. */
  function causesOf(evs, i, polling, now) {
    var a = evs[i];
    var js = null, req = null, rej = null, ui = null, pending = false;
    // A press that moved to a new screen owns what it sent BEFORE the screen changed; what the new
    // screen then asks for itself (its data, its polls) is that screen's, not the press's.
    var screenAt = Infinity;
    for (var r = i + 1; r < evs.length && evs[r].t - a.t <= T.EFFECT_MS; r++) if (evs[r].k === 'route') { screenAt = evs[r].t; break; }
    for (var j = i + 1; j < evs.length; j++) {
      var e = evs[j];
      if (e.t > a.t + 30000) break;
      // The next action owns what follows it — unless it is this press submitting its own form.
      if ((e.k === 'click' || e.k === 'submit') && !(a.k === 'click' && e.k === 'submit' && e.t - a.t <= 100)) break;
      if (!js && e.k === 'err' && !e.tp && e.t - a.t <= T.ERROR_JS_MS) js = e;
      if (e.k === 'net' && e.t - a.t <= T.ERROR_REQ_MS && e.t <= screenAt && firstParty(e, polling)) {
        if (e.e == null) pending = true;
        else if (!e.ab && failStatus(e.s) === 'rejected') { if (!rej) rej = e; }
        else if (!req && failStatus(e.s) && !e.ab) req = e;
      }
      var answered = req || rej;
      if (!ui && e.k === 'eui' && (e.t - a.t <= T.ERROR_UI_MS || (answered && e.t >= answered.e && e.t - answered.e <= T.ERROR_UI_MS))) ui = e;
    }
    // A validation message ("required", "must be…", a field marked invalid) answering a press is the
    // form doing its job; it is kept for the resubmit judgement and does not make the press broken.
    var broke = ui && !ui.v && !(rej && !req && !js) ? ui : null;
    var settledAt = a.t + Math.max(T.ERROR_UI_MS, T.EFFECT_MS);
    // A 409/422 is the server refusing what was sent — a person's input, usually. It counts for a
    // form sent again (resubmit), not as a broken control.
    return { js: js, req: req, rej: rej, ui: broke, anyUi: ui, pending: pending || now < settledAt };
  }

  function page(e) { return e.p || '/'; }

  function elementOf(c) {
    if (!c) return null;
    return { role: c.role || null, label: c.name || null, selector: c.sel || null, tag: c.tag || null };
  }

  /** The steps that led here, as a person would retell them: screens, presses, fields touched, forms sent. */
  function stepsBefore(evs, uptoIndex) {
    var end = evs[uptoIndex];
    var steps = [];
    for (var i = uptoIndex; i >= 0 && steps.length < T.MAX_STEPS; i--) {
      var e = evs[i];
      if (end.t - e.t > T.STEP_WINDOW) break;
      var step = null;
      if (e.k === 'route') step = { page: e.r, action: e.back ? 'back' : 'goto' };
      else if (e.k === 'click' && e.c && !e.c.skip) step = { page: page(e), action: 'click', element: elementOf(e.c) };
      else if (e.k === 'fill' && e.c) step = { page: page(e), action: 'fill', element: elementOf(e.c) };
      else if (e.k === 'submit' && e.f) step = { page: page(e), action: 'submit', element: elementOf(e.f) };
      if (!step) continue;
      var prev = steps[0];
      // Presses of one control in a row are one step, "pressed ×n".
      if (prev && prev.action === 'click' && step.action === 'click' && prev.element && step.element
        && prev.element.selector === step.element.selector && prev.page === step.page) { prev.times = (prev.times || 1) + 1; continue; }
      steps.unshift(step);
    }
    return steps;
  }

  function sig(type, key, at, index, fields) {
    var s = { type: type, key: key, t: at, i: index };
    for (var k in fields) if (Object.prototype.hasOwnProperty.call(fields, k)) s[k] = fields[k];
    return s;
  }

  function errorDetail(causes) {
    var d = {};
    if (causes.js) { d.error = { class: causes.js.n || 'Error' }; if (causes.js.h) d.messageHash = causes.js.h; if (causes.js.f) d.frame = causes.js.f; }
    if (causes.req) { d.method = causes.req.m; d.route = causes.req.r; d.status = causes.req.s; d.durationMs = causes.req.e - causes.req.t; if (causes.req.rid) d.requestId = causes.req.rid; }
    var shown = causes.ui || causes.anyUi;
    if (shown) { d.uiKind = shown.kind; d.uiHash = shown.h; if (shown.v) d.validation = true; }
    return d;
  }

  /** Presses: rage (the same control, again and again, nothing happening), dead (once, nothing), error (it broke). */
  function detectPresses(evs, now, polling, out, horizon) {
    var errored = {};

    // Error clicks first: a press that broke something is that, whatever else it is.
    var claimed = {};
    for (var ai = 0; ai < evs.length; ai++) {
      var act = evs[ai];
      if (act.k !== 'click' && act.k !== 'submit') continue;
      if (act.k === 'click' && (!act.c || act.c.skip)) continue;
      var causes = causesOf(evs, ai, polling, now);
      if (causes.pending) { errored[act.id] = 'pending'; continue; }
      if (causes.js && claimed[causes.js.id]) causes.js = null;
      if (causes.req && claimed[causes.req.id]) causes.req = null;
      if (causes.ui && claimed[causes.ui.id]) causes.ui = null;
      if (!causes.js && !causes.req && !causes.ui) continue;
      if (causes.js) claimed[causes.js.id] = true;
      if (causes.req) claimed[causes.req.id] = true;
      if (causes.ui) claimed[causes.ui.id] = true;
      errored[act.id] = true;
      if (act.k === 'submit' || act.t < horizon) continue; // a form's failure is the resubmit detector's to judge
      // A 5xx is the product breaking; a dropped connection (status 0) is usually the person's network.
      var serverBroke = causes.req && failStatus(causes.req.s) === 'server';
      var weight = 2 + (serverBroke || (causes.js && causes.ui) ? 1 : 0) + (act.c.prim && (serverBroke || causes.js) ? 1 : 0);
      out.push(sig('error-click', 'error:' + act.id, act.t, ai, {
        page: page(act), el: act.c, weight: Math.min(weight, 4), clicks: 1,
        requestIds: causes.req && causes.req.rid ? [causes.req.rid] : [],
        detail: errorDetail(causes)
      }));
    }

    // Runs: presses on one control, each within RAGE_GAP of the last. Three or more, densely, with
    // nothing happening, is rage; one or two with nothing happening is a dead click.
    var runs = [], cur = null;
    for (var n = 0; n < evs.length; n++) {
      var e = evs[n];
      if (e.k !== 'click') continue;
      var same = cur && e.c && cur.sel === e.c.sel && (cur.eid === undefined || e.c.eid === undefined || cur.eid === e.c.eid);
      if (same && e.p === evs[cur.items[cur.items.length - 1]].p && e.t - evs[cur.items[cur.items.length - 1]].t <= T.RAGE_GAP) cur.items.push(n);
      else { cur = { sel: e.c ? e.c.sel : null, eid: e.c ? e.c.eid : undefined, items: [n] }; runs.push(cur); }
    }
    var deadBefore = {};
    for (var r = 0; r < runs.length; r++) {
      var items = runs[r].items;
      var first = evs[items[0]], last = evs[items[items.length - 1]];
      var c = first.c;
      if (!c || !c.look || c.rep || c.chrome || c.skip || c.cur || c.nodom || first.early) continue;
      // Still open: the last press has not been judged, or another could still join the run.
      if (!last.settled || (r === runs.length - 1 && now - last.t <= T.RAGE_GAP)) continue;
      var quiet = true;
      for (var m = 0; m < items.length && quiet; m++) {
        if (errored[evs[items[m]].id]) quiet = false;
        else if (effectOf(evs, items[m], polling).length) quiet = false;
      }
      if (!quiet) continue;
      var dense = false;
      for (var z = 0; z + T.RAGE_MIN - 1 < items.length; z++) {
        if (evs[items[z + T.RAGE_MIN - 1]].t - evs[items[z]].t <= T.RAGE_WINDOW) { dense = true; break; }
      }
      var again = deadBefore[c.sel] || 0;
      deadBefore[c.sel] = again + 1;
      if (first.t < horizon) continue;
      if (dense) {
        var weight2 = (c.dis ? 2 : 3) + (c.prim && !c.dis ? 1 : 0) + (items.length >= 5 ? 1 : 0);
        out.push(sig('rage-click', 'rage:' + first.id, first.t, items[items.length - 1], {
          page: page(first), el: c, weight: Math.min(weight2, 5),
          clicks: items.length, windowMs: last.t - first.t,
          detail: { disabled: Boolean(c.dis), primary: Boolean(c.prim) }
        }));
      } else if (!c.dis) {
        out.push(sig('dead-click', 'dead:' + first.id, first.t, items[items.length - 1], {
          page: page(first), el: c, weight: again ? 2 : 1, clicks: items.length,
          detail: { primary: Boolean(c.prim), repeated: again > 0 }
        }));
      }
    }
  }

  /** Round the same steps again: the same screens (the same records, not just the same kind) and presses, in the same order. */
  function detectLoops(evs, now, polling, out) {
    var steps = [];
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i];
      var tok = null;
      if (e.k === 'route') tok = { tok: 'r' + e.h, kind: 'route', back: Boolean(e.back) };
      else if (e.k === 'click' && e.c && !e.c.chrome && !e.c.rep && !e.c.skip && !e.c.toggle) tok = { tok: 'c' + e.c.sel, kind: 'click', prim: Boolean(e.c.prim) };
      else if (e.k === 'submit' && e.f) tok = { tok: 's' + e.f.sel, kind: 'submit' };
      if (!tok) continue;
      if (steps.length && steps[steps.length - 1].tok === tok.tok) continue; // a double press is one step
      tok.i = i;
      tok.t = e.t;
      steps.push(tok);
    }
    var best = null;
    for (var p = 2; p <= T.LOOP_MAX_PERIOD; p++) {
      if (steps.length < 2 * p) break;
      var k = 1;
      while (steps.length >= (k + 1) * p) {
        var same = true;
        for (var s = 0; s < p; s++) if (steps[steps.length - 1 - s].tok !== steps[steps.length - 1 - s - k * p].tok) { same = false; break; }
        if (!same) break;
        k++;
      }
      if (k < 2) continue;
      var block = steps.slice(steps.length - p);
      var distinct = {};
      for (var b = 0; b < block.length; b++) distinct[block[b].tok] = true;
      if (Object.keys(distinct).length < 2) continue;
      best = { p: p, k: k, start: steps.length - k * p };
      break;
    }
    if (!best) return;
    var loop = steps.slice(best.start);
    var span = loop[loop.length - 1].t - loop[0].t;
    if (span > T.LOOP_WINDOW) return;
    var hasRoute = false, hasSubmit = false, hasPrimary = false, retreat = false, allRoutes = true;
    for (var l = 0; l < loop.length; l++) {
      if (loop[l].kind === 'route') { hasRoute = true; if (loop[l].back) retreat = true; } else allRoutes = false;
      if (loop[l].kind === 'submit') hasSubmit = true;
      if (loop[l].kind === 'click' && loop[l].prim) hasPrimary = true;
    }
    // A workflow goes somewhere: a screen, a form, a primary action. Opening and closing a panel is not one.
    if (!hasRoute && !hasSubmit && !hasPrimary) return;
    // The last round must have answered before the loop is judged: its third try may be the one that works.
    var lastPress = null;
    for (var la = evs.length - 1; la >= loop[(best.k - 1) * best.p].i; la--) if (evs[la].k === 'click' || evs[la].k === 'submit') { lastPress = la; break; }
    if (lastPress !== null && causesOf(evs, lastPress, polling, now).pending) return;
    // Each time round: did it fail, did it get something done, was a form being corrected?
    var failedRounds = 0, productiveRounds = 0, correcting = 0;
    for (var r = 0; r < best.k; r++) {
      var from = loop[r * best.p].t;
      var to = r + 1 < best.k ? loop[(r + 1) * best.p].t : now;
      var failed = false, wrote = false, broke = false, edited = false;
      for (var j = loop[r * best.p].i; j < evs.length && evs[j].t < to; j++) {
        var x = evs[j];
        if (x.t < from) continue;
        if (x.k === 'fill') edited = true;
        if (x.k === 'submit' && x.ed) edited = true;
        if (x.k === 'eui') { failed = true; if (!x.v) broke = true; }
        if (x.k === 'err' && !x.tp) { failed = true; broke = true; }
        if (x.k === 'submit' && x.inv) failed = true;
        if (x.k === 'net' && firstParty(x, polling) && x.e != null) {
          var fs = failStatus(x.s);
          if (fs && !x.ab) { failed = true; if (fs === 'server') broke = true; }
          else if (x.m !== 'GET' && x.m !== 'HEAD' && x.s >= 200 && x.s < 400) wrote = true;
        }
      }
      if (failed) failedRounds++;
      if (wrote && !failed) productiveRounds++;
      if (failed && !broke && edited) correcting++;
    }
    // Saving and saving again, each time accepted, is work; a form fixed field by field is a person
    // doing what the form asked. Neither is stuck. And nothing failing at all is not evidence enough.
    if (productiveRounds > 0 && productiveRounds === best.k) return;
    if (correcting === failedRounds) return;
    var strong = best.k >= T.LOOP_REPEATS && failedRounds >= 1 && (hasSubmit || hasPrimary || retreat || failedRounds >= 2);
    var weak = best.k === 2 && failedRounds >= 2;
    if (!strong && !weak) return;
    var type = allRoutes ? 'nav-loop' : 'repeated-workflow';
    var trigger = loop[loop.length - 1].i;
    // One loop, one key, whichever round it is first seen at: its steps (screens included) as a set.
    var tokens = {};
    for (var tk = 0; tk < best.p; tk++) tokens[loop[tk].tok] = true;
    out.push(sig(type, 'loop:' + Object.keys(tokens).sort().join(','), evs[loop[0].i].t, trigger, {
      page: page(evs[trigger]) || evs[trigger].r, weight: strong ? 4 : 3,
      windowMs: span, detail: { period: best.p, repeats: best.k, failedRounds: failedRounds, back: retreat }
    }));
  }

  /** The same form sent again after it failed — and whether that is a person fixing a typo or a person stuck. */
  function detectResubmits(evs, now, polling, out, horizon) {
    var forms = {};
    for (var i = 0; i < evs.length; i++) {
      var e = evs[i];
      if (e.k !== 'submit' || !e.f) continue;
      (forms[e.f.sel] = forms[e.f.sel] || []).push(i);
    }
    Object.keys(forms).forEach(function (sel) {
      var list = forms[sel];
      var outcomes = list.map(function (idx) {
        var s = evs[idx];
        var causes = causesOf(evs, idx, polling, now);
        // The press that sent the form owns its request; look from that press when there is one.
        for (var b = idx - 1; b >= 0 && s.t - evs[b].t <= 100; b--) {
          if (evs[b].k === 'click') {
            var viaClick = causesOf(evs, b, polling, now);
            if (!causes.req && viaClick.req) causes.req = viaClick.req;
            if (!causes.rej && viaClick.rej) causes.rej = viaClick.rej;
            if (!causes.js && viaClick.js) causes.js = viaClick.js;
            if (!causes.anyUi && viaClick.anyUi) causes.anyUi = viaClick.anyUi;
            if (viaClick.pending) causes.pending = true;
            break;
          }
        }
        var kind = null;
        if (causes.req && (failStatus(causes.req.s) === 'server' || failStatus(causes.req.s) === 'network')) kind = 'server';
        else if (causes.js) kind = 'server';
        else if (s.inv || causes.anyUi || causes.rej || (causes.req && failStatus(causes.req.s))) kind = 'validation';
        var said = causes.req || causes.rej;
        return { s: s, idx: idx, kind: kind, causes: causes, pending: causes.pending, hash: s.inv ? 'native:' + (s.ih || '') : causes.anyUi ? causes.anyUi.h : said ? String(said.s) : null };
      });
      for (var n = 1; n < outcomes.length; n++) {
        var prev = outcomes[n - 1], cur = outcomes[n];
        if (prev.pending || !prev.kind) continue;
        if (cur.s.t - prev.s.t > T.RESUBMIT_WINDOW || cur.s.t < horizon) continue;
        var weight = 0, cause = null;
        if (prev.kind === 'server') { weight = 3; cause = 'the last try failed on the server'; }
        else if (n >= 2 && outcomes[n - 2].kind === 'validation' && outcomes[n - 2].hash === prev.hash && !outcomes[n - 2].pending) { weight = 3; cause = 'the same error, again'; }
        else if (!cur.s.ed) { weight = 2; cause = 'sent again unchanged after an error'; }
        if (!weight) continue;
        out.push(sig('form-resubmit', 'resubmit:' + cur.s.id, cur.s.t, cur.idx, {
          page: page(cur.s), el: cur.s.f, weight: weight,
          requestIds: prev.causes.req && prev.causes.req.rid ? [prev.causes.req.rid] : [],
          detail: (function () { var d = errorDetail(prev.causes); d.cause = cause; d.attempts = n + 1; return d; })()
        }));
      }
    });
  }

  /**
   * Waiting: the press's OWN request (sent within OWN_REQ_MS of it) still going WAIT_MS later, and
   * the person could see it or felt it — a loading indicator appeared, or they pressed the same
   * thing again. A spinner with no request behind it is decoration (an animated empty state); a
   * request nobody sees is a new screen's own polling or a long-poll; neither is anybody waiting.
   */
  function detectWaits(evs, now, polling, out, horizon) {
    for (var i = 0; i < evs.length; i++) {
      var a = evs[i];
      if (a.k !== 'click' && a.k !== 'submit') continue;
      if (a.t < horizon) continue;
      if (a.k === 'click' && (!a.c || a.c.skip || !a.c.look)) continue;
      var shown = false, reqEnd = 0, reqPending = false, own = 0, screenAt = Infinity;
      for (var j = i + 1; j < evs.length; j++) {
        var e = evs[j];
        if (e.t - a.t > 5 * 60 * 1000) break;
        if (e.k === 'route' && screenAt === Infinity && e.t - a.t <= T.EFFECT_MS) screenAt = e.t;
        if (!shown && e.k === 'busy' && e.on && e.t - a.t <= 2000) shown = true;
        if (e.k === 'net' && e.t - a.t <= T.OWN_REQ_MS && e.t <= screenAt && firstParty(e, polling) && !e.up) {
          own++;
          if (e.e == null) reqPending = true; else reqEnd = Math.max(reqEnd, e.e);
        }
      }
      if (!own) continue;
      var until = reqPending ? now : reqEnd;
      var wait = until - a.t;
      if (wait < T.WAIT_MS) continue;
      // Someone who switched tabs was not waiting.
      var hiddenDuring = false, again = 0, impatient = 0;
      for (var h = i + 1; h < evs.length && evs[h].t <= until; h++) {
        var x = evs[h];
        if (x.k === 'hide' || x.k === 'leave') { hiddenDuring = true; break; }
        if (x.k === 'click' && x.t - a.t > 2000) { impatient++; if (a.c && x.c && x.c.sel === a.c.sel) again++; }
      }
      if (hiddenDuring || (!shown && !again)) continue;
      if (reqPending && wait < T.WAIT_REPORT_ONGOING) continue; // report when it ends, or once it is clearly stuck
      var weight = (wait >= T.WAIT_LONG_MS ? 3 : 2) + (again >= 1 ? 1 : 0);
      out.push(sig('long-wait', 'wait:' + a.id, a.t, i, {
        page: page(a), el: a.c || a.f, weight: Math.min(weight, 4), durationMs: Math.round(wait),
        detail: { ongoing: reqPending, impatient: impatient, again: again, spinner: shown, request: true }
      }));
    }
  }

  /** The main thread blocked right after a press: the page could not answer anything at all. */
  function detectFreezes(evs, now, out, horizon) {
    for (var i = 0; i < evs.length; i++) {
      var a = evs[i];
      if (a.k !== 'click' && a.k !== 'submit' && a.k !== 'key') continue;
      if (a.t < horizon) continue;
      if (a.dlg) continue; // alert() and confirm() stop the thread on purpose
      var blocked = a.lag || 0, sum = 0, hidden = false;
      // Up to the next action: a long task that starts as the next press lands is that press's.
      var until = a.t + 3000;
      for (var n2 = i + 1; n2 < evs.length && evs[n2].t <= until + 50; n2++) {
        if (evs[n2].k === 'click' || evs[n2].k === 'submit' || evs[n2].k === 'key') { until = Math.min(until, evs[n2].t - 50); break; }
      }
      for (var j = i + 1; j < evs.length && evs[j].t <= until; j++) {
        if (evs[j].k === 'long' && evs[j].t >= a.t - 50) sum += evs[j].d;
        if (evs[j].k === 'hide' || evs[j].k === 'dialog') hidden = true;
      }
      // Long tasks can start a moment before the press lands.
      for (var b = i - 1; b >= 0 && a.t - evs[b].t <= 50; b--) if (evs[b].k === 'long') sum += evs[b].d;
      blocked = Math.max(blocked, sum);
      if (hidden || blocked < T.FREEZE_MS) continue;
      out.push(sig('freeze', 'freeze:' + a.id, a.t, i, {
        page: page(a), el: a.c && !a.c.skip ? a.c : a.f || null, weight: blocked >= T.FREEZE_LONG_MS ? 3 : 2, durationMs: Math.round(blocked),
        detail: {}
      }));
    }
  }

  /** Gone — the tab closed, hidden for a minute, or no input at all — within half a minute of an error they saw. */
  function detectLeaves(evs, now, polling, out, horizon) {
    for (var i = 0; i < evs.length; i++) {
      var L = evs[i];
      if (L.k !== 'leave' || L.t < horizon) continue;
      var cause = null;
      for (var j = i - 1; j >= 0 && L.t - evs[j].t <= T.LEAVE_MS; j--) {
        var e = evs[j];
        if (e.k === 'eui') { cause = { kind: 'message', e: e }; break; }
        if (e.k === 'net' && firstParty(e, polling) && e.e != null && failStatus(e.s) && !e.ab && !e.bg) { cause = { kind: 'request', e: e }; break; }
        if (e.k === 'err' && !e.tp && e.act) { cause = { kind: 'script', e: e }; break; }
      }
      if (!cause) continue;
      var d = { why: L.why, afterMs: Math.round(L.t - cause.e.t), cause: cause.kind };
      if (cause.kind === 'request') { d.method = cause.e.m; d.route = cause.e.r; d.status = cause.e.s; }
      if (cause.kind === 'script') { d.error = { class: cause.e.n || 'Error' }; if (cause.e.h) d.messageHash = cause.e.h; }
      if (cause.kind === 'message') { d.uiKind = cause.e.kind; d.uiHash = cause.e.h; }
      out.push(sig('leave-after-error', 'leave:' + L.id, L.t, i, {
        page: page(L), weight: 2, requestIds: cause.kind === 'request' && cause.e.rid ? [cause.e.rid] : [], detail: d
      }));
    }
  }

  /** Searching again and again, with different words, and finding nothing each time. */
  function detectSearches(evs, now, out) {
    var run = [];
    for (var i = evs.length - 1; i >= 0; i--) {
      var e = evs[i];
      if (e.k !== 'search' || e.zero == null) continue;
      if (!e.zero) break;                        // a search that found something ends the thrash
      if (run.length && evs[run[0]].t - e.t > T.SEARCH_WINDOW) break;
      run.unshift(i);
    }
    var distinct = {};
    for (var r = 0; r < run.length; r++) distinct[evs[run[r]].q] = true;
    var n = Object.keys(distinct).length;
    if (n < T.SEARCH_MIN) return;
    var first = evs[run[0]];
    out.push(sig('search-thrash', 'search:' + first.id, first.t, run[run.length - 1], {
      page: page(first), el: first.c || null, weight: n >= 5 ? 3 : 2,
      windowMs: evs[run[run.length - 1]].t - first.t, detail: { searches: run.length, distinct: n }
    }));
  }

  /** Every signal the events support, each with a stable key so it is emitted once. */
  function analyse(evs, now, withSteps) {
    var out = [];
    var polling = pollingRoutes(evs);
    // Nothing older than this is judged again: it was judged when it happened.
    var horizon = now - 10 * 60 * 1000;
    detectPresses(evs, now, polling, out, horizon);
    detectLoops(evs, now, polling, out);
    detectResubmits(evs, now, polling, out, horizon);
    detectWaits(evs, now, polling, out, horizon);
    detectFreezes(evs, now, out, horizon);
    detectLeaves(evs, now, polling, out, horizon);
    detectSearches(evs, now, out);
    if (withSteps !== false) for (var i = 0; i < out.length; i++) out[i].steps = stepsBefore(evs, out[i].i);
    return out;
  }

  /**
   * How stuck is this person, now. Each kind counts once at its strongest (and once more if it
   * keeps happening), within the last few minutes. One weak signal never reaches the prompt; a
   * strong one does, and so do two different kinds together.
   */
  function frustration(signals, now) {
    // Per screen: two weak signals on two unrelated screens are not one person stuck on one thing.
    var screens = {};
    for (var i = 0; i < signals.length; i++) {
      var s = signals[i];
      if (now - s.t > T.SCORE_WINDOW) continue;
      var kinds = screens[s.page || '/'] || (screens[s.page || '/'] = {});
      var k = kinds[s.type] || (kinds[s.type] = { max: 0, n: 0 });
      k.max = Math.max(k.max, s.weight);
      k.n++;
    }
    var best = 0;
    for (var pageKey in screens) {
      if (!Object.prototype.hasOwnProperty.call(screens, pageKey)) continue;
      var score = 0, ks = screens[pageKey];
      for (var name in ks) if (Object.prototype.hasOwnProperty.call(ks, name)) score += ks[name].max + (ks[name].n > 1 ? 1 : 0);
      best = Math.max(best, score);
    }
    return best;
  }

  /** Whether the one prompt should be offered now, and about which signal. */
  function promptFor(signals, now) {
    var live = [];
    for (var i = 0; i < signals.length; i++) {
      if (now - signals[i].t <= T.SCORE_WINDOW && signals[i].type !== 'leave-after-error') live.push(signals[i]);
    }
    if (!live.length || frustration(live, now) < T.PROMPT_AT) return null;
    live.sort(function (a, b) { return b.weight - a.weight || b.t - a.t; });
    return live[0];
  }

  var core = {
    VERSION: VERSION, T: T, SIGNALS: SIGNALS, foldPath: foldPath, fnv: fnv, scrubMessage: scrubMessage, scrubLine: scrubLine,
    failStatus: failStatus, effectOf: effectOf, SEARCHY: SEARCHY, PEOPLE: PEOPLE, analyse: analyse, stepsBefore: stepsBefore, frustration: frustration, promptFor: promptFor
  };
  if (root && root.__BREKEN_WEB_TEST__) root.BrekenWebCore = core;
  if (typeof window === 'undefined' || typeof document === 'undefined' || !root || root !== window) return;

  /* ------------------------------------------------------------------------------------------ *
   * The browser half: record events, cheaply, and hand them to the core.
   * ------------------------------------------------------------------------------------------ */

  if (window.__brekenWeb) return; // loaded twice (a router that re-adds scripts): the first one runs
  window.__brekenWeb = true;
  // The public face exists before anything can fail, so a host calling it never throws.
  try { window.BrekenWeb = { version: VERSION, active: false, stop: function () {}, optOut: function () { try { localStorage.setItem('breken-web-off', '1'); } catch (e) { /* denied */ } } }; } catch (e) { /* frozen window */ }

  var script = document.currentScript;
  var ds = (script && script.dataset) || {};
  var given = window.BrekenWebConfig || {};
  var controlUrl = given.control || ds.control || '';
  var remoteAllowed = !controlUrl;
  function opt(name, fallback) {
    if (given[name] !== undefined && given[name] !== null) return given[name];
    if (ds[name] !== undefined) return ds[name];
    return fallback;
  }
  var cfg = {
    key: String(opt('key', '')),
    // First-party by default: the site's own server sensor forwards to Breken, so the beacon is
    // never an ad-blocked third-party request and the page needs no key at all.
    endpoint: String(opt('endpoint', '/.well-known/agent-report/web-events')),
    prompt: String(opt('prompt', 'off')) === 'on' || opt('prompt', false) === true,
    sample: Number(opt('sample', 1)),
    framework: String(opt('framework', 'vanilla')).slice(0, 20),
    accent: String(opt('accent', '')).slice(0, 40),
    respectDnt: String(opt('respectDnt', 'on')) !== 'off',
    webmcp: String(opt('webmcp', 'off')) === 'on',
    off: opt('off', undefined) !== undefined && String(opt('off', '')) !== 'false'
  };

  function storage(kind) { try { return window[kind]; } catch (e) { return null; } }
  function sget(kind, k) { try { var s = storage(kind); return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function sset(kind, k, v) { try { var s = storage(kind); if (s) s.setItem(k, v); } catch (e) { /* storage denied */ } }

  var dnt = cfg.respectDnt && (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1' || navigator.globalPrivacyControl === true);
  var sameOrigin = (function () { try { return new URL(cfg.endpoint, location.href).origin === location.origin; } catch (e) { return false; } })();
  // A key is only needed when the page talks to Breken directly; a first-party forwarder adds its own.
  var keyOk = /^brk_pub_[0-9a-f]{16}_[A-Za-z0-9_-]{32,64}$/.test(cfg.key) || (sameOrigin && !cfg.key);
  if (cfg.off || window.BREKEN_WEB_OFF || dnt || sget('localStorage', 'breken-web-off') === '1' || !keyOk) {
    window.BrekenWeb = { version: VERSION, active: false, stop: function () {}, optOut: function () { sset('localStorage', 'breken-web-off', '1'); } };
    window.BrekenWeb.status = function () { return { active: false, reason: dnt ? 'privacy' : !keyOk ? 'invalid-key' : 'opted-out' }; };
    return;
  }

  var now = function () { return Date.now(); };
  var origin = (window.performance && performance.timeOrigin) || (now() - (window.performance ? performance.now() : 0));
  var fromPerf = function (ts) { return Math.round(origin + ts); };

  function rand(n) {
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var out = '';
    var bytes = new Uint8Array(n);
    try { crypto.getRandomValues(bytes); } catch (e) { for (var j = 0; j < n; j++) bytes[j] = Math.floor(Math.random() * 256); }
    for (var i = 0; i < n; i++) out += abc[bytes[i] & 63];
    return out;
  }

  var STORE = '__brk_web';
  var restored = null;
  try { restored = JSON.parse(sget('sessionStorage', STORE) || 'null'); } catch (e) { restored = null; }
  if (restored && (typeof restored !== 'object' || now() - (restored.at || 0) > 30 * 60 * 1000)) restored = null;

  var session = (restored && restored.s) || ('s' + rand(20));
  var sampled = restored && typeof restored.in === 'boolean' ? restored.in : !(cfg.sample >= 0 && cfg.sample < 1) || Math.random() < cfg.sample;
  if (!sampled) {
    sset('sessionStorage', STORE, JSON.stringify({ s: session, in: false, at: now() }));
    window.BrekenWeb = { version: VERSION, active: false, stop: function () {}, optOut: function () { sset('localStorage', 'breken-web-off', '1'); } };
    window.BrekenWeb.status = function () { return { active: false, reason: 'not-sampled' }; };
    return;
  }

  var S = {
    evs: (restored && Array.isArray(restored.evs)) ? restored.evs.slice(-80) : [],
    seq: (restored && restored.seq) || 0,
    emitted: (restored && restored.emitted) || {},
    signals: [],
    out: [],
    fb: [],
    sent: (restored && restored.sent) || 0,
    fails: 0,
    prompted: Boolean(restored && restored.prompted) || sget('sessionStorage', '__brk_web_p') === '1',
    stopped: false,
    loadT: now(),
    windows: [],
    lastRouteT: now(),
    lastInputT: 0,
    lastKeyT: 0,
    busy: false,
    busyUntil: 0,
    cost: 0,
    costFrom: now(),
    costMinute: 0,
    costMinuteFrom: now(),
    internalNavAt: 0,
    hideTimer: null,
    idleTimer: null,
    faults: 0,
    nodom: false,
    // A browser driven by a program is not a person: its signals are kept apart and it is never
    // asked anything. `navigator.webdriver` covers Playwright, Puppeteer and Selenium (and so the
    // walker's own replays); a signed agent (Web Bot Auth) is told to us by the intake, which sees
    // the Signature-Agent header this page cannot.
    agent: (restored && restored.agent) || (navigator.webdriver === true ? 'webdriver'
      : /HeadlessChrome|ChatGPT|Claude-User|Claude-Web|Perplexity|GPTBot|OAI-SearchBot|Operator|browser-use|Playwright|Puppeteer|Manus/i.test(navigator.userAgent || '') ? 'user-agent' : null)
  };
  var pending = null;
  // What the last page left unfinished ended with it: its requests were cancelled by the
  // navigation, its spinner went with it, its presses were judged on what they had done by then.
  (function () {
    var t = now();
    var wasBusy = false;
    for (var i = 0; i < S.evs.length; i++) {
      var e = S.evs[i];
      if (e.k === 'net' && e.e == null) { e.e = Math.min(t, e.t + 1); e.s = 0; e.ab = 1; }
      if (e.k === 'click' && !e.settled) { e.settled = true; e.end = e.end || e.t + T.EFFECT_MS; e.x = e.x || {}; }
      if (e.k === 'busy') wasBusy = e.on;
      if (e.k === 'search' && e.zero == null) e.zero = false;
    }
    if (wasBusy) S.evs.push({ k: 'busy', on: false, t: t, id: ++S.seq, p: '/' });
  })();

  function stop() {
    if (S.stopped) return;
    S.stopped = true;
    try { if (mo) mo.disconnect(); } catch (e) { /* already gone */ }
    try { if (lto) lto.disconnect(); } catch (e) { /* already gone */ }
    if (pending) clearTimeout(pending);
    if (S.hideTimer) clearTimeout(S.hideTimer);
    if (S.idleTimer) clearTimeout(S.idleTimer);
    try { if (promptHost && promptHost.parentNode) promptHost.parentNode.removeChild(promptHost); if (launcherHost) launcherHost.remove(); } catch (e) { /* gone */ }
    if (window.BrekenWeb) window.BrekenWeb.active = false;
  }

  /** Every handler goes through here: timed against a budget, and never able to throw into the page. */
  function guard(fn) {
    return function () {
      if (S.stopped || !remoteAllowed) return undefined;
      var t0 = (window.performance && performance.now) ? performance.now() : 0;
      try { return fn.apply(this, arguments); }
      catch (e) { S.lastFault = String(e && e.message || e).slice(0, 200); if (++S.faults >= 5) stop(); return undefined; }
      finally {
        if (t0) {
          var spent = performance.now() - t0;
          var t = now();
          if (t - S.costFrom > 10000) { S.cost = 0; S.costFrom = t; }
          if (t - S.costMinuteFrom > 60000) { S.costMinute = 0; S.costMinuteFrom = t; }
          S.cost += spent;
          S.costMinute += spent;
          S.costTotal = (S.costTotal || 0) + spent;
          // More than 150ms in ten seconds: stop watching the DOM. More than 600ms in a minute: stop.
          if (S.cost > 150 && !S.nodom) { S.nodom = true; try { if (mo) mo.disconnect(); } catch (e2) { /* ok */ } }
          if (S.costMinute > 600) stop();
        }
      }
    };
  }

  /* ---------------- screens ---------------- */

  function routeNow() {
    var p = location.pathname || '/';
    var h = location.hash || '';
    var concrete = p;
    if (/^#!?\//.test(h)) { p = p.replace(/\/$/, '') + '/' + h.replace(/^#!?\//, '').replace(/[?].*$/, ''); concrete = p; }
    var tpl = null;
    try {
      var nd = window.__NEXT_DATA__;
      if (nd && typeof nd.page === 'string' && nd.page.charAt(0) === '/' && !/^\/_/.test(nd.page)) tpl = nd.page;
    } catch (e) { tpl = null; }
    return { r: tpl && location.pathname === (nd_asPath()) ? tpl : foldPath(p), h: fnv(concrete) };
  }
  function nd_asPath() {
    try { var nd = window.__NEXT_DATA__; return nd && typeof nd.asPath === 'string' ? nd.asPath.replace(/[?#].*$/, '') : null; } catch (e) { return null; }
  }
  var cur = routeNow();
  var history2 = [cur.h];
  (function () {
    // Every page load is a screen visit (a multi-page app's loop is made of them).
    var back = false;
    try { var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]; back = Boolean(nav && nav.type === 'back_forward'); } catch (e) { back = false; }
    var ev = { k: 'route', r: cur.r, h: cur.h, via: 'load', back: back, p: cur.r, t: now(), id: ++S.seq };
    S.evs.push(ev);
  })();

  function push(ev) {
    ev.id = ++S.seq;
    if (ev.t === undefined) ev.t = now();
    if (ev.p === undefined) ev.p = cur.r;
    // Kept in time order: a long task is reported after it ends, behind presses that came later.
    var at = S.evs.length;
    while (at > 0 && S.evs[at - 1].t > ev.t) at--;
    if (at === S.evs.length) S.evs.push(ev); else S.evs.splice(at, 0, ev);
    if (S.evs.length > T.MAX_EVENTS) S.evs.splice(0, S.evs.length - T.MAX_EVENTS);
    if (ev.k === 'eui') armIdle(ev.t);
    schedule(400);
    return ev;
  }

  var onRoute = guard(function (via) {
    var next = routeNow();
    if (next.h === cur.h) return;
    var back = via === 'pop' && history2.length >= 2 && history2[history2.length - 2] === next.h;
    cur = next;
    history2.push(next.h);
    if (history2.length > 20) history2.shift();
    S.lastRouteT = now();
    attend(4000);
    push({ k: 'route', r: next.r, h: next.h, via: via, back: back, p: next.r });
  });

  function patchHistory(name) {
    try {
      var orig = history[name];
      if (typeof orig !== 'function') return;
      history[name] = function () {
        var result = orig.apply(this, arguments);
        onRoute(name === 'pushState' ? 'push' : 'replace');
        return result;
      };
    } catch (e) { /* a frozen history: route changes are still seen on popstate */ }
  }
  patchHistory('pushState');
  patchHistory('replaceState');
  window.addEventListener('popstate', function () { onRoute('pop'); });
  window.addEventListener('hashchange', function () { onRoute('hash'); });

  /* ---------------- controls ---------------- */

  var INTERACTIVE = 'button, a[href], summary, select, label, input[type="button"], input[type="submit"], input[type="reset"], input[type="image"], input[type="checkbox"], input[type="radio"], [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"], [role="switch"], [role="checkbox"], [role="radio"], [role="treeitem"], [onclick]';
  var CHROME = '[class*="toast" i], [class*="snackbar" i], [class*="cookie" i], [id*="cookie" i], [class*="consent" i], [id*="consent" i], [class*="gdpr" i], #onetrust-consent-sdk, #CybotCookiebotDialog, [id^="intercom"], [class*="intercom"], .crisp-client, #hubspot-messages-iframe-container, [id*="drift"], #launcher, [class*="chat-widget" i], [data-sonner-toaster], [data-breken-ignore]';
  var REPEATERS = '[aria-roledescription*="carousel" i], [aria-roledescription="slide" i], [class*="carousel" i], [class*="slider" i], [class*="swiper" i], [class*="slick" i], [class*="splide" i], [class*="glide" i], [class*="embla" i], [class*="flickity" i], [class*="pagination" i], [class*="pager" i], nav[aria-label*="pagination" i], [class*="stepper" i], [class*="counter" i], [class*="quantity" i], [role="spinbutton"]';
  var REPEAT_WORDS = /^(\+|-|−|–|‹|›|«|»|<|>|←|→|↑|↓|next|prev|previous|more|less|load more|show more|see more|view more|show less|increase|decrease|increment|decrement|zoom in|zoom out|undo|redo|forward|back|refresh|reload|retry|scroll (left|right|up|down))$/i;
  var PRIMARY_WORDS = /^(save|save changes|submit|continue|next step|pay|pay now|checkout|check out|place order|buy|buy now|purchase|sign in|log in|login|sign up|register|create|create account|send|confirm|apply|add to cart|add to bag|update|publish|upload|done|finish|subscribe|book|reserve|start|get started|search|go)\b/i;
  var UI_WORDS = /\b(changes|settings|automation|automations|branch|branches|account|profile|password|email|name|title|description|item|items|file|files|project|projects|workspace|report|reports|dashboard|save|add|new|edit|delete|remove|create|cancel|close|open|submit|continue|next|back|previous|settings|preferences|profile|account|sign|log|search|filter|sort|view|show|hide|more|less|upload|download|export|import|share|copy|send|invite|apply|update|refresh|retry|help|menu|home|dashboard|overview|billing|team|members|details|options|confirm|done|finish|start|stop|run|pay|checkout|cart|order|buy|select|clear|reset|expand|collapse|toggle|archive|restore|publish|draft|preview|print|reply|comment|like|follow|subscribe|connect|disconnect|install|enable|disable|approve|reject|merge|assign|move|rename|duplicate|pin|unpin|star|favorite|notifications|messages|inbox|reports|analytics|integrations|security|privacy|terms|docs|support|contact|pricing|features|about|blog|learn|get|try|go|yes|no|ok|all|none)\b/i;
  var MASK = '[data-breken-mask], [data-private], [data-sensitive], .fs-mask, .fs-exclude, .ph-no-capture, .rr-mask, .rr-block, [data-hj-suppress], .sentry-mask, .sentry-block';
  var REPEATED = 'li, tr, [role="row"], [role="listitem"], [role="option"], [role="gridcell"], [role="article"], article';

  function closest(el, sel) { try { return el && el.closest ? el.closest(sel) : null; } catch (e) { return null; } }
  function matches(el, sel) { try { return Boolean(el && el.matches && el.matches(sel)); } catch (e) { return false; } }
  function attr(el, name) { return el && el.getAttribute ? el.getAttribute(name) : null; }
  function textIn(el, max) {
    var t = (el && el.textContent) || '';
    if (t.length > max * 4) t = t.slice(0, max * 4);
    return t.replace(/\s+/g, ' ').trim();
  }
  /**
   * A label's OWN words: its text nodes, never those inside a control it wraps. `<label>Plan
   * <select>…</select></label>` has the options' text in its textContent — and an option can be
   * somebody's choice — so the walk skips selects, options, fields and anything editable.
   */
  var NESTED_CONTROL = { SELECT: 1, OPTION: 1, TEXTAREA: 1, INPUT: 1, BUTTON: 1, DATALIST: 1, OUTPUT: 1, SCRIPT: 1, STYLE: 1 };
  function ownText(el, max) {
    var out = '';
    var walk = function (n, depth) {
      for (var c = n.firstChild; c && out.length < max * 4; c = c.nextSibling) {
        if (c.nodeType === 3) out += c.nodeValue + ' ';
        else if (c.nodeType === 1 && depth < 6 && !NESTED_CONTROL[c.tagName] && !c.isContentEditable && !closest(c, MASK)) walk(c, depth + 1);
      }
    };
    try { walk(el, 0); } catch (e) { return ''; }
    return out.replace(/\s+/g, ' ').trim();
  }

  function roleOf(el) {
    var r = attr(el, 'role');
    if (r) return r.split(' ')[0];
    var tag = el.tagName.toLowerCase();
    if (tag === 'a') return el.hasAttribute('href') ? 'link' : 'generic';
    if (tag === 'button' || tag === 'summary') return 'button';
    if (tag === 'select') return 'combobox';
    if (tag === 'textarea') return 'textbox';
    if (tag === 'form') return 'form';
    if (tag === 'input') {
      var type = (el.type || 'text').toLowerCase();
      return { checkbox: 'checkbox', radio: 'radio', submit: 'button', button: 'button', reset: 'button', image: 'button', range: 'slider', search: 'searchbox', number: 'spinbutton' }[type] || 'textbox';
    }
    return tag;
  }

  function isField(el) {
    if (!el || !el.tagName) return false;
    var tag = el.tagName.toLowerCase();
    if (tag === 'textarea' || tag === 'select') return true;
    if (tag === 'input') return !/^(button|submit|reset|image|checkbox|radio|file|range|color)$/i.test(el.type || 'text');
    return Boolean(el.isContentEditable);
  }

  /** The words that name a control, found locally: aria-labelledby, aria-label, its label, alt, title, its own text. */
  /**
   * A choice (a radio, a checkbox, an option, a switch) is named by its GROUP, never by the option:
   * which one a person picked is their answer. "Condition" leaves; "HIV positive" never does.
   */
  function choiceOf(el) {
    var input = el.tagName === 'LABEL' ? (el.control || (el.querySelector && el.querySelector('input'))) : el;
    var role = (attr(el, 'role') || '').toLowerCase();
    var isChoice = input && input.tagName === 'INPUT' && /^(radio|checkbox)$/i.test(input.type || '');
    if (!isChoice && !/^(radio|checkbox|option|switch|menuitemradio|menuitemcheckbox|treeitem)$/.test(role)) return null;
    var group = closest(el, 'fieldset, [role="radiogroup"], [role="group"], [role="listbox"], [role="menu"], [role="tree"]');
    var words = '';
    if (group) {
      var legend = group.tagName === 'FIELDSET' ? group.querySelector('legend') : null;
      words = legend ? ownText(legend, 60) : (attr(group, 'aria-label') || '');
      if (!words && attr(group, 'aria-labelledby')) { var n = document.getElementById(attr(group, 'aria-labelledby').split(/\s+/)[0]); words = n ? ownText(n, 60) : ''; }
    }
    var name = isChoice ? attr(input, 'name') : null;
    var selector = name && name.length <= 60 && !/\d{4,}/.test(name) ? 'input[name=' + quoteAttr(name) + ']'
      : group ? pathOf(group) : pathOf(el);
    return { words: words, selector: selector, input: isChoice ? input : null };
  }

  function nameOf(el) {
    if (el.isContentEditable) return '';
    var by = attr(el, 'aria-labelledby');
    if (by) {
      var parts = [];
      by.split(/\s+/).slice(0, 3).forEach(function (id) { var n = document.getElementById(id); if (n) parts.push(ownText(n, 80)); });
      if (parts.join(' ').trim()) return parts.join(' ').trim();
    }
    var aria = attr(el, 'aria-label');
    if (aria && aria.trim()) return aria.trim();
    if (el.labels && el.labels.length) { var l = ownText(el.labels[0], 80); if (l) return l; }
    var tag = el.tagName.toLowerCase();
    if (tag === 'input' && /^(button|submit|reset)$/i.test(el.type || '')) return String(el.value || el.type || '').trim();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      var ph = attr(el, 'placeholder');
      return ph ? ph.trim() : '';
    }
    var own = ownText(el, 80);
    if (own) return own;
    var img = el.querySelector && el.querySelector('img[alt], svg[aria-label], [aria-label]');
    if (img) return (attr(img, 'alt') || attr(img, 'aria-label') || '').trim();
    var title = attr(el, 'title');
    return title ? title.trim() : '';
  }

  /**
   * A control's label, kept only if it is the product's words and not someone's data. A label in
   * a list that differs from its neighbours' ("Acme Corp", "Jane Doe") is data; "Delete" in every
   * row is the product. Anything with an address, a long number or a token in it is dropped.
   */
  var UPPER = /^[A-Z\u00C0-\u00D6\u00D8-\u00DE]/;
  var STOP = /^(to|the|a|an|of|for|in|on|at|and|or|my|your|this|all|new|more|with|from|as|by|is|it|me|us|now|here|up|out|off|back|next|&|-|–|—|\+|›|»|…)$/i;
  /** Every word is the product's vocabulary: a verb or noun of UI, or a small word between them. */
  function allUiWords(w) {
    var parts = w.split(' ');
    for (var i = 0; i < parts.length; i++) {
      var word = parts[i].replace(/[.,:;!?()"'…]/g, '');
      if (word && !STOP.test(word) && !UI_WORDS.test(word)) return false;
    }
    return true;
  }
  function samePeerLabel(el, row, w) {
    var sib = row.previousElementSibling || row.nextElementSibling;
    if (!sib || sib.tagName !== row.tagName) return false;
    var tag = el.tagName.toLowerCase();
    var peers;
    try { peers = sib.querySelectorAll(tag + (attr(el, 'role') ? '[role="' + attr(el, 'role') + '"]' : '')); } catch (e) { return false; }
    for (var i = 0; i < peers.length && i < 20; i++) if (nameOf(peers[i]).replace(/\s+/g, ' ').trim() === w) return true;
    return false;
  }
  /**
   * A control's label, kept only when it reads as the product's words and not someone's data; when
   * unsure, dropped (the selector still names the control). Dropped: anything with an address, a
   * number, a token; a capitalised word past the first that is not a product word ("Send invoice
   * to Jane Smith", "Acme Corp"); anything on an account menu that is not a product word; a label
   * in a list row unless every row says it or it is all product words ("Delete" in every row, not
   * "Acme Corp" in one).
   */
  function safeLabel(el, words) {
    var w = String(words || '').replace(/\s+/g, ' ').trim();
    if (!w || closest(el, MASK)) return '';
    if (w.length > 60 || w.split(' ').length > 6) return '';
    if (/@|\d{3,}|https?:|www\.|[A-Za-z0-9_-]{24,}/.test(w)) return '';
    var parts = w.split(' ');
    for (var i = 1; i < parts.length; i++) {
      var word = parts[i].replace(/[.,:;!?()"'…]/g, '');
      if (UPPER.test(word) && !UI_WORDS.test(word) && !STOP.test(word) && !/^[A-Z]{2,5}$/.test(word)) return '';
    }
    if (parts.length === 1 && UPPER.test(w) && !UI_WORDS.test(w) && closest(el, 'header, nav, aside, [role="banner"], [role="navigation"], [aria-haspopup]')) return '';
    if (closest(el, 'header, nav, [role="banner"], [role="navigation"]') && attr(el, 'aria-haspopup') && !allUiWords(w)) return '';
    var row = closest(el, REPEATED);
    if (row && !allUiWords(w) && !samePeerLabel(el, row, w)) return '';
    return w;
  }

  function cssEscape(v) { try { return window.CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/[^A-Za-z0-9_-]/g, '\\$&'); } catch (e) { return String(v); } }
  function stableId(id) {
    return id && id.length <= 60 && !/^[:_]|^radix-|^headlessui-|^mui-|^react-|^rc-|^ember|^ext-|^__|\d{2,}|[0-9a-f]{6,}|:r[0-9a-z]+:/i.test(id);
  }
  function quoteAttr(v) { return '"' + String(v).replace(/["\\]/g, '\\$&') + '"'; }

  /**
   * A selector a person (and the walker's replay) could paste back, in the walker's own order:
   * test id, a stable id, a name, the control's own words, its label, then its place in the page.
   * Words that are data never go into it.
   */
  function selectorOf(el, label, ownText) {
    var tag = el.tagName.toLowerCase();
    var test = attr(el, 'data-testid') || attr(el, 'data-test-id') || attr(el, 'data-test') || attr(el, 'data-cy') || attr(el, 'data-qa');
    if (test && test.length <= 80 && !/\d{4,}/.test(test)) {
      var an = attr(el, 'data-testid') !== null ? 'data-testid' : attr(el, 'data-test-id') !== null ? 'data-test-id' : attr(el, 'data-test') !== null ? 'data-test' : attr(el, 'data-cy') !== null ? 'data-cy' : 'data-qa';
      return '[' + an + '=' + quoteAttr(test) + ']';
    }
    if (el.id && stableId(el.id)) return '#' + cssEscape(el.id);
    var name = attr(el, 'name');
    if (name && name.length <= 60 && !/\d{4,}/.test(name)) return tag + '[name=' + quoteAttr(name) + ']';
    if (label && ownText) return tag + ':has-text(' + JSON.stringify(label) + ')';
    var aria = attr(el, 'aria-label');
    if (label && aria && aria.trim() === label) return tag + '[aria-label=' + quoteAttr(label) + ']';
    return pathOf(el);
  }

  function pathOf(el) {
    var parts = [];
    var n = el;
    for (var depth = 0; n && n.nodeType === 1 && depth < 5; depth++) {
      var tag = n.tagName.toLowerCase();
      if (tag === 'html' || tag === 'body') break;
      var test = attr(n, 'data-testid');
      if (test && depth > 0 && !/\d{4,}/.test(test)) { parts.unshift('[data-testid=' + quoteAttr(test) + ']'); break; }
      if (n.id && stableId(n.id) && depth > 0) { parts.unshift('#' + cssEscape(n.id)); break; }
      var part = tag;
      var parent = n.parentElement;
      if (parent) {
        var same = 0, at = 0;
        for (var c = parent.firstElementChild; c; c = c.nextElementSibling) if (c.tagName === n.tagName) { same++; if (c === n) at = same; }
        if (same > 1) part += ':nth-of-type(' + at + ')';
      }
      parts.unshift(part);
      n = parent;
    }
    return parts.join(' > ').slice(0, 300);
  }

  function landmarkOf(el) {
    var lm = closest(el, 'main, nav, header, footer, aside, form, dialog, [role="dialog"], [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
    return lm ? roleOf(lm) === lm.tagName.toLowerCase() ? lm.tagName.toLowerCase() : roleOf(lm) : null;
  }

  var elementIds = typeof WeakMap === 'function' ? new WeakMap() : null, elementSeq = 0;
  function pointer(el) {
    try { return getComputedStyle(el).cursor === 'pointer'; } catch (e) { return false; }
  }

  /** Which control a press was on, and what kind of control it is, from the element the pointer hit. */
  function controlOf(target) {
    var el = target && target.nodeType === 1 ? target : target && target.parentElement;
    if (!el) return null;
    var hit = el;
    var control = closest(el, INTERACTIVE);
    var look = Boolean(control);
    if (!control) {
      // Something the page styles as pressable: the outermost pointer in a short chain.
      var n = el, found = null;
      for (var d = 0; n && n !== document.body && d < 6; d++, n = n.parentElement) {
        if (pointer(n)) { found = n; if (!n.parentElement || !pointer(n.parentElement)) break; }
        else if (found) break;
      }
      if (found && !found.hasAttribute('title') && !found.hasAttribute('data-tooltip') && !found.hasAttribute('aria-describedby')) { control = found; look = true; }
    }
    if (!control) control = hit;
    var tag = control.tagName.toLowerCase();
    var role = roleOf(control);
    var editable = Boolean(closest(hit, '[contenteditable="true"], [contenteditable=""]')) || control.isContentEditable || isField(control);
    var choice = choiceOf(control);
    var words = '', label = '', sel;
    if (choice) {
      // Its group's words and the group's selector: never the option chosen.
      label = safeLabel(control, choice.words);
      sel = choice.selector;
    } else if (!look || editable) {
      // Not a control (a paragraph someone clicked) or a field: no words at all, only a place.
      sel = pathOf(control);
    } else {
      words = nameOf(control);
      label = safeLabel(control, words);
      sel = selectorOf(control, label, Boolean(label) && ownText(control, 80) === label);
    }
    var ctl = { sel: sel, role: role, name: label, tag: tag, lm: landmarkOf(control) };
    if (elementIds) { var eid = elementIds.get(control); if (!eid) { eid = ++elementSeq; elementIds.set(control, eid); } ctl.eid = eid; }
    // Inside a shadow root (or a custom element that keeps one closed), the page's own changes are
    // out of this observer's sight: nothing there can be judged "nothing happened".
    try { if ((control.getRootNode && control.getRootNode() !== document) || /-/.test(hit.tagName)) ctl.nodom = 1; } catch (e) { ctl.nodom = 1; }
    if (look) ctl.look = 1;
    // What cannot be judged by what it changes on this page.
    var type = (control.type || '').toLowerCase();
    var href = attr(control, 'href');
    if (closest(hit, 'video, audio, canvas, iframe, embed, object, [contenteditable="true"], [contenteditable=""]')
      || isField(control) || (tag === 'input' && /^(file|range|color)$/.test(type)) || closest(control, 'label') && closest(control, 'label').querySelector('input[type="file"]')) ctl.skip = 1;
    if (tag === 'a' && href && (attr(control, 'target') === '_blank' || control.hasAttribute('download') || /^(mailto|tel|sms|javascript):/i.test(href) && !/^javascript:(void|;)/i.test(href))) ctl.ext = 1;
    if (tag === 'a' && href && !ctl.ext) {
      try { var u = new URL(href, location.href); if (u.origin !== location.origin) ctl.ext = 1; } catch (e) { /* not a URL */ }
    }
    if (closest(control, CHROME) || closest(control, '[role="status"], [role="alert"], [role="log"]')) ctl.chrome = 1;
    if ((look && !editable && REPEAT_WORDS.test(words || nameOf(control))) || closest(control, REPEATERS)) ctl.rep = 1;
    // Choosing what is already chosen: the selected tab or radio (or the label of one), the current
    // page's link, an open menu's trigger. Pressing it again is correctly answered by nothing.
    var labelled = choice && choice.input ? choice.input : tag === 'label' ? (control.control || (control.querySelector && control.querySelector('input'))) : null;
    if ((labelled && labelled.type === 'radio' && labelled.checked)
      || (/^(tab|radio|option|menuitemradio|treeitem)$/.test(role) && (attr(control, 'aria-selected') === 'true' || attr(control, 'aria-checked') === 'true' || control.checked))
      || (attr(control, 'aria-current') && attr(control, 'aria-current') !== 'false')
      || (attr(control, 'aria-haspopup') && attr(control, 'aria-expanded') === 'true')
      || (tag === 'a' && href && !ctl.ext && (function () { try { var u2 = new URL(href, location.href); return u2.pathname === location.pathname && u2.search === location.search && !u2.hash; } catch (e) { return false; } })())) ctl.cur = 1;
    if (attr(control, 'aria-expanded') !== null || attr(control, 'aria-pressed') !== null || /^(switch|checkbox|tab|radio)$/.test(role)) ctl.toggle = 1;
    if (control.disabled || closest(control, '[aria-disabled="true"], fieldset[disabled], [inert]')) ctl.dis = 1;
    if ((tag === 'button' && (type === 'submit' || (!type && closest(control, 'form')))) || (tag === 'input' && type === 'submit')
      || (words && PRIMARY_WORDS.test(words)) || /(^|[-_\s])(primary|cta)([-_\s]|$)/i.test(String(control.className && control.className.baseVal !== undefined ? control.className.baseVal : control.className || ''))) {
      if (!ctl.chrome && !ctl.rep) ctl.prim = 1;
    }
    return { ctl: ctl, el: control };
  }

  function formRef(form) {
    var label = safeLabel(form, attr(form, 'aria-label') || (function () {
      var by = attr(form, 'aria-labelledby'); var n = by && document.getElementById(by.split(/\s+/)[0]); return n ? ownText(n, 60) : '';
    })() || attr(form, 'name') || '');
    var sel = selectorOf(form, label, false);
    return { sel: sel, role: 'form', name: label, tag: 'form', lm: landmarkOf(form.parentElement || form) };
  }

  /* ---------------- presses and what answered them ---------------- */

  var STATE_ATTRS = { 'aria-expanded': 1, 'aria-pressed': 1, 'aria-checked': 1, 'aria-selected': 1, 'aria-busy': 1, 'disabled': 1, 'open': 1, 'hidden': 1, 'data-state': 1, 'aria-invalid': 1 };

  function openWindow(ev, el) {
    var w = { ev: ev, el: el, start: ev.t, x: ev.x || {}, focus: document.activeElement, scrollY: window.scrollY, scrollX: window.scrollX };
    S.windows.push(w);
    setTimeout(guard(function () { settle(w); }), T.EFFECT_MS);
    return w;
  }

  function settle(w) {
    var at = S.windows.indexOf(w);
    if (at < 0) return;
    S.windows.splice(at, 1);
    if (Math.abs(window.scrollY - w.scrollY) > 40 || Math.abs(window.scrollX - w.scrollX) > 40) w.x.scroll = 1;
    w.ev.x = w.x;
    w.ev.end = now();
    w.ev.settled = true;
    if (S.nodom) w.ev.c.nodom = 1;
    schedule(T.RAGE_GAP - T.EFFECT_MS + 150);
  }

  function markWindows(flag, node) {
    for (var i = 0; i < S.windows.length; i++) {
      var w = S.windows[i];
      if (node && w.el && (w.el === node || (w.el.contains && w.el.contains(node))) && flag !== 'input') continue;
      w.x[flag] = 1;
    }
  }

  function isOurs(node) {
    var n = node && node.nodeType === 1 ? node : node && node.parentNode;
    return Boolean(n && (closest(n, '[data-breken-ignore]') || (promptHost && (n === promptHost || (promptHost.contains && promptHost.contains(n))))));
  }

  function pathHasOurs(e) {
    try {
      var path = e.composedPath ? e.composedPath() : [];
      for (var i = 0; i < path.length; i++) if (path[i] === promptHost || (path[i] && path[i].nodeType === 1 && path[i].hasAttribute && path[i].hasAttribute('data-breken-ignore'))) return true;
    } catch (e2) { /* old browser */ }
    return isOurs(e.target);
  }

  document.addEventListener('click', guard(function (e) {
    if (!e.isTrusted || pathHasOurs(e)) return;
    var t = now();
    // The press before this one is judged on what happened before this one.
    for (var i = S.windows.length - 1; i >= 0; i--) settle(S.windows[i]);
    var target = (e.composedPath && e.composedPath()[0]) || e.target;
    var found = controlOf(target);
    if (!found) return;
    attend(6000);
    markBusyBaseline();
    var ev = push({ k: 'click', c: found.ctl, t: t, detail: e.detail || 0 });
    if (t - S.loadT < T.EARLY_MS) ev.early = 1;
    if (found.ctl.ext) { ev.x = { open: 1 }; }
    openWindow(ev, found.el);
    lastAction = t;
    // How long until the page could paint again: a handler that blocks is a freeze.
    // One clock for both ends (the monotonic one): a laptop that slept is not a frozen page.
    var perfNow = function () { return window.performance && performance.now ? performance.now() : 0; };
    var stamp = e.timeStamp > 1e12 ? null : e.timeStamp;
    if (stamp !== null && window.requestAnimationFrame && document.visibilityState === 'visible') {
      requestAnimationFrame(function () { var lag = perfNow() - stamp; if (lag > 500 && lag < 120000) { ev.lag = lag; if (dialogAt && dialogAt >= t - 50) ev.dlg = 1; schedule(50); } });
    }
    pollBusySoon();
  }), { capture: true, passive: true });

  var lastAction = 0;

  document.addEventListener('submit', guard(function (e) {
    if (!e.isTrusted && !(e.target && e.target.tagName)) return;
    if (pathHasOurs(e)) return;
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    var edited = editedForms && editedForms.get ? Boolean(editedForms.get(form)) : true;
    if (editedForms && editedForms.set) editedForms.set(form, false);
    attend(6000);
    push({ k: 'submit', f: formRef(form), ed: edited ? 1 : 0 });
    lastAction = now();
    pollBusySoon();
  }), { capture: true, passive: true });

  var invalidAt = typeof WeakMap === 'function' ? new WeakMap() : null;
  document.addEventListener('invalid', guard(function (e) {
    var form = e.target && e.target.form;
    if (!form || pathHasOurs(e)) return;
    var t = now();
    // The browser refusing a submit someone just attempted — not a page calling checkValidity() as they type.
    if (t - Math.max(lastAction, S.lastEnterT || 0) > 300) return;
    if (invalidAt && invalidAt.get(form) && t - invalidAt.get(form) < 500) return;
    if (invalidAt) invalidAt.set(form, t);
    var edited = editedForms && editedForms.get ? Boolean(editedForms.get(form)) : true;
    if (editedForms && editedForms.set) editedForms.set(form, false);
    var field = e.target;
    push({ k: 'submit', f: formRef(form), inv: 1, ih: fnv(String(attr(field, 'name') || field.id || field.type || '')), ed: edited ? 1 : 0 });
  }), true);

  var editedForms = typeof WeakMap === 'function' ? new WeakMap() : null;
  var filled = typeof WeakMap === 'function' ? new WeakMap() : null;
  function onInput(e) {
    if (pathHasOurs(e)) return;
    var el = e.target;
    S.lastInputT = now();
    markWindows('input', null);
    if (el && el.form && editedForms) editedForms.set(el.form, true);
    if (el && isSearchField(el)) searchTyped(el);
  }
  document.addEventListener('input', guard(onInput), { capture: true, passive: true });
  document.addEventListener('change', guard(function (e) {
    if (pathHasOurs(e)) return;
    markWindows('input', null);
    var el = e.target;
    if (!el || !el.tagName || isSearchField(el)) return;
    if (filled && filled.get(el) && now() - filled.get(el) < 5000) return;
    if (filled) filled.set(el, now());
    var choice = choiceOf(el);
    var label = choice ? safeLabel(el, choice.words) : safeLabel(el, nameOf(el));
    push({ k: 'fill', c: { sel: choice ? choice.selector : selectorOf(el, label, false), role: roleOf(el), name: label, tag: el.tagName.toLowerCase() } });
  }), { capture: true, passive: true });
  document.addEventListener('focusin', guard(function (e) {
    if (pathHasOurs(e)) return;
    for (var i = 0; i < S.windows.length; i++) {
      var w = S.windows[i];
      if (e.target !== w.el && !(w.el && w.el.contains && w.el.contains(e.target)) && e.target !== w.focus) w.x.focus = 1;
    }
  }), { capture: true, passive: true });
  // The page's own scroll is judged by how far it moved from the press (settle); a scroll event
  // that lands a frame after the press is usually the scroll that brought the control into view.
  // A container scrolling on its own after the press (a "jump to latest") is an answer.
  document.addEventListener('scroll', guard(function (e) {
    if (!S.windows.length || e.target === document || e.target === document.documentElement || e.target === document.body) return;
    var t = now();
    for (var i = 0; i < S.windows.length; i++) if (t - S.windows[i].start >= 80) S.windows[i].x.scroll = 1;
  }), { capture: true, passive: true });
  document.addEventListener('copy', guard(function () { markWindows('clip', null); }), { capture: true, passive: true });
  document.addEventListener('keydown', guard(function (e) {
    if (pathHasOurs(e)) return;
    S.lastKeyT = now();
    if (e.key === 'Enter') { attend(3000); S.lastEnterT = S.lastKeyT; }
    if (e.key === 'Enter' && e.target && isSearchField(e.target)) searchSettled(e.target);
  }), { capture: true, passive: true });

  /* Things that answer a press without touching the DOM: a new window, the clipboard, a native dialog. */
  var dialogAt = 0;
  function wrap(obj, name, before) {
    try {
      var orig = obj && obj[name];
      if (typeof orig !== 'function') return;
      obj[name] = function () {
        try { before(); } catch (e) { /* never in the way */ }
        return orig.apply(this, arguments);
      };
    } catch (e) { /* frozen */ }
  }
  wrap(window, 'open', function () { markWindows('open', null); });
  wrap(window, 'alert', function () { dialogAt = now(); markWindows('dialog', null); });
  wrap(window, 'confirm', function () { dialogAt = now(); markWindows('dialog', null); });
  wrap(window, 'prompt', function () { dialogAt = now(); markWindows('dialog', null); });
  wrap(window, 'print', function () { dialogAt = now(); markWindows('dialog', null); });
  try { if (navigator.clipboard) { wrap(navigator.clipboard, 'writeText', function () { markWindows('clip', null); }); wrap(navigator.clipboard, 'write', function () { markWindows('clip', null); }); } } catch (e) { /* no clipboard */ }

  /* ---------------- requests ---------------- */

  var ofetch = window.fetch;
  var endpointPath = (function () { try { return new URL(cfg.endpoint, location.href).href.replace(/[?#].*$/, ''); } catch (e) { return cfg.endpoint; } })();
  var NOISE = /\/(analytics|collect|track|tracking|events?|beacon|telemetry|rum|metrics|log|logs|ingest|monitoring|_vercel\/insights|_vercel\/speed-insights|cdn-cgi\/rum|__nextjs_original-stack-frame|_next\/webpack-hmr|sockjs-node|hot-update)(\/|$|\.)/i;
  function siteOf(host) { var p = String(host || '').split('.'); return p.slice(-2).join('.'); }
  function describe(url, method) {
    var u;
    try { u = new URL(url, location.href); } catch (e) { return null; }
    if (u.href.replace(/[?#].*$/, '') === endpointPath) return null;
    var m = String(method || 'GET').toUpperCase();
    if (!/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(m)) m = 'GET';
    if (m === 'OPTIONS') return null;
    var first = u.origin === location.origin || (u.protocol.indexOf('http') === 0 && siteOf(u.hostname) === siteOf(location.hostname));
    if (!first) return { m: m, r: '/', tp: 1 };
    if (NOISE.test(u.pathname)) return { m: m, r: foldPath(u.pathname), tp: 1 };
    return { m: m, r: foldPath(u.pathname) };
  }
  var RID = /^[A-Za-z0-9._:-]{1,128}$/;
  function ridFrom(get) {
    var names = ['request-id', 'x-request-id', 'breken-request-id', 'x-correlation-id', 'x-amzn-requestid', 'cf-ray'];
    for (var i = 0; i < names.length; i++) {
      var v = null;
      try { v = get(names[i]); } catch (e) { v = null; }
      if (v && RID.test(v)) return v;
    }
    return null;
  }
  function startNet(d, body) {
    var t = now();
    var ev = { k: 'net', m: d.m, r: d.r, t: t, e: null, s: null };
    if (d.tp) ev.tp = 1;
    if (t - lastAction > 1500) ev.bg = 1;
    try { if (body && ((typeof Blob !== 'undefined' && body instanceof Blob && body.size > 1e6) || (typeof FormData !== 'undefined' && body instanceof FormData))) ev.up = 1; } catch (e) { /* ok */ }
    push(ev);
    return ev;
  }
  function endNet(ev, status, rid, aborted) {
    ev.e = now();
    ev.s = status;
    if (rid) ev.rid = rid;
    if (aborted) ev.ab = 1;
    if (!aborted && !ev.bg && !ev.tp && failStatus(status)) { armIdle(ev.e); attend(3000); }
    schedule(100);
  }

  if (typeof ofetch === 'function') try {
    window.fetch = function (input, init) {
      var p = ofetch.apply(this, arguments);
      var ev = null;
      try {
        var url = typeof input === 'string' ? input : input && (input.href || input.url);
        var method = (init && init.method) || (input && typeof input === 'object' && input.method) || 'GET';
        var d = remoteAllowed && !S.stopped && describe(url, method);
        if (d) ev = startNet(d, init && init.body);
      } catch (e) { ev = null; }
      if (!ev) return p;
      return p.then(function (res) {
        try { endNet(ev, res.status, ridFrom(function (n) { return res.headers.get(n); }), false); } catch (e) { /* never in the way */ }
        return res;
      }, function (err) {
        try { endNet(ev, 0, null, err && err.name === 'AbortError'); } catch (e) { /* never in the way */ }
        throw err;
      });
    };
  } catch (e) { /* a frozen fetch: requests go unseen, nothing else changes */ }

  var XHR = window.XMLHttpRequest;
  if (XHR && XHR.prototype && typeof WeakMap === 'function') try {
    // One meta per XHR, reused across its sends: the listeners are added once and read whichever
    // request is current, so a polling XHR does not grow a listener per send.
    var xmeta = new WeakMap();
    var xopen = XHR.prototype.open, xsend = XHR.prototype.send;
    var xfinish = function (xhr, m) {
      if (!m.ev || m.ev.e != null) return;
      if (xhr.readyState !== 4) { endNet(m.ev, 0, null, true); return; } // re-opened mid-flight: abandoned
      var headers = {};
      String(xhr.getAllResponseHeaders() || '').split(/\r?\n/).forEach(function (line) {
        var at = line.indexOf(':'); if (at > 0) headers[line.slice(0, at).trim().toLowerCase()] = line.slice(at + 1).trim();
      });
      endNet(m.ev, xhr.status || 0, ridFrom(function (n) { return headers[n]; }), m.aborted);
    };
    XHR.prototype.open = function (method, url) {
      try {
        if (remoteAllowed && !S.stopped) {
          var m = xmeta.get(this) || {};
          // An app that re-opens its XHR from onload (before loadend) has finished the last request.
          xfinish(this, m);
          m.d = describe(url, method); m.ev = null; xmeta.set(this, m);
        }
      } catch (e) { /* ok */ }
      return xopen.apply(this, arguments);
    };
    XHR.prototype.send = function (body) {
      try {
        var m = xmeta.get(this);
        if (m && m.d) {
          m.ev = startNet(m.d, body);
          m.aborted = false;
          if (!m.hooked) {
            m.hooked = true;
            var xhr = this;
            xhr.addEventListener('abort', function () { var mm = xmeta.get(xhr); if (mm) mm.aborted = true; });
            xhr.addEventListener('loadend', function () {
              try {
                var mm = xmeta.get(xhr);
                // Already re-opened for the next request: this loadend's request was finished at open().
                if (!mm || xhr.readyState !== 4) return;
                xfinish(xhr, mm);
              } catch (e) { /* never in the way */ }
            });
          }
        }
      } catch (e) { /* never in the way */ }
      return xsend.apply(this, arguments);
    };
  } catch (e) { /* a frozen XMLHttpRequest: its requests go unseen */ }

  /* ---------------- errors ---------------- */

  function frameOf(stack) {
    var m = /(https?:\/\/[^\s)]+?):(\d+):(\d+)/.exec(String(stack || ''));
    if (!m) return null;
    try {
      var u = new URL(m[1]);
      return { file: u.pathname.slice(0, 200), line: Number(m[2]), col: Number(m[3]), tp: u.origin !== location.origin && siteOf(u.hostname) !== siteOf(location.hostname) };
    } catch (e) { return null; }
  }
  var IGNORED_ERRORS = /^(Script error\.?|ResizeObserver loop.*|Non-Error promise rejection captured.*)$/i;
  function recordError(name, message, stack, file) {
    var msg = String(message || '');
    if (IGNORED_ERRORS.test(msg)) return;
    if (/^(chrome|moz|safari|safari-web|ms-browser)-extension:/.test(String(file || '')) || /(chrome|moz|safari|safari-web)-extension:\/\//.test(String(stack || ''))) return;
    if (name === 'AbortError') return;
    var f = frameOf(stack) || (file ? frameOf(file + ':0:0') : null);
    // The class and a hash of the message: a message can quote a value ("No account for …").
    var ev = { k: 'err', n: String(name || 'Error').replace(/[^A-Za-z0-9_$.]/g, '').slice(0, 60) || 'Error', h: fnv(normMessage(msg)) };
    if (f) { ev.f = f.file + ':' + f.line + ':' + f.col; if (f.tp) ev.tp = 1; }
    if (now() - lastAction <= T.ERROR_JS_MS) ev.act = 1;
    push(ev);
  }
  window.addEventListener('error', guard(function (e) {
    if (!e || e.target !== window && e.target && e.target.nodeType === 1) return; // a broken image is not a script error
    recordError(e.error && e.error.name, e.message || (e.error && e.error.message), e.error && e.error.stack, e.filename);
  }));
  window.addEventListener('unhandledrejection', guard(function (e) {
    var r = e && e.reason;
    if (r && typeof r === 'object' && r.name) recordError(r.name, r.message, r.stack, null);
    else recordError('UnhandledRejection', typeof r === 'string' ? r : '', null, null);
  }));

  /* ---------------- what the page shows: errors, spinners, empty results ---------------- */

  var FAILURE_WORDS = /\b(error|errors occurred|failed|failure|went wrong|try again|unable to|could ?n[o']t|can ?n[o']t|cannot|not allowed|denied|expired|unavailable|oops|timed? ?out)\b/i;
  var ERROR_WORDS = /\b(error|errors occurred|failed|failure|went wrong|try again|unable to|could ?n[o']t|can ?n[o']t|cannot|invalid|not allowed|denied|expired|unavailable|oops|timed? ?out|required|must be|please (enter|provide|select|choose|fill|correct)|too (short|long)|does ?n[o']t match|is not valid|not a valid)\b/i;
  var NOT_ERRORS = /\b(no errors?|0 errors?|without errors?|error-free)\b/i;
  // What announces a failure: an alert, a toast, an error-styled notice. Not a chat log, not a status
  // badge, not a message list — content that merely contains the word "failed" is not the page failing.
  var NOTICE = '[role="alert"], [aria-live="assertive"], [class*="toast" i], [class*="snackbar" i], [class*="error" i], [class*="danger" i], [class*="invalid" i], [class*="flash" i], [data-sonner-toast]';
  var CONTENT = 'li, tr, article, [role="row"], [role="listitem"], [role="log"], [role="feed"], [role="article"], [aria-live="polite"], [class*="message" i], [class*="comment" i], [class*="chat" i], [contenteditable="true"]';

  function visible(el) {
    try {
      if (!el.getBoundingClientRect) return false;
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return false;
      if (r.bottom < 0 || r.top > (window.innerHeight || 800) || r.right < 0 || r.left > (window.innerWidth || 1200)) return false;
      var cs = getComputedStyle(el);
      return cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
    } catch (e) { return false; }
  }
  function reddish(el) {
    try {
      var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(el).color);
      if (!m) return false;
      var r = +m[1], g = +m[2], b = +m[3];
      return r > 150 && g < 110 && b < 110 && r - g > 70;
    } catch (e) { return false; }
  }
  function normMessage(text) { return String(text).toLowerCase().replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '@').replace(/\d+/g, '#').replace(/\s+/g, ' ').trim().slice(0, 160); }

  /** An error message that just appeared, as a kind and a hash — the words never leave this function. */
  function errorUi(el, attrName) {
    if (!el || el.nodeType !== 1 || isOurs(el)) return null;
    if (attrName === 'aria-invalid') {
      if (attr(el, 'aria-invalid') !== 'true' || !visible(el)) return null;
      return { kind: 'field', v: 1, h: fnv('field|' + (attr(el, 'name') || el.id || roleOf(el))) };
    }
    if (el.childElementCount > 30) return null; // a whole screen rendering, not a message
    if (closest(el, CONTENT) && !closest(el, '[role="alert"], [aria-live="assertive"], [class*="toast" i], [data-sonner-toast]')) return null;
    var alert = matches(el, '[role="alert"], [aria-live="assertive"]') ? el : closest(el, '[role="alert"], [aria-live="assertive"]');
    var text = textIn(el, 200);
    if (!text || text.length > 200 || NOT_ERRORS.test(text)) return null;
    // Whether it reads as the product failing or as a form asking for something: the words decide
    // here and are then dropped; only which of the two it was leaves.
    var v = ERROR_WORDS.test(text) && !FAILURE_WORDS.test(text) ? 1 : 0;
    if (alert && visible(el)) return v ? { kind: 'alert', v: 1, h: fnv(normMessage(text)) } : { kind: 'alert', h: fnv(normMessage(text)) };
    if (!ERROR_WORDS.test(text)) return null;
    if (now() - S.lastRouteT < 1500 && now() - lastAction > 1500) return null; // a new screen drawing its own words
    var notice = matches(el, NOTICE) ? el : closest(el, NOTICE);
    if (!notice && !(reddish(el) && text.length <= 120)) return null;
    if (!visible(el)) return null;
    var out = { kind: notice && matches(notice, '[class*="toast" i], [class*="snackbar" i], [data-sonner-toast]') ? 'toast' : 'text', h: fnv(normMessage(text)) };
    if (v) out.v = 1;
    return out;
  }

  var BUSY = '[aria-busy="true"], [role="progressbar"]:not([aria-valuenow]), progress:not([value]), [class*="spinner" i], [class*="loading" i], [class*="loader" i], [class*="skeleton" i], [data-loading="true"], [data-state="loading"]';
  var busyBaseline = typeof WeakSet === 'function' ? new WeakSet() : null;
  /** What is already turning on screen when someone presses is the screen's own state: never their wait. */
  function markBusyBaseline() {
    if (!busyBaseline) return;
    var list;
    try { list = document.querySelectorAll(BUSY); } catch (e) { return; }
    for (var i = 0; i < list.length && i < 40; i++) busyBaseline.add(list[i]);
  }
  function busyNow() {
    var list;
    try { list = document.querySelectorAll(BUSY); } catch (e) { return false; }
    for (var i = 0; i < list.length && i < 40; i++) {
      var el = list[i];
      if (busyBaseline && busyBaseline.has(el)) continue;
      var tag = el.tagName.toLowerCase();
      if (tag === 'html' || tag === 'body' || tag === 'img' || tag === 'script' || tag === 'link') continue;
      if (/lazy/i.test(String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || ''))) continue;
      if (closest(el, CHROME) || isOurs(el)) continue;
      if (visible(el)) return true;
    }
    return false;
  }
  var busyTimer = null;
  function pollBusySoon() { if (!busyTimer) busyTimer = setTimeout(guard(pollBusy), 250); }
  function pollBusy() {
    busyTimer = null;
    if (document.visibilityState === 'hidden') return;
    var on = busyNow();
    if (on !== S.busy) { S.busy = on; push({ k: 'busy', on: on }); }
    var t = now();
    // Only while an action is fresh: an indicator that turns for a whole scan is not polled for it.
    if (t - lastAction < 3000) busyTimer = setTimeout(guard(pollBusy), 500);
    else if (on && t - lastAction < 30000) busyTimer = setTimeout(guard(pollBusy), 1000);
  }

  /* Searches: the words are hashed with a salt that exists only in this page, and never stored. */
  var searchSalt = rand(12);
  var searchTimer = null;
  var lastSearchQ = null;
  var recentAdds = [];
  var searchPending = 0;
  function isSearchField(el) {
    if (!el || !el.tagName || el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') return false;
    if ((el.type || '').toLowerCase() === 'search' || attr(el, 'role') === 'searchbox' || closest(el, '[role="search"]')) return true;
    var name = (attr(el, 'name') || '') + ' ' + (el.id || '');
    if (/(^|[^a-z])(q|query|search|keywords?|term)([^a-z]|$)/i.test(name)) return true;
    return /\b(search|find)\b/i.test((attr(el, 'aria-label') || '') + ' ' + (attr(el, 'placeholder') || ''));
  }
  function searchTyped(el) {
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(guard(function () { searchSettled(el); }), 1200);
  }
  function searchSettled(el) {
    if (searchTimer) { clearTimeout(searchTimer); searchTimer = null; }
    var v = String(el.value || '').trim().toLowerCase();
    if (v.length < 2) return;
    var q = fnv(searchSalt + '|' + v);
    v = null;
    if (q === lastSearchQ) return;
    lastSearchQ = q;
    var label = safeLabel(el, nameOf(el));
    attend(3000);
    var ev = push({ k: 'search', q: q, zero: null, c: { sel: selectorOf(el, label, false), role: 'searchbox', name: label, tag: el.tagName.toLowerCase() } });
    recentAdds = [];
    searchPending++;
    setTimeout(guard(function () { searchPending = Math.max(0, searchPending - 1); ev.zero = emptyState(ev.t) ? true : false; recentAdds = []; schedule(50); }), 1800);
  }
  var EMPTY_WORDS = /\b(no (results?|matches|items|records|products|entries|data|documents|files|people|users|orders|customers)\b|nothing (found|match(es|ed)?|here|to show)|0 (results|matches|items)|could ?n[o']t find|did ?n[o']t match|no .{1,40} (found|match(es|ed)?)|try (a )?different (search|keyword|term|query))/i;
  function emptyState(since) {
    for (var i = 0; i < recentAdds.length; i++) {
      var n = recentAdds[i];
      if (n.t < since || !n.el.isConnected || closest(n.el, CHROME)) continue;
      var tx = textIn(n.el, 200);
      if (tx && tx.length <= 200 && EMPTY_WORDS.test(tx) && visible(n.el)) return true;
    }
    var list;
    try { list = document.querySelectorAll('[class*="empty" i], [class*="no-result" i], [class*="noresult" i], [class*="zero-state" i], [data-empty="true"], [role="status"]'); } catch (e) { return false; }
    for (var j = 0; j < list.length && j < 20; j++) {
      if (closest(list[j], CHROME) || !visible(list[j])) continue;
      var t2 = textIn(list[j], 200);
      if (t2 && t2.length <= 200 && EMPTY_WORDS.test(t2)) return true;
    }
    return false;
  }

  /* ---------------- the DOM, watched cheaply ---------------- */

  /*
   * The DOM is watched only while someone is doing something: from a press, a submit, a new
   * screen or a failed request, for a few seconds. A page that animates, ticks or streams on its
   * own pays nothing the rest of the time — the browser does not even build mutation records
   * when nobody is observing.
   */
  var mo = null, observing = false, attentionUntil = 0, attentionTimer = null;
  var MO_OPTIONS = { subtree: true, childList: true, characterData: true, attributes: true,
    attributeFilter: ['class', 'style', 'hidden', 'open', 'role', 'aria-expanded', 'aria-pressed', 'aria-checked', 'aria-selected', 'aria-busy', 'aria-hidden', 'aria-invalid', 'disabled', 'data-state', 'value'] };
  function attend(ms) {
    if (S.nodom || !mo || S.stopped) return;
    attentionUntil = Math.max(attentionUntil, now() + ms);
    if (!observing) {
      try { mo.observe(document.documentElement, MO_OPTIONS); observing = true; } catch (e) { S.nodom = true; return; }
    }
    if (!attentionTimer) attentionTimer = setTimeout(guard(release), Math.max(50, attentionUntil - now()));
  }
  function release() {
    attentionTimer = null;
    var left = attentionUntil - now();
    if (left > 0 || S.windows.length || searchTimer || (S.busy && now() - lastAction < 30000)) { attentionTimer = setTimeout(guard(release), Math.max(250, left)); return; }
    try { var rest = mo.takeRecords(); if (rest.length) onMutations(rest); mo.disconnect(); } catch (e) { /* gone */ }
    observing = false;
  }
  // The last three times each changing node changed: enough to tell a ticker from an answer.
  var amb = typeof WeakMap === 'function' ? new WeakMap() : null;
  function ambientAt(node, start) {
    var ring = amb && amb.get(node);
    if (!ring) return false;
    var n = 0;
    for (var r = 0; r < 3; r++) if (ring[r] < start && start - ring[r] < 3000) n++;
    return n >= 2;
  }
  // Read computed visibility after the app has painted. Reading it synchronously
  // from MutationObserver forces a large app's style work into every click.
  // Retain only bounded evidence, stamped when observed, never a DOM snapshot.
  var effectQueue = [], effectNodes = null, effectScheduled = false;
  function queueEffect(node, rec, t) {
    var kind = rec.type === 'attributes' ? (STATE_ATTRS[rec.attributeName] ? 'state' : rec.attributeName === 'class' ? 'class' : 'other')
      : rec.type === 'characterData' || (rec.type === 'childList' && hasText(rec)) ? 'text' : 'other';
    if (!effectNodes && typeof WeakMap === 'function') effectNodes = new WeakMap();
    var kinds = effectNodes && effectNodes.get(node);
    if (kinds && kinds[kind]) return;
    if (effectQueue.length >= 64) return;
    if (!kinds) kinds = {};
    kinds[kind] = true;
    if (effectNodes) effectNodes.set(node, kinds);
    effectQueue.push({ node: node, kind: kind, at: t });
    if (effectScheduled) return;
    effectScheduled = true;
    var afterFrame = function () { setTimeout(guard(applyEffects), 0); };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(afterFrame);
    else setTimeout(guard(applyEffects), 16);
  }
  function applyEffects() {
    var queue = effectQueue; effectQueue = []; effectNodes = null; effectScheduled = false;
    var visibility = typeof WeakMap === 'function' ? new WeakMap() : null;
    function rendered(node) {
      if (!node || node.nodeType !== 1) return true;
      if (visibility && visibility.has(node)) return visibility.get(node);
      // Layout reads here would force the host's entire render synchronously into
      // our observer. Computed display/visibility on the ancestor chain is enough
      // to reject hidden loaders, without forcing geometry on every app update.
      var style = getComputedStyle(node);
      var yes = !node.hidden && attr(node, 'aria-hidden') !== 'true' && style.display !== 'none'
        && style.visibility !== 'hidden' && Number(style.opacity) > 0.05 && rendered(node.parentElement);
      if (visibility) visibility.set(node, yes);
      return yes;
    }
    for (var i = 0; i < queue.length; i++) {
      var item = queue[i], node = item.node;
      if (!node.isConnected) continue;
      for (var w = 0; w < S.windows.length; w++) {
        var win = S.windows[w];
        if (item.at < win.start || win.x.dom || win.x.state || ambientAt(node, win.start)) continue;
        if (!rendered(node)) break;
        var inside = win.el && (win.el === node || (win.el.contains && win.el.contains(node)));
        if (inside) {
          if (item.kind === 'state' || item.kind === 'text') win.x.state = 1;
        } else if (item.kind !== 'class' || !win.el || !node.contains || !node.contains(win.el)) win.x.dom = 1;
      }
    }
  }
  function onMutations(records) {
    var t = now();
    var added = 0;
    var searching = searchPending > 0;
    var ownNodes = typeof WeakMap === 'function' ? new WeakMap() : null;
    var open = 0;
    for (var o = 0; o < S.windows.length; o++) if (!S.windows[o].x.dom && !S.windows[o].x.state) open++;
    for (var i = 0; i < records.length; i++) {
      var rec = records[i];
      var node = rec.type === 'characterData' ? rec.target.parentElement : rec.target;
      if (!node) continue;
      var ours = ownNodes && ownNodes.has(node) ? ownNodes.get(node) : isOurs(node);
      if (ownNodes) ownNodes.set(node, ours);
      if (ours) continue;
      // Hidden animations are not feedback a person can see. In particular a hidden
      // loading overlay must not make every dead button look as if it answered.
      if (open) queueEffect(node, rec, t);
      // Enough to recognise a ticker; a thousand-row render is one change, not a thousand.
      if (amb && i < 200) {
        var ring = amb.get(node);
        if (!ring) { ring = [0, 0, 0, 0]; amb.set(node, ring); }
        if (ring[(ring[3] + 2) % 3] !== t) { ring[ring[3]] = t; ring[3] = (ring[3] + 1) % 3; }
      }
      if (rec.type === 'attributes' && (rec.attributeName === 'aria-invalid' || rec.attributeName === 'role' || rec.attributeName === 'class')) {
        if (rec.attributeName !== 'class' || matches(node, '[role="alert"], [class*="error" i], [class*="invalid" i]')) {
          var u = errorUi(node, rec.attributeName);
          if (u) push(u.v ? { k: 'eui', kind: u.kind, h: u.h, v: 1 } : { k: 'eui', kind: u.kind, h: u.h });
        }
      }
      if (rec.type === 'childList' && added < 30) {
        for (var a = 0; a < rec.addedNodes.length && added < 30; a++) {
          var n = rec.addedNodes[a];
          if (!n || n.nodeType !== 1 || isOurs(n)) continue;
          added++;
          if (searching) recentAdds.push({ el: n, t: t });
          var ui = errorUi(n, null);
          if (ui) push(ui.v ? { k: 'eui', kind: ui.kind, h: ui.h, v: 1 } : { k: 'eui', kind: ui.kind, h: ui.h });
        }
      }
    }
    if (recentAdds.length > 60) recentAdds.splice(0, recentAdds.length - 60);
  }
  function hasText(rec) {
    var lists = [rec.addedNodes, rec.removedNodes];
    for (var l = 0; l < 2; l++) for (var i = 0; i < lists[l].length && i < 10; i++) {
      var n = lists[l][i];
      if (n.nodeType === 3 && n.nodeValue.trim()) return true;
      if (n.nodeType === 1 && (n.textContent || '').trim()) return true;
    }
    return false;
  }
  if (typeof MutationObserver === 'function') mo = new MutationObserver(guard(onMutations));
  else S.nodom = true;

  /* ---------------- the main thread ---------------- */

  var lto = null;
  try {
    if (typeof PerformanceObserver === 'function' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.indexOf('longtask') >= 0) {
      lto = new PerformanceObserver(guard(function (list) {
        var entries = list.getEntries();
        for (var i = 0; i < entries.length; i++) {
          var d = entries[i].duration;
          if (d >= 200 && now() - lastAction < 5000) push({ k: 'long', t: fromPerf(entries[i].startTime), d: Math.round(d) });
        }
      }));
      lto.observe({ type: 'longtask' });
    }
  } catch (e) { lto = null; }

  /* ---------------- leaving ---------------- */

  function internalNav() { return now() - S.internalNavAt < 1500; }
  try {
    if (window.navigation && window.navigation.addEventListener) {
      window.navigation.addEventListener('navigate', guard(function (e) {
        // Leaving for another page (or a download) is the press's answer, however slow the server.
        markWindows('open', null);
        try { if (e.destination && new URL(e.destination.url).origin === location.origin) S.internalNavAt = now(); } catch (e2) { /* ok */ }
      }));
    }
  } catch (e) { /* no navigation API */ }
  window.addEventListener('beforeunload', guard(function () { markWindows('open', null); }), { capture: true });
  document.addEventListener('click', guard(function (e) {
    var a = closest(e.target, 'a[href]');
    if (a && !attr(a, 'target')) { try { if (new URL(a.href, location.href).origin === location.origin) S.internalNavAt = now(); } catch (e2) { /* ok */ } }
    if (closest(e.target, 'button[type="submit"], input[type="submit"], form button:not([type])')) S.internalNavAt = now();
  }), { capture: true, passive: true });

  document.addEventListener('visibilitychange', guard(function () {
    if (document.visibilityState === 'hidden') {
      var t = now();
      push({ k: 'hide', t: t });
      evaluate();
      save();
      flush(true);
      if (S.hideTimer) clearTimeout(S.hideTimer);
      S.hideTimer = setTimeout(guard(function () {
        if (document.visibilityState === 'hidden') { push({ k: 'leave', t: t, why: 'hidden' }); evaluate(); save(); flush(true); }
      }), T.HIDDEN_LEAVE_MS);
    } else if (S.hideTimer) { clearTimeout(S.hideTimer); S.hideTimer = null; }
  }));
  window.addEventListener('pagehide', guard(function () {
    if (!internalNav()) push({ k: 'leave', why: 'closed' });
    evaluate();
    save();
    flush(true);
  }));
  function armIdle(errorT) {
    if (S.idleTimer) clearTimeout(S.idleTimer);
    S.idleTimer = setTimeout(guard(function () {
      var lastInput = Math.max(lastAction, S.lastKeyT, S.lastInputT);
      if (document.visibilityState === 'visible' && lastInput <= errorT + T.LEAVE_MS && now() - lastInput >= T.IDLE_MS) {
        push({ k: 'leave', t: Math.max(lastInput, errorT), why: 'idle' });
        evaluate();
      }
    }), T.LEAVE_MS + T.IDLE_MS + 500);
  }

  /* ---------------- deciding, and saying ---------------- */

  function schedule(ms) {
    if (S.stopped || !remoteAllowed) return;
    if (pending) return;
    pending = setTimeout(guard(function () { pending = null; evaluate(); }), ms);
  }

  var sensor = { name: 'breken-browser', version: VERSION, framework: cfg.framework };

  function evaluate() {
    if (S.stopped || !remoteAllowed) return;
    var t = now();
    var found = analyse(S.evs, t, false);
    for (var i = 0; i < found.length; i++) {
      var s = found[i];
      if (S.emitted[s.key]) continue;
      S.emitted[s.key] = t;
      s.steps = stepsBefore(S.evs, s.i);
      if (S.sent + S.out.length >= T.MAX_SIGNALS) continue;
      s.eventId = 'wev_' + rand(22);
      S.signals.push(s);
      S.out.push(wire(s));
      if (s.type === 'error-click' || s.type === 'form-resubmit') armIdle(s.t);
    }
    var keys = Object.keys(S.emitted);
    if (keys.length > 300) keys.slice(0, keys.length - 300).forEach(function (k) { delete S.emitted[k]; });
    if (S.out.length) flushSoon();
    maybePrompt(t);
    // A press is judged once what it caused has had time to show; come back for the ones still open.
    for (var j = S.evs.length - 1; j >= 0 && t - S.evs[j].t < 3500; j--) {
      if (S.evs[j].k === 'click' || S.evs[j].k === 'submit' || (S.evs[j].k === 'net' && S.evs[j].e == null)) { schedule(400); break; }
    }
    if (S.busy && t - lastAction < 30000) schedule(1000);
  }

  function wire(s) {
    var el = s.el ? { role: s.el.role || undefined, label: s.el.name || undefined, selector: s.el.sel || undefined, tag: s.el.tag || undefined } : undefined;
    var ev = { type: s.type, event_id: s.eventId, session: session, at: new Date(s.t).toISOString(), page: s.page || '/', weight: s.weight };
    if (el) ev.element = el;
    var timings = {};
    if (s.clicks) timings.clicks = s.clicks;
    if (s.windowMs) timings.window_ms = Math.round(s.windowMs);
    if (s.durationMs) timings.duration_ms = Math.round(s.durationMs);
    if (Object.keys(timings).length) ev.timings = timings;
    if (s.requestIds && s.requestIds.length) ev.request_ids = s.requestIds.slice(0, 5);
    var d = s.detail || {};
    if (d.error) ev.error = d.error;
    var detail = {};
    for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k) && k !== 'error') detail[k] = d[k];
    if (s.el && s.el.lm) detail.landmark = s.el.lm;
    if (Object.keys(detail).length) ev.detail = detail;
    ev.steps = (s.steps || []).map(function (st) {
      var o = { page: st.page, action: st.action };
      if (st.element) o.element = { role: st.element.role || undefined, label: st.element.label || undefined, selector: st.element.selector || undefined, tag: st.element.tag || undefined };
      if (st.times) o.times = st.times;
      return o;
    });
    return ev;
  }

  var flushTimer = null;
  function flushSoon() { if (!flushTimer) flushTimer = setTimeout(guard(function () { flushTimer = null; flush(false); }), 3000); }

  function flush(beacon) {
    if (!remoteAllowed || S.stopped) return Promise.resolve();
    if (S.retryAt && now() < S.retryAt) return Promise.resolve({ ok: false, status: 429 });
    if (S.sendOff || (!S.out.length && !S.fb.length)) return;
    var events = S.out.splice(0, 20);
    var feedback = S.fb.splice(0, 5);
    var envelope = function () {
      var o = { v: 1, source: 'web', sensor: sensor, events: events, feedback: feedback };
      if (cfg.key) o.key = cfg.key;
      if (S.agent) o.client = { agent: S.agent };
      return JSON.stringify(o);
    };
    var bytes = function (text) { try { return unescape(encodeURIComponent(text)).length; } catch (e) { return text.length * 3; } };
    var body = envelope();
    while (bytes(body) > 60000 && events.length) {
      events.forEach(function (e) { e.steps = (e.steps || []).slice(-4); });
      body = envelope();
      if (bytes(body) > 60000) { events.pop(); body = envelope(); }
    }
    S.sent += events.length;
    if (beacon && navigator.sendBeacon) {
      try { if (navigator.sendBeacon(cfg.endpoint, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return Promise.resolve(); } catch (e) { /* fall through */ }
    }
    if (typeof ofetch !== 'function') return Promise.resolve();
    try {
      return ofetch.call(window, cfg.endpoint, { method: 'POST', body: body, keepalive: bytes(body) < 60000, credentials: sameOrigin ? 'same-origin' : 'omit', mode: sameOrigin ? 'same-origin' : 'cors', headers: { 'content-type': 'text/plain;charset=UTF-8' } })
        .then(function (res) {
          S.lastDelivery = { status: res.status, accepted: res.ok };
          if (res.status === 429) {
            var retry = res.headers && res.headers.get('retry-after');
            var delay = retry && /^\d+(?:\.\d+)?$/.test(retry) ? Number(retry) * 1000 : Date.parse(retry || '') - now();
            S.retryAt = now() + (isFinite(delay) && delay >= 0 ? Math.max(1000, delay) : 30000);
          } else S.retryAt = 0;
          if (res.status === 404 || res.status === 401 || res.status === 403) { S.sendOff = true; return { ok: false, status: res.status }; }
          S.fails = res.ok ? 0 : S.fails + 1;
          if (S.fails >= 3) S.sendOff = true;
          // The intake saw a signed agent's Signature-Agent header on this very request.
          if (res.ok) return res.json().then(function (j) {
            if (j && j.agent === true && !S.agent) { S.agent = 'signed'; save(); syncLauncher(); }
            var accepted = Boolean(j && (typeof j.accepted === 'number' || j.accepted === true));
            if (feedback.length && j && typeof j.accepted === 'number' && !(typeof j.feedback === 'number' && j.feedback >= feedback.length)) accepted = false;
            S.lastDelivery.accepted = accepted;
            return { ok: accepted, status: res.status };
          }, function () { S.lastDelivery.accepted = false; return { ok: false, status: res.status }; });
          return { ok: false, status: res.status };
        }, function () { S.lastDelivery = { status: 0, accepted: false }; S.fails += 1; if (S.fails >= 3) S.sendOff = true; return { ok: false, status: 0 }; })
        .catch(function () { /* never in the way */ });
    } catch (e) { return Promise.resolve(); }
  }

  function save() {
    try {
      var keep = S.evs.slice(-80).map(function (e) { var o = {}; for (var k in e) if (k !== 'el') o[k] = e[k]; return o; });
      sset('sessionStorage', STORE, JSON.stringify({ s: session, in: true, at: now(), seq: S.seq, evs: keep, emitted: S.emitted, prompted: S.prompted, sent: S.sent, agent: S.agent }));
    } catch (e) { /* storage denied or full */ }
  }

  /* ---------------- the one prompt ---------------- */

  var promptHost = null;
  // Answers and ignored cards wait a day. Dismissal lasts only for this session.
  // Retire the old key so an earlier version's week-long dismissal cannot keep hiding Scout.
  var QUIET = '__brk_web_quiet_until_v2';
  var DAY = 24 * 3600 * 1000;

  function typing() {
    var a = document.activeElement;
    return (a && (isField(a) || a.isContentEditable) && now() - S.lastKeyT < 3000);
  }

  // A closed native dialog or CSS-hidden drawer is not an open modal.
  function openModal() {
    return Array.prototype.some.call(document.querySelectorAll('[aria-modal="true"], dialog[open]'), function (el) {
      return !(el.tagName === 'DIALOG' && !el.open) && !closest(el, '[hidden], [aria-hidden="true"], [inert]') && visible(el);
    });
  }

  function promptStatus() {
    var reason = S.stopped ? 'stopped' : !remoteAllowed ? 'paused-or-unreachable' : !cfg.prompt ? 'prompt-off'
      : S.agent ? 'automated-browser' : promptHost && promptHost.isConnected ? 'showing'
      : now() < Number(sget('localStorage', QUIET) || 0) ? 'cooldown' : S.prompted ? 'already-shown'
      : openModal() ? 'dialog-open' : typing() ? 'typing' : 'listening';
    return { active: remoteAllowed && !S.stopped, reason: reason, score: frustration(S.signals, now()),
      signals: S.signals.length, delivery: S.lastDelivery || null };
  }

  function maybePrompt(t) {
    if (!remoteAllowed || !cfg.prompt || S.prompted || S.stopped || promptHost || S.agent) return;
    if (t < Number(sget('localStorage', QUIET) || 0)) return;
    if (t - S.loadT < 5000) { schedule(5000 - (t - S.loadT) + 50); return; }
    var about = promptFor(S.signals, t);
    if (!about) return;
    // Not while they are typing, and not on top of a dialog: wait for a pause.
    if (typing() || openModal()) { schedule(3000); return; }
    S.prompted = true;
    sset('sessionStorage', '__brk_web_p', '1');
    save();
    // Send what was seen first, and read the answer: a signed agent is never asked anything.
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    var sent = flush(false) || Promise.resolve();
    var shown = false;
    var go = guard(function () {
      if (shown || S.agent) return;
      shown = true;
      // The page may have opened a dialog or the user started typing while the
      // report was in flight. Recheck at display time, not just detection time.
      if (!remoteAllowed || S.stopped || !cfg.prompt || promptHost) return;
      if (document.visibilityState === 'hidden' || typing() || openModal()) {
        S.prompted = false; sset('sessionStorage', '__brk_web_p', '0'); save(); schedule(3000); return;
      }
      showPrompt(about);
    });
    sent.then(function () { setTimeout(go, 600); }, function () { setTimeout(go, 600); });
    setTimeout(go, 3000);
  }

  function parseColor(c) {
    var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/.exec(String(c || ''));
    return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
  }
  function lum(c) { return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255; }
  function themeOf() {
    var body = document.body, html = document.documentElement;
    var bs = getComputedStyle(body), hs = getComputedStyle(html);
    var bg = parseColor(bs.backgroundColor);
    if (!bg || bg.a < 0.5) bg = parseColor(hs.backgroundColor);
    if (!bg || bg.a < 0.5) bg = { r: 255, g: 255, b: 255, a: 1 };
    var fg = parseColor(bs.color) || (lum(bg) < 0.5 ? { r: 240, g: 240, b: 240 } : { r: 20, g: 20, b: 20 });
    var dark = lum(bg) < 0.45;
    var accent = cfg.accent, radius = 10;
    try {
      var btn = document.querySelector('button[type="submit"], .btn-primary, [class*="primary" i]');
      if (btn) {
        var cs = getComputedStyle(btn);
        var c = parseColor(cs.backgroundColor);
        if (!accent && c && c.a > 0.5 && Math.max(c.r, c.g, c.b) - Math.min(c.r, c.g, c.b) > 40) accent = cs.backgroundColor;
        var rad = parseFloat(cs.borderTopLeftRadius);
        if (rad >= 0 && rad <= 16) radius = Math.max(4, rad);
      }
    } catch (e) { /* ok */ }
    function rgb(c2) { return 'rgb(' + c2.r + ',' + c2.g + ',' + c2.b + ')'; }
    return { bg: rgb(bg), fg: rgb(fg), dark: dark, accent: accent || (dark ? '#8ab4f8' : '#1d4ed8'), font: bs.fontFamily || 'system-ui, sans-serif', radius: radius };
  }

  function showPrompt(about) {
    if (!remoteAllowed || S.stopped || !document.body) return;
    if (promptHost && promptHost.isConnected) return;
    var host = document.createElement('div');
    host.setAttribute('data-breken-prompt', '');
    host.setAttribute('data-breken-ignore', '');
    host.style.cssText = 'position:fixed;z-index:2147483000;right:16px;bottom:58px;left:auto;max-width:calc(100vw - 32px);width:340px;pointer-events:none;';
    if (!host.attachShadow) return;
    var root2 = host.attachShadow({ mode: 'open' });
    var th = themeOf();
    var css = ''
      + ':host{all:initial}'
      + '.card{pointer-events:auto;box-sizing:border-box;font:14px/1.4 ' + th.font.replace(/[<>{};]/g, '') + ';color:' + th.fg + ';background:' + th.bg + ';'
      + 'border:1px solid ' + (th.dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.12)') + ';border-radius:' + (th.radius + 2) + 'px;'
      + 'box-shadow:0 8px 28px rgba(0,0,0,' + (th.dark ? '.5' : '.16') + ');padding:12px 12px 12px 14px;display:grid;gap:8px}'
      + '.row{display:flex;align-items:flex-start;gap:8px}.q{margin:0;flex:1;font-weight:600}'
      + '.x{all:unset;cursor:pointer;line-height:1;font-size:18px;padding:0 4px;opacity:.6;border-radius:4px}.x:hover,.x:focus-visible{opacity:1;outline:2px solid ' + th.accent + '}'
      + 'form{display:flex;gap:6px}input{flex:1;min-width:0;font:inherit;color:inherit;background:transparent;border:1px solid ' + (th.dark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.2)') + ';border-radius:' + th.radius + 'px;padding:7px 9px}'
      + 'input:focus{outline:2px solid ' + th.accent + ';outline-offset:1px}'
      + '.go{all:unset;cursor:pointer;font:inherit;font-weight:600;padding:7px 12px;border-radius:' + th.radius + 'px;background:' + th.accent + ';color:#fff}.go:focus-visible{outline:2px solid ' + th.fg + ';outline-offset:2px}'
      + '.done{margin:0}'
      + '@media (prefers-reduced-motion:no-preference){.card{animation:in .18s ease-out}@keyframes in{from{opacity:0;transform:translateY(6px)}}}';
    // A constructed sheet where the browser has them (a strict style-src does not block it); a
    // <style> otherwise. Either way the card below is usable without it.
    var sheetDone = false;
    try { if (root2.adoptedStyleSheets !== undefined && typeof CSSStyleSheet === 'function') { var sheet = new CSSStyleSheet(); sheet.replaceSync(css); root2.adoptedStyleSheets = [sheet]; sheetDone = true; } } catch (e) { sheetDone = false; }
    root2.innerHTML = (sheetDone ? '' : '<style>' + css + '</style>')
      + '<div class="card" role="dialog" aria-modal="false" aria-labelledby="q">'
      + '<div class="row"><p class="q" id="q">Something not working? Tell us in one line.</p><button class="x" type="button" aria-label="Dismiss">\u00d7</button></div>'
      + '<form><input type="text" maxlength="280" autocomplete="off" aria-label="What went wrong, in one line" placeholder="What were you trying to do?"><button class="go" type="submit">Send</button></form>'
      + '</div>';
    promptHost = host;
    document.body.appendChild(host);
    var card = root2.querySelector('.card');
    try { card.style.pointerEvents = 'auto'; card.style.background = th.bg; card.style.color = th.fg; } catch (e) { /* ok */ }
    var form = root2.querySelector('form');
    var input = root2.querySelector('input');
    var touched = false;
    var leaveTimer = null;
    var reportId = 'rpt_' + rand(22);
    var reportContext = { page: routeNow().r, steps: wire({t:now(),steps:stepsBefore(S.evs,S.evs.length - 1)}).steps };
    var close = function (quietFor) {
      if (promptHost !== host) return;
      clearTimeout(leaveTimer);
      promptHover = null;
      promptHost = null;
      if (launcherButton) launcherButton.setAttribute('aria-expanded', 'false');
      sset('localStorage', QUIET, String(now() + quietFor));
      if (host.parentNode) host.parentNode.removeChild(host);
    };
    // Allow crossing the gap between the launcher and card. Leaving an empty
    // preview dismisses it, but never discard a draft or interrupt keyboard use.
    promptHover = {
      enter: function () { clearTimeout(leaveTimer); },
      leave: function () {
        clearTimeout(leaveTimer);
        leaveTimer = setTimeout(function () {
          if (promptHost !== host || root2.activeElement || input.value.length || form.dataset.sending === '1') return;
          close(0);
        }, 400);
      }
    };
    var hoverState = promptHover;
    card.addEventListener('mouseenter', hoverState.enter);
    card.addEventListener('mouseleave', hoverState.leave);
    card.addEventListener('focusin', hoverState.enter);
    card.addEventListener('focusout', function () {
      if (!card.matches(':hover')) hoverState.leave();
    });
    root2.querySelector('.x').addEventListener('click', function () { close(0); });
    card.addEventListener('keydown', function (e) { touched = true; if (e.key === 'Escape') close(0); });
    input.addEventListener('focus', function () { touched = true; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var line = scrubLine(input.value);
      if (line.length < 2 || form.dataset.sending === '1') return;
      // Automatic sending backs off after repeated outages. A deliberate Retry
      // may try the same report again once the network/server recovers.
      if (S.sendOff && S.lastDelivery && [401, 403, 404].indexOf(S.lastDelivery.status) < 0) { S.sendOff = false; S.fails = 0; }
      touched = true; form.dataset.sending = '1';
      var send = form.querySelector('.go'); send.disabled = true; send.textContent = 'Sending…';
      var prior = card.querySelector('[role="alert"]'); if (prior) prior.remove();
      // The receipt must cover this submission, even with older feedback queued.
      S.fb = S.fb.filter(function (item) { return item.id !== reportId; });
      S.fb.unshift({ id: reportId, event_id: about && about.eventId, text: line, at: new Date().toISOString(), context: reportContext });
      Promise.resolve(flush(false)).then(function (receipt) {
        if (!receipt || !receipt.ok) {
          form.dataset.sending = '0'; send.disabled = false; send.textContent = 'Retry';
          var error = document.createElement('p'); error.className = 'done'; error.setAttribute('role', 'alert');
          error.textContent = receipt && receipt.status === 429 && S.retryAt > now()
            ? 'Too many reports. Wait ' + Math.ceil((S.retryAt - now()) / 1000) + ' seconds, then Retry. Your message is still here.'
            : 'Could not send. Your message is still here; please try again.'; card.appendChild(error); return;
        }
        input.value = ''; card.innerHTML = '';
        var done = document.createElement('p'); done.className = 'done'; done.setAttribute('role', 'status');
        done.textContent = 'Thanks. Your report was received.'; card.appendChild(done);
        setTimeout(function () { close(DAY); }, 2500);
      });
    });
    setTimeout(function () { if (!touched) close(DAY); }, 45000);
  }

  var launcherHost = null, launcherButton = null, promptHover = null;
  function syncLauncher() {
    var allowed = remoteAllowed && cfg.prompt && !S.stopped && !S.agent;
    if (!allowed) { if (launcherHost) launcherHost.remove(); launcherHost = null; launcherButton = null; return; }
    if (launcherHost && launcherHost.isConnected) return;
    if (!document.body || !document.body.attachShadow) return;
    launcherHost = document.createElement('div');
    launcherHost.setAttribute('data-breken-ignore', ''); launcherHost.setAttribute('data-breken-launcher', '');
    launcherHost.style.cssText = 'position:fixed;z-index:2147483000;right:12px;bottom:10px;width:32px;height:32px;';
    var root3 = launcherHost.attachShadow({ mode: 'open' });
    var th = themeOf();
    launcherButton = document.createElement('button'); launcherButton.type = 'button';
    launcherButton.textContent = '▚▚'; launcherButton.setAttribute('aria-label', 'Report a problem with Scout');
    launcherButton.setAttribute('aria-expanded', 'false'); launcherButton.setAttribute('aria-haspopup', 'dialog');
    launcherButton.title = 'Report a problem';
    launcherButton.style.cssText = 'all:unset;box-sizing:border-box;display:grid;place-items:center;cursor:pointer;width:32px;height:32px;font:14px/1 system-ui;opacity:.5;border-radius:4px;color:' + th.fg + ';background:transparent;';
    function open() {
      if (!remoteAllowed || S.stopped || S.agent || openModal()) return;
      S.prompted = true; save();
      showPrompt(S.signals.length ? S.signals[S.signals.length - 1] : null);
      launcherButton.setAttribute('aria-expanded', 'true');
    }
    launcherButton.addEventListener('click', open);
    launcherButton.addEventListener('focus', function () { launcherButton.style.opacity = '1'; open(); });
    launcherButton.addEventListener('blur', function () { launcherButton.style.opacity = '.5'; });
    var hover;
    launcherButton.addEventListener('mouseenter', function () { if (promptHover) promptHover.enter(); launcherButton.style.opacity = '1'; hover = setTimeout(open, 300); });
    launcherButton.addEventListener('mouseleave', function () { clearTimeout(hover); if (promptHover) promptHover.leave(); launcherButton.style.opacity = '.5'; });
    root3.appendChild(launcherButton); document.body.appendChild(launcherHost);
  }

  /* ---------------- the public face ---------------- */

  window.BrekenWeb = {
    version: VERSION,
    active: remoteAllowed,
    stop: stop,
    status: promptStatus,
    // Explicit owner testing resets prompt suppression, never privacy, the remote switch,
    // automation detection or the evidence threshold. The next real interaction is judged normally.
    beginTest: function () {
      if (!remoteAllowed || S.stopped || !cfg.prompt || S.agent) return false;
      if (promptHost && promptHost.parentNode) promptHost.parentNode.removeChild(promptHost);
      promptHost = null; S.prompted = false; S.evs = []; S.signals = []; S.windows = [];
      sset('sessionStorage', '__brk_web_p', '0'); sset('localStorage', QUIET, '0'); save();
      return true;
    },
    optOut: function () { sset('localStorage', 'breken-web-off', '1'); stop(); },
    /** The site's own "report a problem" button can hand its words here; they join what the sensor saw. */
    feedback: function (text) {
      var line = scrubLine(text);
      if (line.length < 2 || !remoteAllowed || S.stopped) return false;
      var last = S.signals.length ? S.signals[S.signals.length - 1] : null;
      S.fb.push({ id: 'rpt_' + rand(22), event_id: last ? last.eventId : undefined, text: line, at: new Date().toISOString(),
        context: { page: routeNow().r, steps: wire({t:now(),steps:stepsBefore(S.evs,S.evs.length - 1)}).steps } });
      flush(false);
      return true;
    }
  };
  /*
   * A report tool for browser agents (WebMCP), only where the site asks for it and the browser
   * offers the API. An agent that could not do something here can say so in one call; it lands
   * with the agent's signals, never in the human counts.
   */
  if (cfg.webmcp) {
    try {
      var mc = navigator.modelContext;
      if (mc && typeof mc.registerTool === 'function') {
        mc.registerTool({
          name: 'report_problem',
          description: 'Report that something on this site did not work, or that something you needed is missing. One sentence on what you were trying to do.',
          inputSchema: { type: 'object', properties: { goal: { type: 'string', maxLength: 280, description: 'What you were trying to do, in one sentence' } }, required: ['goal'] },
          execute: function (input) {
            var line = scrubLine(input && input.goal);
            if (line.length < 2 || !remoteAllowed || S.stopped) return { content: [{ type: 'text', text: 'Nothing was sent.' }] };
            if (!S.agent) S.agent = 'webmcp';
            var last = S.signals.length ? S.signals[S.signals.length - 1] : null;
            S.fb.push({ id: 'rpt_' + rand(22), event_id: last ? last.eventId : undefined, text: line, at: new Date().toISOString() });
            flush(false);
            return { content: [{ type: 'text', text: 'Thanks. The report was sent to the maintainers of this site.' }] };
          }
        });
      }
    } catch (e) { /* not offered here */ }
  }


  // Public submit-only key; this endpoint returns one boolean, never workspace data.
  // Fail closed if the control plane cannot be reached. No customer request waits on it.
  if (controlUrl && typeof window.fetch === 'function') {
    // Configuration polling is our own traffic, never an answer to a user's press.
    var controlFetch = (ofetch || window.fetch).bind(window);
    var controlTimer;
    function checkControl() {
      if (S.stopped) return;
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 2000);
      controlFetch(controlUrl, { credentials: 'omit', cache: 'no-store', signal: controller.signal })
        .then(function (response) { return response.ok ? response.json() : { enabled: false }; })
        .catch(function () { return { enabled: false }; })
        .then(function (config) {
          clearTimeout(timeout);
          remoteAllowed = config && config.enabled === true;
          if (window.BrekenWeb) window.BrekenWeb.active = remoteAllowed && !S.stopped;
          syncLauncher();
          if (!remoteAllowed) {
            S.evs = []; S.signals = []; S.out = []; S.fb = []; S.windows = [];
            effectQueue = []; effectNodes = null; effectScheduled = false;
            clearTimeout(pending); pending = null;
            clearTimeout(flushTimer); flushTimer = null;
            clearTimeout(busyTimer); busyTimer = null;
            clearTimeout(searchTimer); searchTimer = null;
            if (promptHost && promptHost.parentNode) promptHost.parentNode.removeChild(promptHost);
            promptHost = null;
          }
          if (!S.stopped) controlTimer = setTimeout(checkControl, 25000);
        });
    }
    checkControl();
  }

  syncLauncher();

  if (root.__BREKEN_WEB_TEST__) {
    window.BrekenWeb.debug = function () { return { events: S.evs, signals: S.signals, out: S.out, session: session, score: frustration(S.signals, now()), costMs: S.costTotal || 0, agent: S.agent, nodom: S.nodom, stopped: S.stopped, faults: S.faults, lastFault: S.lastFault }; };
    window.BrekenWeb.evaluate = function () { evaluate(); };
    window.BrekenWeb.flush = function () { flush(false); };
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
