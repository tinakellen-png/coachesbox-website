// ---------------------------------------------------------------------------
// coachesbox-website build step
// ---------------------------------------------------------------------------
// Every source file in this repo is stored as {"data":"<base64>"} — a snapshot
// captured from the live deployment. This script decodes each file back to its
// real content, applies the approved content edits, and writes the finished
// static site into ./dist , which Vercel serves.
//   Edits:  (1) remove the ScoutIQ Film Analysis product block
//           (2) renumber CoachSync 04 -> 03
//           (3) add the Simulator Pricing block under the simulator
//           (4) add David Langdon's quote beside Tina's on the homepage
// Each edit hard-fails the build if its anchor is missing, so a broken build
// never reaches production.
// ---------------------------------------------------------------------------
var fs = require('fs');
var path = require('path');

var ROOT = __dirname;
var OUT = path.join(ROOT, 'dist');
var SKIP = ['.git', 'dist', 'node_modules', 'build.js', 'package.json', 'package-lock.json', 'vercel.json', '.vercel', 'README.md'];

var PRICING_HTML = Buffer.from('PGRpdiBjbGFzcz0ic2ltLXByaWNpbmciIGRhdGEtcmV2ZWFsIHN0eWxlPSJwYWRkaW5nLWJsb2NrOiB2YXIoLS1zcGFjZS0xNik7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1jb2xvci1ib3JkZXIpOyI+CiAgICAgICAgICA8ZGl2IHN0eWxlPSJ0ZXh0LWFsaWduOmNlbnRlcjsgbWF4LXdpZHRoOjY4MHB4OyBtYXJnaW4taW5saW5lOmF1dG87Ij4KICAgICAgICAgICAgPHNwYW4gY2xhc3M9ImJhZGdlIGJhZGdlLS1uZXciPkF2YWlsYWJsZSBOb3c8L3NwYW4+CiAgICAgICAgICAgIDxoMiBjbGFzcz0icHJvZHVjdC1mZWF0dXJlX190aXRsZSIgc3R5bGU9Im1hcmdpbi10b3A6IHZhcigtLXNwYWNlLTQpOyI+U2ltdWxhdG9yIFByaWNpbmc8L2gyPgogICAgICAgICAgICA8cCBjbGFzcz0icHJvZHVjdC1mZWF0dXJlX19kZXNjIj5Bbm51YWwgc3Vic2NyaXB0aW9uIGZvciB0aGUgVmlydHVhbCBQcmFjdGljZSBTaW11bGF0b3IuIFBhdGVudCBQZW5kaW5nLjwvcD4KICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPGRpdiBzdHlsZT0iZGlzcGxheTpncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCAxZnIpOyBnYXA6IHZhcigtLXNwYWNlLTYpOyBtYXJnaW4tdG9wOiB2YXIoLS1zcGFjZS0xMCk7Ij4KICAgICAgICAgICAgPGRpdiBzdHlsZT0iYmFja2dyb3VuZDogdmFyKC0tYmxhY2spOyBib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjAwLDE2OCw3NSwwLjI1KTsgYm9yZGVyLXJhZGl1czogdmFyKC0tcmFkaXVzLXhsKTsgcGFkZGluZzogdmFyKC0tc3BhY2UtOCk7IHRleHQtYWxpZ246Y2VudGVyOyI+CiAgICAgICAgICAgICAgPGRpdiBzdHlsZT0idGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlOyBsZXR0ZXItc3BhY2luZzowLjA4ZW07IGZvbnQtc2l6ZTowLjhyZW07IGNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC42KTsiPlNjaG9vbDwvZGl2PgogICAgICAgICAgICAgIDxkaXYgc3R5bGU9ImZvbnQtZmFtaWx5OidCZWJhcyBOZXVlJywgSW1wYWN0LCBzYW5zLXNlcmlmOyBmb250LXNpemU6Mi44cmVtOyBsaW5lLWhlaWdodDoxLjA1OyBjb2xvcjojYjhhODRiOyBtYXJnaW4tdG9wOiB2YXIoLS1zcGFjZS0yKTsiPiQ0OTguODg8L2Rpdj4KICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSJjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LDAuNik7IGZvbnQtc2l6ZTowLjlyZW07Ij5wZXIgeWVhcjwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPGRpdiBzdHlsZT0iYmFja2dyb3VuZDogdmFyKC0tYmxhY2spOyBib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjAwLDE2OCw3NSwwLjI1KTsgYm9yZGVyLXJhZGl1czogdmFyKC0tcmFkaXVzLXhsKTsgcGFkZGluZzogdmFyKC0tc3BhY2UtOCk7IHRleHQtYWxpZ246Y2VudGVyOyI+CiAgICAgICAgICAgICAgPGRpdiBzdHlsZT0idGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlOyBsZXR0ZXItc3BhY2luZzowLjA4ZW07IGZvbnQtc2l6ZTowLjhyZW07IGNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC42KTsiPlVuaXZlcnNpdHk8L2Rpdj4KICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSJmb250LWZhbWlseTonQmViYXMgTmV1ZScsIEltcGFjdCwgc2Fucy1zZXJpZjsgZm9udC1zaXplOjIuOHJlbTsgbGluZS1oZWlnaHQ6MS4wNTsgY29sb3I6I2M4YTg0YjsgbWFyZ2luLXRvcDogdmFyKC0tc3BhY2UtMik7Ij4kMSw0OTguODg8L2Rpdj4KICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSJjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LDAuNik7IGZvbnQtc2l6ZTowLjlyZW07Ij5wZXIgeWVhcjwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgICAgPGRpdiBzdHlsZT0iYmFja2dyb3VuZDogdmFyKC0tYmxhY2spOyBib3JkZXI6MXB4IHNvbGlkIHJnYmEoMjAwLDE2OCw3NSwwLjI1KTsgYm9yZGVyLXJhZGl1czogdmFyKC0tcmFkaXVzLXhsKTsgcGFkZGluZzogdmFyKC0tc3BhY2UtOCk7IHRleHQtYWxpZ246Y2VudGVyOyI+CiAgICAgICAgICAgICAgPGRpdiBzdHlsZT0idGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlOyBsZXR0ZXItc3BhY2luZzowLjA4ZW07IGZvbnQtc2l6ZTowLjhyZW07IGNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC42KTsiPkRpc3RyaWN0PC9kaXY+CiAgICAgICAgICAgICAgPGRpdiBzdHlsZT0iZm9udC1mYW1pbHk6J0JlYmFzIE5ldWUnLCBJbXBhY3QsIHNhbnMtc2VyaWY7IGZvbnQtc2l6ZToyLjhyZW07IGxpbmUtaGVpZ2h0OjEuMDU7IGNvbG9yOiNjOGE4NGI7IG1hcmdpbi10b3A6IHZhcigtLXNwYWNlLTIpOyI+JDM5OS4xMDwvZGl2PgogICAgICAgICAgICAgIDxkaXYgc3R5bGU9ImNvbG9yOnJnYmEoMjU1LDI1NSwyNTUsMC42KTsgZm9udC1zaXplOjAuOXJlbTsiPnBlciBzY2hvb2wgLyB5ZWFyICZtaWRkb3Q7IDImbmRhc2g7NyBzY2hvb2xzPC9kaXY+CiAgICAgICAgICAgICAgPGRpdiBzdHlsZT0iY29sb3I6cmdiYSgyNTUsMjU1LDI1NSwwLjg1KTsgZm9udC1zaXplOjAuOXJlbTsgbWFyZ2luLXRvcDogdmFyKC0tc3BhY2UtMik7Ij4kMzQ5LjIyIHBlciBzY2hvb2wgJm1pZGRvdDsgOCsgc2Nob29sczwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDwvZGl2PgogICAgICAgIDwvZGl2Pg==', 'base64').toString('utf8');
var DAVID_QUOTE_HTML = Buffer.from('ICAgICAgICAgICAgPGJsb2NrcXVvdGUgY2xhc3M9InB1bGwtcXVvdGUiIHN0eWxlPSJtYXJnaW4tdG9wOiB2YXIoLS1zcGFjZS04KTsiPgogICAgICAgICAgICAgIDxwPiJFdmVyeSBjb2FjaCBrbm93cyB0aGUgcHJvYmxlbTogeW91IGNhbid0IGdldCBlbm91Z2ggcXVhbGl0eSByZXBzIGFnYWluc3QgdGhlIGxvb2tzIHlvdSdsbCBhY3R1YWxseSBzZWUgb24gRnJpZGF5LCBhbmQgYSBzY291dCB0ZWFtIG9ubHkgdGFrZXMgeW91IHNvIGZhci4gVGhlIENvYWNoZXMnIEJveCBjaGFuZ2VzIHRoYXQuIE15IHBsYXllcnMgZ2V0IHVubGltaXRlZCBtZW50YWwgcmVwcyBvZiBhbnkgZm9ybWF0aW9uIGFuZCBjb3ZlcmFnZSwgYW5kIEkgY2FuIGluc3RhbGwgZmFzdGVyIGFuZCBjbGVhbmVyIHRoYW4gSSBldmVyIGNvdWxkIG9uIGEgd2hpdGVib2FyZC4gSXQncyB0aGUgdG9vbCBJIHdpc2ggSSdkIGhhZCBteSB3aG9sZSBjYXJlZXIuIjwvcD4KICAgICAgICAgICAgICA8Zm9vdGVyPgogICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9InB1bGwtcXVvdGVfX2F1dGhvciI+RGF2aWQgTGFuZ2Rvbjwvc3Bhbj4KICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPSJwdWxsLXF1b3RlX19yb2xlIj5DaGllZiBGb290YmFsbCBTdHJhdGVneSBPZmZpY2VyICZhbXA7IEN1cnJlbnQgSGVhZCBDb2FjaDwvc3Bhbj4KICAgICAgICAgICAgICA8L2Zvb3Rlcj4KICAgICAgICAgICAgPC9ibG9ja3F1b3RlPg==', 'base64').toString('utf8');

function decode(buf) {
  try {
    var j = JSON.parse(buf.toString('utf8'));
    if (j && typeof j.data === 'string') return Buffer.from(j.data, 'base64');
  } catch (e) {}
  return buf;
}

function editProducts(html) {
  // (0) update the "Core Products" hero stat 4 -> 3 (ScoutIQ removed)
  var cnt = '<div class="product-hero-stat__num">4</div>';
  if (html.indexOf(cnt) < 0) throw new Error('EDIT FAIL: core-products count 4 not found');
  html = html.replace(cnt, '<div class="product-hero-stat__num">3</div>');
  // (1) remove ScoutIQ block
  var m = html.indexOf('ScoutIQ');
  if (m < 0) throw new Error('EDIT FAIL: ScoutIQ marker not found');
  var openerRev = html.lastIndexOf('data-reveal>', m);
  var start = html.lastIndexOf('<div class="product-feature', openerRev);
  var nextRev = html.indexOf('data-reveal>', m);
  var end = html.lastIndexOf('<div class="product-feature', nextRev);
  if (start < 0 || end < 0 || end <= start) throw new Error('EDIT FAIL: ScoutIQ bounds');
  html = html.slice(0, start) + html.slice(end);
  if (html.indexOf('ScoutIQ') >= 0) throw new Error('EDIT FAIL: ScoutIQ still present');
  // (2) renumber CoachSync 04 -> 03
  var num = '<div class="product-feature__number">04</div>';
  if (html.indexOf(num) < 0) throw new Error('EDIT FAIL: CoachSync number 04 not found');
  html = html.replace(num, '<div class="product-feature__number">03</div>');
  // (3) insert pricing right after the simulator (before AI Practice Builder)
  var ai = html.indexOf('AI Practice Builder');
  if (ai < 0) throw new Error('EDIT FAIL: AI Practice Builder marker not found');
  var aiRev = html.lastIndexOf('data-reveal>', ai);
  var aiStart = html.lastIndexOf('<div class="product-feature', aiRev);
  if (aiStart < 0) throw new Error('EDIT FAIL: AI block start not found');
  html = html.slice(0, aiStart) + PRICING_HTML + '\n\n        ' + html.slice(aiStart);
  if (html.indexOf('Simulator Pricing') < 0) throw new Error('EDIT FAIL: pricing not inserted');

  // (4) refresh the "See It In Action" copy (was describing the old 2D demo)
  var oldDesc = 'Watch a Spread formation run a shallow cross against a 4-2 Cover 3 defense, the same way your players will experience it in the simulator.';
  if (html.indexOf(oldDesc) < 0) throw new Error('EDIT FAIL: demo description not found');
  html = html.replace(oldDesc, 'A live look at the 3D scout-team simulator &mdash; real formations, real assignments, snapped in front of your players. Tap in and run a play yourself.');
  var oldEyebrow = '>Live Interactive Demo<';
  if (html.indexOf(oldEyebrow) < 0) throw new Error('EDIT FAIL: demo eyebrow not found');
  html = html.replace(oldEyebrow, '>See It Live<');
  // darken the demo description so it is readable on the light section background
  var faintDesc = 'color:rgba(255,255,255,0.65);max-width:48ch;';
  if (html.indexOf(faintDesc) < 0) throw new Error('EDIT FAIL: demo description style not found');
  html = html.replace(faintDesc, 'color:rgba(10,10,10,0.62);max-width:48ch;');

  // (5) swap the old embedded 2D iframe demo for a still image + "Try It Live" button
  var boxStart = html.indexOf('<div style="border-radius:12px;overflow:hidden;border:1px solid rgba(200,168,75,0.3);box-shadow:0 8px 40px rgba(0,0,0,0.5);">');
  var capMarker = html.indexOf('Use Slow / Normal / Fast to control speed.');
  if (boxStart < 0 || capMarker < 0) throw new Error('EDIT FAIL: demo box/caption bounds');
  var capEnd = html.indexOf('</p>', capMarker);
  if (capEnd < 0) throw new Error('EDIT FAIL: demo caption end');
  capEnd += '</p>'.length;
  var NEW_DEMO = '<div style="border-radius:12px;overflow:hidden;border:1px solid rgba(200,168,75,0.3);box-shadow:0 8px 40px rgba(0,0,0,0.5);">\n' +
    '            <img src="../assets/img/sim-3d-preview.jpg" alt="The Coaches\' Box 3D scout-team simulator: offensive line in a 3-point stance across from a scout-team defense on a full 3D field" style="display:block;width:100%;height:auto;">\n' +
    '          </div>\n' +
    '          <div style="text-align:center;margin-top:var(--space-6);">\n' +
    '            <a href="https://coaches-box-sim3d.vercel.app/" target="_blank" rel="noopener" class="btn btn--primary">Try It Live &rarr;</a>\n' +
    '          </div>';
  html = html.slice(0, boxStart) + NEW_DEMO + html.slice(capEnd);
  if (html.indexOf('coaches-box-vps-demo.vercel.app') >= 0) throw new Error('EDIT FAIL: old iframe still present');

  // (6) remove the dead "Coaching Gear / Equip Your Program" affiliate section (links went nowhere)
  var gearStart = html.indexOf('<!-- Coaching Gear -->');
  var ctaStart = html.indexOf('<!-- CTA -->');
  if (gearStart < 0 || ctaStart < 0 || ctaStart <= gearStart) throw new Error('EDIT FAIL: gear/cta bounds');
  html = html.slice(0, gearStart) + html.slice(ctaStart);
  if (html.indexOf('Equip Your Program') >= 0) throw new Error('EDIT FAIL: gear section still present');

  return html;
}

function editIndex(html) {
  // remove the ScoutIQ product card from the homepage products overview
  var s = html.indexOf('ScoutIQ');
  if (s < 0) throw new Error('EDIT FAIL: homepage ScoutIQ not found');
  var cardStart = html.lastIndexOf('<article', s);
  var cardEnd = html.indexOf('</article>', s);
  if (cardStart < 0 || cardEnd < 0) throw new Error('EDIT FAIL: homepage ScoutIQ card bounds');
  cardEnd += '</article>'.length;
  html = html.slice(0, cardStart) + html.slice(cardEnd);
  if (html.indexOf('ScoutIQ') >= 0) throw new Error('EDIT FAIL: homepage ScoutIQ still present');
  // add David Langdon's quote right after Tina's
  var a = html.indexOf('pull-quote__author">Tina Langdon');
  if (a < 0) throw new Error('EDIT FAIL: Tina quote not found');
  var close = html.indexOf('</blockquote>', a);
  if (close < 0) throw new Error('EDIT FAIL: blockquote close not found');
  var at = close + '</blockquote>'.length;
  html = html.slice(0, at) + '\n' + DAVID_QUOTE_HTML + html.slice(at);
  if (html.indexOf('David Langdon') < 0) throw new Error('EDIT FAIL: David quote not inserted');
  return html;
}

function walk(dir) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (SKIP.indexOf(e.name) >= 0) continue;
    var abs = path.join(dir, e.name);
    var rel = path.relative(ROOT, abs).split(path.sep).join('/');
    if (e.isDirectory()) { walk(abs); continue; }
    var content = decode(fs.readFileSync(abs));
    // pages/products.html is now stored as final plain HTML (single-play preview baked in); pass through.
    if (rel === 'index.html') content = Buffer.from(editIndex(content.toString('utf8')), 'utf8');
    var outPath = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content);
    console.log('wrote ' + rel + ' (' + content.length + ' bytes)');
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
walk(ROOT);
console.log('Build complete.');
