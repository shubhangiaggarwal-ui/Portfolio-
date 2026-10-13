/**
 * SHUBHANGI AGGARWAL — PERSONAL PORTFOLIO & EDITORIAL JOURNAL
 * Clean, lightweight, accessible JavaScript interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Reading / Scroll Progress Bar
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0 && scrollProgressBar) {
      const progress = (scrollTop / scrollHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ==========================================================================
  // 2. Mobile Drawer Navigation
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.classList.add('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeDrawer = () => {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // ==========================================================================
  // 3. ScrollSpy Active Link Tracking
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScrollSpy = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();

  // ==========================================================================
  // 4. Toast Notification Utility
  // ==========================================================================
  const copyToast = document.getElementById('copyToast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  const showToast = (message = 'Copied to clipboard!') => {
    if (!copyToast) return;
    if (toastMessage) toastMessage.textContent = message;

    copyToast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      copyToast.classList.remove('show');
    }, 3200);
  };

  // Fallback Copy Function
  const copyTextToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  };

  // ==========================================================================
  // 5. One-Click Phone Copy (Homepage & Contact Section)
  // ==========================================================================
  const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');
  copyPhoneBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const phone = btn.getAttribute('data-phone') || '9251025525';
      const copyTextEl = btn.querySelector('.copy-btn-text');
      const originalText = copyTextEl ? copyTextEl.textContent : 'Copy Phone';

      try {
        await copyTextToClipboard(phone);
        if (copyTextEl) copyTextEl.textContent = 'Copied! ✓';
        showToast(`Phone number (${phone}) copied to clipboard`);

        setTimeout(() => {
          if (copyTextEl) copyTextEl.textContent = originalText;
        }, 2500);
      } catch (err) {
        console.error('Copy phone error:', err);
        showToast(`Phone: ${phone}`);
      }
    });
  });

  // ==========================================================================
  // 6. Interactive Note Composer
  // ==========================================================================
  const contactNoteForm = document.getElementById('contactNoteForm');
  const visitorName = document.getElementById('visitorName');
  const topicSelect = document.getElementById('topicSelect');
  const noteMessage = document.getElementById('noteMessage');
  const noteStatus = document.getElementById('noteStatus');
  const clearNoteBtn = document.getElementById('clearNoteBtn');

  if (contactNoteForm) {
    contactNoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = visitorName ? visitorName.value.trim() : '';
      const topicVal = topicSelect ? topicSelect.value : 'General';
      const msgVal = noteMessage ? noteMessage.value.trim() : '';

      if (!nameVal || !msgVal) return;

      const formattedNote = `Hello Shubhangi! My name is ${nameVal}.\nRegarding "${topicVal}":\n${msgVal}`;

      try {
        await copyTextToClipboard(formattedNote);
        if (noteStatus) {
          noteStatus.textContent = '✓ Note formatted and copied! Ready to paste into a message.';
          noteStatus.style.color = '#2E7D32';
        }
        showToast('Formatted note copied to clipboard!');

        setTimeout(() => {
          if (noteStatus) noteStatus.textContent = '';
        }, 4000);
      } catch (err) {
        if (noteStatus) {
          noteStatus.textContent = 'Note ready: ' + formattedNote;
          noteStatus.style.color = 'var(--coffee-brown)';
        }
      }
    });

    if (clearNoteBtn) {
      clearNoteBtn.addEventListener('click', () => {
        if (visitorName) visitorName.value = '';
        if (noteMessage) noteMessage.value = '';
        if (noteStatus) noteStatus.textContent = '';
      });
    }
  }

  // ==========================================================================
  // 7. Smooth Scrolling for Internal Hash Links
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
