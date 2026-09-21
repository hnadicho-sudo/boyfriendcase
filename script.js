/* Shared interactions for the three courtroom pages. Replace the bracketed copy in HTML to personalize the case. */
(function () {
  'use strict';

  // A small fade keeps navigation feeling like one continuous case file.
  document.querySelectorAll('.page-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (link.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(function () { window.location.href = link.href; }, 260);
    });
  });

  if (document.body.dataset.page === 'evidence') {
    var cards = Array.from(document.querySelectorAll('.evidence-card'));
    var count = document.getElementById('evidence-count');
    var status = document.getElementById('evidence-status');
    var verdictLink = document.getElementById('verdict-link');
    var viewed = new Set();

    function updateEvidenceProgress() {
      var total = cards.length;
      var opened = viewed.size;
      count.textContent = opened + '/' + total;
      if (opened === total) {
        status.textContent = 'All exhibits reviewed. The court is ready for judgment.';
        verdictLink.classList.remove('is-locked');
        verdictLink.classList.add('is-ready');
        verdictLink.setAttribute('aria-disabled', 'false');
      } else {
        status.textContent = (total - opened) + ' exhibit' + (total - opened === 1 ? '' : 's') + ' remain sealed.';
      }
    }

    cards.forEach(function (card) {
      function openCard() {
        card.classList.add('open');
        viewed.add(card.dataset.evidence);
        updateEvidenceProgress();
      }
      card.addEventListener('click', function (event) {
        if (event.target.closest('button') || event.target === card) openCard();
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCard(); }
      });
      card.querySelector('.inspect-button').addEventListener('click', openCard);
    });
    updateEvidenceProgress();
  }

  if (document.body.dataset.page === 'verdict') {
    var messages = [
      'The court has reviewed all evidence...',
      'Analyzing evidence...',
      'Consulting the jury...',
      'Final decision pending...'
    ];
    var text = document.getElementById('typing-text');
    var progress = document.getElementById('typing-progress');
    var reveal = document.getElementById('guilty-reveal');
    var machine = document.getElementById('verdict-machine');
    var step = 0;

    function typeMessage(message, done) {
      var index = 0;
      text.textContent = '';
      progress.style.width = '0%';
      var timer = window.setInterval(function () {
        text.textContent += message.charAt(index);
        index += 1;
        progress.style.width = Math.min(100, (index / message.length) * 100) + '%';
        if (index >= message.length) { window.clearInterval(timer); window.setTimeout(done, 550); }
      }, 28);
    }
    function nextMessage() {
      if (step < messages.length) {
        typeMessage(messages[step], function () { step += 1; nextMessage(); });
      } else {
        machine.style.opacity = '0';
        machine.style.transform = 'translateY(-8px)';
        window.setTimeout(function () { machine.hidden = true; reveal.hidden = false; }, 420);
      }
    }
    window.setTimeout(nextMessage, 500);

    document.getElementById('celebrate-button').addEventListener('click', function () {
      var layer = document.createElement('div');
      layer.className = 'hearts-layer';
      for (var i = 0; i < 26; i += 1) {
        var heart = document.createElement('span');
        heart.className = 'heart-particle';
        heart.textContent = i % 3 === 0 ? '♥' : '♡';
        heart.style.left = (5 + Math.random() * 90) + '%';
        heart.style.top = (80 + Math.random() * 17) + '%';
        heart.style.animationDelay = (Math.random() * .7) + 's';
        heart.style.fontSize = (13 + Math.random() * 18) + 'px';
        layer.appendChild(heart);
      }
      document.body.appendChild(layer);
      window.setTimeout(function () { layer.remove(); }, 3500);
      this.textContent = 'CASE CLOSED ♥';
    });
  }
}());
