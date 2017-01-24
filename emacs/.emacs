 ;; set values
(setq backup-directory-alist
      `((".*" . ,temporary-file-directory)))
(setq auto-save-file-name-transforms
      `((".*" ,temporary-file-directory t)))


(set-language-environment "UTF-8")
(delete-selection-mode 1)
;(set-foreground-color "white")
;(set-background-color "black")

;(load "~/.emacs.d/std.el")
;(load "~/.emacs.d/std_comment.el")
;(load "~/.emacs.d/std_comment.elc")
;(load "~/.emacs.d/std.elc")

(add-to-list 'load-path "~/.emacs.d/lisp")
(add-to-list 'load-path "~/.emacs.d/lisp/tools")
(add-to-list 'load-path "~/.emacs.d/lisp/modes")
(add-to-list 'load-path "~/.emacs.d/lisp/epitech")
(add-to-list 'load-path "~/.emacs.d/lisp/colors")

;(load-file "~/.emacs.d/std_comment.el")

(setq custom-file "~/.emacs-custom.el")
(setq c-default-style "gnu")
(setq c-basic-offset 2)
(setq indent-tabs-mode 1)
(setq user-full-name "Loïc Pirez")
(setq user-mail-address "loic.pirez@epitech.eu")
(setq-default gdb-many-windows t)
(setq ido-ignore-buffers (quote ("\\`\\*breakpoints of.*\\*\\'"
  "\\`\\*stack frames of.*\\*\\'" "\\`\\*gud\\*\\'"
  "\\`\\*locals of.*\\*\\'"  "\\` ")))


(global-set-key [f11] 'std-file-header) 

;(require 'smalltalk-mode)
(require 'rust-mode)
(require 'std_comment)
(require 'list-sources)
(require 'gnus-conf)
(require 'django-html-mode)
(require 'auto-complete)
(require 'auto-complete-words)
(require 'episnippet)
(require 'php-mode)
(require 'highlight-parentheses)
(require 'lua-mode)
(require 'd-mode)

(add-to-list 'auto-mode-alist '("\\.go$" . c-mode))
(add-to-list 'auto-mode-alist '("\\.d$" . d-mode))
(add-to-list 'auto-mode-alist '("\\.pl$" . cperl-mode))
(add-to-list 'auto-mode-alist '("\\.pm$" . cperl-mode))
(add-to-list 'auto-mode-alist '("\\.php$" . php-mode))
(add-to-list 'auto-mode-alist '("\\.tpl$" . sgml-mode))
(add-to-list 'auto-mode-alist '("\\.lua$" . lua-mode))
(add-to-list 'auto-mode-alist '("dot.emacs$" . emacs-lisp-mode))
(add-to-list 'auto-mode-alist '("\\.h$" . c-mode))
(add-to-list 'auto-mode-alist '("\\.hh$" . c++-mode))
(add-to-list 'auto-mode-alist '("\\.hpp$" . c++-mode))

(if (file-exists-p "~/.myemacs") 
    (load-file "~/.myemacs"))

(column-number-mode 1)
;(cua-mode t nil (cua-base))
;(cua-remap-control-z nil)
(normal-erase-is-backspace-mode -1)
(display-time-mode 1)
;(fringe-mode 0 nil (fringe))
(global-auto-complete-mode 1)
;(inhibit-startup-screen t)
;(pong-timer-delay 0.02)
;(scroll-bar-mode -1)
(show-paren-mode 1)
(size-indication-mode 1)
(menu-bar-mode -1)
;(tool-bar-mode -1)

(defun insert-header-guard ()
  (interactive)
  (save-excursion
    (when (buffer-file-name)
      (goto-char (point-min))
      (let*
	  ((name (file-name-nondirectory buffer-file-name))
	   (macro (replace-regexp-in-string
		   "\\." "_"
		   (replace-regexp-in-string
		    "-" "_"
		    (upcase name)))))
	(insert "#ifndef\t\t" macro "_\n")
	(insert "# define\t" macro "_\n\n")
	(goto-char (point-max))
	(insert "\n#endif\t\t/* !" macro "_ */\n")))
    (insert-header-epitech)))


(defun insert-header-epitech ()
  (interactive)
  (goto-char (point-min))
  (let ((projname (file-name-sans-extension (file-name-nondirectory buffer-file-name)))(location " "))
    (setq location (getenv "PWD"))
    (insert (std-get 'cs))
    (newline)
    (insert (concat (std-get 'cc) (buffer-name) header-for projname header-in location))
    (newline)
    (insert (std-get 'cc))
    (newline)
    (insert (concat (std-get 'cc) "Made by Loïc Pirez")) 
    (newline)
    (insert (concat (std-get 'cc) header-login header-login-beg user-mail-address header-login-end))
    (newline)
    (insert (std-get 'cc))
    (newline)
    (insert (concat (std-get 'cc) header-started (current-time-string) " " user-nickname))
    (newline)
    (insert (concat (std-get 'cc) header-last (current-time-string) " " user-nickname))
    (newline)
    (insert (std-get 'ce))
    (newline)
    (newline)))

;;sert a rien ?
(defun insert-header ()
  (interactive))
(add-hook 'find-file-hooks
	  (lambda ()
	    (when (and (memq major-mode '(c-mode c++-mode)) (equal (point-min) (point-max)) (string-match ".*\\.hh?" (buffer-file-name)))
	      (insert-header-guard)
	      (goto-line 14)
	      (newline)
	      (goto-line 14)
	      )
	    (when (and (memq major-mode '(c-mode c++-mode)) (equal (point-min) (point-max)) (string-match ".*\\.cc?" (buffer-file-name)))
	      (insert-header-epitech)
	      (goto-line 11)
	      )
	    ))

(defun refresh-file ()
  (interactive)
  (revert-buffer t t t)
  (load-file "~/.emacs")
)

(put 'upcase-region 'disabled nil)

(add-to-list 'load-path "~/.elisp/tuareg-mode")
(autoload 'tuareg-mode "tuareg" "Major mode for editing Caml code" t)
(autoload 'camldebug "camldebug" "Run the Caml debugger" t)
(autoload 'tuareg-imenu-set-imenu "tuareg-imenu"
  "Configuration of imenu for tuareg" t)

(add-hook 'tuareg-mode-hook 'tuareg-imenu-set-imenu)

(setq auto-mode-alist
      (append '(("\\.ml[ily]?$" . tuareg-mode)
		("\\.topml$" . tuareg-mode))
	      auto-mode-alist))

;(require 'auto-complete-clang)
;(setq clang-completion-suppress-error 't)

;; auto-complete config stuff
;(setq ac-auto-start nil)
;(setq ac-expand-on-auto-complete nil)
;(setq ac-quick-help-delay 0.5)
;(define-key ac-mode-map [C-tab] 'auto-complete)

;; auto-complete-clang config stuff(defun my-ac-cc-mode-setup ()
;(setq ac-sources (append '(ac-source-clang) ac-sources)))
;(add-hook 'c-mode-common-hook 'my-ac-cc-mode-setup)
(put 'downcase-region 'disabled nil)

(add-hook 'python-mode-hook
	  (lambda ()
	    (setq indent-tabs-mode t)
	    (setq tab-width 2)
	    (setq python-indent 2)))

(global-linum-mode )
(setq linum-format "%d")
(setq linum-format "%4d \u2502 ")
(require 'whitespace)
(setq whitespace-line-column 80) ;; limit line length
(setq whitespace-style '(face lines-tail))
(add-hook 'prog-mode-hook 'whitespace-mode)
