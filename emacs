(defun ask-user-about-supersession-threat (fn)
  "blatantly ignore files that changed on disk"
  )

(load "/usr/school/etc/emacs/std.el")
(load "/usr/school/etc/emacs/std_comment.el")
(load "/usr/school/etc/emacs/php-mode.el")
(load "/usr/school/etc/emacs/std.el")
(load "/usr/school/etc/emacs/std_comment.el")
(load "/usr/school/etc/emacs/php-mode.el")
(setq-default show-trailing-whitespace t)
(column-number-mode t)
(show-paren-mode)
(menu-bar-mode -1)
(global-linum-mode )
(setq linum-format "%d")
(setq linum-format "%4d \u2502 ")
(put 'downcase-region 'disabled nil)
(defun ask-user-about-supersession-threat (fn)
  "blatantly ignore files that changed on disk"
  )
(defun ask-user-about-lock (file opponent)
  "always grab lock"
  t)
(global-auto-revert-mode)
