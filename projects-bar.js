document.addEventListener('DOMContentLoaded', function () {
  var bar = document.createElement('div');
  bar.style.cssText = 'border-top:1px solid #e5e7eb;padding:14px 24px;text-align:center;font-family:-apple-system,system-ui,sans-serif;font-size:13px;color:#9ca3af;background:#fafafa';
  bar.innerHTML = 'Our projects: ' +
    '<a href="https://okad.cc/" style="color:#6366f1;text-decoration:none;margin:0 8px">OKAD UGC</a> · ' +
    '<a href="https://reelpilot.co/" style="color:#6366f1;text-decoration:none;margin:0 8px">ReelPilot</a> · ' +
    '<a href="https://remeet.cc/" style="color:#6366f1;text-decoration:none;margin:0 8px">Remeet Photo Books</a>';
  document.body.appendChild(bar);
});
