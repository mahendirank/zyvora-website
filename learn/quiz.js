/* Zyvora lesson quiz + progress tracker */
(function () {
  var holder = document.getElementById('quiz');
  var dataEl = document.getElementById('quiz-data');
  if (!holder || !dataEl) return;
  var quiz = JSON.parse(dataEl.textContent);
  var slug = holder.getAttribute('data-lesson');
  var answered = 0, correct = 0;

  var head = document.createElement('div');
  head.className = 'quiz-head';
  head.innerHTML = '<span class="quiz-kicker">CHECK YOUR UNDERSTANDING</span><h2 style="margin:0;color:var(--light)">Quick quiz — ' + quiz.questions.length + ' questions</h2>';
  holder.appendChild(head);

  quiz.questions.forEach(function (q, qi) {
    var card = document.createElement('div');
    card.className = 'quiz-q';
    var h = document.createElement('p');
    h.className = 'quiz-question';
    h.textContent = (qi + 1) + '. ' + q.q;
    card.appendChild(h);
    var opts = document.createElement('div');
    opts.className = 'quiz-opts';
    q.opts.forEach(function (opt, oi) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = opt;
      b.addEventListener('click', function () {
        if (card.classList.contains('locked')) return;
        card.classList.add('locked');
        answered++;
        var right = oi === q.a;
        if (right) correct++;
        b.classList.add(right ? 'right' : 'wrong');
        if (!right) opts.children[q.a].classList.add('right');
        var fb = document.createElement('p');
        fb.className = 'quiz-fb ' + (right ? 'ok' : 'no');
        fb.textContent = (right ? '✓ Correct. ' : '✗ Not quite. ') + q.why;
        card.appendChild(fb);
        if (answered === quiz.questions.length) finish();
      });
      opts.appendChild(b);
    });
    card.appendChild(opts);
    holder.appendChild(card);
  });

  function finish() {
    var out = document.createElement('div');
    out.className = 'quiz-result';
    var passed = correct >= Math.ceil(quiz.questions.length * 0.66);
    out.innerHTML = '<b>' + correct + ' / ' + quiz.questions.length + ' correct.</b> ' +
      (passed ? 'Lesson complete — it now shows a ✓ on your learning path.' :
        'Worth one more read before moving on — the concepts build on each other.');
    holder.appendChild(out);
    if (passed) {
      try { localStorage.setItem('zyv-done-' + slug, '1'); } catch (e) {}
    }
  }
})();
