#!/bin/bash
#Made by pierru_a
cd ~/.wm/wallpaper
while true
do
    feh --bg-fill $(ls | sort -R) --no-fehbg
    sleep 4m
done
