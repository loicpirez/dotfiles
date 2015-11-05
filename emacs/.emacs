(load-file "~/.emacs.d/std_comment.el")

;Affiche les espaces en fin de ligne
(setq-default show-trailing-whitespace t)

;Active l'affichage des colonnes dans la barre inférieur d'emacs
(column-number-mode t)

;Affiche la parenthèse associée à celle du curseur 
(show-paren-mode)

(menu-bar-mode -1)
;(scroll-bar-mode -1)
;(set-background-color "black")
(set-foreground-color "white")

;Affiche les numéros de lignes
(global-linum-mode )
(setq linum-format "%d")
(setq linum-format "%4d \u2502 ")

;; Interactively Do Things (highly recommended, but not strictly required)
;(require 'ido)
;(ido-mode t)

;(require 'rsense)
;(custom-set-variables
  ;; custom-set-variables was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
; '(safe-local-variable-values (quote ((encoding . utf-8)))))
;(custom-set-faces
  ;; custom-set-faces was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 ;)

(setq emacs-lisp-dir "~/.emacs.d/"
      my-elmode-dir (concat emacs-lisp-dir "elmodes/"))
(setq load-path
      (append load-path (list my-elmode-dir)))

(add-to-list 'load-path "~/.emacs.d/")

(load "std.el")
(load "std_comment.el")
(if (file-exists-p "~/.myemacs") 
    (load-file "~/.myemacs"))
(defadvice display-warning
    (around no-warn-.emacs.d-in-load-path (type message &rest unused) activate)
  "Ignore the warning about the `.emacs.d' directory being in `load-path'."
  (unless (and (eq type 'initialization)
	       (string-prefix-p "Your `load-path' seems to contain\nyour `.emacs.d' directory"
				message t))
    ad-do-it))
