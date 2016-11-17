(defun ask-user-about-supersession-threat (fn)
  "blatantly ignore files that changed on disk"
  )

(load "/home/pirez_l/.emacs.d/std.el")
(load "/home/pirez_l/.emacs.d/std_comment.el")
(load "/home/pirez_l/.emacs.d/php-mode.el")
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
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(inhibit-startup-screen t))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
(require 'package)
(package-initialize)
(setq package-archives '(("gnu" . "http://elpa.gnu.org/packages/")
			 ("marmalade" . "https://marmalade-repo.org/packages/")
			 ("melpa" . "http://melpa.org/packages/")))
